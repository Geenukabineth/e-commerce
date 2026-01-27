import React, { useEffect, useState } from 'react';
import axios from 'axios';
import type { Product } from "../../auth/auth.types";
import { Link } from 'react-router-dom';

const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    const res = await axios.get('http://localhost:8000/api/products/');
    setProducts(res.data);
  };

  const deleteProduct = async (id: number) => {
    if (window.confirm("Delete this product?")) {
      await axios.delete(`http://localhost:8000/api/products/${id}/`);
      fetchProducts();
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  return (
    <div>
      <h2>Inventory</h2>
      <Link to="/add">Add New Product</Link>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Stock</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.stock_quantity}</td>
              <td>${p.price}</td>
              <td>
                <Link to={`/edit/${p.id}`}>Edit</Link>
                <button onClick={() => deleteProduct(p.id!)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Inventory;