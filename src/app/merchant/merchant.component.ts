import { Component, OnInit } from '@angular/core';
import { faPlus, faBars, faTh, faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';
import { MerchantService } from './merchant.service';
import { MerchantView } from '../model/view/merchantView';

@Component({
  selector: 'app-merchant',
  templateUrl: './merchant.component.html',
  styleUrls: ['./merchant.component.scss']
})
export class MerchantComponent implements OnInit {

  faPlus = faPlus;
  faBars = faBars;
  faTh = faTh;
  faEye = faEye;
  faEyeSlash = faEyeSlash;

  pageHeader: string;
  page = 1;
  pageSize = 5;

  mode = 1;

  merchants: Array<MerchantView>;

  merchantView: MerchantView;

  constructor(private merchantService: MerchantService) { }

  ngOnInit(): void {
    this.pageHeader = 'Merchant';
    this.merchants = new Array<MerchantView>();
    for (const merchant of this.merchantService.getMerchants()) {
      this.merchantView = new MerchantView();
      this.merchantView.aPinStatus = false;
      this.merchantView.lPinStatus = false;
      this.merchantView.merchant = merchant;
      this.merchants.push(this.merchantView);
    }
    // this.merchants = this.merchantService.getMerchants();
  }

  changeView(){
    this.mode = this.mode === 1 ? 2 : 1;
  }

  onToggleAeccessIcon(id: number){
    // this.selectedMerchant = this.merchants.filter(x => x.id === id);
    //this.aIcon = this.aIcon === faEyeSlash ? faEye : faEyeSlash;
  }

  onToggleLoginIcon(id: number){
    //this.lIcon = this.lIcon === faEyeSlash ? faEye : faEyeSlash;
  }
}
