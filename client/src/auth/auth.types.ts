export type Role = 'admin'| 'user'| 'seller';

export type Profile ={
    id: number;
    username: string;
    email:string;
    role: Role;
    phone?: string;
    bio?:string;
    image?: string | null;
    is_superuser?: boolean;
    is_approved?: boolean;
    business_name?: string;
    category?: string;
    owner_name?: string;
    registration_number?: string;
    address?: string;
    id_document?: string;
    risk_score?: number; 
    trust_score?: number;
    status?: 'active' | 'inactive';

}

export type RegisterPayload = {

    username: string;
    email: string;
    password:string;
}

export type LoginPayload = {
  username: string;
  password: string;
};

export type SidebarItemProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

export type StatCardProps = {
  title: string;
  value: string;
  color: string;
};

export type OrderRowProps = {
  id: string;
  customer: string;
  status: "Completed" | "Pending" | "Processing";
  amount: string;
};

export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  img?: string | null;
  status?: string;  
  category?: string;
  seller_name?: string;
  created_at?: string;
  updated_at?: string;
  internal_interest: number; 
  external_interest: string; 
  
}

