import { useEffect, useState } from "react";
import { getProfileApi, updateProfileApi } from "../../auth/auth.api";
import type { Profile } from "../../auth/auth.types";
import { useAuth } from "../../auth/auth.store";

export default function ProfilePage() {
  const { setProfile } = useAuth();
  const [profile, setLocalProfile] = useState<Profile | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getProfileApi().then((p) => {
      setLocalProfile(p);
      setProfile(p);
    });
  }, [setProfile]);

  const save = async () => {
    if (!image) return;

    setLoading(true);
    const fd = new FormData();
    fd.append("image", image);

    try {
      const updated = await updateProfileApi(fd);
      setLocalProfile(updated);
      setProfile(updated);
      alert("Profile updated");
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Profile</h2>

        <div className="mt-4 space-y-2 text-sm">
          <p><b>Username:</b> {profile.username}</p>
          <p><b>Email:</b> {profile.email}</p>
          <p><b>Role:</b> {profile.role}</p>
        </div>

        {profile.image && (
          <img
            src={profile.image}
            alt="profile"
            className="mt-4 h-32 w-32 rounded-md object-cover"
          />
        )}

        <div className="mt-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />
        </div>

        <button
          onClick={save}
          disabled={loading}
          className="mt-4 rounded-md bg-black px-4 py-2 text-sm text-white hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Image"}
        </button>
      </div>
    </div>
  );
}
