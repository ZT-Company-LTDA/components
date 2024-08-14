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

export default function Modal({
  trigger,
  elementName,
  title,
  inputs,
  isDelete,
  isAdd,
  isUpdate,
  isView,
}: {
  trigger: JSX.Element;
  elementName: string;
  title: string;
  inputs?: Array<{ label: string; value: string; name: string }>;
  isDelete?: boolean;
  isAdd?: boolean;
  isUpdate?: boolean;
  isView?: boolean;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  
  // Estado para armazenar os valores dos inputs
  const [inputValues, setInputValues] = useState<Record<string, string>>({});

  // Função para lidar com a mudança nos inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValues((prevValues) => ({
      ...prevValues,
      [name]: value, // Atualiza o valor correspondente no objeto JSON
    }));
  };

  // Função para lidar com a confirmação (ex: enviar dados)
  const handleConfirm = () => {
    // Aqui você pode utilizar o objeto inputValues conforme necessário
    console.log("JSON criado:", inputValues);
    // Implementar lógica adicional como enviar para uma API, etc.
  };

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
                  <Input
                    key={input.name}
                    name={input.name}
                    placeholder={input.label}
                    value={inputValues[input.name] || ""}
                    onChange={handleInputChange}
                  />
                ))}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Fechar
                </Button>
                <Button color="primary" onPress={() => {
                  handleConfirm();
                  onClose();
                }}>
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
