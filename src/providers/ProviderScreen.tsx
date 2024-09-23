"use client";
import React, { useState } from 'react';
import { ContextScreen } from '../contexts/ContextScreen';

export const ProviderScreen = ({ children, actionsDB }: { children: React.ReactNode, actionsDB: Array<{id:number, name:string}>}) => {
  const [idScreen, setidScreen] = useState<number>(21);
  const [actions, setActions] = useState<Array<{id:number, name:string}>>(actionsDB);
  const [navBarType, setNavBarType] = useState('icon-bar')

  return (
    <ContextScreen.Provider value={{ idScreen, setidScreen, navBarType, setNavBarType, actions, setActions }}>
      {children}
    </ContextScreen.Provider>
  );
};
