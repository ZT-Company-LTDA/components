"use client";
import { createContext, Dispatch, SetStateAction, useContext } from 'react';

export interface Filter{
  name: string;
  value: string;
}

interface ContextTableCrudType {
  page: number; 
  setPage: Dispatch<React.SetStateAction<number>>;
  filterValue: string; 
  setFilterValue: Dispatch<React.SetStateAction<string>>;
  arrayFilters: Filter[]; 
  setArrayFilters: Dispatch<React.SetStateAction<Filter[] | never[]>>;
}

export const ContextTableCrud = createContext<ContextTableCrudType>({
  page: 1,
  setPage: () => 1,
  filterValue: '',
  setFilterValue: () => '',
  arrayFilters: [],
  setArrayFilters: () => []
});

export const useTableCrudContext = () => useContext(ContextTableCrud);