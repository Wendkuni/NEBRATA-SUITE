import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AuditRoutingModule } from "./audit-routing.module";
import { AuditComponent } from "./audit.component";
import { GeneralGlobalSharedModule } from "@sycadShared/generalShared.module";
import { MatButtonIndicatorSharedModule } from "@sycadApp/shared/material-modules/materialButtonIndicatorShared.module";
import { MatPopupModalSharedModule } from "@sycadApp/shared/material-modules/materialPopupModalShared.module";
import { MatFormControlSharedModule } from "@sycadApp/shared/material-modules/materialFormControlShared.module";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatCardModule } from "@angular/material/card";
import { MatTabsModule } from "@angular/material/tabs";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatStepperModule } from "@angular/material/stepper";
import { AuditService } from '@sycadApp/services/data-references/system/audit.service';

@NgModule({
  declarations: [AuditComponent],
  imports: [
    CommonModule,
    AuditRoutingModule,
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
    
    MatStepperModule,
  ],
  providers: [AuditService],
  entryComponents: [],
})
export class AuditModule {}
