import React, { useState, useMemo } from "react";

// --- TYPES ---
export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "Active" | "Draft" | "Archived";
  image?: string; // Added image property
}

// --- MAIN COMPONENT ---
export default function Products() {
  // 1. STATE MANAGEMENT
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Wireless Headphones", category: "Audio", price: 120.0, stock: 45, status: "Active", image: "https://via.placeholder.com/40" },
    { id: 2, name: "Smart Watch Series 5", category: "Wearables", price: 250.5, stock: 12, status: "Active", image: "https://via.placeholder.com/40" },
    { id: 3, name: "Running Shoes", category: "Sports", price: 85.0, stock: 0, status: "Archived", image: "https://via.placeholder.com/40" },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form State
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);

  // 2. FILTERING LOGIC
  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  // 3. HANDLERS

  // Open Modal for Create
  const handleAddClick = () => {
    setIsEditing(false);
    setCurrentProduct({ status: "Active", stock: 0, price: 0 }); // Defaults
    setImageFile(null);
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleEditClick = (product: Product) => {
    setIsEditing(true);
    setCurrentProduct(product);
    setImageFile(null); // Reset file input
    setIsModalOpen(true);
  };

  // Delete Product
  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  // Handle Form Submit (Add or Update)
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulate Image Upload (Create a local URL)
    let imageUrl = currentProduct.image;
    if (imageFile) {
      imageUrl = URL.createObjectURL(imageFile);
    }

    if (isEditing && currentProduct.id) {
      // UPDATE EXISTING
      setProducts(
        products.map((p) =>
          p.id === currentProduct.id ? { ...p, ...currentProduct, image: imageUrl } as Product : p
        )
      );
    } else {
      // CREATE NEW
      const newId = Math.max(...products.map((p) => p.id), 0) + 1;
      const newProduct: Product = {
        ...(currentProduct as Product),
        id: newId,
        image: imageUrl,
      };
      setProducts([newProduct, ...products]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* --- TOP BAR --- */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        {/* Search Input */}
        <div className="relative max-w-sm flex-1">
          <input
            type="text"
            placeholder="Search products by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Add Button */}
        <button
          onClick={handleAddClick}
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          + Add Product
        </button>
      </div>

      {/* --- TABLE --- */}
      <div className="rounded-xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-6 py-3 font-medium">Image</th>
                <th className="px-6 py-3 font-medium">Product Name</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Price</th>
                <th className="px-6 py-3 font-medium">Stock</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    {/* Image Column */}
                    <td className="px-6 py-4">
                      <div className="h-10 w-10 overflow-hidden rounded-md bg-gray-100 border border-gray-200">
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">No Img</div>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 font-medium text-gray-900">{p.name}</td>
                    <td className="px-6 py-4 text-gray-500">{p.category}</td>
                    <td className="px-6 py-4 text-gray-600">${p.price.toFixed(2)}</td>
                    
                    {/* Stock Badge */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded px-2 py-1 text-xs font-medium ${
                          p.stock > 10
                            ? "bg-green-100 text-green-700"
                            : p.stock > 0
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {p.stock > 0 ? `${p.stock} in stock` : "Out of Stock"}
                      </span>
                    </td>

                    {/* Status Dot */}
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span
                          className={`mr-2 h-2 w-2 rounded-full ${
                            p.status === "Active"
                              ? "bg-green-500"
                              : p.status === "Draft"
                              ? "bg-gray-400"
                              : "bg-red-400"
                          }`}
                        ></span>
                        <span className="text-gray-600">{p.status}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={() => handleEditClick(p)}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(p.id)}
                          className="text-red-600 hover:text-red-800 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- ADD/EDIT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {isEditing ? "Edit Product" : "Add New Product"}
            </h2>
            
            <form onSubmit={handleSave} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Product Name</label>
                <input
                  type="text"
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
                  value={currentProduct.name || ""}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                />
              </div>

              {/* Category & Price Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <input
                    type="text"
                    required
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
                    value={currentProduct.category || ""}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
                    value={currentProduct.price || 0}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, price: parseFloat(e.target.value) })}
                  />
                </div>
              </div>

              {/* Stock & Status Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Stock</label>
                  <input
                    type="number"
                    required
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
                    value={currentProduct.stock || 0}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, stock: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
                    value={currentProduct.status || "Draft"}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, status: e.target.value as any })}
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Product Image</label>
                <div className="mt-1 flex items-center gap-4">
                   {/* Preview Current Image if exists */}
                   {(imageFile || currentProduct.image) && (
                      <div className="h-12 w-12 overflow-hidden rounded bg-gray-100 border">
                        <img 
                          src={imageFile ? URL.createObjectURL(imageFile) : currentProduct.image} 
                          alt="Preview" 
                          className="h-full w-full object-cover" 
                        />
                      </div>
                   )}
                   <input
                    type="file"
                    accept="image/*"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-gray-700 hover:file:bg-gray-200"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  />
                </div>
              </div>

              {/* Action Buttons */}
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
                  className="rounded-lg bg-black px-6 py-2 text-sm font-medium text-white hover:bg-gray-800"
                >
                  {isEditing ? "Update Product" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}