import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss'],
  standalone: false,
})
export class DashboardPage implements OnInit, OnDestroy {
  availableProducts = 0;
  totalProducts = 0;
  todayTransactionCount = 0;
  todayTotal = 0;
  todayProfit = 0;
  topProducts: Product[] = [];

  private dataSubscription?: Subscription;

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

  ngOnInit(): void {
    this.dataSubscription = combineLatest([
      this.productService.products$,
      this.transactionService.transactions$,
    ]).subscribe(() => this.refreshSummary());
  }

  ngOnDestroy(): void {
    this.dataSubscription?.unsubscribe();
  }

  ionViewWillEnter(): void {
    this.refreshSummary();
  }

  private refreshSummary(): void {
    this.availableProducts = this.productService.getAvailableProductsCount();
    this.totalProducts = this.productService.getTotalProducts();
    this.todayTransactionCount = this.transactionService.getTodayCount();
    this.todayTotal = this.transactionService.getTodayTotal();
    this.todayProfit = this.transactionService.getTodayProfit();
    this.topProducts = this.productService.getTopSelling(3);
  }

  formatRupiah(amount: number): string {
    return this.rupiahFormatter.format(amount);
  }
}
