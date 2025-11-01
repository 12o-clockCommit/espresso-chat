import path from 'path';
import dotenv from 'dotenv';

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import formatMessage from './utils/messages';
import {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} from './utils/users';
import { connectDB } from './config/database';
import Message from './models/Message';
import moment from 'moment';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// connect to mongodb
connectDB();

const PORT = process.env.PORT || 5001;
const app = express();
const httpServer = createServer(app);
/**
 * Socket.IO is restricted to only localhost:5177
 */
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5177', // Vite default port
    // origin: "*",
    methods: ['GET', 'POST'],
  },
});

const botName = 'Espresso Bot';

// Middleware
// This allows ALL origins to communicate with your Express server
app.use(cors());
/**
 * handle parsing request body
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * handle requests for static files
 */

// For express.static (this serves static files from the client folder)
app.use(express.static(path.resolve(__dirname, '../../client')));

// Basic route
app.get('/api', (req, res) => {
  res.json({ message: 'Chat API is running on ' + PORT });
});

// Socket.io connection listen to event connection
io.on('connection', (socket) => {
  console.log('connection: User connected:', socket.id);

  socket.on('joinRoom', async ({ username, room }) => {
    // validate input
    if (!username || !room) {
      socket.emit('error', { message: 'Username and room are required' });
      return;
    }

    const user = userJoin(socket.id, username, room);
    console.log('joinRoom: User joined room:', JSON.stringify(user));

    socket.join(user.room);

    // welcome message to user
    socket.emit('message', formatMessage(botName, 'Welcome to Espresso Chat!'));

    // load and send previous messages from database
    try {
      const messages = await Message.find({ roomId: user.room })
        .sort({ timestamp: -1 })
        .limit(50)
        .exec();

      // send messages in chronological order
      messages.reverse().forEach((msg) => {
        socket.emit('message', {
          username: msg.username,
          text: msg.text,
          time: moment(msg.timestamp).format('h:mm a'),
        });
      });
    } catch (error) {
      console.log('Error loading messages:', error);
    }

    // broadcast to room that user joined
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} has joined the chat.`)
      );

    // send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // listen for chatMessage
  socket.on('chatMessage', async (msg) => {
    const user = getCurrentUser(socket.id);

    if (!user) {
      console.log('chatMessage error: User not found');
      return;
    }

    console.log('chatMessage:', JSON.stringify(user));

    // save message to database
    try {
      const newMessage = new Message({
        roomId: user.room,
        username: user.username,
        text: msg,
      });
      await newMessage.save();
    } catch (error) {
      console.log('Error saving message:', error);
    }

    // emit message to all users in the room
    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  // runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      console.log('User disconnected:', JSON.stringify(user));

      // notify room that user left
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the chat.`)
      );

      // update user list for room
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
