import React, { useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FaCheck, FaEdit, FaTimes } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { useScreenContext } from "../contexts/ContextScreen";

export const ModalZtTable = ({
  isOpen,
  onClose,
  children,
  title,
  isAddModal = true,
  showButtonFooter = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  isAddModal?: boolean;
  showButtonFooter?: boolean;
}) => {
  const modalContentRef = useRef<{
    triggerChildFunctionSendRequest?: () => void;
    triggerChildFunctionEdit: () => void;
    triggerChildFunctionDelete: () => void;
  }>(null);

  const { actions } = useScreenContext();

  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

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

  const titleModal = showButtonFooter  ? (isAddModal
    ? `Adicionando ` + title
    : (isEdit ? "Editando " : isDelete ? "Deletando " : "Visualizando ") +
      title) : title;

  if (!isOpen) return null; // Não renderiza a modal se ela estiver fechada

  return (
    <div className="fixed inset-0 flex items-end md:items-center md:justify-center bg-black bg-opacity-50 z-50">
      <div
        className={`bg-white rounded-lg shadow-lg relative w-full h-[90%] md:w-1/3 ${
          isDelete ? "md:max-h-[30vh]" : "md:max-h-[60vh]"
        } z-50 flex flex-col`}
      >
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
        <div
          className={`overflow-y-auto p-4 flex-grow relative ${
            isDelete && "flex items-center justify-center"
          }`}
        >
          {React.cloneElement(children as React.ReactElement, {
            ref: modalContentRef,
          })}
        </div>

        {/* <span className="w-10 h-16 bg-gray-600 p-2 rounded-br-xl absolute top-9 left-0 text-white z-40 flex items-end justify-center"><FaEdit className="w-5 h-5" /></span> */}

        {/* Footer fixo */}
        {showButtonFooter && (
          <div className="p-4 border-t flex gap-4 border-gray-200">
            <button
              onClick={() => {
                setIsEdit(false);
                onClose();
                setIsDelete(false);
              }}
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
            ) : (
              isAddModal == false && (
                <>
                  <button
                    onClick={handleEditView}
                    className="bg-gray-600 text-white px-4 py-2 rounded-xl hover:bg-gray-400 duration-500 flex items-center gap-2"
                  >
                    <p>Editar</p>
                    <FaEdit />
                  </button>
                  {!isAddModal && actions.find((action) => action.id === 4) && (
                    <button
                      onClick={handleDelete}
                      className="bg-white font-semibold text-red-600 px-4 py-2 rounded-xl border border-solid border-red-600 hover:border-white hover:bg-red-400 hover:text-white duration-500 flex items-center gap-2"
                    >
                      <p>Deletar</p>
                      <FaRegTrashCan />
                    </button>
                  )}
                </>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};
