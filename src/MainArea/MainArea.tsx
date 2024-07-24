import * as React from "react";
import { ContextScreen, useScreenContext } from "../contexts/ContextScreen";
import { useContext } from "react";

interface MainAreaProps {
  screens: Screen[],
}

interface Screen {
  id: number;
  component: any;
}

export const MainArea = ({screens}:MainAreaProps) => {
  const {idScreen} = useScreenContext();

  return(
    <div className="md:pl-[8%]">
      {
        screens.map((screen) =>(
          screen.id === idScreen && screen.component
        ))
      }
    </div>
  )
}