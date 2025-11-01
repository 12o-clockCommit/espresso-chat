import { Request, Response } from 'express';
import { nanoid } from 'nanoid';
import Room from '../models/Room';

// Create a new anonymous room
export const createRoom = async (req: Request, res: Response) => {
  try {
    // Generate unique room ID (8 characters, URL-safe)
    const roomId = nanoid(8);

    // Create new room in database
    const newRoom = new Room({
      roomId,
      messages: [],
      activeUsers: []
    });

    await newRoom.save();

    res.status(201).json({
      success: true,
      roomId,
      message: 'Room created successfully'
    });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create room'
    });
  }
};

// Get room info (check if room exists)
export const getRoomInfo = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    res.status(200).json({
      success: true,
      room: {
        roomId: room.roomId,
        createdAt: room.createdAt,
        activeUsers: room.activeUsers.length,
        messageCount: room.messages.length
      }
    });
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch room info'
    });
  }
};

// Get room messages
export const getRoomMessages = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    res.status(200).json({
      success: true,
      messages: room.messages
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages'
    });
  }
};