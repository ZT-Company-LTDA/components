'use client'
import { SideBar } from "../SideBar/SideBar";
import React from "react";
import { MainArea } from "../MainArea/MainArea";
import { ProviderScreen } from "../providers/ProviderScreen";

export const Dashboard = ({screens, linkItems}:{linkItems: any, screens: any}) => {
  return (    
    <ProviderScreen>
      <SideBar linkItems={linkItems}>
        <MainArea screens={screens}/>
      </SideBar>
    </ProviderScreen>
  );
}