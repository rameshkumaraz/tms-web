import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../shared/core/base.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService extends BaseService {

  constructor(private client: HttpClient) {
    super(client, 'role');
  }

  getRoles(isAdmin: boolean) {
    let apiUrl;
    if (isAdmin) {
      return super.getAll();
    } else {
      apiUrl = this.appSettings.API_CONTEXT + this.appSettings.ENDPOINTS.role.endpoint + '/' + this.appSettings.ENDPOINTS.role.path.merchant;
      return super.getByCustomUrl(apiUrl);
    }
  }
}
