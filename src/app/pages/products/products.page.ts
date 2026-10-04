import { Component } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: 'products.page.html',
  styleUrls: ['products.page.scss'],
  standalone: false,
})
export class ProductsPage {
  products: Product[] = [];
  searchQuery = '';

  private readonly rupiahFormatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  });

  constructor(private readonly productService: ProductService) {
    this.loadProducts();
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
}