import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Transaction } from '../../models/transaction.model';
import { TransactionService } from '../../services/transaction.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transactiondetails.page.html',
  styleUrls: ['./transactiondetails.page.scss'],
  standalone: false,
})
export class TransactionDetailPage implements OnInit {
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
    private readonly transactionService: TransactionService,
    private readonly productService: ProductService,
  ) {}

  ngOnInit(): void {
    this.loadTransaction();
  }

  ionViewWillEnter(): void {
    this.loadTransaction();
  }

  private loadTransaction(): void {
    const id = this.getRouteId();

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

  isOutOfStock(productId: number): boolean {
    return this.productService.getById(productId)?.stock === 0;
  }

  private getRouteId(): string | null {
    for (const snapshot of
      this.route.snapshot.pathFromRoot ?? [this.route.snapshot]) {
      const id = snapshot.paramMap.get('id');

      if (id) {
        return id;
      }
    }

    const lastPathSegment = globalThis.location?.pathname
      .split('/')
      .filter(Boolean)
      .at(-1);

    return lastPathSegment ? decodeURIComponent(lastPathSegment) : null;
  }
}
