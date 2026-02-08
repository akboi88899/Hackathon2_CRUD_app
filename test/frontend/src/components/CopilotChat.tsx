'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { sendChatMessage, clearChatHistory } from '@/lib/chat';
import { MessageSquare, Send, X, Loader2, Trash2, Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
}

export function CopilotChat() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    setMounted(true);
    
    // Check if Web Speech API is supported
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      console.log('[Voice Debug] Checking Web Speech API support...');
      console.log('[Voice Debug] SpeechRecognition available:', !!SpeechRecognition);
      console.log('[Voice Debug] window.SpeechRecognition:', !!(window as any).SpeechRecognition);
      console.log('[Voice Debug] window.webkitSpeechRecognition:', !!(window as any).webkitSpeechRecognition);
      
      if (SpeechRecognition) {
        console.log('[Voice Debug] ✅ Web Speech API is SUPPORTED - initializing...');
        setVoiceSupported(true);
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US'; // Default to English, can detect Urdu too
        
        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          console.log('[Voice Debug] Transcription result:', transcript);
          setInput(transcript);
          setIsListening(false);
        };
        
        recognitionRef.current.onerror = (event: any) => {
          console.error('[Voice Debug] Speech recognition error:', event.error);
          setIsListening(false);
          setError('Voice recognition failed. Please try again.');
        };
        
        recognitionRef.current.onend = () => {
          console.log('[Voice Debug] Recognition ended');
          setIsListening(false);
        };
        
        console.log('[Voice Debug] Recognition initialized successfully');
      } else {
        console.log('[Voice Debug] ❌ Web Speech API NOT supported in this browser');
        console.log('[Voice Debug] Browser:', navigator.userAgent);
      }
    } else {
      console.log('[Voice Debug] ⚠️ Running in server-side context (window undefined)');
    }
    
    // Load chat history from sessionStorage
    const savedHistory = sessionStorage.getItem('chat_history');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setMessages(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
      } catch (e) {
        console.error('Failed to load chat history:', e);
      }
    }
  }, []);

  useEffect(() => {
    // Save chat history to sessionStorage
    if (messages.length > 0) {
      sessionStorage.setItem('chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Focus input when chat opens
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || !user || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const chatHistory = messages.map(m => ({
        role: m.role,
        content: m.content,
      }));

      const response = await sendChatMessage(userMessage.content, user.id, chatHistory);

      if (response.success) {
        const agentMessage: Message = {
          role: 'agent',
          content: response.response,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, agentMessage]);
      } else {
        throw new Error('Agent returned unsuccessful response');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
      // Remove the user message if the request failed
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearHistory = async () => {
    if (!user) return;
    
    try {
      await clearChatHistory(user.id);
      setMessages([]);
      sessionStorage.removeItem('chat_history');
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to clear history');
    }
  };

  const toggleVoiceRecognition = () => {
    console.log('[Voice Debug] toggleVoiceRecognition called');
    console.log('[Voice Debug] recognitionRef.current:', !!recognitionRef.current);
    console.log('[Voice Debug] isListening:', isListening);
    
    if (!recognitionRef.current) {
      console.error('[Voice Debug] ❌ Recognition not initialized');
      return;
    }

    if (isListening) {
      console.log('[Voice Debug] Stopping recognition...');
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        console.log('[Voice Debug] Starting recognition...');
        recognitionRef.current.start();
        setIsListening(true);
        setError(null);
        console.log('[Voice Debug] ✅ Recognition started successfully');
      } catch (err) {
        console.error('[Voice Debug] ❌ Failed to start voice recognition:', err);
        setError('Failed to start voice recognition. Please check microphone permissions.');
      }
    }
  };

  if (!mounted || !user) {
    return null;
  }

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 bg-gradient-to-br from-primary to-secondary p-4 rounded-full shadow-2xl shadow-primary/50 hover:shadow-primary/70 transition-all duration-300"
            aria-label="Open AI Assistant"
          >
            <MessageSquare className="w-6 h-6 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-secondary p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-white" />
                <h3 className="text-white font-semibold">TaskMaster AI</h3>
              </div>
              <div className="flex items-center gap-2">
                {messages.length > 0 && (
                  <button
                    onClick={handleClearHistory}
                    className="text-white/80 hover:text-white transition-colors"
                    title="Clear chat history"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-slate-400 mt-8">
                  <p className="text-sm">
                    Hi! I'm your TaskMaster AI assistant.
                  </p>
                  <p className="text-sm mt-2">
                    I can help you manage your tasks, answer questions, and more.
                  </p>
                  <p className="text-sm mt-2">
                    How can I assist you today?
                  </p>
                </div>
              )}

              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-primary to-secondary text-white'
                        : 'bg-slate-800 text-slate-200'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                    <p className="text-xs opacity-60 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-slate-800 rounded-2xl px-4 py-2">
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-red-500/10 border border-red-500/20 rounded-lg p-3"
                >
                  <p className="text-sm text-red-400">{error}</p>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-800">
              {/* Debug info - remove after testing */}
              <div className="text-xs text-slate-500 mb-2">
                Voice Support: {voiceSupported ? '✅ Enabled' : '❌ Not Available'} | Check browser console for details
              </div>
              <div className="flex items-end gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isListening ? "Listening..." : "Ask me anything..."}
                  disabled={isLoading || isListening}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {voiceSupported && (
                  <button
                    onClick={toggleVoiceRecognition}
                    disabled={isLoading}
                    className={`p-2 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                      isListening
                        ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                        : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                    title={isListening ? "Stop listening" : "Start voice input"}
                  >
                    {isListening ? (
                      <MicOff className="w-5 h-5 text-white" />
                    ) : (
                      <Mic className="w-5 h-5 text-white" />
                    )}
                  </button>
                )}
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="bg-gradient-to-br from-primary to-secondary p-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
