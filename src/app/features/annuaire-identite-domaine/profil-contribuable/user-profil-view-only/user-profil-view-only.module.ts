import { NgModule, LOCALE_ID } from "@angular/core";
import { CommonModule, registerLocaleData } from "@angular/common";
import { CropperAvatarComponent } from "../user-profil/cropper-avatar/cropper-avatar.component";
import { LayoutModule } from "@angular/cdk/layout";
import { MatCardModule } from "@angular/material/card";
import { MatListModule } from "@angular/material/list";
import { MatButtonIndicatorSharedModule } from "@sycadApp/shared/material-modules/materialButtonIndicatorShared.module";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatRippleModule } from "@angular/material/core";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { GeneralGlobalSharedModule } from "@sycadApp/shared/generalShared.module";
import { MatExpansionModule } from "@angular/material/expansion";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatIconModule } from "@angular/material/icon";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatMenuModule } from "@angular/material/menu";
import { UploadSharedModule } from "@sycadApp/shared/uploadShared.module";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { ImageCropperModule } from "ngx-image-cropper";
import { NgSelectModule } from "@ng-select/ng-select";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { ClickOutsideModule } from "ng-click-outside";
import { UserProfilService } from '@sycadApp/services/data-references/system/user-profil.service';

import { UserProfilViewOnlyRoutingModule } from "./user-profil-view-only-routing.module";
import { AgentProfilComponent } from "./agent-profil/agent-profil.component";
import { ContribuableMoralProfilComponent } from "./contribuable-moral-profil/contribuable-moral-profil.component";
import { ContribuablePhysiqueProfilComponent } from "./contribuable-physique-profil/contribuable-physique-profil.component";
import { ActeurProfilComponent } from "./acteur-profil/acteur-profil.component";
import { IndivisionProfilComponent } from "./indivision-profil/indivision-profil.component";
import {AgentsService} from '@sycadApp/services/data-references/contribuables/agent.service';

import {IndivisionsService} from '@sycadApp/services/data-references/contribuables/indivisions.service';
import {ContribuableMoralService} from '@sycadApp/services/data-references/contribuables/contribuable-moral-service';
import {ContribuablePhysiqueService} from '@sycadApp/services/data-references/contribuables/contribuable-physique.service';
import { UserProfilModule } from "../user-profil/user-profil.module";

import localeFr from '@angular/common/locales/fr';
import {ActeursService} from '@sycadApp/services/data-references/contribuables/acteurs.service';
import { AgentResolverService, ContribuableMoralResolverService, ContribuablePhysiqueResolverService, ActeurResolverService, IndivisionResolverService } from '@sycadApp/services/data-references/system/user-profil-view-only-resolver.service';
import { ContribuableServicesProvidersModule } from "@sycadApp/shared/form-components/annuaire-identite/contribuable-services-providers/contribuable-providers.module";
registerLocaleData(localeFr);

@NgModule({
  declarations: [
    AgentProfilComponent,
    ContribuableMoralProfilComponent,
    ContribuablePhysiqueProfilComponent,
    ActeurProfilComponent,
    IndivisionProfilComponent,
  ],
  imports: [
    CommonModule,
    UserProfilViewOnlyRoutingModule,
    UserProfilModule,
    LayoutModule,
    MatCardModule,
    MatListModule,
    MatButtonIndicatorSharedModule,
    MatToolbarModule,
    MatBottomSheetModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatTableModule,
    MatTabsModule,
    GeneralGlobalSharedModule,
    MatExpansionModule,
    FlexLayoutModule,
    MatIconModule,
    MatGridListModule,
    MatMenuModule,
    UploadSharedModule,
    ReactiveFormsModule,
    ImageCropperModule,
    NgSelectModule,
    MatTooltipModule,
    MatSlideToggleModule,
    FormsModule,
    ClickOutsideModule,
  ],
  providers: [
    UserProfilService,
    AgentsService,
    ActeursService,
    IndivisionsService,
    ContribuableMoralService,
    ContribuablePhysiqueService,
    AgentResolverService,
    ContribuableMoralResolverService,
    ContribuablePhysiqueResolverService,
    ActeurResolverService,
    IndivisionResolverService,
    ContribuableServicesProvidersModule,
    { provide: LOCALE_ID, useValue: "fr-FR" },
  ],
  entryComponents: [CropperAvatarComponent],
})
export class UserProfilViewOnlyModule {}
