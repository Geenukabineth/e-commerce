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

export async function changePasswordApi(payload: any): Promise<{message: string}> {
    const res = await http.post("/v1/change-password/", payload);
    return res.data;
}

export async function logoutApi() {
    const refresh = tokenStore.getRefresh();
    if (refresh) {
        try {
            await http.post("/v1/logout/", { refresh });
        } catch (error) {
            console.error("Logout failed on server", error);
        }
    }
    tokenStore.clear();
}

export async function registerSellerApi(formData: FormData): Promise<{message: string}> {
    const res = await http.post("/v1/seller/register/", formData);
    return res.data;
}   

export async function approveSellerApi(sellerId: number): Promise<{message: string}> {
    const res = await http.post(`/v1/admin/sellers/${sellerId}/approve/`);
    return res.data;
}
export async function getAllSellersApi(): Promise<Profile[]> {
    const res = await http.get("/v1/users/sellers/");
    return res.data as Profile[];
}
export async function getPendingSellersApi(): Promise<Profile[]> {
    const res = await http.get("/v1/admin/sellers/?is_approved=false");
    return res.data as Profile[];
}
export async function deleteSellerApi(sellerId: number): Promise<{message: string}> {
    const res = await http.delete(`/v1/users/sellers/${sellerId}/`);
    return res.data;
}

export async function restrictSellerApi(sellerId: number): Promise<{message: string}> {
    const res = await http.post(`/v1/admin/sellers/${sellerId}/restrict/`);
    return res.data;
}



export async function googleLoginApi(accessToken: string): Promise<{message:string}> {
    const res = await http.post("/v1/google-login/", { access_token: accessToken });
    const tokens = res.data as Tokens;
    tokenStore.set(tokens);
    return res.data;
}