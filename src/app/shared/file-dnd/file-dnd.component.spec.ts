import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FileDndComponent } from './file-dnd.component';

describe('FileDndComponent', () => {
  let component: FileDndComponent;
  let fixture: ComponentFixture<FileDndComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FileDndComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileDndComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
