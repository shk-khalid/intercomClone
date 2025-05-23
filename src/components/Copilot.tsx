import React, { useState } from 'react';
import { X } from 'lucide-react';

interface CopilotProps {
  onClose?: () => void;
}

const Copilot: React.FC<CopilotProps> = ({ onClose }) => {
  const [input, setInput] = useState('');

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">AI</span>
            </div>
            <div>
              <h2 className="text-sm font-medium">Fin AI Copilot</h2>
              <p className="text-xs text-gray-500">Ask me anything about this conversation</p>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        <div className="text-center mt-32">
          <h3 className="text-lg font-medium mb-1">Hi, I'm Fin AI Copilot</h3>
          <p className="text-sm text-gray-600">Ask me anything about this conversation</p>
        </div>
      </div>

      {/* Suggested Questions */}
      <div className="p-4">
        <div className="bg-gray-50 p-3 rounded-lg mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xs font-medium">Suggested</span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-500">How do I get a refund?</span>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="w-full p-3 pr-8 border border-gray-200 rounded-lg"
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg className="w-4 h-4 text-gray-400 rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M22 2L11 13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 2L15 22L11 13L2 9L22 2Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}