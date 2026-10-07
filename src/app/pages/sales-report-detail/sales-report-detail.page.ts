import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Transaction } from '../../models/transaction.model';
import { ProductService } from '../../services/product.service';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-sales-report-detail',
  templateUrl: './sales-report-detail.page.html',
  styleUrls: ['./sales-report-detail.page.scss'],
  standalone: false,
})
export class SalesReportDetailPage implements OnInit {
  transaction?: Transaction;

  private readonly rupiahFormatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
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

  formatRupiah(value: number): string {
    return this.rupiahFormatter.format(value);
  }

  formatDate(value: string): string {
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'full',
      timeStyle: 'short',
    }).format(new Date(value));
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
