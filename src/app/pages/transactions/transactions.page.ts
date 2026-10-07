import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  Transaction,
  TransactionDayGroup,
} from '../../models/transaction.model';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-transactions',
  templateUrl: 'transactions.page.html',
  styleUrls: ['transactions.page.scss'],
  standalone: false,
})
export class TransactionsPage implements OnInit, OnDestroy {
  transactions: Transaction[] = [];
  dayGroups: TransactionDayGroup[] = [];
  private transactionSubscription?: Subscription;

  private readonly rupiahFormatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  private readonly dateFormatter = new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  constructor(private readonly transactionService: TransactionService) {}

  ngOnInit(): void {
    this.transactionSubscription = this.transactionService.transactions$.subscribe(
      (transactions) => {
        this.transactions = transactions;
        this.dayGroups = this.transactionService.getDailyGroups();
      },
    );
  }

  ngOnDestroy(): void {
    this.transactionSubscription?.unsubscribe();
  }

  ionViewWillEnter(): void {
    this.transactions = this.transactionService.getAll();
    this.dayGroups = this.transactionService.getDailyGroups();
  }

  formatRupiah(amount: number): string {
    return this.rupiahFormatter.format(amount);
  }

  formatDate(dateValue: string): string {
    return this.dateFormatter.format(new Date(dateValue));
  }

  formatDay(dateKey: string): string {
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'full',
    }).format(new Date(`${dateKey}T12:00:00`));
  }

  getItemSummary(transaction: Transaction): string {
    const totalItems = transaction.lines.reduce(
      (total, line) => total + line.quantity,
      0
    );

    return `${transaction.lines.length} jenis produk • ${totalItems} barang`;
  }

  trackById(_: number, transaction: Transaction): string {
    return transaction.id;
  }

  trackByDate(_: number, group: TransactionDayGroup): string {
    return group.dateKey;
  }
}
