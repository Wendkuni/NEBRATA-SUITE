import { Injectable, NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterModule, Routes } from '@angular/router';
import { EnteteDossierService } from '@sycadApp/services/workflow/entete.service';
import { ProcessusResolver } from '@sycadApp/shared/form-components/processus/transition/transition.resolver';
import { environment } from 'environments/environment';
import { catchError, map, of } from 'rxjs';
import { CompleterSaisieComponent } from './completer-saisie/completer-saisie.component';
import { CreateCompteComponent } from './create-compte.component';
import { CreateCompteProcessusResolver, SaisieCreationCompteResolver } from './form-creation/create-compte-processus-resolver';
import { FormCreationComponent } from './form-creation/form-creation.component';
import { InfoCompteComponent } from './info-compte/info-compte.component';

const routes: Routes = [
  { path: '', component: CreateCompteComponent },
  { path: 'type-compte/:type', component: FormCreationComponent,resolve: {processus:CreateCompteProcessusResolver}  },
  { path: 'completer-saisie/:numero/:token', component: CompleterSaisieComponent,resolve: { processus: CreateCompteProcessusResolver, compteContribuable: SaisieCreationCompteResolver }  },
  { path: 'info', component: InfoCompteComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateCompteRoutingModule { }

