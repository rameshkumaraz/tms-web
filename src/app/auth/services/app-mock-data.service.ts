import { Injectable } from '@angular/core';
import { User } from '../../model/user';
import mockData from '../../../assets/config/mock-data.json';

@Injectable()
export class AppMockDataService {

  constructor() {
    this.load();
  }

  load() {
    localStorage.setItem('users', JSON.stringify(mockData.users));
    localStorage.setItem('configs', JSON.stringify(mockData.configs));
    localStorage.setItem('merchants', JSON.stringify(mockData.merchants));
  }

  getUsers(){
    return JSON.parse(localStorage.getItem('users'));
  }

  getConfigs(){
    return JSON.parse(localStorage.getItem('configs'));
  }

  getMerchants(){
    return JSON.parse(localStorage.getItem('merchants'));
  }
}
