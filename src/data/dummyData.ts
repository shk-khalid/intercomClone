import { ChatHead, AdminUser } from '../types';

export const chatHeads: ChatHead[] = [
  {
    id: '1',
    name: 'Luis - Github',
    lastMessage: 'I bought a product from your store in November as a Christmas gift for a member of my family. However, it turns out they have something very similar already. I was hoping you\'d be able to refund me, as it is un-opened.',
    timestamp: new Date(Date.now() - 45 * 60000),
    openCount: 5,
    sortLabel: 'Waiting longest',
    unreadMinutes: 45,
    avatarBg: 'bg-blue-100 text-blue-700',
    messages: [
      {
        id: '1-1',
        text: 'I bought a product from your store in November as a Christmas gift for a member of my family. However, it turns out they have something very similar already. I was hoping you\'d be able to refund me, as it is un-opened.',
        sender: 'user',
        timestamp: new Date(Date.now() - 45 * 60000)
      },
      {
        id: '1-2',
        text: 'Let me just look into this for you, Luis.',
        sender: 'bot',
        timestamp: new Date(Date.now() - 44 * 60000)
      }
    ]
  },
  {
    id: '2',
    name: 'Ivan - Nike',
    lastMessage: 'Hi there, I have a question...',
    timestamp: new Date(Date.now() - 30 * 60000),
    openCount: 5,
    sortLabel: 'Waiting longest',
    unreadMinutes: 30,
    avatarBg: 'bg-green-100 text-green-700',
    messages: []
  },
  {
    id: '3',
    name: 'Lead from New York',
    lastMessage: 'Good morning, let me...',
    timestamp: new Date(Date.now() - 40 * 60000),
    openCount: 5,
    sortLabel: 'Waiting longest',
    avatarBg: 'bg-purple-100 text-purple-700',
    messages: []
  },
  {
    id: '4',
    name: 'Booking API problems',
    lastMessage: 'Bug report',
    timestamp: new Date(Date.now() - 44 * 60000),
    openCount: 5,
    sortLabel: 'Waiting longest',
    avatarBg: 'bg-red-100 text-red-700',
    messages: []
  },
  {
    id: '5',
    name: 'Miracle - Exemplary Bank',
    lastMessage: 'Hey there, I\'m here to...',
    timestamp: new Date(Date.now() - 44 * 60000),
    openCount: 5,
    sortLabel: 'Waiting longest',
    avatarBg: 'bg-yellow-100 text-yellow-700',
    messages: []
  }
];

export const adminUser: AdminUser = {
  name: 'Luis Easton',
  avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
  role: 'Support Agent'
};