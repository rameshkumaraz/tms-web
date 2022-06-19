import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import menuAccess from '../../assets/config/menu-access.json';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(private router: Router,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.resetMenuAccess();
    this.spinner.hide();
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
