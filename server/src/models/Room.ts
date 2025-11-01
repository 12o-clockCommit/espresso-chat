import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage {
  userId: string;
  username: string;
  content: string;
  timestamp: Date;
}

export interface IRoom extends Document {
  roomId: string;
  createdAt: Date;
  expiresAt?: Date;
  messages: IMessage[];
  activeUsers: string[];
}

const MessageSchema = new Schema({
  userId: String,
  username: String,
  content: String,
  timestamp: { type: Date, default: Date.now }
});

const RoomSchema = new Schema({
  roomId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
  },
  messages: [MessageSchema],
  activeUsers: [String]
});

// Auto-delete rooms after expiration
RoomSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IRoom>('Room', RoomSchema);