import { Button, Skeleton, skeleton } from '@nextui-org/react';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AcceptedFileTypeKey } from '../Upload/TypeAcceptFiles';
import axios from "../utils/AxiosInstance";
import useSWR from 'swr';
import DOMPurify from 'dompurify';
import EditorComponent from '../TipTap/Editor';
import { CardMedia } from '@mui/material';
import toast from 'react-hot-toast';
import useFormData from '../hooks/useCreateFormDataDocument';

export type SelectedOption = "PHOTO" | "VIDEOS" | "EVOLUTION" | "REPORTS";

type MultiDocViewerProps = {
  uuid: string;
  url?:string;
  token: string;
  folder:SelectedOption;
  fileType: AcceptedFileTypeKey | undefined
  onCloseModal?: () => void;
  typeDocument:SelectedOption
  title:string
}

const dataDoc = async (uuidAws: string, token: string, folder:SelectedOption) => {
  try {
    const response = await axios.get(`/documents/getData/${uuidAws}`, {
      params: {
        folder,
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

export const MultiDocumentViewer = ({ uuid, fileType, token,url,folder,onCloseModal, typeDocument, title }:MultiDocViewerProps) => {
  const { createFormData } = useFormData(); 
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetcher = async(formData:FormData) => {
    await axios
      .post(
        `/documents/editarUpload/${
          typeDocument === "REPORTS"
            ? "reportsActivities"
            : "evolucoesActivities"
        }`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
  }

  const handleSend = (newContent:string) => {

    const blob = new Blob([new TextEncoder().encode(newContent)], { type: "text/plain;charset=utf-8" });
    const file = new File([blob], title, { type: "text/plain;charset=utf-8" });
    const fileArray: File[] = [file];
    const uuidAws = uuid;
    const formData = createFormData(
      fileArray,
      { uuidAws },
      typeDocument === "REPORTS" ? "reports" : "evolucoes",
      typeDocument === "REPORTS" ? "dataReports" : "dataEvolucoes"
    );

    toast.promise(fetcher(formData), {
      loading: 'Enviando arquivo...',
      success: <b>Arquivo enviado com sucesso.</b>,
      error: <b>Ocorreu um erro ao enviar o arquivo.</b>
    })
  };

  useEffect(() => {
    const fetchData = async () => {
      if (uuid && fileType === 'text/plain') {
        setIsLoading(true);
        setError(null);

        try {
          const result = await dataDoc(uuid, token,folder);
          setData(result);
        } catch (err) {
          setError(err);
          toast.error(error.message)
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [uuid, token, fileType]);
  
  if (fileType === 'application/pdf') {
    return (
      <iframe
        src={url}
        title={title}
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
          onSave={handleSend}
        />
      }
      </div>
    );
  } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return (
      <iframe
        src={`https://view.officeapps.live.com/op/embed.aspx?src=${url}`}
        title={title}
        className="bg-white h-full w-full outline-none border-1 border-black hover:border-none"
        style={{ border: "none" }}
      />
    );
  } else {
    return (
      <div
        className="bg-white"
        style={{ border: "none" }}
      >
        Seu navegador não suporta a exibição deste conteúdo.
      </div>
    );
  }
};