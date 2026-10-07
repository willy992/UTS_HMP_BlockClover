import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesReportDetailPage } from './sales-report-detail.page';

const routes: Routes = [{ path: '', component: SalesReportDetailPage }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesReportDetailPageRoutingModule {}
