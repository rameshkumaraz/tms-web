import { ConsoleLogger } from '@angular/compiler-cli/private/localize';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, fromEvent } from 'rxjs';
import { debounceTime, first } from 'rxjs/operators';
import { DeviceBrandService } from '../device-brand/device-brand.service';
import { DeviceModel } from '../model/device-model';
import { BaseComponent } from '../shared/core/base.component';
import { ActionEnum } from '../shared/enum/action.enum';
import { ApiResponse } from '../shared/model/api.response';
import { DeviceModelService } from './device-model.service';

@Component({
  selector: 'app-device-model',
  templateUrl: './device-model.component.html',
  styleUrls: ['./device-model.component.scss']
})
export class DeviceModelComponent extends BaseComponent {

  @ViewChild("name") name: ElementRef;

  pageHeader: string;
  page = 1;
  pageSize = 10;

  brands: Array<any>;

  modelCount = 0;
  models: Array<any>;

  model: DeviceModel;

  actionType;

  closeResult: string;

  constructor(

    private service: DeviceModelService,
    private dbService: DeviceBrandService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) {
    super();
  }

  ngOnInit(): void {
    this.pageHeader = 'Device Model';

    super.ngOnInit();

    this.loadActionAccess(this.componentEnum.deviceModel.toString());

    this.searchForm = this.formBuilder.group({
      name: [''],
      brand: [''],
      status: ['']
    });

    this.onPageLoad();
  }

  ngAfterViewInit(): void {
    fromEvent(this.name.nativeElement, 'keyup').pipe(debounceTime(this.debounceTime)).subscribe(data => {
      this.searchModels('name');
    });
  }

  onPageLoad() {

    this.spinner.show();
    forkJoin([
      this.service.getAll(),
      this.dbService.getAll(),
    ]).subscribe(([resp1, resp2]) => {
      let models = resp1 as any;
      let brands = resp2 as any;
      this.models = models.message;
      this.brands = brands.message;

      this.modelCount = this.models.length;

      console.log('Device Model Response....', this.models)

      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });


    // this.spinner.show();
    // this.service.getAll()
    //   .pipe(first())
    //   .subscribe(
    //     (resp: ApiResponse) => {
    //       console.log('Device Model Response', resp);
    //       this.models = resp.message;
    //       this.modelCount = this.models.length;
    //       this.spinner.hide();
    //     },
    //     error => {
    //       console.log('Device Model Response', error);
    //       this.spinner.hide();
    //     });

    // this.dbService.getAll()   
    //   .pipe(first())
    //   .subscribe(
    //     (resp: ApiResponse) => {
    //       console.log('Device Brand Response', resp);
    //       this.brands = resp.message;
    //       this.spinner.hide();
    //     },
    //     error => {
    //       console.log('Device Model Response', error);
    //       this.spinner.hide();
    //     }); 
  }

  get f() { return this.searchForm['controls'] }

  create(content: any) {
    this.actionType = ActionEnum.add;
    this.openModal(content, 'md', 'Device Model');
  }

  view(id: number, content: any) {
    this.actionType = ActionEnum.view;
    this.model = this.filterModel(id);
    this.openModal(content, 'md', 'Device Model');
  }

  edit(id: number, content: any) {
    this.actionType = ActionEnum.edit;
    this.model = this.filterModel(id);
    this.openModal(content, 'md', 'Device Model');
  }

  filterModel(id: number) {
    return this.models.find(m => m.id == id);
  }

  searchModels(type: string) {

    if (this.inFilterMode) {
      return;
    }

    console.log('Target Id....', type);
    if (type == 'name' && this.f.name.value.length < 3) {
      return;
    }
    this.spinner.show();
    if (type == 'name') {
      this.f.brand.setValue('');
      this.f.status.setValue('');
    } else if (type == 'brand') {
      this.f.name.setValue('');
      this.f.status.setValue('');
    } else if (type == 'status') {
      this.f.name.setValue('');
      this.f.brand.setValue('');
    }

    let filter = this.searchForm.value;
    if (this.f.name.value || this.f.brand.value || this.f.status.value) {
      this.service.searchModels(filter).pipe(first())
        .subscribe(
          (resp: ApiResponse) => {
            console.log('Filtered Merchant Response', resp);
            this.models = resp.message;
            this.modelCount = this.models.length;
            this.inFilterMode = true;
            this.spinner.hide();
          },
          error => {
            this.spinner.hide();
          });
    }
  }

  clearSearchResult() {
    this.searchForm.reset();
    this.f.brand.setValue("");
    this.f.status.setValue("");
    this.inFilterMode = false;
    this.onPageLoad();
  }

  delete(id: number) {
    this.spinner.show();
    this.service.delete(id).subscribe(data => {
      console.log('Model has been deleted successfully');
      this.toastr.success('Model has been deleted successfully', 'Device Model');
      this.onPageLoad();
      this.spinner.hide();
    },
      err => {
        console.log('Device model delete error....', err);
        this.toastr.error('Unable to delete model, please contact adminstrator', 'Device Model');
        this.spinner.hide();
      });
  }

  updateStatus(id: number, status: number) {
    this.spinner.show();
    let dmodel = Object.assign({}, this.filterModel(id));
    dmodel.status = status;
    this.service.updateStatus(id, dmodel).subscribe(data => {
      console.log('Model status has been updated successfully', data);
      this.toastr.success('Model status has been updated successfully', 'Device Model');
      this.onPageLoad();
      this.spinner.hide();
    },
      err => {
        console.log('Unable to update model status....', err);
        this.toastr.error('Unable to update model status, please contact adminstrator', 'Device Model');
        this.spinner.hide();
      });
  }

}