import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TopProductsPage } from './top-products.page';

const routes: Routes = [{ path: '', component: TopProductsPage }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TopProductsPageRoutingModule {}
