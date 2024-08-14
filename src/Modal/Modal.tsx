import React from "react";
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
import { FaUserEdit } from "react-icons/fa";

export default function Modal({
  trigger,
  elementName,
  title,
  inputs,
  isDelete, 
  isAdd,
  isUpdate,
  isView
}: {
  trigger: JSX.Element;
  elementName: string;
  title: string;
  inputs?: Array<{ label: string; value: string }>;
  isDelete?:boolean;
  isAdd?:boolean;
  isUpdate?:boolean;
  isView?:boolean;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <div onClick={onOpen}>{trigger}</div>
      <ModalUI isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
              <ModalBody>
                {isDelete && <h1>Deseja deletar o {elementName}?</h1>}
                {inputs?.map((input) => (
                  <Input placeholder={input.label}/>
                ))}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Fechar
                </Button>
                <Button color="primary" onPress={onClose}>
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
