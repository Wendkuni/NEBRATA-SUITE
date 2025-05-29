import { NgModule } from '@angular/core';
import { FilArianeProcessusComponent } from './fil-ariane-processus/fil-ariane-processus.component';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatExpansionModule } from '@angular/material/expansion';

import { MatStepperModule } from '@angular/material/stepper';
import { HistoriqueComponent } from './historique/historique.component';
import { EnteteComponent } from './entete/entete.component';
import { MatListModule } from '@angular/material/list';
import { TransmissionComponent } from './transmission/transmission.component';
import { TransmissionCreateurComponent } from './transmission-createur/transmission-createur.component';
import {MatTableModule} from '@angular/material/table';
import { HistoriqueWorkflowService } from '@sycadApp/services/data-references/system/historique.service';
import { EnteteDossierService } from '@sycadApp/services/workflow/entete.service';
import { GeneralGlobalSharedModule } from '@sycadApp/shared/generalShared.module';
import { MatButtonIndicatorSharedModule } from '@sycadApp/shared/material-modules/materialButtonIndicatorShared.module';
import { MatFormControlSharedModule } from '@sycadApp/shared/material-modules/materialFormControlShared.module';
import { UploadSharedModule } from '@sycadApp/shared/uploadShared.module';
import { GenericsFormModule } from '../generic-form.module';
import { AnnulationDossierTransitionComponent } from './annulation-dossier-transition/annulation-dossier-transition.component';
import { RenvoyerDossierTransitionComponent } from './renvoyer-dossier-transition/renvoyer-dossier-transition.component';
import { ExonerationFormComponent } from './exoneration-form/exoneration-form.component';
import { ExonerationService } from '@sycadApp/services/impot/exoneration.service';
import { EnvoyerAvecObservationDossierTransitionComponent } from './envoyer-avec-observation-dossier-transition/envoyer-avec-observation-dossier-transition.component';
import { ActionDetailDossierComponent } from './action-detail-dossier/action-detail-dossier.component';
import { MatMenuModule } from '@angular/material/menu';
import {
  MotifRejetService
} from "@sycadApp/services/data-references/system/motif-rejet.service";
import { DocumentShapefileScanComponent } from './document-shapefile-scan/document-shapefile-scan.component';
import { DetailsProcessusTabPaneComponent } from './details-processus-tab-pane/details-processus-tab-pane.component';
import { PipesModule } from '@sycadApp/pipes/pipes.module';


@NgModule({
    declarations: [FilArianeProcessusComponent, EnvoyerAvecObservationDossierTransitionComponent,HistoriqueComponent, EnteteComponent, TransmissionComponent, TransmissionCreateurComponent, AnnulationDossierTransitionComponent,ExonerationFormComponent, RenvoyerDossierTransitionComponent, ActionDetailDossierComponent, DocumentShapefileScanComponent,DetailsProcessusTabPaneComponent],
    imports: [
        GeneralGlobalSharedModule,
        MatButtonIndicatorSharedModule,
        MatFormControlSharedModule,
        MatNativeDateModule,
        MatDividerModule,
        MatFormFieldModule,
        MatTooltipModule,
        MatListModule,
        MatSelectModule,
        MatInputModule,
        GenericsFormModule,
        MatMenuModule,
        MatCardModule,
        MatTabsModule,
        FormsModule,
        MatGridListModule,
        MatExpansionModule,
        UploadSharedModule,
        ReactiveFormsModule,
        MatStepperModule,
        MatTableModule,

    ],
    exports: [
        FilArianeProcessusComponent,
        HistoriqueComponent,
        EnteteComponent,
        TransmissionComponent,
        ExonerationFormComponent,
        TransmissionCreateurComponent,
        MatStepperModule,
        GeneralGlobalSharedModule,
        MatButtonIndicatorSharedModule,
        MatFormControlSharedModule,
        MatNativeDateModule,
        MatDividerModule,
        MatFormFieldModule,
        GenericsFormModule,
        MatTooltipModule,
        //  MatListModule,
        MatSelectModule,
        MatInputModule,
        MatMenuModule,
        MatCardModule,
        MatTabsModule,
        FormsModule,
        MatGridListModule,
        MatExpansionModule,
        UploadSharedModule,
        ReactiveFormsModule,
        MatStepperModule,
        AnnulationDossierTransitionComponent,
        RenvoyerDossierTransitionComponent,
        EnvoyerAvecObservationDossierTransitionComponent,
        ActionDetailDossierComponent,
        DocumentShapefileScanComponent,
        PipesModule,
        DetailsProcessusTabPaneComponent

    ],
    providers: [
      HistoriqueWorkflowService, EnteteDossierService,ExonerationService,MotifRejetService
    ]
  })
  export class GlobalWorkflowModule { }
