import { inject, Service } from '@angular/core';
import { CartItem } from '../models/cart-item.model';
import { Transaction, TransactionLine } from '../models/transaction.model';
import { ProductService } from './product.service';

@Service()
export class TransactionService {
  private readonly storageKey = 'simobile-transactions';
  private readonly productService = inject(ProductService);
  private transactions: Transaction[] = this.loadTransactions();

  checkout(items: CartItem[]): Transaction | undefined {
    const groupedQuantities = new Map<number, number>();

    for (const item of items) {
      const productId = item.product?.id;
      const quantity = item.quantity;

      if (
        !Number.isSafeInteger(productId) ||
        !Number.isSafeInteger(quantity) ||
        quantity <= 0
      ) {
        return undefined;
      }

      groupedQuantities.set(
        productId,
        (groupedQuantities.get(productId) ?? 0) + quantity
      );
    }

    if (groupedQuantities.size === 0) {
      return undefined;
    }

    // Validasi semua produk dan total stok sebelum mutasi apa pun.
    for (const [productId, quantity] of groupedQuantities) {
      const product = this.productService.getById(productId);

      if (!product || product.stock < quantity) {
        return undefined;
      }
    }

    const lines: TransactionLine[] = Array.from(
      groupedQuantities.entries(),
      ([productId, quantity]) => {
        const product = this.productService.getById(productId)!;
        const price = product.sellingPrice;

        return {
          productId,
          productName: product.name,
          price,
          quantity,
          subtotal: price * quantity,
        };
      }
    );

    const transaction: Transaction = {
      id: `trx-${Date.now()}-${this.transactions.length + 1}`,
      createdAt: new Date().toISOString(),
      lines,
      total: lines.reduce((total, line) => total + line.subtotal, 0),
    };

    const nextTransactions = [transaction, ...this.transactions];

    if (!this.persistTransactions(nextTransactions)) {
      return undefined;
    }

    for (const line of lines) {
      this.productService.reduceStock(line.productId, line.quantity);
    }

    this.transactions = nextTransactions;

    return this.cloneTransaction(transaction);
  }

  getAll(): Transaction[] {
    return this.transactions.map((transaction) =>
      this.cloneTransaction(transaction)
    );
  }

  getById(id: string): Transaction | undefined {
    const transaction = this.transactions.find(
      (transaction) => transaction.id === id
    );

    return transaction ? this.cloneTransaction(transaction) : undefined;
  }

  getTodayCount(): number {
    return this.transactions.filter((transaction) =>
      this.isToday(transaction.createdAt)
    ).length;
  }

  getTodayTotal(): number {
    return this.transactions
      .filter((transaction) => this.isToday(transaction.createdAt))
      .reduce((total, transaction) => total + transaction.total, 0);
  }

  getTodayBestSeller(): TransactionLine | undefined {
    const soldToday = new Map<number, TransactionLine>();

    for (const transaction of this.transactions) {
      if (!this.isToday(transaction.createdAt)) {
        continue;
      }

      for (const line of transaction.lines) {
        const existing = soldToday.get(line.productId);

        soldToday.set(line.productId, {
          ...line,
          quantity: (existing?.quantity ?? 0) + line.quantity,
          subtotal: (existing?.subtotal ?? 0) + line.subtotal,
        });
      }
    }

    return [...soldToday.values()].sort(
      (first, second) => second.quantity - first.quantity
    )[0];
  }

  private loadTransactions(): Transaction[] {
    const savedTransactions = this.getStorage()?.getItem(this.storageKey);

    if (!savedTransactions) {
      return [];
    }

    try {
      const parsedTransactions: unknown = JSON.parse(savedTransactions);

      return Array.isArray(parsedTransactions) &&
        parsedTransactions.every((transaction) =>
          this.isTransaction(transaction)
        )
        ? parsedTransactions
        : [];
    } catch {
      return [];
    }
  }

  private persistTransactions(transactions: Transaction[]): boolean {
    const storage = this.getStorage();

    if (!storage) {
      return true;
    }

    try {
      storage.setItem(this.storageKey, JSON.stringify(transactions));
      return true;
    } catch {
      return false;
    }
  }

  private getStorage(): Storage | undefined {
    try {
      return typeof localStorage === 'undefined' ? undefined : localStorage;
    } catch {
      return undefined;
    }
  }

  private isToday(dateValue: string): boolean {
    return new Date(dateValue).toDateString() === new Date().toDateString();
  }

  private isTransaction(value: unknown): value is Transaction {
    if (typeof value !== 'object' || value === null) {
      return false;
    }

    const transaction = value as Record<string, unknown>;

    return (
      typeof transaction['id'] === 'string' &&
      transaction['id'].length > 0 &&
      typeof transaction['createdAt'] === 'string' &&
      Number.isFinite(Date.parse(transaction['createdAt'])) &&
      Array.isArray(transaction['lines']) &&
      transaction['lines'].length > 0 &&
      transaction['lines'].every((line) => this.isTransactionLine(line)) &&
      typeof transaction['total'] === 'number' &&
      Number.isFinite(transaction['total']) &&
      transaction['total'] >= 0
    );
  }

  private isTransactionLine(value: unknown): value is TransactionLine {
    if (typeof value !== 'object' || value === null) {
      return false;
    }

    const line = value as Record<string, unknown>;

    return (
      Number.isSafeInteger(line['productId']) &&
      typeof line['productName'] === 'string' &&
      line['productName'].length > 0 &&
      typeof line['price'] === 'number' &&
      Number.isFinite(line['price']) &&
      line['price'] > 0 &&
      Number.isSafeInteger(line['quantity']) &&
      (line['quantity'] as number) > 0 &&
      typeof line['subtotal'] === 'number' &&
      Number.isFinite(line['subtotal']) &&
      line['subtotal'] > 0
    );
  }

  private cloneTransaction(transaction: Transaction): Transaction {
    return {
      ...transaction,
      lines: transaction.lines.map((line) => ({ ...line })),
    };
  }
}
