
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuComponent } from './menu.component';
import {CategorieActeurComponent} from '@sycadFeature/data-references-domaine/generique-ref/categorie-acteur/categorie-acteur.component';
import {FormCategorieActeurComponent} from '@sycadFeature/data-references-domaine/generique-ref/categorie-acteur/form-categorie-acteur/form-categorie-acteur.component';
import {CategorieActeurResolver} from '@sycadFeature/data-references-domaine/generique-ref/categorie-acteur/categorie-acteur-resolver';
import {FormMenuComponent} from '@sycadFeature/data-references-domaine/system-ref/menu/form-menu/form-menu.component';
import {MenuResolver} from '@sycadFeature/data-references-domaine/system-ref/menu/menu-resolver';

//const routes: Routes = [{ path: '', component: MenuComponent }];

const routes: Routes = [{ path: '', component: MenuComponent },
  { path:"edition", component: FormMenuComponent,
    data: {breadcrumb: 'edition menu'}},

  { path: "edition/:id", component: FormMenuComponent,
    resolve: { menu: MenuResolver}, data: {breadcrumb: "edition"}}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuRoutingModule { }

