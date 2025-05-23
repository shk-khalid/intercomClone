import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2, Brain, MessageSquare, Zap, ArrowRight, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface CopilotMessage {
  id: string;
  text: string;
  type: 'user' | 'assistant';
  timestamp: Date;
  suggestions?: string[];
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface CopilotProps {
  onClose?: () => void;
  onSendMessage?: (message: string) => void;
}

const Copilot: React.FC<CopilotProps> = ({ onClose, onSendMessage }) => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<CopilotMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'chat' | 'insights'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'Analyze Sentiment',
      description: 'Get emotional insights from the conversation',
      icon: <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
    },
    {
      id: '2',
      title: 'Generate Summary',
      description: 'Create a brief overview of the chat',
      icon: <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
    },
    {
      id: '3',
      title: 'Suggest Responses',
      description: 'Get AI-powered response suggestions',
      icon: <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    if (onSendMessage) {
      onSendMessage(suggestion);
    }
  };

  const handleQuickAction = async (action: QuickAction) => {
    setIsLoading(true);
    const userMessage: CopilotMessage = {
      id: uuidv4(),
      text: `Can you ${action.title.toLowerCase()}?`,
      type: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1500));

    const aiResponses: Record<string, CopilotMessage> = {
      '1': {
        id: uuidv4(),
        text: "Based on my analysis, the conversation tone is mostly positive. The customer seems satisfied but has some concerns that need addressing.",
        type: 'assistant',
        timestamp: new Date(),
        suggestions: [
          "Would you like a detailed sentiment breakdown?",
          "Should I analyze specific parts of the conversation?",
          "Would you like to see customer satisfaction trends?"
        ]
      },
      '2': {
        id: uuidv4(),
        text: "Here's a quick summary: Customer inquired about a product return, expressed satisfaction with service quality, and requested shipping information.",
        type: 'assistant',
        timestamp: new Date(),
        suggestions: [
          "Generate a detailed report",
          "Focus on key action items",
          "Highlight important dates and numbers"
        ]
      },
      '3': {
        id: uuidv4(),
        text: "I suggest the following responses based on the conversation context:",
        type: 'assistant',
        timestamp: new Date(),
        suggestions: [
          "I understand your concern. Let me check the shipping status right away.",
          "Would you like me to explain our return policy in detail?",
          "Is there anything specific about the product you'd like to know?"
        ]
      }
    };

    setMessages(prev => [...prev, aiResponses[action.id]]);
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: CopilotMessage = {
      id: uuidv4(),
      text: inputValue,
      type: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    if (onSendMessage) {
      onSendMessage(inputValue);
    }
    
    setInputValue('');
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const aiResponse: CopilotMessage = {
        id: uuidv4(),
        text: "I've analyzed your request. Here's what I found:",
        type: 'assistant',
        timestamp: new Date(),
        suggestions: [
          "Would you like me to elaborate on any specific point?",
          "Should I provide more detailed analytics?",
          "Would you like to see related insights?"
        ]
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error getting AI response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="p-3 sm:p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center transform hover:rotate-12 transition-transform shadow-lg">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 text-sm sm:text-base">Pro AI Copilot</h2>
              <p className="text-xs sm:text-sm text-gray-500">Your intelligent assistant</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveCategory('chat')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeCategory === 'chat'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Chat
          </button>
          <button
            onClick={() => setActiveCategory('insights')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeCategory === 'insights'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Insights
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 sm:p-4 space-y-3 sm:space-y-4">
        {activeCategory === 'chat' ? (
          <>
            <div className="grid grid-cols-1 gap-2 sm:gap-3">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleQuickAction(action)}
                  className="p-3 sm:p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-2 sm:space-x-3 group"
                >
                  <div className="p-1.5 sm:p-2 bg-gray-50 rounded-lg group-hover:scale-110 transition-transform">
                    {action.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base">{action.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-500">{action.description}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </button>
              ))}
            </div>

            {messages.map((message) => (
              <div key={message.id}>
                <div className={`p-3 sm:p-4 rounded-xl ${
                  message.type === 'user'
                    ? 'bg-indigo-50 ml-4 sm:ml-8'
                    : 'bg-white shadow-sm mr-4 sm:mr-8'
                }`}>
                  <p className="text-xs sm:text-sm text-gray-700">{message.text}</p>
                  {message.suggestions && (
                    <div className="mt-2 sm:mt-3 space-y-1.5 sm:space-y-2">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="block w-full text-left p-2 text-xs sm:text-sm text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                  <p className="text-[10px] sm:text-xs text-gray-400 mt-1.5 sm:mt-2">
                    {new Intl.DateTimeFormat('en', {
                      hour: '2-digit',
                      minute: '2-digit'
                    }).format(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm">
            <h3 className="font-medium text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Conversation Insights</h3>
            <div className="space-y-2 sm:space-y-4">
              <div className="p-2 sm:p-3 bg-green-50 rounded-lg">
                <h4 className="text-xs sm:text-sm font-medium text-green-700">Positive Sentiment</h4>
                <p className="text-xs sm:text-sm text-green-600">Customer shows satisfaction with the service</p>
              </div>
              <div className="p-2 sm:p-3 bg-yellow-50 rounded-lg">
                <h4 className="text-xs sm:text-sm font-medium text-yellow-700">Key Topics</h4>
                <p className="text-xs sm:text-sm text-yellow-600">Product returns, shipping information, pricing</p>
              </div>
              <div className="p-2 sm:p-3 bg-blue-50 rounded-lg">
                <h4 className="text-xs sm:text-sm font-medium text-blue-700">Action Items</h4>
                <p className="text-xs sm:text-sm text-blue-600">Follow up on shipping status, send return label</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-3 sm:p-4 bg-white/80 backdrop-blur-sm border-t border-gray-200">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me about the conversation..."
            className="w-full p-3 sm:p-4 pr-12 bg-white rounded-xl shadow-sm input-focus-ring text-sm sm:text-base"
            disabled={isLoading}
          />
          <button 
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className={`absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${
              inputValue && !isLoading ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-400'
            }`}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Copilot;