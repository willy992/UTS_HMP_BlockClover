import { Component, OnInit } from '@angular/core';
import { CartItem } from '../../models/cart-item.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  standalone: false,
})
export class CartPage implements OnInit {
  items: CartItem[] = [];
  total = 0;
  errorMessage = '';

  constructor(private readonly cartService: CartService) {}

  ngOnInit(): void {
    this.refreshCart();
  }

  ionViewWillEnter(): void {
    this.refreshCart();
  }

  get isCartEmpty(): boolean {
    return this.items.length === 0;
  }

  get hasStockConflict(): boolean {
    return this.items.some((item) => item.quantity > item.product.stock);
  }

  increase(item: CartItem): void {
    this.setQuantity(item, item.quantity + 1);
  }

  decrease(item: CartItem): void {
    this.setQuantity(item, item.quantity - 1);
  }

  setQuantity(item: CartItem, quantity: number): void {
    try {
      this.cartService.setQuantity(item.product.id, quantity);
      this.errorMessage = '';
    } catch (error) {
      this.errorMessage = this.toMessage(error);
    } finally {
      this.refreshCart();
    }
  }

  onQuantityChange(
    item: CartItem,
    event: CustomEvent<{ value?: string | number | null }>
  ): void {
    const value = event.detail.value;

    if (value === undefined || value === null || String(value).trim() === '') {
      this.errorMessage = 'Quantity harus diisi.';
      this.refreshCart();
      return;
    }

    this.setQuantity(item, Number(value));
  }

  remove(item: CartItem): void {
    try {
      this.cartService.remove(item.product.id);
      this.errorMessage = '';
    } catch (error) {
      this.errorMessage = this.toMessage(error);
    } finally {
      this.refreshCart();
    }
  }

  checkout(): void {
    if (this.hasStockConflict) {
      this.errorMessage =
        'Stok salah satu produk berubah. Perbarui quantity sebelum checkout.';
      return;
    }

    this.errorMessage =
      'Checkout akan tersedia setelah TransactionService terintegrasi.';
  }

  formatPrice(value: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(value);
  }

  trackByProductId(_: number, item: CartItem): number {
    return item.product.id;
  }

  private refreshCart(): void {
    this.items = this.cartService.getItems();
    this.total = this.cartService.getTotal();
  }

  private toMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'Terjadi kesalahan pada cart.';
  }
}
