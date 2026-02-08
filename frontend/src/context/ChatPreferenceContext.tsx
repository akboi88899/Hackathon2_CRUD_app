'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type ChatType = 'custom' | 'default';

interface ChatPreferenceContextType {
  chatType: ChatType;
  setChatType: (type: ChatType) => void;
}

const ChatPreferenceContext = createContext<ChatPreferenceContextType | undefined>(undefined);

export function ChatPreferenceProvider({ children }: { children: React.ReactNode }) {
  const [chatType, setChatTypeState] = useState<ChatType>('custom');

  useEffect(() => {
    // Load preference from localStorage
    const stored = localStorage.getItem('chatPreference');
    if (stored === 'custom' || stored === 'default') {
      setChatTypeState(stored);
    }
  }, []);

  const setChatType = (type: ChatType) => {
    setChatTypeState(type);
    localStorage.setItem('chatPreference', type);
  };

  return (
    <ChatPreferenceContext.Provider value={{ chatType, setChatType }}>
      {children}
    </ChatPreferenceContext.Provider>
  );
}

export function useChatPreference() {
  const context = useContext(ChatPreferenceContext);
  if (context === undefined) {
    throw new Error('useChatPreference must be used within a ChatPreferenceProvider');
  }
  return context;
}
