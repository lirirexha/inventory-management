import { useState } from "react";
import { api } from "../api/client";
import type { Order, SelectedItem } from "../types/order";
import type { Product } from "../types/product";

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
  const [productId, setProductId] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [items, setItems] = useState<SelectedItem[]>([])
  const [error, setError] = useState("")

  function handleAddItem() {
    setError("");

    if (!productId) {
      setError("TEST")
      return;
    }

    if (quantity < 1) {
      setError("TESTTTTTTTTTTTT")
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

    setProductId(null)
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
      setProductId(null);
      setQuantity(1);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Something went wrong while creating the order.";

      setError(Array.isArray(message) ? message.join(", ") : message);
    }
  }

  function getProductName(productId: number) {
    return products.find((product) => product.id === productId)?.name ?? "";
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <p>Product </p>
          <select
            value={productId}
            onChange={(event) => setProductId(event.target.value)}
          >
            <option value="">Select product</option>

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

        <div>
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
          <div>
            <ul>
              {items.map((item) => (
                <li key={item.productId}>
                  {getProductName(item.productId)} * {item.quantity}
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.productId)}
                  >
                    x
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <button type="button" onClick={handleAddItem}>
            Add Product
          </button>
          <button type="submit">Place Order</button>
        </div>
      </form>

      {error && <p>{error}</p>}
    </div>
  );
}
