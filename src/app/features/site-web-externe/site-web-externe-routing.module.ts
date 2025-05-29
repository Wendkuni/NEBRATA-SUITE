import { ModelVoirPlusComponent } from './model-voir-plus/model-voir-plus.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SiteWebExterneComponent } from './site-web-externe.component';
import { PageDetailResolve } from './page-detail/page-detail.resolve';

const routes: Routes = [
  { path: '', component: SiteWebExterneComponent },
  {path: 'voir-plus', component: ModelVoirPlusComponent, resolve: {processus: PageDetailResolve}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SiteWebExterneRoutingModule { }
   