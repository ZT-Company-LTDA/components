import { Input } from "@nextui-org/react";
import { CiSearch } from "react-icons/ci";
import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { useTableCrudContext } from "../contexts/ContextTableCrud";

export const Filter = ({ name, placeholder }: { name: string, placeholder:string }) => {
  const { page, setPage } = useTableCrudContext();
  const [filterValue, setFilterValue] = useState("");
  const { arrayFilters, setArrayFilters, clear } = useTableCrudContext();

  useEffect(() => {
      setFilterValue("");
      onClear();
      console.log("CHAMOU")
  },[clear])

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);

    setArrayFilters((prevArrayFilters) => {
      const index = prevArrayFilters.findIndex(
        (filter) => filter.name === name
      );
      if (index === -1) {
        // Não existe, então adiciona um novo
        return [...prevArrayFilters, { name, value: "" }];
      } else {
        // Existe, então atualiza o existente
        const newArrayFilters = [...prevArrayFilters];
        newArrayFilters[index].value = "";
        return newArrayFilters;
      }
    });
  }, [name, setArrayFilters, setFilterValue, setPage]);

  const onSearchChange = useCallback(
    (value?: string) => {
      setFilterValue(value ?? "");
      setPage(1);

      setArrayFilters((prevArrayFilters) => {
        const index = prevArrayFilters.findIndex(
          (filter) => filter.name === name
        );
        if (index === -1) {
          // Não existe, então adiciona um novo
          return [...prevArrayFilters, { name, value: value ?? "" }];
        } else {
          // Existe, então atualiza o existente
          const newArrayFilters = [...prevArrayFilters];
          newArrayFilters[index].value = value ?? "";
          return newArrayFilters;
        }
      });

      console.log(arrayFilters);
    },
    [name, setArrayFilters, setFilterValue, setPage]
  );

  return (
    <Input
      isClearable
      variant="bordered"
      className="w-full sm:max-w-[25vw]"
      placeholder={placeholder}
      startContent={<CiSearch />}
      value={filterValue}
      onClear={() => onClear()}
      onValueChange={onSearchChange}
    />
  );
};
