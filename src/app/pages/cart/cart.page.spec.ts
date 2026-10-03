import { TestBed } from '@angular/core/testing';
import { CartPage } from './cart.page';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular/lazy';
import { TransactionService } from '../../services/transaction.service';

describe('CartPage', () => {
  let cartService: CartService;
  let component: CartPage;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    cartService = TestBed.inject(CartService);
    cartService.clear();
    component = new CartPage(cartService);
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

  it('does not create a transaction when checkout is pressed', () => {
    cartService.add(1);
    component.ionViewWillEnter();

    component.checkout();

    expect(component.errorMessage).toContain('TransactionService');
    expect(cartService.getItems()).toHaveLength(1);
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

  it('keeps cart items when checkout is rejected', async () => {
    cartService.add(1);

    const rejectedTransactionService = {
      checkout: () => undefined,
    } as unknown as TransactionService;

    component = new CartPage(
      cartService,
      rejectedTransactionService,
      {
        navigateByUrl: async () => true,
      } as Router,
      {
        create: async () => ({
          present: async () => undefined,
        }),
      } as unknown as ToastController
    );

    component.ionViewWillEnter();

    await component.checkout();

    expect(component.errorMessage).toContain('Checkout gagal');
    expect(cartService.getItems()).toHaveLength(1);
  });
});
