"use client";
import React, { useCallback, useMemo, useState } from "react";
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from "react-icons/io";
import { Spinner } from "@nextui-org/react";
import { useScreenContext } from "../contexts/ContextScreen";
import { IoEyeOutline } from "react-icons/io5";
import axios from "../utils/AxiosInstance";
import useSWR from "swr";
import { useTableCrudContext } from "../contexts/ContextTableCrud";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { ModalZtTable } from "../Modal/ModalTable";
import { FaCirclePlus } from "react-icons/fa6";
import Avatar from "../Avatar/Avatar";
import Chip from "../Chip/Chip";
import { FaSearch } from "react-icons/fa";
import { ModalContent } from "../Modal/ModalContent";

const Table: React.FC<TableProps> = ({
  dataInitial,
  columns,
  token,
  urlFetcher,
  elementName,
  modalInputs,
  addModalUrl,
  updateModalUrl,
  urlModalGetElement,
}) => {
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { actions } = useScreenContext();
  const { arrayFilters } = useTableCrudContext();
  const [selectedElement, setSelectedElement] = useState<number>();
  const [isOpen, setIsOpen] = useState(false);
  const [isAddModal, setIsAddModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const openModal = () => setIsOpen(true);
  const closeModal = () => {setIsOpen(false); setIsAddModal(false)};

  const fetcher = async (url: string) => {
    return await axios(url, {
      method: "POST",
      data: JSON.stringify({ arrayFilters }),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        console.log(res.data)
        return res.data
      })
      .catch((error) => {
        console.error("error fetcher table", error);
      });
  };

  const { data, error, isLoading, mutate } = useSWR<RequestElementsProps>(
    token ? `${urlFetcher}?page=${currentPage}&rows=${rowsPerPage}` : null,
    fetcher,
    {
      keepPreviousData: true,
      revalidateOnReconnect: false,
      revalidateOnFocus: false,
    }
  );

  const elements = useMemo(() => (data ? data.results : dataInitial.results), [data, dataInitial]);
  const totalPages = useMemo(
    () => (data ? Math.ceil(data.count / rowsPerPage) : Math.ceil(dataInitial.count / rowsPerPage)),
    [data, dataInitial, rowsPerPage]
  );

  const handlePageChange = useCallback((page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      mutate(); // Atualiza os dados ao mudar de página
    }
  }, [totalPages, mutate]);

  const handleRowsPerPageChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const newRowsPerPage = Number(event.target.value);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
    mutate(); // Atualiza os dados ao mudar o número de linhas por página
  }, [mutate]);

  const searchTable = useCallback(async () => {
    setIsSearching(true); // Inicia o estado de carregamento
    await mutate(); // Atualiza os dados
    setIsSearching(false); // Finaliza o carregamento
  }, [mutate]);

  const openAdd  = () => {
    setIsAddModal(true);
    console.log(isAddModal);
    openModal();
  }

  const renderCell = useCallback(
    (element: any, columnKey: React.Key, isMobile: boolean) => {
      const column = columns.find((col) => col.uid === columnKey);
      if (!column) return null;

      element.status = element.deletedAt == undefined ? "Ativo" : "Inativo";
      const cellValue = element[columnKey as keyof any];

      switch (column.type) {
        case "user":
          return (
            <div className="flex items-center gap-1">
              <Avatar 
                src={element.image}
                alt={element.name}
                size={35} 
                borderWidth={2}  // Definindo a largura da borda
              />
              <p className="text-sm">{element.name}</p>
            </div>
          );
        case "text":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-center text-sm text-default-400">
                {cellValue || column.voidValueMessage || ""}
              </p>
            </div>
          );
        case "chips":
          return (
            <Chip text={cellValue} color="bg-green-200"/>
          );
        default:
          return cellValue;
      }
    },
    [
      actions,
      columns,
      elementName,
      modalInputs,
      searchTable,
      updateModalUrl,
      urlModalGetElement,
    ]
  );

  return (
    <div className={`w-full overflow-hidden ${isOpen && "pb-28"}`}>
      {isOpen && isMobile ? (
        <>
          <ModalContent
            isOpen={isOpen}
            closeModal={closeModal}
            id={selectedElement}
            elementName={elementName}
            isAddModal={isAddModal}
            isViewModal={!isAddModal}
            inputs={modalInputs}
            trigger={<IoEyeOutline />}
            addModalUrl={addModalUrl}
            updateModalUrl={updateModalUrl}
            searchTable={searchTable}
            title="Detalhes"
            urlModalGetElement={urlModalGetElement}
          />
        </>
      ) : (
        <>
          <div className="flex justify-start items-center mb-4 gap-4">
            <div>
              <label htmlFor="rowsPerPage" className="mr-2">
                Mostrar:
              </label>
              <select
                id="rowsPerPage"
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                className="border border-gray-300 p-2 rounded"
              >
                <option value={10}>10</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            <button onClick={openAdd} className="bg-blue-600 text-white px-4 py-2 rounded-xl border border-solid border-gray-200 shadow-2xl hover:bg-blue-400 duration-500 flex items-center gap-2">
              <p>Adicionar</p>
              <FaCirclePlus />
            </button>
            <button onClick={searchTable} className="bg-gray-800 text-white px-4 py-2 rounded-xl border border-solid border-gray-200 shadow-2xl hover:bg-gray-500 duration-500 flex items-center gap-2">
              <p>Pesquisar</p>
              <FaSearch />
            </button>
          </div>

          <div className="overflow-y-auto max-h-[70vh] overflow-x-auto rounded-lg border border-gray-200 relative pt-2 p-4">
            <table className="table-auto w-full">
              <thead className="sticky top-0 bg-gray-300 bg-opacity-50 backdrop-blur text-white rounded-3xl shadow-large">
                <tr>
                  {columns.map((column, index) => (
                    <th
                      key={column.uid}
                      className={`px-4 py-2 bg-gray-300 text-gray-600 shadow-large text-sm ${index == 0 && 'rounded-l-3xl'} ${index == columns.length - 1 && 'rounded-r-3xl'} ${
                        column.uid == "name" ? "text-left" : "text-center"
                      }`}
                    >
                      {column.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading || isSearching ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="text-center py-4 h-96"
                    >
                      <Spinner size="lg" />
                    </td>
                  </tr>
                ) : (
                  elements?.map((element, index) => (
                    <tr
                      key={index}
                      onClick={() => {
                        openModal();
                        setSelectedElement(Number(element.id));
                      }}
                      className={`hover:bg-gray-100 hover:text-gray-700 duration-500 cursor-pointer bg-white`}
                    >
                      {columns.map((column) => (
                        <td
                          key={column.uid}
                          className={`px-4 py-2 ${
                            column.uid == "name" ? "text-left" : "text-center"
                          }`}
                        >
                          {renderCell(element, column.uid, false)}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {error && (
              <p className="text-red-500">
                Ocorreu um erro ao buscar os dados.
              </p>
            )}
          </div>

          <div className="flex justify-center gap-4 items-center mt-4">
            <button
              className="p-2 rounded text-gray-600"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <IoIosArrowDropleftCircle size={24} />
            </button>
            <span className="font-semibold text-gray-600">
              Página {currentPage} de {totalPages}
            </span>
            <button
              className="p-2 rounded text-gray-600"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <IoIosArrowDroprightCircle size={24} />
            </button>
          </div>
        </>
      )}

      {!isMobile && (
        <ModalZtTable title="Paciente" isOpen={isOpen} onClose={closeModal} isAddModal={isAddModal} showButtonFooter>
          <ModalContent
            isOpen={isOpen}
            closeModal={closeModal}
            id={selectedElement}
            elementName={elementName}
            inputs={modalInputs}
            trigger={<IoEyeOutline />}
            isAddModal={isAddModal}
            isViewModal={!isAddModal}
            title="Detalhes"
            searchTable={searchTable}
            addModalUrl={addModalUrl}
            updateModalUrl={updateModalUrl}
            urlModalGetElement={urlModalGetElement}
          />
        </ModalZtTable>
      )}
    </div>
  );
};

export default Table;
