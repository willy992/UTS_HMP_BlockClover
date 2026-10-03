import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular/lazy';

import { ProductFormPageRoutingModule } from './product-form-routing.module';
import { ProductFormPage } from './product-form.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    ProductFormPageRoutingModule,
  ],
  declarations: [ProductFormPage],
})
export class ProductFormPageModule {}