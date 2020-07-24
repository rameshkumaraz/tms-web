import { TestBed } from '@angular/core/testing';

import { LoginNotificationService } from './login-notification.service';

describe('LoginNotificationService', () => {
  let service: LoginNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
