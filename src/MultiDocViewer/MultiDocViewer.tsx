import { Textarea, Button, Skeleton } from '@nextui-org/react';
import React, { useState, useEffect, useCallback } from 'react';
import { AcceptedFileTypeKey } from '../Upload/TypeAcceptFiles';
import axios from "../utils/AxiosInstance";
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import useSWR from 'swr';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

type SelectedOption = "PHOTO" | "VIDEO" | "EVOLUTION" | "REPORTS";
type MultiDocViewerProps = {
  uuid: string;
  url?:string;
  token: string;
  folder:SelectedOption;
  fileType: AcceptedFileTypeKey
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

  const handleSave = () => {
    setIsEditing(false);
    if (onSave) {
      onSave(content);
    }
  };

  useEffect(() => {
    if (data) {
      setContent(data);
    }
  }, [data]);

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
      <>
        {isEditing ? (
          <div className='flex flex-col h-full w-full items-center justify-between'>
            {
              <ReactQuill
                value={content}
                onChange={setContent}
                modules={{
                  toolbar: [
                    [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    ['bold', 'italic', 'underline'],
                    // ['link', 'image'],
                    [{ 'align': [] }],
                    ['clean'],
                  ],
                }}
                theme="snow" 
                formats={[
                  'header', 'font', 'list', 'bullet', 'bold', 'italic', 'underline',
                  'link', 'align'
                ]}
                className="bg-white text-black rounded-lg border-none w-full h-[80%]"
                key="multi-doc-view"
              />
            }
            <Button onClick={handleSave} className='w-1/2'>Salvar</Button>
          </div>
        ) : (
          <div className='flex flex-col justify-between h-full w-full items-center overflow-y-scroll' onClick={handleEdit}>
            {
              <div
                dangerouslySetInnerHTML={{ __html: content }} 
                className='max-w-[90%] break-words'
              />
            }
          </div>
        )}
      </>
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