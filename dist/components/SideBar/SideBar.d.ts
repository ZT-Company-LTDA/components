import { Dispatch, SetStateAction } from "react";
import React from "react";
interface SidebarRenderProps {
    children: Element;
    setView: Dispatch<SetStateAction<number>>;
}
export declare const SideBar: ({ children, setView }: SidebarRenderProps) => React.JSX.Element;
export {};
