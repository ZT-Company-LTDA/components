import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import {
  Input,
  Checkbox,
  DatePicker,
  Skeleton,
} from "@nextui-org/react";
import { CalendarDate } from "@internationalized/date";
import { Select } from "../Select/Select";
import axios from "../utils/AxiosInstance";
import { MdError } from "react-icons/md";
import { AiFillCheckCircle } from "react-icons/ai";
import { callValidations } from "../utils/functions/callValidations";
import { UploadImageInput } from "../UploadImageInput/UploadImageInput";
import useFormData from "../hooks/useCreateFormDataDocument";
import { FaCheck, FaEdit, FaTimes } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { getNestedValue, setNestedValue } from "../utils/functions/modalValues";
import { toZonedDateTime } from "../utils/functions/zoneDateTime";
import { useScreenContext } from "../contexts/ContextScreen";
import { parseCookies } from "nookies";

export const ModalContent = forwardRef<ModalContentRef, ModalProps>(
  (props, ref) => {
    const {
      elementName,
      inputs,
      id,
      urlModalGetElement,
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
    const [showErrorIcon, setShowErrorIcon] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [arrayErrors, setArrayErrors] = useState<
      Array<{ isValid: boolean; error: string; inputName: string }>
    >([]);
    const { createFormData } = useFormData();
    const [image, setImage] = useState<File | string>();
    const [imageUrl, setImageUrl] = useState<string>("");
    const isMobile = useMediaQuery("(max-width: 768px)");
    const { actions } = useScreenContext();

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
            } catch (error) {
              console.error("Erro ao buscar os dados:", error);
              setShowErrorIcon(true);
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
              Authorization: `Bearer ${parseCookies().token}`,
            },
            onUploadProgress: (progressEvent) => {
              const total = progressEvent.total || 1;
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / total
              );
              setProgress(percentCompleted);
            },
          });
          setProgress(100);
          setShowSuccessIcon(true);
          searchTable();
          setTimeout(() => {
          setShowSuccessIcon(false);
          }, 2500);
        } else {
          setShowErrorIcon(true);
          setTimeout(() => {
            setShowErrorIcon(false);
          }, 4000);
          if(method === "post"){
            setErrorMessage(`Preencha todos os campos e insira uma imagem para adicionar o ${elementName}`);
          } else if (method === "patch"){
            setErrorMessage(`Preencha todos os campos e insira uma imagem para atualizar o ${elementName}`);
          } else {
            setErrorMessage(`Erro ao deletar o ${elementName}`);
          }
        }
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
            {!isAdd && !isDelete && actions.find((action) => action.id === 4) &&
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
      </>
    );
  }
);

ModalContent.displayName = "ModalContent";