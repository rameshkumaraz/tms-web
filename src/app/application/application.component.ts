import { Component, OnInit } from '@angular/core';
import { faPlus, faBars, faTh} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent implements OnInit {

  faPlus = faPlus;
  faBars = faBars;
  faTh = faTh;

  pageHeader: string;
  page = 1;
  pageSize = 5;

  mode = 1;

  applicationCount = 0;
  applications: Array<any>;

  constructor() { }

  ngOnInit(): void {
    this.pageHeader = 'Applications';
  }

  changeView() {
    this.mode = this.mode === 1 ? 2 : 1;
  }

  editApplication(){
    // this.router.navigate(['/merchantForm']);
  }

}
