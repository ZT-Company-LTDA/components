import { Spinner } from "@nextui-org/react";
import Image from "next/image";
import React from "react";

export const Loading = ({background = true, tableLoading = false}:{background?:boolean; tableLoading?:boolean}) => {
  return (
    (!background)
    ?
    <Image className="animate-pulse" src="/EvoluABA.png" width={120} height={120} alt="Logo" />
    :
    <div className={`bg-white ${tableLoading ? "h-screen w-screen" : "h-full w-full"} flex flex-col items-center justify-center`}>
      <Image className="animate-pulse" src="/EvoluABA.png" width={120} height={120} alt="Logo" />
    </div>
  );
};
