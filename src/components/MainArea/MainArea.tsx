import React = require("react");

interface MainAreaProps {
  screens: Screen[],
  idView: number
}

interface Screen {
  id: number;
  component: JSX.Element;
}

export const MainArea = ({screens, idView}:MainAreaProps) => {

  return(
    <div className="md:pl-[8%]">
      {
        screens.map((screen) =>(
          screen.id === idView && screen.component
        ))
      }
      <h1>OLAAAAAAAAAAAAAAAAAAAAAAAAAA</h1>
    </div>
  )
}