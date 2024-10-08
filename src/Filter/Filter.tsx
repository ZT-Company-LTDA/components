import { Autocomplete, AutocompleteItem, Input } from "@nextui-org/react";
import { CiSearch } from "react-icons/ci";
import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { useTableCrudContext } from "../contexts/ContextTableCrud";
import { useAsyncList } from "@react-stately/data";
import axios from "../utils/AxiosInstance";
import { parseCookies } from "nookies";

export const Filter = ({
  name,
  placeholder,
  autocomplete,
  urlAutocomplete,
}: {
  name: string;
  placeholder: string;
  autocomplete?: boolean;
  urlAutocomplete?: string;
}) => {
  const [filterValue, setFilterValue] = useState("");
  const { setPage, arrayFilters, setArrayFilters, clear } = useTableCrudContext();
  const token = parseCookies().token
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
  
  useEffect(() => {
    setFilterValue("");
    onClear();
  }, [clear, onClear]);

  let list = useAsyncList({
    async load({ signal, filterText }) {
      if (token && filterText) {
        try {
          let res = await axios(`${urlAutocomplete}`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            data: { search: filterText },
            signal
          });
  
          const result = res.data.results[0];
  
          setArrayFilters((prevArrayFilters) => {
            const index = prevArrayFilters.findIndex(
              (filter) => filter.name === name
            );
            const value = result && result[name] !== undefined ? result[name] : "";
            if (index === -1) {
              return [...prevArrayFilters, { name, value }];
            } else {
              const newArrayFilters = [...prevArrayFilters];
              newArrayFilters[index].value = value;
              return newArrayFilters;
            }
          });
  
          return {
            items: res.data.results || []
          };
        } catch (error) {
          console.error('error filter',error);
          return {
            items: []
          };
        }
      } else {
        return {
          items: []
        };
      }
    },
  });

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
    },
    [name, setArrayFilters, setFilterValue, setPage]
  );

  return autocomplete ? (
    <Autocomplete
      className="max-w-xs"
      inputValue={list.filterText}
      isLoading={list.isLoading}
      items={list.items}
      required={true}
      label="Cliente"
      listboxProps={{
        emptyContent: "Escreva para começar a pesquisar.",
      }}
      isRequired
      placeholder="Escreva o nome de algum Cliente..."
      variant={"bordered"}
      onInputChange={list.setFilterText}
    >
      {(item: any) => (
        <AutocompleteItem key={item.id} value={item.id}>
          {item.name}
        </AutocompleteItem>
      )}
    </Autocomplete>
  ) : (
    <Input
      isClearable
      variant="bordered"
      className="w-full sm:max-w-[25vw]"
      classNames={{
        inputWrapper:["h-14"]
      }}
      placeholder={placeholder}
      startContent={<CiSearch />}
      value={filterValue}
      onClear={() => onClear()}
      onValueChange={onSearchChange}
    />
  );
};
