import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceBrandComponent } from './device-brand.component';

describe('DeviceBrandComponent', () => {
  let component: DeviceBrandComponent;
  let fixture: ComponentFixture<DeviceBrandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviceBrandComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceBrandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
