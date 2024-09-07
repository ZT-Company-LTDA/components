"use client";
import { useCallback, useMemo, useState } from "react";
import {
  Table as TableUI,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
  ChipProps,
  Pagination,
  Spinner,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import {
  AiOutlineClear,
  AiOutlineMore,
  AiOutlineUserDelete,
} from "react-icons/ai";
import useSWR from "swr";
import { useMediaQuery } from "../hooks/useMediaQuery";
import * as React from "react";
import { useTableCrudContext } from "../contexts/ContextTableCrud";
import { FaSearch, FaUserEdit } from "react-icons/fa";
import axios from "../utils/AxiosInstance";
import Modal from "../Modal/Modal";
import { IoEyeOutline } from "react-icons/io5";
import { IoIosAddCircle } from "react-icons/io";
import { CustomDropdown } from "../Dropdown/CustomDropdown";

const statusColorMap: Record<string, ChipProps["color"]> = {
  Ativo: "success",
  Inativo: "danger",
};

interface TableUsersProps {
  count: number;
  users: any[];
}

interface Columns {
  name: string;
  uid: string;
  type: string;
  voidValueMessage?: string;
  isMobile: boolean;
}

interface Size {
  width: string;
  height: string;
}

interface TableCrudProps {
  columns: Columns[];
  urlFetcher: string;
  token: string | undefined;
  elementName: string;
  size: string;
  modalInputs: Array<{ label: string; value: string; name: string, trigger?:() => boolean, type:string, placeholder:string, autocompleteUrl?:string, hiddenValue?:string }>;
  add?: boolean;
  urlModalGetElement?: string;
  addModalUrl?: string;
  updateModalUrl?: string;
}

export function Table({
  columns,
  urlFetcher,
  token,
  elementName,
  size,
  modalInputs,
  add,
  urlModalGetElement,
  addModalUrl,
  updateModalUrl
}: TableCrudProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { filterValue, arrayFilters, page, setPage, clear, setClear } =
    useTableCrudContext();
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isSearching, setIsSearching] = useState(false);

  const [mobileColumns, setMobileColumns] = useState(
    columns.filter((column) => column.isMobile)
  );

  const fetcher = async (url: string) => {
    return await axios(url, {
      method: "POST",
      data: JSON.stringify({ arrayFilters }),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then((res) => res.data).catch((error) => {
      console.error('error fecther table',error);
    });
  };

  const { data, isLoading, mutate } = useSWR<TableUsersProps>(
    token ? `${urlFetcher}?page=${page}&rows=${rowsPerPage}` : null,
    fetcher,
    {
      keepPreviousData: true,
      revalidateOnReconnect: false,
      revalidateOnFocus: false,
    }
  );

  const clearFilters = () => {
    if (clear) {
      setClear(false);
    } else {
      setClear(true);
    }
  };

  const searchTable = useCallback(() => {
    setIsSearching(true);
    mutate().then(() => {
      setIsSearching(false);
    });
  }, [arrayFilters, mutate]);

  const filteredItems = useMemo(() => {
    let filteredUsers = [...(data?.users ?? [])];
    // if (arrayFilters) {
    //   filteredUsers = filteredUsers.filter((user) =>
    //     user.name.toLowerCase().includes(arrayFilters[0].value.toLowerCase())
    //   )
    // }
    return filteredUsers;
  }, [data?.users, arrayFilters]);

  const pages = useMemo(() => {
    return data?.count ? Math.ceil(data.count / rowsPerPage) : 1;
  }, [data?.count, rowsPerPage]);

  const loadingState = isLoading || isSearching ? "loading" : "idle";

  const onRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center w-full">
        <span className="text-default-400 text-small">
          Total {filteredItems.length}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
      </div>
    );
  }, [filteredItems.length, page, pages, arrayFilters]);

  const renderCell = useCallback(
    (element: any, columnKey: React.Key, isMobile: boolean, item: any) => {
      const column = columns.find((col) => col.uid === columnKey);
      if (!column) return null;

      let count = 0;

      if (count == 0) {
        element.deletedAt == undefined
          ? (element.status = "Ativo")
          : (element.status = "Inativo");
        count++;
      }

      const cellValue = element[columnKey as keyof any];

      switch (column.type) {
        case "user":
          return (
            <User
              avatarProps={{
                radius: "lg",
                name: element.name,
                isBordered: true,
              }}
              description={element.email}
              name={cellValue}
            >
              {cellValue}
            </User>
          );
        case "text":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm text-default-400">
                {cellValue || column.voidValueMessage || ""}
              </p>
            </div>
          );
        case "chips":
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[cellValue ?? ""]}
              size="sm"
              variant="flat"
            >
              {cellValue}
            </Chip>
          );
        case "actions":
          if (isMobile) {
            return (
              <CustomDropdown
                element={element}
                elementName={elementName}
                modalInputs={modalInputs}
                isMobile={isMobile}
                urlModalGetElement={urlModalGetElement}
                searchTable={searchTable}
                updateModalUrl={updateModalUrl}
              />
            );
          } else if (!isMobile) {
            return (
              <div className="relative flex items-center justify-center gap-4">
                <Tooltip content="Detalhes">
                  <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                    <Modal
                      id={element.id}
                      elementName={elementName}
                      inputs={modalInputs}
                      trigger={<IoEyeOutline />}
                      isIcon
                      isView
                      title="Detalhes"
                      urlModalGetElement={urlModalGetElement}
                    />
                  </span>
                </Tooltip>
                <Tooltip content={`Editar ${elementName}`}>
                  <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                    <Modal
                      id={element.id}
                      elementName={elementName}
                      inputs={modalInputs}
                      trigger={<FaUserEdit />}
                      isIcon
                      isUpdate
                      updateModalUrl={updateModalUrl}
                      searchTable={searchTable}
                      title={`Editar ${elementName}`}
                      urlModalGetElement={urlModalGetElement}
                    />
                  </span>
                </Tooltip>
                <Tooltip color="danger" content={`Excluir ${elementName}`}>
                  <span className="text-lg text-danger cursor-pointer active:opacity-50">
                    <Modal
                      id={element.id}
                      elementName={elementName}
                      trigger={<AiOutlineUserDelete />}
                      isIcon
                      isDelete
                      searchTable={searchTable}
                      title={`Deletar ${elementName}`}
                      urlModalGetElement={urlModalGetElement}
                    />
                  </span>
                </Tooltip>
              </div>
            );
          }
        default:
          return cellValue;
      }
    },
    []
  );

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col">
        <div className="flex gap-4 justify-between items-center">
          <div className="flex gap-6">
            <Button
              variant="solid"
              color="primary"
              endContent={<FaSearch />}
              onClick={searchTable}
            >
              {isMobile ? "" : <p>Pesquisar</p>}
            </Button>
            <Button
              variant="shadow"
              color="default"
              endContent={<AiOutlineClear className="w-4 h-4" />}
              onClick={clearFilters}
              className="text-gray-200 font-medium bg-gray-800"
            >
              {isMobile ? "" : <p>Limpar Filtros</p>}
            </Button>
            {add && !isMobile && (
              <Modal
                inputs={modalInputs}
                elementName={elementName}
                trigger={<IoIosAddCircle className="w-5 h-5" />}
                addModalUrl={addModalUrl}
                searchTable={searchTable}
                isAdd
                title={`Adicionar ${elementName}`}
              />
            )}
          </div>
          <label className="flex items-center text-default-400 text-small">
            {!isMobile && "Qtd por páginas"}
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="50">50</option>
              <option value="100">100</option>
              {/* <option value="9999999">Todos</option> */}
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    onRowsPerPageChange,
    data?.users.length ?? 0,
    arrayFilters,
    isMobile,
  ]);

  return (
    <>
      {add && isMobile && (
        <div className="mt-4">
          <Modal
            inputs={modalInputs}
            elementName={elementName}
            trigger={<IoIosAddCircle className="w-5 h-5" />}
            isAdd
            searchTable={searchTable}
            addModalUrl={addModalUrl}
            title={`Adicionar ${elementName}`}
          />
        </div>
      )}
      <TableUI
        aria-label="Tabela de clientes"
        className="mt-6"
        topContent={topContent}
        classNames={{
          wrapper: size,
          table: ["w-full", "h-3/5", "justify-start", "items-start"],
          tbody: ["justify-start"],
        }}
        topContentPlacement="inside"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="inside"
      >
        <TableHeader columns={isMobile ? mobileColumns : columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={"Não foi encontrado registros."}
          items={filteredItems ?? []}
          loadingContent={<Spinner />}
          loadingState={loadingState}
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>
                  {renderCell(item, columnKey, isMobile, item)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </TableUI>
    </>
  );
}
