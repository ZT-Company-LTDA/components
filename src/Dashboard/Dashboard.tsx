'use client'
import { SideBar } from "../SideBar/SideBar";
import React from "react";
import { MainArea } from "../MainArea/MainArea";
import { ProviderScreen } from "../providers/ProviderScreen";
import { ProviderTableCrud } from "../providers/ProviderTableCrud";

export const Dashboard = ({screens}:{screens: any}) => {
  return (    
    <ProviderScreen>
      <ProviderTableCrud>
        <SideBar screens={screens}>
          <MainArea screens={screens}/>
        </SideBar>
      </ProviderTableCrud>
    </ProviderScreen>
  );
}