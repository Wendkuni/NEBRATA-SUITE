import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusJuridiqueService } from '@sycadApp/services/data-references/system/status-juridique.service';
import { AppSettingsService } from '@sycadApp/config/app.settings.service';
import { AppConfirmService } from '@sycadApp/shared/app-confirm/app-confirm.service';
import { NationaliteService } from '@sycadApp/services/data-references/system/nationalite.service';
import { IndivisionrelationService } from '@sycadApp/services/data-references/contribuables/indivisionRelation.service';
import { IndivisionsService } from '@sycadApp/services/data-references/contribuables/indivisions.service';
import { ContactContribuableService } from '@sycadApp/services/data-references/system/contact.service';
import { ContribuableMoralService } from '@sycadApp/services/data-references/contribuables/contribuable-moral-service';
import { ProfessionService } from '@sycadApp/services/data-references/system/profession.service';
import { ContribuablePhysiqueService } from '@sycadApp/services/data-references/contribuables/contribuable-physique.service';
import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';
import { IFUApiService } from '../../data-references-domaine/recherche-ifu/api-ifu.service';
import { ONIApiService } from '../../data-references-domaine/recherche-oni/api-oni.service';
import { LocaliteService } from '@sycadApp/services/data-references/territoire/localite.service';
import { SituationMatrimonialeService } from '@sycadApp/services/data-references/system/situationMatrimoniale.service';
import { CommunesService } from '@sycadApp/services/data-references/territoire/communes.service';
import { QuartierService } from '@sycadApp/services/data-references/territoire/quartier.service';
import { MatStepper } from '@angular/material/stepper';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    AppSettingsService, StatusJuridiqueService, AppConfirmService, NationaliteService, IndivisionrelationService, IndivisionsService, ContactContribuableService, ContribuableMoralService, ProfessionService, ContribuablePhysiqueService, CategoriePieceService, IFUApiService, ONIApiService, LocaliteService, SituationMatrimonialeService, CommunesService,
    QuartierService, MatStepper
  ]
})
export class ContribuableServicesProvidersModule { }
