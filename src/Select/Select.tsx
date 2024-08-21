import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
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
}

export const Select: React.FC<SelectProps> = ({
  elementName,
  url,
  label,
  setValue,
  name,
  isReadOnly,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [elements, setElements] = useState<ResultElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<number | null>(null);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(true);
    setSearchTerm(e.target.value);
  };

  const handleOptionClick = (element: ResultElement) => {
    setSelectedElement(element.id);
    setSearchTerm(element.value);
    setValue((prevValues) => {
      const updatedValues = { ...prevValues };
      const path = name.split(".");
      setNestedValue(updatedValues, path, element.id);
      return updatedValues;
    });
    setShowDropdown(false);
    setClicked(!clicked);
  };

  return (
    <div onClick={() => {
      setClicked(!clicked);
      setShowDropdown(!showDropdown);
    }} className="relative max-w-72">
      <Input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        isReadOnly={isReadOnly}
        placeholder={`Digite o nome do ${elementName}`}
        className="max-w-72"
        label={label}
      />
      {showDropdown ? (
        <IoIosArrowUp className="absolute top-2 left-64" />
      ) : (
        <IoIosArrowDown className="absolute top-2 left-64" />
      )}
      {showDropdown && (
        <ul className="absolute z-50 max-w-72 w-full bg-white border rounded shadow-lg mt-1 max-h-60 overflow-auto ">
          {searchTerm != "" ? (
            elements.length > 0 ? (
              elements.map((element) => (
                <li
                  key={element.id}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleOptionClick(element)}
                >
                  {element.value}
                </li>
              ))
            ) : search == false ? (
              <li className="px-3 py-2">Nenhum item encontrado</li>
            ) : (
              <li className="px-3 py-2 flex justify-between">
                <p>Pesquisando</p>
                <Spinner color="default" size="sm" />
              </li>
            )
          ) : (
            search == false && (
              <li className="px-3 py-2">Digite algo para pesquisar</li>
            )
          )}
        </ul>
      )}
    </div>
  );
};
