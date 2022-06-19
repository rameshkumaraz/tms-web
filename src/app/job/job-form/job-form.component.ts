import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { distinctUntilChanged } from 'rxjs/operators';
import { LibraryService } from 'src/app/library/library.service';
import { ActionEnum } from 'src/app/shared/enum/action.enum';
import { JobsEnum } from 'src/app/shared/enum/jobs.enum';
import { TriggerType } from 'src/app/shared/enum/trigger-type.enum';
import { TargetType } from 'src/app/shared/enum/target-type.enum';
import { JobService } from '../job.service';
import { Job } from '../../model/jobs';
import { ApiResponse } from 'src/app/shared/model/api.response';
import { Merchant } from 'src/app/model/merchant';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { ApplicationService } from 'src/app/application/application.service';
import { DatePipe } from '@angular/common';
import { LocationService } from 'src/app/location/location.service';
import { DeviceService } from 'src/app/device/device.service';
import { BaseFormComponent } from 'src/app/shared/core/base-form.component';

@Component({
  selector: 'app-job-form',
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.scss'],
  providers: [DatePipe]
})
export class JobFormComponent extends BaseFormComponent {

  @Output() modalClosed = new EventEmitter();

  @Input() actionType;
  @Input() merchant: Merchant;
  @Input() job: any;

  faCalendar = faCalendar;

  dateModel: NgbDateStruct;

  pageHeader = 'New Event';
  page = 1;
  pageSize = 10;

  jobForm: FormGroup;
  formSubmitted = false;
  isFailed = false;

  apps: Array<any>;
  libs: Array<any>;
  locs: Array<any>;
  devices: Array<any>;

  app: any;
  loc: any;

  min: any;
  max: any;

  selectedDvcs = [];
  selectedLocs = [];

  selectedDevices = [];
  selectedLocations = [];

  @ViewChild('location') location;
  @ViewChild('device') device;

  sub;

  constructor(private formBuilder: FormBuilder,
    private service: JobService,
    private appService: ApplicationService,
    private libService: LibraryService,
    private locService: LocationService,
    private deviceService: DeviceService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private datePipe: DatePipe) {
    super();
  }

  ngOnInit(): void {

    this.loadActionAccess(this.componentEnum.event.toString());

    this.jobForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.max(200)]],
      triggerType: ['', [Validators.required]],
      jobType: ['', [Validators.required, Validators.minLength(1)]],
      jobDate: ['', [Validators.required]],
      // jobTime: ['', [Validators.required]],
      desc: [''],
      targetType: ['', [Validators.required]],
      app: [''],
      library: [''],
      // location: [''],
      // device: ['']
    });

    if (this.actionType != ActionEnum.add) {

      if (this.job.jobType == JobsEnum.APP_INSTALL) {
        this.loadApps(1);
      } 

      if (this.job.targetType == 2) {
        this.loadLocations();
      }

      if (this.job.targetType == 3) {
        this.loadDevices();
      }
      this.onPageLoad();
    }

    if (this.actionType == ActionEnum.view) {
      this.jobForm.disable();
      this.pageHeader = 'View Event';
    }

    if (this.actionType == ActionEnum.edit) {
      this.pageHeader = 'Update Event';
      this.jobForm['controls'].name.disable();
      this.jobForm['controls'].brand.disable();
    }

    this.min = this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm');
    let maxDate = new Date();
    // maxDate.setDate(maxDate.getDate() + 30);
    this.max = this.datePipe.transform(maxDate.setMonth(maxDate.getMonth() + 1), 'yyyy-MM-ddTHH:mm');

    console.log(this.min + ":" + this.max);

    this.jobForm.controls['jobDate'].setValue(this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm'));

    this.setDescValidator();
  }

  setDescValidator() {
    this.f.desc.valueChanges.
      pipe(distinctUntilChanged()).
      subscribe(val => {
        // console.log('desc value', val + ':' + val.length);
        if (val.length > 0 && val.length < 5) {
          this.f.desc.setValidators([Validators.minLength(5)]);
          this.f.desc.setValidators([Validators.minLength(250)]);
        } else {
          this.f.desc.clearValidators();
        }
        this.f.desc.updateValueAndValidity();
      });
  };

  onPageLoad() {
    console.log("Job to update...", this.job);
    this.jobForm.setValue({
      name: this.job.name,
      triggerType: this.job.triggerType,
      jobType: this.job.jobType,
      jobDate: this.job.jobDate,
      targetType: this.job.targetType + "",
      // jobTime: this.job.jobTime,
      desc: this.job.desc,
      library: this.job.library ? this.job.library.id : '',
      // location: this.job.location,
      app: this.job.app ? this.job.app.id : '',
      // device: this.job.device
    });
    
  }

  loadApps(libType) {
    this.spinner.show();
    this.appService.getByMerchant(this.merchant.id).subscribe((resp: ApiResponse) => {
      this.spinner.hide();
      this.apps = resp.message;
      this.app = this.apps[0];
      this.f.app.setValue(this.app.id);
      if(libType === 1)
        this.loadLibraries();
      else if(libType === 2)
        this.loadLatestLibrary();  
        
    },
      err => {
        console.log('Unable to load applicationss, please contact adminstrator', err);
        // this.errMsg = err.message;
        this.toastr.error('Unable to load applications, please contact adminstrator', "Event");
        this.spinner.hide();
      });
  }

  loadLibraries() {
    this.spinner.show();
    this.libService.findForApp(this.app.id).subscribe((resp: ApiResponse) => {
      this.spinner.hide();
      this.libs = resp.message;
    },
      err => {
        console.log('Unable to load libraries, please contact adminstrator', err);
        // this.errMsg = err.message;
        this.toastr.error('Unable to load libraries, please contact adminstrator', "Event");
        this.spinner.hide();
      });
  }

  loadLatestLibrary() {
    this.spinner.show();
    this.libService.findLatestForApp(this.app.id).subscribe((resp: ApiResponse) => {
      this.spinner.hide();
      this.libs = resp.message;
      this.f.library.setValue(this.libs[0].id);
    },
      err => {
        console.log('Unable to load latest library, please contact adminstrator', err);
        // this.errMsg = err.message;
        this.toastr.error('Unable to load latest library, please contact adminstrator', "Event");
        this.spinner.hide();
      });
  }

  get f() { return this.jobForm['controls'] }

  filterLocation(id: number){
    return this.locs.find(l => l.id == id);
  }

  filterDevice(id: number){
    return this.devices.find(d => d.id == id);
  }

  changeJob(type: string) {
    if (type == JobsEnum.APP_INSTALL || type == JobsEnum.APP_PARAM_UPDATE) {
      this.loadApps(1);
    } 
  }

  changeApp(id: number) {
    // console.log("Selected app id...", id +':' + JSON.stringify(this.apps));
    this.app = this.apps.find(x => x.id == id);
    this.f.app.setValue(this.app.id);
    // console.log("Selected app...", this.app);
    this.libs = [];
    if (this.f.jobType.value == JobsEnum.APP_INSTALL) {
      this.loadLatestLibrary();
    }
    this.loadLibraries();
  }

  // changeTrigger(value){
  //   console.log("trigger type...", value);
  //   console.log("Date now...", this.datePipe.transform(new Date, 'yyyy-MM-ddTHH:mm'));
  //   if(value == TriggerType.IMMEDIATE){
  //     this.f.jobDate.setValue(this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm'));
  //   } else {
  //     this.f.jobDate.setValue({});
  //   }
  // }

  save() {
    console.log('nextTab');
    this.formSubmitted = true;
    // stop here if form is invalid
    if (this.jobForm.invalid) {
      console.log('From invalid', this.jobForm);
      return;
    }
    this.spinner.show();
    this.job = <Job>this.jobForm.value;
    this.job.merchant = this.merchant.id + "";
    this.job.app = this.job.app + "";
    this.job.library = this.job.library + "";
    this.job.targetType = +this.job.targetType;
    if (this.job.targetType === 2)
      this.job.location = this.selectedLocs;

    if (this.job.targetType === 3)
      this.job.device = this.selectedDvcs;

    console.log("Job....", this.job);  

    this.service.create(this.job).subscribe((resp: ApiResponse) => {
      this.spinner.hide();
      this.toastr.success("Event has been created successfully.", "Event");
      this.close(true);
    },
      err => {
        console.log('Unable to create event, please contact adminstrator', err);
        // this.errMsg = err.message;
        this.toastr.error('Unable to create event, please contact adminstrator', "Event");
        this.spinner.hide();
      });
  }

  update() {
    this.formSubmitted = true;
    // stop here if form is invalid
    if (this.jobForm.invalid) {
      console.log('From invalid', this.jobForm);
      return;
    }
    this.spinner.show();
    let jobToUpdate = <Job>this.jobForm.value;
    Object.assign(this.job, jobToUpdate);
    this.job.merchant = this.merchant.id + "";
    this.job.location = this.job.location + "";
    this.job.app = this.job.app + "";
    this.job.library = this.job.library + "";

    this.service.update(this.job).subscribe((resp: ApiResponse) => {
      this.spinner.hide();
      this.toastr.success("Event has been updated successfully.", "Event");
      // this.router.navigate(['/dmodel']);
      this.close(true);
    },
      err => {
        console.log('Unable to update event, please contact adminstrator', err);
        // this.errMsg = err.message;
        this.toastr.error('Unable to update event, please contact adminstrator', "Event");
        this.spinner.hide();
      });
  }

  edit() {
    this.actionType = ActionEnum.edit;
    this.jobForm.enable();
    this.pageHeader = 'Update Event';
    this.f.name.disable();
    this.f.brand.disable();
  }

  delete() {
    this.service.delete(this.job.id).subscribe(data => {
      this.toastr.success('Event has been deleted successfully', 'Event')
      // this.router.navigate(['/dmodel']);
      this.close(true);
    },
      err => {
        console.log('Unable to delete event, please contact administrator.');
        this.toastr.error('Unable to delete event, please contact administrator.', 'Event');
      });
  }

  changeTarget(e) {
    console.log(e.target.value);
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
      // this.loc = this.locs[0];
      // this.f.location.setValue(this.loc.id);
      // if(loadDevices){
      //   this.loadDevices();
      // }

      if(this.actionType != this.actionEnum.add && this.job.location){
        let ls = this.job.location.split(',').map(x=>+x);
        this.selectedLocs = ls;
      }  
    },
      err => {
        console.log('Unable to load locations, please contact adminstrator', err);
        // this.errMsg = err.message;
        this.toastr.error('Unable to load locations, please contact adminstrator', "Event");
        this.spinner.hide();
      });
  }

  loadDevices() {
    this.spinner.show();
    this.deviceService.findByMerchant(this.merchant.id).subscribe((resp: ApiResponse) => {
      this.spinner.hide();
      this.devices = resp.message;
      // this.f.device.setValue(this.devices[0].id);

      if(this.actionType != this.actionEnum.add && this.job.device){
        let ds = this.job.device.split(',').map(x=>+x);
  
        this.selectedDvcs = ds;
      }  
    },
      err => {
        console.log('Unable to load devices, please contact adminstrator', err);
        // this.errMsg = err.message;
        this.toastr.error('Unable to load devices, please contact adminstrator', "Device");
        this.spinner.hide();
      });
  }

  changeLoc(id: number, loadDevices: boolean) {
    // console.log("Selected app id...", id +':' + JSON.stringify(this.apps));
    this.loc = this.locs.find(x => x.id == id);
    this.f.location.setValue(this.loc.id);
    // console.log("Selected app...", this.app);
    this.devices = [];
    if (loadDevices)
      this.loadDevices();
  }

  onAddLocation(event) {
    // console.log("Add...", event);
    this.selectedLocations.push(event.id);
    console.log("Selected...", this.selectedLocations);
  }

  onRemoveLocation(event) {
    console.log("Delete...", event);
    const index = this.selectedLocations.indexOf(event.value.id, 0);
    if (index > -1) {
      this.selectedLocations.splice(index, 1);
    }
    console.log("Deleted...", this.selectedLocations);
  }

  onAddDevice(event) {
    // console.log("Add...", event);
    this.selectedDevices.push(event.id);
    // this.selectedDvcs.push(this.filterDevice(event.id));
    console.log("Selected...", this.selectedDevices);
  }

  onRemoveDevice(event) {
    console.log("Delete...", event);
    const index = this.selectedDevices.indexOf(event.value.id, 0);
    if (index > -1) {
      this.selectedDevices.splice(index, 1);
    }
    console.log("Deleted...", this.selectedDevices);
  }

  public get actionEnum(): typeof ActionEnum {
    return ActionEnum;
  }

  public get jobsEnum(): typeof JobsEnum {
    return JobsEnum;
  }

  public get triggerEnum(): typeof TriggerType {
    return TriggerType;
  }

  public get targetEnum(): typeof TargetType {
    return TargetType;
  }

  public get jobTypes() {
    return Object.values(JobsEnum);
  }

  public get triggerTypes() {
    return Object.values(TriggerType);
  }

}
