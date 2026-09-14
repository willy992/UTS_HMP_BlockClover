import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page {

  constructor(private productService: ProductService) {
    console.log(this.productService.getAll());
    console.log(
      'Jumlah produk:',
      this.productService.getTotalProducts()
    );
    console.log(
      'Produk terlaris:',
      this.productService.getBestSeller()
    );
  }

}
