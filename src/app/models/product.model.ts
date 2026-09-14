export interface Product {
  id: number;
  name: string;
  category: string;
  purchasePrice: number;
  sellingPrice: number;
  stock: number;
  imageUrl?: string;
  sold: number;
}

export type ProductPayload = Omit<Product, 'id' | 'sold'>;