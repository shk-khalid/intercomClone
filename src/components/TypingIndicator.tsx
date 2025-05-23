import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex mb-4">
      <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center mr-2">
        <span className="text-white text-sm font-medium">B</span>
      </div>
      <div className="bg-gray-100 text-gray-800 px-4 py-3 rounded-2xl rounded-tl-none">
        <div className="flex space-x-1">
          <div className="typing-dot"></div>
          <div className="typing-dot animation-delay-200"></div>
          <div className="typing-dot animation-delay-400"></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;