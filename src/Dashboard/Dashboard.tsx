'use client'
import { SideBar } from "../SideBar/SideBar";
import React from "react";
import { MainArea } from "../MainArea/MainArea";
import { ProviderScreen } from "../providers/ProviderScreen";
import { ProviderTableCrud } from "../providers/ProviderTableCrud";

export const Dashboard = ({screens, aside}:{screens: any, aside?:boolean}) => {
  return (    
    <ProviderScreen>
      <ProviderTableCrud>
        <SideBar aside={aside} screens={screens}>
          <MainArea screens={screens}/>
        </SideBar>
      </ProviderTableCrud>
    </ProviderScreen>
  );
}