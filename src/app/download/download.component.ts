import { Component, OnInit } from '@angular/core';
import { faPlus, faBars, faTh} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})
export class DownloadComponent implements OnInit {

  faPlus = faPlus;
  faBars = faBars;
  faTh = faTh;

  pageHeader: string;
  page = 1;
  pageSize = 5;

  mode = 1;

  downloadCount = 0;
  downloads: Array<any>;

  constructor() { }

  ngOnInit(): void {
    this.pageHeader = 'Downloads';
  }

  changeView() {
    this.mode = this.mode === 1 ? 2 : 1;
  }

  editDownload(){
    // this.router.navigate(['/merchantForm']);
  }

}
