import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActeursRoutingModule } from './acteurs-routing.module';

import { ListActeursComponent } from './list-acteurs/list-acteurs.component';
import { ActeurCardComponent } from './acteur-card/acteur-card.component';
import {GeneralGlobalSharedModule} from '@sycadShared/generalShared.module';
import {MatButtonIndicatorSharedModule} from '@sycadApp/shared/material-modules/materialButtonIndicatorShared.module';
import {MatPopupModalSharedModule} from '@sycadApp/shared/material-modules/materialPopupModalShared.module';
import {MatFormControlSharedModule} from '@sycadApp/shared/material-modules/materialFormControlShared.module';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDividerModule} from '@angular/material/divider';
import {MatMenuModule} from '@angular/material/menu';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSelectModule} from '@angular/material/select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatPaginatorIntl, MatPaginatorModule} from '@angular/material/paginator';
import { CategorieActeurService } from '@sycadApp/services/data-references/system/categorie-acteur.service';
import { StatusJuridiqueService } from '@sycadApp/services/data-references/system/status-juridique.service';
import {CiviliteService} from '@sycadApp/services/data-references/system/civilite-service.service';
import {UploadSharedModule} from '@sycadShared/uploadShared.module';
import { LocaliteService } from '@sycadApp/services/data-references/territoire/localite.service';
import { NationaliteService } from '@sycadApp/services/data-references/system/nationalite.service';
import { RegimeFiscalService } from '@sycadApp/services/impot/regime-fiscal.service';

import { SecteurActiviteService } from '@sycadApp/services/data-references/system/secteur-activite.service';
import { ParcelleService } from '@sycadApp/services/cession-parcelle/parcelle.service';
import { ActeurFormPageComponent } from './acteur-form-page/acteur-form-page.component';
import { PieceOfficielleService } from '@sycadApp/services/data-references/system/piece-officielle.service';

import {ActeurResolver} from '@sycadFeature/annuaire-identite-domaine/acteurs/acteur.resolver';
import {MatListModule} from '@angular/material/list';
import { ContactContribuableService } from '@sycadApp/services/data-references/system/contact.service';

import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';
import {ActeursService} from '@sycadApp/services/data-references/contribuables/acteurs.service';
import { GenericsFormModule } from '@sycadApp/shared/form-components/generic-form.module';
import {AgentRoutingModule} from '@sycadFeature/annuaire-identite-domaine/agents/agent-routing.module';
import {
  ActeurListeComponent
} from "@sycadFeature/annuaire-identite-domaine/acteurs/list-acteurs/acteur-liste/acteur-liste.component";
import { ContribuableServicesProvidersModule } from '@sycadApp/shared/form-components/annuaire-identite/contribuable-services-providers/contribuable-providers.module';


@NgModule({
  declarations: [ListActeursComponent, ActeurCardComponent, ActeurFormPageComponent,ActeurListeComponent],
  imports: [
    CommonModule,
    ActeursRoutingModule,
    GeneralGlobalSharedModule,
    MatButtonIndicatorSharedModule,
    MatPopupModalSharedModule,
    MatFormControlSharedModule,
    MatNativeDateModule,
    MatDividerModule,
    MatMenuModule,
    MatCardModule,
    MatTabsModule,
    MatListModule,
    MatSelectModule,
    FormsModule,
    MatGridListModule,
    MatExpansionModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    AgentRoutingModule,
    UploadSharedModule,
    GenericsFormModule,
    ContribuableServicesProvidersModule
  ],
  providers: [ActeursService, CategorieActeurService, StatusJuridiqueService, CiviliteService, NationaliteService, RegimeFiscalService,
    SecteurActiviteService, PieceOfficielleService, ActeurResolver, ContactContribuableService,
    CategoriePieceService, LocaliteService, ParcelleService]
})
export class ActeursModule { }
