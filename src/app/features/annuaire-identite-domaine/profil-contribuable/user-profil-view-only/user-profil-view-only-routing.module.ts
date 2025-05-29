import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AgentProfilComponent } from "./agent-profil/agent-profil.component";
import { ContribuableMoralProfilComponent } from "./contribuable-moral-profil/contribuable-moral-profil.component";
import { ContribuablePhysiqueProfilComponent } from "./contribuable-physique-profil/contribuable-physique-profil.component";
import { ActeurProfilComponent } from "./acteur-profil/acteur-profil.component";
import { IndivisionProfilComponent } from "./indivision-profil/indivision-profil.component";
import { AgentResolverService, ContribuableMoralResolverService, ContribuablePhysiqueResolverService, ActeurResolverService, IndivisionResolverService } from '@sycadApp/services/data-references/system/user-profil-view-only-resolver.service';


const routes: Routes = [
  {
    path: "agent/:guid",
    component: AgentProfilComponent,
    resolve: { agent: AgentResolverService },
  },
  {
    path: "contribuable-moral/:guid",
    component: ContribuableMoralProfilComponent,
    resolve: { contribuable: ContribuableMoralResolverService },
  },
  {
    path: "contribuable-physique/:guid",
    component: ContribuablePhysiqueProfilComponent,
    resolve: { contribuable: ContribuablePhysiqueResolverService },
  },
  {
    path: "acteur/:guid",
    component: ActeurProfilComponent,
    resolve: { acteur: ActeurResolverService },
  },
  {
    path: "indivision/:guid",
    component: IndivisionProfilComponent,
    resolve: { indivision: IndivisionResolverService },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserProfilViewOnlyRoutingModule {}
