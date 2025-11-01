import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  roomId: string;
  username: string;
  text: string;
  timestamp: Date;
}

const MessageSchema: Schema = new Schema({
  roomId: {
    type: String,
    required: true,
    index: true, // index for faster queries
  },
  username: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IMessage>('Message', MessageSchema);

