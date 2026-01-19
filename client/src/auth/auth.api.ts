import { http, tokenStore } from "../service/http";
import type { Tokens } from "../service/types";
import type { LoginPayload, RegisterPayload, Profile } from "./auth.types";

export async function registerApi(payload:RegisterPayload):Promise<{message:string}> {
    const res =await http.post("/v1/register/", payload);
    return res.data;
}
export async function loginApi(payload:LoginPayload): Promise<{message:string}> {
    const res =await http.post("/v1/login/",payload);
    const tokens = res.data as Tokens;
    tokenStore.set(tokens)
    return res.data;    
}

export async function getProfileApi(): Promise<Profile> {
  const res = await http.get("/v1/profile/");
  return res.data as Profile;
}

export async function updateProfileApi(data: FormData): Promise<Profile> {
  const res = await http.put("/v1/profile/", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data as Profile;
}

export function logoutApi(){
    tokenStore.clear();
}