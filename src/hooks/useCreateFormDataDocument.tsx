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
    fileFieldName: string = 'doc',
    jsonFieldName?: string,
  ): FormData => {

    const formData = new FormData();
    files.forEach((file) => {
      formData.append(fileFieldName, file);
    });

    if (jsonFieldName && Object.keys(data).length > 0) {
      formData.append(jsonFieldName, JSON.stringify(data));
    }

    for (let [key, value] of formData.entries()) {
      console.log(key,value);
    }

    return formData;
  }, []);

  return { createFormData };
};

export default useFormData;
