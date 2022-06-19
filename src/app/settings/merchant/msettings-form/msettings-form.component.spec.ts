import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsettingsFormComponent } from './msettings-form.component';

describe('MsettingsFormComponent', () => {
  let component: MsettingsFormComponent;
  let fixture: ComponentFixture<MsettingsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsettingsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsettingsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
