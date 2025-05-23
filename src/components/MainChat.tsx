import React, { useState, useRef, useEffect } from 'react';
import { Send, Zap, Download, MoreHorizontal, Menu, MessageSquare, FileText, Search, ArrowRight, Trash2, Copy, Settings, Save, AlertTriangle } from 'lucide-react';
import { ChatHead, Message, QuickAction, ChatOption } from '../types';

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
  const [zapMenuOpen, setZapMenuOpen] = useState(false);
  const [optionsMenuOpen, setOptionsMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const zapMenuRef = useRef<HTMLDivElement>(null);
  const optionsMenuRef = useRef<HTMLDivElement>(null);

  const quickActions: QuickAction[] = [
    { id: '1', text: 'Tell me more about your product', icon: MessageSquare },
    { id: '2', text: 'I need help with troubleshooting', icon: Search },
    { id: '3', text: 'Can you provide documentation?', icon: FileText },
    { id: '4', text: 'Schedule a demo', icon: ArrowRight },
    { id: '5', text: 'What are your pricing options?', icon: MessageSquare },
  ];

  const chatOptions: ChatOption[] = [
    { 
      id: 'copy', 
      label: 'Copy last message', 
      icon: Copy, 
      action: () => {
        if (messages.length > 0) {
          navigator.clipboard.writeText(messages[messages.length - 1].text);
        }
      },
      shortcut: '⌘C'
    },
    { 
      id: 'save', 
      label: 'Save chat transcript', 
      icon: Save, 
      action: () => {
        const chatText = messages.map(m => 
          `[${m.timestamp.toLocaleTimeString()}] ${m.sender === 'user' ? 'You' : 'Bot'}: ${m.text}`
        ).join('\n');
        
        const blob = new Blob([chatText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-${new Date().toISOString().slice(0, 10)}.txt`;
        a.click();
      },
      shortcut: '⌘S'
    },
    { 
      id: 'clear', 
      label: 'Clear conversation', 
      icon: Trash2, 
      action: () => setMessages([]),
      divider: true
    },
    { 
      id: 'settings', 
      label: 'Chat settings', 
      icon: Settings, 
      action: () => console.log('Chat settings'),
    },
    { 
      id: 'report', 
      label: 'Report issue', 
      icon: AlertTriangle, 
      action: () => console.log('Report issue'),
      divider: true
    },
  ];

  useEffect(() => {
    setMessages(activeChat.messages || []);
  }, [activeChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent shortcuts when typing in input
      if (document.activeElement?.tagName === 'INPUT') {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleSend();
        }
        return;
      }

      // Global shortcuts
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case 'k':
            e.preventDefault();
            setZapMenuOpen(true);
            setOptionsMenuOpen(false);
            break;
          case 'c':
            e.preventDefault();
            if (messages.length > 0) {
              navigator.clipboard.writeText(messages[messages.length - 1].text);
            }
            break;
          case 's':
            e.preventDefault();
            const option = chatOptions.find(opt => opt.id === 'save');
            option?.action();
            break;
          case '/':
            e.preventDefault();
            inputRef.current?.focus();
            break;
        }
      } else {
        switch (e.key) {
          case 'Escape':
            setZapMenuOpen(false);
            setOptionsMenuOpen(false);
            break;
          case '/':
            if (!document.activeElement?.tagName.match(/input|textarea/i)) {
              e.preventDefault();
              inputRef.current?.focus();
            }
            break;
        }
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (zapMenuRef.current && !zapMenuRef.current.contains(e.target as Node)) {
        setZapMenuOpen(false);
      }
      if (optionsMenuRef.current && !optionsMenuRef.current.contains(e.target as Node)) {
        setOptionsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
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

  const handleQuickAction = (action: QuickAction) => {
    setInput(action.text);
    setZapMenuOpen(false);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleChatOption = (option: ChatOption) => {
    option.action();
    setOptionsMenuOpen(false);
  };

  return (
    <div 
      className="flex-1 flex flex-col relative"
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      {dragActive && (
        <div className="absolute inset-0 bg-blue-500 bg-opacity-10 flex items-center justify-center z-50 transition-opacity duration-200">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center animate-pulse">
            <Download className="w-12 h-12 text-blue-500 mx-auto mb-2" />
            <p className="text-lg font-medium">Drop your file here</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <button 
            onClick={toggleSidebar}
            className="md:hidden p-1 hover:bg-gray-100 rounded-lg transition-colors duration-150"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-base font-medium">{activeChat.name}</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleCopilot}
            className="px-3 py-1 text-sm bg-black text-white rounded-md whitespace-nowrap hover:bg-gray-800 transition-colors duration-150"
          >
            AI Copilot
          </button>
          <button className="text-gray-600 hidden sm:block hover:text-gray-800 transition-colors duration-150">
            Details
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 sm:p-4 bg-gray-50">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex mb-4 ${message.sender === 'user' ? 'justify-end' : ''} animate-fadeIn`}
          >
            {message.sender === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 mr-2 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-gray-500" />
              </div>
            )}
            <div 
              className={`flex-1 max-w-[80%] ${
                message.sender === 'user' ? 'bg-blue-50 border-blue-100' : 'bg-white border-gray-100'
              } rounded-lg p-3 border shadow-sm transition-all duration-200 hover:shadow-md`}
            >
              <p className="text-sm">{message.text}</p>
              {message.file && (
                <div className="mt-2 p-2 bg-white rounded border border-gray-200 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex items-center">
                    <Download className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600 truncate flex-1">{message.file.name}</span>
                    <button className="text-blue-500 text-xs hover:text-blue-700 transition-colors duration-150">
                      Download
                    </button>
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
          <div className="flex mb-4 animate-fadeIn">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 mr-2 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-gray-500" />
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm">
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

      <div className="border-t border-gray-200 p-2 sm:p-4 bg-white">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-sm text-gray-600 font-medium">Chat</span>
          <span className="text-xs text-gray-400 hidden sm:inline">Use ⌘K for shortcuts</span>
        </div>
        <div className="flex items-center space-x-2 relative">
          <button 
            className={`p-2 rounded-lg transition-colors duration-150 ${
              zapMenuOpen ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-600'
            }`}
            onClick={() => setZapMenuOpen(!zapMenuOpen)}
            aria-label="Quick actions"
          >
            <Zap className="w-5 h-5" />
          </button>
          
          <button 
            onClick={() => fileInputRef.current?.click()} 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-150 text-gray-600 hover:text-gray-800"
            aria-label="Upload file"
          >
            <Download className="w-5 h-5" />
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
          />
          
          <button 
            className={`p-2 rounded-lg transition-colors duration-150 ${
              optionsMenuOpen ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-600'
            }`}
            onClick={() => setOptionsMenuOpen(!optionsMenuOpen)}
            aria-label="More options"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
          
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            placeholder="Type your message... (Press / to focus)"
          />
          
          <button 
            onClick={handleSend}
            className={`p-2 rounded-lg transition-all duration-200 ${
              input.trim() 
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            disabled={!input.trim()}
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>

          {zapMenuOpen && (
            <div 
              ref={zapMenuRef}
              className="absolute bottom-16 left-2 sm:left-14 bg-white shadow-lg rounded-lg p-2 w-80 z-10 border border-gray-200 transition-all duration-200 ease-in-out"
            >
              <div className="p-2">
                <h3 className="text-sm font-medium text-gray-700 flex items-center mb-2">
                  <Zap className="w-4 h-4 mr-2 text-blue-500" />
                  Quick actions
                </h3>
                <div className="space-y-1">
                  {quickActions.map((action) => (
                    <button
                      key={action.id}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md flex items-center"
                      onClick={() => handleQuickAction(action)}
                    >
                      {action.icon && <action.icon className="w-4 h-4 mr-2 text-gray-500" />}
                      <span>{action.text}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="px-2 py-1 border-t border-gray-100 text-xs text-gray-500">
                Press ESC to close
              </div>
            </div>
          )}

          {optionsMenuOpen && (
            <div 
              ref={optionsMenuRef}
              className="absolute bottom-16 right-2 sm:right-14 bg-white shadow-lg rounded-lg p-2 w-64 z-10 border border-gray-200 transition-all duration-200 ease-in-out"
            >
              <div className="p-1">
                <div className="flex items-center justify-between mb-2 px-2">
                  <h3 className="text-sm font-medium text-gray-700">Options</h3>
                  <MoreHorizontal className="w-4 h-4 text-gray-500" />
                </div>
                <div className="space-y-0.5">
                  {chatOptions.map((option) => (
                    <React.Fragment key={option.id}>
                      <button
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md flex items-center justify-between group"
                        onClick={() => handleChatOption(option)}
                      >
                        <span className="flex items-center">
                          {option.icon && <option.icon className="w-4 h-4 mr-2 text-gray-500 group-hover:text-gray-700" />}
                          <span>{option.label}</span>
                        </span>
                        {option.shortcut && (
                          <span className="text-xs text-gray-400 group-hover:text-gray-600">{option.shortcut}</span>
                        )}
                      </button>
                      {option.divider && <div className="border-b border-gray-100 my-1"></div>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainChat;