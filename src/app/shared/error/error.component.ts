import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { NgxSpinnerService } from 'ngx-spinner';
import menuAccess from '../../../assets/config/menu-access.json';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  @Input() showHeader: boolean;

  faTimesCircle = faTimesCircle;

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
