import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExonerationCategorieResolver } from './exoneration-categorie-resolver';

import { ExonerationCategorieComponent } from './exoneration-categorie.component';
import { FormExonerationCategorieComponent } from './form-exoneration-categorie/form-exoneration-categorie.component';

const routes: Routes = [{ path: '', component: ExonerationCategorieComponent },
  {path: 'edition', component: FormExonerationCategorieComponent, data: {breadcrumb: "édition catégorie exoneration"}},
  {path:'edition/:id', component: FormExonerationCategorieComponent, resolve: {exonerationCategorie: ExonerationCategorieResolver},
  data: {breadcrumb: "édition catégorie exoneration "}}
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExonerationCategorieRoutingModule { }
