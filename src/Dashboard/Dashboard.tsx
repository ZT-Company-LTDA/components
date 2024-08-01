'use client'
import { SideBar } from "../SideBar/SideBar";
import React from "react";
import { MainArea } from "../MainArea/MainArea";
import { ProviderScreen } from "../providers/ProviderScreen";

export const Dashboard = ({screens}:{screens: any}) => {
  return (    
    <ProviderScreen>
      <SideBar screens={screens}>
        <MainArea screens={screens}/>
      </SideBar>
    </ProviderScreen>
  );
}