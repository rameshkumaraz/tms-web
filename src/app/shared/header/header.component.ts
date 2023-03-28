import { Component, Input, OnInit } from '@angular/core';
import { faUser, faEye, faSignInAlt, faSignOutAlt, faHome, faChartArea,faUserCog, faIndustry, faMobileAlt, faMapMarkerAlt, faTachometerAlt, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/auth/services/authentication.service';
import { PolicyEnum } from '../enum/policy.enum';
import menuMapping from '../../../assets/config/menu-mapping.json';
import menuAccess from '../../../assets/config/menu-access.json';
import { Subscription } from 'rxjs';
import { AppService } from '../service/app.service';
import { HeaderService } from './header.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RolesEnum } from 'src/app/auth/guards/roles.enum';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() opened: string;

  profile: any;

  faUser = faUser;
  faEye = faEye;
  faSignIn = faSignInAlt;
  faSignOut = faSignOutAlt;
  faHome = faHome;
  faUserCog = faUserCog;
  faMap = faMapMarkerAlt;
  faReport = faChartArea;
  faMobile = faMobileAlt;
  faMerchant = faIndustry;
  faDashboard = faTachometerAlt;
  faUserCircle = faUserCircle;

  passForm: FormGroup;

  mSub: Subscription;

  merchant;

  // hasDbAccess = false;
  // hasMDbAccess = false;
  // hasMerchantAccess = false;
  // hasLocationAccess = false;
  // hasDeviceAccess = false;
  // hasReportAccess = false;
  // hasAdminAccess = false;
  // hasMReportAccess = false;
  // hasRoleAccess = false;
  // hasDeviceBrandAccess = false;
  // hasDeviceModelAccess = false;

  constructor(config: NgbModalConfig, private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private headerService: HeaderService,
    private authService: AuthenticationService,
    private appService: AppService,
    private router: Router) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    this.profile = this.authService.getCurrentUser();

    this.mSub = this.appService.userMerchant.subscribe(data => {
      // console.log("Merchant data.....", data);
      if (Object.keys(data).length > 0) {
        this.merchant = data;
        this.loadMenuAccess('merchant-menu');
      } else {
        this.merchant = null;
        if(this.profile)
          this.loadMenuAccess('admin-menu');
      }
    });
  }

  // ngAfterViewInit(): void {
  //   if(this.merchant)
  //     this.loadMenuAccess('merchant-menu');
  //   else 
  //     this.loadMenuAccess('admin-menu');
  // }

  loadMenuAccess(menuType: string) {
    //console.log('Load menu access......', menuType);
    let mpSource = menuMapping[menuType];
    let up = this.authService.getCurrentUserPolicies();
    let user = this.authService.getCurrentUser();
    //console.log('Load menu access......', up);
    Object.keys(menuAccess).forEach(function (key) {
      //console.log('Load menu access '+ key + ' : ' + menuAccess[key]);
      let matching;
      let i = 0

      do {
        let mp = mpSource['level-' + (i + 1)][key];
        // console.log('Action items for ', key +' : '+mp); 
        if (mp) {
          // if (user.roleName == RolesEnum.AZ_ROOT_ADMIN)
          //   matching = {};
          // else
          //mp.forEach(i => {
            //console.log('Matching check....'+i+" : "+JSON.stringify(up));
            //console.log('Matching check....'+i+" : "+up.indexOf(i));
            //console.log('Matching check....'+i+" : "+up.find(p => p.policyName.indexOf(i) >= 0));
          //});
          if (user.roleName == RolesEnum.AZ_ROOT_ADMIN)
            matching = 'ALL';
          else
            matching = mp.filter(item => up.indexOf(item) >= 0);
          break;
        }
        i = i + 1;
      } while (i < 2)

      //console.log("Matching......."+key+" : "+matching);

      if (matching && matching.length > 0)
        menuAccess[key] = true;
      else
        menuAccess[key] = false;
      //console.log(key + ' : ' + menuAccess[key]);
    });
    console.log('Menu Access......', menuAccess);
  }

  // populateAccess() {
  //   // console.log('Role...', this.profile.roleName);
  //   // console.log('Role...', ["AZ_ROOT_ADMIN", "AZ_ADMIN"].indexOf(this.profile.roleName));
  //   if (["AZ_ROOT_ADMIN", "AZ_ADMIN"].indexOf(this.profile.roleName) >= 0) {
  //     this.hasDbAccess = true;
  //     this.hasMerchantAccess = true;
  //     this.hasMReportAccess = true;
  //     this.hasReportAccess = true;
  //     this.hasRoleAccess = true;
  //     this.hasDeviceBrandAccess = true;
  //     this.hasDeviceModelAccess = true;
  //   }
  //   if (["AZ_ROOT_ADMIN", "MERCHANT_ADMIN"].indexOf(this.profile.roleName) >= 0) {
  //     this.hasMDbAccess = true;
  //     this.hasAdminAccess = true;
  //     this.hasReportAccess = true;
  //   }

  //   if (["AZ_ROOT_ADMIN", "MERCHANT_ADMIN", "MERCHANT_SUPERVISOR", "MERCHANT_USER"].indexOf(this.profile.roleName) >= 0) {
  //     this.hasLocationAccess = true;
  //     this.hasDeviceAccess = true;
  //   }
  // }

  // hasAccess(policy: any) {
  //   return this.authService.hasAccess(policy);
  // }

  enableMenuforAdmin() {

  }

  enableMenuforMerchant() {

  }

  hasMenuAccess(menu: any) {
    // console.log("Has Menu Access.....", menu+' : '+menuAccess[menu]);
    if(menu === 'mdb' && this.merchant){
      if (this.authService.getCurrentUser().roleName.indexOf('AZ_') === 0)
        return true;
      else 
        return false;
    }
    return menuAccess[menu];
    // // if (this.authService.getCurrentUser().roleName == RolesEnum.AZ_ROOT_ADMIN)
    // //   return true;

    // let matching;

    // let up = this.authService.getCurrentUser().policies;
    // // console.log("User Policies...", up);
    // // let mp = menuMapping['level-1'][menu];
    // // console.log("Level 1 menu policy for the menu item...", mp);
    // // if(mp)
    // //   matching = mp.filter(item => up.indexOf(item) >= 0);
    // // else {
    // //   mp = menuMapping['level-2'][menu];
    // //   matching = mp.filter(item => up.indexOf(item) >= 0);
    // // }  

    // let mpSource: any;

    // if (this.merchant) {
    //   mpSource = menuMapping['merchant-menu'];
    //   // console.log('Merchant Menu mapping....', mpSource);  
    // } else {
    //   mpSource = menuMapping['admin-menu'];
    //   // console.log('Admin Menu mapping....', mpSource);  
    // }

    // // console.log('Merchant....', this.merchant);

    // let i = 0

    // do {
    //   let mp = mpSource['level-' + (i + 1)][menu];
    //   // console.log('Action items for ', menu +' : '+mp); 

    //   if (mp) {
    //     if (this.authService.getCurrentUser().roleName == RolesEnum.AZ_ROOT_ADMIN)
    //       matching = {};
    //     else
    //       matching = mp.filter(item => up.indexOf(item) >= 0);
    //     break;
    //   }
    //   i = i + 1;
    // } while (i < 2)

    // if (matching)
    //   return true;
    // return false;
  }

  isAdmin(){
    if(this.authService.isAuthorized())
      return this.authService.isAdmin();
    else
      return false;  
  }

  // hasSubMenuAccess(menu: any) {
  //   return this.authService.hasAccess(menu);
  // }

  showDashboard() {
    console.log(this.authService.getRole() + ":" + this.authService.getRole().indexOf('AZ_'));
    if (this.authService.getRole().indexOf('AZ_') === 0)
      this.router.navigate(['/db']);
    else
      this.router.navigate(['/mdb']);
  }

  openModal(content, size?) {
    if(size)
      this.modalService.open(content, { size: size });
    else
      this.modalService.open(content, { size: 'md' });
  }

  openLoginModal(content) {
    this.modalService.open(content, { size: 'sm' });
  }

  // closeModal(content, type) {
  //   console.log('closeModel invoked', content);
  //   this.modalService.dismissAll();
  // }

  closeModal() {
    console.log('closeModel invoked');
    this.modalService.dismissAll();
  }

  closePasswordModal() {
    this.modalService.dismissAll();
    this.confirmLogout();
  }

  logout(content) {
    this.modalService.open(content, { size: 'md' });
    // this.authService.logout();
    // this.profile = null;
    // this.router.navigate(['/login']);
  }

  cancelLogout() {
    this.modalService.dismissAll();
  }

  confirmLogout() {
    this.authService.logout();
    this.profile = null;
    this.router.navigate(['/login']);
  }

  public get policyEnum(): typeof PolicyEnum {
    return PolicyEnum;
  }
}
