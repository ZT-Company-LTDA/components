'use client'
import { useCallback, useMemo, useState } from 'react'
import {
  Table,
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
  Input,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { AiOutlineMore } from "react-icons/ai";
import useSWR from "swr";
import { CiSearch } from "react-icons/ci";
import ModalView from "./ModalCrud/ModalView";
import { useMediaQuery } from "../hooks/useMediaQuery";
import * as React from "react";
import ModalEdit from "./ModalCrud/ModalEdit";
import ModalDelete from "./ModalCrud/ModalDelete";
import { useDebounce } from 'use-debounce';

const statusColorMap: Record<string, ChipProps['color']> = {
  Ativo: 'success',
  Inativo: 'danger'
}

interface TableUsersProps {
  count: number
  users: any[]
}

interface Columns {
  name: string
  uid: string
  type: string
  voidValueMessage?: string
  isMobile: boolean
}

interface Size {
  width: string
  height: string
}

interface TableCrudProps {
  columns: Columns[]
  urlFetcher: string
  token: string | undefined
  elementName: string
  size: Size
}

export function TableCrud({
  columns,
  urlFetcher,
  token,
  elementName,
  size
}: TableCrudProps) {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [filterValue, setFilterValue] = useState('')
  const [debouncedValue] = useDebounce(filterValue, 1000);
  const [mobileColumns, setMobileColumns] = useState(
    columns.filter(column => column.isMobile)
  )

  const fetcher = async (url: string) => {
    return await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
  }

  const { data, isLoading } = useSWR<TableUsersProps>(
    token ? `${urlFetcher}?page=${page}&rows=${rowsPerPage}&search=${debouncedValue}` : null,
    fetcher,
    {
      keepPreviousData: true,
      revalidateOnReconnect:false,
      revalidateOnFocus:false
    }
  )

  const filteredItems = useMemo(() => {
    let filteredUsers = [...(data?.users ?? [])]

    if (debouncedValue) {
      filteredUsers = filteredUsers.filter((user) =>
        user.name.toLowerCase().includes(debouncedValue.toLowerCase())
      )
    }
    return filteredUsers
  }, [data?.users, debouncedValue])

  const pages = useMemo(() => {
    return data?.count ? Math.ceil(data.count / rowsPerPage) : 1
  }, [data?.count, rowsPerPage])

  const loadingState =
    isLoading ? 'loading' : 'idle'

  const onRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value))
      setPage(1)
    },
    []
  )

  const onSearchChange = useCallback((value?: string) => {
    setFilterValue(value??'')
    setPage(1)
  }, [])

  const onClear = useCallback(() => {
    setFilterValue('')
    setPage(1)
  }, [])

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
    )
  }, [filteredItems.length, page, pages, debouncedValue])

  const renderCell = useCallback(
    (element: any, columnKey: React.Key, isMobile: boolean, item: any) => {
      const column = columns.find(col => col.uid === columnKey)
      if (!column) return null

      let count = 0

      if (count == 0) {
        element.deletedAt == undefined
          ? (element.status = 'Ativo')
          : (element.status = 'Inativo')
        count++
      }

      const cellValue = element[columnKey as keyof any]

      switch (column.type) {
        case 'user':
          return (
            <User
              avatarProps={{
                radius: 'lg',
                name: element.name,
                isBordered: true
              }}
              description={element.email}
              name={cellValue}
            >
              {cellValue}
            </User>
          )
        case 'text':
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize text-default-400">
                {cellValue || column.voidValueMessage || ''}
              </p>
            </div>
          )
        case 'chips':
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[cellValue ?? '']}
              size="sm"
              variant="flat"
            >
              {cellValue}
            </Chip>
          )
        case 'actions':
          if (isMobile) {
            return (
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="light" isIconOnly radius="full">
                    <AiOutlineMore className="w-6 h-16" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Action event example"
                  onAction={key => alert(key)}
                >
                  <DropdownItem key="new" startContent={<ModalView />}>
                    Detalhes
                  </DropdownItem>
                  <DropdownItem key="copy" startContent={<ModalEdit />}>
                    Editar {elementName}
                  </DropdownItem>
                  <DropdownItem
                    key="edit"
                    className="text-danger"
                    color="danger"
                    startContent={<ModalDelete />}
                  >
                    Deletar {elementName}
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            )
          } else if (!isMobile) {
            return (
              <div className="relative flex items-center justify-center gap-4">
                <Tooltip content="Detalhes">
                  <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                    <ModalView />
                  </span>
                </Tooltip>
                <Tooltip content={`Editar ${elementName}`}>
                  <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                    <ModalEdit />
                  </span>
                </Tooltip>
                <Tooltip color="danger" content={`Excluir ${elementName}`}>
                  <span className="text-lg text-danger cursor-pointer active:opacity-50">
                    <ModalDelete />
                  </span>
                </Tooltip>
              </div>
            )
          }
        default:
          return cellValue
      }
    },
    []
  )

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Procure pelo nome..."
            startContent={<CiSearch />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <label className="flex items-center text-default-400 text-small">
            Qtd por páginas.
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="9999999">Todos</option>
            </select>
          </label>
        </div>
      </div>
    )
  }, [
    filterValue,
    onSearchChange,
    onRowsPerPageChange,
    data?.users.length,
    debouncedValue
  ])

  return (
    <Table
      aria-label="Tabela de clientes"
      className="my-2"
      topContent={topContent}
      classNames={{
        wrapper: `max-h-[${size.height}vh] max-w-[${size.width}vw]`
      }}
      topContentPlacement="outside"
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
    >
      <TableHeader columns={isMobile ? mobileColumns : columns}>
        {column => (
          <TableColumn
            key={column.uid}
            align={column.uid === 'actions' ? 'center' : 'start'}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        emptyContent={'Não foi encontrado registros.'}
        items={filteredItems ?? []}
        loadingContent={<Spinner />}
        loadingState={loadingState}
      >
        {item => (
          <TableRow key={item.clients}>
            {columnKey => (
              <TableCell>
                {renderCell(item, columnKey, isMobile, item)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
