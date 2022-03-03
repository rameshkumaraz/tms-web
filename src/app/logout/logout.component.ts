import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import menuAccess from '../../assets/config/menu-access.json';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.resetMenuAccess();
  }

  resetMenuAccess(){
    Object.keys(menuAccess).forEach(function (key) {
      menuAccess[key] = false;
    });
  }

  login(){
    this.router.navigate(['/login']);
  }

}
