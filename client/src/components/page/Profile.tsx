import { useState, useEffect } from "react";
import { getProfileApi } from "../../auth/auth.api";
import { useAuth } from "../../auth/auth.store";
import type { Profile } from "../../auth/auth.types";
import { 
    Mail, 
    Phone, 
    Briefcase, 
    Shield, 
    User, 
    CheckCircle2, 
    AlertCircle 
} from "lucide-react";

export default function ProfileView() {
  const { setProfile } = useAuth();
  const [profile, setLocalProfile] = useState<Profile | null>(null);

  // Fetch Profile on Mount
  useEffect(() => {
    getProfileApi().then((p) => {
      setLocalProfile(p);
      setProfile(p);
    });
  }, [setProfile]);

  if (!profile) return (
    <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading profile...
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-6">
        {/* Main Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            
            {/* Header Section */}
            <div className="bg-gradient-to-b from-indigo-50 to-white dark:from-gray-700 dark:to-gray-800 p-8 flex flex-col items-center text-center border-b border-gray-100 dark:border-gray-700">
                
                {/* Profile Image (Read Only) */}
                <div className="relative mb-4">
                    <div className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-600 shadow-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        {profile.image ? (
                            <img src={profile.image} alt={profile.username} className="h-full w-full object-cover" />
                        ) : (
                            <span className="text-4xl font-bold text-gray-400 dark:text-gray-500">
                                {profile.username.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>
                    {/* Role Badge */}
                    <div className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1.5 rounded-full shadow-sm border-2 border-white dark:border-gray-800">
                        <Shield className="h-4 w-4" />
                    </div>
                </div>
                
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{profile.username}</h1>
                <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 capitalize mt-1">
                    {profile.role} Account
                </p>

                {/* Status Badges */}
                <div className="flex gap-2 mt-4">
                    {profile.is_approved ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold rounded-full">
                            <CheckCircle2 className="h-3 w-3" /> Verified
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs font-bold rounded-full">
                            <AlertCircle className="h-3 w-3" /> Pending Verification
                        </span>
                    )}
                    <span className={`px-3 py-1 text-xs font-bold rounded-full capitalize ${
                        profile.status === 'active' 
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                        {profile.status || 'Active'}
                    </span>
                </div>
            </div>

            {/* Details Section */}
            <div className="p-8 space-y-8">
                
                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoField 
                        label="Email Address" 
                        value={profile.email} 
                        icon={<Mail className="h-4 w-4"/>} 
                    />
                    <InfoField 
                        label="Phone Number" 
                        value={profile.phone || "Not provided"} 
                        icon={<Phone className="h-4 w-4"/>} 
                    />
                    <InfoField 
                        label="User ID" 
                        value={`#${profile.id}`} 
                        icon={<User className="h-4 w-4"/>} 
                    />
                    
                    {/* Show Business Name ONLY if seller */}
                    {profile.role === 'seller' && (
                        <InfoField 
                            label="Business Name" 
                            value={profile.business_name || "Not registered"} 
                            icon={<Briefcase className="h-4 w-4"/>} 
                        />
                    )}
                </div>

                {/* Bio Section */}
                <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-xl border border-gray-100 dark:border-gray-700">
                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-2 tracking-wide">
                        About
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                        {profile.bio || "No bio information available."}
                    </p>
                </div>

                {/* Additional Seller Info (If applicable) */}
                {profile.role === 'seller' && (
                    <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Business Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Category</span>
                                <span className="font-medium text-gray-900 dark:text-white">{profile.category || "N/A"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Owner Name</span>
                                <span className="font-medium text-gray-900 dark:text-white">{profile.owner_name || "N/A"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Registration #</span>
                                <span className="font-medium text-gray-900 dark:text-white">{profile.registration_number || "N/A"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Trust Score</span>
                                <span className="font-bold text-green-600">{profile.trust_score || 0}/100</span>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    </div>
  );
}

// Helper Component for consistent field styling
function InfoField({ label, value, icon }: { label: string, value: string, icon: any }) {
    return (
        <div className="flex items-start gap-3">
            <div className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-500 dark:text-gray-400">
                {icon}
            </div>
            <div>
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                    {label}
                </p>
                <p className="text-gray-900 dark:text-white font-medium text-sm mt-0.5">
                    {value}
                </p>
            </div>
        </div>
    )
}