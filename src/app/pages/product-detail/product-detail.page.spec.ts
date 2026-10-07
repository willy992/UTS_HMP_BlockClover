import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, RouterModule } from '@angular/router';
import { ToastController } from '@ionic/angular/lazy';
import { of } from 'rxjs';

import { ProductDetailPageModule } from './product-detail.module';
import { ProductDetailPage } from './product-detail.page';

describe('ProductDetailPage', () => {
  let component: ProductDetailPage;
  let fixture: ComponentFixture<ProductDetailPage>;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [ProductDetailPageModule, RouterModule.forRoot([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ id: '1' })),
          },
        },
        {
          provide: ToastController,
          useValue: {
            create: async () => ({
              present: async () => undefined,
            }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load the product from the route ID', () => {
    expect(component).toBeTruthy();
    expect(component.product?.id).toBe(1);
  });

  it('should use the fallback image after an image error', () => {
    component.onImageError();

    expect(component.productImageUrl).toContain('data:image/svg+xml');
  });
});
