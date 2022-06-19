import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/shared/core/base.component';
import { Setting } from 'src/app/model/setting';
import { ActionEnum } from 'src/app/shared/enum/action.enum';


@Component({
  selector: 'app-msettings',
  templateUrl: './msettings.component.html',
  styleUrls: ['./msettings.component.scss']
})
export class MerchantSettingsComponent extends BaseComponent {

  pageHeader = 'Settings';

  actionType;

  settings: Array<Setting> = [];

  configItem: Setting;

  constructor(
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) {
    super();
  }

  ngOnInit(): void {

    this.pageHeader = 'Settings';

    this.loadActionAccess(this.componentEnum.role.toString());
  }

  onPageLoad() {
    throw new Error('Method not implemented.');
  }

  filterConfigItem(id: number){
    return this.settings.find(r => r.id == id);
  }

  create(content: any) {
    this.actionType = this.actionEnum.add;
    this.openModal(content, 'md', 'Config Form');
  }

  view(id: number, content: any) {
    throw new Error('Method not implemented.');
  }

  edit(id: number, content: any) {
    this.actionType = ActionEnum.edit;
    this.configItem = this.filterConfigItem(id)
    this.openModal(content, 'md', 'Config Form');
  }
  delete(id: number) {
    throw new Error('Method not implemented.');
  }

  updateStatus(id: number, status: number) {
    throw new Error('Method not implemented.');
  }

}
