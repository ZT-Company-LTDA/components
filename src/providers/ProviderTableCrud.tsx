"use client";
import React, { useState } from 'react';
import { ContextTableCrud, Filter } from '../contexts/ContextTableCrud';

export const ProviderTableCrud = ({ children }: { children: React.ReactNode }) => {
  const [page, setPage] = useState(1)
  const [filterValue, setFilterValue] = useState('')
  const [arrayFilters, setArrayFilters] = useState<Filter[] | never[]>([])
  const [clear, setClear] = useState(false);

  return (
    <ContextTableCrud.Provider value={{clear, setClear, page, setPage, filterValue, setFilterValue, arrayFilters, setArrayFilters }}>
      {children}
    </ContextTableCrud.Provider>
  );
};
