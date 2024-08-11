import { NextPage } from 'next'
import React from 'react'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { IoCloudUploadOutline } from 'react-icons/io5'

interface Props {}

const UploadComponent: NextPage<Props> = ({}) => {
  const [documents, setDocuments] = useState<File[]>()
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      const reader = new FileReader()
      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result
        console.log(binaryStr)
      }
      reader.readAsArrayBuffer(file)
    })
    setDocuments(acceptedFiles)
  }, [])

  const {
    acceptedFiles,
    fileRejections,
    getRootProps,
    getInputProps,
    isDragActive
  } = useDropzone({
    accept: {
      'application/pdf': []
    },
    onDrop
  })
  
  return (
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
            <button
              type="button"
              onClick={() => open}
              className="border-none text-center opacity-50 bg-[#DAD8D8] h-[50px] w-[70%] rounded-xl text-black duration-[0.6s] hover:bg-blue-600 hover:text-white mb-4 p-4 text-xs"
              disabled={true}
            >
              Selecionar arquivos
            </button>
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
  )
}

export default UploadComponent