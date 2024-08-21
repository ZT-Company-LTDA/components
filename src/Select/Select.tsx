import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Input } from '@nextui-org/react';
import { useDebounce } from 'use-debounce';
import { setNestedValue } from '../Modal/Modal';

interface ResultElement {
  id: number;
  value: string;
}

interface SelectProps {
  elementName: string;
  url: string;
  label: string;
  name:string;
  isReadOnly?: boolean;
  setValue: (value: React.SetStateAction<Record<string, any>>) => void
}

export const Select: React.FC<SelectProps> = ({ elementName, url, label, setValue, name, isReadOnly }) => {
  
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [elements, setElements] = useState<ResultElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<number | null>(null);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [debouncedQuery] = useDebounce(searchTerm, 3000);

  const { data: session } = useSession();

  useEffect(() => {
    const fetchElements = async () => {
      if (debouncedQuery.length > 1) {
        try {
          const response = await axios(url, {
            method: "POST",
            data: { search: debouncedQuery },
            headers: {
              Authorization: `Bearer ${session?.user?.token as string}`,
            },
          });
          console.log('API response:', response.data); // Verifique a estrutura aqui
          setElements(response.data.results || []);
          setShowDropdown(true);
        } catch (error) {
          console.error('Error fetching:', error);
        }
      } else {
        setElements([]);
        setShowDropdown(false);
      }
    };

    fetchElements();
  }, [debouncedQuery, url, session?.user?.token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  return (
    <div className='relative'>
      <Input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        isReadOnly={isReadOnly}
        placeholder={`Digite o nome do ${elementName}`}
        className="max-w-72"
        label={label}
      />
      {showDropdown && (
        <ul className="absolute max-w-72 w-full bg-white border rounded shadow-lg mt-1 max-h-60 overflow-auto z-10">
          {elements.length > 0 ? (
            elements.map((element) => (
              <li
                key={element.id}
                className="px-3 py-2 cursor-pointer hover:bg-gray-200"
                onClick={() => handleOptionClick(element)}
              >
                {element.value}
              </li>
            ))
          ) : (
            <li className="px-3 py-2">Nenhum item encontrado</li>
          )}
        </ul>
      )}
    </div>
  );
};
