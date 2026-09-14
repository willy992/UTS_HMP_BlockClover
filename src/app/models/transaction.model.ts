export interface TransactionLine {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Transaction {
    id: string;
    createdAt: string;
    lines: TransactionLine[];
    total: number;
}