"use client";
import React, { useState } from 'react';
import { ContextScreen } from '../contexts/ContextScreen';

export const ProviderScreen = ({ children }: { children: React.ReactNode }) => {
  const [idScreen, setidScreen] = useState<number>(1);

  return (
    <ContextScreen.Provider value={{ idScreen, setidScreen }}>
      {children}
    </ContextScreen.Provider>
  );
};
