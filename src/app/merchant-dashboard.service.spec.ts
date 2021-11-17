import { TestBed } from '@angular/core/testing';

import { MerchantDashboardService } from './merchant-dashboard.service';

describe('MerchantDashboardService', () => {
  let service: MerchantDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MerchantDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
