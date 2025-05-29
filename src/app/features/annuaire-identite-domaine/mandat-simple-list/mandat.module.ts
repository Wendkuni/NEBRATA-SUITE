import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MandatRoutingModule } from './mandat-routing.module';
import { MandatComponent } from './mandat.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { PipesModule } from '@sycadApp/pipes/pipes.module';
import { GenericsFormModule } from "@sycadApp/shared/form-components/generic-form.module";
import { GeneralGlobalSharedModule } from '@sycadApp/shared/generalShared.module';
import { MatButtonIndicatorSharedModule } from '@sycadApp/shared/material-modules/materialButtonIndicatorShared.module';
import { MatDataTableSharedModule } from '@sycadApp/shared/material-modules/materialDataTableShared.module';
import { MatFormControlSharedModule } from '@sycadApp/shared/material-modules/materialFormControlShared.module';
import { MatPopupModalSharedModule } from '@sycadApp/shared/material-modules/materialPopupModalShared.module';
import { UploadSharedModule } from '@sycadApp/shared/uploadShared.module';
import { MandatService } from '@sycadApp/services/workflow/mandat.service';
import { MandatResolver } from './mandat-resolver';
import { ContribuableService } from '@sycadApp/services/data-references/system/contribuable.service';
import { RemoteAutocompeteModule } from '@sycadApp/shared/form-components/data-references-domaine/field-remote-autocomplete/remote-autocompete.module';
import {ProfessionService} from '@sycadApp/services/data-references/system/profession.service';
import {ContribuablePhysiqueService} from '@sycadApp/services/data-references/contribuables/contribuable-physique.service';
import {ContactContribuableService} from '@sycadApp/services/data-references/system/contact.service';
import {StatusJuridiqueService} from '@sycadApp/services/data-references/system/status-juridique.service';
import {NationaliteService} from '@sycadApp/services/data-references/system/nationalite.service';
import {ContribuableMoralService} from '@sycadApp/services/data-references/contribuables/contribuable-moral-service';
import {CategoriePieceService} from '@sycadApp/services/data-references/system/categorie-piece.service';
import { ContribuableServicesProvidersModule } from '@sycadApp/shared/form-components/annuaire-identite/contribuable-services-providers/contribuable-providers.module';


@NgModule({
  declarations: [MandatComponent],
    imports: [
        CommonModule,
        MandatRoutingModule,
        GeneralGlobalSharedModule,
        MatButtonIndicatorSharedModule,
        MatPopupModalSharedModule,
        MatFormControlSharedModule,
        MatNativeDateModule,
        MatDividerModule,
        PipesModule,
        MatMenuModule,
        MatCardModule,
        MatTabsModule,
        MatDataTableSharedModule,
        FormsModule,
        MatGridListModule,
        MatExpansionModule,
        ReactiveFormsModule,

        MatSelectModule,
        UploadSharedModule,
        MatStepperModule,
        GenericsFormModule,
        RemoteAutocompeteModule,
        ContribuableServicesProvidersModule
    ],
  providers: [MandatService, MandatResolver, ContribuableService, ProfessionService,
    ContribuablePhysiqueService, ContribuableService, ContactContribuableService, StatusJuridiqueService,
  NationaliteService, ContribuableMoralService, CategoriePieceService]
})
export class MandatModule { }
