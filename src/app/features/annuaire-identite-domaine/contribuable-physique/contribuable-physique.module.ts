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
import { GenericsFormModule } from "@sycadApp/shared/form-components/generic-form.module";
import {MatPaginatorModule} from '@angular/material/paginator';
import { TitreHonorifiqueService } from '@sycadApp/services/data-references/system/titreHonorifique.service';
import { SituationMatrimonialeService } from '@sycadApp/services/data-references/system/situationMatrimoniale.service';
import { BureauService } from '@sycadApp/services/data-references/organigramme/bureau.service';
import { ServiceAdministratifService } from '@sycadApp/services/data-references/organigramme/ServiceAdministratif.service';
import { ProfilesService } from '@sycadApp/services/data-references/security/profiles.service';
import { RolesService } from '@sycadApp/services/data-references/security/roles-services';
import { ProfessionService } from '@sycadApp/services/data-references/system/profession.service';
import {StructureService} from '@sycadApp/services/data-references/organigramme/structure.service';
import {AgentsService} from '@sycadApp/services/data-references/contribuables/agent.service';
import { ArrondissementsService } from '@sycadApp/services/data-references/territoire/arrondissements.service';
import { ProvincesService } from '@sycadApp/services/data-references/territoire/provinces.service';
import { PieceOfficielleService } from '@sycadApp/services/data-references/system/piece-officielle.service';

import { StatusJuridiqueService } from '@sycadApp/services/data-references/system/status-juridique.service';
import { ContactContribuableService } from '@sycadApp/services/data-references/system/contact.service';

import {FormPageContribuablePhysiqueComponent} from "@sycadFeature/annuaire-identite-domaine/contribuable-physique/contribuable-physique-form-page/form-page-contribuable-physique/form-page-contribuable-physique.component";
import {ContribuablePhysiqueComponent} from "@sycadFeature/annuaire-identite-domaine/contribuable-physique/contribuable-physique.component";
import {ContribuablePhysiqueRoutingModule} from "@sycadFeature/annuaire-identite-domaine/contribuable-physique/contribuable-physique-routing.module";
import {ContribuablePhysiqueCardComponent} from "@sycadFeature/annuaire-identite-domaine/contribuable-physique/contribuable-physique-card/contribuable-physique-card.component";
import {ContribuablePhysiqueResolver} from "@sycadFeature/annuaire-identite-domaine/contribuable-physique/contribuable-physique.resolver";
import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';
import {ContribuablePhysiqueService} from '@sycadApp/services/data-references/contribuables/contribuable-physique.service';
import {
  ListeContribuablePhysiqueComponent
} from "@sycadFeature/annuaire-identite-domaine/contribuable-physique/liste-contribuable-physique/liste-contribuable-physique.component";
import { ContribuableServicesProvidersModule } from "@sycadApp/shared/form-components/annuaire-identite/contribuable-services-providers/contribuable-providers.module";

@NgModule({
  declarations: [ContribuablePhysiqueComponent, FormPageContribuablePhysiqueComponent,ContribuablePhysiqueCardComponent,ListeContribuablePhysiqueComponent],
  imports: [
    CommonModule,
    ContribuablePhysiqueRoutingModule,
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
  providers: [ContribuablePhysiqueResolver, ContribuablePhysiqueService, PieceOfficielleService,ParcelleService,StatusJuridiqueService,ContactContribuableService,
    TitreHonorifiqueService,NationaliteService,ProfessionService, SituationMatrimonialeService,
    LocaliteService,AgentsService,CiviliteService,ProvincesService,ArrondissementsService,
    BureauService,ServiceAdministratifService,StructureService,CategoriePieceService, ProfilesService, RolesService,
],
})
export class ContribuablePhysiqueModule {}
