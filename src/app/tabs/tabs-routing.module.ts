import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('../pages/dashboard/dashboard.module').then(m => m.DashboardPageModule)
      },
      {
        path: 'products',
        loadChildren: () => import('../pages/products/products.module').then(m => m.ProductsPageModule)
      },
      {
        path: 'transactions',
        loadChildren: () => import('../pages/transactions/transactions.module').then(m => m.TransactionsPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
