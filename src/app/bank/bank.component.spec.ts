import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BankComponent } from './bank.component';

describe('BankComponent', () => {
  let component: BankComponent;
  let fixture: ComponentFixture<BankComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
