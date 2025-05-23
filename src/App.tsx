import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MainChat from './components/MainChat';
import Copilot from './components/Copilot';
import { chatHeads } from './data/dummyData';
import './customStyles.css';

function App() {
  const [activeChatId, setActiveChatId] = useState(chatHeads[0].id);
  const [isCopilotOpen, setIsCopilotOpen] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const activeChat = chatHeads.find(chat => chat.id === activeChatId);

  const toggleCopilot = () => setIsCopilotOpen(prev => !prev);
  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  return (
    <div className="flex h-screen bg-white">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:relative w-64 h-full bg-white border-r border-gray-200 z-30
        transform transition-transform duration-200 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <Sidebar 
          chatHeads={chatHeads}
          activeChatId={activeChatId}
          setActiveChatId={(id) => {
            setActiveChatId(id);
            setIsSidebarOpen(false);
          }}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex">
        <MainChat 
          activeChat={activeChat!}
          toggleCopilot={toggleCopilot}
          toggleSidebar={toggleSidebar}
        />

        {/* Copilot Panel */}
        <div className={`
          fixed md:relative w-80 h-full bg-white border-l border-gray-200 z-30
          transform transition-transform duration-200 ease-in-out
          ${isCopilotOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
          right-0
        `}>
          <Copilot onClose={toggleCopilot} />
        </div>
      </div>
    </div>
  );
}

export default App;