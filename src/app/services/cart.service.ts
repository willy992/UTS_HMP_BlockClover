import { inject, Service } from '@angular/core';
    import { BehaviorSubject, distinctUntilChanged, map } from 'rxjs';
    import { CartItem } from '../models/cart-item.model';
    import { Product } from '../models/product.model';
    import { ProductService } from './product.service';

    @Service()
export class CartService {
    private readonly productService = inject(ProductService);
    private readonly storageKey = 'simobile-cart.v1';
    private readonly quantities = new Map<number, number>();
    private readonly itemsSubject = new BehaviorSubject<CartItem[]>([]);
    readonly items$ = this.itemsSubject.asObservable();
    readonly itemCount$ = this.items$.pipe(
        map(items => items.reduce((total, item) => total + item.quantity, 0)),
        distinctUntilChanged()
    );

    constructor() {
        this.loadQuantities();
        this.publishItems();
    }

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
        this.persistQuantities();
        this.publishItems();
        return undefined;
        }

        this.quantities.set(productId, quantity);
        this.persistQuantities();
        this.publishItems();

        return this.toCartItem(product, quantity);
    }

    remove(productId: number): boolean {
        this.getProduct(productId);

        const removed = this.quantities.delete(productId);

        if (removed) {
        this.persistQuantities();
        this.publishItems();
        }

        return removed;
    }

    getTotal(): number {
        return this.getItems().reduce((total, item) => total + item.subtotal, 0);
    }

    getItemCount(): number {
        return this.getItems().reduce(
        (total, item) => total + item.quantity,
        0
        );
    }

    clear(): void {
        this.quantities.clear();
        this.persistQuantities();
        this.publishItems();
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

    private publishItems(): void {
        this.itemsSubject.next(this.getItems());
    }

    private loadQuantities(): void {
        try {
        const rawValue = localStorage.getItem(this.storageKey);

        if (!rawValue) {
            return;
        }

        const storedValue: unknown = JSON.parse(rawValue);

        if (typeof storedValue !== 'object' || storedValue === null) {
            return;
        }

        const cart = storedValue as {
            version?: unknown;
            quantities?: unknown;
        };

        if (cart.version !== 1 || !Array.isArray(cart.quantities)) {
            return;
        }

        for (const entry of cart.quantities) {
            if (
            !Array.isArray(entry) ||
            entry.length !== 2 ||
            !Number.isSafeInteger(entry[0]) ||
            !Number.isSafeInteger(entry[1]) ||
            entry[1] <= 0
            ) {
            continue;
            }

            const product = this.productService.getById(entry[0]);

            if (product && product.stock >= entry[1]) {
            this.quantities.set(entry[0], entry[1]);
            }
        }
        } catch {
        this.quantities.clear();
        }
    }

    private persistQuantities(): void {
        try {
        localStorage.setItem(
            this.storageKey,
            JSON.stringify({
            version: 1,
            quantities: [...this.quantities.entries()],
            }),
        );
        } catch {
        // Keranjang tetap berfungsi di memori jika penyimpanan diblokir.
        }
    }
    }
