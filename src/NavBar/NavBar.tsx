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
  Navbar as NavBarUI,
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
import { IntraBar } from "./InfraBar/Intrabar";
import { IconBar } from "./IconBar/IconBar";
import { NavBarProps } from "./interfaces/navBar.interface";

export const NavBar = ({
  children,
  screens,
  aside,
  topbar,
  navBarType = "icon-bar",
  logo
}: NavBarProps) => {
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
                {logo}
                <span className="sr-only">Logo escrita em imagem</span>
              </div>
            </div>
          )}
          {navBarType == "icon-bar" && (
            <nav className="flex flex-1 flex-col items-center justify-center gap-4 bg-black">
              <IconBar linkItems={screens} />
            </nav>
          )}
          {navBarType == "intra-bar" && (
            <IntraBar screens={screens} setIsMenuOpen={setIsMenuOpen} />
          )}
        </aside>
      )}
      <div className="flex flex-1 flex-col">
        {topbar && (
          <NavBarUI
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
                    href={`/dashboard/${item.route?.toLowerCase()}`}
                    className="w-full gap-2"
                    color="foreground"
                    onClick={() => {
                      context.setidScreen(item.id);
                      setIsMenuOpen(!isMenuOpen);
                    }}
                    size="lg"
                  >
                    <DynamicIcon iconName={item.icon} library={item.library} />
                    {item.name}
                  </Link>
                </NavbarMenuItem>
              ))}
            </NavbarMenu>
          </NavBarUI>
        )}
        <main className="flex h-full md:w-full items-end justify-end p-3 md:p-0 max-md:h-screen max-md:w-screen">
          {children}
        </main>
      </div>
    </div>
  );
};
