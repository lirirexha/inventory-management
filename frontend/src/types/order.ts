export type CreateOrderItem = {
  productId: number;
  quantity: number;
}

export type Order = {
  id: number;
  total: string;
  createdAt: string;
}

export type SelectedItem = {
  productId: number;
  quantity: number;
}
