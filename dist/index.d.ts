import React, { Dispatch, SetStateAction } from 'react';

interface MainAreaProps {
    screens: Screen[];
    idView: number;
}
interface Screen {
    id: number;
    component: JSX.Element;
}
declare const MainArea: ({ screens, idView }: MainAreaProps) => React.JSX.Element;

interface SidebarRenderProps {
    children: JSX.Element;
    setView: Dispatch<SetStateAction<number>>;
}
declare const SideBar: ({ children, setView }: SidebarRenderProps) => React.JSX.Element;

interface Columns {
    name: string;
    uid: string;
    type: string;
    voidValueMessage?: string;
    isMobile: boolean;
}
interface TableCrudProps {
    columns: Columns[];
    urlFetcher: string;
    token: string | undefined;
    elementName: string;
}
declare function TableCrud({ columns, urlFetcher, token, elementName, }: TableCrudProps): React.JSX.Element;

export { MainArea, SideBar, TableCrud };
