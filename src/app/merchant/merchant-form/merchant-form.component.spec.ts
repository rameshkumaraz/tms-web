import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MerchantFormComponent } from './merchant-form.component';

describe('MerchantFormComponent', () => {
  let component: MerchantFormComponent;
  let fixture: ComponentFixture<MerchantFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchantFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
