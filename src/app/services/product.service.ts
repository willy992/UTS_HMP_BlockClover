import { Service } from '@angular/core';
import { Product, ProductPayload } from '../models/product.model';

@Service()
export class ProductService {
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

    //get all produk
    getAll(): Product[] {
        return this.products;
    }

    //search produk by id
    getById(id: number): Product | undefined {
        return this.products.find(product => product.id === id);
    }

    //get total produk yg avail
    getTotalProducts(): number {
        return this.products.length;
    }

    //get bestseller produk
    getBestSeller(): Product | undefined {
        return [...this.products].sort(
            (a, b) => b.sold - a.sold
        )[0];
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

        return product;
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

        return this.products[index];
    }

    //kurangi qty stok produk
    reduceStock(id: number, quantity: number): boolean {
        const product = this.getById(id);

        if (!product || product.stock < quantity) {
            return false;
        }

        product.stock -= quantity;
        product.sold += quantity;

        return true;
    }
}


