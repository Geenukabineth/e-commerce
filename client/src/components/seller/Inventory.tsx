import React, { useEffect, useState } from 'react';
import { 
  getSellerProductsApi, 
  deleteProductApi, 
  createProductApi, 
  updateProductApi 
} from '../../auth/auth.Productapi';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  stock_quantity: number;
  img: string | null;
  status: string;
}

const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({ name: '', description: '', price: '', stock_quantity: '0' });
  const [image, setImage] = useState<File | null>(null);

  const fetchProducts = async () => {
    try {
      const data = await getSellerProductsApi();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProductApi(id);
      fetchProducts();
    } catch (error) {
      alert("Delete failed");
    }
  };

  const openModal = (product: Product | null = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        stock_quantity: String(product.stock_quantity),
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', description: '', price: '', stock_quantity: '0' });
    }
    setImage(null);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('stock_quantity', formData.stock_quantity);
    if (image) data.append('img', image);

    try {
      if (editingProduct) {
        await updateProductApi(editingProduct.id, data);
      } else {
        await createProductApi(data);
      }
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      alert("Save failed");
    }
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Product Management</h2>
        <button 
          onClick={() => openModal()} 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition"
        >
          + Add Product
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-3 text-left">Product Info</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Stock</th>
              <th className="px-6 py-3 text-left">Price</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map(product => (
              <tr key={product.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <img 
                      src={product.img ? `http://127.0.0.1:8000${product.img}` : '/placeholder.png'} 
                      className="h-10 w-10 rounded border object-cover" 
                      alt="" 
                    />
                    <div>
                      <div className="text-sm font-bold text-gray-900">{product.name}</div>
                      <div className="text-xs text-gray-400 truncate max-w-[120px]">{product.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                    product.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{product.stock_quantity}</td>
                <td className="px-6 py-4 text-sm font-bold text-gray-900">${product.price}</td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button onClick={() => openModal(product)} className="text-blue-600 hover:text-blue-800 text-xs font-bold">Edit</button>
                  <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-700 text-xs font-bold">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADD/EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 animate-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-gray-900 mb-6">{editingProduct ? 'Edit Product' : 'List New Product'}</h3>
            <div className="space-y-4">
              <input 
                type="text" placeholder="Product Name" className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" 
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required 
              />
              <textarea 
                placeholder="Product Description" className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" rows={3}
                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} 
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="number" step="0.01" placeholder="Price ($)" className="w-full border border-gray-300 p-2 rounded-md outline-none"
                  value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required 
                />
                <input 
                  type="number" placeholder="Quantity" className="w-full border border-gray-300 p-2 rounded-md outline-none"
                  value={formData.stock_quantity} onChange={e => setFormData({...formData, stock_quantity: e.target.value})} required 
                />
              </div>
              <div className="border-2 border-dashed border-gray-200 p-4 rounded-md text-center">
                <input type="file" accept="image/*" onChange={e => setImage(e.target.files?.[0] || null)} className="text-xs text-gray-500" />
                <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">Recommended: 800x800 PNG/JPG</p>
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Cancel</button>
              <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-blue-700">
                {editingProduct ? 'Update Product' : 'Submit for Approval'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Inventory;