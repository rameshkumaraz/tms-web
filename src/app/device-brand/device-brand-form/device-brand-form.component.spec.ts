import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceBrandFormComponent } from './device-brand-form.component';

describe('DeviceBrandFormComponent', () => {
  let component: DeviceBrandFormComponent;
  let fixture: ComponentFixture<DeviceBrandFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviceBrandFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceBrandFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
