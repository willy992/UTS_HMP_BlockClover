import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular/lazy';
import { TransactionDetailPageRoutingModule } from './transactiondetails-routing.module';
import { TransactionDetailPage } from './transactiondetails.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    TransactionDetailPageRoutingModule,
  ],
  declarations: [TransactionDetailPage],
})
export class TransactionDetailPageModule {}