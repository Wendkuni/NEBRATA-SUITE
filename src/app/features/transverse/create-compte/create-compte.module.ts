import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateCompteRoutingModule } from './create-compte-routing.module';
import { CreateCompteComponent } from './create-compte.component';
import {GeneralGlobalSharedModule} from '@sycadApp/shared/generalShared.module';
import {MatButtonIndicatorSharedModule} from '@sycadApp/shared/material-modules/materialButtonIndicatorShared.module';
import {MatPopupModalSharedModule} from '@sycadApp/shared/material-modules/materialPopupModalShared.module';
import {MatFormControlSharedModule} from '@sycadApp/shared/material-modules/materialFormControlShared.module';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDividerModule} from '@angular/material/divider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatListModule} from '@angular/material/list';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatStepperModule} from '@angular/material/stepper';
import {UploadSharedModule} from '@sycadApp/shared/uploadShared.module';
import {NgOptionHighlightModule} from '@ng-select/ng-option-highlight';
import {GenericsFormModule} from '@sycadApp/shared/form-components/generic-form.module';
import {CiviliteService} from '@sycadApp/services/data-references/system/civilite-service.service';
import {SituationMatrimonialeService} from '../../../services/data-references/system/situationMatrimoniale.service';
import {NationaliteService} from '@sycadApp/services/data-references/system/nationalite.service';
import {ProfessionService} from '@sycadApp/services/data-references/system/profession.service';
import {TitreHonorifiqueService} from '@sycadApp/services/data-references/system/titreHonorifique.service';
import {ContactContribuableService} from '@sycadApp/services/data-references/system/contact.service';
import {PieceOfficielleService} from '@sycadApp/services/data-references/system/piece-officielle.service';
import {CategoriePieceService} from '@sycadApp/services/data-references/system/categorie-piece.service';
import {LocaliteService} from '@sycadApp/services/data-references/territoire/localite.service';
import {ParcelleService} from '@sycadApp/services/cession-parcelle/parcelle.service';
import {CategorieActeurService} from '@sycadApp/services/data-references/system/categorie-acteur.service';
import {RegimeFiscalService} from '@sycadApp/services/impot/regime-fiscal.service';
import {SecteurActiviteService} from '@sycadApp/services/data-references/system/secteur-activite.service';
import {StatusJuridiqueService} from '@sycadApp/services/data-references/system/status-juridique.service';
import {ContribuablePhysiqueService} from '@sycadApp/services/data-references/contribuables/contribuable-physique.service';
import {ContribuableMoralService} from '@sycadApp/services/data-references/contribuables/contribuable-moral-service';
import { FormAgentComponent } from './form-agent/form-agent.component';
import { FormContribuablePhysiqueComponent } from './form-contribuable-physique/form-contribuable-physique.component';
import { FormContribuableMoralComponent } from './form-contribuable-moral/form-contribuable-moral.component';
import { FormActeurComponent } from './form-acteur/form-acteur.component';
import {AgentsService} from '@sycadApp/services/data-references/contribuables/agent.service';
import {ActeursService} from '@sycadApp/services/data-references/contribuables/acteurs.service';
import {BureauService} from '@sycadApp//services/data-references/organigramme/bureau.service';
import {StructureService} from '@sycadApp//services/data-references/organigramme/structure.service';
import {ServiceAdministratifService} from '@sycadApp//services/data-references/organigramme/ServiceAdministratif.service';
import { CompteService } from '@sycadApp/services/data-references/contribuables/compte.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormCreationComponent } from './form-creation/form-creation.component';
import { CreateCompteProcessusResolver, SaisieCreationCompteResolver } from './form-creation/create-compte-processus-resolver';
import { EnteteDossierService } from '@sycadApp/services/workflow/entete.service';
import { CommunesService } from '@sycadApp/services/data-references/territoire/communes.service';
import { ArrondissementsService } from '@sycadApp/services/data-references/territoire/arrondissements.service';
import { IlotService } from '@sycadApp/services/cession-parcelle/ilot.service';
import { SectionService } from '@sycadApp/services/cession-parcelle/section.service';
import { ChoixParcellePublicFormComponent } from './choix-parcelle-public-form/choix-parcelle-public-form.component';
import { DocumentParcelleFormComponent } from './document-parcelle-form/document-parcelle-form.component';
import { CompleterSaisieComponent } from './completer-saisie/completer-saisie.component';
import { InfoCompteComponent } from './info-compte/info-compte.component';
import { PieceOfficiellePubliqueFormComponent } from './piece-officielle-public-form/piece-officielle-public-form.component';
import { TextMaskModule } from 'angular2-text-mask';
import { ContribuableServicesProvidersModule } from '@sycadApp/shared/form-components/annuaire-identite/contribuable-services-providers/contribuable-providers.module';





@NgModule({
  declarations: [
    CreateCompteComponent,
    FormAgentComponent,
    FormContribuablePhysiqueComponent,
    FormContribuableMoralComponent,
    FormActeurComponent,
    FormCreationComponent,
    ChoixParcellePublicFormComponent,
    DocumentParcelleFormComponent,
    CompleterSaisieComponent,
    InfoCompteComponent,
    PieceOfficiellePubliqueFormComponent
  ],
  imports: [
    CommonModule,
    CreateCompteRoutingModule,
    MatSidenavModule,
    TextMaskModule,
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

    ContribuableServicesProvidersModule,
    MatStepperModule,
    UploadSharedModule,
    NgOptionHighlightModule,
    GenericsFormModule
  ],
  providers: [CiviliteService, SituationMatrimonialeService, NationaliteService, CompteService, SaisieCreationCompteResolver,
    ProfessionService, TitreHonorifiqueService, ContactContribuableService,
    PieceOfficielleService, CategoriePieceService, LocaliteService, ParcelleService,
    CategorieActeurService, RegimeFiscalService, SecteurActiviteService,
    StatusJuridiqueService, ContribuablePhysiqueService, ContribuableMoralService, CommunesService,ArrondissementsService, IlotService, SectionService,
    AgentsService, ActeursService, BureauService, StructureService, ServiceAdministratifService,CreateCompteProcessusResolver,EnteteDossierService]
})
export class CreateCompteModule { }
