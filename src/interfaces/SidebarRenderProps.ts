import { Dispatch, SetStateAction } from "react";
import { LinkItemProps } from "./LinkItemProps";

export interface SidebarRenderProps {
  children: JSX.Element;
  linkItems: Array<LinkItemProps>;
}