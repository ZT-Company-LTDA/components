// useFormData.ts

import { useCallback } from 'react';

export interface Data {
  [key: string]: string | number | boolean | undefined;
}

export interface UseFormDataResult {
  createFormData: (
    files: File[], 
    data: Data, 
    fileFieldName?: string,
    jsonFieldName?: string
  ) => FormData;
}

const useFormData = (): UseFormDataResult => {
  const createFormData = useCallback((
    files: File[], 
    data: Data, 
    fileFieldName: string = 'pdfs',
    jsonFieldName: string = 'data'
  ): FormData => {
    const formData = new FormData();
    
    files.forEach((file) => {
      formData.append(fileFieldName, file);
    });

    formData.append(jsonFieldName, JSON.stringify(data));

    return formData;
  }, []);

  return { createFormData };
};

export default useFormData;