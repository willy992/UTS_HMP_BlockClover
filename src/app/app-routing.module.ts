import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'settings',
    loadChildren: () =>
      import('./pages/settings/settings.module').then(
        (m) => m.SettingsPageModule,
      ),
  },
  {
    path: 'about',
    loadChildren: () =>
      import('./pages/about/about.module').then((m) => m.AboutPageModule),
  },
  {
    path: 'cart',
    loadChildren: () =>
      import('./pages/cart/cart.module').then((m) => m.CartPageModule),
  },
  {
    path: 'transaction/:id',
    loadChildren: () =>
      import('./pages/transactiondetails/transactiondetails.module').then(
        (m) => m.TransactionDetailPageModule,
      ),
  },
  {
    path: 'sales-report/transaction/:id',
    loadChildren: () =>
      import('./pages/sales-report-detail/sales-report-detail.module').then(
        (m) => m.SalesReportDetailPageModule,
      ),
  },
  {
    path: 'sales-report',
    loadChildren: () =>
      import('./pages/sales-report/sales-report.module').then(
        (m) => m.SalesReportPageModule,
      ),
  },
  {
    path: 'top-products',
    loadChildren: () =>
      import('./pages/top-products/top-products.module').then(
        (m) => m.TopProductsPageModule,
      ),
  },
  {
    path: 'product/new',
    loadChildren: () =>
      import('./pages/product-form/product-form.module').then(
        (m) => m.ProductFormPageModule,
      ),
  },
  {
    path: 'product/:id/edit',
    loadChildren: () =>
      import('./pages/product-form/product-form.module').then(
        (m) => m.ProductFormPageModule,
      ),
  },
  {
    path: 'product/:id',
    loadChildren: () =>
      import('./pages/product-detail/product-detail.module').then(
        (m) => m.ProductDetailPageModule,
      ),
  },
  {
    path: '',
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
