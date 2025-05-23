import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MainChat from './components/MainChat';
import Copilot from './components/Copilot';
import { chatHeads } from './data/dummyData';
import './customStyles.css';

function App() {
  const [activeChatId, setActiveChatId] = useState(chatHeads[0].id);
  const [isCopilotOpen, setIsCopilotOpen] = useState(true);

  const activeChat = chatHeads.find(chat => chat.id === activeChatId);

  const toggleCopilot = () => setIsCopilotOpen(prev => !prev);

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-200 flex-shrink-0">
        <Sidebar 
          chatHeads={chatHeads}
          activeChatId={activeChatId}
          setActiveChatId={setActiveChatId}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex">
        <MainChat 
          activeChat={activeChat!}
          toggleCopilot={toggleCopilot}
        />

        {/* Copilot Panel */}
        {isCopilotOpen && (
          <div className="w-80 border-l border-gray-200">
            <Copilot onClose={toggleCopilot} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;