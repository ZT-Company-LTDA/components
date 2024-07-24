import { Dispatch, SetStateAction } from "react";
import { LinkItemProps } from "./LinkItemProps";

export interface MenuProps {
  setView: Dispatch<SetStateAction<number>> | undefined;
  linkItems: Array<LinkItemProps>;
}