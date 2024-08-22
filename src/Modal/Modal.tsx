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
  Skeleton, // Importando Skeleton
} from "@nextui-org/react";
import { parseAbsoluteToLocal, ZonedDateTime } from "@internationalized/date";
import { useSession } from "next-auth/react";
import { Select } from "../Select/Select";
import axios from "axios";
import { MdError } from "react-icons/md";
import { AiFillCheckCircle } from "react-icons/ai";

interface CustomModalProps {
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
  addModalUrl? :string;
  updateModalUrl?:string;
}

// Função utilitária para criar ou atualizar objetos aninhados
export const setNestedValue = (
  obj: any,
  path: string[],
  value: string | number | Date | {id:number, value:string}
) => {
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

const toZonedDateTime = (
  dateString: string | undefined
): ZonedDateTime | undefined => {
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
    const timeZone = "UTC"; // Ajuste conforme necessário

    return new ZonedDateTime(
      year,
      month,
      day,
      timeZone,
      0,
      hour,
      minute,
      second,
      millisecond
    );
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
  mobile,
  addModalUrl,
  updateModalUrl
}: CustomModalProps) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessIcon, setShowSuccessIcon] = useState(false);
  const [showErrorIcon, setShowErrorIcon] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { data: session } = useSession();

  useEffect(() => {
    if (isUpdate || isView || isDelete) {
      if (isOpen && id) {
        setIsLoading(true);
        const fetchData = async () => {
          try {
            const response = await fetch(`${urlModalGetElement}/${id}`);
            const data = await response.json();
            setInputValues(data);
            console.log(inputValues);
          } catch (error) {
            console.error("Erro ao buscar os dados:", error);
          } finally {
            setIsLoading(false);
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
      const dateTime = date.toString();
      setNestedValue(updatedValues, path.split("."), new Date(dateTime));
      return updatedValues;
    });
  };

  const handleClick = async () => {
    setIsSubmitting(true); // Inicia o estado de submissão
    setProgress(10); // Inicia a barra de progresso
    setShowSuccessIcon(false);
    setShowErrorIcon(false); // Garante que o ícone de erro não apareça antes do tempo
    setErrorMessage(""); // Reseta a mensagem de erro

    try {

      const transformInputValues = (values:any) => {
        const transformedValues = { ...values };
        for (const key in transformedValues) {
          if (transformedValues[key] && typeof transformedValues[key] === 'object' && 'id' in transformedValues[key]) {
            transformedValues[key] = transformedValues[key].id; // Substitui o objeto pelo id
          }
        }
        return transformedValues;
      };
  
      const processedInputValues = transformInputValues(inputValues);
      
      const method = isAdd ? 'post' : (isUpdate ? 'patch' : (isDelete ? 'delete' : 'get'));
      
      const response = await axios({
        method,
        url: isAdd ? addModalUrl : (isUpdate ? `${updateModalUrl}/${id}` : `${urlModalGetElement}/${id}`),
        data: processedInputValues,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.user.token}`,
        },
          onUploadProgress: (progressEvent) => {
            const total = progressEvent.total || 1;
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / total
            );
            setProgress(percentCompleted);
          },
        }
      );

      console.log("Response:", response.data);
      setProgress(100);
      setShowSuccessIcon(true);
      setTimeout(() => {
        setShowSuccessIcon(false);
        onClose();
      }, 2500);
    } catch (error: unknown) {
      console.error("Error:", error);
    
      setShowErrorIcon(true);
      setTimeout(() => {
        setShowErrorIcon(false);
        onClose();
      }, 2500);
    
      if (axios.isAxiosError(error) && error.response) {
        // Verifica se o erro é do axios e se existe uma resposta
        setErrorMessage(
          error.response.data?.message || "Ocorreu um erro no servidor. Tente novamente."
        );
      } else if (error instanceof Error) {
        // Trata outros tipos de erro genéricos
        setErrorMessage(error.message || "Ocorreu um erro. Tente novamente.");
      } else {
        setErrorMessage("Ocorreu um erro desconhecido. Tente novamente.");
      }
    }
     finally {
      setIsSubmitting(false);
    }
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
      {mobile ? (
        <div onClick={onOpen} className="flex gap-2 w-full">
          {trigger}
          {title}
        </div>
      ) : isIcon ? (
        <div onClick={onOpen}>{trigger}</div>
      ) : (
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

                {showSuccessIcon ? (
                  <div className="flex flex-col justify-center items-center h-20">
                    <AiFillCheckCircle className="text-green-700 h-24 w-24" />
                    <p className="text-green-700 mt-2">{elementName} {isAdd ? 'adicionado': isUpdate ? 'atualizado': 'deletado'} com sucesso!</p>
                  </div>
                ) : showErrorIcon ? (
                  <div className="flex flex-col justify-center items-center h-20">
                    <MdError className="text-red-500 h-24 w-24" />
                    <p className="text-red-500 mt-2">{errorMessage}</p>
                  </div>
                ) : isSubmitting ? (
                  <div className="w-full">
                    <div className="relative pt-1">
                      <p className="mb-2">Adicionando {elementName}...</p>
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                        <div
                          style={{ width: `${progress}%` }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-700 transition-all duration-300"
                        ></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  inputs?.map((input) => (
                    <React.Fragment key={input.name}>
                      {isLoading &&
                      input.type != "hidden" &&
                      input.type != "password" ? (
                        <Skeleton className="rounded-lg max-w-72">
                          <div className="h-14 rounded-lg bg-default-300"></div>
                        </Skeleton>
                      ) : (
                        <>
                          {input.type == "checkbox" && (
                            <Checkbox
                              isReadOnly={isView}
                              key={input.name}
                              defaultSelected
                            >
                              {input.label}
                            </Checkbox>
                          )}
                          {input.type == "date" && (
                            <DatePicker
                              key={input.name}
                              label={input.label}
                              variant="faded"
                              className="max-w-72"
                              onChange={(date) =>
                                handleInputDateChange(date, input.name)
                              }
                              isReadOnly={isView}
                              defaultValue={toZonedDateTime(
                                typeof getNestedValue(
                                  inputValues,
                                  input.name.split(".")
                                ) === "object"
                                  ? undefined
                                  : getNestedValue(
                                      inputValues,
                                      input.name.split(".")
                                    )
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
                              isReadOnly={isView}
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
                              isReadOnly={isView}
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
                            <Select
                              name={input.name}
                              elementName={elementName}
                              url={input.autocompleteUrl!}
                              key={input.name}
                              label={input.label}
                              isReadOnly={isView}
                              setValue={setInputValues}
                              fill={!isAdd ? true : false}
                              value={typeof getNestedValue(
                                inputValues,
                                input.name.split(".")
                              ) === "object"
                                ? ""
                                : getNestedValue(
                                    inputValues,
                                    input.name.split(".")
                                  ) || ""}
                            />
                          )}
                        </>
                      )}
                    </React.Fragment>
                  ))
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Fechar
                </Button>
                {!showSuccessIcon && !showErrorIcon && !isView && (
                  <Button
                    color={isDelete ? "danger" : "primary"}
                    onPress={isDelete ? onClose : handleClick}
                  >
                    {isDelete
                      ? "Deletar"
                      : isAdd
                      ? "Adicionar"
                      : isUpdate
                      ? "Atualizar"
                      : "Salvar"}
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
