import { useEffect, useState } from "react";
import type { Profile } from "../../auth/auth.types";
import { 
  approveSellerApi, 
  getAllSellersApi, 
  getPendingSellersApi,
  deleteSellerApi,
  restrictSellerApi 
} from "../../auth/auth.api";

export default function UserManagement() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  
  // --- Filters ---
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // --- API Handlers ---
  const fetchUsers = async () => {
    try {
        let data: Profile[];
        // Use the specific pending API when the filter is set to Unverified
        if (statusFilter === "UNVERIFIED") {
            data = await getPendingSellersApi(); 
        } else {
            data = await getAllSellersApi(); 
        }
        setUsers(data);
    } catch (error) {
        console.error("Failed to fetch users", error);
    }
  };

  const handleApprove = async (userId: number) => {
    if (!window.confirm("Approve this seller?")) return;
    try {
        await approveSellerApi(userId);
        fetchUsers();
        setSelectedUser(null); 
    } catch (error) {
        console.error("Failed to approve", error);
    }
  };

  const handleRestrict = async (userId: number) => {
    if (!window.confirm("Restrict this seller? Status will be changed to Unverified.")) return;
    try {
        await restrictSellerApi(userId);
        fetchUsers(); // Refresh list to show updated status
    } catch (error) {
        console.error("Failed to restrict seller", error);
    }
  };

  const handleDelete = async (userId: number) => {
    if (!window.confirm("Are you sure you want to permanently delete this account?")) return;
    try {
        await deleteSellerApi(userId);
        fetchUsers(); // Refresh list after deletion
    } catch (error) {
        console.error("Failed to delete user", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [statusFilter]); // Re-fetch when status filter changes to use getPendingSellersApi

  // --- Client-side Filtering ---
  const filteredUsers = users.filter(u => {
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    
    // If showing 'All', we still filter 'Verified' on the frontend for accuracy
    if (statusFilter === "VERIFIED") return matchesRole && u.is_approved === true;
    
    return matchesRole;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      
      <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 mt-1">Review applications and manage access levels.</p>
      </div>

      {/* --- Filter Bar --- */}
      <div className="mb-6 flex gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col">
            <label className="text-[10px] font-bold text-gray-400 uppercase mb-1">Role</label>
            <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="border-gray-300 rounded-md text-sm">
                <option value="ALL">All Roles</option>
                <option value="seller">Sellers</option>
                <option value="user">Users</option>
            </select>
        </div>

        <div className="flex flex-col">
            <label className="text-[10px] font-bold text-gray-400 uppercase mb-1">Status</label>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border-gray-300 rounded-md text-sm">
                <option value="ALL">All Status</option>
                <option value="VERIFIED">Verified</option>
                <option value="UNVERIFIED">Unverified (Pending)</option>
            </select>
        </div>
      </div>

      {/* --- Main Table --- */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User Identity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.map(user => (
              <tr key={user.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{user.username}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                  {user.business_name && <div className="text-[10px] text-blue-600 font-bold mt-1 uppercase">{user.business_name}</div>}
                </td>
                <td className="px-6 py-4 capitalize text-sm">{user.role}</td>
                <td className="px-6 py-4">
                  {user.is_approved ? (
                    <span className="px-2 py-1 rounded text-[10px] font-bold bg-green-100 text-green-800 border border-green-200">Verified</span>
                  ) : (
                    <span className="px-2 py-1 rounded text-[10px] font-bold bg-yellow-100 text-yellow-800 border border-yellow-200">Unverified</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button onClick={() => setSelectedUser(user)} className="text-blue-600 hover:underline text-xs font-bold">View</button>
                  <button onClick={() => handleRestrict(user.id)} className="text-orange-500 hover:text-orange-700 text-xs font-bold">Restrict</button>
                  <button onClick={() => handleDelete(user.id)} className="text-red-500 hover:text-red-700 text-xs font-bold">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- View / Document Modal --- */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-900">User Details</h2>
                    <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
                </div>
                
                <div className="p-6 overflow-y-auto space-y-6">
                    <div className="grid grid-cols-2 gap-4 border-b pb-4">
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Account</p>
                            <p className="text-sm text-gray-900 font-semibold">{selectedUser.username}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Email</p>
                            <p className="text-sm text-gray-900">{selectedUser.email}</p>
                        </div>
                    </div>

                    {selectedUser.role === 'seller' && (
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-3">Seller Verification Document</p>
                            {selectedUser.id_document ? (
                                <div className="border rounded-lg bg-gray-50 p-2 shadow-inner">
                                    <img 
                                        src={`http://127.0.0.1:8000${selectedUser.id_document}`} 
                                        alt="Document Preview" 
                                        className="w-full rounded h-auto max-h-[300px] object-contain"
                                    />
                                </div>
                            ) : (
                                <p className="text-red-500 text-xs italic bg-red-50 p-3 rounded">No documents uploaded.</p>
                            )}
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-2">
                    <button onClick={() => setSelectedUser(null)} className="px-4 py-2 text-sm text-gray-500 font-medium">Close</button>
                    {selectedUser.role === 'seller' && !selectedUser.is_approved && (
                        <button 
                            onClick={() => handleApprove(selectedUser.id)}
                            className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-bold hover:bg-green-700 shadow-md"
                        >
                            Approve Seller
                        </button>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
}