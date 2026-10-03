import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
  standalone: false,
})
export class ProductDetailPage implements OnInit {
  product?: Product;
  imageUnavailable = false;

  @Output() readonly purchaseRequested = new EventEmitter<number>();

  private readonly rupiahFormatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly productService: ProductService
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

  requestPurchase(): void {
    if (!this.product || this.product.stock <= 0) {
      return;
    }

    this.purchaseRequested.emit(this.product.id);
  }
}