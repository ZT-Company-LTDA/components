import Image from 'next/image';
import React, { useState } from 'react';

interface AvatarProps {
  src: string;
  alt?: string;
  size?: number;
  borderWidth?: number; // Para definir a largura da borda (opcional)
}

const Avatar: React.FC<AvatarProps> = ({ src, alt = 'Avatar', size = 50, borderWidth = 2 }) => {
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar o carregamento da imagem

  const handleLoad = () => {
    setIsLoading(false); // Define o estado para falso quando a imagem é carregada
  };

  return (
    <div
      className="flex items-center justify-center rounded-2xl border border-solid border-gray-300"
      style={{
        width: `${(size + 3) + borderWidth * 2}px`,
        height: `${(size + 3) + borderWidth * 2}px`,
        borderWidth: `${borderWidth}px`,
        borderStyle: 'solid',
      }}
    >
      {isLoading && (
        <div className="animate-pulse rounded-2xl bg-gray-300" style={{
          width: `${size}px`,
          height: `${size}px`,
        }} />
      )}
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        loading="eager"
        className={`rounded-2xl object-cover w-full h-full ${isLoading ? 'hidden' : ''}`} // Esconde a imagem enquanto está carregando
        onLoad={handleLoad} // Manipulador que define o estado quando a imagem é carregada
      />
    </div>
  );
};

export default Avatar;