import { IonicModule } from '@ionic/angular/lazy';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionsPage } from './transactions.page';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import { TransactionsPageRoutingModule } from './transactions-routing.module';



@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    TransactionsPageRoutingModule
  ],
  declarations: [TransactionsPage]
})
export class TransactionsPageModule {}
