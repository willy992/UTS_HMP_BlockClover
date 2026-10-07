import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-top-products',
  templateUrl: './top-products.page.html',
  styleUrls: ['./top-products.page.scss'],
  standalone: false,
})
export class TopProductsPage implements OnInit, OnDestroy {
  products: Product[] = [];
  private productSubscription?: Subscription;

  constructor(private readonly productService: ProductService) {}

  ngOnInit(): void {
    this.productSubscription = this.productService.products$.subscribe(
      (products) => {
        this.products = [...products].sort(
          (first, second) => second.sold - first.sold,
        );
      },
    );
  }

  ngOnDestroy(): void {
    this.productSubscription?.unsubscribe();
  }

  trackByProductId(_: number, product: Product): number {
    return product.id;
  }
}
