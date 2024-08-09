"use client";
import React, { useState } from 'react';
import { ContextScreen } from '../contexts/ContextScreen';

export const ProviderScreen = ({ children }: { children: React.ReactNode }) => {
  const [idScreen, setidScreen] = useState<number>(1);
  const [navBarType, setNavBarType] = useState('icon-bar')

  return (
    <ContextScreen.Provider value={{ idScreen, setidScreen, navBarType, setNavBarType }}>
      {children}
    </ContextScreen.Provider>
  );
};
