// auth.sales.ts
import { http } from "../service/http"; 

export async function getInfluencers(category: string, hashtag: string) {  
    const res = await http.get(`/v4/influencers/tiktok/search/?query=${category} ${hashtag}`);
    return res.data;
}

export async function getPromotions() {
    // Fetches the list of active promotions
    const res = await http.get(`/v4/promotions/`);
    return res.data;
}

export async function createPromotion(promoData: { product_name: string; discount_amount: string; duration: string }) {
    // Sends a POST request to create a new promotion
    const res = await http.post(`/v4/promotions/`, promoData);
    return res.data;
}