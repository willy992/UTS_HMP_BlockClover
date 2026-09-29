import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss'],
  standalone: false,
})
export class DashboardPage {
  totalProducts = 0;
  todayTransactionCount = 0;
  todayTotal = 0;
  todayBestSellerName = 'Belum ada transaksi hari ini';
  todayBestSellerQuantity = 0;

  private readonly rupiahFormatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  constructor(
    private readonly productService: ProductService,
    private readonly transactionService: TransactionService
  ) {}

  ionViewWillEnter(): void {
    const bestSeller = this.transactionService.getTodayBestSeller();

    this.totalProducts = this.productService.getTotalProducts();
    this.todayTransactionCount = this.transactionService.getTodayCount();
    this.todayTotal = this.transactionService.getTodayTotal();
    this.todayBestSellerName =
      bestSeller?.productName ?? 'Belum ada transaksi hari ini';
    this.todayBestSellerQuantity = bestSeller?.quantity ?? 0;
  }

  formatRupiah(amount: number): string {
    return this.rupiahFormatter.format(amount);
  }
}