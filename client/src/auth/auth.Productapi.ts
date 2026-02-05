// auth.api.ts or product.api.ts
import {http} from "../service/http"; // Assuming your axios instance is here

export async function getAdminProductsApi() {
    const res = await http.get("/v2/admin/products/");
    return res.data;
}


export async function approveProductApi(productId: number, demandScore: number) {
    const res = await http.post(`/v2/admin/products/${productId}/approve/`, { demand_score: demandScore });
    return res.data;
}

export async function rejectProductApi(productId: number) {
    const res = await http.post(`/v2/admin/products/${productId}/reject/`);
    return res.data;
}

export async function createProductApi(formData: FormData): Promise<any> {
    const res = await http.post("/v2/products/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
}
export async function getSellerProductsApi(): Promise<any[]> {
    const res = await http.get("/v2/products/");
    return res.data as any[];
}
export async function updateProductApi(productId: number, formData: FormData): Promise<any> {
    const res = await http.put(`/v2/products/${productId}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
}
export async function deleteProductApi(productId: number): Promise<{message: string}> {
    const res = await http.delete(`/v2/products/${productId}/`);
    return res.data;
}