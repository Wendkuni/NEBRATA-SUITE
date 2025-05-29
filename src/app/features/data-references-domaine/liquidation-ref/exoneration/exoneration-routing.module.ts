import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExonerationResolver } from './exoneration-resolver';

import { ExonerationComponent } from './exoneration.component';
import { FormExonerationComponent } from './form-exoneration/form-exoneration.component';


const routes: Routes = [{ path: '', component: ExonerationComponent },
  {path: 'edition', component: FormExonerationComponent, data: {breadcrumb: "création exoneration"}},
  {path:'edition/:id', component: FormExonerationComponent, resolve: {exoneration: ExonerationResolver},
  data: {breadcrumb: "modification exoneration"}}
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExonerationRoutingModule { }
