import { TestBed } from '@angular/core/testing';

import { DeviceBrandService } from './device-brand.service';

describe('DeviceBrandService', () => {
  let service: DeviceBrandService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeviceBrandService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
