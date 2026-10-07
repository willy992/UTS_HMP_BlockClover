  import { TestBed } from '@angular/core/testing';
  import { CartService } from './cart.service';
  import { ProductService } from './product.service';

  describe('CartService', () => {
    let productService: ProductService;
    let service: CartService;

    beforeEach(() => {
      TestBed.configureTestingModule({});
      productService = TestBed.inject(ProductService);
      service = TestBed.inject(CartService);
      service.clear();
    });

    it('adds an item and calculates its total', () => {
      service.add(1);

      expect(service.getItems()).toEqual([
        {
          product: { ...productService.getById(1)! },
          quantity: 1,
          subtotal: 75000,
        },
      ]);
      expect(service.getTotal()).toBe(75000);
    });

    it('does not allow quantity above the latest product stock', () => {
      expect(() => service.setQuantity(1, 15)).toThrow();
    });

    it('rejects out-of-stock and missing products', () => {
      expect(() => service.add(6)).toThrow();
      expect(() => service.add(999)).toThrow();
    });

    it('removes an item when its quantity is set to zero', () => {
      service.add(1);

      service.setQuantity(1, 0);

      expect(service.getItems()).toEqual([]);
      expect(service.getTotal()).toBe(0);
    });

    it('returns copied cart data rather than mutable internal state', () => {
      service.add(1);
      const items = service.getItems();

      items[0].quantity = 99;
      items[0].product.name = 'Diubah dari luar';

      expect(service.getItems()[0].quantity).toBe(1);
      expect(service.getItems()[0].product.name).toBe('Beras Ramos 5 kg');
    });

    it('publishes the current cart item count', () => {
      const counts: number[] = [];
      const subscription = service.itemCount$.subscribe((count) =>
        counts.push(count)
      );

      service.add(1);
      service.add(1);
      service.clear();

      expect(counts).toEqual([0, 1, 2, 0]);
      subscription.unsubscribe();
    });
  });
