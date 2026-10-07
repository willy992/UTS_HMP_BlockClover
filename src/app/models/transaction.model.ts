export interface TransactionLine {
  productId: number;
  productName: string;
  purchasePrice: number;
  price: number;
  quantity: number;
  subtotal: number;
  profit: number;
}

export interface Transaction {
  id: string;
  createdAt: string;
  lines: TransactionLine[];
  total: number;
  profit: number;
}

export interface TransactionDayGroup {
  dateKey: string;
  transactions: Transaction[];
  totalSales: number;
  totalProfit: number;
}
