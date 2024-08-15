import React, { useEffect, useState } from "react";
import {
  Modal as ModalUI,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@nextui-org/react";

// Função utilitária para criar ou atualizar objetos aninhados
const setNestedValue = (obj: any, path: string[], value: string) => {
  const lastKey = path.pop()!;
  const lastObj = path.reduce((acc, key) => {
    if (!acc[key] || typeof acc[key] !== 'object') {
      acc[key] = {};
    }
    return acc[key];
  }, obj);
  lastObj[lastKey] = value;
};

// Função para obter valores aninhados de forma segura
const getNestedValue = (obj: any, path: string[]) => {
  return path.reduce((acc, key) => (acc && acc[key] !== undefined) ? acc[key] : undefined, obj);
};

export default function Modal({
  trigger,
  elementName,
  title,
  inputs,
  isDelete,
  isAdd,
  isUpdate,
  isView,
  isIcon,
  id
}: {
  trigger: JSX.Element;
  elementName: string;
  title: string;
  inputs?: Array<{ label: string; value: string; name: string }>;
  isDelete?: boolean;
  isAdd?: boolean;
  isUpdate?: boolean;
  isView?: boolean;
  isIcon?: boolean;
  id?: string | number;
}) {

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Efeito que é disparado quando a modal é aberta
  useEffect(() => {
    const data = {
      "name": "Ana Souza",
      "password": "senhaSegura789",
      "clinicId": 1,
      "email": "ana.souza@exemplo.com",
      "roleId": 3,
      "responsibleId":1,
      "patient": {
        "name": "Ana Souza",
        "userId": 2,
        "birthDate": "2015-08-15T00:00:00.000Z",
        "address": "Rua D, 789, Cidade E",
        "rg": "SP-65.432.987",
        "cpf": "987.654.321-00",
        "phoneNumber": "987654321",
        "isLegalAge": false
      },
      "parent": {
        "name": "Maria Souza",
        "phoneNumber": "123456789",
        "address": "Rua D, 789, Cidade E",
        "cpf": "123.456.789-00",
        "rg": "MG-12.345.678"
      }
    }
    
    if (isOpen && id) {
      // Função para buscar os dados com base no ID
      const fetchData = async () => {
        try {
          // const response = await fetch(`/api/endpoint/${id}`);
          // const data = await response.json();
          setInputValues(data); // Preenche o estado com os dados recebidos
        } catch (error) {
          console.error("Erro ao buscar os dados:", error);
        }
      };

      fetchData();
    }
  }, [isOpen, id]);


  // Estado para armazenar os valores dos inputs
  const [inputValues, setInputValues] = useState<Record<string, any>>({});

  // Função para lidar com a mudança nos inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValues((prevValues) => {
      const updatedValues = { ...prevValues };
      const path = name.split(".");
      setNestedValue(updatedValues, path, value); // Cria ou atualiza o objeto aninhado
      return updatedValues;
    });
  };

  const handleClick = () => {
    console.log(inputValues);
  }

  return (
    <>
      {isIcon && <div onClick={onOpen}>{trigger}</div>}
      {!isIcon && <Button className="" variant="flat" color="primary" onClick={onOpen}>{title}{trigger}</Button>}
      <ModalUI size="5xl" isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-wrap gap-1">{title}</ModalHeader>
              <ModalBody className="flex flex-wrap gap-4 overflow-y-scroll">
                {isDelete && <h1>Deseja deletar o {elementName}?</h1>}
                {inputs?.map((input) => (
                  <Input
                    key={input.name}
                    name={input.name}
                    placeholder={input.label}
                    className="max-w-72"
                    value={typeof getNestedValue(inputValues, input.name.split(".")) === 'object'
                      ? ""
                      : getNestedValue(inputValues, input.name.split(".")) || ""}
                    onChange={handleInputChange}
                  />
                ))}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Fechar
                </Button>
                <Button color="primary" onPress={handleClick}>
                  Confirmar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </ModalUI>
    </>
  );
}
