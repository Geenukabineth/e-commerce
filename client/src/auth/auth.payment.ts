import {http} from "../service/http"; 

export async function getAdminFinaceApi() {
    const res = await http.get("/v3/finance/overview/");
    return res.data;
}

export async function getWalletHubApi() {
    const res = await http.get("/v3/wallet/my-hub/");
    return res.data;
}

export async function getPayoutListApi() {
    const res = await http.get("/v3/payouts/");
    return res.data;
}

export async function payoutActionApi(id: number, action: 'approve' | 'reject' | 'pay') {
    const res = await http.post(`/v3/payouts/${id}/action/`, { action });
    return res.data;
}

export async function getRefundListApi() {
 
    const res = await http.get("/v3/refunds/");
    return res.data;
}

export async function resolveRefundApi(id: number, decision: 'approve' | 'reject') {
    // Matches: path('refunds/<int:pk>/resolve/', ...)
    const res = await http.post(`/v3/refunds/${id}/resolve/`, { decision });
    return res.data;
}

export async function toggleAutoPayoutsApi(enabled: boolean) {
    // Matches a hypothetical endpoint: path('finance/auto-payouts/', ...)
    const res = await http.post("/v3/finance/auto-payouts/", { enabled });
    return res.data;
}


// --- CLIENT REFUNDS ---

export async function getMyRefundsApi() {
    // New endpoint for clients to see their own requests
    const res = await http.get("/v3/refunds/my-requests/");
    return res.data;
}

export async function createRefundRequestApi(data: {
    order_id: string;
    product_name: string;
    seller_name: string;
    amount: number;
    reason: string;
}) {
    const res = await http.post("/v3/refunds/my-requests/", data);
    return res.data;
}
export async function getCardsApi() {
    const res = await http.get("/v3/billing/cards/");
    return res.data;
}

export async function addCardApi(data: any) {
    const res = await http.post("/v3/billing/cards/", data);
    return res.data;
}

export async function deleteCardApi(id: number) {
    await http.delete(`/v3/billing/cards/${id}/`);
}

export async function updateCardApi(id: number, data: any) {
    const res = await http.put(`/v3/billing/cards/${id}/`, data);
    return res.data;
}

// --- SUBSCRIPTIONS ---
export async function getSubscriptionsApi() {
    const res = await http.get("/v3/billing/subscriptions/");
    return res.data;
}

export async function subscriptionActionApi(id: number, action: 'pause' | 'resume' | 'cancel') {
    const res = await http.post(`/v3/billing/subscriptions/${id}/action/`, { action });
    return res.data;
}