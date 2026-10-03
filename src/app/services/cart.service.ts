import { inject, Service } from '@angular/core';
    import { CartItem } from '../models/cart-item.model';
    import { Product } from '../models/product.model';
    import { ProductService } from './product.service';

    @Service()
export class CartService {
    private readonly productService = inject(ProductService);
    private readonly quantities = new Map<number, number>();

    getItems(): CartItem[] {
        return Array.from(this.quantities.entries()).map(([productId, quantity]) => {
        return this.toCartItem(this.getProduct(productId), quantity);
        });
    }

    add(productId: number): CartItem {
        const item = this.setQuantity(
        productId,
        (this.quantities.get(productId) ?? 0) + 1
        );

        if (!item) {
        throw new Error('Cart item gagal ditambahkan.');
        }

        return item;
    }

    setQuantity(productId: number, quantity: number): CartItem | undefined {
        const product = this.getProduct(productId);
        this.assertValidQuantity(quantity);

        const availableStock = this.getAvailableStock(product);

        if (quantity > availableStock) {
        throw new RangeError(
            `Quantity ${quantity} melebihi stok ${availableStock} untuk produk "${product.name}".`
        );
        }

        if (quantity === 0) {
        this.quantities.delete(productId);
        return undefined;
        }

        this.quantities.set(productId, quantity);

        return this.toCartItem(product, quantity);
    }

    remove(productId: number): boolean {
        this.getProduct(productId);

        return this.quantities.delete(productId);
    }

    getTotal(): number {
        return this.getItems().reduce((total, item) => total + item.subtotal, 0);
    }

    clear(): void {
        this.quantities.clear();
    }

    private getProduct(productId: number): Product {
        if (!Number.isSafeInteger(productId)) {
        throw new TypeError('Product ID harus berupa bilangan bulat yang valid.');
        }

        const product = this.productService.getById(productId);

        if (!product) {
        throw new Error(`Produk dengan ID ${productId} tidak ditemukan.`);
        }

        return product;
    }

    private getAvailableStock(product: Product): number {
        if (
        !Number.isFinite(product.stock) ||
        !Number.isInteger(product.stock) ||
        product.stock < 0
        ) {
        throw new RangeError(`Stok produk "${product.name}" tidak valid.`);
        }

        return product.stock;
    }

    private assertValidQuantity(quantity: number): void {
        if (
        !Number.isFinite(quantity) ||
        !Number.isSafeInteger(quantity) ||
        quantity < 0
        ) {
        throw new RangeError(
            'Quantity harus berupa bilangan bulat, tidak negatif, dan finite.'
        );
        }
    }

    private toCartItem(product: Product, quantity: number): CartItem {
        return {
        product: { ...product },
        quantity,
        subtotal: product.sellingPrice * quantity,
        };
    }
    }
