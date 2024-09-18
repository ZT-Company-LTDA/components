import { Button, Skeleton, skeleton } from '@nextui-org/react';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AcceptedFileTypeKey } from '../Upload/TypeAcceptFiles';
import axios from "../utils/AxiosInstance";
import useSWR from 'swr';
import DOMPurify from 'dompurify';
import EditorComponent from '../TipTap/Editor';
import { CardMedia } from '@mui/material';

export type SelectedOption = "PHOTO" | "VIDEOS" | "EVOLUTION" | "REPORTS";
type MultiDocViewerProps = {
  uuid: string;
  url?:string;
  token: string;
  folder:SelectedOption;
  fileType: AcceptedFileTypeKey | undefined
  onCloseModal?: () => void;
}

export const MultiDocumentViewer = ({ uuid, fileType, token,url,folder,onCloseModal }:MultiDocViewerProps) => {

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
  
  const createMarkup = (html:string) => {
    return { __html: DOMPurify.sanitize(html) };
  };
  
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
          content={data}
          onCloseModal={onCloseModal}
          onSave={(newContent:string)=>console.log('Editou o arquivo, novo texto: ', newContent )}
        />
      }
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