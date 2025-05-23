import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { ChatHead } from '../types';

interface SidebarProps {
  chatHeads: ChatHead[];
  activeChatId: string;
  setActiveChatId: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  chatHeads,
  activeChatId,
  setActiveChatId,
}) => {
  const [search, setSearch] = useState('');

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-lg font-medium mb-4">Your inbox</h1>
        <div className="flex space-x-2 mb-4">
          <select className="px-3 py-1 text-sm border border-gray-200 rounded-md bg-white">
            <option>5 Open</option>
          </select>
          <select className="px-3 py-1 text-sm border border-gray-200 rounded-md bg-white">
            <option>Waiting longest</option>
          </select>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {chatHeads.map((chat) => (
          <button
            key={chat.id}
            onClick={() => setActiveChatId(chat.id)}
            className={`w-full flex items-center p-4 hover:bg-gray-50 ${
              chat.id === activeChatId ? 'bg-gray-50' : ''
            }`}
          >
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-sm font-medium text-blue-800">
                {chat.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium truncate">{chat.name}</p>
                <span className="text-xs text-gray-500">44m</span>
              </div>
              <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}