import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.page.html',
  styleUrls: ['./product-form.page.scss'],
  standalone: false,
})
export class ProductFormPage {
  readonly productForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.pattern(/\S/)]],
    category: ['', [Validators.required, Validators.pattern(/\S/)]],
    purchasePrice: [0, [Validators.required, Validators.min(1)]],
    sellingPrice: [0, [Validators.required, Validators.min(1)]],
    stock: [
      0,
      [
        Validators.required,
        Validators.min(0),
        Validators.pattern(/^\d+$/),
      ],
    ],
    imageUrl: [''],
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly productService: ProductService,
    private readonly router: Router
  ) {}

  submit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const value = this.productForm.getRawValue();

    this.productService.add({
      name: value.name.trim(),
      category: value.category.trim(),
      purchasePrice: value.purchasePrice,
      sellingPrice: value.sellingPrice,
      stock: value.stock,
      imageUrl: value.imageUrl.trim() || undefined,
    });

    void this.router.navigateByUrl('/tabs/products');
  }
}