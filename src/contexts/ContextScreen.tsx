"use client";
import { createContext, Dispatch, useContext } from 'react';

interface ContextScreenType {
  idScreen: number; 
  setidScreen: Dispatch<React.SetStateAction<number>>;
  navBarType:string;
  setNavBarType: Dispatch<React.SetStateAction<string>>;
  actions: Array<{id:number, name:string}>;
  setActions: Dispatch<React.SetStateAction<{id:number, name:string}[]>>;
}

export const ContextScreen = createContext<ContextScreenType>({
  idScreen: 1,
  setidScreen: () => 1,
  navBarType: '',
  setNavBarType: () => '',
  actions: [],
  setActions: () => [],
});

export const useScreenContext = () => useContext(ContextScreen);