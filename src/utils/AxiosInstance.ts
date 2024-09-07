// axiosInstance.ts
import axiosLib from 'axios';
import { signOut } from 'next-auth/react';
import toast from 'react-hot-toast';

const axios = axiosLib.create({
  baseURL: process.env.NEXT_PUBLIC_URL_BACK,
});

axios.interceptors.response.use(
  (response) => {
    const authHeader:string = response.config.headers['Authorization'] as string
    if (authHeader) {
      const token = authHeader.split(' ')[1]
      console.log('Token:', token);
      localStorage.setItem('token', token);
    }
    return response;
    
  },
  async (error) => {
    if (axiosLib.isAxiosError(error) && error.response?.status === 401) {
      toast.error('Falha na autenticação, você está sendo deslogado. Entre novamente em sua conta.',{
        duration: 5000,
      })

      setTimeout(async () => {
        await signOut({ callbackUrl: '/signin' });
      }, 5000);
    }
    return Promise.reject(error);
  }
);

export default axios;
