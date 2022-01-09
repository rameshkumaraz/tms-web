import { Component, OnInit } from '@angular/core';
import { SidebarService } from './sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  menus = [];
  toggled = true;
  constructor(public sidebarservice: SidebarService) {
    this.menus = sidebarservice.getMenuList();
   }

  ngOnInit() {
  }

  getSideBarState() {
    return this.sidebarservice.getSidebarState();
  }

  toggleSidebar() {
    this.toggled = !this.sidebarservice.getSidebarState();
    this.sidebarservice.setSidebarState(!this.sidebarservice.getSidebarState());
  }

  // toggle(currentMenu) {
  //   if (currentMenu.type === 'dropdown') {
  //     this.menus.forEach(element => {
  //       if (element === currentMenu) {
  //         currentMenu.active = !currentMenu.active;
  //       } else {
  //         element.active = false;
  //       }
  //     });
  //   }
  // }

  // getState(currentMenu) {

  //   if (currentMenu.active) {
  //     return 'down';
  //   } else {
  //     return 'up';
  //   }
  // }

  hasBackgroundImage() {
    return this.sidebarservice.hasBackgroundImage;
  }

}
