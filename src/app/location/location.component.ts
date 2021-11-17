import { Component, OnInit } from '@angular/core';
import { faPlus, faBars, faTh} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {

  faPlus = faPlus;
  faBars = faBars;
  faTh = faTh;

  pageHeader: string;
  page = 1;
  pageSize = 5;

  mode = 1;

  locationCount = 0;
  locations: Array<any>;

  constructor() { }

  ngOnInit(): void {
    this.pageHeader = 'Location';
  }

  changeView() {
    this.mode = this.mode === 1 ? 2 : 1;
  }

  editLocation(){
    // this.router.navigate(['/merchantForm']);
  }

}
