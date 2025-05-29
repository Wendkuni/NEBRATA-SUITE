import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DroitImmobilierRoutingModule } from './droit-immobilier-routing.module';
import { DroitImmobilierComponent } from './droit-immobilier.component';
import { FormDroitImmobilierComponent } from '@sycadFeature/data-references-domaine/generique-ref/droit-immobilier/form-droit-immobilier/form-droit-immobilier.component';
import { TypeImmeubleService } from '@sycadApp/services/bornage/type-immeuble.service';
import {GeneralGlobalSharedModule} from '@sycadShared/generalShared.module';
import {MatButtonIndicatorSharedModule} from '@sycadShared/material-modules/materialButtonIndicatorShared.module';
import {MatPopupModalSharedModule} from '@sycadShared/material-modules/materialPopupModalShared.module';
import {MatFormControlSharedModule} from '@sycadShared/material-modules/materialFormControlShared.module';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDividerModule} from '@angular/material/divider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatExpansionModule} from '@angular/material/expansion';
import {
  DroitImmobilierService
} from "@sycadApp/services/data-references/system/droit-immobilier.service";
import {
  DroitImmobilierResolver
} from "@sycadFeature/data-references-domaine/generique-ref/droit-immobilier/droit-immobilier-resolver";
import {
  DroitImmobilier,
} from "@sycadApp/models/data-references/system/droit-immobilier.model";
import {AngularEditorModule} from "@kolkov/angular-editor";



@NgModule({
  declarations: [DroitImmobilierComponent, FormDroitImmobilierComponent],
  imports: [
    CommonModule,
    DroitImmobilierRoutingModule,
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
    AngularEditorModule
  ],
  providers: [DroitImmobilierService,DroitImmobilierResolver,DroitImmobilier],
  entryComponents: [FormDroitImmobilierComponent]
})
export class DroitImmobilierModule { }
