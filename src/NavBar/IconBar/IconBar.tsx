import { useContext } from "react";
import { ContextScreen } from "../../contexts/ContextScreen";
import React from "react";
import { Tooltip } from "@nextui-org/react";
import { DynamicIcon } from "../../DinamicIcon/DinamicIcon";
import { MenuProps } from "../interfaces/iconBar.interface";
import Link from "next/link";

export const IconBar = ({ linkItems }: MenuProps) => {
  const context = useContext(ContextScreen);

  if (!context) {
    throw new Error("ContextScreen must be used within a ProviderScreen");
  }

  return (
    <>
      {linkItems.map((linkItem, index) => (
        <Tooltip
          placement="right"
          content={linkItem.name}
          key={linkItem.id}
          closeDelay={0}
        >
          <Link
            href={`/dashboard/${linkItem.route}`}
            type="button"
            className="flex h-10 w-10 items-center justify-center text-white rounded-lg transition-colors duration-400 hover:bg-[#3248F2]"
          >
            <DynamicIcon
              size={20}
              iconName={linkItem.icon}
              library={linkItem.library}
            />
          </Link>
        </Tooltip>
      ))}
    </>
  );
};