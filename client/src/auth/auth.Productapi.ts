// auth.api.ts or product.api.ts
import {http} from "../service/http"; // Assuming your axios instance is here

export async function getPendingProductsApi() {
    const res = await http.get("/v1/admin/products/?status=pending");
    return res.data;
}

export async function approveProductApi(productId: number, demandScore: number) {
    const res = await http.post(`/v1/admin/products/${productId}/approve/`, { demand_score: demandScore });
    return res.data;
}

export async function rejectProductApi(productId: number) {
    const res = await http.post(`/v1/admin/products/${productId}/reject/`);
    return res.data;
}