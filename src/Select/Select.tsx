import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import { Input, Spinner } from "@nextui-org/react";
import { useDebounce } from "use-debounce";
import { setNestedValue } from "../Modal/Modal";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

interface ResultElement {
  id: number;
  value: string;
}

interface SelectProps {
  elementName: string;
  url: string;
  label: string;
  name: string;
  isReadOnly?: boolean;
  setValue: (value: React.SetStateAction<Record<string, any>>) => void;
  value?: string;
  fill?: boolean;
  isAdd?: boolean;
  isView?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  elementName,
  url,
  label,
  setValue,
  name,
  isReadOnly,
  value,
  fill,
  isAdd,
  isView
}) => {
  const [searchTerm, setSearchTerm] = useState<string>(value || "");
  const [elements, setElements] = useState<ResultElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<ResultElement | null>(null);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [debouncedQuery] = useDebounce(searchTerm, 1000);
  const [clicked, setClicked] = useState(false);
  const [search, setSearch] = useState(false);

  const { data: session } = useSession();

  useEffect(() => {
    const fetchElements = async () => {
      if (debouncedQuery.length > 0) {
        try {
          const response = await axios(url, {
            method: "POST",
            data: { search: debouncedQuery },
            headers: {
              Authorization: `Bearer ${session?.user?.token as string}`,
            },
          });
          console.log("API response:", response.data); // Verifique a estrutura aqui
          setElements(response.data.results || []);
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 401) {
            signOut(); // Executa signOut se o status for 401
          }
          console.error("Error fetching:", error);
        }
        setSearch(false);
      } else {
        setElements([]);
        setSearch(false);
      }
    };

    fetchElements();
  }, [debouncedQuery, url, session?.user?.token]);

  const inputRef = useRef<HTMLInputElement>(null);

  const dropdownRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionMouseDown = (e: React.MouseEvent<HTMLLIElement, MouseEvent>, element: ResultElement) => {
    e.preventDefault(); // Evita o fechamento do dropdown
    handleOptionClick(element); // Processa a seleção do item
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(true);
    setSearchTerm(e.target.value);
  };

  const handleOptionClick = (element: ResultElement) => {
    setSelectedElement(element);
    setSearchTerm(element.value);
    setValue((prevValues) => {
      const updatedValues = { ...prevValues };
      const path = name.split(".");
      setNestedValue(updatedValues, path, {id:element.id, value:element.value});
      return updatedValues;
    });
    setShowDropdown(false);
    setClicked(!clicked);
  };

  useEffect(() => {
    if (fill && value) {
      const selected = elements.find((el) => el.value === value) || null;
      setSelectedElement(selected);
      setSearchTerm(value);
    }
  }, [fill]);

  return (
    <div
      onClick={() => {
        if (inputRef.current) {
          inputRef.current.focus(); 
        }
      }}
      className="relative max-w-96"
    >
      <Input
        type="text"
        onFocus={() => {
          if(!isView){
            setClicked(true);
            setShowDropdown(true);
          }
        }}
        onBlur={() => {
          if(!isView){
            setClicked(false);
            setShowDropdown(false);
          }
        }}
        disabled={isView}
        isRequired={isAdd ? true : false}
        value={searchTerm}
        onChange={handleInputChange}
        isReadOnly={isReadOnly}
        placeholder={`Digite o nome do ${elementName}`}
        className="max-w-96"
        label={label}
      />
      {showDropdown ? (
        <IoIosArrowUp className="absolute top-2 left-[22rem]" />
      ) : (
        <IoIosArrowDown className="absolute top-2 left-[22rem]" />
      )}
      {showDropdown && (
        <ul ref={dropdownRef} className="absolute z-50 max-w-96 w-full bg-white border rounded shadow-lg mt-1 max-h-60 overflow-auto ">
          {searchTerm !== "" ? (
            elements.length > 0 ? (
              elements.map((element) => (
                <li
                  key={element.id}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-200"
                  onMouseDown={(e) => handleOptionMouseDown(e, element)}
                >
                  {element.value}
                </li>
              ))
            ) : search === false ? (
              <li className="px-3 py-2">Nenhum item encontrado</li>
            ) : (
              <li className="px-3 py-2 flex justify-between">
                <p>Pesquisando</p>
                <Spinner color="default" size="sm" />
              </li>
            )
          ) : (
            search === false && (
              <li className="px-3 py-2">Digite algo para pesquisar</li>
            )
          )}
        </ul>
      )}
    </div>
  );
};
