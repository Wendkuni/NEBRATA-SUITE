import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategorieActeurComponent } from './categorie-acteur.component';
import { FormCategorieActeurComponent} from "@sycadFeature/data-references-domaine/generique-ref/categorie-acteur/form-categorie-acteur/form-categorie-acteur.component";
import { CategorieActeurResolver } from './categorie-acteur-resolver';

const routes: Routes = [{ path: '', component: CategorieActeurComponent },
  { path:"edition", component: FormCategorieActeurComponent, 
                data: {breadcrumb: 'edition categorie acteur'}},
  
  { path: "edition/:id", component: FormCategorieActeurComponent,
    resolve: { categorieActeur: CategorieActeurResolver}, data: {breadcrumb: "edition"}}]; 

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategorieActeurRoutingModule { }
