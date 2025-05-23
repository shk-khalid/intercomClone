import React, { useState } from 'react';
import { Send, Zap, Download, MoreHorizontal } from 'lucide-react';
import { ChatHead } from '../types';

interface MainChatProps {
  activeChat: ChatHead;
  toggleCopilot: () => void;
}

const MainChat: React.FC<MainChatProps> = ({ activeChat, toggleCopilot }) => {
  const [input, setInput] = useState('');

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
        <div className="flex items-center">
          <h2 className="text-base font-medium">{activeChat.name}</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleCopilot}
            className="px-3 py-1 text-sm bg-black text-white rounded-md"
          >
            AI Copilot
          </button>
          <button className="text-gray-600">Details</button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex mb-4">
          <div className="flex-1 bg-blue-50 rounded-lg p-3">
            <p className="text-sm">I bought a product from your store in November as a Christmas gift for a member of my family. However, it turns out they have something very similar already. I was hoping you'd be able to refund me, as it is un-opened.</p>
          </div>
        </div>
        <div className="flex mb-4">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 mr-2"></div>
          <div className="flex-1 bg-gray-100 rounded-lg p-3">
            <p className="text-sm">Let me just look into this for you, Luis.</p>
            <p className="text-xs text-gray-500 mt-1">Seen • 1min</p>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-sm text-gray-600">Chat</span>
          <span className="text-xs text-gray-400">Use ⌘K for shortcuts</span>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Zap className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Download className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <MoreHorizontal className="w-5 h-5 text-gray-600" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder=""
          />
          <button 
            className="p-2 bg-gray-100 rounded-lg disabled:opacity-50"
            disabled={!input.trim()}
          >
            <Send className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default MainChat