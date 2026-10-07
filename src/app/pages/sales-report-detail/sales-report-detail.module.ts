import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular/lazy';
import { SalesReportDetailPageRoutingModule } from './sales-report-detail-routing.module';
import { SalesReportDetailPage } from './sales-report-detail.page';

@NgModule({
  imports: [CommonModule, IonicModule, SalesReportDetailPageRoutingModule],
  declarations: [SalesReportDetailPage],
})
export class SalesReportDetailPageModule {}
