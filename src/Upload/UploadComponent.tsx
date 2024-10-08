import { NextPage } from 'next'
import React, { useEffect } from 'react'
import { useCallback, useState } from 'react'
import { Accept, FileRejection, useDropzone } from 'react-dropzone'
import { IoCloudUploadOutline } from 'react-icons/io5'
import CustomDrawer from '../Drawer/CustomDrawer'
import { Button, Listbox, ListboxItem, Tooltip } from '@nextui-org/react'
import { MdDelete } from 'react-icons/md'
import { GrDocumentPdf } from 'react-icons/gr'
import toast from 'react-hot-toast'
import { acceptsFilesExtension, AcceptedFileTypeKey, AcceptedFileTypes } from './TypeAcceptFiles';
import { IconType } from 'react-icons'
import axios from "../utils/AxiosInstance";
import useFormData from '../hooks/useCreateFormDataDocument'
import { signOut } from 'next-auth/react'

interface Props {
  showAcceptFiles?: boolean;
  documents: File[] | undefined;
  typeFiles: AcceptedFileTypeKey[];
  setDocuments:React.Dispatch<React.SetStateAction<File[] | undefined>>;
  IconBaseTypeFiles:IconType
  token:string;
  dataWithDocuments?:any
  keyDocFormData:string
  keyFormData?:string
  url:string
  triggerSearch?:() => void
}

export const UploadComponent = ({showAcceptFiles,documents,setDocuments,typeFiles,IconBaseTypeFiles,token,dataWithDocuments,keyFormData,keyDocFormData,url, triggerSearch}:Props) => {  
  const [loading, setLoading] = useState<boolean>(false)
  const { createFormData } = useFormData()
  
  const selectedExtensions = typeFiles.reduce((acc, key) => {
    acc[key] = acceptsFilesExtension[key];
    return acc;
  }, {} as AcceptedFileTypes);

  const onDrop = useCallback((acceptedFiles: File[],fileRejections:FileRejection[]) => {
    setDocuments(acceptedFiles)

    fileRejections.forEach(file => {
      toast.error(`O Arquivo ${file.file.name} não é aceito. Por favor coloque o tipo ${typeFiles}`)
    })
    // acceptedFiles.forEach(file => {
    //   const reader = new FileReader()
    //   reader.onabort = () => console.log('file reading was aborted')
    //   reader.onerror = () => console.log('file reading has failed')
    //   reader.onload = () => {
    //     // Do whatever you want with the file contents
    //     const binaryStr = reader.result
    //     console.log(binaryStr)
    //   }
    //   reader.readAsArrayBuffer(file)
    // })
  }, [setDocuments, typeFiles])

  const {
    acceptedFiles,
    fileRejections,
    getRootProps,
    getInputProps,
    isDragActive
  } = useDropzone({
    accept:selectedExtensions,
    onDrop
  })

  const clearDocs = () => {
    setDocuments([])
  }

  const sendDoc = async (formData: FormData) => {
    try {
      await axios.post(
        `${url}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
        }
      )
      setLoading(false)
    } catch (error) {
      toast.error(`Ocorreu algum erro interno`)
      setLoading(false)
    }
    if(triggerSearch){
      triggerSearch();
    };
  }

  const handleSave = () => {
    setLoading(true)

    if (!documents) {
      toast.error(`Por favor, selecione um arquivo.`)
      setLoading(false)
      return
    }

    const formData = createFormData(documents,dataWithDocuments,keyFormData,keyDocFormData)

    toast.promise(sendDoc(formData), {
      loading: 'Enviando arquivo...',
      success: <b>Arquivo enviado com sucesso.</b>,
      error: <b>Ocorreu um erro ao enviar o arquivo.</b>
    })
  }

  const clearFiles = () => {
    setDocuments([])
  }

  
  const AcceptedFileItems = () => {
    return (
      <CustomDrawer direction="bottom" lengthFiles={documents?.length}>
        <Listbox
          items={documents ?? []}
          aria-label="Upload Drawer"
          // onAction={(key) => console.log('key :>> ', key)}
          emptyContent={'Sem arquivos para fazer upload.'}
        >
          {item => (
            <ListboxItem
              textValue='Items para fazer upload'
              key={item.name}
              color={'default'}
              endContent={
                <MdDelete
                  onClick={() => {
                    setDocuments(
                      documents?.filter(doc => doc.name != item.name)
                    )
                  }}
                  className='hover:text-red-600 hover:bg-gray-300 rounded-full hover:scale-110 transition-transform duration-200 w-5 h-5'
                />
              }
              startContent={<IconBaseTypeFiles className="text-red-600" />}
            >
              <Tooltip placement="left-end" content={item.name} key={item.name} closeDelay={0}>
                {item.name}
              </Tooltip>
            </ListboxItem>
          )}
        </Listbox>
      </CustomDrawer>
    )
  }

  return (
    <>
      <div
      {...getRootProps({ className: 'dropzone' })}
      className={`${'border-[3px] border-gray-300 border-dashed mb-4 rounded-xl max-md:w-full'} ${
        isDragActive ? 'bg-gray-200' : ''
      }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-6 h-full">
          {isDragActive ? (
            <>
              <IoCloudUploadOutline
                size="12vh"
                className="text-gray-400 opacity-40"
              />
              <Button
                type="button"
                onClick={() => open}
                className="border-none text-center opacity-50 bg-[#DAD8D8] h-[50px] w-[70%] rounded-xl text-black duration-[0.6s] hover:bg-blue-600 hover:text-white mb-4 p-4 break-words overflow-hidden whitespace-normal"
                disabled={true}
              >
                Selecionar arquivos
              </Button>
            </>
          ) : (
            <>
              <IoCloudUploadOutline
                size="12vh"
                className="text-gray-400 opacity-40"
              />
              <button
                type="button"
                onClick={() => open}
                className="border-none text-center opacity-50 bg-[#DAD8D8] h-[50px] w-[70%] rounded-xl text-black duration-[0.6s] hover:bg-blue-600 hover:text-white mb-4 text-xs"
              >
                Selecionar arquivos
              </button>
            </>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2 md:flex-row md:gap-2">
        <Button
          color="primary"
          onClick={handleSave}
          className="w-full break-words text-center overflow-hidden whitespace-normal"
          isLoading={loading}
          isDisabled={!documents?.length}
        >
          Enviar arquivos
        </Button>
        <div className="flex w-full gap-2">
          <Button
            color="default"
            onClick={clearFiles}
            className="w-full break-words text-center overflow-hidden whitespace-normal"
            isDisabled={!documents?.length}
          >
            Limpar fila de arquivos
          </Button>
          {
            showAcceptFiles && 
            <AcceptedFileItems/>
          }
        </div>
      </div>
    </>
  )
}