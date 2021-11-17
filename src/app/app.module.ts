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

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {AuthGuard} from './utils/guards';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MerchantComponent } from './merchant/merchant.component';
import { PageHeaderComponent } from './shared/page-header/page-header.component';
import { MerchantCardComponent } from './merchant-card/merchant-card.component';
import { FileDndComponent } from './shared/file-dnd/file-dnd.component';
import { LoginComponent } from './login/login.component';
import { LoginFormComponent } from './login-form/login-form.component';

import { AppMockDataService } from './utils/services/app-mock-data.service';
import { MerchantFormComponent } from './merchant-form/merchant-form.component';
import { DynamicFormComponent } from './shared/dynamic-form/dynamic-form.component';
import { AppHttpInterceptor } from './utils/helpers/app-http.interceptor';
import { LocationComponent } from './location/location.component';
import { DeviceComponent } from './device/device.component';
import { ApplicationComponent } from './application/application.component';
import { DownloadComponent } from './download/download.component';
import { MerchantDashboardComponent } from './merchant-dashboard/merchant-dashboard.component';
import { ErrorComponent } from './shared/error/error.component';

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
    ErrorComponent
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
    NgxSpinnerModule,
    ReactiveFormsModule,
    ToastrModule.forRoot()
  ],
  providers: [
    AuthGuard,
    AppMockDataService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppHttpInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
