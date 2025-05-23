// src/components/ChatWidget.tsx
import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Zap,
  Download,
  MoreHorizontal,
  Send,
  ChevronDown,
  X,
} from 'lucide-react';
import { Message, ChatHead, AdminUser } from '../types';

interface ChatWidgetProps {
  activeChat: ChatHead;
  botResponses: string[];
  adminUser: AdminUser;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({
  activeChat,
  botResponses,
  adminUser,
}) => {
  const [isOpen, setIsOpen] = useState(false);         // controls showing the full chat
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [respIndex, setRespIndex] = useState(0);
  const endRef = useRef<HTMLDivElement>(null);

  // when chat opens, preload last message
  useEffect(() => {
    if (isOpen) {
      setMessages([
        {
          id: uuidv4(),
          text: activeChat.lastMessage,
          sender: 'bot',
          timestamp: activeChat.timestamp,
        },
      ]);
      setRespIndex(0);
    }
  }, [isOpen, activeChat]);

  // auto-scroll on new message/typing
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMsg = () => {
    if (!input.trim()) return;
    const userMsg: Message = {
      id: uuidv4(),
      text: input.trim(),
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botMsg: Message = {
        id: uuidv4(),
        text: botResponses[respIndex % botResponses.length],
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((m) => [...m, botMsg]);
      setRespIndex((i) => i + 1);
      setIsTyping(false);
    }, 1500);
  };

  // -- INITIAL PROMPT --
  if (!isOpen) {
    return (
      <div className="w-80 bg-white border rounded-md shadow-lg overflow-hidden">
        <div className="px-4 py-3 border-b text-center font-medium">
          Chat
        </div>
        <div className="p-6 text-center space-y-4">
          <p className="text-gray-700">Hi there! How can we help you today?</p>
          <button
            onClick={() => setIsOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Start chat
          </button>
        </div>
      </div>
    );
  }

  // -- FULL CHAT UI --
  return (
    <div className="flex flex-col h-[500px] w-80 bg-white border rounded-md shadow-lg overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <h2 className="text-sm font-semibold text-gray-900">{activeChat.name}</h2>
        <button
          onClick={() => setIsOpen(false)}
          className="px-2 py-1 text-sm text-gray-700 border rounded hover:bg-gray-100"
        >
          Close
        </button>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className="max-w-xs sm:max-w-sm">
                <div
                  className={`px-4 py-2 rounded-lg text-sm ${
                    isUser
                      ? 'bg-indigo-100 text-indigo-900'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {msg.text}
                </div>
                <div
                  className={`mt-1 text-xs text-gray-500 ${
                    isUser ? 'text-right' : 'text-left'
                  }`}
                >
                  Seen • 1min
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center space-x-2 text-gray-500 text-xs">
            <span className="animate-pulse">...</span>
            Typing...
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* FOOTER */}
      <div className="border-t bg-white">
        {/* Chat label */}
        <div className="flex items-center justify-between px-4 py-2 text-sm font-medium">
          <span>Chat</span>
          <ChevronDown className="w-4 h-4 text-gray-600" />
        </div>
        {/* Shortcut hint */}
        <div className="px-4 pb-2">
          <span className="text-xs text-gray-500">
            Use ⌘K for shortcuts
          </span>
        </div>
        {/* Icon row + input */}
        <div className="flex items-center px-4 pb-4 space-x-2">
          <button aria-label="Quick actions" className="p-2 rounded hover:bg-gray-100">
            <Zap className="w-5 h-5 text-gray-600" />
          </button>
          <button aria-label="Upload file" className="p-2 rounded hover:bg-gray-100">
            <Download className="w-5 h-5 text-gray-600" />
          </button>
          <button aria-label="More actions" className="p-2 rounded hover:bg-gray-100">
            <MoreHorizontal className="w-5 h-5 text-gray-600" />
          </button>
          <input
            type="text"
            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            placeholder=""
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMsg()}
          />
          <button
            onClick={sendMsg}
            disabled={!input.trim()}
            className="p-2 bg-indigo-600 rounded text-white hover:bg-indigo-700 disabled:opacity-50 transition"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWidget;
