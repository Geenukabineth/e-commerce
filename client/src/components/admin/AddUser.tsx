import { useEffect, useState } from "react";
import { getAllSellersApi, approveSellerApi } from "../../auth/auth.api";
import type { Profile } from "../../auth/auth.types";


export default function SellerApproval() {
  const [sellers, setSellers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const data = await getAllSellersApi();
      setSellers(data);
    } catch (err) {
      setError("Failed to load sellers.");
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (id: number, status: boolean) => {
    const action = status ? "approve" : "suspend";
    if (!window.confirm(`Are you sure you want to ${action} this seller?`)) return;

    setActionLoading(id);
    try {
      await approveSellerApi(id);
      
      // Update local state to reflect change immediately
      setSellers((prev) =>
        prev.map((seller) =>
          seller.id === id ? { ...seller, is_approved: status } : seller
        )
      );
    } catch (err) {
      alert(`Failed to ${action} seller.`);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading sellers...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div className="mx-auto max-w-7xl py-10 px-4">
      
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Seller Approval Queue</h1>
          <p className="text-sm text-gray-500">Review and approve vendor accounts before they can sell.</p>
        </div>
        <div className="flex gap-2">
            <div className="rounded-lg bg-yellow-50 px-4 py-2 text-center border border-yellow-100">
                <span className="block text-xl font-bold text-yellow-600">
                    {sellers.filter(s => !s.is_approved).length}
                </span>
                <span className="text-xs text-yellow-600 font-medium">Pending</span>
            </div>
             <div className="rounded-lg bg-green-50 px-4 py-2 text-center border border-green-100">
                <span className="block text-xl font-bold text-green-600">
                    {sellers.filter(s => s.is_approved).length}
                </span>
                <span className="text-xs text-green-600 font-medium">Active</span>
            </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Business Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Owner Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Documents</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {sellers.length === 0 ? (
                <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500">
                        No sellers found.
                    </td>
                </tr>
            ) : (
                sellers.map((seller) => (
                <tr key={seller.id} className="hover:bg-gray-50 transition">
                    
                    {/* Business Info */}
                    <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{seller.business_name || "N/A"}</div>
                        <div className="text-xs text-gray-500">Reg: {seller.registration_number}</div>
                        <div className="text-xs text-gray-400 truncate max-w-[150px]">{seller.address}</div>
                    </td>

                    {/* Owner Info */}
                    <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{seller.owner_name}</div>
                        <div className="text-xs text-gray-500">{seller.email}</div>
                        <div className="text-xs text-gray-500">{seller.phone}</div>
                    </td>

                    {/* Documents */}
                    <td className="px-6 py-4">
                        {seller.id_document ? (
                            <a 
                                href={seller.id_document} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                View ID
                            </a>
                        ) : (
                            <span className="text-xs text-gray-400 italic">No Doc</span>
                        )}
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize
                            ${seller.is_approved 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800 animate-pulse'}
                        `}>
                            {seller.is_approved ? 'Approved' : 'Pending Approval'}
                        </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right text-sm font-medium">
                        {actionLoading === seller.id ? (
                             <span className="text-gray-400 text-xs">Processing...</span>
                        ) : (
                            <div className="flex justify-end gap-2">
                                {!seller.is_approved ? (
                                    <button
                                        onClick={() => handleApproval(seller.id, true)}
                                        className="rounded bg-green-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                                    >
                                        Approve
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleApproval(seller.id, false)}
                                        className="rounded bg-white px-3 py-1.5 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                    >
                                        Suspend
                                    </button>
                                )}
                            </div>
                        )}
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}