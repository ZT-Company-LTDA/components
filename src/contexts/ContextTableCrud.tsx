"use client";
import { createContext, Dispatch, SetStateAction, useContext } from 'react';

interface ContextTableCrudType {
  page: number; 
  setPage: Dispatch<React.SetStateAction<number>>;
  filterValue: string; 
  setFilterValue: Dispatch<React.SetStateAction<string>>;
}

export const ContextTableCrud = createContext<ContextTableCrudType>({
  page: 1,
  setPage: () => 1,
  filterValue: '',
  setFilterValue: () => ''
});

export const useTableCrudContext = () => useContext(ContextTableCrud);