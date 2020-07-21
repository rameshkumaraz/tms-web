import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuard} from './utils/guards';
import { BankComponent } from './bank/bank.component';
import { MerchantComponent } from './merchant/merchant.component';
import { ImportComponent } from './import/import.component';
import { ExportComponent } from './export/export.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
  { path: 'merchant', component: MerchantComponent, canActivate: [AuthGuard] },
  { path: 'bank', component: BankComponent, canActivate: [AuthGuard] },
  { path: 'import', component: ImportComponent, canActivate: [AuthGuard] },
  { path: 'export', component: ExportComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
