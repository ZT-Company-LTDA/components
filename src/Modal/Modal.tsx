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
  Checkbox,
  DatePicker,
} from "@nextui-org/react";
import { parseAbsoluteToLocal } from "@internationalized/date";


interface CustomModalProps{
  trigger: JSX.Element;
  elementName: string;
  title: string;
  inputs?: Array<{
    label: string;
    value: string;
    name: string;
    trigger?: () => boolean;
    type: string;
    placeholder?: string;
    autocompleteUrl?: string;
    hiddenValue?: string;
  }>;
  isDelete?: boolean;
  mobile?: boolean;
  isAdd?: boolean;
  isUpdate?: boolean;
  isView?: boolean;
  isIcon?: boolean;
  id?: string | number;
  urlModalGetElement?: string;
}

// Função utilitária para criar ou atualizar objetos aninhados
const setNestedValue = (obj: any, path: string[], value: string) => {
  const lastKey = path.pop()!;
  const lastObj = path.reduce((acc, key) => {
    if (!acc[key] || typeof acc[key] !== "object") {
      acc[key] = {};
    }
    return acc[key];
  }, obj);
  lastObj[lastKey] = value;
};

// Função para obter valores aninhados de forma segura
const getNestedValue = (obj: any, path: string[]) => {
  return path.reduce(
    (acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined),
    obj
  );
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
  id,
  urlModalGetElement,
  mobile
}: CustomModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    if (isUpdate || isView || isDelete) {
      if (isOpen && id) {
        const fetchData = async () => {
          try {
            const response = await fetch(`${urlModalGetElement}/${id}`);
            const data = await response.json();
            setInputValues(data);
            console.log(inputValues);
          } catch (error) {
            console.error("Erro ao buscar os dados:", error);
          }
        };

        fetchData();
      }
    }
    // console.log(id);
    // const data = {
    //   "name": "Ana Souza",
    //   "password": "senhaSegura789",
    //   "clinicId": 1,
    //   "email": "ana.souza@exemplo.com",
    //   "roleId": 3,
    //   "responsibleId":1,
    //   "patient": {
    //     "name": "Ana Souza",
    //     "userId": 2,
    //     "birthDate": "2015-08-15T00:00:00.000Z",
    //     "address": "Rua D, 789, Cidade E",
    //     "rg": "SP-65.432.987",
    //     "cpf": "987.654.321-00",
    //     "phoneNumber": "987654321",
    //     "isLegalAge": false
    //   },
    //   "parent": {
    //     "name": "Maria Souza",
    //     "phoneNumber": "123456789",
    //     "address": "Rua D, 789, Cidade E",
    //     "cpf": "123.456.789-00",
    //     "rg": "MG-12.345.678"
    //   }
    // }
  }, [isOpen, id]);

  // Estado para armazenar os valores dos inputs
  const [inputValues, setInputValues] = useState<Record<string, any>>({});

  // Função para lidar com a mudança nos inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValues((prevValues) => {
      const updatedValues = { ...prevValues };
      const path = name.split(".");
      setNestedValue(updatedValues, path, value);
      return updatedValues;
    });
  };

  const handleClick = () => {
    console.log(inputValues);
  };

  return (
    <>
    
      
      {
        mobile 
          ?
        <div onClick={onOpen} className="flex gap-2 w-full">
          {trigger}
          {title}
        </div> 
          :
        isIcon 
          ?
        <div onClick={onOpen}>{trigger}</div>
          :
        <Button className="" variant="flat" color="primary" onClick={onOpen}>
        {title}
        {trigger}
        </Button>
      }

      <ModalUI
        size={!isDelete ? "5xl" : "xl"}
        isOpen={isOpen}
        key={elementName}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-wrap gap-1">
                {title}
              </ModalHeader>
              <ModalBody className="flex flex-wrap gap-4 overflow-y-scroll">
                {isDelete && (
                  <h1>
                    Deseja deletar o {elementName} {inputValues.name}?
                  </h1>
                )}
                {inputs?.map((input) => (
                  <React.Fragment key={input.name}>
                    {input.type == "checkbox" && (
                      <Checkbox key={input.name} defaultSelected>
                        {input.label}
                      </Checkbox>
                    )}
                    {input.type == "date" && (
                      <DatePicker
                        key={input.name}
                        label={input.label}
                        variant="faded"
                        className="max-w-72"
                        defaultValue={parseAbsoluteToLocal(
                          typeof getNestedValue(
                            inputValues,
                            input.name.split(".")
                          ) === "object"
                            ? ""
                            : getNestedValue(
                                inputValues,
                                input.name.split(".")
                              ) || "2021-11-07T07:45:00Z"
                        )}
                      />
                    )}

                    {input.type == "text" && (
                      <Input
                        label={input.label}
                        key={input.name}
                        name={input.name}
                        placeholder={input.placeholder}
                        className="max-w-72"
                        value={
                          typeof getNestedValue(
                            inputValues,
                            input.name.split(".")
                          ) === "object"
                            ? ""
                            : getNestedValue(
                                inputValues,
                                input.name.split(".")
                              ) || ""
                        }
                        onChange={handleInputChange}
                      />
                    )}
                    {input.type == "password" && isAdd && (
                      <Input
                        label={input.label}
                        key={input.name}
                        name={input.name}
                        placeholder={input.placeholder}
                        className="max-w-72"
                        type="password"
                        value={
                          typeof getNestedValue(
                            inputValues,
                            input.name.split(".")
                          ) === "object"
                            ? ""
                            : getNestedValue(
                                inputValues,
                                input.name.split(".")
                              ) || ""
                        }
                        onChange={handleInputChange}
                      />
                    )}
                  </React.Fragment>
                ))}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Fechar
                </Button>
                {!isView && (
                  <Button color="primary" onPress={handleClick}>
                    Confirmar
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </ModalUI>
    </>
  );
}
