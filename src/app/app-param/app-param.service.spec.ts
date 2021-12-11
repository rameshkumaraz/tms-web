import { TestBed } from '@angular/core/testing';

import { AppParamService } from './app-param.service';

describe('AppParamService', () => {
  let service: AppParamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppParamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
