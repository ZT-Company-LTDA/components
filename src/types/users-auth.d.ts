declare module "user" {
  interface User {
    name: string;
    email: string;
    phone: string | null;
    id: number;
    clients: number;
    company: string;
    deletedAt?: string | null;
    status?: string;
  }
}