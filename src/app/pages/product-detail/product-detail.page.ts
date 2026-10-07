import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular/lazy';
import { Subscription } from 'rxjs';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { createProductImageDataUrl } from '../../utils/product-image.util';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
  standalone: false,
})
export class ProductDetailPage implements OnInit, OnDestroy {
  product?: Product;
  imageUnavailable = false;
  cartItemCount = 0;

  private readonly subscriptions = new Subscription();

  get productImageUrl(): string {
    return this.product?.imageUrl && !this.imageUnavailable
      ? this.product.imageUrl
      : this.product
        ? createProductImageDataUrl(this.product)
        : '';
  }

  async requestPurchase(): Promise<void> {
    if (!this.product || this.product.stock <= 0) {
      return;
    }

    try {
      const item = this.cartService.add(this.product.id);
      const toast = await this.toastController.create({
        message: `${item.product.name} ditambahkan ke keranjang.`,
        color: 'success',
        duration: 2200,
        position: 'top',
      });

      await toast.present();
    } catch (error) {
      const toast = await this.toastController.create({
        message:
          error instanceof Error ? error.message : 'Gagal menambahkan produk.',
        color: 'danger',
        duration: 2200,
        position: 'top',
      });

      await toast.present();
    }
  }

  private readonly rupiahFormatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly productService: ProductService,
    private readonly cartService: CartService,
    private readonly toastController: ToastController,
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.route.paramMap.subscribe((params) => {
        const id = Number(params.get('id'));
        this.product =
          Number.isSafeInteger(id) && id > 0
            ? this.productService.getById(id)
            : undefined;
        this.imageUnavailable = false;
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

  formatRupiah(amount: number): string {
    return this.rupiahFormatter.format(amount);
  }

  onImageError(): void {
    this.imageUnavailable = true;
  }
}
