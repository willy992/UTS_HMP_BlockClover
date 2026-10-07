import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  Transaction,
  TransactionDayGroup,
} from '../../models/transaction.model';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-sales-report',
  templateUrl: './sales-report.page.html',
  styleUrls: ['./sales-report.page.scss'],
  standalone: false,
})
export class SalesReportPage implements OnInit, OnDestroy {
  dayGroups: TransactionDayGroup[] = [];
  todaySales = 0;
  todayProfit = 0;
  private transactionSubscription?: Subscription;

  private readonly rupiahFormatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  });

  constructor(private readonly transactionService: TransactionService) {}

  ngOnInit(): void {
    this.transactionSubscription = this.transactionService.transactions$.subscribe(
      () => this.refreshReport(),
    );
  }

  ngOnDestroy(): void {
    this.transactionSubscription?.unsubscribe();
  }

  ionViewWillEnter(): void {
    this.refreshReport();
  }

  formatRupiah(value: number): string {
    return this.rupiahFormatter.format(value);
  }

  formatDay(dateKey: string): string {
    return new Intl.DateTimeFormat('id-ID', { dateStyle: 'full' }).format(
      new Date(`${dateKey}T12:00:00`),
    );
  }

  formatTime(dateValue: string): string {
    return new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateValue));
  }

  getItemCount(transaction: Transaction): number {
    return transaction.lines.reduce(
      (total, line) => total + line.quantity,
      0,
    );
  }

  trackByDate(_: number, group: TransactionDayGroup): string {
    return group.dateKey;
  }

  trackById(_: number, transaction: Transaction): string {
    return transaction.id;
  }

  private refreshReport(): void {
    this.dayGroups = this.transactionService.getDailyGroups();
    this.todaySales = this.transactionService.getTodayTotal();
    this.todayProfit = this.transactionService.getTodayProfit();
  }
}
