import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegimeFiscalComponent } from './regime-fiscal.component';

const routes: Routes = [{ path: '', component: RegimeFiscalComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegimeFiscalRoutingModule { }
