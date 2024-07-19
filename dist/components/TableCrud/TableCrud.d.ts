import React from "react";
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
export declare function TableCrud({ columns, urlFetcher, token, elementName, }: TableCrudProps): React.JSX.Element;
export {};
