import { NgModule } from '@angular/core';
import { GeneralGlobalSharedModule } from '@sycadApp/shared/generalShared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonIndicatorSharedModule } from '@sycadApp/shared/material-modules/materialButtonIndicatorShared.module';
import { MatFormControlSharedModule } from '@sycadApp/shared/material-modules/materialFormControlShared.module';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPopupModalSharedModule } from '@sycadApp/shared/material-modules/materialPopupModalShared.module';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { ProfilesService } from '@sycadApp/services/data-references/security/profiles.service';
import { RolesService } from '@sycadApp/services/data-references/security/roles-services';
import { MatPaginatorModule } from '@angular/material/paginator';
import {ContribuableMoralListComponent} from "@sycadFeature/annuaire-identite-domaine/contribuable-moral/list-contribuable-moral/list-contribuable-moral";
import {ContribuableMoralCardComponent} from "@sycadFeature/annuaire-identite-domaine/contribuable-moral/contribuable-moral-card/contribuale-moral-card.component";
import {ContribuableMoralRoutingModule} from "@sycadFeature/annuaire-identite-domaine/contribuable-moral/contribuable-moral-routing.module";

import { StatusJuridiqueService } from '@sycadApp/services/data-references/system/status-juridique.service';
import {MatSelectModule} from '@angular/material/select';
import {UploadSharedModule} from '@sycadShared/uploadShared.module';
import {CiviliteService} from '@sycadApp/services/data-references/system/civilite-service.service';
import { LocaliteService } from '@sycadApp/services/data-references/territoire/localite.service';
import { NationaliteService } from '@sycadApp/services/data-references/system/nationalite.service';
import { RegimeFiscalService } from '@sycadApp/services/impot/regime-fiscal.service';

import { SecteurActiviteService } from '@sycadApp/services/data-references/system/secteur-activite.service';
import { ContribuableMoralFormPageComponent } from './contribuable-moral-form-page/contribuable-moral-form-page.component';
import { GenericsFormModule } from '@sycadApp/shared/form-components/generic-form.module';;
import {ContribuableMoralResolver} from '@sycadFeature/annuaire-identite-domaine/contribuable-moral/contribuable-moral.resolver';
import { PieceOfficielleService } from '@sycadApp/services/data-references/system/piece-officielle.service';

import { ContactContribuableService } from '@sycadApp/services/data-references/system/contact.service';

import {MatListModule} from '@angular/material/list';
import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';
import { ParcelleService } from '@sycadApp/services/cession-parcelle/parcelle.service';
import {ContribuableMoralService} from '@sycadApp/services/data-references/contribuables/contribuable-moral-service';
import {
  ListeContribuableMoralComponent
} from "@sycadFeature/annuaire-identite-domaine/contribuable-moral/liste-contribuable-moral/liste-contribuable-moral.component";
import { ContribuableServicesProvidersModule } from '@sycadApp/shared/form-components/annuaire-identite/contribuable-services-providers/contribuable-providers.module';


@NgModule({
  declarations: [ContribuableMoralListComponent,ListeContribuableMoralComponent, ContribuableMoralCardComponent, ContribuableMoralFormPageComponent],
    imports: [
        GeneralGlobalSharedModule,
        MatButtonIndicatorSharedModule,
        MatPopupModalSharedModule,
        MatFormControlSharedModule,
        MatNativeDateModule,
        MatDividerModule,
        MatMenuModule,
        MatCardModule,
        MatTabsModule,
        FormsModule,
        MatGridListModule,
        MatExpansionModule,
        ReactiveFormsModule,
        MatPaginatorModule,
        ContribuableMoralRoutingModule,
        MatSelectModule,
        UploadSharedModule,
        GenericsFormModule,
        MatListModule,
        ContribuableServicesProvidersModule
    ],
  providers: [StatusJuridiqueService, ProfilesService, RolesService, ContribuableMoralService,
    CategoriePieceService, CiviliteService, LocaliteService, NationaliteService, PieceOfficielleService,
    ContactContribuableService, RegimeFiscalService, SecteurActiviteService, ParcelleService, ContribuableMoralResolver]
})
export class ContribuableMoralModule { }
