import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendrierFiscaleRoutingModule } from './calendrier-fiscale-routing.module';
import { CalendrierFiscaleComponent } from './calendrier-fiscale.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GeneralGlobalSharedModule } from '@sycadApp/shared/generalShared.module';
import { MatButtonIndicatorSharedModule } from '@sycadApp/shared/material-modules/materialButtonIndicatorShared.module';
import { MatFormControlSharedModule } from '@sycadApp/shared/material-modules/materialFormControlShared.module';
import { UploadSharedModule } from '@sycadApp/shared/uploadShared.module';
import { ExerciceFiscaleService } from '@sycadApp/services/impot/exercice-fiscale.service';
import { NatureImpotService } from '@sycadApp/services/impot/nature-impot.service';
import { CalendrierFiscaleService } from '@sycadApp/services/impot/calendrier-fiscale.service';


@NgModule({
  declarations: [CalendrierFiscaleComponent],
  imports: [
    CommonModule,
    CalendrierFiscaleRoutingModule,
    GeneralGlobalSharedModule,
    MatButtonIndicatorSharedModule,
    MatFormControlSharedModule,
    MatNativeDateModule,
    MatDividerModule,
    MatFormFieldModule,
    MatTooltipModule,
    //  MatListModule,
    MatSelectModule,
    MatInputModule,
    // MatMenuModule,
    MatCardModule,
    MatTabsModule,
    FormsModule,
    MatGridListModule,
    MatExpansionModule,
    UploadSharedModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatListModule
  ],
  providers: [ExerciceFiscaleService,NatureImpotService,CalendrierFiscaleService]
})
export class CalendrierFiscaleModule { }
