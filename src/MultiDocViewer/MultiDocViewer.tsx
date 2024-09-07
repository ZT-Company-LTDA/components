import { Textarea, Button } from '@nextui-org/react';
import React, { useState, useEffect } from 'react';
import { AcceptedFileTypeKey } from '../Upload/TypeAcceptFiles';
import axios from "../utils/AxiosInstance";

type MultiDocViewerProps = {
  url: string;
  fileType: AcceptedFileTypeKey
  onSave: (newContent:string)=>void
}

export const MultiDocumentViewer = ({ url, fileType, onSave }:MultiDocViewerProps) => {
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (fileType === 'text/plain') {
      axios.get(url, {
        responseType: 'text'
      })
        .then(response => setContent(response.data))
        .catch(error => console.error('Error fetching text file:', error));
    }
  }, [url, fileType]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    if (onSave) {
      onSave(content);
    }
  };

  const handleChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    setContent(event.target.value);
  };

  if (fileType === 'application/pdf') {
    return (
      <iframe
        src={url}
        width="100%"
        height="100%"
        title="PDF Viewer"
        className="h-[80vh]"
        style={{ border: 'none' }}
      >
        Seu navegador não suporta a visualização de PDF.
      </iframe>
    );
  } else if (fileType === 'text/plain') {
    return (
      <div className="bg-white p-4 h-[80vh] flex flex-col">
        {isEditing ? (
          <>
            <Textarea
              value={content}
              onChange={handleChange}
              className="flex-grow mb-4"
            />
            <Button onClick={handleSave}>Salvar</Button>
          </>
        ) : (
          <>
            <pre className="whitespace-pre-wrap flex-grow mb-4">{content}</pre>
            <Button onClick={handleEdit}>Editar</Button>
          </>
        )}
      </div>
    );
  } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return (
      <iframe
        src={url}
        width="100%"
        title="Conteúdo do arquivo de texto"
        className="h-[80vh] bg-white"
        style={{ border: "none" }}
      >
        Seu navegador não suporta a exibição deste conteúdo.
      </iframe>
    );
  } else {
    return (
      <iframe
        src={url}
        width="100%"
        title="Conteúdo do arquivo de texto"
        className="h-[80vh] bg-white"
        style={{ border: "none" }}
      >
        Seu navegador não suporta a exibição deste conteúdo.
      </iframe>
    );
  }
};