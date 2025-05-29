import { Component, OnInit, NgModule, Compiler, Injector } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatTabsModule } from "@angular/material/tabs";
import { MatDataTableSharedModule } from "@sycadApp/shared/material-modules/materialDataTableShared.module";
import { MatCardModule } from "@angular/material/card";
import { UserProfilAttributionService } from "@sycadApp/services/data-references/system/user-profil-attribution.service";
import { UserProfilModule } from "../user-profil/user-profil.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDividerModule } from "@angular/material/divider";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { GenericsFormModule } from "@sycadApp/shared/form-components/generic-form.module";
import { GlobalWorkflowModule } from "@sycadApp/shared/form-components/processus/global-workflow.module";
import { GeneralGlobalSharedModule } from "@sycadApp/shared/generalShared.module";
import { MatButtonIndicatorSharedModule } from "@sycadApp/shared/material-modules/materialButtonIndicatorShared.module";
import { MatFormControlSharedModule } from "@sycadApp/shared/material-modules/materialFormControlShared.module";
import { MatPopupModalSharedModule } from "@sycadApp/shared/material-modules/materialPopupModalShared.module";
import { MatTableModule } from "@angular/material/table";
import { UserProfilAmenagementService } from "@sycadApp/services/data-references/system/user-profil-amenagement.service";
import { UserProfilBornageService } from "@sycadApp/services/data-references/system/user-profil-bornage.service";
import { UserProfilContributionFService } from "@sycadApp/services/data-references/system/user-profil-contribution.service";
import { UserProfilExonerationService } from "@sycadApp/services/data-references/system/user-profil-exoneration.service";
import { UserProfilFusionService } from "@sycadApp/services/data-references/system/user-profil-fusion.service";
import { UserProfilLotissementService } from "@sycadApp/services/data-references/system/user-profil-lotissement.service";
import { UserProfilMandatService } from "@sycadApp/services/data-references/system/user-profil-mandat.service";
import { UserProfilMiseAJourService } from "@sycadApp/services/data-references/system/user-profil-mise-a-jour.service";
import { UserProfilMorcellementService } from "@sycadApp/services/data-references/system/user-profil-morcellement.service";
import { UserProfilMutationService } from "@sycadApp/services/data-references/system/user-profil-mutation.service";
import { UserProfilRetraitService } from "@sycadApp/services/data-references/system/user-profil-retrait.service";
import { DateAdapter } from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
@Component({
  selector: "app-user-profil-agent",
  templateUrl: "./user-profil-agent.component.html",
  styleUrls: ["./user-profil-agent.component.scss"],
})
export class UserProfilAgentComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}

@NgModule({
  declarations: [UserProfilAgentComponent],
  imports: [
    CommonModule,
    UserProfilModule,
    GlobalWorkflowModule,
    GenericsFormModule,
    GeneralGlobalSharedModule,
    MatButtonIndicatorSharedModule,
    MatPopupModalSharedModule,
    MatFormControlSharedModule,
    MatDataTableSharedModule,
    MatNativeDateModule,
    MatDividerModule,
    MatMenuModule,
    MatCardModule,
    MatTabsModule,
    FormsModule,
    MatGridListModule,
    MatExpansionModule,
    MatListModule,
    MatTableModule,
    MatIconModule,
    ReactiveFormsModule,
    MatDatepickerModule
  ],
  exports: [],
  providers: [
    UserProfilAmenagementService,
    UserProfilAttributionService,
    UserProfilBornageService,
    UserProfilContributionFService,
    UserProfilExonerationService,
    UserProfilFusionService,
    UserProfilLotissementService,
    UserProfilMandatService,
    UserProfilMiseAJourService,
    UserProfilMorcellementService,
    UserProfilMutationService,
    UserProfilRetraitService,
    MatDatepickerModule
  ],
})
export class UserProfilAgentModule {}
