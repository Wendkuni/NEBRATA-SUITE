import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { GeneralGlobalSharedModule } from "@sycadShared/generalShared.module";
import { MatButtonIndicatorSharedModule } from "@sycadApp/shared/material-modules/materialButtonIndicatorShared.module";
import { MatPopupModalSharedModule } from "@sycadApp/shared/material-modules/materialPopupModalShared.module";
import { MatFormControlSharedModule } from "@sycadApp/shared/material-modules/materialFormControlShared.module";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatCardModule } from "@angular/material/card";
import { MatTabsModule } from "@angular/material/tabs";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatStepperModule } from "@angular/material/stepper";
import { MatListModule } from '@angular/material/list';
import {CiviliteService} from '@sycadApp/services/data-references/system/civilite-service.service';
import { LocaliteService } from '@sycadApp/services/data-references/territoire/localite.service';
import {UploadSharedModule} from '@sycadShared/uploadShared.module';
import { NationaliteService } from '@sycadApp/services/data-references/system/nationalite.service';
import { ParcelleService } from '@sycadApp/services/cession-parcelle/parcelle.service';
import {MatPaginatorModule} from '@angular/material/paginator';
import {AgentComponent} from "@sycadFeature/annuaire-identite-domaine/agents/agent.component";

import {AgentRoutingModule} from "@sycadFeature/annuaire-identite-domaine/agents/agent-routing.module";
import { TitreHonorifiqueService } from '@sycadApp/services/data-references/system/titreHonorifique.service';
import { SituationMatrimonialeService } from '@sycadApp/services/data-references/system/situationMatrimoniale.service';
import { BureauService } from '@sycadApp/services/data-references/organigramme/bureau.service';
import { ServiceAdministratifService } from '@sycadApp/services/data-references/organigramme/ServiceAdministratif.service';
import { ProfilesService } from '@sycadApp/services/data-references/security/profiles.service';
import { RolesService } from '@sycadApp/services/data-references/security/roles-services';
import { ProfessionService } from '@sycadApp/services/data-references/system/profession.service';
import {StructureService} from '@sycadApp/services/data-references/organigramme/structure.service';

import { ArrondissementsService } from '@sycadApp/services/data-references/territoire/arrondissements.service';
import { ProvincesService } from '@sycadApp/services/data-references/territoire/provinces.service';
import { PieceOfficielleService } from '@sycadApp/services/data-references/system/piece-officielle.service';

import { StatusJuridiqueService } from '@sycadApp/services/data-references/system/status-juridique.service';
import { ContactContribuableService } from '@sycadApp/services/data-references/system/contact.service';
import { AgentCardComponent } from '@sycadFeature/annuaire-identite-domaine/agents/agent-card/agent-card.component';
import { AgentResolver } from '@sycadFeature/annuaire-identite-domaine/agents/agent.resolver';
import { FormPageAgentComponent } from './agent-form-page/form-page-agent/form-page-agent.component';
import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';
import {AgentsService} from '@sycadApp/services/data-references/contribuables/agent.service';
import { GenericsFormModule } from "@sycadApp/shared/form-components/generic-form.module";
import {
  FormPageAffectationComponent
} from "@sycadFeature/annuaire-identite-domaine/agents/agent-form-page/agent-form-affectation/form-page-affectation/form-page-affectation.component";
import {
  FormPageCompteComponent
} from "@sycadFeature/annuaire-identite-domaine/agents/agent-form-page/form-page-compte/form-page-compte.component";
import {
  AgentListeComponent
} from "@sycadFeature/annuaire-identite-domaine/agents/agent-liste/agent-liste.component";
import { ContribuableServicesProvidersModule } from "@sycadApp/shared/form-components/annuaire-identite/contribuable-services-providers/contribuable-providers.module";

@NgModule({
  declarations: [AgentComponent, FormPageAgentComponent,AgentCardComponent,AgentListeComponent, FormPageAffectationComponent, FormPageCompteComponent],
  imports: [
    CommonModule,
    AgentRoutingModule,
    GeneralGlobalSharedModule,
    MatButtonIndicatorSharedModule,
    MatPopupModalSharedModule,
    MatFormControlSharedModule,
    MatNativeDateModule,
    MatDividerModule,
    MatFormFieldModule,
    MatListModule,
    MatSelectModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatCardModule,
    MatTabsModule,
    FormsModule,
    MatGridListModule,
    MatExpansionModule,
    ReactiveFormsModule,

    MatStepperModule,
    UploadSharedModule,
    NgOptionHighlightModule,
    GenericsFormModule,
    ContribuableServicesProvidersModule
  ],
  providers: [AgentResolver,PieceOfficielleService,ParcelleService,StatusJuridiqueService,ContactContribuableService,TitreHonorifiqueService,NationaliteService,ProfessionService, SituationMatrimonialeService,LocaliteService,AgentsService,CiviliteService,ProvincesService,ArrondissementsService,
    BureauService,ServiceAdministratifService,StructureService,CategoriePieceService, ProfilesService, RolesService
],
})
export class AgentsModule {}
