"use client";
import { signOut, useSession } from "next-auth/react";
import { Dispatch, SetStateAction, useState } from "react";
import { IoDocumentAttach } from "react-icons/io5";
import { HiIdentification } from "react-icons/hi2";
import { IconType } from "react-icons";
import { Button, DropdownMenu, Link, Tooltip, DropdownTrigger, Dropdown, DropdownItem, Avatar, Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle, Image } from "@nextui-org/react";
import { CiSettings } from "react-icons/ci";
import { FaUserFriends } from "react-icons/fa";
import React = require("react");

interface LinkItemProps {
  name: string;
  icon: IconType;
  view: number;
  function?:any
}
interface SidebarRenderProps {
  children: JSX.Element;
  setView: Dispatch<SetStateAction<number>>;
}
interface MenuProps {
  setView: Dispatch<SetStateAction<number>>;
}

const linkItems: Array<LinkItemProps> = [
  { name: 'Documentos', icon: IoDocumentAttach, view: 1},
  { name: 'Clientes',   icon: FaUserFriends, view: 2},
  { name: 'Criar CNPJ', icon: HiIdentification, view: 3},
  { name: 'Configurações', icon: CiSettings ,   view: 4},
];

const MenuItems = ({ setView}: MenuProps) => {
  return (
    <>
      {linkItems.map((linkItem, index) => (
        <Tooltip placement="right" content={linkItem.name} key={linkItem.view} closeDelay={0}>
          <Button
            onClick={() =>setView(linkItem.view)}
            type="button"
            variant="light"
            isIconOnly
            className="flex h-10 w-10 items-center justify-center text-white rounded-lg transition-colors data-[hover=true]:bg-[#3248F2]"
          >
            <linkItem.icon className="h-5 w-5" />
          </Button>
        </Tooltip>
      ))}
    </>
  );
};

export const SideBar = ({ children, setView}: SidebarRenderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <div className="flex min-h-screen bg-background">
      {
        <aside className="hidden md:flex md:flex-col md:w-[8%] md:border-r md:bg-background md:fixed md:h-full">
          <div className="flex h-16 flex-col items-center justify-center border-b">
            <div className="font-extrabold text-black flex items-end relative">
              <Image
                src="./logo-cent-black.png"
                className="h-20 w-20"
              />
              <span className="sr-only">Logo escrita em imagem</span>
            </div>
          </div>
          <nav className="flex flex-1 flex-col items-center justify-center gap-4 bg-black">
            <MenuItems setView={setView}/>
          </nav>
        </aside>
      }
      <div className="flex flex-1 flex-col">
        <Navbar
          isBordered
          isMenuOpen={isMenuOpen}
          onMenuOpenChange={setIsMenuOpen}
        >
          <NavbarContent className="md:hidden" justify="start">
            <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
          </NavbarContent>
          
          <NavbarContent className='md:fixed md:left-3' justify="start">
            <NavbarBrand>
              <Image
                src="/cent-black.png"
                className="h-20 w-20"
              />
            </NavbarBrand>
          </NavbarContent>

          <NavbarContent className='md:fixed md:right-10' justify="end">
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
                  <DropdownItem className="text-red-500" onClick={()=> signOut()}>Sair</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </NavbarItem>
          </NavbarContent>

          <NavbarMenu>
            {linkItems.map((item, index) => (
              <NavbarMenuItem key={`${item.view}-${index}`}>
                <Link
                  className="w-full gap-2"
                  color={
                    "foreground"
                  }
                  onClick={() =>{ 
                    setView(item.view)
                    setIsMenuOpen(!isMenuOpen)
                  }}
                  size="lg"
                >
                  <item.icon/>{item.name}
                </Link>
              </NavbarMenuItem>
            ))}
          </NavbarMenu>

        </Navbar>

        {/* <header className="sticky top-0 z-20 flex h-14 w-full items-center justify-between border-b bg-background px-4 md:h-14 md:px-6 ">
          <div className="flex items-center gap-4">
            <div className={`font-extrabold text-black flex items-end relative`}>
              <Image
                src="/cent-black.png"
                width={150}
                height={150}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Dropdown>
              <DropdownTrigger>
                <Avatar
                  showFallback 
                  src="https://images.unsplash.com/broken"
                  name={session?.user.name}
                  size="md"
                  alt="Avatar"
                  className="overflow-hidden rounded-full cursor-pointer"
                />
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem>Perfil</DropdownItem>
                <DropdownItem showDivider>Pagamentos</DropdownItem>
                <DropdownItem className="text-red-500" onClick={()=> signOut()}>Sair</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </header> */}
        <main className="flex-1 p-4 md:p-2 max-md:h-screen max-md:w-screen">
          {children}
        </main>
      </div>
    </div>
  );
};