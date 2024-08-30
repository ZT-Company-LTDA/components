import { Button } from '@nextui-org/react'
import React, { useState, CSSProperties, Dispatch, useEffect } from 'react'
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import { CiCircleInfo } from "react-icons/ci";

import {
  IoIosArrowUp ,
  IoIosArrowDown,
  IoMdClose
} from 'react-icons/io'
import { useMediaQuery } from '../hooks/useMediaQuery'
import toast from 'react-hot-toast';

interface Props extends React.HTMLProps<HTMLDivElement> {
  direction: 'bottom' | 'top'
  lengthFiles: number | undefined
}

const CustomDrawer: React.FC<Props> = ({ direction, ...props }) => {
  const [isMinimized, setIsMinimized] = useState(false)
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [isOpen, setIsOpen] = useState(true)
  const handleMinimize = () => {
    setIsMinimized(!isMinimized)
  }
  const handleClose = () => {
    setIsOpen(false)
  }
  const handleOpen = () => {
    if(!!props.lengthFiles == false ){
      return toast.error(`Não existe arquivos na fila de upload.`);
    }
    if(isOpen==true) {
      return toast(`Fila de arquivos já está aberta.`)
    }
    setIsOpen(true)
  }
  
  const getDrawerSize = () => {
    if (isMinimized) {
      return '50px'
    }
  }
  const styleDrawer: CSSProperties = {
    bottom: '.2rem',
    left: isMobile ? '0' : 'unset',  // Deixa o 'left' como 'unset' em telas maiores
    right: isMobile ? '0' : '2rem',  // Define 'right' para telas maiores para posicionar o drawer
    width: isMobile ? '100vw' : '20rem',  // Ocupa 100% da largura em dispositivos móveis
    position: 'fixed',
    boxSizing: 'border-box',
    overflowY: 'auto',
    borderRadius: '8px',
  }

  const styleDrawerMinimized: CSSProperties = {
    ...styleDrawer,
    height: '50px'
  }

  return (
    <>

      <Button
        onClick={handleOpen}
        className="w-full md:w-1/2 break-words text-center overflow-hidden whitespace-normal"
      >
        Abrir Lista de Arquivos
      </Button>
      <Drawer
        open={isOpen && !!props.lengthFiles}
        className={props.className}
        enableOverlay={false}
        direction={direction}
        size={getDrawerSize()}
        style={isMinimized ? styleDrawerMinimized : styleDrawer}
      >
        <div
          className="h-10 bg-gray-200 rounded-md text-black border-2 border-white sticky top-0 z-10 select-none"
        >
          <div className="h-full flex items-center justify-between">
            <p className="pl-4 text-sm">{props.lengthFiles} Arquivo(s) para upload.</p>
            <div className="flex items-center justify-center gap-6 mx-2">
              {isMinimized ? (
                <IoIosArrowUp 
                  size={26}
                  onClick={handleMinimize}
                  className="cursor-pointer hover:scale-110 transition-transform duration-200 rounded-full hover:bg-gray-300"
                />
              ) : (
                <IoIosArrowDown 
                  size={26}
                  onClick={handleMinimize}
                  className="cursor-pointer hover:scale-110 transition-transform duration-200 rounded-full hover:bg-gray-300"
                />
              )}
              <IoMdClose
                size={26}
                onClick={handleClose}
                className="cursor-pointer rounded-full hover:scale-110 hover:bg-gray-300 transition-transform duration-200"
              />
            </div>
          </div>
        </div>
        {!isMinimized && <div className="">{props.children ?? ''}</div>}
      </Drawer>
    </>
  )
}

export default CustomDrawer
