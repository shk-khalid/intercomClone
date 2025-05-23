export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface ChatHead {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: Date;
  // number of open chats for filter 1:
  openCount: number;
  // e.g. "Waiting longest", "Newest first", etc.
  sortLabel: string;
  // optional: number of minutes since last unread message
  unreadMinutes?: number;
  // e.g. "bg-blue-100 text-blue-700", "bg-red-100 text-red-700", etc.
  avatarBg: string;
}

export interface AdminUser {
  name: string;
  avatar: string;
  role: string;
}