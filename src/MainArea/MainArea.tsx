import * as React from "react";
import { ContextScreen, useScreenContext } from "../contexts/ContextScreen";
import { useContext, useEffect } from "react";
import { useTableCrudContext } from "../contexts/ContextTableCrud";
import { usePathname } from "next/navigation";

interface MainAreaProps {
  screens: Array<{ id: number; name: string; icon: string; library: string; component?: JSX.Element; route?:string }>;
  mainAreaStyle:any
  children: React.ReactNode
}

interface Screen {
  id: number;
  component: any;
  route:string
}

export const MainArea = ({screens, mainAreaStyle, children}:MainAreaProps) => {
  const {idScreen, navBarType} = useScreenContext();
  const {setArrayFilters} = useTableCrudContext();
  const pathname = usePathname()
  
  useEffect(() => {
    setArrayFilters([])
  }, [idScreen, setArrayFilters])

  return(
    <div className={`h-full w-full md:w-[85%] md:z-50 p-4 ${mainAreaStyle.backgroundColor}`}>
      {
        screens.map((screen) =>(
          pathname.startsWith(`/dashboard/${screen.route?.toLowerCase()}`) && children
        ))
      }
    </div>
  )
}