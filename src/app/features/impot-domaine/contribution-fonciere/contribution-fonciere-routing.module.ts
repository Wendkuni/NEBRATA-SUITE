import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContribuationFonciereProcessusResolver, ContribuationFonciereResolver, ContribuationFonciereTransitionResolver } from './contribution-fonciere-resolver';

import { ContributionFonciereComponent } from './contribution-fonciere.component';
import { EditionContributionFonciereComponent } from './edition-contribution-fonciere/edition-contribution-fonciere.component';
import { VueContributionFonciereComponent } from './vue-contribution-fonciere/vue-contribution-fonciere.component';





const routes: Routes = [{ path: '', component: ContributionFonciereComponent },
  { 
    path: 'edition', component: EditionContributionFonciereComponent,  
    resolve: {processus: ContribuationFonciereProcessusResolver}
  },
   {path: 'edition/:numero/:transition', component: EditionContributionFonciereComponent,
    resolve: {contributionFonciere: ContribuationFonciereResolver, transition: ContribuationFonciereTransitionResolver, 
      processus: ContribuationFonciereProcessusResolver}
    },
  {  
    path:'view/:numero', component: VueContributionFonciereComponent, 
     resolve: {contributionFonciere: ContribuationFonciereResolver}
    }];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContributionFonciereRoutingModule { }
