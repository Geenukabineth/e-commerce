import React, { useState, useEffect } from "react";
import { getProfileApi, updateProfileApi, changePasswordApi } from "../../auth/auth.api";
import { useAuth } from "../../auth/auth.store";
import type { Profile } from "../../auth/auth.types";

export default function Settings() {
  const { setProfile } = useAuth();
  const [profile, setLocalProfile] = useState<Profile | null>(null);
  const [image, setImage] = useState<File | null>(null);
  
  // Loading states
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPass, setLoadingPass] = useState(false);

  // Password Form State
  const [passForm, setPassForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  // Fetch Profile on Mount
  useEffect(() => {
    getProfileApi().then((p) => {
      setLocalProfile(p);
      setProfile(p);
    });
  }, [setProfile]);

  

  // --- HANDLER: Update Profile Image ---
  const handleSaveProfile = async () => {
    if (!image) return;
    setLoadingProfile(true);
    const fd = new FormData();
    fd.append("image", image);

    try {
      const updated = await updateProfileApi(fd);
      setLocalProfile(updated);
      setProfile(updated);
      alert("Profile image updated successfully!");
    } catch (error) {
      alert("Failed to update profile.");
    } finally {
      setLoadingProfile(false);
    }
  };

  // --- HANDLER: Change Password ---
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passForm.new_password !== passForm.confirm_password) {
      alert("New passwords do not match!");
      return;
    }

    setLoadingPass(true);
    try {
      await changePasswordApi({
        old_password: passForm.old_password,
        new_password: passForm.new_password,
      });
      alert("Password changed successfully!");
      setPassForm({ old_password: "", new_password: "", confirm_password: "" });
    } catch (error: any) {
      alert("Error: " + (error.response?.data?.old_password?.[0] || "Failed to change password"));
    } finally {
      setLoadingPass(false);
    }
  };

  if (!profile) return <div>Loading settings...</div>;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      
      {/* CARD 1: Profile Settings (From your original Profile.tsx) */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">Profile Settings</h2>
        <p className="mb-6 text-sm text-gray-500">Update your photo and personal details.</p>

        <div className="flex flex-col items-center space-y-4">
          {/* Image Preview */}
          <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-gray-100 shadow-sm">
            {profile.image ? (
              <img src={profile.image} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400">
                No Img
              </div>
            )}
          </div>

          {/* User Details (Read Only) */}
          <div className="w-full space-y-3 rounded-lg bg-gray-50 p-4 text-sm">
             <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Username</span>
                <span className="text-gray-900">{profile.username}</span>
             </div>
             <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Email</span>
                <span className="text-gray-900">{profile.email}</span>
             </div>
             <div className="flex justify-between">
                <span className="font-medium text-gray-600">Role</span>
                <span className="capitalize text-blue-600">{profile.role}</span>
             </div>
          </div>

          {/* Image Upload Input */}
          <div className="w-full">
            <label className="mb-1 block text-sm font-medium text-gray-700">Change Photo</label>
            <input
              type="file"
              accept="image/*"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
          </div>

          <button
            onClick={handleSaveProfile}
            disabled={loadingProfile || !image}
            className="w-full rounded-lg bg-black py-2.5 text-sm font-medium text-white shadow-sm hover:bg-gray-800 disabled:opacity-50"
          >
            {loadingProfile ? "Uploading..." : "Save Profile Image"}
          </button>
        </div>
      </div>

      {/* CARD 2: Security (Change Password) */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">Security</h2>
        <p className="mb-6 text-sm text-gray-500">Ensure your account is using a strong password.</p>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Current Password</label>
            <input
              type="password"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
              value={passForm.old_password}
              onChange={(e) => setPassForm({ ...passForm, old_password: e.target.value })}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
              value={passForm.new_password}
              onChange={(e) => setPassForm({ ...passForm, new_password: e.target.value })}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input
              type="password"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
              value={passForm.confirm_password}
              onChange={(e) => setPassForm({ ...passForm, confirm_password: e.target.value })}
            />
          </div>

          <div className="pt-2">
             <button
              type="submit"
              disabled={loadingPass}
              className="w-full rounded-lg bg-red-600 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-red-700 disabled:opacity-50"
            >
              {loadingPass ? "Updating Password..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}