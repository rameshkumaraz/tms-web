import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BankComponent } from './bank/bank.component';
import { MerchantComponent } from './merchant/merchant.component';


const routes: Routes = [
  { path: 'merchant', component: MerchantComponent },
  { path: 'bank', component: BankComponent },
  { path: '**', redirectTo: 'merchant' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
