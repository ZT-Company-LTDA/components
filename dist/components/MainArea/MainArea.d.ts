import React from "react";
interface MainAreaProps {
    screens: Screen[];
    idView: number;
}
interface Screen {
    id: number;
    component: JSX.Element;
}
export declare const MainArea: ({ screens, idView }: MainAreaProps) => React.JSX.Element;
export {};
