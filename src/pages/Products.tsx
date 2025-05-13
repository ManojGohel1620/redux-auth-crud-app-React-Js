import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchProducts } from '../features/products/productSlice';

const Products: React.FC = () => {
  const dispatch = useAppDispatch();
  const { list, loading, error } = useAppSelector(state => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div>
      <h2>Products</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{color:'red'}}>{error}</p>
      ) : (
        <table border={1} cellPadding={5} cellSpacing={0}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Price</th>
            </tr>
          </thead>
           <tbody>
            {list.map(prod => (
              <tr key={prod.id}>
                <td>{prod.id}</td>
                <td>{prod.title}</td>
                <td>{prod.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Products;