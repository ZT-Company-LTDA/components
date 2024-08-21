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
import { parseAbsoluteToLocal, ZonedDateTime } from "@internationalized/date";
import { useSession } from "next-auth/react";
import { Select } from "../Select/Select";
import axios from "axios";

// Função utilitária para criar ou atualizar objetos aninhados
export const setNestedValue = (obj: any, path: string[], value: string | number | Date) => {
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

const toZonedDateTime = (dateString: string | undefined): ZonedDateTime | undefined => {
  if (!dateString) return undefined;

  try {
    // Converte a string para uma instância de Date
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1; // Mês é zero-indexado
    const day = date.getUTCDate();
    const hour = date.getUTCHours();
    const minute = date.getUTCMinutes();
    const second = date.getUTCSeconds();
    const millisecond = date.getUTCMilliseconds();
    const timeZone = 'UTC'; // Ajuste conforme necessário

    return new ZonedDateTime(year, month, day, timeZone, 0, hour, minute, second, millisecond);
  } catch (error) {
    console.error("Erro ao converter data:", error);
    return undefined;
  }
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
}: {
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
  isAdd?: boolean;
  isUpdate?: boolean;
  isView?: boolean;
  isIcon?: boolean;
  id?: string | number;
  urlModalGetElement?: string;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { data: session } = useSession();

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

  const handleInputDateChange = (date: ZonedDateTime, path: string) => {
    setInputValues((prevValues) => {
      const updatedValues = { ...prevValues };
      const dateTime = date.toString()
      setNestedValue(updatedValues, path.split("."), new Date(dateTime));
      return updatedValues;
    });
  };

  const handleClick = () => {
    console.log(inputValues);
    axios.post('http://localhost:3001/users', inputValues, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      console.log('Response:', response.data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  useEffect(() => {
    if (inputs) {
      inputs.forEach((input) => {
        if (input.type === "hidden" && input.hiddenValue) {
          setInputValues((prevValues) => {
            const updatedValues = { ...prevValues };
            const path = input.name.split(".");
            setNestedValue(updatedValues, path, parseInt(input.hiddenValue!));
            return updatedValues;
          });
        }
      });
    }
  }, [inputs]);

  return (
    <>
      {isIcon && <div onClick={onOpen}>{trigger}</div>}
      {!isIcon && (
        <Button className="" variant="flat" color="primary" onClick={onOpen}>
          {title}
          {trigger}
        </Button>
      )}
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
                      onChange={(date) => handleInputDateChange(date, input.name)}
                      defaultValue={
                        toZonedDateTime(
                          typeof getNestedValue(
                            inputValues,
                            input.name.split(".")
                          ) === "object"
                            ? undefined
                            : getNestedValue(
                                inputValues,
                                input.name.split(".")
                              )
                        )
                      }
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
                    {input.type == "select" && (
                      <Select name={input.name} elementName={elementName} url={input.autocompleteUrl!} key={input.name} label={input.label} setValue={setInputValues}/>
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
