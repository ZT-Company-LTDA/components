import React, { useState, useEffect, useRef } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { parseCookies } from "nookies";
import axios from "axios";
import { setNestedValue } from "../utils/functions/modalValues";

const useDebounce = (value: string, delay: number): string => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Chamada da API com termo de busca

interface MultiSelectProps {
  url: string;
  add: boolean | undefined;
  value: any;
  elementName: string;
  setValue: (value: React.SetStateAction<Record<string, any>>) => void;
  name: string;
  inputValues: any;
}

interface RequestFetcher {
  id: number;
  value: string;
}

const MultiSelectFilter: React.FC<MultiSelectProps> = ({
  url,
  add,
  value,
  elementName,
  setValue,
  name,
  inputValues,
}: MultiSelectProps) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [filteredOptions, setFilteredOptions] = useState<RequestFetcher[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<RequestFetcher[]>([]);
  const [filter, setFilter] = useState<string>("");

  const debouncedFilter = useDebounce(filter, 1000); // Debounce de 1 segundo
  const dropdownRef = useRef<HTMLDivElement>(null); // Referência para a div do dropdown

  const fetcher = async (
    query: string,
    url: string
  ): Promise<RequestFetcher[]> => {
    if (!query) return [];
    const token = parseCookies().token;
    const response = await axios(`${process.env.NEXT_PUBLIC_URL_BACK}${url}`, {
      method: "POST",
      data: { search: query },
      headers: {
        Authorization: `Bearer ${parseCookies().token as string}`,
      },
    });
    return response.data.results;
  };

  // Efeito que chama a API após o debounce
  useEffect(() => {
    const loadOptions = async () => {
      if (debouncedFilter) {
        const data: RequestFetcher[] = await fetcher(debouncedFilter, url);
        setFilteredOptions(data);
      } else {
        setFilteredOptions([]);
      }
    };
    loadOptions();
  }, [debouncedFilter]);

  useEffect(() => {
    if (isActive) {
      setValue((prevValues) => {
        const updatedValues = { ...prevValues };
        const path = name.split(".");
        setNestedValue(updatedValues, path, selectedOptions);
        return updatedValues;
      });
    }
  }, [selectedOptions]);

  // Fecha o dropdown ao clicar fora
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsActive(false);
    }
  };

  // Adiciona o listener de clique fora ao montar o componente
  useEffect(() => {
    if (!add) {
      setSelectedOptions(value);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!add && value) {
      console.log("Inicializando selectedOptions com value: ", value);
      setSelectedOptions(value);
    }
  }, [value, add]);
  
  const toggleOption = (option: RequestFetcher) => {
    console.log("Selecionando/Deselecionando: ", option);
    setSelectedOptions((prevSelected) =>
      prevSelected.some((item) => item.id === option.id)
        ? prevSelected.filter((item) => item.id !== option.id)
        : [...prevSelected, option]
    );
  };

  useEffect(() => {
    forceUpdate();
  }, [selectedOptions]);
  
  const forceUpdate = React.useReducer(() => ({}), {})[1];

  // Função para exibir os selecionados na div
  const renderSelectedOptions = () => {
    if (selectedOptions.length === 0) {
      return (
        <div className="flex flex-nowrap text-md justify-between h-full">
          <div className="flex flex-col">
            <span className="text-gray-500 text-[0.75rem]">{elementName}</span>
            <span className="text-gray-500 text-[0.85rem]">
              Clique para selecionar
            </span>
          </div>
          <div className="h-full flex items-start justify-start">
            {isActive ? <IoChevronUp /> : <IoChevronDown />}
          </div>
        </div>
      );
    }

    const displayedOptions = selectedOptions.slice(0, 4);
    const moreCount = selectedOptions.length;

    return (
      <div className="relative flex gap-2 justify-between w-full">
        <span className="flex flex-nowrap overflow-x-clip text-md w-5/6">
          {moreCount > 4 ? (
            <span className="text-gray-600 font-medium px-2 rounded-md mr-1 whitespace-nowrap">
              {`${moreCount} Selecionados`}
            </span>
          ) : (
            displayedOptions.map((option, index) => (
              <span
                key={option.id}
                className="bg-blue-100 text-blue-800 px-2 rounded-md mr-1 whitespace-nowrap"
              >
                {option.value}
              </span>
            ))
          )}
        </span>
        {isActive ? <IoChevronUp /> : <IoChevronDown />}
      </div>
    );
  };

  return (
    <div className="relative max-w-full" ref={dropdownRef}>
      {/* Div que ativa a lista ao ser clicada */}
      <div
        className="cursor-pointer p-2 border rounded-md bg-gray-100 w-full min-h-14" // Div com tamanho fixo
        onClick={() => setIsActive(!isActive)}
      >
        {renderSelectedOptions()}
      </div>

      {/* Mostra o input e a lista ao ativar */}
      {isActive && (
        <div className="absolute mt-1 pt-2 left-1/2 transform -translate-x-1/2 w-full flex flex-col justify-center items-center bg-white border rounded-md shadow-lg z-10 max-w-full">
          <div className="w-full px-2">
            {/* Input de filtro */}
            <input
              type="text"
              className="border border-gray-300 bg-gray-100 p-2 w-full mb-2 rounded-xl"
              placeholder={`Digite para pesquisar...`}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>

          {/* Lista de opções filtradas */}
          <ul className="max-h-40 overflow-y-auto w-full">
            {filteredOptions.map((option) => (
              <li
                key={option.id}
                className={`p-2 ${
                  selectedOptions.some((item) => item.id === option.id)
                    ? "bg-blue-200"
                    : "hover:bg-gray-200"
                }`}
              >
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={selectedOptions.some(
                      (item) => item.id === option.id
                    )}
                    onChange={() => toggleOption(option)}
                  />
                  <span>{option.value}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MultiSelectFilter;
