import React, { useState } from "react";
import { registerApi } from "../../auth/auth.api"; 

// --- TYPES ---
export interface User {
  id: number;
  username: string;
  email: string;
  role: "admin" | "user";
  status: "Active" | "Inactive";
  joinedDate: string;
}

export default function Users() {
  // 1. STATE: Mock Data (Replace with API fetch in real app)
  const [users, setUsers] = useState<User[]>([
    { id: 1, username: "admin", email: "admin@gmail.com", role: "admin", status: "Active", joinedDate: "2023-01-15" },
    { id: 2, username: "johndoe", email: "john@example.com", role: "user", status: "Active", joinedDate: "2023-02-20" },
    { id: 3, username: "sarah_smith", email: "sarah@test.com", role: "user", status: "Inactive", joinedDate: "2023-03-10" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  // 2. HANDLERS
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      // 1. Call Backend API
      await registerApi({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      // 2. Update Local UI (Optimistic update)
      const newUser: User = {
        id: users.length + 1,
        username: formData.username,
        email: formData.email,
        role: formData.role as "admin" | "user",
        status: "Active",
        joinedDate: new Date().toISOString().split('T')[0],
      };

      setUsers([...users, newUser]);
      alert("User created successfully!");
      setIsModalOpen(false);
      setFormData({ username: "", email: "", password: "", confirmPassword: "", role: "user" }); // Reset form
      
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* --- TOP BAR --- */}
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-xl font-bold text-gray-900">User Management</h2>
           <p className="text-sm text-gray-500">View and manage system users</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          + Add New User
        </button>
      </div>

      {/* --- USERS TABLE --- */}
      <div className="rounded-xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-6 py-3 font-medium">User</th>
                <th className="px-6 py-3 font-medium">Role</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Joined Date</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {/* Avatar Circle */}
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.username}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-500">{user.joinedDate}</td>
                  
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-800 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- ADD USER MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold text-gray-900">Add New User</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  name="username"
                  type="text"
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  name="role"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="user">User (Client)</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    name="password"
                    type="password"
                    required
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirm</label>
                  <input
                    name="confirmPassword"
                    type="password"
                    required
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-black px-6 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}