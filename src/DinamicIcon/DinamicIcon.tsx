import React from "react";
import * as FaIcons from "react-icons/fa";
import * as FaIcons6 from "react-icons/fa6";
import * as MdIcons from "react-icons/md";
import * as IoIcons from "react-icons/io";
import * as FiIcons from "react-icons/fi";
import * as RioIcons from "react-icons/ri";
import * as Io5Icons from "react-icons/io5";
import * as HiIcons from "react-icons/hi2";
import * as CiIcons from "react-icons/ci";
import * as BsIcons from "react-icons/bs";
import * as CgIcons from "react-icons/cg";
import * as BiIcons from "react-icons/bi";

type IconLibraries = {
  [key: string]: {
    [key: string]: React.ComponentType<{
      size?: number;
      color?: string;
      className?: string;
    }>;
  };
};

const iconLibraries: IconLibraries = {
  fa: FaIcons,
  fa6: FaIcons6,
  md: MdIcons,
  io: IoIcons,
  fi: FiIcons,
  ri: RioIcons,
  io5: Io5Icons,
  hi2: HiIcons,
  ci: CiIcons,
  bs: BsIcons,
  cg: CgIcons,
  bi: BiIcons,
};

interface DynamicIconProps {
  library: string;
  iconName: string;
  size?: number;
  color?: string;
  className?: string;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({
  library,
  iconName,
  size,
  color,
  className,
}) => {
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
