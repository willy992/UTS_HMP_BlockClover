import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';
import { TransactionDetailPageModule } from './transactiondetails.module';
import { TransactionDetailPage } from './transactiondetails.page';

describe('TransactionDetailPage', () => {
  let component: TransactionDetailPage;
  let fixture: ComponentFixture<TransactionDetailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionDetailPageModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: 'tidak-ada' }),
            },
          },
        },
        {
          provide: TransactionService,
          useValue: {
            getById: () => undefined,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should handle a transaction ID that does not exist', () => {
    component.ionViewWillEnter();

    expect(component.transaction).toBeUndefined();
  });
});