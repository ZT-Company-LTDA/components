"use client"
import React, { useContext } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import { IconType } from 'react-icons';
import { Button, DropdownMenu, Link, Tooltip, DropdownTrigger, Dropdown, DropdownItem, Avatar, Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle, Image } from "@nextui-org/react";
import { ContextScreen } from '../contexts/ContextScreen';
import { DynamicIcon } from '../DinamicIcon/DinamicIcon';

interface MenuProps {
  linkItems: Array<{ id: number, name: string, icon: string, library:string }>;
}

const MenuItems = ({ linkItems }: MenuProps) => {
  const context = useContext(ContextScreen);

  if (!context) {
    throw new Error('ContextScreen must be used within a ProviderScreen');
  }

  return (
    <>
      {linkItems.map((linkItem, index) => (
        <Tooltip placement="right" content={linkItem.name} key={linkItem.id} closeDelay={0}>
          <Button
            onClick={() => context.setidScreen(linkItem.id)}
            type="button"
            variant="light"
            isIconOnly
            className="flex h-10 w-10 items-center justify-center text-white rounded-lg transition-colors data-[hover=true]:bg-[#3248F2]"
          >
            <DynamicIcon iconName={linkItem.icon} library={linkItem.library}/>
          </Button>
        </Tooltip>
      ))}
    </>
  );
};

interface SidebarRenderProps {
  children: React.ReactNode;
  screens: Array<{ id: number, name: string, icon: string, library:string }>;
  aside?: boolean;
}

export const SideBar = ({ children, screens, aside }: SidebarRenderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();
  const context = useContext(ContextScreen);

  if (!context) {
    throw new Error('ContextScreen must be used within a ProviderScreen');
  }

  return (
    <div className="flex min-h-screen bg-background">
      {aside && <aside className="hidden md:flex md:flex-col md:w-[8%] md:border-r md:bg-background md:fixed md:h-full">
        <div className="flex h-16 flex-col items-center justify-center border-b">
          <div className="font-extrabold text-black flex items-end relative">
            <Image src="./logo-cent-black.png" className="h-20 w-20" />
            <span className="sr-only">Logo escrita em imagem</span>
          </div>
        </div>
        <nav className="flex flex-1 flex-col items-center justify-center gap-4 bg-black">
          <MenuItems linkItems={screens} />
        </nav>
      </aside>}
      <div className="flex flex-1 flex-col">
        <Navbar isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
          <NavbarContent className="md:hidden" justify="start">
            <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
          </NavbarContent>
          <NavbarContent className='md:fixed md:left-3' justify="start">
            <NavbarBrand>
              <Image src="/cent-black.png" className="h-20 w-20" />
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
                  <DropdownItem className="text-red-500" onClick={() => signOut()}>Sair</DropdownItem>
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
                  {item.icon}{item.name}
                  <DynamicIcon iconName={item.icon} library={item.library}/>
                </Link>
              </NavbarMenuItem>
            ))}
          </NavbarMenu>
        </Navbar>
        <main className="flex-1 p-4 md:p-2 max-md:h-screen max-md:w-screen">
          {children}
        </main>
      </div>
    </div>
  );
};
