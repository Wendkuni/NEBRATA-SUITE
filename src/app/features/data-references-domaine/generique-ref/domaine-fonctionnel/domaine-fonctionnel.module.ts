import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DomaineFonctionnelComponent } from './domaine-fonctionnel.component';
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
  DomaineFonctionnelRoutingModule
} from "@sycadFeature/data-references-domaine/generique-ref/domaine-fonctionnel/domaine-fonctionnel-routing.module";
import {
  DomaineFonctionnelService
} from "@sycadApp/services/data-references/system/domaine-fonctionnel.service";
import {
  DomaineFonctionnel
} from "@sycadApp/models/data-references/system/domaine-fonctionnel.model";
import {
  DomaineFonctionnelResolver
} from "@sycadFeature/data-references-domaine/generique-ref/domaine-fonctionnel/domaine-fonctionnel-resolver";
import {
  FormDomaineFonctionnelComponent
} from "@sycadFeature/data-references-domaine/generique-ref/domaine-fonctionnel/form-domaine-fonctionnel/form-domaine-fonctionnel.component";
import {AngularEditorModule} from "@kolkov/angular-editor";



@NgModule({
  declarations: [DomaineFonctionnelComponent, FormDomaineFonctionnelComponent],
  imports: [
    CommonModule,
    DomaineFonctionnelRoutingModule,
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
  providers: [DomaineFonctionnelService,DomaineFonctionnelResolver,DomaineFonctionnel],
  entryComponents: [FormDomaineFonctionnelComponent]
})
export class DomaineFonctionnelModule { }
