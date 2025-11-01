import { Router } from 'express';
import { createRoom, getRoomInfo, getRoomMessages } from '../controllers/roomController';

const router = Router();

// POST /api/rooms/create - Create a new anonymous room
router.post('/create', createRoom);

// GET /api/rooms/:roomId - Get room info
router.get('/:roomId', getRoomInfo);

// GET /api/rooms/:roomId/messages - Get room messages
router.get('/:roomId/messages', getRoomMessages);

export default router;