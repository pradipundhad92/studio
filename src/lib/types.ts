export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  profilePictureUrl: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface Tenant {
  id: string;
  name: string;
  users: User[];
  clients: Client[];
}
