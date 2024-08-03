import { Input } from "@nextui-org/react";
import { CiSearch } from "react-icons/ci";
import * as React from "react";
import { useCallback, useState } from "react";
import { useTableCrudContext } from "../contexts/ContextTableCrud";

export const Filter = () => {
  const {page, setPage} = useTableCrudContext()
  const {filterValue, setFilterValue} = useTableCrudContext()
  const onClear = useCallback(() => {
    setFilterValue('')
    setPage(1)
  }, [])

  const onSearchChange = useCallback((value?: string) => {
    setFilterValue(value??'')
    setPage(1)
  }, [])
  
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <Input
          isClearable
          className="w-full sm:max-w-[44%]"
          placeholder="Procure pelo nome..."
          startContent={<CiSearch />}
          value={filterValue}
          onClear={() => onClear()}
          onValueChange={onSearchChange}
        />
      </div>
    </div>
  );
};
