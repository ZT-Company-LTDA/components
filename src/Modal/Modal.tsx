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
import { CalendarDate, ZonedDateTime } from "@internationalized/date";
import { signOut, useSession } from "next-auth/react";
import { Select } from "../Select/Select";
import axios from "../utils/AxiosInstance";
import { MdError } from "react-icons/md";
import { AiFillCheckCircle } from "react-icons/ai";
import { callValidations } from "../utils/functions/callValidations";
import { UploadImageInput } from "../UploadImageInput/UploadImageInput";
import useFormData from "../hooks/useCreateFormDataDocument";

interface CustomModalProps {
  trigger: JSX.Element;
  elementName: string;
  title: string;
  inputs?: Array<{
    label: string;
    value: string;
    name: string;
    trigger?: () => boolean;
    validation?: string
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
  searchTable?:() => void
  closeModalDropDown?: () => void;
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
  let value = path.reduce(
    (acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined),
    obj
  );
  if(value && typeof value === 'object' && 'id' in value){
    value = value.value
  }
  return value;
};

const toZonedDateTime = (
  dateString: string | undefined
): CalendarDate | undefined => {
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
    const millisecond = -10800000;
    const timeZone = 'America/Sao_Paulo' // Ajuste conforme necessário

    return new CalendarDate(year, month, day)
    // return new ZonedDateTime(
    //   year,
    //   month,
    //   day,
    //   '',
    //   0,
    //   hour,
    //   minute,
    //   second,
    //   millisecond
    // );
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
  updateModalUrl,
  searchTable,
  closeModalDropDown
}: CustomModalProps) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessIcon, setShowSuccessIcon] = useState(false);
  const [showErrorIcon, setShowErrorIcon] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [arrayErrors, setArrayErrors] = useState<Array<{isValid:boolean, error:string, inputName:string}>>([])
  const { createFormData } = useFormData()
  const [image, setImage] = useState<File | string>();
  const [imageUrl, setImageUrl] = useState<string>('');

  const { data: session } = useSession();

  useEffect(() => {
    if (isUpdate || isView || isDelete) {
      if (isOpen && id) {
        setIsLoading(true);
        const fetchData = async () => {
          try {
            const response = await axios.get(`${urlModalGetElement}/${id}`);
            const data = response.data;
            setInputValues(data);
            setImageUrl(data.image);
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
    if(isOpen == false && closeModalDropDown != undefined){
      closeModalDropDown();
    }
  }, [isOpen, id, closeModalDropDown]);

  // Estado para armazenar os valores dos inputs
  const [inputValues, setInputValues] = useState<Record<string, any>>({});

  // Função para lidar com a mudança nos inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, inputName:string, validation?:string) => {
    const { name, value } = e.target;
    
    if(validation) {
      let objValidation = callValidations(validation, value);
      objValidation = {...objValidation, inputName}
      const arrayValidation = arrayErrors.filter(item => item.inputName !== objValidation.inputName)
      setArrayErrors([...arrayValidation, objValidation])
    }
    setInputValues((prevValues) => {
      const updatedValues = { ...prevValues };
      const path = name.split(".");
      setNestedValue(updatedValues, path, value);
      return updatedValues;
    });
  };

  const handleInputChangeError = (value: string, validation?:string) : string => {
   // const { name, value } = e.target;
    
    if(validation) {
      const obj = callValidations(validation, value);
      if(!obj.isValid){
        return obj.error
      }
    }
    return ''
  };

  const handleInputDateChange = (date: CalendarDate, path: string) => {
    setInputValues((prevValues) => {
      const updatedValues = { ...prevValues };
      const dateTime = date.toString();
      setNestedValue(updatedValues, path.split("."), new Date(dateTime));
      return updatedValues;
    });
  };

  const handleClick = async () => {
    if(arrayErrors.filter(item => item.isValid == false).length > 0){return false}
    setIsSubmitting(true); // Inicia o estado de submissão
    setProgress(10); // Inicia a barra de progresso
    setShowSuccessIcon(false);
    setShowErrorIcon(false); // Garante que o ícone de erro não apareça antes do tempo
    setErrorMessage(""); // Reseta a mensagem de erro
    console.log(inputValues)
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

      if(image){
        const formData = createFormData([image as File], inputValues, 'profile_image', 'inputValues');
        const response = await axios({
          method,
          url: isAdd ? addModalUrl : (isUpdate ? `${updateModalUrl}/${id}` : `${urlModalGetElement}/${id}`),
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
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
      }

      setProgress(100);
      setShowSuccessIcon(true);
      if(searchTable){
        searchTable();
      };
      setTimeout(() => {
        setShowSuccessIcon(false);
      }, 2500);
    } catch (error: unknown) {
      console.error("Error:", error);
    
      setShowErrorIcon(true);
      setTimeout(() => {
        setShowErrorIcon(false);
      }, 2500);
    
      if (error instanceof Error) {
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

  const isError = (inputName:string) => {
    const objValidation = arrayErrors.filter(item => item.inputName === inputName);
    if(objValidation.length > 0) {
      return objValidation[0].error
    }
    else{
      return '';
    }
  }

  const isValidFilter = (inputName:string, validation:string) => {
    const newArray = arrayErrors.filter(item => item.inputName === inputName); 
    if(newArray.length > 0 && validation != '') {
      if(newArray[0].isValid){
        return false
      }
      else{
        return true
      }
    } else {
      return false
    }
  }

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
  }, [inputs, isOpen]);

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
        size={!isDelete ? "md" : "xl"}
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
              <ModalBody className="flex flex-grow gap-4 overflow-y-auto">
                {isDelete && (
                    inputValues?.name ?
                    <h1>
                      Deseja deletar o {elementName} {inputValues.name}?
                    </h1>
                    :
                    <Skeleton className="h-3 w-full rounded-lg"/>
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
                          {input.type == "image" && (
                            <UploadImageInput 
                              isView={isView}
                              setImage={setImage}
                              imageUrl={imageUrl}
                              setImageUrl={setImageUrl}
                            />
                          )}
                          {input.type == "date" && (
                            <DatePicker
                              key={input.name}
                              label={input.label}
                              variant="faded"
                              className="max-w-96"
                              showMonthAndYearPickers
                              isRequired={isAdd ? true : false}
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
                            <div>
                            <Input
                              label={input.label}
                              key={input.name}
                              name={input.name}
                              placeholder={input.placeholder}
                              isRequired={isAdd ? true : false}
                              className="max-w-96"
                              isReadOnly={isView}
                              isInvalid={isValidFilter(input.name, input.validation || '')}
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
                              onChange={(e) => {handleInputChange(e, input.name, input.validation)}}
                            />
                            <p className="text-[0.65rem] text-red-400 font-semibold mt-2">{isError(input.name)}</p>
                            </div>
                          )}
                          {input.type == "password" && isAdd && (
                            <div>
                            <Input
                              label={input.label}
                              key={input.name}
                              name={input.name}
                              placeholder={input.placeholder}
                              isRequired={isAdd ? true : false}
                              className="max-w-96"
                              isReadOnly={isView}
                              isInvalid={isValidFilter(input.name, input.validation || '')}
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
                              onChange={(e) => {handleInputChange(e, input.name, input.validation)}}
                            />
                            <p className="text-[0.65rem] text-red-400 font-semibold mt-2">{isError(input.name)}</p>
                            
                            </div>
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
                              isAdd={isAdd}
                              isView={isView}
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
                    isLoading={isSubmitting}
                    color={isDelete ? "danger" : "primary"}
                    onPress={handleClick}
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
