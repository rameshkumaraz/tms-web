import { TestBed } from '@angular/core/testing';

import { DeviceModelService } from './device-model.service';

describe('DeviceModelService', () => {
  let service: DeviceModelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeviceModelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
