import { Component, OnInit, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatTabsModule } from "@angular/material/tabs";
import { MatCardModule } from "@angular/material/card";
import { MatTableModule } from "@angular/material/table";
import { MatDataTableSharedModule } from "@sycadApp/shared/material-modules/materialDataTableShared.module";
import { UserProfilModule } from "../user-profil/user-profil.module";
import { UserProfilAmenagementService } from "@sycadApp/services/data-references/system/user-profil-amenagement.service";
import { UserProfilAttributionService } from "@sycadApp/services/data-references/system/user-profil-attribution.service";
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
import {MatDatepickerModule} from '@angular/material/datepicker';
import { GeneralGlobalSharedModule } from '@sycadApp/shared/generalShared.module';
import { DateAdapter } from '@angular/material/core';
@Component({
  selector: "app-user-profil-acteur",
  templateUrl: "./user-profil-acteur.component.html",
  styleUrls: ["./user-profil-acteur.component.scss"],
})
export class UserProfilActeurComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}

@NgModule({
  declarations: [UserProfilActeurComponent],
  imports: [
    CommonModule,
    MatIconModule,
    GeneralGlobalSharedModule,
     UserProfilModule, 
     MatTabsModule, 
     MatDataTableSharedModule,
     MatCardModule,
     MatTableModule,
     MatDatepickerModule
     ],
  providers: [UserProfilAmenagementService,
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
export class UserProfilActeurModule {}
