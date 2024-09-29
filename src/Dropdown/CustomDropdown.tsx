import React, { useState, useEffect, useRef } from "react";
import { AiOutlineMore, AiOutlineUserDelete } from "react-icons/ai";
import { IoEyeOutline } from "react-icons/io5";
// import Modal from "../Modal/Modal";
import { FaUserEdit } from "react-icons/fa";
import { useScreenContext } from "../contexts/ContextScreen";

interface CustomDropdownProps {
  element: { id: string };
  elementName: string;
  modalInputs: any;
  isMobile: boolean;
  urlModalGetElement?: string;
  searchTable: () => void;
  updateModalUrl?: string;
}

interface ModalTypes {
  modalId: "info" | "edit" | "delete";
}

export const CustomDropdown = ({
  element,
  elementName,
  modalInputs,
  isMobile,
  urlModalGetElement,
  searchTable,
  updateModalUrl,
}: CustomDropdownProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalTypes | undefined>();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { actions } = useScreenContext();

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const openModal = (modalId: ModalTypes["modalId"]) =>
    setActiveModal({ modalId });
  const closeModal = () => {
    setIsModalOpen(false);
    setActiveModal(undefined);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isModalOpen) {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsDropdownOpen(false);
        }
      } else {
        setIsModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  const handleAction = (key: string) => {
    if (key === "info") {
      console.log("keyinfo :>> ", key);
      openModal("info");
      setIsModalOpen(true);
    }
    if (key === "edit") {
      console.log("keyedit :>> ", key);
      openModal("edit");
      setIsModalOpen(true);
    }
    if (key === "delete") {
      console.log("keydelete :>> ", key);
      openModal("delete");
      setIsModalOpen(true);
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="inline-flex justify-center items-center w-10 h-10 rounded-full border border-gray-300 shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <AiOutlineMore className="w-6 h-6" />
      </button>

      {isDropdownOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {actions.find((action) => action.id == 1) && (
              <div
                onClick={() => handleAction("info")}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                role="menuitem"
              >
                <IoEyeOutline className="mr-3" />
                {/* <Modal
                  id={element.id}
                  elementName={elementName}
                  inputs={modalInputs}
                  trigger={<></>}
                  isView
                  mobile={isMobile}
                  title={`Detalhes ${elementName}`}
                  urlModalGetElement={urlModalGetElement}
                  closeModalDropDown={closeModal}
                /> */}
              </div>
            )}
            {actions.find((action) => action.id == 3) && (
              <div
                onClick={() => handleAction("edit")}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                role="menuitem"
              >
                <FaUserEdit className="mr-3" />
                {/* <Modal
                  id={element.id}
                  elementName={elementName}
                  inputs={modalInputs}
                  trigger={<></>}
                  mobile={isMobile}
                  isUpdate
                  searchTable={searchTable}
                  updateModalUrl={updateModalUrl}
                  title={`Editar ${elementName}`}
                  urlModalGetElement={urlModalGetElement}
                  closeModalDropDown={closeModal}
                /> */}
              </div>
            )}
            {actions.find((action) => action.id == 4) && (
              <div
                onClick={() => handleAction("delete")}
                className="flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-100 hover:text-red-900 cursor-pointer"
                role="menuitem"
              >
                <AiOutlineUserDelete className="mr-3" />
                {/* <Modal
                  id={element.id}
                  elementName={elementName}
                  trigger={<></>}
                  mobile={isMobile}
                  searchTable={searchTable}
                  isDelete
                  title={`Deletar ${elementName}`}
                  urlModalGetElement={urlModalGetElement}
                  closeModalDropDown={closeModal}
                /> */}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
