import { Component} from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Merchant } from '../model/merchant';
import { ActionEnum } from '../shared/enum/action.enum';
import { AppService } from '../shared/service/app.service';
import { AppParamService } from './app-param.service';
import { BaseComponent } from '../shared/core/base.component';
import { ApplicationService } from '../application/application.service';
import { first } from 'rxjs/operators';
import { ApiResponse } from '../shared/model/api.response';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-app-param',
  templateUrl: './app-param.component.html',
  styleUrls: ['./app-param.component.scss']
})
export class AppParamComponent extends BaseComponent {

  pageHeader: string;
  page = 1;
  pageSize = 5;

  appParamCount = 0;
  appParams: Array<any>;

  appParam: any;

  apps: Array<any>;
  appsCount = 0;
  app: any;

  merchant: Merchant;

  mSub: Subscription;

  actionType;

  closeResult: string;

  mockParamConfig: string;

  formTitle: any;
  formConfig: any;

  importForm: FormGroup;
  importConfigForm: FormGroup;
  importType: string;
  formSubmitted = false;

  dynamicFormValue: any;

  importedContent: any;

  constructor(
    public paramService: AppParamService,
    public aService: ApplicationService,
    private appService: AppService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) {
    super();
  }

  private setting = {
    element: {
      dynamicDownload: null as HTMLElement
    }
  }

  ngOnInit(): void {
    this.pageHeader = 'Parameter Configuration';

    // this.formConfig = paramConfig;

    this.mSub = this.appService.userMerchant.subscribe(data => {
      this.merchant = data;
      this.onPageLoad();
      this.loadApps();
    });

    this.paramService.getMockPramConfig().subscribe((data: any) => {
      this.mockParamConfig = JSON.stringify(data.message);
    });

    this.importType = 'params';

    this.importForm = this.formBuilder.group({
      configFile: [''],
      configFileName: ['', Validators.required],
      app: ['', Validators.required]
    });

    // console.log("Selected app.....", this.app);
  }

  onPageLoad() {
    this.spinner.show();
    this.paramService.getByMerchant(this.merchant.id)
      .pipe(first())
      .subscribe(
        (resp: ApiResponse) => {
          console.log('App Param Response', resp);
          this.appParams = resp.message;
          this.appParamCount = this.appParams.length;
          this.spinner.hide();
        },
        error => {
          console.log('App Param Response', error);
          this.spinner.hide();
        });
  }

  loadApps() {
    // this.spinner.show();
    this.aService.getByMerchant(this.merchant.id)
      .pipe(first())
      .subscribe(
        (resp: ApiResponse) => {
          console.log('Application Response', resp);
          this.apps = resp.message;
          this.appsCount = this.apps.length;
          this.spinner.hide();
        },
        error => {
          console.log('Application Response', error);
          this.spinner.hide();
        });
  }

  get f() { return this.importForm['controls'] }

  create(content: any) {
    this.actionType = ActionEnum.add;
    this.openModal(content, 'md', 'Parameter Form');
    // console.log('Relation.....', this.paramService.setRelation);
  }

  view(id: number, content: any) {
    this.actionType = ActionEnum.view;
    this.appParam = this.filterAppParam(id);
    this.openModal(content, 'md', 'Parameter Form');
  }

  edit(id: number, content: any) {
    this.actionType = ActionEnum.edit;
    this.appParam = this.filterAppParam(id);
    this.openModal(content, 'md', 'Parameter Form');
    // this.paramService.setRelation(this.merchant.id, this.app.id);
    // console.log('Relation.....', this.paramService.getRelation());
  }

  filterApp(id: number) {
    return this.apps.find(m => m.id == id);
  }

  filterAppParam(id: number) {
    return this.appParams.find(p => p.id == id);
  }

  delete(id: number) {
    // this.service.delete(id).subscribe(data => {
    //   console.log('Application has been deleted successfully');
    //   this.toastr.success('Application has been deleted successfully', 'Application');
    //   this.onLoad();
    // },
    // err => {
    //   console.log('Device model delete error....', err);
    //   this.toastr.error('Unable to delete application, please contact adminstrator', 'Application');
    // });
  }

  cancel() {
    console.log('Cancel invoked....');
    this.closeModal(false);
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
        // console.log(fileReader.result);
        // var obj = JSON.parse(fileReader.result);
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
    // console.log("File name", this.f.bundleName.value);
  }

  downloadTemplate() {
    this.dyanmicDownloadByHtmlTag(
      {
        fileName: 'mock-param-config.json',
        text: this.mockParamConfig
      });
  }

  importTemplate(content: any) {
    this.pageHeader = 'Import Template';
    this.importType = 'TEMPLATE';
    this.openModal(content, 'md', 'Template Form');
  }

  importParams(content: any) {
    this.pageHeader = 'Import Configuration(s)';
    this.importType = 'PARAMS';
    this.openModal(content, 'md', 'Template Form');
  }

  exportParams() {

  }

  saveTemplate(){
    this.formSubmitted = true;
    // stop here if form is invalid
    if (this.importForm.invalid) {
      console.log('From invalid', this.importForm);
      return;
    }
    this.spinner.show();
    this.app = this.filterApp(+this.f.app.value);

    console.log('Selected app', this.app);

    this.app.canEdit = !!this.app.canEdit;
    this.app.canView = !!this.app.canEdit;
    this.app.template = this.importedContent;

    this.aService.update(this.app).subscribe((resp: ApiResponse) => {
      this.spinner.hide();
      this.toastr.success("Template has been saved successfully.", "Parameter Configuration Template");
      this.closeModal(true);
      this.spinner.hide();
    },
      err => {
        console.log('Unable to save parameter configuration template, please contact adminstrator', err);
        this.toastr.error('Unable to save parameter configuration template, please contact adminstrator', "Parameter Configuration Template");
        this.spinner.hide();
      });
    
  }

  saveParams(){
    this.formSubmitted = true;
    // stop here if form is invalid
    if (this.importForm.invalid) {
      console.log('From invalid', this.importForm);
      return;
    }
    
    this.app = this.filterApp(+this.f.app.value);

    console.log('Selected app', this.app);

    this.app.canEdit = !!this.app.canEdit;
    this.app.canView = !!this.app.canEdit;
    this.app.template = this.importedContent;

    this.paramService.create(this.app).subscribe((resp: ApiResponse) => {
      this.spinner.hide();
      this.toastr.success("Template has been saved successfully.", "Parameter Configuration Template");
      this.closeModal(true);
      this.spinner.hide();
    },
      err => {
        console.log('Unable to save parameter configuration template, please contact adminstrator', err);
        this.toastr.error('Unable to save parameter configuration template, please contact adminstrator', "Parameter Configuration Template");
        this.spinner.hide();
      });
    
  }

  

  private dyanmicDownloadByHtmlTag(arg: {
    fileName: string,
    text: string
  }) {
    if (!this.setting.element.dynamicDownload) {
      this.setting.element.dynamicDownload = document.createElement('a');
    }
    const element = this.setting.element.dynamicDownload;
    const fileType = arg.fileName.indexOf('.json') > -1 ? 'text/json' : 'text/plain';
    element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(arg.text)}`);
    element.setAttribute('download', arg.fileName);

    var event = new MouseEvent("click");
    element.dispatchEvent(event);
  }

  ngOnDestroy(): void {
    this.mSub.remove;
  }
}
