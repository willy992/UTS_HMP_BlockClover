import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular/lazy';
import { TopProductsPageRoutingModule } from './top-products-routing.module';
import { TopProductsPage } from './top-products.page';

@NgModule({
  imports: [CommonModule, IonicModule, TopProductsPageRoutingModule],
  declarations: [TopProductsPage],
})
export class TopProductsPageModule {}
