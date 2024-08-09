"use client";
import React, { Dispatch, SetStateAction, useContext, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { IconType } from "react-icons";
import {
  Button,
  DropdownMenu,
  Link,
  Tooltip,
  DropdownTrigger,
  Dropdown,
  DropdownItem,
  Avatar,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Image,
} from "@nextui-org/react";
import { ContextScreen, useScreenContext } from "../contexts/ContextScreen";
import { DynamicIcon } from "../DinamicIcon/DinamicIcon";
import { CiLogout } from "react-icons/ci";

interface MenuProps {
  linkItems: Array<{ id: number; name: string; icon: string; library: string }>;
}

const IntraBar = ({
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

const MenuItems = ({ linkItems }: MenuProps) => {
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
          <Button
            onClick={() => context.setidScreen(linkItem.id)}
            type="button"
            variant="light"
            isIconOnly
            className="flex h-10 w-10 items-center justify-center text-white rounded-lg transition-colors data-[hover=true]:bg-[#3248F2]"
          >
            <DynamicIcon
              size={20}
              iconName={linkItem.icon}
              library={linkItem.library}
            />
          </Button>
        </Tooltip>
      ))}
    </>
  );
};

interface SidebarRenderProps {
  children: React.ReactNode;
  screens: Array<{ id: number; name: string; icon: string; library: string }>;
  aside?: boolean;
  topbar?: boolean;
  navBarType: "icon-bar" | "intra-bar";
  logo?: JSX.Element;
}

export const SideBar = ({
  children,
  screens,
  aside,
  topbar,
  navBarType = "icon-bar",
  logo
}: SidebarRenderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();
  const context = useContext(ContextScreen);
  const {setNavBarType} = useScreenContext();

  useEffect(() => {
    setNavBarType(navBarType);
  },[])

  if (!context) {
    throw new Error("ContextScreen must be used within a ProviderScreen");
  }

  return (
    <div className="flex min-h-screen bg-background">
      {aside && (
        <aside
          className={`hidden md:flex md:flex-col ${navBarType == 'icon-bar' ? 'md:w-[8%]' : 'md:w-[15%]'} ${
            navBarType == "icon-bar" && "md:border-r"
          } md:bg-background md:fixed md:h-full`}
        >
          {topbar && (
            <div className="flex h-16 flex-col items-center justify-center border-b">
              <div className="font-extrabold text-black flex items-end relative">
                <Image src="./logo-cent-black.png" className="h-20 w-20" />
                <span className="sr-only">Logo escrita em imagem</span>
              </div>
            </div>
          )}
          {navBarType == "icon-bar" && (
            <nav className="flex flex-1 flex-col items-center justify-center gap-4 bg-black">
              <MenuItems linkItems={screens} />
            </nav>
          )}
          {navBarType == "intra-bar" && (
            <IntraBar screens={screens} setIsMenuOpen={setIsMenuOpen} />
          )}
        </aside>
      )}
      <div className="flex flex-1 flex-col">
        {topbar && (
          <Navbar
            isBordered
            isMenuOpen={isMenuOpen}
            onMenuOpenChange={setIsMenuOpen}
          >
            <NavbarContent className="md:hidden" justify="start">
              <NavbarMenuToggle
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              />
            </NavbarContent>
            <NavbarContent className="md:fixed md:left-3" justify="start">
              <NavbarBrand>
                {logo}
              </NavbarBrand>
            </NavbarContent>
            <NavbarContent className="md:fixed md:right-10" justify="end">
              <NavbarItem>
                <Dropdown>
                  <DropdownTrigger>
                    <Avatar
                      showFallback
                      src="https://images.unsplash.com/broken"
                      name={session?.user?.name as string}
                      size="md"
                      alt="Avatar"
                      className="overflow-hidden rounded-full cursor-pointer"
                    />
                  </DropdownTrigger>
                  <DropdownMenu>
                    <DropdownItem>Perfil</DropdownItem>
                    <DropdownItem showDivider>Pagamentos</DropdownItem>
                    <DropdownItem
                      className="text-red-500"
                      onClick={() => signOut()}
                    >
                      Sair
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </NavbarItem>
            </NavbarContent>
            <NavbarMenu>
              {screens.map((item, index) => (
                <NavbarMenuItem key={`${item.id}-${index}`}>
                  <Link
                    className="w-full gap-2"
                    color="foreground"
                    onClick={() => {
                      context.setidScreen(item.id);
                      setIsMenuOpen(!isMenuOpen);
                    }}
                    size="lg"
                  >
                    {item.icon}
                    {item.name}
                    <DynamicIcon iconName={item.icon} library={item.library} />
                  </Link>
                </NavbarMenuItem>
              ))}
            </NavbarMenu>
          </Navbar>
        )}
        <main className="flex-1 p-4 md:p-2 max-md:h-screen max-md:w-screen">
          {children}
        </main>
      </div>
    </div>
  );
};
