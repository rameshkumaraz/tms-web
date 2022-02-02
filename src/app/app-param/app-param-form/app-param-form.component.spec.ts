import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppParamFormComponent } from './app-param-form.component';

describe('AppParamFormComponent', () => {
  let component: AppParamFormComponent;
  let fixture: ComponentFixture<AppParamFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppParamFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppParamFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
