import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/guards';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MerchantDashboardComponent } from './merchant-dashboard/merchant-dashboard.component';
import { MerchantComponent } from './merchant/merchant.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { MerchantFormComponent } from './merchant/merchant-form/merchant-form.component';
import { LocationComponent } from './location/location.component';
import { DeviceBrandComponent } from './device-brand/device-brand.component';
import { DeviceBrandFormComponent } from './device-brand/device-brand-form/device-brand-form.component';
import { DeviceModelComponent } from './device-model/device-model.component';
import { DeviceModelFormComponent } from './device-model/device-model-form/device-model-form.component';
import { DeviceComponent } from './device/device.component';
import { ApplicationComponent } from './application/application.component';
import { ErrorComponent } from './shared/error/error.component';
import { LocationFormComponent } from './location/location-form/location-form.component';
import { AdminUserComponent } from './admin-user/admin-user.component';
import { AdminUserFormComponent } from './admin-user/admin-user-form/admin-user-form.component';
import { UserComponent } from './user/user.component';
import { RoleComponent } from './role/role.component';
import { UserFormComponent } from './user/user-form/user-form.component';
import { DeviceFormComponent } from './device/device-form/device-form.component';
import { DeviceProfileComponent } from './device/device-profile/device-profile.component';
import { ApplicationFormComponent } from './application/application-form/application-form.component';
import { DownloadFormComponent } from './download/download-form/download-form.component';
import { LibraryComponent } from './library/library.component';
import { LibraryFormComponent } from './library/library-form/library-form.component';
import { JobComponent } from './job/job.component';
import { JobDetailComponent } from './job/job-detail/job-detail.component';
import { AppParamComponent } from './app-param/app-param.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'db', component: DashboardComponent, canLoad: [AuthGuard], canActivate: [AuthGuard], data: {roles: ['AZ_ROOT_ADMIN', 'AZ_ADMIN'] }},
  { path: 'mdb', component: MerchantDashboardComponent, canLoad: [AuthGuard], canActivate: [AuthGuard], data: {roles: ['AZ_ROOT_ADMIN', 'AZ_ADMIN', 'MERCHANT_ADMIN']} },
  { path: 'merchant', component: MerchantComponent, canLoad: [AuthGuard], canActivate: [AuthGuard], data: {roles: ['AZ_ROOT_ADMIN', 'AZ_ADMIN']} },
  { path: 'mf', component: MerchantFormComponent, canLoad: [AuthGuard], canActivate: [AuthGuard], data: {roles: ['AZ_ROOT_ADMIN', 'AZ_ADMIN']} },
  { path: 'location', component: LocationComponent, canLoad: [AuthGuard], canActivate: [AuthGuard], data: {roles: ['AZ_ROOT_ADMIN', 'MERCHANT_ADMIN', 'MERCHANT_SUPERVISOR', 'MERCHANT_USER']} },
  { path: 'lf', component: LocationFormComponent, canLoad: [AuthGuard], canActivate: [AuthGuard], data: {roles: ['AZ_ROOT_ADMIN', 'MERCHANT_ADMIN', 'MERCHANT_SUPERVISOR', 'MERCHANT_USER']} },
  { path: 'dbrand', component: DeviceBrandComponent, canLoad: [AuthGuard], canActivate: [AuthGuard], data: {roles: ['AZ_ROOT_ADMIN', 'AZ_ADMIN', 'AZ_SUPPORT']} },
  { path: 'dbf', component: DeviceBrandFormComponent, canLoad: [AuthGuard], canActivate: [AuthGuard], data: {roles: ['AZ_ROOT_ADMIN', 'AZ_ADMIN', 'AZ_SUPPORT']} },
  { path: 'dmodel', component: DeviceModelComponent, canLoad: [AuthGuard], canActivate: [AuthGuard], data: {roles: ['AZ_ROOT_ADMIN', 'AZ_ADMIN', 'AZ_SUPPORT']} },
  { path: 'dmf', component: DeviceModelFormComponent, canLoad: [AuthGuard], canActivate: [AuthGuard], data: {roles: ['AZ_ROOT_ADMIN', 'AZ_ADMIN', 'AZ_SUPPORT']} },
  { path: 'device', component: DeviceComponent, canLoad: [AuthGuard], canActivate: [AuthGuard], data: {roles: ['AZ_ROOT_ADMIN', 'MERCHANT_ADMIN', 'MERCHANT_SUPERVISOR', 'MERCHANT_USER']} },
  { path: 'df', component: DeviceFormComponent, canLoad: [AuthGuard], canActivate: [AuthGuard], data: {roles: ['AZ_ROOT_ADMIN', 'MERCHANT_ADMIN', 'MERCHANT_SUPERVISOR', 'MERCHANT_USER']} },
  { path: 'dProfile', component: DeviceProfileComponent, canLoad: [AuthGuard], canActivate: [AuthGuard], data: {roles: ['AZ_ROOT_ADMIN', 'MERCHANT_ADMIN', 'MERCHANT_SUPERVISOR', 'MERCHANT_USER']} },
  { path: 'app', component: ApplicationComponent, canLoad: [AuthGuard], canActivate: [AuthGuard], data: {roles: ['AZ_ROOT_ADMIN', 'MERCHANT_ADMIN', 'MERCHANT_SUPERVISOR', 'MERCHANT_USER']} },
  { path: 'af', component: ApplicationFormComponent, canLoad: [AuthGuard], canActivate: [AuthGuard], data: {roles: ['AZ_ROOT_ADMIN', 'MERCHANT_ADMIN', 'MERCHANT_SUPERVISOR', 'MERCHANT_USER']} },
  { path: 'param', component: AppParamComponent, canLoad: [AuthGuard], canActivate: [AuthGuard], data: {roles: ['AZ_ROOT_ADMIN', 'MERCHANT_ADMIN', 'MERCHANT_SUPERVISOR', 'MERCHANT_USER']} },
  { path: 'library', component: LibraryComponent, canLoad: [AuthGuard], canActivate: [AuthGuard], data: {roles: ['AZ_ROOT_ADMIN', 'MERCHANT_ADMIN', 'MERCHANT_SUPERVISOR', 'MERCHANT_USER']} },
  { path: 'libf', component: LibraryFormComponent, canLoad: [AuthGuard], canActivate: [AuthGuard], data: {roles: ['AZ_ROOT_ADMIN', 'MERCHANT_ADMIN', 'MERCHANT_SUPERVISOR', 'MERCHANT_USER']} },
  { path: 'event', component: JobComponent, canLoad: [AuthGuard], canActivate: [AuthGuard], data: {roles: ['AZ_ROOT_ADMIN', 'MERCHANT_ADMIN', 'MERCHANT_SUPERVISOR', 'MERCHANT_USER']} },
  { path: 'eDetail', component: JobDetailComponent, canLoad: [AuthGuard], canActivate: [AuthGuard], data: {roles: ['AZ_ROOT_ADMIN', 'MERCHANT_ADMIN', 'MERCHANT_SUPERVISOR', 'MERCHANT_USER']} },
  { path: 'df', component: DownloadFormComponent, canLoad: [AuthGuard], canActivate: [AuthGuard], data: {roles: ['AZ_ROOT_ADMIN', 'MERCHANT_ADMIN', 'MERCHANT_SUPERVISOR', 'MERCHANT_USER']} },
  { path: 'au', component: AdminUserComponent, canLoad: [AuthGuard], canActivate: [AuthGuard], data: {roles: ['AZ_ROOT_ADMIN', 'AZ_ADMIN', 'MERCHANT_ADMIN', 'MERCHANT_SUPERVISOR']} },
  { path: 'auf', component: AdminUserFormComponent, canLoad: [AuthGuard], canActivate: [AuthGuard], data: {roles: ['AZ_ROOT_ADMIN', 'AZ_ADMIN', 'MERCHANT_ADMIN', 'MERCHANT_SUPERVISOR']} },
  { path: 'user', component: UserComponent, canLoad: [AuthGuard], canActivate: [AuthGuard], data: {roles: ['AZ_ROOT_ADMIN', 'AZ_ADMIN', 'MERCHANT_ADMIN', 'MERCHANT_SUPERVISOR']} },
  { path: 'uf', component: UserFormComponent, canLoad: [AuthGuard], canActivate: [AuthGuard], data: {roles: ['AZ_ROOT_ADMIN', 'AZ_ADMIN', 'MERCHANT_ADMIN', 'MERCHANT_SUPERVISOR']} },
  { path: 'role', component: RoleComponent, canLoad: [AuthGuard], canActivate: [AuthGuard], data: {roles: ['AZ_ROOT_ADMIN', 'AZ_ADMIN', 'MERCHANT_ADMIN']} },
  { path: 'logout', component: LogoutComponent },
  { path: 'error', component: ErrorComponent },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
