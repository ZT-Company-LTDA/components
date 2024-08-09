import * as React from "react";
import { ContextScreen, useScreenContext } from "../contexts/ContextScreen";
import { useContext, useEffect } from "react";
import { useTableCrudContext } from "../contexts/ContextTableCrud";

interface MainAreaProps {
  screens: Screen[],
  mainAreaStyle:any
}

interface Screen {
  id: number;
  component: any;
}

export const MainArea = ({screens, mainAreaStyle}:MainAreaProps) => {
  const {idScreen, navBarType} = useScreenContext();
  const {setArrayFilters} = useTableCrudContext();
  
  useEffect(() => {
    setArrayFilters([])
  }, [idScreen])

  return(
    <div className={`${navBarType =='icon-bar' ? 'md:pl-[8%]' : 'md:pl-[15%]'} h-full w-full ${mainAreaStyle.backgroundColor}`}>
      {
        screens.map((screen) =>(
          screen.id === idScreen && screen.component
        ))
      }
    </div>
  )
}