import { AdminUser, Message, ChatHead } from '../types';

export const chatHeads: ChatHead[] = [
  {
    id: '1',
    name: 'Lulu Collins',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
    lastMessage: 'Hi there, I have a question about...',
    unread: 2,
    timestamp: new Date(Date.now() - 1000000),
    online: true,
    messages: [
      {
        id: '1-1',
        text: 'Hi there, I have a question about your return policy.',
        sender: 'user',
        timestamp: new Date(Date.now() - 1000000)
      },
      {
        id: '1-2',
        text: 'Of course! I\'d be happy to help you with information about our return policy.',
        sender: 'bot',
        timestamp: new Date(Date.now() - 990000)
      }
    ]
  },
  {
    id: '2',
    name: 'Ivan - Nike',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
    lastMessage: 'All done, I have a qu...',
    unread: 1,
    timestamp: new Date(Date.now() - 2000000),
    messages: [
      {
        id: '2-1',
        text: 'Hello, I need help tracking my order #NK12345',
        sender: 'user',
        timestamp: new Date(Date.now() - 2000000)
      },
      {
        id: '2-2',
        text: 'I\'ll help you track your order. Let me check that for you.',
        sender: 'bot',
        timestamp: new Date(Date.now() - 1990000)
      }
    ]
  },
  {
    id: '3',
    name: 'Lead from New York',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
    lastMessage: 'Good morning, let me...',
    timestamp: new Date(Date.now() - 3000000),
    online: true,
    messages: [
      {
        id: '3-1',
        text: 'Good morning! I\'m interested in your premium package.',
        sender: 'user',
        timestamp: new Date(Date.now() - 3000000)
      },
      {
        id: '3-2',
        text: 'Great to hear that! Let me tell you about our premium features.',
        sender: 'bot',
        timestamp: new Date(Date.now() - 2990000)
      }
    ]
  }
];

export const adminUser: AdminUser = {
  name: 'Lula Easton',
  avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
  role: 'Support Agent'
};

export const botResponses: string[] = [
  "I understand your situation. Let me help you with that.",
  "Could you please provide more details?",
  "I'll check that information for you right away.",
  "Thank you for your patience. I'm processing your request.",
  "Is there anything else you need help with?"
];