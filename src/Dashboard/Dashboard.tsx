'use client'
import { SideBar } from "../SideBar/SideBar";
import React from "react";
import { MainArea } from "../MainArea/MainArea";
import { ProviderScreen } from "../providers/ProviderScreen";
import { ProviderTableCrud } from "../providers/ProviderTableCrud";
import { useScreenContext } from "../contexts/ContextScreen";

export const Dashboard = ({screens, aside, topbar, navBarType, mainAreaStyle}:{screens: any, aside?:boolean, topbar?:boolean, navBarType: 'icon-bar' | 'intra-bar', mainAreaStyle:any}) => {
  return (    
    <ProviderScreen>
      <ProviderTableCrud>
        <SideBar aside={aside} screens={screens} topbar={topbar} navBarType={navBarType}>
          <MainArea screens={screens} mainAreaStyle={mainAreaStyle}/>
        </SideBar>
      </ProviderTableCrud>
    </ProviderScreen>
  );
}