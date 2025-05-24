import React, { useState, useMemo } from 'react';
import { Search, LayoutGrid, LayoutList } from 'lucide-react';
import { ChatHead, SortOption } from '../types';

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
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [isGridView, setIsGridView] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredAndSortedChats = useMemo(() => {
    let filtered = chatHeads.filter(chat => {
      const matchesSearch = chat.name.toLowerCase().includes(search.toLowerCase()) ||
        chat.lastMessage?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || chat.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.timestamp.getTime() - a.timestamp.getTime();
        case 'oldest':
          return a.timestamp.getTime() - b.timestamp.getTime();
        case 'unread':
          return (b.unread ? 1 : 0) - (a.unread ? 1 : 0);
        case 'alphabetical':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }, [chatHeads, search, sortBy, statusFilter]);

  const openChatsCount = chatHeads.filter(chat => chat.status === 'open').length;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Fixed header section */}
      <div className="flex-none p-3 sm:p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h1 className="text-lg font-medium text-gray-900">Your inbox</h1>
          <button
            onClick={() => setIsGridView(!isGridView)}
            className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="Toggle layout"
          >
            {isGridView ? (
              <LayoutGrid className="w-4 h-4 text-gray-600" />
            ) : (
              <LayoutList className="w-4 h-4 text-gray-600" />
            )}
          </button>
        </div>
        
        {/* Filters row with improved responsive layout */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-3">
          <select
            className="flex-1 px-2 sm:px-3 py-1.5 text-xs sm:text-sm border border-gray-200 rounded-md bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All ({chatHeads.length})</option>
            <option value="open">Open ({openChatsCount})</option>
            <option value="pending">Pending</option>
            <option value="closed">Closed</option>
          </select>
          
          <select
            className="flex-1 px-2 sm:px-3 py-1.5 text-xs sm:text-sm border border-gray-200 rounded-md bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="unread">Unread first</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
        </div>

        {/* Search input with improved styling */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Scrollable chat list with improved grid/list handling */}
      <div 
        className={`flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent ${
          isGridView 
            ? 'p-2 grid grid-cols-1 sm:grid-cols-2 gap-2 auto-rows-max' 
            : 'divide-y divide-gray-100'
        }`}
      >
        {filteredAndSortedChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <p className="text-gray-500 text-sm">No conversations found</p>
            <p className="text-gray-400 text-xs mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          filteredAndSortedChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setActiveChatId(chat.id)}
              className={`w-full transition-all duration-200 ${
                isGridView 
                  ? 'p-3 border rounded-lg hover:shadow-md bg-white'
                  : 'flex items-center p-3 sm:p-4 hover:bg-gray-50'
              } ${chat.id === activeChatId ? 'bg-blue-50 border-blue-100' : ''}`}
            >
              <div 
                className={`w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isGridView ? 'mx-auto mb-2' : 'mr-3'
                }`}
              >
                <span className="text-sm font-medium text-blue-800">
                  {chat.name.charAt(0)}
                </span>
              </div>
              <div className={`min-w-0 ${isGridView ? 'text-center' : 'flex-1'}`}>
                <div className={`flex items-center justify-between ${isGridView ? 'flex-col space-y-1' : 'space-x-2'}`}>
                  <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                    {chat.name}
                  </p>
                  <span className="text-xs text-gray-500 flex-shrink-0">
                    {new Date(chat.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 truncate mt-0.5">
                  {chat.lastMessage}
                </p>
                {chat.unread && (
                  <span className="inline-block px-1.5 py-0.5 bg-blue-500 text-white text-xs rounded-full mt-1">
                    New
                  </span>
                )}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

export default Sidebar;