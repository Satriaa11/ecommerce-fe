export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: {
    id: number;
    name: string;
    image: string;
  };
  images: string[];
  quantity?: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  profilePicture?: string;
}

export interface ProductCardProps {
  product: Product;
}

interface CartItem {
  productId: number;
  quantity: number;
}

export interface UserCart {
  userId: number;
  items: CartItem[];
}

export interface SignUpData {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export interface LoginData {
  id: number;
  name: string;
  email: string;
  password: string;
}

export interface Category {
  id: number;
  name: string;
  image: string;
  slug?: string;
  creationAt?: string;
  updatedAt?: string;
}
