import { Component, Input, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { currencies } from '../../shared/model/currency-data-store'
import { BaseComponent } from '../../shared/core/base.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiResponse } from '../../shared/model/api.response';
import { ApplicationService } from 'src/app/application/application.service';
import { AppService } from 'src/app/shared/service/app.service';
import { DeviceService } from 'src/app/device/device.service';
import { TargetType } from 'src/app/shared/enum/target-type.enum';
import { LocationService } from 'src/app/location/location.service';
import { Parameter } from 'src/app/model/parameter';
import { ActionEnum } from 'src/app/shared/enum/action.enum';
import { AppParamService } from 'src/app/app-param/app-param.service';

@Component({
  selector: 'app-app-param-form',
  templateUrl: './app-param-form.component.html',
  styleUrls: ['./app-param-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppParamFormComponent extends BaseComponent {

  // @Input() formTitle: string;
  // @Input() formConfig: any;
  @Input() merchant: any;
  @Input() selectedParam: any;
  // @Input() service: any;
  @Input() actionType;

  pageHeader = 'New Configuration';

  currencies: any = currencies;

  //merchant: any;

  faTimes = faTimes;
  faCheck = faCheck;

  formConfig: any;

  formGroup: FormGroup;
  submitted = false;
  isFailed = false;
  errMsg: string;

  steps = [];
  formGroups = [];
  formType = "simple";

  form: FormGroup;

  appForm: FormGroup;

  apps: Array<any>;
  appsCount: number;
  app: any;

  devices: Array<any>;
  deviceCount: number;

  locs: Array<any>;
  locsCount: number;

  filteredDevices: Array<any>;
  filteredLocations: Array<any>;

  selectedDevices = [];
  selectedLocations = [];

  devicesToDisplay = '';
  locationsToDisplay = '';

  formSubmitted = false;

  isFormValid = false;

  dynamicFormValue = {};

  paramConfig = {};

  phoneRegEx = /^\+(?:[0-9] ?){6,14}[0-9]$/;
  ipRegEx = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;

  constructor(private formBuilder: FormBuilder,
    private paramService: AppParamService,
    private aService: ApplicationService,
    private appService: AppService,
    private deviceService: DeviceService,
    private locService: LocationService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) {
    super();
  }

  ngOnInit(): void {

    this.appForm = this.formBuilder.group({
      app: ['', [Validators.required]],
      targetType: ['1', [Validators.required]],
      // devices: ['', [Validators.required]],
      // locations: ['', [Validators.required]],
      // installDate: ['', [Validators.required]]
    });

    // this.mSub = this.appService.userMerchant.subscribe(data => {
    //   this.merchant = data;
    //   this.onPageLoad();
    // });

    this.onPageLoad();

    if (this.actionType != ActionEnum.add) {
      this.appForm.disable();
      this.pageHeader = 'View Configuration';
      this.app = this.selectedParam.app;
      this.populateFormValues();
      this.buildForm();
    }

    if (this.actionType == ActionEnum.edit) {
      // this.appForm.disable();
      // this.app = this.selectedParam.app;
      this.pageHeader = 'Update Configuration';
      // this.buildForm();
    }
  }

  onPageLoad() {
    this.spinner.show();
    this.aService.getByMerchant(this.merchant.id).subscribe((resp: ApiResponse) => {
      this.apps = resp.message;
      this.appsCount = this.apps.length;
      this.spinner.hide();
    },
      err => {
        console.log('Unable to load applications, please contact adminstrator', err);
        this.toastr.error('Unable to load applications, please contact adminstrator', "Parameter Configuration");
        this.spinner.hide();
      });
  }

  populateFormValues(){
    // this.appForm.setValue({
    //   app: this.selectedParam.app.name,
    //   device: this.selectedParam.device.name
    // });
    let params = JSON.parse(this.selectedParam.params);
    console.log('Params to display...', params);
    Object.keys(params).map(k =>{
      this.dynamicFormValue[k] = params[k];
    });
    console.log("Values...", this.dynamicFormValue);
    //this.dynamicFormValue[this.steps[idx].step_name] = this.form.value;
  }

  changeTarget(e) {
    this.selectedDevices = [];
    this.selectedLocations = [];
    if (e.target.value == 2) {
      this.loadLocations();
    } else if (e.target.value == 3) {
      this.loadDevices();
    }
  }

  loadLocations() {
    this.spinner.show();
    this.locService.getByMerchant(this.merchant.id).subscribe((resp: ApiResponse) => {
      this.spinner.hide();
      this.locs = resp.message;
      this.filteredLocations = this.locs;

      this.spinner.hide();
    },
      err => {
        console.log('Unable to load locations, please contact adminstrator', err);
        this.toastr.error('Unable to load locations, please contact adminstrator', "Parameter Configuration");
        this.spinner.hide();
      });
  }

  loadDevices() {
    this.spinner.show();
    this.deviceService.findByMerchant(this.merchant.id).subscribe((resp: ApiResponse) => {
      this.spinner.hide();
      this.devices = resp.message;
      this.filteredDevices = this.devices;
      this.spinner.hide();
    },
      err => {
        console.log('Unable to load devices, please contact adminstrator', err);
        // this.errMsg = err.message;
        this.toastr.error('Unable to load devices, please contact adminstrator', "Parameter Configuration");
        this.spinner.hide();
      });
  }

  changeApp(id: number) {
    this.app = this.filterApp(id);
    console.log('Template', this.app.template);
    this.formGroups = [];
    this.steps = [];
    this.buildForm();
  }

  buildForm(){

    if (this.app.template) {

      this.formConfig = JSON.parse(this.app.template)[0];
      // console.log('Template', this.formConfig.type);
      if (this.formConfig.type == "multi-step") {

        this.formType = "multi-step";
        this.formConfig.steps.forEach(function (step, i) {
          const formControls = {};
          this.steps.push(
            {
              "step_idx": i,
              "step_name": step.display_name,
              "form_name": step.name,
              "fields": step.fields
            });

          step.fields.rows.forEach(row => {
            let controls = [];
            row.cols.forEach(control => {
              //console.log('Field name', control.name);

              let formControl = new FormControl('');
              
              if(this.actionType == ActionEnum.edit){
                // console.log(control.name+','+this.dynamicFormValue[step.display_name]+':'+this.dynamicFormValue[step.display_name][control.name]);
                if(this.dynamicFormValue[step.display_name])
                  formControl.setValue(this.dynamicFormValue[step.display_name][control.name]);
              } else if(this.actionType == ActionEnum.add){
                formControl.setValue(control.val);
              }
              if (control.validation) {
                if (control.validation.mandatory)
                  formControl.addValidators(Validators.required);
                if (control.validation.min)
                  formControl.addValidators(Validators.minLength(control.validation.min));
                if (control.validation.max)
                  formControl.addValidators(Validators.maxLength(control.validation.max));
                if (control.validation.type == 'email')
                  formControl.addValidators(Validators.email);
                if (control.validation.type == 'mobile' || control.validation.type == 'phone')
                  formControl.addValidators(Validators.pattern(this.phoneRegEx));
                if (control.validation.type == 'ip')
                  formControl.addValidators(Validators.pattern(this.ipRegEx));
              }
              formControls[control.name] = formControl;
            });
          });
          this.formGroups[i] = new FormGroup(formControls);
        }, this)
        console.log("Steps....", this.formGroups);
        this.form = this.formGroups[0];
        console.log("Steps....", this.form);
      } else {

      }
    }
  }

  filterApp(id: number) {
    return this.apps.find(m => m.id == id);
  }

  filterDevice(id: number) {
    return this.devices.find(d => d.id == id);
  }

  filterLocation(id: number) {
    return this.locs.find(l => l.id == id);
  }

  get f() { return this.appForm['controls'] }

  reset() {

  }

  save() {
    this.formSubmitted = true;
    this.spinner.show();
    let parameter: Parameter = this.appForm.value;
    parameter.locations = this.selectedLocations;
    parameter.devices = this.selectedDevices;
    parameter.merchant = this.merchant.id;
    parameter.params = JSON.stringify(this.dynamicFormValue);
    console.log('Param Config ......', JSON.stringify(parameter));

    this.paramService.create(parameter).subscribe((resp: ApiResponse) => {
      this.toastr.success("Parameter configuration has been created successfully.", "Parameter Configuration");
      this.close(true);
      this.spinner.hide();
    },
      err => {
        console.log('Unable to create parameter configuration, please contact adminstrator', err);
        this.errMsg = err.message;
        this.toastr.error('Unable to create parameter onfiguration, please contact adminstrator', "Parameter Configuration");
        this.spinner.hide();
      });
  }

  update() {
    this.formSubmitted = true;
    this.spinner.show();
    let parameter: any = {};
    Object.assign(parameter, this.selectedParam);
    delete parameter.app;
    delete parameter.device;
    delete parameter.locations;
    delete parameter.devices;
    
    // parameter.targetType = "3";
    // parameter.devices = [''+this.selectedParam.device.id];

    parameter.params = JSON.stringify(this.dynamicFormValue);
    parameter.canEdit = !!parameter.canEdit;
    parameter.canView = !!parameter.canEdit;
    // console.log('Param Config ......', JSON.stringify(parameter));

    this.paramService.update(parameter).subscribe((resp: ApiResponse) => {
      this.toastr.success("Parameter configuration has been updated successfully.", "Parameter Configuration");
      this.close(true);
      this.spinner.hide();
    },
      err => {
        console.log('Unable to update parameter configuration, please contact adminstrator', err);
        this.errMsg = err.message;
        this.toastr.error('Unable to update parameter configuration, please contact adminstrator', "Parameter Configuration");
        this.spinner.hide();
      });
  }

  delete() {
    // this.service.delete(this.app.id).subscribe(data => {
    //   this.toastr.success('Application has been deleted successfully', 'Application')
    //   this.close(true);
    // },
    // err => {
    //   console.log('Unable to delete application, please contact administrator.', 'Application');
    //   this.toastr.error('Unable to delete application, please contact administrator.', 'Application');
    // });
  }

  prevTab(idx: number) {
    if (idx >= 0) {
      this.form = this.formGroups[idx - 1];
    }
    console.log("Previous step from.....", this.form);
  }

  nextTab(idx: number) {
    this.dynamicFormValue[this.steps[idx].step_name] = this.form.value;
    // Object.assign(this.paramConfig, this.form.value);
    if (idx < this.formGroups.length - 1) {
      this.form = this.formGroups[idx + 1];
    }
    if (idx === this.formGroups.length - 1) {
      this.populateLocationsToDisplay();
      this.populateDivcesToDisplay();
    }
    // console.log("Next step FormValue.....", this.dynamicFormValue);
    // console.log("Next step paramConfig.....", this.paramConfig);
  }

  getValue(step: string, name: string) {
    if (this.dynamicFormValue[step]) {
      return this.dynamicFormValue[step][name];
    }
    return '';
  }

  searchDevice(event: any) {
    console.log(event.target.value);
    this.filteredDevices = this.devices.filter(device => {
      const term = event.target.value.toLowerCase();
      // console.log('selected....', device.name.toLowerCase().includes(term));
      return device.name.toLowerCase().includes(term);
    });
  }

  searchLocation(event: any) {
    //console.log(event.target.value);
    this.filteredLocations = this.locs.filter(location => {
      const term = event.target.value.toLowerCase();
      // console.log('selected....', location.name.toLowerCase().includes(term));
      return location.name.toLowerCase().includes(term);
    });
  }

  selectDevice(event: any) {
    //console.log(event.target.checked);
    if (event.target.checked)
      this.selectedDevices.push(+event.target.value);
    else {
      const index = this.selectedDevices.indexOf(+event.target.value, 0);
      if (index > -1) {
        this.selectedDevices.splice(index, 1);
      }
    }
    // console.log('Selected devices.....', this.selectedDevices);
  }

  selectLocation(event: any) {
    //console.log(event.target.checked);
    if (event.target.checked)
      this.selectedLocations.push(+event.target.value);
    else {
      const index = this.selectedLocations.indexOf(+event.target.value, 0);
      if (index > -1) {
        this.selectedLocations.splice(index, 1);
      }
    }
    // console.log('Selected locations.....', this.selectedLocations);
  }

  populateLocationsToDisplay() {
    this.locationsToDisplay = '';
    this.selectedLocations.forEach(l => {
      let loc = this.filterLocation(l);
      if (this.locationsToDisplay.length === 0) {
        this.locationsToDisplay = loc.name;
      } else {
        this.locationsToDisplay = this.locationsToDisplay + ", " + loc.name;
      }
    });
    // console.log('Locations to display', this.locationsToDisplay);
  }

  populateDivcesToDisplay() {
    this.devicesToDisplay = '';
    this.selectedDevices.forEach(d => {
      let devc = this.filterDevice(d);
      if (this.devicesToDisplay.length === 0) {
        this.devicesToDisplay = devc.name + " (" + devc.serial + ")";
      } else {
        this.devicesToDisplay = this.devicesToDisplay + ", " + devc.name + " (" + devc.serial + ")";
      }
    });
    // console.log('Devices to display', this.devicesToDisplay);
  }

  // onAdd(event) {
  //   // console.log("Add...", event);
  //   this.selectedDevices.push(event.id);
  //   console.log("Selected...", this.selectedDevices);
  // }

  // onRemove(event) {
  //   console.log("Delete...", event);
  //   const index = this.selectedDevices.indexOf(event.value.id, 0);
  //   if (index > -1) {
  //     this.selectedDevices.splice(index, 1);
  //   }
  //   console.log("Deleted...", this.selectedDevices);
  // }

  public get targetEnum(): typeof TargetType {
    return TargetType;
  }
}
