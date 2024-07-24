"use client";
import { createContext, Dispatch, useContext } from 'react';

interface ContextScreenType {
  idScreen: number; 
  setidScreen: Dispatch<React.SetStateAction<number>>;
}

export const ContextScreen = createContext<ContextScreenType>({
  idScreen: 1,
  setidScreen: () => 1
});

export const useScreenContext = () => useContext(ContextScreen);