import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from 'src/app/model/user';

@Injectable({
  providedIn: 'root'
})
export class LoginNotificationService {

  private _loginUser = new Subject<User>();

  constructor() { }

  notifiy(event) {
    this._loginUser.next(event);
  }

  get events$() {
    return this._loginUser.asObservable();
  }
}
