import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Modal as ModalUI,
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
import { AiFillCheckCircle, AiOutlineClose } from "react-icons/ai";
import { callValidations } from "../utils/functions/callValidations";
import { UploadImageInput } from "../UploadImageInput/UploadImageInput";
import useFormData from "../hooks/useCreateFormDataDocument";
import { FaCheck, FaEdit, FaTimes } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { useMediaQuery } from "../hooks/useMediaQuery";

interface CustomModalProps {
  table?: boolean;
  children?: React.ReactNode;
  trigger: JSX.Element;
  elementName: string;
  closeModal: () => void;
  isOpen: boolean;
  title: string;
  inputs?: Array<{
    label: string;
    value: string;
    name: string;
    trigger?: () => boolean;
    validation?: string;
    type: string;
    placeholder?: string;
    autocompleteUrl?: string;
    hiddenValue?: string;
  }>;
  isDelete?: boolean;
  mobile?: boolean;
  isAddModal?: boolean;
  isUpdate?: boolean;
  isViewModal?: boolean;
  isIcon?: boolean;
  id?: string | number;
  urlModalGetElement?: string;
  addModalUrl?: string;
  updateModalUrl?: string;
  searchTable: () => void;
  closeModalDropDown?: () => void;
}

// Função utilitária para criar ou atualizar objetos aninhados
export const setNestedValue = (
  obj: any,
  path: string[],
  value: string | number | Date | { id: number; value: string }
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
  if (value && typeof value === "object" && "id" in value) {
    value = value.value;
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
    const timeZone = "America/Sao_Paulo"; // Ajuste conforme necessário

    return new CalendarDate(year, month, day);
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

export interface ModalContentRef {
  triggerChildFunctionSendRequest: () => void;
  triggerChildFunctionEdit: () => void;
  triggerChildFunctionDelete: () => void;
}

export const ModalContent = forwardRef<ModalContentRef, CustomModalProps>(
  (props, ref) => {
    const {
      children,
      table = true,
      trigger,
      elementName,
      title,
      inputs,
      isIcon,
      id,
      urlModalGetElement,
      mobile,
      addModalUrl,
      updateModalUrl,
      searchTable,
      closeModalDropDown,
      isOpen,
      closeModal,
      isAddModal,
      isViewModal
    } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessIcon, setShowSuccessIcon] = useState(false);
    const [showErrorIcon, setShowErrorIcon] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [arrayErrors, setArrayErrors] = useState<
      Array<{ isValid: boolean; error: string; inputName: string }>
    >([]);
    const { createFormData } = useFormData();
    const [image, setImage] = useState<File | string>();
    const [imageUrl, setImageUrl] = useState<string>("");
    const { data: session } = useSession();
    const isMobile = useMediaQuery("(max-width: 768px)");

    const [isUpdate, setIsUpdate] = useState(false);
    const [isView, setIsView] = useState(isViewModal);
    const [isAdd, setIsAdd] = useState(isAddModal);
    const [isDelete, setIsDelete] = useState(false);

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
      if (isOpen == false && closeModalDropDown != undefined) {
        closeModalDropDown();
      }
    }, [isOpen, id, closeModalDropDown]);

    // Estado para armazenar os valores dos inputs
    const [inputValues, setInputValues] = useState<Record<string, any>>({});

    // Função para lidar com a mudança nos inputs
    const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement>,
      inputName: string,
      validation?: string
    ) => {
      const { name, value } = e.target;

      if (validation) {
        let objValidation = callValidations(validation, value);
        objValidation = { ...objValidation, inputName };
        const arrayValidation = arrayErrors.filter(
          (item) => item.inputName !== objValidation.inputName
        );
        setArrayErrors([...arrayValidation, objValidation]);
      }
      setInputValues((prevValues) => {
        const updatedValues = { ...prevValues };
        const path = name.split(".");
        setNestedValue(updatedValues, path, value);
        return updatedValues;
      });
    };

    const handleInputDateChange = (date: CalendarDate, path: string) => {
      setInputValues((prevValues) => {
        const updatedValues = { ...prevValues };
        const dateTime = date.toString();
        setNestedValue(updatedValues, path.split("."), new Date(dateTime));
        return updatedValues;
      });
    };

    useImperativeHandle(ref, () => ({
      triggerChildFunctionSendRequest: handleClick,
      triggerChildFunctionEdit: handleEditorView,
      triggerChildFunctionDelete: handleDelete,
    }));

    const handleEditorView = () => {
      if (isView) {
        setIsUpdate(true);
        setIsView(false);
      }
    };

    const handleDelete = () => {
      if (!isDelete) {
        setIsDelete(true);
        setIsView(false);
        setIsUpdate(false);
      }
    };

    const handleClick = async () => {
      if (arrayErrors.filter((item) => item.isValid == false).length > 0) {
        return false;
      }
      setIsSubmitting(true); // Inicia o estado de submissão
      setProgress(10); // Inicia a barra de progresso
      setShowSuccessIcon(false);
      setShowErrorIcon(false); // Garante que o ícone de erro não apareça antes do tempo
      setErrorMessage(""); // Reseta a mensagem de erro
      console.log(inputValues);
      try {
        const transformInputValues = (values: any) => {
          const transformedValues = { ...values };
          for (const key in transformedValues) {
            if (
              transformedValues[key] &&
              typeof transformedValues[key] === "object" &&
              "id" in transformedValues[key]
            ) {
              transformedValues[key] = transformedValues[key].id; // Substitui o objeto pelo id
            }
          }
          return transformedValues;
        };

        const processedInputValues = transformInputValues(inputValues);

        const method = isAdd
          ? "post"
          : isUpdate
          ? "patch"
          : isDelete
          ? "delete"
          : "get";

        if (image || method === "delete") {
          const formData = createFormData(
            [image as File],
            inputValues,
            "profile_image",
            "inputValues"
          );
          const response = await axios({
            method,
            url: isAdd
              ? addModalUrl
              : isUpdate
              ? `${updateModalUrl}/${id}`
              : `${urlModalGetElement}/${id}`,
            data: formData,
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${session?.user.token}`,
            },
            onUploadProgress: (progressEvent) => {
              const total = progressEvent.total || 1;
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / total
              );
              setProgress(percentCompleted);
            },
          });
        }

        setProgress(100);
        setShowSuccessIcon(true);
        searchTable();
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
      } finally {
        setIsSubmitting(false);
      }
    };

    const isError = (inputName: string) => {
      const objValidation = arrayErrors.filter(
        (item) => item.inputName === inputName
      );
      if (objValidation.length > 0) {
        return objValidation[0].error;
      } else {
        return "";
      }
    };

    const isValidFilter = (inputName: string, validation: string) => {
      const newArray = arrayErrors.filter(
        (item) => item.inputName === inputName
      );
      if (newArray.length > 0 && validation != "") {
        if (newArray[0].isValid) {
          return false;
        } else {
          return true;
        }
      } else {
        return false;
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
    }, [inputs, isOpen]);

    return (
      <>
        <div className={`flex flex-col items-center justify-center w-full gap-4 overflow-y-auto ${isDelete || showSuccessIcon || showErrorIcon && "h-full"} ${isSubmitting && "h-full"}`}>
          {/* {isDelete &&
            (inputValues?.name ? (
              <h1>
                Deseja deletar o {elementName} {inputValues.name}?
              </h1>
            ) : (
              <Skeleton className="h-3 w-full rounded-lg" />
            ))} */}

          {showSuccessIcon ? (
            <div className="flex flex-col justify-center items-center h-20">
              <AiFillCheckCircle className="text-green-700 h-24 w-24" />
              <p className="text-green-700 mt-2">
                {elementName}{" "}
                {isAdd ? "adicionado" : isUpdate ? "atualizado" : "deletado"}{" "}
                com sucesso!
              </p>
            </div>
          ) : showErrorIcon ? (
            <div className="flex flex-col justify-center items-center h-20">
              <MdError className="text-red-500 h-24 w-24" />
              <p className="text-red-500 mt-2">{errorMessage || `Erro ao ${isAdd ? "Adicionar" : (isUpdate ? "Editar" : (isDelete ? "Deletar": (isView && "Visualizar")))} ${elementName}`}</p>
            </div>
          ) : isSubmitting ? (
            <div className="w-full h-full flex flex-col justify-center md:px-10">
              <div className="relative pt-1">
                <p className="mb-2">{isAdd ? "Adicionando" : (isUpdate ? "Atualizando" : "Deletando")} {elementName}...</p>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                  <div
                    style={{ width: `${progress}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-700 transition-all duration-300"
                  ></div>
                </div>
              </div>
            </div>
          ) : !isDelete ? (
            inputs?.map((input) => (
              <div className="w-full max-h-96" key={input.name}>
                {isLoading &&
                input.type != "hidden" &&
                input.type != "password" ? (
                  <Skeleton className="rounded-lg max-w-full">
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
                        className="max-w-full"
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
                            : getNestedValue(inputValues, input.name.split("."))
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
                          className="max-w-full"
                          isReadOnly={isView}
                          isInvalid={isValidFilter(
                            input.name,
                            input.validation || ""
                          )}
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
                          onChange={(e) => {
                            handleInputChange(e, input.name, input.validation);
                          }}
                        />
                        <p className="text-[0.65rem] text-red-400 font-semibold mt-2">
                          {isError(input.name)}
                        </p>
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
                          className="max-w-full"
                          isReadOnly={isView}
                          isInvalid={isValidFilter(
                            input.name,
                            input.validation || ""
                          )}
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
                          onChange={(e) => {
                            handleInputChange(e, input.name, input.validation);
                          }}
                        />
                        <p className="text-[0.65rem] text-red-400 font-semibold mt-2">
                          {isError(input.name)}
                        </p>
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
                      />
                    )}
                  </>
                )}
              </div>
            ))
          ) : (
            (inputValues?.name ? (
              <div className="w-full h-[60vh] flex items-center md:justify-start justify-center rounded-lg">
                <h1>Deseja <span className="font-bold text-red-700">deletar</span> o {elementName} {inputValues.name}?</h1>
              </div>
            ) : (
              <Skeleton className="h-3 w-full rounded-lg" />
            ))
          )}
        </div>
        {isMobile && (
          <div className="fixed bottom-8 right-4 flex gap-6">
            {isView ? (
              <button
                onClick={handleEditorView}
                className="bg-gray-600 text-white p-4 rounded-full shadow-2xl border-3 border-solid border-gray-100"
              >
                <FaEdit className="w-6 h-6" />
              </button>
            ) : (
              <button onClick={handleClick} className="bg-blue-500 text-white p-4 rounded-full shadow-2xl border-3 border-solid border-gray-100">
                <FaCheck className="w-6 h-6" />
              </button>
            )}
            {!isAdd && !isDelete &&
            <button
              className="bg-white border-3 border-solid border-gray-200 text-red-500 p-4 rounded-full shadow-2xl"
              onClick={handleDelete} // Função para fechar o modal
            >
              <FaRegTrashCan className="w-6 h-6" />
            </button>
            }
            <button
              className="bg-red-500 text-white p-4 rounded-full shadow-2xl border-3 border-solid border-gray-100"
              onClick={closeModal} // Função para fechar o modal
            >
              <FaTimes className="w-6 h-6" />
            </button>
          </div>
        )}
        {/* <div>
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
      </div> */}
      </>
    );
  }
);

ModalContent.displayName = "ModalContent";

export const ModalZtTable = ({
  isOpen,
  onClose,
  children,
  title,
  isAddModal = true,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  isAddModal: boolean;
}) => {
  
  const modalContentRef = useRef<{
    triggerChildFunctionSendRequest?: () => void;
    triggerChildFunctionEdit: () => void;
    triggerChildFunctionDelete: () => void;
  }>(null);
  
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  
  if (!isOpen) return null; // Não renderiza a modal se ela estiver fechada
  
  const handleSendRequest = () => {
    if (modalContentRef.current?.triggerChildFunctionSendRequest) {
      modalContentRef.current.triggerChildFunctionSendRequest();
    }
  };

  const handleEditView = () => {
    setIsEdit(!isEdit);
    if (modalContentRef.current?.triggerChildFunctionEdit) {
      modalContentRef.current.triggerChildFunctionEdit();
    }
  };

  const handleDelete = () => {
    setIsDelete(!isDelete);
    if (modalContentRef.current?.triggerChildFunctionDelete) {
      modalContentRef.current.triggerChildFunctionDelete();
    }
  };

  const titleModal = isAddModal ? `Adicionando ` + title : (isEdit ? "Editando " : (isDelete ? "Deletando " : "Visualizando ")) + title;

  return (
    <div className="fixed inset-0 flex items-end md:items-center md:justify-center bg-black bg-opacity-50 z-50">
      <div className={`bg-white rounded-lg shadow-lg relative w-full h-[90%] md:w-1/3 ${isDelete? "md:max-h-[30vh]" : "md:max-h-[60vh]"} z-50 flex flex-col`}>
        {/* Header fixo */}
        <div className="flex justify-between items-center p-4 md:border-b border-gray-200 z-30 bg-slate-100 md:rounded-t-xl">
          <h1 className="text-lg font-bold">{titleModal}</h1>
          <button
            className="text-gray-500 hover:text-gray-800"
            onClick={onClose}
          >
            <AiOutlineClose />
          </button>
        </div>
        {/* Área rolável do conteúdo */}
        <div className={`overflow-y-auto p-4 flex-grow relative ${isDelete && "flex items-center justify-center"}`}>
          {React.cloneElement(children as React.ReactElement, {
            ref: modalContentRef,
          })}
        </div>

        {/* <span className="w-10 h-16 bg-gray-600 p-2 rounded-br-xl absolute top-9 left-0 text-white z-40 flex items-end justify-center"><FaEdit className="w-5 h-5" /></span> */}

        {/* Footer fixo */}
        <div className="p-4 border-t flex gap-4 border-gray-200">
          <button
            onClick={() => {setIsEdit(false); onClose(); setIsDelete(false);}}
            className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-400 duration-500 flex items-center gap-1"
          >
            <p>Fechar</p> <FaTimes />
          </button>
          {isEdit || isDelete || isAddModal ? (
            <button
              onClick={handleSendRequest}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-400 duration-500 flex items-center gap-2"
            >
              <p>{isDelete ? "Confirmar" : "Salvar"}</p>
              <FaCheck />
            </button>
          ) : (isAddModal == false && (
            <>
              <button
                onClick={handleEditView}
                className="bg-gray-600 text-white px-4 py-2 rounded-xl hover:bg-gray-400 duration-500 flex items-center gap-2"
              >
                <p>Editar</p>
                <FaEdit />
              </button>
              { !isAddModal &&
              <button
                onClick={handleDelete}
                className="bg-white font-semibold text-red-600 px-4 py-2 rounded-xl border border-solid border-red-600 hover:border-white hover:bg-red-400 hover:text-white duration-500 flex items-center gap-2"
              >
                <p>Deletar</p>
                <FaRegTrashCan />
              </button>
              }
            </>
          ))}
        </div>
      </div>
    </div>
  );
};
