import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SaisieDiffereePvAttributionComponent } from './saisie-differee-pv-attribution.component';
import { EditionSaisieAttributionComponent } from './edition-saisie-attribution/edition-saisie-attribution.component';
import { EntetePVProcessusResolver, EntetePVResolver, EntetePVTransitionResolver } from './saisie-differee-pv-attribution-resolver';
import { VueSaisieAttributionComponent } from './vue-saisie-attribution/vue-saisie-attribution.component';

const routes: Routes = [
  {
    path: '',
    component: SaisieDiffereePvAttributionComponent
  },
  {
    path:'view/:numero',
    component: VueSaisieAttributionComponent,
    resolve: {
      entetePV: EntetePVResolver
    }
  },
  {
    path: 'edition',
    component: EditionSaisieAttributionComponent,
    resolve: {
      processus: EntetePVProcessusResolver
    }
  },
  {
    path: 'edition/:numero/:transition',
    component: EditionSaisieAttributionComponent,
    resolve: {
      entetePV: EntetePVResolver,
      transition: EntetePVTransitionResolver,
      processus: EntetePVProcessusResolver
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaisieDiffereePvAttributionRoutingModule { }
