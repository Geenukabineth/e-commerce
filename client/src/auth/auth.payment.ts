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