import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, RouterModule } from '@angular/router';
import { of } from 'rxjs';

import { ProductFormPageModule } from './product-form.module';
import { ProductFormPage } from './product-form.page';

describe('ProductFormPage', () => {
  let component: ProductFormPage;
  let fixture: ComponentFixture<ProductFormPage>;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [ProductFormPageModule, RouterModule.forRoot([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({})),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create in add mode with an invalid empty form', () => {
    expect(component).toBeTruthy();
    expect(component.isEditMode).toBe(false);
    expect(component.productForm.invalid).toBe(true);
  });
});
