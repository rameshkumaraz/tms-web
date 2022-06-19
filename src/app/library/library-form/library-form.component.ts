import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { distinctUntilChanged } from 'rxjs/operators';
import { ActionEnum } from 'src/app/shared/enum/action.enum';
import { PostActionEnum } from 'src/app/shared/enum/post-action.enum';
import { LibTypeEnum } from 'src/app/shared/enum/lib-type.enum';
import { ApiResponse } from 'src/app/shared/model/api.response';
import { LibraryService } from '../library.service';
import { BaseFormComponent } from 'src/app/shared/core/base-form.component';

@Component({
  selector: 'app-library-form',
  templateUrl: './library-form.component.html',
  styleUrls: ['./library-form.component.scss']
})
export class LibraryFormComponent extends BaseFormComponent {

  @Input() merchant;
  @Input() apps;
  @Input() lib;
  @Input() actionType;

  pageHeader = 'New Bundle';
  page = 1;
  pageSize = 10;

  libForm: FormGroup;
  formSubmitted = false;
  isFailed = false;
  errMsg: string;

  // apps: Array<any>;

  constructor(private formBuilder: FormBuilder,
    private service: LibraryService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) {
    super();
  }

  ngOnInit(): void {

    this.loadActionAccess(this.componentEnum.appBuild.toString());

    this.libForm = this.formBuilder.group({
      app: ['', [Validators.required, Validators.minLength(1)]],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      type: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(25)]],
      libVersion: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(10)]],
      libBaseVersion: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(10)]],
      bundle: [''],
      bundleName: ['', Validators.required],
      desc: [''],
      postAction: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(15)]],
      postActionDelay: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(10)]]
    });

    this.libForm['controls'].libBaseVersion.disable();

    this.setDescValidator();

    // this.appService.userMerchant.subscribe(data => {
    //   this.merchant = data;
    //   this.loadApps();
    // });

    if (this.actionType != ActionEnum.add) {
      this.onPageLoad();
    }

    if (this.actionType == ActionEnum.view) {
      this.libForm.disable();
      this.pageHeader = 'View Bundle';
    }

    // this.libForm['controls'].app.setValue(this.app.id + "");
  }

  // loadApps() {
    // this.spinner.show();
    // // this.aplnService.getAllByMerchant(this.merchant.id).subscribe((resp: ApiResponse) => {
    // this.aplnService.getAll().subscribe((resp: ApiResponse) => {
    //   this.spinner.hide();
    //   this.apps = resp.message;
    // },
    //   err => {
    //     console.log('Unable to load libraries, please contact adminstrator', err);
    //     this.errMsg = err.message;
    //     this.toastr.error('Unable to load libraries, please contact adminstrator', "Library");
    //     this.spinner.hide();
    //   });
  // }

  onPageLoad() {
    this.libForm.setValue({
      app: this.lib.app.id,
      name: this.lib.name,
      type: this.lib.type,
      libVersion: this.lib.libVersion,
      libBaseVersion: this.lib.libBaseVersion,
      bundleName: this.lib.bundleName,
      bundle: this.lib.bundleName,
      desc: this.lib.desc,
      postAction: this.lib.postAction,
      postActionDelay: this.lib.postActionDelay,
    });
  }

  get f() { return this.libForm['controls'] }

  setDescValidator() {
    this.f.desc.valueChanges.
      pipe(distinctUntilChanged()).
      subscribe(val => {
        if (val.length > 0 && val.length < 6) {
          this.f.desc.setValidators([Validators.minLength(5)]);
          this.f.desc.setValidators([Validators.minLength(250)]);
        } else {
          this.f.desc.clearValidators();
        }
        this.f.desc.updateValueAndValidity();
      });
  };

  onAppChange(id: number){
    this.f.libBaseVersion.setValue(this.apps.find(a => a.id == id).appVersion);
  }

  save() {
    console.log('nextTab');
    this.formSubmitted = true;
    // stop here if form is invalid
    if (this.libForm.invalid) {
      console.log('From invalid', this.libForm);
      return;
    }
    this.spinner.show();

    const formData = this.getFormData();

    console.log('Form data....', formData);

    this.service.createLib(formData).subscribe((resp: ApiResponse) => {
      this.spinner.hide();
      this.toastr.success("Bundle has been created successfully.", "Application Version");
      this.close(true);
    },
      err => {
        console.log('Unable to create bundle, please contact adminstrator', err);
        this.errMsg = err.message;
        this.toastr.error('Unable to create bundle, please contact adminstrator', "Application Version");
        this.spinner.hide();
      });
  }

  // update() {
  //   this.formSubmitted = true;
  //   // stop here if form is invalid
  //   if (this.libForm.invalid) {
  //     console.log('From invalid', this.libForm);
  //     return;
  //   }
  //   this.spinner.show();

  //   const formData = this.getFormData();
  //   formData.append('id', this.lib.id);

  //   this.service.update(formData).subscribe((resp: ApiResponse) => {
  //     this.spinner.hide();
  //     this.toastr.success("Library has been updated successfully.", "Library");
  //     this.router.navigate(['/library', { appId: this.appId}]);
  //   },
  //     err => {
  //       console.log('Unable to update library, please contact adminstrator', err);
  //       this.errMsg = err.message;
  //       this.toastr.error('Unable to update library, please contact adminstrator', "Library");
  //       this.spinner.hide();
  //     });
  // }

  getFormData(): FormData {
    const formData = new FormData();
    formData.append('bundle', this.libForm.get('bundle').value);
    formData.append('app', this.libForm.get('app').value);
    formData.append('name', this.libForm.get('name').value);
    formData.append('type', this.libForm.get('type').value);
    formData.append('libVersion', this.libForm.get('libVersion').value);
    formData.append('libBaseVersion', this.libForm.get('libBaseVersion').value);
    formData.append('bundleName', this.libForm.get('bundleName').value);
    formData.append('desc', this.libForm.get('desc').value);
    formData.append('postAction', this.libForm.get('postAction').value);
    formData.append('postActionDelay', this.libForm.get('postActionDelay').value);
    formData.append('merchant', this.merchant.id);
    return formData;
  }

  edit() {
    this.actionType = ActionEnum.edit;
    this.libForm.enable();
  }

  delete() {
    this.service.delete(this.lib.id).subscribe(data => {
      this.toastr.success('Application version has been deleted successfully', 'Application Version')
      this.close(true);
    },
    err => {
      console.log('Unable to delete application version, please contact administrator.', 'Application Version');
      this.toastr.error('Unable to delete application version, please contact administrator.', 'Application Version');
    });
  }

  updateStatus(id: number, status: number): void {
    this.spinner.show();
    let model = Object.assign({}, this.lib);
    model.status = status;  
    this.service.updateStatus(id, model).subscribe(data => {
      this.close(true);
      console.log('Application version status has been updated successfully');
      this.toastr.success('Application version status has been updated successfully', 'Application Version');
    },
      err => {
        console.log('Unable to update application version status....', err);
        this.toastr.error('Unable to update application version status, please contact adminstrator', 'Application Version');
        this.spinner.hide();
      });
  }

  cancel() {
    this.close(false);
  }

  onFileChange(event) {

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.libForm.patchValue({
        bundle: file,
        bundleName: file.name
      });
    }
    // console.log("File name", this.f.bundleName.value);
  }

  public get postActionEnum() {
    return Object.values(PostActionEnum);
  }

  public get libTypeEnum() {
    return Object.values(LibTypeEnum);
  }

}
