interface User {
  id: string;
  username: string;
  room: string;
}

const users: User[] = [];

// Join user to chat
function userJoin(id: string, username: string, room: string): User {
  const user = { id, username, room };
  users.push(user);
  return user;
}

// Get current user
function getCurrentUser(id: string): User | undefined {
  return users.find((user) => user.id === id);
}

// User leaves chat
function userLeave(id: string): User | undefined {
  const index = users.findIndex((user) => user.id === id);

  // index === -1 when no users
  // if user is found then remove user
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
  return undefined;
}

// Get room users
function getRoomUsers(room: string): User[] {
  return users.filter((user) => user.room === room);
}

export { userJoin, getCurrentUser, userLeave, getRoomUsers };

