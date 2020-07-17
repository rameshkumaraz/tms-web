import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { faPlus, faBars, faTh} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent implements OnInit {

  faPlus = faPlus;
  faBars = faBars;
  faTh = faTh;

  @Input() headerText: string;

  constructor() { }

  ngOnInit(): void {
  }
}
