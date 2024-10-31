export interface MenuProps {
  linkItems: Array<{ id: number; name: string; icon: string; library: string; component?: JSX.Element; route?:string }>;
}