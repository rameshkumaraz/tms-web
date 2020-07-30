import { BrowserModule} from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { ArchwizardModule } from 'angular-archwizard';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {AuthGuard} from './utils/guards';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { MerchantComponent } from './merchant/merchant.component';
import { PageHeaderComponent } from './shared/page-header/page-header.component';
import { BankComponent } from './bank/bank.component';
import { MerchantCardComponent } from './merchant-card/merchant-card.component';
import { ImportComponent } from './import/import.component';
import { ExportComponent } from './export/export.component';
import { FileDndComponent } from './shared/file-dnd/file-dnd.component';
import { LoginComponent } from './login/login.component';
import { LoginFormComponent } from './login-form/login-form.component';

import { AppMockDataService } from './utils/services/app-mock-data.service';
import { MerchantFormComponent } from './merchant-form/merchant-form.component';
import { BankFormComponent } from './bank-form/bank-form.component';
import { DynamicFormComponent } from './shared/dynamic-form/dynamic-form.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MerchantComponent,
    PageHeaderComponent,
    BankComponent,
    MerchantCardComponent,
    ImportComponent,
    ExportComponent,
    FileDndComponent,
    LoginComponent,
    LoginFormComponent,
    MerchantFormComponent,
    BankFormComponent,
    DynamicFormComponent
  ],
  imports: [
    AppRoutingModule,
    ArchwizardModule,
    BrowserModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    FormsModule,
    NgbModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    ToastrModule.forRoot()
  ],
  providers: [
    AuthGuard,
    AppMockDataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
