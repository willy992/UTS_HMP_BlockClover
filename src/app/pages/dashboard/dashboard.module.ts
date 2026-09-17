import { IonicModule } from '@ionic/angular/lazy';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DashboardPage } from './dashboard.page';
import { DashboardPageRoutingModule } from './dashboard-routing.module';
import {ExploreContainerComponentModule} from '../../explore-container/explore-container.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    DashboardPageRoutingModule,
  ],
  declarations: [DashboardPage],
})
export class DashboardPageModule {}