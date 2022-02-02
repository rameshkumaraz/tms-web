import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppParamImportComponent } from './app-param-import.component';

describe('AppParamImportComponent', () => {
  let component: AppParamImportComponent;
  let fixture: ComponentFixture<AppParamImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppParamImportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppParamImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
