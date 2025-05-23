import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MainChat from './components/MainChat';
import Copilot from './components/Copilot';
import { chatHeads, botResponses } from './data/dummyData';
import './customStyles.css';

function App() {
  const [activeChatId, setActiveChatId] = useState(chatHeads[0].id);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  const activeChat = chatHeads.find(chat => chat.id === activeChatId);

  const toggleMobileSidebar = () => setIsMobileSidebarOpen(prev => !prev);
  const toggleCopilot = () => setIsCopilotOpen(prev => !prev);

  const handleCopilotMessage = (message: string) => {
    if (activeChat) {
      const mainChatRef = document.querySelector('form[data-chat-input]');
      const input = mainChatRef?.querySelector('input') as HTMLInputElement;
      if (input) {
        input.value = message;
        input.focus();
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:relative md:w-80 w-[85%] h-full bg-white z-50 transition-all duration-300 ease-in-out transform
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${isCopilotOpen ? 'md:w-72 lg:w-80' : 'md:w-80 lg:w-96'}
      `}>
        <Sidebar 
          chatHeads={chatHeads}
          activeChatId={activeChatId}
          setActiveChatId={(id) => {
            setActiveChatId(id);
            setIsMobileSidebarOpen(false);
          }}
        />
      </div>

      {/* Main content */}
      <main className="flex-1 flex overflow-hidden">
        <MainChat 
          activeChat={activeChat!}
          botResponses={botResponses}
          toggleSidebar={toggleMobileSidebar}
          toggleCopilot={toggleCopilot}
        />

        {/* Copilot panel */}
        <div className={`
          fixed md:relative md:w-80 w-[85%] h-full bg-white z-50 transition-all duration-300 ease-in-out transform
          ${isCopilotOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
          right-0
        `}>
          <Copilot onClose={toggleCopilot} onSendMessage={handleCopilotMessage} />
        </div>
      </main>
    </div>
  );
}

export default App;