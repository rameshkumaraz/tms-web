import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BankComponent } from './bank/bank.component';
import { MerchantComponent } from './merchant/merchant.component';
import { ImportComponent } from './import/import.component';
import { ExportComponent } from './export/export.component';


const routes: Routes = [
  { path: 'merchant', component: MerchantComponent },
  { path: 'bank', component: BankComponent },
  { path: 'import', component: ImportComponent },
  { path: 'export', component: ExportComponent },
  { path: '**', redirectTo: 'merchant' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
