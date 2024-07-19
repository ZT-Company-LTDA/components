"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  MainArea: () => MainArea,
  SideBar: () => SideBar,
  TableCrud: () => TableCrud
});
module.exports = __toCommonJS(src_exports);

// src/components/MainArea/MainArea.tsx
var React2 = require("react");
var MainArea = ({ screens, idView }) => {
  return /* @__PURE__ */ React2.createElement("div", { className: "md:pl-[8%]" }, screens.map((screen) => screen.id === idView && screen.component));
};

// src/components/SideBar/SideBar.tsx
var import_react = require("next-auth/react");
var import_react2 = require("react");
var import_io5 = require("react-icons/io5");
var import_hi2 = require("react-icons/hi2");
var import_react3 = require("@nextui-org/react");
var import_ci = require("react-icons/ci");
var import_fa = require("react-icons/fa");
var React3 = require("react");
var linkItems = [
  { name: "Documentos", icon: import_io5.IoDocumentAttach, view: 1 },
  { name: "Clientes", icon: import_fa.FaUserFriends, view: 2 },
  { name: "Criar CNPJ", icon: import_hi2.HiIdentification, view: 3 },
  { name: "Configura\xE7\xF5es", icon: import_ci.CiSettings, view: 4 }
];
var MenuItems = ({ setView }) => {
  return /* @__PURE__ */ React3.createElement(React3.Fragment, null, linkItems.map((linkItem, index) => /* @__PURE__ */ React3.createElement(import_react3.Tooltip, { placement: "right", content: linkItem.name, key: linkItem.view, closeDelay: 0 }, /* @__PURE__ */ React3.createElement(
    import_react3.Button,
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
  const [isMenuOpen, setIsMenuOpen] = (0, import_react2.useState)(false);
  const { data: session } = (0, import_react.useSession)();
  return /* @__PURE__ */ React3.createElement("div", { className: "flex min-h-screen bg-background" }, /* @__PURE__ */ React3.createElement("aside", { className: "hidden md:flex md:flex-col md:w-[8%] md:border-r md:bg-background md:fixed md:h-full" }, /* @__PURE__ */ React3.createElement("div", { className: "flex h-16 flex-col items-center justify-center border-b" }, /* @__PURE__ */ React3.createElement("div", { className: "font-extrabold text-black flex items-end relative" }, /* @__PURE__ */ React3.createElement(
    import_react3.Image,
    {
      src: "./logo-cent-black.png",
      className: "h-20 w-20"
    }
  ), /* @__PURE__ */ React3.createElement("span", { className: "sr-only" }, "Logo escrita em imagem"))), /* @__PURE__ */ React3.createElement("nav", { className: "flex flex-1 flex-col items-center justify-center gap-4 bg-black" }, /* @__PURE__ */ React3.createElement(MenuItems, { setView }))), /* @__PURE__ */ React3.createElement("div", { className: "flex flex-1 flex-col" }, /* @__PURE__ */ React3.createElement(
    import_react3.Navbar,
    {
      isBordered: true,
      isMenuOpen,
      onMenuOpenChange: setIsMenuOpen
    },
    /* @__PURE__ */ React3.createElement(import_react3.NavbarContent, { className: "md:hidden", justify: "start" }, /* @__PURE__ */ React3.createElement(import_react3.NavbarMenuToggle, { "aria-label": isMenuOpen ? "Close menu" : "Open menu" })),
    /* @__PURE__ */ React3.createElement(import_react3.NavbarContent, { className: "md:fixed md:left-3", justify: "start" }, /* @__PURE__ */ React3.createElement(import_react3.NavbarBrand, null, /* @__PURE__ */ React3.createElement(
      import_react3.Image,
      {
        src: "/cent-black.png",
        className: "h-20 w-20"
      }
    ))),
    /* @__PURE__ */ React3.createElement(import_react3.NavbarContent, { className: "md:fixed md:right-10", justify: "end" }, /* @__PURE__ */ React3.createElement(import_react3.NavbarItem, null, /* @__PURE__ */ React3.createElement(import_react3.Dropdown, null, /* @__PURE__ */ React3.createElement(import_react3.DropdownTrigger, null, /* @__PURE__ */ React3.createElement(
      import_react3.Avatar,
      {
        showFallback: true,
        src: "https://images.unsplash.com/broken",
        name: (_a = session == null ? void 0 : session.user) == null ? void 0 : _a.name,
        size: "md",
        alt: "Avatar",
        className: "overflow-hidden rounded-full cursor-pointer"
      }
    )), /* @__PURE__ */ React3.createElement(import_react3.DropdownMenu, null, /* @__PURE__ */ React3.createElement(import_react3.DropdownItem, null, "Perfil"), /* @__PURE__ */ React3.createElement(import_react3.DropdownItem, { showDivider: true }, "Pagamentos"), /* @__PURE__ */ React3.createElement(import_react3.DropdownItem, { className: "text-red-500", onClick: () => (0, import_react.signOut)() }, "Sair"))))),
    /* @__PURE__ */ React3.createElement(import_react3.NavbarMenu, null, linkItems.map((item, index) => /* @__PURE__ */ React3.createElement(import_react3.NavbarMenuItem, { key: `${item.view}-${index}` }, /* @__PURE__ */ React3.createElement(
      import_react3.Link,
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
var import_react6 = require("react");
var import_react7 = require("@nextui-org/react");
var import_fa2 = require("react-icons/fa");
var import_ai = require("react-icons/ai");
var import_swr = __toESM(require("swr"));
var import_ci2 = require("react-icons/ci");

// src/components/TableCrud/ModalCrud/ModalView.tsx
var import_react4 = require("@nextui-org/react");
var import_io52 = require("react-icons/io5");
function ViewUser() {
  const { isOpen, onOpen, onOpenChange } = (0, import_react4.useDisclosure)();
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(import_io52.IoEyeOutline, { onClick: onOpen }), /* @__PURE__ */ React.createElement(
    import_react4.Modal,
    {
      isOpen,
      onOpenChange,
      placement: "auto"
    },
    /* @__PURE__ */ React.createElement(import_react4.ModalContent, null, (onClose) => /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(import_react4.ModalHeader, { className: "flex flex-col gap-1" }, "Modal Title"), /* @__PURE__ */ React.createElement(import_react4.ModalBody, null, /* @__PURE__ */ React.createElement("p", null, "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus non risus hendrerit venenatis. Pellentesque sit amet hendrerit risus, sed porttitor quam."), /* @__PURE__ */ React.createElement("p", null, "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus non risus hendrerit venenatis. Pellentesque sit amet hendrerit risus, sed porttitor quam."), /* @__PURE__ */ React.createElement("p", null, "Magna exercitation reprehenderit magna aute tempor cupidatat consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum quis. Velit duis sit officia eiusmod Lorem aliqua enim laboris do dolor eiusmod. Et mollit incididunt nisi consectetur esse laborum eiusmod pariatur proident Lorem eiusmod et. Culpa deserunt nostrud ad veniam.")), /* @__PURE__ */ React.createElement(import_react4.ModalFooter, null, /* @__PURE__ */ React.createElement(import_react4.Button, { color: "danger", variant: "light", onPress: onClose }, "Close"), /* @__PURE__ */ React.createElement(import_react4.Button, { color: "primary", onPress: onClose }, "Action"))))
  ));
}

// src/hooks/useMediaQuery.tsx
var import_react5 = require("react");
var useMediaQuery = (query) => {
  const [matches, setMatches] = (0, import_react5.useState)(false);
  (0, import_react5.useEffect)(() => {
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
var React4 = require("react");
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
  const [page, setPage] = (0, import_react6.useState)(1);
  const [rowsPerPage, setRowsPerPage] = (0, import_react6.useState)(1);
  const [filterValue, setFilterValue] = (0, import_react6.useState)("");
  const hasSearchFilter = Boolean(filterValue);
  const [mobileColumns, setMobileColumns] = (0, import_react6.useState)(
    columns.filter((column) => column.isMobile)
  );
  const fetcher = (url) => fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  }).then((res) => res.json());
  const { data, isLoading } = (0, import_swr.default)(
    token ? urlFetcher : null,
    fetcher,
    {
      keepPreviousData: true
    }
  );
  const filteredItems = (0, import_react6.useMemo)(() => {
    var _a;
    let filteredUsers = [...(_a = data == null ? void 0 : data.users) != null ? _a : []];
    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter(
        (user) => user.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    return filteredUsers;
  }, [data == null ? void 0 : data.users, filterValue]);
  const pages = (0, import_react6.useMemo)(() => {
    return (data == null ? void 0 : data.count) ? Math.ceil(data.count / rowsPerPage) : 1;
  }, [data == null ? void 0 : data.count, rowsPerPage]);
  const items = (0, import_react6.useMemo)(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);
  const loadingState = isLoading ? "loading" : "idle";
  const onNextPage = (0, import_react6.useCallback)(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);
  const onPreviousPage = (0, import_react6.useCallback)(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);
  const onRowsPerPageChange = (0, import_react6.useCallback)(
    (e) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );
  const onSearchChange = (0, import_react6.useCallback)((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);
  const onClear = (0, import_react6.useCallback)(() => {
    setFilterValue("");
    setPage(1);
  }, []);
  const bottomContent = (0, import_react6.useMemo)(() => {
    return /* @__PURE__ */ React4.createElement("div", { className: "py-2 px-2 flex justify-between items-center w-full" }, /* @__PURE__ */ React4.createElement("span", { className: "text-default-400 text-small" }, "Total ", items.length), /* @__PURE__ */ React4.createElement(
      import_react7.Pagination,
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
  const renderCell = (0, import_react6.useCallback)(
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
            import_react7.User,
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
            import_react7.Chip,
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
            return /* @__PURE__ */ React4.createElement(import_react7.Dropdown, null, /* @__PURE__ */ React4.createElement(import_react7.DropdownTrigger, null, /* @__PURE__ */ React4.createElement(import_react7.Button, { variant: "light", isIconOnly: true, radius: "full" }, /* @__PURE__ */ React4.createElement(import_ai.AiOutlineMore, { className: "w-6 h-16" }))), /* @__PURE__ */ React4.createElement(
              import_react7.DropdownMenu,
              {
                "aria-label": "Action event example",
                onAction: (key) => alert(key)
              },
              /* @__PURE__ */ React4.createElement(import_react7.DropdownItem, { key: "new", startContent: /* @__PURE__ */ React4.createElement(ViewUser, null) }, "Detalhes"),
              /* @__PURE__ */ React4.createElement(import_react7.DropdownItem, { key: "copy", startContent: /* @__PURE__ */ React4.createElement(import_fa2.FaUserEdit, null) }, "Editar ", elementName),
              /* @__PURE__ */ React4.createElement(
                import_react7.DropdownItem,
                {
                  key: "edit",
                  className: "text-danger",
                  color: "danger",
                  startContent: /* @__PURE__ */ React4.createElement(import_ai.AiOutlineUserDelete, null)
                },
                "Deletar ",
                elementName
              )
            ));
          } else if (!isMobile2) {
            return /* @__PURE__ */ React4.createElement("div", { className: "relative flex items-center justify-center gap-4" }, /* @__PURE__ */ React4.createElement(import_react7.Tooltip, { content: "Detalhes" }, /* @__PURE__ */ React4.createElement("span", { className: "text-lg text-default-400 cursor-pointer active:opacity-50" }, /* @__PURE__ */ React4.createElement(ViewUser, null))), /* @__PURE__ */ React4.createElement(import_react7.Tooltip, { content: `Editar ${elementName}` }, /* @__PURE__ */ React4.createElement("span", { className: "text-lg text-default-400 cursor-pointer active:opacity-50" }, /* @__PURE__ */ React4.createElement(import_fa2.FaUserEdit, null))), /* @__PURE__ */ React4.createElement(import_react7.Tooltip, { color: "danger", content: `Excluir ${elementName}` }, /* @__PURE__ */ React4.createElement("span", { className: "text-lg text-danger cursor-pointer active:opacity-50" }, /* @__PURE__ */ React4.createElement(import_ai.AiOutlineUserDelete, null))));
          }
        default:
          return cellValue;
      }
    },
    []
  );
  const topContent = (0, import_react6.useMemo)(() => {
    return /* @__PURE__ */ React4.createElement("div", { className: "flex flex-col gap-4" }, /* @__PURE__ */ React4.createElement("div", { className: "flex justify-between items-center" }, /* @__PURE__ */ React4.createElement(
      import_react7.Input,
      {
        isClearable: true,
        className: "w-full sm:max-w-[44%]",
        placeholder: "Procure pelo nome...",
        startContent: /* @__PURE__ */ React4.createElement(import_ci2.CiSearch, null),
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
    import_react7.Table,
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
    /* @__PURE__ */ React4.createElement(import_react7.TableHeader, { columns: isMobile ? mobileColumns : columns }, (column) => /* @__PURE__ */ React4.createElement(
      import_react7.TableColumn,
      {
        key: column.uid,
        align: column.uid === "actions" ? "center" : "start"
      },
      column.name
    )),
    /* @__PURE__ */ React4.createElement(
      import_react7.TableBody,
      {
        emptyContent: "N\xE3o foi encontrado registros.",
        items: items != null ? items : [],
        loadingContent: /* @__PURE__ */ React4.createElement(import_react7.Spinner, null),
        loadingState
      },
      (item) => /* @__PURE__ */ React4.createElement(import_react7.TableRow, { key: item.clients }, (columnKey) => /* @__PURE__ */ React4.createElement(import_react7.TableCell, null, renderCell(item, columnKey, isMobile, item)))
    )
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MainArea,
  SideBar,
  TableCrud
});
