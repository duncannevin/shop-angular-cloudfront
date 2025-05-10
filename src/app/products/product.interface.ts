export interface Product {
  /** Available count */
  id: string;
  count: number;
  price: number;
  title: string;
  description: string;
}

export interface ProductCheckout extends Product {
  orderedCount: number;
  /** orderedCount * price */
  totalPrice: number;
}
