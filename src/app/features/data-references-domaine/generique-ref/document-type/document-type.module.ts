import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentTypeRoutingModule } from './document-type-routing.module';
import { DocumentTypeComponent } from './document-type.component';
import { FormDocumentTypeComponent } from './form-document-type/form-document-type.component';
import {GeneralGlobalSharedModule} from '@sycadShared/generalShared.module';
import {MatButtonIndicatorSharedModule} from '@sycadApp/shared/material-modules/materialButtonIndicatorShared.module';
import {MatPopupModalSharedModule} from '@sycadApp/shared/material-modules/materialPopupModalShared.module';
import {MatFormControlSharedModule} from '@sycadApp/shared/material-modules/materialFormControlShared.module';
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
import { DocumentTypeService } from '@sycadApp/services/data-references/system/document-type.service';
import { DocumentTypeResolver } from './document-type-resolver';
import { DocumentType } from '@sycadApp/models/data-references/system/document-type.model';
import { GenericsFormModule } from '@sycadApp/shared/form-components/generic-form.module';
import { DestinationParcelleService } from '@sycadApp/services/bornage/destination-parcelle.service';
import { DroitImmobilierService } from '@sycadApp/services/data-references/system/droit-immobilier.service';
import { StructureService } from '@sycadApp/services/data-references/organigramme/structure.service';



@NgModule({
  declarations: [DocumentTypeComponent, FormDocumentTypeComponent],
  imports: [
    CommonModule,
    DocumentTypeRoutingModule,
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
    GenericsFormModule
  ],
  providers: [DocumentTypeService, DocumentTypeResolver, DocumentType, DestinationParcelleService, DroitImmobilierService, StructureService],
  entryComponents: [FormDocumentTypeComponent]
})
export class DocumentTypeModule { }
