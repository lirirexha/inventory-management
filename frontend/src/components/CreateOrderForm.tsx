import { useState } from "react";
import { api } from "../api/client";
import type { Order, SelectedItem } from "../types/order";
import type { Product } from "../types/product";
import "./style.css";

interface CreateOrderFormProps {
  products: Product[];
  onOrderCreated: (order: Order) => void;
  onProductsChanged: () => void;
}

export function CreateOrderForm({
  products,
  onOrderCreated,
  onProductsChanged,
}: CreateOrderFormProps) {
  const [productId, setProductId] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [items, setItems] = useState<SelectedItem[]>([])
  const [error, setError] = useState("")

  function handleAddItem() {
    setError("");

    if (!productId) {
      setError("Please select a product")
      return;
    }

    if (quantity < 1) {
      setError("Quantity must be at least 1")
      return;
    }

    const selectedProductId = Number(productId)

    const alreadyAdded = items.some(
      (item) => item.productId === selectedProductId,
    );

    if (alreadyAdded) {
      setError("this product is already added to the order")
      return;
    }

    setItems((currentItems) => [
      ...currentItems,
      {
        productId: selectedProductId,
        quantity,
      },
    ]);

    setQuantity(1)
  }

  function handleRemoveItem(productIdToRemove: number) {
    setItems((currentItems) =>
      currentItems.filter((item) => item.productId !== productIdToRemove),
    );
  }

  async function handleSubmit(event: React.SubmitEvent) {
    event.preventDefault();
    setError("");

    if (items.length === 0) {
      setError("please add at least one product")
      return;
    }

    try {
      const response = await api.post<Order>("/orders", {
        items,
      });

      onOrderCreated(response.data);
      onProductsChanged();
      setItems([]);
      setProductId(0);
      setQuantity(1);
    } catch {
      setError("Something went wrong while creating the order.")
      setItems([])
    }
  }

  function getProductName(productId: number) {
    return products.find((product) => product.id === productId)?.name ?? "";
  }

  return (
    <div className="createOrderPanel">
      <div className="card-header">
        <h2>Create Order</h2>
        <p className="createOrderDescription">Choose a product and quantity</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <p>Product </p>
          <select
            value={productId ?? 0} 
            onChange={(event) => setProductId(Number(event.target.value))}
          >
            <option value={0}>Select product</option>

            {products.map((product) => (
              <option
                key={product.id}
                value={product.id}
                disabled={product.stockQuantity === 0}
              >
                {product.name} - Stock: {product.stockQuantity}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <p>Quantity </p>
          <input
            id="quantity-value"
            type="number"
            min={1}
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value))}
          />
        </div>

        {items.length > 0 && (
          <div className="summary">
            <ul>
              {items.map((item) => (
                <li key={item.productId} className="summary-row">
                  {getProductName(item.productId)} * {item.quantity}
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.productId)}
                    className="remove-item-btn"
                  >
                    x
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="card-footer">
          <button className="add-product-btn" type="button" onClick={handleAddItem}>
            Add Product
          </button>
          <button className="submit-btn" type="submit">Place Order</button>
        </div>
      </form>

      {error && <p className="error">{error}</p>}
    </div>
  );
}
