"use client";
import React, { useEffect } from "react";
import { MainArea } from "../MainArea/MainArea";
import { ProviderScreen } from "../providers/ProviderScreen";
import { ProviderTableCrud } from "../providers/ProviderTableCrud";
import { useScreenContext } from "../contexts/ContextScreen";
import { NavBar } from "../NavBar/NavBar";
import { useSession } from "next-auth/react";

export const Dashboard = ({
  screens,
  aside,
  topbar,
  navBarType,
  mainAreaStyle,
  logo,
  initialScreenId,
  children
}: {
  screens: Array<{ id: number; name: string; icon: string; library: string; component?: JSX.Element; route?:string }> ;
  aside?: boolean;
  topbar?: boolean;
  navBarType: "icon-bar" | "intra-bar";
  mainAreaStyle: any;
  logo?: JSX.Element;
  initialScreenId: number;
  children: React.ReactNode;
}) => {

  const { setidScreen } = useScreenContext();
  
  useEffect(() => {setidScreen(initialScreenId)}, []);
  return (
    <ProviderScreen>
      <ProviderTableCrud>
        <NavBar
          aside={aside}
          screens={screens}
          topbar={topbar}
          navBarType={navBarType}
          logo={logo}
        >
          <MainArea screens={screens} mainAreaStyle={mainAreaStyle}>{children}</MainArea>
        </NavBar>
      </ProviderTableCrud>
    </ProviderScreen>
  );
};
