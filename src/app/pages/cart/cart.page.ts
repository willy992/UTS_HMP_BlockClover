import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartItem } from '../../models/cart-item.model';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular/lazy';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  standalone: false,
})
export class CartPage implements OnInit, OnDestroy {
  items: CartItem[] = [];
  total = 0;
  errorMessage = '';
  feedbackMessage = '';
  feedbackProductId: number | null = null;
  feedbackActive = false;
  errorFeedbackActive = false;
  isCheckingOut = false;

  private cartHasLoaded = false;
  private readonly knownProductIds = new Set<number>();
  private feedbackStartTimer?: ReturnType<typeof setTimeout>;
  private feedbackDismissTimer?: ReturnType<typeof setTimeout>;
  private errorFeedbackTimer?: ReturnType<typeof setTimeout>;

  constructor(
    private readonly cartService: CartService,
    private readonly transactionService: TransactionService,
    private readonly router: Router,
    private readonly toastController: ToastController
  ) {}

  ngOnInit(): void {
    this.refreshCart();
  }

  ngOnDestroy(): void {
    this.clearTimers();
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
      const updatedItem = this.cartService.setQuantity(item.product.id, quantity);

      this.errorMessage = '';
      this.refreshCart();

      if (updatedItem) {
        this.showFeedback(
          `Quantity ${updatedItem.product.name} diperbarui.`,
          updatedItem.product.id
        );
      }
    } catch (error) {
      this.showError(this.toMessage(error));
      this.refreshCart();
    }
  }

  onQuantityChange(
    item: CartItem,
    event: CustomEvent<{ value?: string | number | null }>
  ): void {
    const value = event.detail.value;

    if (value === undefined || value === null || String(value).trim() === '') {
      this.showError('Quantity harus diisi.');
      this.refreshCart();
      return;
    }

    this.setQuantity(item, Number(value));
  }

  remove(item: CartItem): void {
    try {
      const removed = this.cartService.remove(item.product.id);

      this.errorMessage = '';
      this.refreshCart();

      if (removed) {
        this.showFeedback(`${item.product.name} dihapus dari keranjang.`);
      }
    } catch (error) {
      this.showError(this.toMessage(error));
      this.refreshCart();
    }
  }

  async checkout(): Promise<void> {
    if (this.isCheckingOut) {
      return;
    }

    const cartSnapshot = this.cartService.getItems();

    if (cartSnapshot.length === 0) {
      this.showError(
        'Keranjang kosong. Tambahkan produk sebelum mengonfirmasi transaksi.'
      );
      return;
    }

    if (cartSnapshot.some((item) => item.quantity > item.product.stock)) {
      this.showError(
        'Stok salah satu produk berubah. Perbarui quantity sebelum mengonfirmasi transaksi.'
      );
      return;
    }

    this.isCheckingOut = true;

    let transaction;

    try {
      transaction = this.transactionService.checkout(cartSnapshot);
    } catch {
      this.showError(
        'Transaksi gagal disimpan. Keranjang tetap dipertahankan, silakan coba lagi.'
      );
      this.refreshCart();
      this.isCheckingOut = false;
      return;
    }

    if (!transaction) {
      this.showError(
        'Transaksi gagal karena stok atau data produk sudah tidak valid. Keranjang tetap dipertahankan.'
      );
      this.refreshCart();
      this.isCheckingOut = false;
      return;
    }

    this.cartService.clear();
    this.refreshCart();
    void this.presentCheckoutSuccess(transaction.total);

    try {
      const navigated = await this.router.navigateByUrl('/tabs/transactions');

      if (!navigated) {
        this.showFeedback(
          'Transaksi berhasil dan telah masuk ke riwayat.'
        );
      }
    } finally {
      this.isCheckingOut = false;
    }
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
    const nextItems = this.cartService.getItems();
    const addedItems = this.cartHasLoaded
      ? nextItems.filter((item) => !this.knownProductIds.has(item.product.id))
      : [];

    this.items = nextItems;
    this.total = this.cartService.getTotal();

    this.knownProductIds.clear();
    this.items.forEach((item) => this.knownProductIds.add(item.product.id));
    this.cartHasLoaded = true;

    if (addedItems.length > 0) {
      const [addedItem] = addedItems;
      this.showFeedback(
        `${addedItem.product.name} ditambahkan ke keranjang.`,
        addedItem.product.id
      );
    }
  }

  private async presentCheckoutSuccess(total: number): Promise<void> {
    try {
      const toast = await this.toastController.create({
        message: `Transaksi berhasil: ${this.formatPrice(total)}`,
        color: 'success',
        duration: 2200,
        position: 'top',
      });

      await toast.present();
    } catch {
      this.showFeedback('Transaksi berhasil dicatat.');
    }
  }

  private showFeedback(message: string, productId: number | null = null): void {
    this.feedbackMessage = message;
    this.feedbackProductId = productId;
    this.feedbackActive = false;

    if (this.feedbackStartTimer) {
      clearTimeout(this.feedbackStartTimer);
    }

    if (this.feedbackDismissTimer) {
      clearTimeout(this.feedbackDismissTimer);
    }

    this.feedbackStartTimer = setTimeout(() => {
      this.feedbackActive = true;

      this.feedbackDismissTimer = setTimeout(() => {
        this.feedbackActive = false;
        this.feedbackMessage = '';
        this.feedbackProductId = null;
      }, 2200);
    }, 0);
  }

  private showError(message: string): void {
    this.errorMessage = message;
    this.errorFeedbackActive = false;

    if (this.errorFeedbackTimer) {
      clearTimeout(this.errorFeedbackTimer);
    }

    this.errorFeedbackTimer = setTimeout(() => {
      this.errorFeedbackActive = true;
    }, 0);
  }

  private clearTimers(): void {
    if (this.feedbackStartTimer) {
      clearTimeout(this.feedbackStartTimer);
    }

    if (this.feedbackDismissTimer) {
      clearTimeout(this.feedbackDismissTimer);
    }

    if (this.errorFeedbackTimer) {
      clearTimeout(this.errorFeedbackTimer);
    }
  }

  private toMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'Terjadi kesalahan pada cart.';
  }
}
