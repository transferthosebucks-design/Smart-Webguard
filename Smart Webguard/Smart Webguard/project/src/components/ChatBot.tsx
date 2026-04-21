import React, { useState, useRef, useEffect } from 'react';
import { Shield, Send, ArrowLeft, Loader, Lightbulb, Copy, Check } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { getTranslator } from '../utils/hindiTranslator';
import { getVoiceAssistant } from '../utils/voiceAssistant';
import { generateSmartResponse, getFollowUpQuestions } from '../utils/advancedChatbot';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatBotProps {
  onBack: () => void;
  language: 'en' | 'hi';
  isDark: boolean;
  toggleTheme: () => void;
  onLanguageChange: (lang: 'en' | 'hi') => void;
}

interface ConversationContext {
  topics: Set<string>;
  previousQuestions: string[];
  userLevel: 'beginner' | 'intermediate' | 'advanced';
}

export const ChatBot: React.FC<ChatBotProps> = ({
  onBack,
  language,
  isDark,
  toggleTheme,
  onLanguageChange
}) => {
  const translator = getTranslator();
  const voiceAssistant = getVoiceAssistant();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: language === 'hi'
        ? 'नमस्ते! 👋 मैं आपका सुरक्षा सहायक हूं। मैं साइबर सुरक्षा, फिशिंग, मालवेयर, पासवर्ड सुरक्षा और बहुत कुछ के बारे में प्रश्नों का उत्तर दे सकता हूं। आप कुछ भी पूछ सकते हैं!'
        : 'Hello! 👋 I\'m your Security Assistant. I can answer questions about cybersecurity, phishing, malware, password protection, DDoS attacks, MFA, and much more. Feel free to ask anything!',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [context, setContext] = useState<ConversationContext>({
    topics: new Set(),
    previousQuestions: [],
    userLevel: 'beginner'
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    voiceAssistant.setLanguage(language);
  }, [language]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 800));

    const botResponseText = generateSmartResponse(currentInput, language, context);
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: botResponseText,
      sender: 'bot',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMessage]);
    setContext(prev => ({
      ...prev,
      previousQuestions: [...prev.previousQuestions, currentInput].slice(-5)
    }));
    setIsLoading(false);

    voiceAssistant.speak(botResponseText, false);
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-200 flex flex-col`}>
      {/* Header */}
      <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b shadow-sm`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <button
                onClick={onBack}
                className={`p-2 rounded-lg transition-colors ${
                  isDark
                    ? 'hover:bg-gray-700 text-gray-300'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <Shield className="h-8 w-8 text-red-600" />
              <div>
                <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {translator.translate('Security Assistant')}
                </h1>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {translator.translate('Ask the Bot')}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
              <LanguageToggle currentLanguage={language} onLanguageChange={onLanguageChange} />
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className={`flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 overflow-y-auto`}>
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="max-w-xs lg:max-w-md xl:max-w-lg">
                <div
                  className={`px-4 py-3 rounded-lg relative group ${
                    message.sender === 'user'
                      ? 'bg-red-600 text-white rounded-br-none'
                      : isDark
                      ? 'bg-gray-700 text-gray-100 rounded-bl-none'
                      : 'bg-gray-200 text-gray-900 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.text}
                  </p>
                  <div className="flex items-center justify-between mt-2 gap-2">
                    <p className={`text-xs ${
                      message.sender === 'user'
                        ? 'text-red-100'
                        : isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString(language === 'hi' ? 'hi-IN' : 'en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    {message.sender === 'bot' && (
                      <button
                        onClick={() => copyToClipboard(message.text, message.id)}
                        className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded ${
                          isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-300'
                        }`}
                        title={language === 'hi' ? 'कॉपी करें' : 'Copy'}
                      >
                        {copiedId === message.id ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg rounded-bl-none px-4 py-3`}>
                <div className="flex space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-gray-400' : 'bg-gray-600'} animate-bounce`}></div>
                  <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-gray-400' : 'bg-gray-600'} animate-bounce delay-100`}></div>
                  <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-gray-400' : 'bg-gray-600'} animate-bounce delay-200`}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {messages.length === 1 && (
          <div className={`mt-8 p-6 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-100/50'} border ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className={`h-5 w-5 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} />
              <h3 className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                {language === 'hi' ? 'आप पूछ सकते हैं:' : 'Quick Questions:'}
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {getFollowUpQuestions(language, context).slice(0, 4).map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickQuestion(question)}
                  className={`text-left p-3 rounded-lg transition-colors ${
                    isDark
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                      : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300'
                  }`}
                >
                  <p className="text-sm">{question}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-3">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={language === 'hi' ? 'अपना सवाल यहां लिखें...' : 'Ask your security question...'}
              className={`flex-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-500 resize-none max-h-24 ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              rows={1}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center space-x-2 font-medium"
            >
              {isLoading ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
          <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {language === 'hi' ? 'Shift + Enter से नई लाइन, Enter से संदेश भेजें' : 'Press Enter to send, Shift+Enter for new line'}
          </p>
        </div>
      </div>
    </div>
  );
};
