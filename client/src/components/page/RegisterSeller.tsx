import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerSellerApi } from "../../auth/auth.api";

// 1. Define Category Options
const CATEGORY_CHOICES = [
  "Electronics",
  "Fashion",
  "Home",
  "Books",
  "Sports",
  "Beauty",
  "Automotive",
  "Toys",
  "Other",
];

export default function RegisterSeller() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    regNumber: "",
    bankDetails: "",
    category: "",        // Selected from dropdown
    otherCategory: "",   // Typed manually if 'Other' is selected
  });

  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIdDocument(e.target.files[0]);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!agreeTerms) {
      setError("You must agree to the terms and conditions.");
      return;
    }

    if (!idDocument) {
      setError("Please upload your Business ID document.");
      return;
    }

    // Validation: Ensure category is selected
    if (!form.category) {
      setError("Please select a business category.");
      return;
    }
    
    // Validation: If 'Other' is selected, ensure the text field is filled
    if (form.category === "Other" && !form.otherCategory.trim()) {
      setError("Please specify your category.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("role", "vendor");
      formData.append("username", form.ownerName.replace(/\s+/g, '').toLowerCase());
      formData.append("email", form.email);
      formData.append("password", form.password);
      
      formData.append("business_name", form.businessName);
      formData.append("owner_name", form.ownerName);
      formData.append("phone", form.phone);
      formData.append("address", form.address);
      formData.append("registration_number", form.regNumber);
      formData.append("bank_details", form.bankDetails);
      formData.append("id_document", idDocument);
      
      // 2. Handle Category Logic
      // If "Other" is selected, send the manually typed text. Otherwise, send the dropdown value.
      const finalCategory = form.category === "Other" ? form.otherCategory : form.category;
      formData.append("category", finalCategory);

      await registerSellerApi(formData);
      
      navigate("/login", { replace: true });
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Registration failed. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg py-10 px-4">
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-center uppercase">Become a Seller</h2>
        <p className="text-center text-xs text-gray-500 mt-1">Start selling your products today</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          
          {/* Account Type Navigation */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg mb-6">
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-sm font-medium py-1.5 rounded-md transition text-gray-500 hover:text-black hover:bg-gray-200"
            >
              Buyer
            </button>
            <button
              type="button"
              className="text-sm font-medium py-1.5 rounded-md transition bg-white text-black shadow-sm cursor-default"
            >
              Seller
            </button>
          </div>

          {/* Business Info Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Business Details</h3>
            
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="Business Name"
              value={form.businessName}
              onChange={(e) => setForm({ ...form, businessName: e.target.value })}
              required
            />

            {/* 3. Category Dropdown */}
            <select
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
            >
              <option value="" disabled>Select Business Category</option>
              {CATEGORY_CHOICES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* 4. Conditional "Other" Input */}
            {form.category === "Other" && (
              <input
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black animate-in fade-in slide-in-from-top-1"
                placeholder="Please specify your category"
                value={form.otherCategory}
                onChange={(e) => setForm({ ...form, otherCategory: e.target.value })}
                required
              />
            )}

            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="Business Registration Number"
              value={form.regNumber}
              onChange={(e) => setForm({ ...form, regNumber: e.target.value })}
              required
            />
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="Business Address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              required
            />
          </div>

          {/* Personal Info Section */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Owner Details</h3>
            
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="Owner Name (Full Name)"
              value={form.ownerName}
              onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                placeholder="Email Address"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <input
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                placeholder="Phone Number"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />
            </div>
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          {/* Verification Section */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Verification</h3>
            
            <div className="rounded-md border border-gray-300 p-3 bg-gray-50">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Upload ID / Business License (PDF or Image)
              </label>
              <input 
                type="file" 
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
              />
            </div>

            <textarea
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="Bank Details (Account No, Bank Name) - Optional"
              rows={2}
              value={form.bankDetails}
              onChange={(e) => setForm({ ...form, bankDetails: e.target.value })}
            />
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start gap-2 pt-2">
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
            />
            <label htmlFor="terms" className="text-xs text-gray-600">
              I agree to the <span className="underline cursor-pointer">Terms and Conditions</span> and confirm that the business details provided are accurate.
            </label>
          </div>

          {error && <div className="rounded-md bg-red-50 p-2 text-sm text-red-600">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-black px-4 py-3 text-sm font-semibold text-white shadow-md hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Submitting Application..." : "Submit Application"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-black hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}