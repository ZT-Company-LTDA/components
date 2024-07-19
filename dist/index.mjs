var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// src/components/MainArea/MainArea.tsx
var React2 = __require("react");
var MainArea = ({ screens, idView }) => {
  return /* @__PURE__ */ React2.createElement("div", { className: "md:pl-[8%]" }, screens.map((screen) => screen.id === idView && screen.component));
};

// src/components/SideBar/SideBar.tsx
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { IoDocumentAttach } from "react-icons/io5";
import { HiIdentification } from "react-icons/hi2";
import { Button, DropdownMenu, Link, Tooltip, DropdownTrigger, Dropdown, DropdownItem, Avatar, Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle, Image } from "@nextui-org/react";
import { CiSettings } from "react-icons/ci";
import { FaUserFriends } from "react-icons/fa";
var React3 = __require("react");
var linkItems = [
  { name: "Documentos", icon: IoDocumentAttach, view: 1 },
  { name: "Clientes", icon: FaUserFriends, view: 2 },
  { name: "Criar CNPJ", icon: HiIdentification, view: 3 },
  { name: "Configura\xE7\xF5es", icon: CiSettings, view: 4 }
];
var MenuItems = ({ setView }) => {
  return /* @__PURE__ */ React3.createElement(React3.Fragment, null, linkItems.map((linkItem, index) => /* @__PURE__ */ React3.createElement(Tooltip, { placement: "right", content: linkItem.name, key: linkItem.view, closeDelay: 0 }, /* @__PURE__ */ React3.createElement(
    Button,
    {
      onClick: () => setView(linkItem.view),
      type: "button",
      variant: "light",
      isIconOnly: true,
      className: "flex h-10 w-10 items-center justify-center text-white rounded-lg transition-colors data-[hover=true]:bg-[#3248F2]"
    },
    /* @__PURE__ */ React3.createElement(linkItem.icon, { className: "h-5 w-5" })
  ))));
};
var SideBar = ({ children, setView }) => {
  var _a;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();
  return /* @__PURE__ */ React3.createElement("div", { className: "flex min-h-screen bg-background" }, /* @__PURE__ */ React3.createElement("aside", { className: "hidden md:flex md:flex-col md:w-[8%] md:border-r md:bg-background md:fixed md:h-full" }, /* @__PURE__ */ React3.createElement("div", { className: "flex h-16 flex-col items-center justify-center border-b" }, /* @__PURE__ */ React3.createElement("div", { className: "font-extrabold text-black flex items-end relative" }, /* @__PURE__ */ React3.createElement(
    Image,
    {
      src: "./logo-cent-black.png",
      className: "h-20 w-20"
    }
  ), /* @__PURE__ */ React3.createElement("span", { className: "sr-only" }, "Logo escrita em imagem"))), /* @__PURE__ */ React3.createElement("nav", { className: "flex flex-1 flex-col items-center justify-center gap-4 bg-black" }, /* @__PURE__ */ React3.createElement(MenuItems, { setView }))), /* @__PURE__ */ React3.createElement("div", { className: "flex flex-1 flex-col" }, /* @__PURE__ */ React3.createElement(
    Navbar,
    {
      isBordered: true,
      isMenuOpen,
      onMenuOpenChange: setIsMenuOpen
    },
    /* @__PURE__ */ React3.createElement(NavbarContent, { className: "md:hidden", justify: "start" }, /* @__PURE__ */ React3.createElement(NavbarMenuToggle, { "aria-label": isMenuOpen ? "Close menu" : "Open menu" })),
    /* @__PURE__ */ React3.createElement(NavbarContent, { className: "md:fixed md:left-3", justify: "start" }, /* @__PURE__ */ React3.createElement(NavbarBrand, null, /* @__PURE__ */ React3.createElement(
      Image,
      {
        src: "/cent-black.png",
        className: "h-20 w-20"
      }
    ))),
    /* @__PURE__ */ React3.createElement(NavbarContent, { className: "md:fixed md:right-10", justify: "end" }, /* @__PURE__ */ React3.createElement(NavbarItem, null, /* @__PURE__ */ React3.createElement(Dropdown, null, /* @__PURE__ */ React3.createElement(DropdownTrigger, null, /* @__PURE__ */ React3.createElement(
      Avatar,
      {
        showFallback: true,
        src: "https://images.unsplash.com/broken",
        name: (_a = session == null ? void 0 : session.user) == null ? void 0 : _a.name,
        size: "md",
        alt: "Avatar",
        className: "overflow-hidden rounded-full cursor-pointer"
      }
    )), /* @__PURE__ */ React3.createElement(DropdownMenu, null, /* @__PURE__ */ React3.createElement(DropdownItem, null, "Perfil"), /* @__PURE__ */ React3.createElement(DropdownItem, { showDivider: true }, "Pagamentos"), /* @__PURE__ */ React3.createElement(DropdownItem, { className: "text-red-500", onClick: () => signOut() }, "Sair"))))),
    /* @__PURE__ */ React3.createElement(NavbarMenu, null, linkItems.map((item, index) => /* @__PURE__ */ React3.createElement(NavbarMenuItem, { key: `${item.view}-${index}` }, /* @__PURE__ */ React3.createElement(
      Link,
      {
        className: "w-full gap-2",
        color: "foreground",
        onClick: () => {
          setView(item.view);
          setIsMenuOpen(!isMenuOpen);
        },
        size: "lg"
      },
      /* @__PURE__ */ React3.createElement(item.icon, null),
      item.name
    ))))
  ), /* @__PURE__ */ React3.createElement("main", { className: "flex-1 p-4 md:p-2 max-md:h-screen max-md:w-screen" }, children)));
};

// src/components/TableCrud/TableCrud.tsx
import { useCallback, useMemo, useState as useState3 } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip as Tooltip2,
  Pagination,
  Spinner,
  Input,
  Button as Button3,
  Dropdown as Dropdown2,
  DropdownTrigger as DropdownTrigger2,
  DropdownMenu as DropdownMenu2,
  DropdownItem as DropdownItem2
} from "@nextui-org/react";
import { FaUserEdit } from "react-icons/fa";
import { AiOutlineMore, AiOutlineUserDelete } from "react-icons/ai";
import useSWR from "swr";
import { CiSearch } from "react-icons/ci";

// src/components/TableCrud/ModalCrud/ModalView.tsx
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button as Button2, useDisclosure } from "@nextui-org/react";
import { IoEyeOutline } from "react-icons/io5";
function ViewUser() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(IoEyeOutline, { onClick: onOpen }), /* @__PURE__ */ React.createElement(
    Modal,
    {
      isOpen,
      onOpenChange,
      placement: "auto"
    },
    /* @__PURE__ */ React.createElement(ModalContent, null, (onClose) => /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(ModalHeader, { className: "flex flex-col gap-1" }, "Modal Title"), /* @__PURE__ */ React.createElement(ModalBody, null, /* @__PURE__ */ React.createElement("p", null, "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus non risus hendrerit venenatis. Pellentesque sit amet hendrerit risus, sed porttitor quam."), /* @__PURE__ */ React.createElement("p", null, "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus non risus hendrerit venenatis. Pellentesque sit amet hendrerit risus, sed porttitor quam."), /* @__PURE__ */ React.createElement("p", null, "Magna exercitation reprehenderit magna aute tempor cupidatat consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum quis. Velit duis sit officia eiusmod Lorem aliqua enim laboris do dolor eiusmod. Et mollit incididunt nisi consectetur esse laborum eiusmod pariatur proident Lorem eiusmod et. Culpa deserunt nostrud ad veniam.")), /* @__PURE__ */ React.createElement(ModalFooter, null, /* @__PURE__ */ React.createElement(Button2, { color: "danger", variant: "light", onPress: onClose }, "Close"), /* @__PURE__ */ React.createElement(Button2, { color: "primary", onPress: onClose }, "Action"))))
  ));
}

// src/hooks/useMediaQuery.tsx
import { useState as useState2, useEffect } from "react";
var useMediaQuery = (query) => {
  const [matches, setMatches] = useState2(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);
  return matches;
};

// src/components/TableCrud/TableCrud.tsx
var React4 = __require("react");
var statusColorMap = {
  Ativo: "success",
  Inativo: "danger"
};
function TableCrud({
  columns,
  urlFetcher,
  token,
  elementName
}) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [page, setPage] = useState3(1);
  const [rowsPerPage, setRowsPerPage] = useState3(1);
  const [filterValue, setFilterValue] = useState3("");
  const hasSearchFilter = Boolean(filterValue);
  const [mobileColumns, setMobileColumns] = useState3(
    columns.filter((column) => column.isMobile)
  );
  const fetcher = (url) => fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  }).then((res) => res.json());
  const { data, isLoading } = useSWR(
    token ? urlFetcher : null,
    fetcher,
    {
      keepPreviousData: true
    }
  );
  const filteredItems = useMemo(() => {
    var _a;
    let filteredUsers = [...(_a = data == null ? void 0 : data.users) != null ? _a : []];
    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter(
        (user) => user.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    return filteredUsers;
  }, [data == null ? void 0 : data.users, filterValue]);
  const pages = useMemo(() => {
    return (data == null ? void 0 : data.count) ? Math.ceil(data.count / rowsPerPage) : 1;
  }, [data == null ? void 0 : data.count, rowsPerPage]);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);
  const loadingState = isLoading ? "loading" : "idle";
  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);
  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);
  const onRowsPerPageChange = useCallback(
    (e) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );
  const onSearchChange = useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);
  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);
  const bottomContent = useMemo(() => {
    return /* @__PURE__ */ React4.createElement("div", { className: "py-2 px-2 flex justify-between items-center w-full" }, /* @__PURE__ */ React4.createElement("span", { className: "text-default-400 text-small" }, "Total ", items.length), /* @__PURE__ */ React4.createElement(
      Pagination,
      {
        isCompact: true,
        showControls: true,
        showShadow: true,
        color: "primary",
        page,
        total: pages,
        onChange: setPage
      }
    ));
  }, [items.length, page, pages, hasSearchFilter]);
  const renderCell = useCallback(
    (element, columnKey, isMobile2, item) => {
      const column = columns.find((col) => col.uid === columnKey);
      if (!column) return null;
      let count = 0;
      if (count == 0) {
        element.deletedAt == void 0 ? element.status = "Ativo" : element.status = "Inativo";
        count++;
      }
      const cellValue = element[columnKey];
      switch (column.type) {
        case "user":
          return /* @__PURE__ */ React4.createElement(
            User,
            {
              avatarProps: {
                radius: "lg",
                name: element.name,
                isBordered: true
              },
              description: element.email,
              name: cellValue
            },
            cellValue
          );
        case "text":
          return /* @__PURE__ */ React4.createElement("div", { className: "flex flex-col" }, /* @__PURE__ */ React4.createElement("p", { className: "text-bold text-sm capitalize text-default-400" }, cellValue || column.voidValueMessage || ""));
        case "chips":
          return /* @__PURE__ */ React4.createElement(
            Chip,
            {
              className: "capitalize",
              color: statusColorMap[cellValue != null ? cellValue : ""],
              size: "sm",
              variant: "flat"
            },
            cellValue
          );
        case "actions":
          if (isMobile2) {
            return /* @__PURE__ */ React4.createElement(Dropdown2, null, /* @__PURE__ */ React4.createElement(DropdownTrigger2, null, /* @__PURE__ */ React4.createElement(Button3, { variant: "light", isIconOnly: true, radius: "full" }, /* @__PURE__ */ React4.createElement(AiOutlineMore, { className: "w-6 h-16" }))), /* @__PURE__ */ React4.createElement(
              DropdownMenu2,
              {
                "aria-label": "Action event example",
                onAction: (key) => alert(key)
              },
              /* @__PURE__ */ React4.createElement(DropdownItem2, { key: "new", startContent: /* @__PURE__ */ React4.createElement(ViewUser, null) }, "Detalhes"),
              /* @__PURE__ */ React4.createElement(DropdownItem2, { key: "copy", startContent: /* @__PURE__ */ React4.createElement(FaUserEdit, null) }, "Editar ", elementName),
              /* @__PURE__ */ React4.createElement(
                DropdownItem2,
                {
                  key: "edit",
                  className: "text-danger",
                  color: "danger",
                  startContent: /* @__PURE__ */ React4.createElement(AiOutlineUserDelete, null)
                },
                "Deletar ",
                elementName
              )
            ));
          } else if (!isMobile2) {
            return /* @__PURE__ */ React4.createElement("div", { className: "relative flex items-center justify-center gap-4" }, /* @__PURE__ */ React4.createElement(Tooltip2, { content: "Detalhes" }, /* @__PURE__ */ React4.createElement("span", { className: "text-lg text-default-400 cursor-pointer active:opacity-50" }, /* @__PURE__ */ React4.createElement(ViewUser, null))), /* @__PURE__ */ React4.createElement(Tooltip2, { content: `Editar ${elementName}` }, /* @__PURE__ */ React4.createElement("span", { className: "text-lg text-default-400 cursor-pointer active:opacity-50" }, /* @__PURE__ */ React4.createElement(FaUserEdit, null))), /* @__PURE__ */ React4.createElement(Tooltip2, { color: "danger", content: `Excluir ${elementName}` }, /* @__PURE__ */ React4.createElement("span", { className: "text-lg text-danger cursor-pointer active:opacity-50" }, /* @__PURE__ */ React4.createElement(AiOutlineUserDelete, null))));
          }
        default:
          return cellValue;
      }
    },
    []
  );
  const topContent = useMemo(() => {
    return /* @__PURE__ */ React4.createElement("div", { className: "flex flex-col gap-4" }, /* @__PURE__ */ React4.createElement("div", { className: "flex justify-between items-center" }, /* @__PURE__ */ React4.createElement(
      Input,
      {
        isClearable: true,
        className: "w-full sm:max-w-[44%]",
        placeholder: "Procure pelo nome...",
        startContent: /* @__PURE__ */ React4.createElement(CiSearch, null),
        value: filterValue,
        onClear: () => onClear(),
        onValueChange: onSearchChange
      }
    ), /* @__PURE__ */ React4.createElement("label", { className: "flex items-center text-default-400 text-small" }, "Qtd por p\xE1ginas.", /* @__PURE__ */ React4.createElement(
      "select",
      {
        className: "bg-transparent outline-none text-default-400 text-small",
        onChange: onRowsPerPageChange
      },
      /* @__PURE__ */ React4.createElement("option", { value: "1" }, "1"),
      /* @__PURE__ */ React4.createElement("option", { value: "3" }, "3"),
      /* @__PURE__ */ React4.createElement("option", { value: "5" }, "5"),
      /* @__PURE__ */ React4.createElement("option", { value: "10" }, "10"),
      /* @__PURE__ */ React4.createElement("option", { value: "15" }, "15"),
      /* @__PURE__ */ React4.createElement("option", { value: "50" }, "50"),
      /* @__PURE__ */ React4.createElement("option", { value: "100" }, "100")
    ))));
  }, [
    filterValue,
    onSearchChange,
    onRowsPerPageChange,
    data == null ? void 0 : data.users.length,
    hasSearchFilter
  ]);
  return /* @__PURE__ */ React4.createElement(
    Table,
    {
      "aria-label": "Tabela de clientes",
      className: "my-2",
      topContent,
      classNames: {
        wrapper: "max-h-[300px]"
      },
      topContentPlacement: "outside",
      isHeaderSticky: true,
      bottomContent,
      bottomContentPlacement: "outside"
    },
    /* @__PURE__ */ React4.createElement(TableHeader, { columns: isMobile ? mobileColumns : columns }, (column) => /* @__PURE__ */ React4.createElement(
      TableColumn,
      {
        key: column.uid,
        align: column.uid === "actions" ? "center" : "start"
      },
      column.name
    )),
    /* @__PURE__ */ React4.createElement(
      TableBody,
      {
        emptyContent: "N\xE3o foi encontrado registros.",
        items: items != null ? items : [],
        loadingContent: /* @__PURE__ */ React4.createElement(Spinner, null),
        loadingState
      },
      (item) => /* @__PURE__ */ React4.createElement(TableRow, { key: item.clients }, (columnKey) => /* @__PURE__ */ React4.createElement(TableCell, null, renderCell(item, columnKey, isMobile, item)))
    )
  );
}
export {
  MainArea,
  SideBar,
  TableCrud
};
