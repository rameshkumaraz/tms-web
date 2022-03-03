import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-user-inactive',
  templateUrl: './user-inactive.component.html',
  styleUrls: ['./user-inactive.component.scss']
})
export class UserInactiveComponent implements OnInit {

  @Output() action = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  login(){
    this.action.emit('login');
  }

}
