import { Dispatch, SetStateAction, useState } from "react";
import { useScreenContext } from "../../contexts/ContextScreen";
import React from "react";
import { Link } from "@nextui-org/react";
import { DynamicIcon } from "../../DinamicIcon/DinamicIcon";

export const IntraBar = ({
  screens,
  setIsMenuOpen,
}: {
  screens: any[];
  setIsMenuOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { setidScreen } = useScreenContext();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleSelected = (index: number, id: number) => {
    setSelectedIndex(index);
    setidScreen(id);
    setIsMenuOpen(false);
  };
  return (
    <nav className="flex flex-1 flex-col items-center justify-start gap-4 z-50 bg-red-800 text-gray-900 pt-8">
      <ul className="h-3/4 w-full flex flex-col items-center text-base gap-1">
        {screens.map((item, index) => (
          <li
            key={`${item}-${index}`}
            className={`h-12 min-h-12 w-full flex items-center text-center rounded-l-full relative ${
              selectedIndex === index &&
              "bg-white text-gray-50 animation_selected"
            }`}
          >
            {selectedIndex === index && (
              <>
                <span className="h-20 w-5 bg-white absolute -top-4 right-0"></span>
                <span
                  className="h-9 w-9 bg-red-800 absolute -top-9 right-0 rounded-full half-circle"
                  id="none_animation"
                ></span>
                <span
                  className="h-9 w-9 bg-red-800 absolute top-12 right-0 rounded-full"
                  id="none_animation"
                ></span>
              </>
            )}
            <Link
              className="w-full flex items-center justify-center gap-2"
              href="#"
              onClick={() => handleSelected(index, item.id)}
            >
              <DynamicIcon
                iconName={item.icon}
                library={item.library}
                size={20}
                className={`${
                  selectedIndex === index ? "text-gray-800" : "text-gray-50"
                }`}
              />
              <p
                className={`${
                  selectedIndex === index ? "text-gray-800 font-semibold" : "text-gray-50 font-semibold"
                }`}
              >
                {item.name}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};