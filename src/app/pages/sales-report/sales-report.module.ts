import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular/lazy';
import { SalesReportPageRoutingModule } from './sales-report-routing.module';
import { SalesReportPage } from './sales-report.page';

@NgModule({
  imports: [CommonModule, IonicModule, SalesReportPageRoutingModule],
  declarations: [SalesReportPage],
})
export class SalesReportPageModule {}
