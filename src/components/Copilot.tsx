import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, MessageSquare } from 'lucide-react';
import { CopilotMessage, SuggestedQuestion } from '../types';

interface CopilotProps {
  onClose?: () => void;
  onUseSuggestion?: (text: string) => void;
}

const Copilot: React.FC<CopilotProps> = ({ onClose, onUseSuggestion }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<CopilotMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestedQuestions: SuggestedQuestion[] = [
    { id: '1', text: 'How do I get a refund?', category: 'Billing' },
    { id: '2', text: 'What are your business hours?', category: 'General' },
    { id: '3', text: 'Can you explain your pricing?', category: 'Pricing' },
    { id: '4', text: 'How do I contact support?', category: 'Support' },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
      if (e.metaKey && e.key === '/') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: CopilotMessage = {
      id: Date.now().toString(),
      text: input,
      type: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: CopilotMessage = {
        id: Date.now().toString(),
        text: `I'll help you with "${input}". This is a simulated response.`,
        type: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSuggestedQuestion = (question: SuggestedQuestion) => {
    setInput(question.text);
    inputRef.current?.focus();
  };

  const handleUseResponse = (text: string) => {
    if (onUseSuggestion) {
      onUseSuggestion(text);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="p-3 sm:p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-medium">Fin AI Copilot</h2>
              <p className="text-xs text-gray-500">Ask me anything about this conversation</p>
            </div>
          </div>
          {onClose && (
            <button 
              onClick={onClose} 
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors duration-150"
              aria-label="Close copilot"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4">
        {messages.length === 0 ? (
          <div className="text-center mt-32">
            <Sparkles className="w-8 h-8 text-blue-500 mx-auto mb-3" />
            <h3 className="text-lg font-medium mb-1">Hi, I'm Fin AI Copilot</h3>
            <p className="text-sm text-gray-600">Ask me anything about this conversation</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 relative group ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  {message.type === 'assistant' && (
                    <button
                      onClick={() => handleUseResponse(message.text)}
                      className="absolute -left-16 top-1/2 -translate-y-1/2 p-2 bg-white rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      title="Use this response"
                    >
                      <MessageSquare className="w-4 h-4 text-blue-500" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex">
                <div className="bg-white border border-gray-200 rounded-lg p-3">
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
        )}
      </div>

      {/* Suggested Questions */}
      {messages.length === 0 && (
        <div className="p-3 sm:p-4 border-t border-gray-100">
          <div className="bg-gray-50 p-3 rounded-lg space-y-2">
            <h4 className="text-xs font-medium text-gray-700">Suggested questions</h4>
            <div className="space-y-1">
              {suggestedQuestions.map((question) => (
                <button
                  key={question.id}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="w-full text-left p-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors duration-150 flex items-center space-x-2"
                >
                  <MessageSquare className="w-4 h-4 text-gray-400" />
                  <span>{question.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-3 sm:p-4 border-t border-gray-200">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question... (⌘/ to focus)"
            className="w-full p-3 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded transition-colors duration-200 ${
              input.trim()
                ? 'text-blue-500 hover:text-blue-600'
                : 'text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Copilot;