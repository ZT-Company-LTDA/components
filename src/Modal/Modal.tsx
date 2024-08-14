import React, { useState } from "react";
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
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
      <ModalUI isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
              <ModalBody>
                {isDelete && <h1>Deseja deletar o {elementName}?</h1>}
                {inputs?.map((input) => (
                  <Input
                    key={input.name}
                    name={input.name}
                    placeholder={input.label}
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
