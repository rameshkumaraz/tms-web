import { Injectable } from '@angular/core';
import menuMapping from '../../../assets/config/menu-mapping.json';
import menuAccess from '../../../assets/config/menu-access.json';
import { RolesEnum } from 'src/app/auth/guards/roles.enum';
import { AuthenticationService } from 'src/app/auth/services';
import { AppService } from '../service/app.service';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  mSub: Subscription;

  merchant;

  menuAccessSource = {};

  constructor(private authService: AuthenticationService,
    private appService: AppService) { }

  configureMenu(){
    this.mSub = this.appService.userMerchant.subscribe(data => {
      // console.log("Merchant data.....", data);
      if (Object.keys(data).length > 0) {
        this.merchant = data;
        this.loadMenuAccess('merchant-menu');
      } else {
        this.merchant = null;
        this.loadMenuAccess('admin-menu');
      }
    });
  }

  loadMenuAccess(menuType: string) {
    console.log('Load menu access......');
    let mpSource = menuMapping[menuType];
    let up = this.authService.getCurrentUser().policies;
    let user = this.authService.getCurrentUser();
    Object.keys(menuAccess).forEach(function (key) {
      // console.log(key + ' : ' + menuAccess[key]);
      let matching;
      let i = 0

      do {
        let mp = mpSource['level-' + (i + 1)][key];
        // console.log('Action items for ', menu +' : '+mp); 

        if (mp) {
          if (user.roleName == RolesEnum.AZ_ROOT_ADMIN)
            matching = {};
          else
            matching = mp.filter(item => up.indexOf(item) >= 0);
          break;
        }
        i = i + 1;
      } while (i < 2)

      if (matching)
        menuAccess[key] = true;
      else
        menuAccess[key] = false;
      console.log(key + ' : ' + menuAccess[key]);
    });

  }

  hasMenuAccess(menu: any) {
    console.log("Has Menu Access.....", menu+' : '+menuAccess[menu]);
    return menuAccess[menu];
  }
}
