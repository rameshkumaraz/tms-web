import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../shared/core/base.service';

@Injectable({
  providedIn: 'root'
})
export class AdminUserService extends BaseService{

  constructor(private client: HttpClient) {
    super(client, 'adminUser');
  }
}
