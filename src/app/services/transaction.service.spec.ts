import { TestBed } from '@angular/core/testing';

import { CartItem } from '../models/cart-item.model';
import { ProductService } from './product.service';
import { TransactionService } from './transaction.service';

describe('TransactionService', () => {
  let productService: ProductService;
  let service: TransactionService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});

    productService = TestBed.inject(ProductService);
    service = TestBed.inject(TransactionService);
  });

  it('creates a transaction and updates product inventory', () => {
    const product = productService.getById(1)!;
    const items: CartItem[] = [
      {
        product: { ...product },
        quantity: 2,
        subtotal: product.sellingPrice * 2,
      },
    ];

    const transaction = service.checkout(items);

    expect(transaction?.total).toBe(150000);
    expect(transaction?.profit).toBe(14000);
    expect(transaction?.lines[0].purchasePrice).toBe(68000);
    expect(transaction?.lines[0].profit).toBe(14000);
    expect(service.getAll()).toHaveLength(1);
    expect(service.getTodayCount()).toBe(1);
    expect(service.getTodayTotal()).toBe(150000);
    expect(service.getTodayProfit()).toBe(14000);
    expect(productService.getById(1)?.stock).toBe(12);
    expect(productService.getById(1)?.sold).toBe(20);
  });

  it('publishes a transaction immediately after checkout', () => {
    const emittedCounts: number[] = [];
    const subscription = service.transactions$.subscribe((transactions) => {
      emittedCounts.push(transactions.length);
    });
    const product = productService.getById(2)!;

    service.checkout([
      {
        product: { ...product },
        quantity: 1,
        subtotal: product.sellingPrice,
      },
    ]);

    expect(emittedCounts).toEqual([0, 1]);
    subscription.unsubscribe();
  });

  it('rejects a transaction when quantity exceeds stock', () => {
    const product = productService.getById(1)!;
    const items: CartItem[] = [
      {
        product: { ...product },
        quantity: product.stock + 1,
        subtotal: product.sellingPrice * (product.stock + 1),
      },
    ];

    expect(service.checkout(items)).toBeUndefined();
    expect(service.getAll()).toEqual([]);
    expect(productService.getById(1)?.stock).toBe(14);
  });

  it('ignores invalid transaction data from local storage', () => {
    TestBed.resetTestingModule();
    localStorage.setItem(
      'simobile-transactions',
      JSON.stringify([{ id: 'invalid-transaction' }]),
    );
    TestBed.configureTestingModule({});

    const reloadedService = TestBed.inject(TransactionService);

    expect(reloadedService.getAll()).toEqual([]);
    expect(reloadedService.getTodayCount()).toBe(0);
  });
});
