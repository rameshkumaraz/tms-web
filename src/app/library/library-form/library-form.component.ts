import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { distinctUntilChanged } from 'rxjs/operators';
import { ApplicationService } from 'src/app/application/application.service';
import { Library } from 'src/app/model/library';
import { Merchant } from 'src/app/model/merchant';
import { ActionEnum } from 'src/app/shared/enum/action.enum';
import { PostActionEnum } from 'src/app/shared/enum/post-action.enum';
import { LibTypeEnum } from 'src/app/shared/enum/lib-type.enum';
import { ApiResponse } from 'src/app/shared/model/api.response';
import { AppService } from 'src/app/shared/service/app.service';
import { LibraryService } from '../library.service';

@Component({
  selector: 'app-library-form',
  templateUrl: './library-form.component.html',
  styleUrls: ['./library-form.component.scss']
})
export class LibraryFormComponent implements OnInit {

  @Output() modelClosed = new EventEmitter();

  // @Input() merchant;
  @Input() app;
  @Input() lib;
  @Input() actionType;

  pageHeader = 'New Library';
  page = 1;
  pageSize = 10;

  libForm: FormGroup;
  formSubmitted = false;
  isFailed = false;
  errMsg: string;

  apps: Array<any>;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private appService: AppService,
    private aplnService: ApplicationService,
    private service: LibraryService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    // this.sub = this.activatedroute.paramMap.subscribe(params => {
    //   console.log(params);
    //   this.actionType = params.get('actionType');
    //   this.libId = params.get('id');
    // });

    // console.log(this.authService.getCurrentUser());
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

    this.setDescValidator();

    // this.appService.userMerchant.subscribe(data => {
    //   this.merchant = data;
    //   this.loadApps();
    // });

    if (this.actionType != ActionEnum.add) {
      this.onLoad();
    }

    if (this.actionType == ActionEnum.view) {
      this.libForm.disable();
      this.pageHeader = 'View Library';
    }

    this.libForm['controls'].app.setValue(this.app.id+"");
  }

  loadApps(){
    this.spinner.show();
    // this.aplnService.getAllByMerchant(this.merchant.id).subscribe((resp: ApiResponse) => {
    this.aplnService.getAll().subscribe((resp: ApiResponse) => {
      this.spinner.hide();
      this.apps = resp.message;
    },
      err => {
        console.log('Unable to load libraries, please contact adminstrator', err);
        this.errMsg = err.message;
        this.toastr.error('Unable to load libraries, please contact adminstrator', "Library");
        this.spinner.hide();
      });
  }

  onLoad() {
    // this.spinner.show();
    // this.service.getById(this.libId).subscribe((resp: ApiResponse) => {
    //   this.spinner.hide();
    //   this.lib = resp.message;
    //   console.log('Library....', this.lib);
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

    //   this.appId = this.f.app.value;
    // },
    //   err => {
    //     console.log('Unable to load Library, please contact adminstrator', err);
    //     this.errMsg = err.message;
    //     this.toastr.error(this.errMsg, "Library");
    //     this.spinner.hide();
    //   });
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

    this.service.create(formData).subscribe((resp: ApiResponse) => {
      this.spinner.hide();
      this.toastr.success("Library has been created successfully.", "Library");
      this.close(true);
    },
      err => {
        console.log('Unable to create Library, please contact adminstrator', err);
        this.errMsg = err.message;
        this.toastr.error('Unable to create library, please contact adminstrator', "Library");
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

  getFormData(): FormData{
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
    return formData;
  }

  // edit() {
  //   this.actionType = ActionEnum.edit;
  //   this.libForm.enable();
  // }

  delete() {
    this.service.delete(this.lib.id).subscribe(data => {
      this.toastr.success('Library has been deleted successfully', 'Library')
      this.close(true);
    },
    err => {
      console.log('Unable to delete library, please contact administrator.', 'Library');
      this.toastr.error('Unable to delete library, please contact administrator.', 'Library');
    });
  }

  cancel() {
    this.close(false);
  }

  onFileChange(event) {
  
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.libForm.patchValue({
        bundle : file,
        bundleName: file.name
      });
    }
    // console.log("File name", this.f.bundleName.value);
  }

  close(reload: boolean) {
    console.log('close invoked');
    this.modelClosed.emit({reload: reload});
  }

  public get actionEnum(): typeof ActionEnum {
    return ActionEnum; 
  }

  public get postActionEnum() {
    return Object.values(PostActionEnum); 
  }

  public get libTypeEnum() {
    return Object.values(LibTypeEnum); 
  }

}
