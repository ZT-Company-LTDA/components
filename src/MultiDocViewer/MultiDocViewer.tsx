import { Button, Skeleton, skeleton } from '@nextui-org/react';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AcceptedFileTypeKey } from '../Upload/TypeAcceptFiles';
import axios from "../utils/AxiosInstance";
import useSWR from 'swr';
import DOMPurify from 'dompurify';
import EditorComponent from '../TipTap/Editor';

type SelectedOption = "PHOTO" | "VIDEO" | "EVOLUTION" | "REPORTS";
type MultiDocViewerProps = {
  uuid: string;
  url?:string;
  token: string;
  folder:SelectedOption;
  fileType: AcceptedFileTypeKey | undefined
  onSave: (newContent:string)=>void
}

export const MultiDocumentViewer = ({ uuid, fileType, onSave, token,url,folder }:MultiDocViewerProps) => {
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const dataDoc = async (uuidAws: string, token: string) => {
    try {
      const response = await axios.get(`/documents/getData/${uuidAws}`, {
        params: {
          folder: folder,
        },
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data.content;
    } catch (error) {
      console.error('Error fetching document data:', error);
      return null;
    }
  };

  const { data, isLoading, error } = useSWR(
    uuid && fileType === 'text/plain' ? [uuid, token] : null,
    async ([uuidAws, token]) => await dataDoc(uuidAws, token),
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = useCallback(() => {
    setIsEditing(false);
    if (onSave) {
      onSave(content);
    }
  }, [content, onSave]);

  useEffect(() => {
    if (data && data !== content) {
      setContent(data);
    }
  }, [data,fileType]);

  useEffect(() => {
    console.log('content :>> ', content);
  }, [content])
  
  // const createMarkup = (html:string) => {
  //   return { __html: DOMPurify.sanitize(html) };
  // };
  
  if (fileType === 'application/pdf') {
    return (
      <iframe
        src={url}
        title="PDF Viewer"
        className='h-full w-full'
        style={{ border: 'none' }}
      >
        Seu navegador não suporta a visualização de PDF.
      </iframe>
    );
  } else if (fileType === 'text/plain') {
    return (
      <div className='flex flex-col h-full w-full items-center justify-between overflow-y-auto'>
      {isLoading ? <Skeleton/> :
        <EditorComponent
          content={content}
          setContent={(newContent:string) => setContent(newContent)}
          onSave={()=>console.log('salvou')}
        />
      }
        {/* <Button onClick={handleSave} className='w-1/2 mt-2' variant='solid' color='primary'>Salvar</Butto                     n> */}
      </div>
    );
  } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return (
      <iframe
        src={url}
        title="Conteúdo do arquivo de texto"
        className="bg-white"
        style={{ border: "none" }}
      >
        Seu navegador não suporta a exibição deste conteúdo.
      </iframe>
    );
  } else {
    return (
      <iframe
        src={url}
        title="Conteúdo do arquivo de texto"
        className="bg-white"
        style={{ border: "none" }}
      >
        Seu navegador não suporta a exibição deste conteúdo.
      </iframe>
    );
  }
};