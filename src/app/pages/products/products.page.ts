import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular/lazy';
import { Subscription } from 'rxjs';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { createProductImageDataUrl } from '../../utils/product-image.util';

@Component({
  selector: 'app-products',
  templateUrl: 'products.page.html',
  styleUrls: ['products.page.scss'],
  standalone: false,
})
export class ProductsPage implements OnInit, OnDestroy {
  products: Product[] = [];
  searchQuery = '';
  cartItemCount = 0;

  private readonly unavailableImageIds = new Set<number>();
  private readonly subscriptions = new Subscription();

  private readonly rupiahFormatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  });

  constructor(
    private readonly productService: ProductService,
    private readonly cartService: CartService,
    private readonly toastController: ToastController,
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.productService.products$.subscribe((products) => {
        this.products = products;
      }),
    );
    this.subscriptions.add(
      this.cartService.itemCount$.subscribe((count) => {
        this.cartItemCount = count;
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ionViewWillEnter(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.products = [...this.productService.getAll()];
  }

  get filteredProducts(): Product[] {
    const query = this.searchQuery.trim().toLowerCase();

    if (!query) {
      return this.products;
    }

    return this.products.filter(product =>
      `${product.name} ${product.category}`.toLowerCase().includes(query)
    );
  }

  formatRupiah(amount: number): string {
    return this.rupiahFormatter.format(amount);
  }

  getProductImageUrl(product: Product): string {
    return product.imageUrl && !this.unavailableImageIds.has(product.id)
      ? product.imageUrl
      : createProductImageDataUrl(product);
  }

  onImageError(productId: number): void {
    this.unavailableImageIds.add(productId);
  }

  async addToCart(event: Event, product: Product): Promise<void> {
    event.preventDefault();
    event.stopPropagation();

    try {
      this.cartService.add(product.id);
      const toast = await this.toastController.create({
        message: `${product.name} ditambahkan ke keranjang.`,
        color: 'success',
        duration: 1600,
        position: 'top',
      });
      await toast.present();
    } catch (error) {
      const toast = await this.toastController.create({
        message:
          error instanceof Error ? error.message : 'Produk gagal ditambahkan.',
        color: 'danger',
        duration: 1800,
        position: 'top',
      });
      await toast.present();
    }
  }

  trackByProductId(_: number, product: Product): number {
    return product.id;
  }
}
