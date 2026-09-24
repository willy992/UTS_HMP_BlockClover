import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Transaction } from '../../models/transaction.model';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.page.html',
  styleUrls: ['./transaction-detail.page.scss'],
  standalone: false,
})
export class TransactionDetailPage {
  transaction: Transaction | undefined;

  private readonly rupiahFormatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  private readonly dateFormatter = new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'full',
    timeStyle: 'short',
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly transactionService: TransactionService
  ) {}

  ionViewWillEnter(): void {
    const id = this.route.snapshot.paramMap.get('id');

    this.transaction = id
      ? this.transactionService.getById(id)
      : undefined;
  }

  formatRupiah(amount: number): string {
    return this.rupiahFormatter.format(amount);
  }

  formatDate(dateValue: string): string {
    return this.dateFormatter.format(new Date(dateValue));
  }
}