// axiosInstance.ts
import axiosLib from 'axios';
import { signOut } from 'next-auth/react';
import {setCookie} from "nookies";
import toast from 'react-hot-toast';

const axios = axiosLib.create({
  baseURL: process.env.NEXT_PUBLIC_URL_BACK,
});

axios.interceptors.response.use(
  (response) => {
    const authHeader:string = response.config.headers['Authorization'] as string
    if (authHeader) {
      const token = authHeader.split(' ')[1]
      setCookie(null,'token', token, {
        maxAge: 14400,
        path:'/'
      });
    }
    return response;
    
  },
  async (error) => {
    if (axiosLib.isAxiosError(error) && error.response?.status === 401) {
      toast.error('Falha na autenticação, você está sendo deslogado. Entre novamente em sua conta.',{
        duration: 5000,
        position:'bottom-center'
      })
      
      setTimeout(async () => {
        await signOut({ callbackUrl: '/signin' });
      }, 3000);
    }else{      
      toast.error(error.message,{
        duration: 3000
      })
      console.error(error);
    }
    return Promise.reject(error);
  }
);

export default axios;
