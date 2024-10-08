import { Image } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai"; // Exemplo de ícone; você pode escolher outro

export const UploadImageInput = ({
  isView,
  setImage,
  setImageUrl,
  imageUrl,
}: {
  isView: boolean | undefined;
  setImage: React.Dispatch<React.SetStateAction<File | string | undefined>>;
  setImageUrl: React.Dispatch<React.SetStateAction<string>>,
  imageUrl:string,
}) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(imageUrl);

  useEffect(() => {
    if (imageUrl) {
      setImage(imageUrl);
      setSelectedFile(imageUrl);
    }
  }, [imageUrl, setImage]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(URL.createObjectURL(file!));
    setImage(file);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-gray-300 bg-gray-100 flex">
        {/* Input para escolher o arquivo */}
        <input
          type="file"
          title="Clique para escolher um arquivo"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isView}
          className="absolute inset-0 opacity-0 cursor-pointer z-40"
        />
        {/* Exibição da imagem selecionada */}
        {selectedFile ? (
          <Image
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
