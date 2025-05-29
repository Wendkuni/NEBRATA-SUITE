import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { IndivisionsRoutingModule } from "./indivisions-routing.module";
import { IndivisionsComponent } from "./indivisions.component";
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
import { IndivisionrelationService } from '@sycadApp/services/data-references/contribuables/indivisionRelation.service';
import {ContribuablePhysiqueService} from '@sycadApp/services/data-references/contribuables/contribuable-physique.service';
import { MatListModule } from '@angular/material/list';
import { StatusJuridiqueService } from '@sycadApp/services/data-references/system/status-juridique.service';
import {CiviliteService} from '@sycadApp/services/data-references/system/civilite-service.service';
import { LocaliteService } from '@sycadApp/services/data-references/territoire/localite.service';
import {UploadSharedModule} from '@sycadShared/uploadShared.module';
import { NationaliteService } from '@sycadApp/services/data-references/system/nationalite.service';
import { ParcelleService } from '@sycadApp/services/cession-parcelle/parcelle.service';
import { FormPageIndivisionComponent } from './form-page/form-page-indivision/form-page-indivision.component';
import { GenericsFormModule } from "@sycadApp/shared/form-components/generic-form.module";
import { MatPaginatorModule } from '@angular/material/paginator';
import { IndivisionCardComponent } from './indivision-card/indivision-card.component';
import { IndivisionsResolver } from './indivisions.resolver';
import { PieceOfficielleService } from '@sycadApp/services/data-references/system/piece-officielle.service';

import { ContactContribuableService } from '@sycadApp/services/data-references/system/contact.service';

import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';
import {IndivisionsService} from '@sycadApp/services/data-references/contribuables/indivisions.service';
import {
  ListeIndivisionComponent
} from "@sycadFeature/annuaire-identite-domaine/indivisions/liste-indivision/liste-indivision.component";
import { ContribuableServicesProvidersModule } from "@sycadApp/shared/form-components/annuaire-identite/contribuable-services-providers/contribuable-providers.module";
@NgModule({
  declarations: [IndivisionsComponent,ListeIndivisionComponent, FormPageIndivisionComponent,IndivisionCardComponent],
  imports: [
    CommonModule,
    IndivisionsRoutingModule,
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
  providers: [IndivisionsService, IndivisionrelationService,
    ContribuablePhysiqueService, StatusJuridiqueService, ParcelleService,PieceOfficielleService,ContactContribuableService,
    CiviliteService, CategoriePieceService, LocaliteService, NationaliteService,IndivisionsResolver],
})
export class IndivisionsModule {}
