export interface NavBarProps {
  children: React.ReactNode;
  screens: Array<{ id: number; name: string; icon: string; library: string }>;
  aside?: boolean;
  topbar?: boolean;
  navBarType: "icon-bar" | "intra-bar";
  logo?: JSX.Element;
}