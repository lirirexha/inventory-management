import { useState } from "react";
import "./App.css";
import { api } from "./api/client";
import { CreateOrderForm } from "./components/CreateOrderForm";
import { ProductList } from "./components/ProductList";
import type { Order } from "./types/order";
import type { Product } from "./types/product";

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchProducts() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get<Product[]>("/products");
      setProducts(response.data);
    } catch {
      setError("Could not load products.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <header className="topbar">
        <div className="brand">
          Product Inventory & Orders Management
        </div>
      </header>
      <main className="mainSection">
        {!products.length ? (
          <>
            <button className="create-order-btn" onClick={fetchProducts} disabled={loading}>
              {loading ? "Loading..." : "Create Order"}
            </button>
          </>
        ) : (
          <>
            {error && <p className="error">{error}</p>}
            <div className="mainLayout">
            <ProductList products={products} />
            <CreateOrderForm
              products={products}
              onOrderCreated={setLastOrder}
              onProductsChanged={fetchProducts}
            />
            </div>
          </>
        )}

        {lastOrder && (
          <div className="lastOrder">
            <h2>Order Confirmation</h2>
            <p>Order #{lastOrder.id} created successfully.</p>
            <p>Total: {lastOrder.total}</p>
          </div>
        )}
      </main>
    </>
  );
}

export default App;
