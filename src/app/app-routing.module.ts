import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuard} from './utils/guards';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MerchantDashboardComponent } from './merchant-dashboard/merchant-dashboard.component';
import { MerchantComponent } from './merchant/merchant.component';
import { LoginComponent } from './login/login.component';
import { MerchantFormComponent } from './merchant/merchant-form/merchant-form.component';
import { LocationComponent } from './location/location.component';
import { DeviceComponent } from './device/device.component';
import { ApplicationComponent } from './application/application.component';
import { DownloadComponent } from './download/download.component';
import { ErrorComponent } from './shared/error/error.component';
import { LocationFormComponent } from './location/location-form/location-form.component';
import { UserComponent } from './user/user.component';
import { RoleComponent } from './role/role.component';
import { UserFormComponent } from './user/user-form/user-form.component';
import { DeviceFormComponent } from './device/device-form/device-form.component';
import { ApplicationFormComponent } from './application/application-form/application-form.component';
import { DownloadFormComponent } from './download/download-form/download-form.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canLoad: [AuthGuard], canActivate: [AuthGuard], data: {roles: ['AZ_ROOT_ADMIN', 'AZ_ADMIN'] }},
  { path: 'mdashboard', component: MerchantDashboardComponent, canLoad: [AuthGuard], canActivate: [AuthGuard], data: {roles: ['AZ_ROOT_ADMIN', 'AZ_ADMIN', 'MERCHANT_ADMIN']} },
  { path: 'merchant', component: MerchantComponent, canLoad: [AuthGuard], canActivate: [AuthGuard], data: {roles: ['AZ_ROOT_ADMIN', 'AZ_ADMIN']} },
  { path: 'merchantForm', component: MerchantFormComponent, canLoad: [AuthGuard], canActivate: [AuthGuard], data: {roles: ['AZ_ROOT_ADMIN', 'AZ_ADMIN']} },
  { path: 'location', component: LocationComponent, canLoad: [AuthGuard], canActivate: [AuthGuard], data: {roles: ['AZ_ROOT_ADMIN', 'MERCHANT_ADMIN', 'MERCHANT_SUPERVISOR', 'MERCHANT_USER']} },
  { path: 'locationForm', component: LocationFormComponent, canLoad: [AuthGuard], canActivate: [AuthGuard], data: {roles: ['AZ_ROOT_ADMIN', 'MERCHANT_ADMIN', 'MERCHANT_SUPERVISOR', 'MERCHANT_USER']} },
  { path: 'device', component: DeviceComponent, canLoad: [AuthGuard], canActivate: [AuthGuard], data: {roles: ['AZ_ROOT_ADMIN', 'MERCHANT_ADMIN', 'MERCHANT_SUPERVISOR', 'MERCHANT_USER']} },
  { path: 'deviceForm', component: DeviceFormComponent, canLoad: [AuthGuard], canActivate: [AuthGuard], data: {roles: ['AZ_ROOT_ADMIN', 'MERCHANT_ADMIN', 'MERCHANT_SUPERVISOR', 'MERCHANT_USER']} },
  { path: 'application', component: ApplicationComponent, canLoad: [AuthGuard], canActivate: [AuthGuard], data: {roles: ['AZ_ROOT_ADMIN', 'MERCHANT_ADMIN', 'MERCHANT_SUPERVISOR', 'MERCHANT_USER']} },
  { path: 'applicationForm', component: ApplicationFormComponent, canLoad: [AuthGuard], canActivate: [AuthGuard], data: {roles: ['AZ_ROOT_ADMIN', 'MERCHANT_ADMIN', 'MERCHANT_SUPERVISOR', 'MERCHANT_USER']} },
  { path: 'download', component: DownloadComponent, canLoad: [AuthGuard], canActivate: [AuthGuard], data: {roles: ['AZ_ROOT_ADMIN', 'MERCHANT_ADMIN', 'MERCHANT_SUPERVISOR', 'MERCHANT_USER']} },
  { path: 'downloadForm', component: DownloadFormComponent, canLoad: [AuthGuard], canActivate: [AuthGuard], data: {roles: ['AZ_ROOT_ADMIN', 'MERCHANT_ADMIN', 'MERCHANT_SUPERVISOR', 'MERCHANT_USER']} },
  { path: 'user', component: UserComponent, canLoad: [AuthGuard], canActivate: [AuthGuard], data: {roles: ['AZ_ROOT_ADMIN', 'AZ_ADMIN', 'MERCHANT_ADMIN', 'MERCHANT_SUPERVISOR']} },
  { path: 'userForm', component: UserFormComponent, canLoad: [AuthGuard], canActivate: [AuthGuard], data: {roles: ['AZ_ROOT_ADMIN', 'AZ_ADMIN', 'MERCHANT_ADMIN', 'MERCHANT_SUPERVISOR']} },
  { path: 'role', component: RoleComponent, canLoad: [AuthGuard], canActivate: [AuthGuard], data: {roles: ['AZ_ROOT_ADMIN', 'AZ_ADMIN']} },
  { path: 'error', component: ErrorComponent },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
