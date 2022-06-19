import { Component, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApplicationService } from 'src/app/application/application.service';
import { DeviceService } from 'src/app/device/device.service';
import { LocationService } from 'src/app/location/location.service';
import { BaseFormComponent } from 'src/app/shared/core/base-form.component';
import { ApiResponse } from 'src/app/shared/model/api.response';
import { AppParamService } from '../app-param.service';
import { currencies } from '../../shared/model/currency-data-store'
import { Parameter } from 'src/app/model/parameter';

@Component({
  selector: 'app-app-param-import',
  templateUrl: './app-param-import.component.html',
  styleUrls: ['./app-param-import.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppParamImportComponent extends BaseFormComponent {

  @Input() merchant: any;

  faTimes = faTimes;
  faCheck = faCheck;

  pageHeader = 'Import Configuration';

  formSubmitted = false;

  formConfig: any;
  steps = [];
  inputValues: any;

  currencies: any = currencies;

  filteredDevices: Array<any>;
  filteredLocations: Array<any>;

  selectedDevices = [];
  selectedLocations = [];

  devicesToDisplay = '';
  locationsToDisplay = '';

  importForm: FormGroup;

  apps: Array<any>;
  devices: Array<any>;
  locs: Array<any>;

  app: any;

  importedContent: any;

  confirmEnabled = false;

  constructor(private formBuilder: FormBuilder,
    private paramService: AppParamService,
    private aService: ApplicationService,
    private deviceService: DeviceService,
    private locService: LocationService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) {
    super();
  };

  ngOnInit(): void {

    this.importForm = this.formBuilder.group({
      configFile: [''],
      configFileName: ['', Validators.required],
      app: ['', Validators.required],
      targetType: ['1', [Validators.required]]
    });

    this.onPageLoad();
  }

  onPageLoad() {
    this.loadApps();
  }

  get f() { return this.importForm['controls'] }

  loadApps() {
    this.spinner.show();
    this.aService.getByMerchant(this.merchant.id).subscribe((resp: ApiResponse) => {
      this.apps = resp.message;
      this.spinner.hide();
    },
      err => {
        console.log('Unable to load applications, please contact adminstrator', err);
        this.toastr.error('Unable to load applications, please contact adminstrator', "Parameter Configuration");
        this.spinner.hide();
      });
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

  changeTarget(e) {
    this.selectedDevices = [];
    this.selectedLocations = [];
    if (e.target.value == 2) {
      this.loadLocations();
    } else if (e.target.value == 3) {
      this.loadDevices();
    }
  }

  populateFormValues() {
    this.inputValues = {};
    if (this.importedContent) {
      this.formConfig = JSON.parse(this.importedContent)[0];
      this.formConfig.steps.forEach(function (step, i) {
        this.steps.push(
          {
            "step_idx": i,
            "step_name": step.display_name,
            "form_name": step.name,
            "fields": step.fields
          });

        step.fields.rows.forEach(row => {
          row.cols.forEach(control => {
            this.inputValues[control.name] = control.val;
          });
        });
      }, this);

      // console.log('Steps....', this.steps);
      // console.log('Input values....', this.inputValues);
      this.confirmEnabled = true;

      this.populateLocationsToDisplay();
      this.populateDivcesToDisplay();
    }
  }

  // changeApp(id: number) {
  //   this.inputValues = {};
  //   this.confirmEnabled = false;
  //   this.app = this.filterApp(id);
  //   //console.log('Template', this.app.template);
  //   this.steps = [];

  //   if (this.app.template) {

  //     this.formConfig = JSON.parse(this.app.template)[0];
  //     this.formConfig.steps.forEach(function (step, i) {
  //       // console.log('Steps:', this.steps);
  //       this.steps.push(
  //         {
  //           "step_idx": i,
  //           "step_name": step.display_name,
  //           "form_name": step.name,
  //           "fields": step.fields
  //         });

  //         step.fields.rows.forEach(row => {
  //           row.cols.forEach(control => {
  //             this.inputValues[control.name] = control.val;
  //           });
  //         });  
  //     }, this);

  //     // console.log('Steps....', this.steps);
  //     console.log('Input values....', this.inputValues);
  //     this.confirmEnabled = true;
  //   }
  // }

  filterApp(id: number) {
    return this.apps.find(m => m.id == id);
  }

  filterDevice(id: number) {
    return this.devices.find(d => d.id == id);
  }

  filterLocation(id: number) {
    return this.locs.find(l => l.id == id);
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

  onFileChange(event) {
    console.log('FileChangeEventTriggered');
    this.spinner.show();
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.importForm.patchValue({
        configFile: file,
        configFileName: file.name
      });

      const fileReader = new FileReader();
      fileReader.readAsText(file, "UTF-8");
      fileReader.onload = () => {
        this.importedContent = fileReader.result;
        var obj = JSON.parse(this.importedContent);

        // if(obj.hasOwnProperty('terminal_id')) {
        var pretty = JSON.stringify(obj, undefined, 4);
        this.importedContent = pretty;
        // } else {
        //   this.toastr.error('Property terminal_id is missing on the template', 'Import Template');
        //   this.templateContent = "";
        // }

        this.spinner.hide();
      }
      fileReader.onerror = (error) => {
        console.log(error);
        this.spinner.hide();
      }
    }
  }

  import() {
    let parameter: Parameter = this.importForm.value;
    let params = {};
    if (this.importedContent) {
      this.formConfig = JSON.parse(this.importedContent)[0];
      this.formConfig.steps.forEach(function (step, i) {
        params[step.display_name] = {};

        step.fields.rows.forEach(row => {
          row.cols.forEach(control => {
            // this.inputValues[control.name] = control.val;
            params[step.display_name][control.name] = control.val;
          });
        });
      }, this);

      parameter.locations = this.selectedLocations;
      parameter.devices = this.selectedDevices;
      parameter.merchant = this.merchant.id;
      parameter.params = JSON.stringify(params);

      console.log('Parameter....', parameter);
      this.paramService.create(parameter).subscribe((resp: ApiResponse) => {
        this.toastr.success("Parameter configuration has been imported successfully.", "Parameter Configuration");
        this.close(true);
        this.spinner.hide();
      },
        err => {
          console.log('Unable to import parameter configuration, please contact adminstrator', err);
          this.toastr.error('Unable to import parameter onfiguration, please contact adminstrator', "Parameter Configuration");
          this.spinner.hide();
        });
    }
  }

}
