import React from 'react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(message.timestamp);

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2 sm:mb-4`}
    >
      <div className={`max-w-[85%] sm:max-w-[75%] ${isUser ? 'order-2' : 'order-1'}`}>
        <div
          className={`px-3 sm:px-4 py-2 sm:py-3 rounded-2xl ${
            isUser
              ? 'bg-indigo-600 text-white rounded-tr-none'
              : 'bg-gray-100 text-gray-800 rounded-tl-none'
          }`}
        >
          <p className="text-xs sm:text-sm">{message.text}</p>
        </div>
        <div
          className={`text-[10px] sm:text-xs text-gray-500 mt-1 ${
            isUser ? 'text-right' : 'text-left'
          }`}
        >
          {formattedTime}
        </div>
      </div>
      {!isUser && (
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-indigo-600 rounded-full flex items-center justify-center mr-2">
          <span className="text-white text-xs sm:text-sm font-medium">B</span>
        </div>
      )}
    </div>
  );
};

export default MessageBubble;