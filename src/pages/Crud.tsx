import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchProducts, addProduct, updateProduct, deleteProduct, Product } from '../features/products/productSlice';

const Crud: React.FC = () => {
  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector(state => state.products);
  const [form, setForm] = useState<Omit<Product, 'id'>>({ title: '', price: 0, description: '' });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'price' ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      dispatch(updateProduct({ id: editId, ...form }));
    } else {
      dispatch(addProduct(form));
    }
    setForm({ title: '', price: 0, description: '' });
    setEditId(null);
  };

  return (
    <div>
      <h2>CRUD Operations</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required /><br />
        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required /><br />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required /><br />
        <button type="submit">{editId ? 'Update' : 'Create'}</button>
      </form>

      {loading ? <p>Loading...</p> : (
        <table border={1} cellPadding={5} cellSpacing={0}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Price</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map(prod => (
              <tr key={prod.id}>
                <td>{prod.id}</td>
                <td>{prod.title}</td>
                <td>{prod.price}</td>
                <td>{prod.description}</td>
                <td>
                  <button onClick={() => { setEditId(prod.id); setForm({ title: prod.title, price: prod.price, description: prod.description }); }}>Edit</button>
                  <button onClick={() => dispatch(deleteProduct(prod.id))}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Crud;