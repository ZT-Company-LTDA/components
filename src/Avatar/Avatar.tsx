import React from 'react';

interface AvatarProps {
  src: string;
  alt?: string;
  size?: number;
  borderWidth?: number; // Para definir a largura da borda (opcional)
}

const Avatar: React.FC<AvatarProps> = ({ src, alt = 'Avatar', size = 50, borderWidth = 2 }) => {
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
      <img
        src={src}
        alt={alt}
        className="rounded-2xl object-cover"
        style={{ width: `${size}px`, height: `${size}px` }}
      />
    </div>
  );
};

export default Avatar;
