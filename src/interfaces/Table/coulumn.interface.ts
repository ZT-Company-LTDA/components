interface Column {
  name: string;
  uid: string;
  type: "user" | "text" | "chips" | "actions";
  isMobile: boolean;
  voidValueMessage?: string;
}