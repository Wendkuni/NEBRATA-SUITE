import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AgentComponent } from '@sycadFeature/annuaire-identite-domaine/agents/agent.component';
import { FormPageAgentComponent } from '@sycadFeature/annuaire-identite-domaine/agents/agent-form-page/form-page-agent/form-page-agent.component';
import { AgentResolver } from '@sycadFeature/annuaire-identite-domaine/agents/agent.resolver';
import {
  FormPageAffectationComponent
} from "@sycadFeature/annuaire-identite-domaine/agents/agent-form-page/agent-form-affectation/form-page-affectation/form-page-affectation.component";
import {
  FormPageCompteComponent
} from "@sycadFeature/annuaire-identite-domaine/agents/agent-form-page/form-page-compte/form-page-compte.component";




const routes: Routes = [
  { path: "", component: AgentComponent },
  { path: "edition", component: FormPageAgentComponent,data: { breadcrumb: "edition" } },
  { path: "edition/:guid", component: FormPageAgentComponent ,     resolve: { agent: AgentResolver },data: { breadcrumb: "edition" } },
  { path: "affectation/:guid", component:  FormPageAffectationComponent,     resolve: { agent: AgentResolver },data: { breadcrumb: "Affectation" } },
  { path: "compte/:guid", component:  FormPageCompteComponent,     resolve: { agent: AgentResolver },data: { breadcrumb: "Gestion de compte" } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgentRoutingModule {}
