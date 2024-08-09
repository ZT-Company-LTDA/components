import { Spinner } from "@nextui-org/react";
import Image from "next/image";
import React from "react";

export const Loading = ({background = true}:{background?:boolean}) => {
  return (
    (!background)
    ?
    <Image className="animate-pulse" src="/EvoluABA.png" width={120} height={120} alt="Logo" />
    :
    <div className="bg-white h-screen w-screen flex flex-col items-center justify-center">
      <Image className="animate-pulse" src="/EvoluABA.png" width={120} height={120} alt="Logo" />
    </div>
  );
};
