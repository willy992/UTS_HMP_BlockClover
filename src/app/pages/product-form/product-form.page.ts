import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductPayload } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.page.html',
  styleUrls: ['./product-form.page.scss'],
  standalone: false,
})
export class ProductFormPage implements OnInit {
  isEditMode = false;
  productNotFound = false;
  private productId: number | null = null;

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
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      this.isEditMode = idParam !== null;
      this.productNotFound = false;
      this.productId = null;

      if (idParam === null) {
        this.productForm.reset({
          name: '',
          category: '',
          purchasePrice: 0,
          sellingPrice: 0,
          stock: 0,
          imageUrl: '',
        });
        return;
      }

      const id = Number(idParam);
      const product =
        Number.isSafeInteger(id) && id > 0
          ? this.productService.getById(id)
          : undefined;

      if (!product) {
        this.productNotFound = true;
        return;
      }

      this.productId = product.id;
      this.productForm.patchValue({
        name: product.name,
        category: product.category,
        purchasePrice: product.purchasePrice,
        sellingPrice: product.sellingPrice,
        stock: product.stock,
        imageUrl: product.imageUrl ?? '',
      });
    });
  }

  submit(): void {
    if (this.productNotFound || this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const value = this.productForm.getRawValue();
    const payload: ProductPayload = {
      name: value.name.trim(),
      category: value.category.trim(),
      purchasePrice: value.purchasePrice,
      sellingPrice: value.sellingPrice,
      stock: value.stock,
      imageUrl: value.imageUrl.trim() || undefined,
    };

    if (this.isEditMode) {
      if (this.productId === null) {
        this.productNotFound = true;
        return;
      }

      const updated = this.productService.update(this.productId, payload);
      if (!updated) {
        this.productNotFound = true;
        return;
      }
    } else {
      this.productService.add(payload);
    }

    void this.router.navigateByUrl('/tabs/products');
  }
}