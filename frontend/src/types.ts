export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "customer" | "partner";
  token?: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
