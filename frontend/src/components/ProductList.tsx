import { type Product } from '../types/product';
import './style.css'

interface ProductListProps  {
  products: Product[];
};

export function ProductList({ products }: ProductListProps) {
  return (
    <div className='productList'>
      <div className='tableHead'>
      <h2>Products</h2>
      </div>

      {products.length === 0 ? (
        <p>No products available</p>
      ) : (
        <table className='productTable'>
          <thead>
            <tr>
              <th>Name</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="product-name">{product.name}</td>
                <td className='sku'>{product.sku}</td>
                <td>{product.category}</td>
                <td className='price'>{product.price}</td>
                <td>{product.stockQuantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
