import { type Product } from '../types/product';

interface ProductListProps  {
  products: Product[];
};

export function ProductList({ products }: ProductListProps) {
  return (
    <div>
      {products.length === 0 ? (
        <p>No products</p>
      ) : (
        <table border={1}>
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
                <td>{product.name}</td>
                <td>{product.sku}</td>
                <td>{product.category}</td>
                <td>{product.price}</td>
                <td>{product.stockQuantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
