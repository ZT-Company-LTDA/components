import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as MdIcons from 'react-icons/md';
import * as IoIcons from 'react-icons/io';
import * as FiIcons from 'react-icons/fi';
import * as RioIcons from 'react-icons/ri';

type IconLibraries = {
  [key: string]: { [key: string]: React.ComponentType<{ size?: number; color?: string; className?: string }> };
};

const iconLibraries: IconLibraries = {
  fa: FaIcons,
  md: MdIcons,
  io: IoIcons,
	fi: FiIcons,
	ri: RioIcons
};

interface DynamicIconProps {
  library: string;
  iconName: string;
  size?: number;
  color?: string;
  className?: string;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ library, iconName, size, color, className }) => {
  const IconLibrary = iconLibraries[library];
  if (!IconLibrary) {
    return <span>Library not found</span>;
  }

  const IconComponent = IconLibrary[iconName];
  if (!IconComponent) {
    return <span>Icon not found</span>;
  }

  return <IconComponent size={size} color={color} className={className} />;
};

