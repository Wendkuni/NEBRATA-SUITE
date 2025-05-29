import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreationCompteProcessusResolver, CreationCompteResolver, CreationCompteTransitionResolver } from './compte-resolver';
import { EditionCreationUserComponent } from './edition-creation-user/edition-creation-user.component';
import { GestionCompteComponent } from './gestion-compte.component';
import { VisualiserComponent } from './visualiser/visualiser.component';



const routes: Routes = [{ path: '', component: GestionCompteComponent },
   {path: 'edition/:numero/:transition', component: EditionCreationUserComponent,
    resolve: {compteContribuable: CreationCompteResolver, transition: CreationCompteTransitionResolver, processus: CreationCompteProcessusResolver}},
  {path:'view/:numero', component: VisualiserComponent, resolve: {compteContribuable: CreationCompteResolver}}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionCompteRoutingModule { }
