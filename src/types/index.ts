export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'system';
  timestamp: Date;
  file?: {
    name: string;
    url: string;
    type: string;
    size: number;
  };
}

export interface ChatHead {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: Date;
  openCount: number;
  sortLabel: string;
  unreadMinutes?: number;
  avatarBg: string;
  messages: Message[];
  status?: 'open' | 'pending' | 'closed';
  unread?: boolean;
}

export interface AdminUser {
  name: string;
  avatar: string;
  role: string;
}

export interface CopilotMessage {
  id: string;
  text: string;
  type: 'user' | 'assistant' | 'system';
  timestamp: Date;
}

export interface SuggestedQuestion {
  id: string;
  text: string;
  category: string;
}

export interface QuickAction {
  id: string;
  text: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface ChatOption {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  action: () => void;
  shortcut?: string;
  divider?: boolean;
}

export type SortOption = 'newest' | 'oldest' | 'unread' | 'alphabetical';