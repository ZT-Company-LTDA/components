import React from 'react';

interface ChipProps {
  text: string;
  color: string;
}

const Chip: React.FC<ChipProps> = ({ text, color }) => {
  return (
    <span
      className={`px-3 py-1 rounded-full text-green-950 text-sm font-normal ${color}`}
    >
      {text}
    </span>
  );
};

export default Chip;