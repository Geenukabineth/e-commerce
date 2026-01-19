export type Role = 'admin'| 'user';

export type Profile ={

    username: string;
    email:string;
    role: Role;
    phone?: string;
    bio?:string;
    image?: string | null;
     // ...other properties...
    is_superuser?: boolean; // Add this line
  
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

