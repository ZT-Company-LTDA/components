import * as React from "react";
import { ContextScreen, useScreenContext } from "../contexts/ContextScreen";
import { useContext, useEffect } from "react";
import { useTableCrudContext } from "../contexts/ContextTableCrud";

interface MainAreaProps {
  screens: Screen[],
}

interface Screen {
  id: number;
  component: any;
}

export const MainArea = ({screens}:MainAreaProps) => {
  const {idScreen} = useScreenContext();
  const {setArrayFilters} = useTableCrudContext();
  
  useEffect(() => {
    setArrayFilters([])
  }, [idScreen])

  return(
    <div className="md:pl-[8%] h-full w-full">
      {
        screens.map((screen) =>(
          screen.id === idScreen && screen.component
        ))
      }
    </div>
  )
}