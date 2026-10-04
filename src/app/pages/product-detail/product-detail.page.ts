import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { ToastController } from '@ionic/angular/lazy';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
  standalone: false,
})
export class ProductDetailPage implements OnInit {
  product?: Product;
  imageUnavailable = false;

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
  private readonly toastController: ToastController
) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.product =
        Number.isSafeInteger(id) && id > 0
          ? this.productService.getById(id)
          : undefined;
      this.imageUnavailable = false;
    });
  }

  formatRupiah(amount: number): string {
    return this.rupiahFormatter.format(amount);
  }

  onImageError(): void {
    this.imageUnavailable = true;
  }
}