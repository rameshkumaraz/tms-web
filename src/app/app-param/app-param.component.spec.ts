import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppParamComponent } from './app-param.component';

describe('AppParamComponent', () => {
  let component: AppParamComponent;
  let fixture: ComponentFixture<AppParamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppParamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppParamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
