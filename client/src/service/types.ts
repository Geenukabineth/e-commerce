export type ApiError = {
  detail?: string;
  message?: string;
  [key: string]: unknown;
};

export type Tokens ={
    access: string;
    refresh:string;
};