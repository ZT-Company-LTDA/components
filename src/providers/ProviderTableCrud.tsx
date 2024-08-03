"use client";
import React, { useState } from 'react';
import { ContextTableCrud } from '../contexts/ContextTableCrud';

export const ProviderTableCrud = ({ children }: { children: React.ReactNode }) => {
  const [page, setPage] = useState(1)
  const [filterValue, setFilterValue] = useState('')

  return (
    <ContextTableCrud.Provider value={{ page, setPage, filterValue, setFilterValue }}>
      {children}
    </ContextTableCrud.Provider>
  );
};
