function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var react = require('next-auth/react');
var io5 = require('react-icons/io5');
var hi2 = require('react-icons/hi2');
var react$1 = require('@nextui-org/react');
var ci = require('react-icons/ci');
var fa = require('react-icons/fa');
var ai = require('react-icons/ai');
var useSWR = _interopDefault(require('swr'));

var styles = {"test":"_3ybTi"};

var MainArea = function MainArea(_ref) {
  var screens = _ref.screens,
    idView = _ref.idView;
  return React__default.createElement("div", {
    className: "md:pl-[8%]"
  }, screens.map(function (screen) {
    return screen.id === idView && screen.component;
  }));
};

var linkItems = [{
  name: 'Documentos',
  icon: io5.IoDocumentAttach,
  view: 1
}, {
  name: 'Clientes',
  icon: fa.FaUserFriends,
  view: 2
}, {
  name: 'Criar CNPJ',
  icon: hi2.HiIdentification,
  view: 3
}, {
  name: 'Configurações',
  icon: ci.CiSettings,
  view: 4
}];
var MenuItems = function MenuItems(_ref) {
  var setView = _ref.setView;
  return React__default.createElement("div", null, linkItems.map(function (linkItem, index) {
    return React__default.createElement(react$1.Tooltip, {
      placement: "right",
      content: linkItem.name,
      key: linkItem.view,
      closeDelay: 0
    }, React__default.createElement(react$1.Button, {
      onClick: function onClick() {
        return setView(linkItem.view);
      },
      type: "button",
      variant: "light",
      isIconOnly: true,
      className: "flex h-10 w-10 items-center justify-center text-white rounded-lg transition-colors data-[hover=true]:bg-[#3248F2]"
    }, React__default.createElement(linkItem.icon, {
      className: "h-5 w-5"
    })));
  }));
};
var SideBar = function SideBar(_ref2) {
  var _session$user;
  var children = _ref2.children,
    setView = _ref2.setView;
  var _useState = React.useState(false),
    isMenuOpen = _useState[0],
    setIsMenuOpen = _useState[1];
  var _useSession = react.useSession(),
    session = _useSession.data;
  return React__default.createElement("div", {
    className: "flex min-h-screen bg-background"
  }, React__default.createElement("aside", {
    className: "hidden md:flex md:flex-col md:w-[8%] md:border-r md:bg-background md:fixed md:h-full"
  }, React__default.createElement("div", {
    className: "flex h-16 flex-col items-center justify-center border-b"
  }, React__default.createElement("div", {
    className: "font-extrabold text-black flex items-end relative"
  }, React__default.createElement(react$1.Image, {
    src: "./logo-cent-black.png",
    className: "h-20 w-20"
  }), React__default.createElement("span", {
    className: "sr-only"
  }, "Logo escrita em imagem"))), React__default.createElement("nav", {
    className: "flex flex-1 flex-col items-center justify-center gap-4 bg-black"
  }, React__default.createElement(MenuItems, {
    setView: setView
  }))), React__default.createElement("div", {
    className: "flex flex-1 flex-col"
  }, React__default.createElement(react$1.Navbar, {
    isBordered: true,
    isMenuOpen: isMenuOpen,
    onMenuOpenChange: setIsMenuOpen
  }, React__default.createElement(react$1.NavbarContent, {
    className: "md:hidden",
    justify: "start"
  }, React__default.createElement(react$1.NavbarMenuToggle, {
    "aria-label": isMenuOpen ? "Close menu" : "Open menu"
  })), React__default.createElement(react$1.NavbarContent, {
    className: 'md:fixed md:left-3',
    justify: "start"
  }, React__default.createElement(react$1.NavbarBrand, null, React__default.createElement(react$1.Image, {
    src: "/cent-black.png",
    className: "h-20 w-20"
  }))), React__default.createElement(react$1.NavbarContent, {
    className: 'md:fixed md:right-10',
    justify: "end"
  }, React__default.createElement(react$1.NavbarItem, null, React__default.createElement(react$1.Dropdown, null, React__default.createElement(react$1.DropdownTrigger, null, React__default.createElement(react$1.Avatar, {
    showFallback: true,
    src: "https://images.unsplash.com/broken",
    name: session === null || session === void 0 ? void 0 : (_session$user = session.user) === null || _session$user === void 0 ? void 0 : _session$user.name,
    size: "md",
    alt: "Avatar",
    className: "overflow-hidden rounded-full cursor-pointer"
  })), React__default.createElement(react$1.DropdownMenu, null, React__default.createElement(react$1.DropdownItem, null, "Perfil"), React__default.createElement(react$1.DropdownItem, {
    showDivider: true
  }, "Pagamentos"), React__default.createElement(react$1.DropdownItem, {
    className: "text-red-500",
    onClick: function onClick() {
      return react.signOut();
    }
  }, "Sair"))))), React__default.createElement(react$1.NavbarMenu, null, linkItems.map(function (item, index) {
    return React__default.createElement(react$1.NavbarMenuItem, {
      key: item.view + "-" + index
    }, React__default.createElement(react$1.Link, {
      className: "w-full gap-2",
      color: "foreground",
      onClick: function onClick() {
        setView(item.view);
        setIsMenuOpen(!isMenuOpen);
      },
      size: "lg"
    }, React__default.createElement(item.icon, null), item.name));
  }))), React__default.createElement("main", {
    className: "flex-1 p-4 md:p-2 max-md:h-screen max-md:w-screen"
  }, children)));
};

function ViewUser() {
  var _useDisclosure = react$1.useDisclosure(),
    isOpen = _useDisclosure.isOpen,
    onOpen = _useDisclosure.onOpen,
    onOpenChange = _useDisclosure.onOpenChange;
  return React__default.createElement("div", null, React__default.createElement(io5.IoEyeOutline, {
    onClick: onOpen
  }), React__default.createElement(react$1.Modal, {
    isOpen: isOpen,
    onOpenChange: onOpenChange,
    placement: "auto"
  }, React__default.createElement(react$1.ModalContent, null, function (onClose) {
    return React__default.createElement("div", null, React__default.createElement(react$1.ModalHeader, {
      className: "flex flex-col gap-1"
    }, "Modal Title"), React__default.createElement(react$1.ModalBody, null, React__default.createElement("p", null, "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus non risus hendrerit venenatis. Pellentesque sit amet hendrerit risus, sed porttitor quam."), React__default.createElement("p", null, "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus non risus hendrerit venenatis. Pellentesque sit amet hendrerit risus, sed porttitor quam."), React__default.createElement("p", null, "Magna exercitation reprehenderit magna aute tempor cupidatat consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum quis. Velit duis sit officia eiusmod Lorem aliqua enim laboris do dolor eiusmod. Et mollit incididunt nisi consectetur esse laborum eiusmod pariatur proident Lorem eiusmod et. Culpa deserunt nostrud ad veniam.")), React__default.createElement(react$1.ModalFooter, null, React__default.createElement(react$1.Button, {
      color: "danger",
      variant: "light",
      onPress: onClose
    }, "Close"), React__default.createElement(react$1.Button, {
      color: "primary",
      onPress: onClose
    }, "Action")));
  })));
}

var useMediaQuery = function useMediaQuery(query) {
  var _useState = React.useState(false),
    matches = _useState[0],
    setMatches = _useState[1];
  React.useEffect(function () {
    var media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    var listener = function listener() {
      return setMatches(media.matches);
    };
    media.addEventListener("change", listener);
    return function () {
      return media.removeEventListener("change", listener);
    };
  }, [matches, query]);
  return matches;
};

var statusColorMap = {
  Ativo: "success",
  Inativo: "danger"
};
function TableCrud(_ref) {
  var columns = _ref.columns,
    urlFetcher = _ref.urlFetcher,
    token = _ref.token,
    elementName = _ref.elementName;
  var isMobile = useMediaQuery("(max-width: 768px)");
  var _useState = React.useState(1),
    page = _useState[0],
    setPage = _useState[1];
  var _useState2 = React.useState(1),
    rowsPerPage = _useState2[0],
    setRowsPerPage = _useState2[1];
  var _useState3 = React.useState(""),
    filterValue = _useState3[0],
    setFilterValue = _useState3[1];
  var hasSearchFilter = Boolean(filterValue);
  var _useState4 = React.useState(columns.filter(function (column) {
      return column.isMobile;
    })),
    mobileColumns = _useState4[0];
  var fetcher = function fetcher(url) {
    return fetch(url, {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json"
      }
    }).then(function (res) {
      return res.json();
    });
  };
  var _useSWR = useSWR(token ? urlFetcher : null, fetcher, {
      keepPreviousData: true
    }),
    data = _useSWR.data,
    isLoading = _useSWR.isLoading;
  var filteredItems = React.useMemo(function () {
    var _data$users;
    var filteredUsers = [].concat((_data$users = data === null || data === void 0 ? void 0 : data.users) != null ? _data$users : []);
    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter(function (user) {
        return user.name.toLowerCase().includes(filterValue.toLowerCase());
      });
    }
    return filteredUsers;
  }, [data === null || data === void 0 ? void 0 : data.users, filterValue]);
  var pages = React.useMemo(function () {
    return data !== null && data !== void 0 && data.count ? Math.ceil(data.count / rowsPerPage) : 1;
  }, [data === null || data === void 0 ? void 0 : data.count, rowsPerPage]);
  var items = React.useMemo(function () {
    var start = (page - 1) * rowsPerPage;
    var end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);
  var loadingState = isLoading ? "loading" : "idle";
  var onNextPage = React.useCallback(function () {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);
  var onPreviousPage = React.useCallback(function () {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);
  var onRowsPerPageChange = React.useCallback(function (e) {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);
  var onSearchChange = React.useCallback(function (value) {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);
  var _onClear = React.useCallback(function () {
    setFilterValue("");
    setPage(1);
  }, []);
  var bottomContent = React.useMemo(function () {
    return React__default.createElement("div", {
      className: "py-2 px-2 flex justify-between items-center w-full"
    }, React__default.createElement("span", {
      className: "text-default-400 text-small"
    }, "Total ", items.length), React__default.createElement(react$1.Pagination, {
      isCompact: true,
      showControls: true,
      showShadow: true,
      color: "primary",
      page: page,
      total: pages,
      onChange: setPage
    }));
  }, [items.length, page, pages, hasSearchFilter]);
  var renderCell = React.useCallback(function (element, columnKey, isMobile, item) {
    var column = columns.find(function (col) {
      return col.uid === columnKey;
    });
    if (!column) return null;
    var count = 0;
    if (count == 0) {
      element.deletedAt == undefined ? element.status = "Ativo" : element.status = "Inativo";
      count++;
    }
    var cellValue = element[columnKey];
    switch (column.type) {
      case "user":
        return React__default.createElement(react$1.User, {
          avatarProps: {
            radius: "lg",
            name: element.name,
            isBordered: true
          },
          description: element.email,
          name: cellValue
        }, cellValue);
      case "text":
        return React__default.createElement("div", {
          className: "flex flex-col"
        }, React__default.createElement("p", {
          className: "text-bold text-sm capitalize text-default-400"
        }, cellValue || column.voidValueMessage || ""));
      case "chips":
        return React__default.createElement(react$1.Chip, {
          className: "capitalize",
          color: statusColorMap[cellValue != null ? cellValue : ""],
          size: "sm",
          variant: "flat"
        }, cellValue);
      case "actions":
        if (isMobile) {
          return React__default.createElement(react$1.Dropdown, null, React__default.createElement(react$1.DropdownTrigger, null, React__default.createElement(react$1.Button, {
            variant: "light",
            isIconOnly: true,
            radius: "full"
          }, React__default.createElement(ai.AiOutlineMore, {
            className: "w-6 h-16"
          }))), React__default.createElement(react$1.DropdownMenu, {
            "aria-label": "Action event example",
            onAction: function onAction(key) {
              return alert(key);
            }
          }, React__default.createElement(react$1.DropdownItem, {
            key: "new",
            startContent: React__default.createElement(ViewUser, null)
          }, "Detalhes"), React__default.createElement(react$1.DropdownItem, {
            key: "copy",
            startContent: React__default.createElement(fa.FaUserEdit, null)
          }, "Editar ", elementName), React__default.createElement(react$1.DropdownItem, {
            key: "edit",
            className: "text-danger",
            color: "danger",
            startContent: React__default.createElement(ai.AiOutlineUserDelete, null)
          }, "Deletar ", elementName)));
        } else if (!isMobile) {
          return React__default.createElement("div", {
            className: "relative flex items-center justify-center gap-4"
          }, React__default.createElement(react$1.Tooltip, {
            content: "Detalhes"
          }, React__default.createElement("span", {
            className: "text-lg text-default-400 cursor-pointer active:opacity-50"
          }, React__default.createElement(ViewUser, null))), React__default.createElement(react$1.Tooltip, {
            content: "Editar " + elementName
          }, React__default.createElement("span", {
            className: "text-lg text-default-400 cursor-pointer active:opacity-50"
          }, React__default.createElement(fa.FaUserEdit, null))), React__default.createElement(react$1.Tooltip, {
            color: "danger",
            content: "Excluir " + elementName
          }, React__default.createElement("span", {
            className: "text-lg text-danger cursor-pointer active:opacity-50"
          }, React__default.createElement(ai.AiOutlineUserDelete, null))));
        }
        break;
      default:
        return cellValue;
    }
  }, [columns, isMobile, elementName]);
  var topContent = React.useMemo(function () {
    return React__default.createElement("div", {
      className: "flex flex-col gap-4"
    }, React__default.createElement("div", {
      className: "flex justify-between items-center"
    }, React__default.createElement(react$1.Input, {
      isClearable: true,
      className: "w-full sm:max-w-[44%]",
      placeholder: "Procure pelo nome...",
      startContent: React__default.createElement(ci.CiSearch, null),
      value: filterValue,
      onClear: function onClear() {
        return _onClear();
      },
      onValueChange: onSearchChange
    }), React__default.createElement("label", {
      className: "flex items-center text-default-400 text-small"
    }, "Qtd por p\xE1ginas.", React__default.createElement("select", {
      className: "bg-transparent outline-none text-default-400 text-small",
      onChange: onRowsPerPageChange
    }, React__default.createElement("option", {
      value: "1"
    }, "1"), React__default.createElement("option", {
      value: "3"
    }, "3"), React__default.createElement("option", {
      value: "5"
    }, "5"), React__default.createElement("option", {
      value: "10"
    }, "10"), React__default.createElement("option", {
      value: "15"
    }, "15"), React__default.createElement("option", {
      value: "50"
    }, "50"), React__default.createElement("option", {
      value: "100"
    }, "100")))));
  }, [filterValue, onSearchChange, onRowsPerPageChange, data === null || data === void 0 ? void 0 : data.users.length, hasSearchFilter]);
  return React__default.createElement(react$1.Table, {
    "aria-label": "Tabela de clientes",
    className: "my-2",
    topContent: topContent,
    classNames: {
      wrapper: "max-h-[300px]"
    },
    topContentPlacement: "outside",
    isHeaderSticky: true,
    bottomContent: bottomContent,
    bottomContentPlacement: "outside"
  }, React__default.createElement(react$1.TableHeader, {
    columns: isMobile ? mobileColumns : columns
  }, function (column) {
    return React__default.createElement(react$1.TableColumn, {
      key: column.uid,
      align: column.uid === "actions" ? "center" : "start"
    }, column.name);
  }), React__default.createElement(react$1.TableBody, {
    emptyContent: "Não foi encontrado registros.",
    items: items != null ? items : [],
    loadingContent: React__default.createElement(react$1.Spinner, null),
    loadingState: loadingState
  }, function (item) {
    return React__default.createElement(react$1.TableRow, {
      key: item.clients
    }, function (columnKey) {
      return React__default.createElement(react$1.TableCell, null, renderCell(item, columnKey, isMobile, item));
    });
  }));
}

var ExampleComponent = function ExampleComponent(_ref) {
  var text = _ref.text;
  return React.createElement("div", {
    className: styles.test
  }, "Example Component: ", text);
};

exports.ExampleComponent = ExampleComponent;
exports.MainArea = MainArea;
exports.SideBar = SideBar;
exports.TableCrud = TableCrud;
//# sourceMappingURL=index.js.map
