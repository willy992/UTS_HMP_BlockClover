import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { DashboardPageModule } from './dashboard.module';
import { DashboardPage } from './dashboard.page';

describe('DashboardPage', () => {
  let component: DashboardPage;
  let fixture: ComponentFixture<DashboardPage>;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [DashboardPageModule, RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the dashboard summary from services', () => {
    component.ionViewWillEnter();

    expect(component.availableProducts).toBe(11);
    expect(component.totalProducts).toBe(12);
    expect(component.todayTransactionCount).toBe(0);
    expect(component.todayTotal).toBe(0);
    expect(component.todayProfit).toBe(0);
    expect(component.topProducts.map((product) => product.name)).toEqual([
      'Mi Instan Goreng',
      'Air Mineral 600 ml',
      'Kopi Sachet',
    ]);
  });
});
