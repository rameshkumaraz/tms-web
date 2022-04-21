import { BrowserModule} from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { ArchwizardModule } from 'angular-archwizard';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {AuthGuard} from './auth/guards';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MerchantComponent } from './merchant/merchant.component';
import { PageHeaderComponent } from './shared/page-header/page-header.component';
import { MerchantCardComponent } from './merchant/merchant-card/merchant-card.component';
import { FileDndComponent } from './shared/file-dnd/file-dnd.component';
import { LoginComponent } from './login/login.component';
import { LoginFormComponent } from './login-form/login-form.component';

import { MerchantFormComponent } from './merchant/merchant-form/merchant-form.component';
import { DynamicFormComponent } from './shared/dynamic-form/dynamic-form.component';
import { AppHttpInterceptor } from './utils/helpers/app-http.interceptor';
import { LocationComponent } from './location/location.component';
import { DeviceComponent } from './device/device.component';
import { ApplicationComponent } from './application/application.component';
import { DownloadComponent } from './download/download.component';
import { MerchantDashboardComponent } from './merchant-dashboard/merchant-dashboard.component';
import { ErrorComponent } from './shared/error/error.component';
import { LocationFormComponent } from './location/location-form/location-form.component';
import { UserComponent } from './user/user.component';
import { UserFormComponent } from './user/user-form/user-form.component';
import { DeviceFormComponent } from './device/device-form/device-form.component';
import { ApplicationFormComponent } from './application/application-form/application-form.component';
import { RoleComponent } from './role/role.component';
import { DownloadFormComponent } from './download/download-form/download-form.component';
import { DeviceModelComponent } from './device-model/device-model.component';
import { DeviceModelFormComponent } from './device-model/device-model-form/device-model-form.component';
import { DeviceBrandComponent } from './device-brand/device-brand.component';
import { DeviceBrandFormComponent } from './device-brand/device-brand-form/device-brand-form.component';
import { LibraryComponent } from './library/library.component';
import { LibraryFormComponent } from './library/library-form/library-form.component';
import { JobComponent } from './job/job.component';
import { JobFormComponent } from './job/job-form/job-form.component';
import { AppParamComponent } from './app-param/app-param.component';
import { PolicyComponent } from './policy/policy.component';
import { PolicyFormComponent } from './policy/policy-form/policy-form.component';
import { RoleFormComponent } from './role/role-form/role-form.component';
import { AdminUserComponent } from './admin-user/admin-user.component';
import { AdminUserFormComponent } from './admin-user/admin-user-form/admin-user-form.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DeviceProfileComponent } from './device/device-profile/device-profile.component';
import { JobDetailComponent } from './job/job-detail/job-detail.component';
import { AppParamService } from './app-param/app-param.service';
import { AppParamFormComponent } from './app-param/app-param-form/app-param-form.component';
import { AppParamImportComponent } from './app-param/app-param-import/app-param-import.component';
import { PositivePipe } from './utils/pipes/positive.pope';
import { UserInactiveComponent } from './shared/modal/user-inactive/user-inactive.component';
import { LogoutComponent } from './logout/logout.component';
import { ResetPassComponent } from './password/reset/reset-pass/reset-pass.component';
import { ForgotPassComponent } from './password/forgot/forgot-pass/forgot-pass.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
    MerchantComponent,
    PageHeaderComponent,
    MerchantCardComponent,
    FileDndComponent,
    LoginComponent,
    LoginFormComponent,
    LocationComponent,
    DeviceComponent,
    ApplicationComponent,
    DownloadComponent,
    MerchantFormComponent,
    DynamicFormComponent,
    MerchantDashboardComponent,
    ErrorComponent,
    LocationFormComponent,
    UserComponent,
    UserFormComponent,
    DeviceFormComponent,
    ApplicationFormComponent,
    RoleComponent,
    DownloadFormComponent,
    DeviceModelComponent,
    DeviceModelFormComponent,
    DeviceBrandComponent,
    DeviceBrandFormComponent,
    LibraryComponent,
    LibraryFormComponent,
    JobComponent,
    JobFormComponent,
    AppParamComponent,
    PolicyComponent,
    PolicyFormComponent,
    RoleFormComponent,
    AdminUserComponent,
    AdminUserFormComponent,
    SidebarComponent,
    DeviceProfileComponent,
    JobDetailComponent,
    AppParamFormComponent,
    AppParamImportComponent,
    PositivePipe,
    UserInactiveComponent,
    LogoutComponent,
    ResetPassComponent,
    ForgotPassComponent
  ],
  imports: [
    AppRoutingModule,
    ArchwizardModule,
    BrowserModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    NgSelectModule,
    NgxSpinnerModule,
    Ng2GoogleChartsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
  ],
  providers: [
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppHttpInterceptor,
      multi: true
    },
    AppParamService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
