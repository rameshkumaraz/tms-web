import { Component, OnInit, Input } from '@angular/core';
import { Merchant } from '../model/merchant';
import { faEllipsisH, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-merchant-card',
  templateUrl: './merchant-card.component.html',
  styleUrls: ['./merchant-card.component.scss']
})
export class MerchantCardComponent implements OnInit {

  @Input() merchants: Array<Merchant>;

  faEllipsisH = faEllipsisH;
  faEye = faEye;
  faEyeSlash = faEyeSlash;

  aIcon = faEyeSlash;
  lIcon = faEyeSlash;

  selectedMerchant: Merchant;

  constructor() { }

  ngOnInit(): void {
  }

  onToggleAeccessIcon(id: number){
    // this.selectedMerchant = this.merchants.filter(x => x.id === id);
    this.aIcon = this.aIcon === faEyeSlash ? faEye : faEyeSlash;
  }

  onToggleLoginIcon(id: number){
    this.lIcon = this.lIcon === faEyeSlash ? faEye : faEyeSlash;
  }

}
