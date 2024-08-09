"use client";
import { createContext, Dispatch, useContext } from 'react';

interface ContextScreenType {
  idScreen: number; 
  setidScreen: Dispatch<React.SetStateAction<number>>;
  navBarType:string;
  setNavBarType: Dispatch<React.SetStateAction<string>>;
}

export const ContextScreen = createContext<ContextScreenType>({
  idScreen: 1,
  setidScreen: () => 1,
  navBarType: '',
  setNavBarType: () => ''
});

export const useScreenContext = () => useContext(ContextScreen);