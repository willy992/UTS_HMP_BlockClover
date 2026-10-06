import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular/lazy';

import { CartService } from '../../services/cart.service';
import { TransactionService } from '../../services/transaction.service';
import { CartPage } from './cart.page';

describe('CartPage', () => {
  let cartService: CartService;
  let transactionService: TransactionService;
  let component: CartPage;

  const routerMock = {
    navigateByUrl: async () => true,
  } as unknown as Router;

  const toastControllerMock = {
    create: async () => ({
      present: async () => undefined,
    }),
  } as unknown as ToastController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});

    cartService = TestBed.inject(CartService);
    transactionService = TestBed.inject(TransactionService);
    cartService.clear();

    component = new CartPage(
      cartService,
      transactionService,
      routerMock,
      toastControllerMock,
    );
    component.ngOnInit();
  });

  it('creates with an empty cart', () => {
    expect(component).toBeTruthy();
    expect(component.isCartEmpty).toBe(true);
    expect(component.total).toBe(0);
  });

  it('shows cart items and total after refresh', () => {
    cartService.add(1);

    component.ionViewWillEnter();

    expect(component.items).toHaveLength(1);
    expect(component.total).toBe(75000);
  });

  it('shows an error when quantity exceeds product stock', () => {
    cartService.add(1);
    component.ionViewWillEnter();

    component.setQuantity(component.items[0], 15);

    expect(component.errorMessage).toContain('melebihi stok');
    expect(component.items[0].quantity).toBe(1);
  });

  it('shows visual feedback after a quantity change', () => {
    cartService.add(1);
    component.ionViewWillEnter();

    component.increase(component.items[0]);

    expect(component.feedbackMessage).toContain('Quantity');
    expect(component.feedbackProductId).toBe(1);
    expect(component.items[0].quantity).toBe(2);
  });

  it('shows feedback after an item is removed', () => {
    cartService.add(1);
    component.ionViewWillEnter();

    component.remove(component.items[0]);

    expect(component.feedbackMessage).toContain('dihapus');
    expect(component.isCartEmpty).toBe(true);
  });

  it('clears the cart after a successful checkout', async () => {
    cartService.add(1);
    component.ionViewWillEnter();

    await component.checkout();

    expect(cartService.getItems()).toEqual([]);
    expect(transactionService.getAll()).toHaveLength(1);
  });

  it('keeps cart items when checkout is rejected', async () => {
    cartService.add(1);

    const rejectedTransactionService = {
      checkout: () => undefined,
    } as unknown as TransactionService;

    component = new CartPage(
      cartService,
      rejectedTransactionService,
      routerMock,
      toastControllerMock,
    );
    component.ionViewWillEnter();

    await component.checkout();

    expect(component.errorMessage).toContain('Checkout gagal');
    expect(cartService.getItems()).toHaveLength(1);
  });
});
