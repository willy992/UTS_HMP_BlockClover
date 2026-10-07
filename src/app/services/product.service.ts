import { Service } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product, ProductPayload } from '../models/product.model';

@Service()
export class ProductService {
    private readonly storageKey = 'simobile.products.v1';
    private canPersist = true;
    //seeder
    private products: Product[] = [
        {
            id: 1,
            name: 'Beras Ramos 5 kg',
            category: 'Sembako',
            purchasePrice: 68000,
            sellingPrice: 75000,
            stock: 14,
            imageUrl: 'assets/products/beras.jpg',
            sold: 18
        },
        {
            id: 2,
            name: 'Minyak Goreng 1 L',
            category: 'Sembako',
            purchasePrice: 15500,
            sellingPrice: 18000,
            stock: 22,
            imageUrl: 'assets/products/minyak.jpg',
            sold: 25
        },
        {
            id: 3,
            name: 'Gula Pasir 1 kg',
            category: 'Sembako',
            purchasePrice: 16000,
            sellingPrice: 18500,
            stock: 16,
            sold: 20
        },
        {
            id: 4,
            name: 'Mi Instan Goreng',
            category: 'Makanan',
            purchasePrice: 2800,
            sellingPrice: 3500,
            stock: 48,
            imageUrl: 'assets/products/mi.jpg',
            sold: 34
        },
        {
            id: 5,
            name: 'Teh Celup Melati',
            category: 'Minuman',
            purchasePrice: 6500,
            sellingPrice: 8000,
            stock: 10,
            sold: 9
        },
        {
            id: 6,
            name: 'Kopi Sachet',
            category: 'Minuman',
            purchasePrice: 1700,
            sellingPrice: 2500,
            stock: 0,
            sold: 28
        },
        {
            id: 7,
            name: 'Susu UHT Cokelat',
            category: 'Minuman',
            purchasePrice: 5200,
            sellingPrice: 7000,
            stock: 19,
            sold: 15
        },
        {
            id: 8,
            name: 'Biskuit Kelapa',
            category: 'Makanan',
            purchasePrice: 7500,
            sellingPrice: 9500,
            stock: 8,
            sold: 12
        },
        {
            id: 9,
            name: 'Sabun Mandi',
            category: 'Kebersihan',
            purchasePrice: 3400,
            sellingPrice: 5000,
            stock: 27,
            sold: 11
        },
        {
            id: 10,
            name: 'Pasta Gigi',
            category: 'Kebersihan',
            purchasePrice: 8200,
            sellingPrice: 11000,
            stock: 13,
            sold: 7
        },
        {
            id: 11,
            name: 'Air Mineral 600 ml',
            category: 'Minuman',
            purchasePrice: 2200,
            sellingPrice: 3500,
            stock: 36,
            sold: 31
        },
        {
            id: 12,
            name: 'Telur Ayam 1 kg',
            category: 'Sembako',
            purchasePrice: 26000,
            sellingPrice: 30000,
            stock: 6,
            sold: 16
        }
    ];
    private readonly productsSubject = new BehaviorSubject<Product[]>([]);
    readonly products$ = this.productsSubject.asObservable();
    
    constructor() {
        this.loadSavedProducts();
        this.publishProducts();
    }

    //get all produk
    getAll(): Product[] {
        return this.products.map(product => ({ ...product }));
    }

    //search produk by id
    getById(id: number): Product | undefined {
        const product = this.products.find(item => item.id === id);

        return product ? { ...product } : undefined;
    }

    //get total produk yg avail
    getTotalProducts(): number {
        return this.products.length;
    }

    getAvailableProductsCount(): number {
        return this.products.filter(product => product.stock > 0).length;
    }

    //get bestseller produk
    getBestSeller(): Product | undefined {
        return this.getTopSelling(1)[0];
    }

    getTopSelling(limit = 3): Product[] {
        return [...this.products]
            .sort((first, second) => second.sold - first.sold)
            .slice(0, Math.max(0, limit))
            .map(product => ({ ...product }));
    }

    //tambah produk
    add(payload: ProductPayload): Product {
        const nextId = Math.max(0, ...this.products.map(product => product.id)) + 1;

        const product: Product = {
            ...payload,
            id: nextId,
            sold: 0
        };

        this.products.push(product);
        this.saveProducts();
        this.publishProducts();

        return { ...product };
    }

    //update or edit produk
    update(id: number, payload: ProductPayload): Product | undefined {
        const index = this.products.findIndex(
            product => product.id === id
        );

        if (index === -1) {
            return undefined;
        }

        this.products[index] = {
            ...this.products[index],
            ...payload
        };
        this.saveProducts();
        this.publishProducts();

        return { ...this.products[index] };
    }

    //kurangi qty stok produk
    reduceStock(id: number, quantity: number): boolean {
        const product = this.products.find(item => item.id === id);

        if (!product || product.stock < quantity) {
            return false;
        }

        product.stock -= quantity;
        product.sold += quantity;
        this.saveProducts();
        this.publishProducts();

        return true;
    }
    
    private loadSavedProducts(): void {
    let savedValue: string | null;

    try {
        savedValue = localStorage.getItem(this.storageKey);
    } catch {
        this.canPersist = false;
        return;
    }

    if (savedValue === null) {
        return;
    }

    let parsedValue: unknown;

    try {
        parsedValue = JSON.parse(savedValue);
    } catch {
        this.preserveInvalidData(savedValue);
        return;
    }

    if (!this.isStoredProducts(parsedValue)) {
        this.preserveInvalidData(savedValue);
        return;
    }

    this.products = parsedValue.products;
}

private isStoredProducts(
    value: unknown
): value is { version: 1; products: Product[] } {
    if (typeof value !== 'object' || value === null) {
        return false;
    }

    const storedValue = value as {
        version?: unknown;
        products?: unknown;
    };

    return (
        storedValue.version === 1 &&
        Array.isArray(storedValue.products) &&
        storedValue.products.every(product => this.isProduct(product))
    );
}

private isProduct(value: unknown): value is Product {
    if (typeof value !== 'object' || value === null) {
        return false;
    }

    const product = value as Record<string, unknown>;

    return (
        Number.isInteger(product['id']) &&
        typeof product['name'] === 'string' &&
        typeof product['category'] === 'string' &&
        typeof product['purchasePrice'] === 'number' &&
        Number.isFinite(product['purchasePrice']) &&
        typeof product['sellingPrice'] === 'number' &&
        Number.isFinite(product['sellingPrice']) &&
        typeof product['stock'] === 'number' &&
        Number.isFinite(product['stock']) &&
        typeof product['sold'] === 'number' &&
        Number.isFinite(product['sold']) &&
        (product['imageUrl'] === undefined ||
            typeof product['imageUrl'] === 'string')
    );
}

private preserveInvalidData(rawValue: string): void {
    try {
        const recoveryKey = `${this.storageKey}.recovery.${Date.now()}`;
        localStorage.setItem(recoveryKey, rawValue);
    } catch {
        this.canPersist = false;
    }
}

private saveProducts(): void {
    if (!this.canPersist) {
        return;
    }

    try {
        localStorage.setItem(
            this.storageKey,
            JSON.stringify({
                version: 1,
                products: this.products
            })
        );
    } catch {
        // Keep the in-memory changes without crashing the app.
    }
}

private publishProducts(): void {
    this.productsSubject.next(this.getAll());
}
}


