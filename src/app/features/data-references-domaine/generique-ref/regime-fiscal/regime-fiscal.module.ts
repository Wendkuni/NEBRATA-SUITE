import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegimeFiscalRoutingModule } from './regime-fiscal-routing.module';
import { RegimeFiscalComponent } from './regime-fiscal.component';
import { RegimeFiscalService } from '@sycadApp/services/impot/regime-fiscal.service';
import { FormRegimeFiscalComponent } from './form-regime-fiscal/form-regime-fiscal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { GeneralGlobalSharedModule } from '@sycadApp/shared/generalShared.module';
import { MatButtonIndicatorSharedModule } from '@sycadApp/shared/material-modules/materialButtonIndicatorShared.module';
import { MatFormControlSharedModule } from '@sycadApp/shared/material-modules/materialFormControlShared.module';
import { MatPopupModalSharedModule } from '@sycadApp/shared/material-modules/materialPopupModalShared.module';


@NgModule({
  declarations: [RegimeFiscalComponent, FormRegimeFiscalComponent],
  imports: [
    CommonModule,
    RegimeFiscalRoutingModule,
    GeneralGlobalSharedModule,
    MatButtonIndicatorSharedModule,
    MatPopupModalSharedModule,
    MatFormControlSharedModule,
    MatNativeDateModule,
    MatDividerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatMenuModule,
    MatCardModule,
    MatTabsModule,
    FormsModule,
    MatGridListModule,
    MatExpansionModule,
    ReactiveFormsModule,
  ],
  providers: [RegimeFiscalService],
  entryComponents: [FormRegimeFiscalComponent]
})
export class RegimeFiscalModule { }
