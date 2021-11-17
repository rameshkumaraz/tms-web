import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuard} from './utils/guards';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MerchantDashboardComponent } from './merchant-dashboard/merchant-dashboard.component';
import { MerchantComponent } from './merchant/merchant.component';
import { LoginComponent } from './login/login.component';
import { MerchantFormComponent } from './merchant-form/merchant-form.component';
import { LocationComponent } from './location/location.component';
import { DeviceComponent } from './device/device.component';
import { ApplicationComponent } from './application/application.component';
import { DownloadComponent } from './download/download.component';
import { ErrorComponent } from './shared/error/error.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canLoad: [AuthGuard], canActivate: [AuthGuard], data: {roles: ['AZ_ROOT_ADMIN', 'AZ_ADMIN'] }},
  { path: 'mdashboard', component: MerchantDashboardComponent, canLoad: [AuthGuard], canActivate: [AuthGuard], data: {roles: ['AZ_ROOT_ADMIN', 'AZ_ADMIN', 'MERCHANT_ADMIN']} },
  { path: 'merchant', component: MerchantComponent, canLoad: [AuthGuard], canActivate: [AuthGuard], data: {roles: ['AZ_ROOT_ADMIN', 'AZ_ADMIN']} },
  { path: 'merchantForm', component: MerchantFormComponent, canLoad: [AuthGuard], canActivate: [AuthGuard], data: {roles: ['AZ_ROOT_ADMIN', 'AZ_ADMIN']} },
  { path: 'location', component: LocationComponent, canLoad: [AuthGuard], canActivate: [AuthGuard], data: {roles: ['AZ_ROOT_ADMIN', 'MERCHANT_ADMIN', 'MERCHANT_SUPERVISOR', 'MERCHANT_USER']} },
  { path: 'device', component: DeviceComponent, canLoad: [AuthGuard], canActivate: [AuthGuard], data: {roles: ['AZ_ROOT_ADMIN', 'MERCHANT_ADMIN', 'MERCHANT_SUPERVISOR', 'MERCHANT_USER']} },
  { path: 'application', component: ApplicationComponent, canLoad: [AuthGuard], canActivate: [AuthGuard], data: {roles: ['AZ_ROOT_ADMIN', 'MERCHANT_ADMIN', 'MERCHANT_SUPERVISOR', 'MERCHANT_USER']} },
  { path: 'download', component: DownloadComponent, canLoad: [AuthGuard], canActivate: [AuthGuard], data: {roles: ['AZ_ROOT_ADMIN', 'MERCHANT_ADMIN', 'MERCHANT_SUPERVISOR', 'MERCHANT_USER']} },
  { path: 'error', component: ErrorComponent },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
