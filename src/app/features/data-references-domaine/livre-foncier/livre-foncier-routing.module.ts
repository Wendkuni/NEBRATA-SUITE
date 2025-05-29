import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LivreFoncierComponent } from './livre-foncier.component';
import { LivreFoncierResolver } from './livre-foncier-resolver';
import {
  FormLivreFoncierComponent
} from '@sycadFeature/data-references-domaine/livre-foncier/form-livre-foncier/form-livre-foncier.component';


const routes: Routes = [
  { path: '', component: LivreFoncierComponent },
  { path: 'edition', component: FormLivreFoncierComponent, data: {breadcrumb: 'edition'}},
  { path: 'edition/:id', component: FormLivreFoncierComponent, resolve: { processus: LivreFoncierResolver}, data: {breadcrumb: 'edition'}}
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LivreFoncierRoutingModule { }
