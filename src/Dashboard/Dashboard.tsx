'use client'
import React from "react";
import { MainArea } from "../MainArea/MainArea";
import { ProviderScreen } from "../providers/ProviderScreen";
import { ProviderTableCrud } from "../providers/ProviderTableCrud";
import { useScreenContext } from "../contexts/ContextScreen";
import { NavBar } from "../NavBar/NavBar";

export const Dashboard = ({screens, aside, topbar, navBarType, mainAreaStyle, logo}:{screens: any, aside?:boolean, topbar?:boolean, navBarType: 'icon-bar' | 'intra-bar', mainAreaStyle:any, logo?:JSX.Element}) => {
  return (    
    <ProviderScreen>
      <ProviderTableCrud>
        <NavBar aside={aside} screens={screens} topbar={topbar} navBarType={navBarType} logo={logo}>
          <MainArea screens={screens} mainAreaStyle={mainAreaStyle}/>
        </NavBar>
      </ProviderTableCrud>
    </ProviderScreen>
  );
}