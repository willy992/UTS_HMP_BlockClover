import { inject, Service } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart-item.model';
import {
  Transaction,
  TransactionDayGroup,
  TransactionLine,
} from '../models/transaction.model';
import { ProductService } from './product.service';

@Service()
export class TransactionService {
  private readonly storageKey = 'simobile-transactions';
  private readonly productService = inject(ProductService);
  private transactions: Transaction[] = this.loadTransactions();
  private readonly transactionsSubject = new BehaviorSubject<Transaction[]>(
    this.getAll(),
  );
  readonly transactions$ = this.transactionsSubject.asObservable();

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
        const purchasePrice = product.purchasePrice;

        return {
          productId,
          productName: product.name,
          purchasePrice,
          price,
          quantity,
          subtotal: price * quantity,
          profit: (price - purchasePrice) * quantity,
        };
      }
    );

    const transaction: Transaction = {
      id: `trx-${Date.now()}-${this.transactions.length + 1}`,
      createdAt: new Date().toISOString(),
      lines,
      total: lines.reduce((total, line) => total + line.subtotal, 0),
      profit: lines.reduce((total, line) => total + line.profit, 0),
    };

    const nextTransactions = [transaction, ...this.transactions];

    if (!this.persistTransactions(nextTransactions)) {
      return undefined;
    }

    for (const line of lines) {
      this.productService.reduceStock(line.productId, line.quantity);
    }

    this.transactions = nextTransactions;
    this.publishTransactions();

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

  getTodayProfit(): number {
    return this.transactions
      .filter((transaction) => this.isToday(transaction.createdAt))
      .reduce((total, transaction) => total + transaction.profit, 0);
  }

  getDailyGroups(): TransactionDayGroup[] {
    const groups = new Map<string, Transaction[]>();

    for (const transaction of this.getAll()) {
      const dateKey = this.toLocalDateKey(transaction.createdAt);
      const transactions = groups.get(dateKey) ?? [];
      transactions.push(transaction);
      groups.set(dateKey, transactions);
    }

    return [...groups.entries()]
      .sort(([first], [second]) => second.localeCompare(first))
      .map(([dateKey, transactions]) => ({
        dateKey,
        transactions,
        totalSales: transactions.reduce(
          (total, transaction) => total + transaction.total,
          0,
        ),
        totalProfit: transactions.reduce(
          (total, transaction) => total + transaction.profit,
          0,
        ),
      }));
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
          profit: (existing?.profit ?? 0) + line.profit,
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

      if (
        !Array.isArray(parsedTransactions) ||
        !parsedTransactions.every((transaction) =>
          this.isStoredTransaction(transaction),
        )
      ) {
        return [];
      }

      return parsedTransactions.map((transaction) =>
        this.normalizeTransaction(transaction),
      );
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

  private toLocalDateKey(dateValue: string): string {
    const date = new Date(dateValue);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  private isStoredTransaction(value: unknown): boolean {
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
      transaction['lines'].every((line) =>
        this.isStoredTransactionLine(line),
      ) &&
      typeof transaction['total'] === 'number' &&
      Number.isFinite(transaction['total']) &&
      transaction['total'] >= 0
    );
  }

  private isStoredTransactionLine(value: unknown): boolean {
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
      line['subtotal'] > 0 &&
      (line['purchasePrice'] === undefined ||
        (typeof line['purchasePrice'] === 'number' &&
          Number.isFinite(line['purchasePrice']) &&
          line['purchasePrice'] >= 0)) &&
      (line['profit'] === undefined ||
        (typeof line['profit'] === 'number' &&
          Number.isFinite(line['profit'])))
    );
  }

  private normalizeTransaction(value: unknown): Transaction {
    const storedTransaction = value as Record<string, unknown>;
    const storedLines = storedTransaction['lines'] as Array<
      Record<string, unknown>
    >;
    const lines = storedLines.map((storedLine): TransactionLine => {
      const productId = storedLine['productId'] as number;
      const price = storedLine['price'] as number;
      const quantity = storedLine['quantity'] as number;
      const currentProduct = this.productService.getById(productId);
      const purchasePrice =
        typeof storedLine['purchasePrice'] === 'number'
          ? storedLine['purchasePrice']
          : currentProduct?.purchasePrice ?? price;

      return {
        productId,
        productName: storedLine['productName'] as string,
        purchasePrice,
        price,
        quantity,
        subtotal: price * quantity,
        profit: (price - purchasePrice) * quantity,
      };
    });

    return {
      id: storedTransaction['id'] as string,
      createdAt: storedTransaction['createdAt'] as string,
      lines,
      total: lines.reduce((total, line) => total + line.subtotal, 0),
      profit: lines.reduce((total, line) => total + line.profit, 0),
    };
  }

  private cloneTransaction(transaction: Transaction): Transaction {
    return {
      ...transaction,
      lines: transaction.lines.map((line) => ({ ...line })),
    };
  }

  private publishTransactions(): void {
    this.transactionsSubject.next(this.getAll());
  }
}
