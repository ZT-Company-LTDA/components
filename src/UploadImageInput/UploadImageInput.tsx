import React, { useEffect, useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai"; // Exemplo de ícone; você pode escolher outro
import { setNestedValue } from "../Modal/Modal";

export const UploadImageInput = ({
  setInputValues,
  setImage,
  image,
  setImageUrl,
  imageUrl,
}: {
  setInputValues: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  setImage: React.Dispatch<React.SetStateAction<File | undefined>>;
  image: File | undefined;
  setImageUrl: React.Dispatch<React.SetStateAction<string>>,
  imageUrl:string,
}) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(imageUrl);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(URL.createObjectURL(file!));
    setImage(file);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 bg-gray-100 flex items-center justify-center">
        {/* Input para escolher o arquivo */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        {/* Exibição da imagem selecionada */}
        {selectedFile ? (
          <img
            src={selectedFile}
            alt="Selected"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col justify-center text-center items-center w-full h-full text-gray-500">
            <AiOutlineCloudUpload className="text-3xl mb-2" />
            <p className="text-xs">Escolher Arquivo</p>
          </div>
        )}
      </div>
    </div>
  );
};
