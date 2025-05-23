import React, { useState, useRef, useEffect } from 'react';
import { Send, Zap, Download, MoreHorizontal, Menu, X } from 'lucide-react';
import { ChatHead, Message } from '../types';

interface MainChatProps {
  activeChat: ChatHead;
  toggleCopilot: () => void;
  toggleSidebar: () => void;
}

const MainChat: React.FC<MainChatProps> = ({ activeChat, toggleCopilot, toggleSidebar }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>(activeChat.messages || []);
  const [isTyping, setIsTyping] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(activeChat.messages || []);
  }, [activeChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: Date.now().toString(),
        text: 'Thank you for your message. I\'ll help you with that.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: 'Sent a file',
        sender: 'user',
        timestamp: new Date(),
        file: {
          name: file.name,
          url: URL.createObjectURL(file),
          type: file.type,
          size: file.size
        }
      };
      setMessages(prev => [...prev, newMessage]);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div 
      className="flex-1 flex flex-col"
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      {/* Drag overlay */}
      {dragActive && (
        <div className="absolute inset-0 bg-blue-500 bg-opacity-10 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <Download className="w-12 h-12 text-blue-500 mx-auto mb-2" />
            <p className="text-lg font-medium">Drop your file here</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <button 
            onClick={toggleSidebar}
            className="md:hidden p-1 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-base font-medium">{activeChat.name}</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleCopilot}
            className="px-3 py-1 text-sm bg-black text-white rounded-md whitespace-nowrap"
          >
            AI Copilot
          </button>
          <button className="text-gray-600 hidden sm:block">Details</button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex mb-4 ${message.sender === 'user' ? 'justify-end' : ''}`}>
            {message.sender === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 mr-2"></div>
            )}
            <div className={`flex-1 max-w-[80%] ${
              message.sender === 'user' ? 'bg-blue-50' : 'bg-gray-100'
            } rounded-lg p-3`}>
              <p className="text-sm">{message.text}</p>
              {message.file && (
                <div className="mt-2 p-2 bg-white rounded border border-gray-200">
                  <div className="flex items-center">
                    <Download className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600 truncate">{message.file.name}</span>
                  </div>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {new Intl.DateTimeFormat('en', {
                  hour: 'numeric',
                  minute: 'numeric'
                }).format(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex mb-4">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 mr-2"></div>
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-2 sm:p-4">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-sm text-gray-600">Chat</span>
          <span className="text-xs text-gray-400 hidden sm:inline">Use ⌘K for shortcuts</span>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg hidden sm:block">
            <Zap className="w-5 h-5 text-gray-600" />
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()} 
            className="p-2 hover:bg-gray-100 rounded-lg hidden sm:block"
          >
            <Download className="w-5 h-5 text-gray-600" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
          />
          <button className="p-2 hover:bg-gray-100 rounded-lg hidden sm:block">
            <MoreHorizontal className="w-5 h-5 text-gray-600" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
          />
          <button 
            onClick={handleSend}
            className="p-2 bg-gray-100 rounded-lg disabled:opacity-50 hover:bg-gray-200"
            disabled={!input.trim()}
          >
            <Send className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainChat;