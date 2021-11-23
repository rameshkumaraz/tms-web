import { Component, OnInit } from '@angular/core';
import { faPlus, faBars, faTh} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.scss']
})
export class DeviceComponent implements OnInit {

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
    this.pageHeader = 'Devices';
  }

  changeView() {
    this.mode = this.mode === 1 ? 2 : 1;
  }

  editDevice(){
    // this.router.navigate(['/merchantForm']);
  }

}
