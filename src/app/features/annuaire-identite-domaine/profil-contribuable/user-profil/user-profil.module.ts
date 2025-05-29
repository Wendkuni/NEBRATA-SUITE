import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { UserProfilRoutingModule } from "./user-profil-routing.module";
import { UserProfilComponent } from "./user-profil.component";
import { MatCardModule } from "@angular/material/card";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatMenuModule } from "@angular/material/menu";
import { LayoutModule } from "@sycadApp/layout/layout.module";
import { GeneralGlobalSharedModule } from "@sycadShared/generalShared.module";
import { MatButtonIndicatorSharedModule } from "@sycadApp/shared/material-modules/materialButtonIndicatorShared.module";
import { MatToolbarModule } from "@angular/material/toolbar";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTableModule } from "@angular/material/table";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { UploadSharedModule } from "@sycadShared/uploadShared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatRippleModule } from "@angular/material/core";
import { CropperAvatarComponent } from "./cropper-avatar/cropper-avatar.component";
import { ImageCropperModule } from "ngx-image-cropper";
import { NgSelectModule } from "@ng-select/ng-select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { AvatarEditionComponent } from "./avatar-edition/avatar-edition.component";
import { EmailsEditionComponent } from "./emails-edition/emails-edition.component";
import { TelephonesEditionComponent } from "./telephones-edition/telephones-edition.component";
import { AdresseEditionComponent } from "./adresse-edition/adresse-edition.component";
import { AvatarShowComponent } from "./avatar-show/avatar-show.component";
import { ModificationInformationProfile } from "./modification-information-profile/modification-information-profile.component";
import { ClickOutsideModule } from "ng-click-outside";
import { InfoUserAdresseComponent } from "./info-user-adresse/info-user-adresse.component";
import { InfoUserTelephoneComponent } from "./info-user-telephone/info-user-telephone.component";
import { InfoUserEmailsComponent } from "./info-user-emails/info-user-emails.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { InfoUserParentsComponent } from './info-user-parents/info-user-parents.component';
import { InfoUserPieceComplementairesComponent } from './info-user-piece-complementaires/info-user-piece-complementaires.component';
import { ProfilListItemComponent } from './profil-list-item/profil-list-item.component';
import { InfoUserPieceOfficiellleComponent } from './info-user-piece-officiellle/info-user-piece-officiellle.component';
import { InfoUserReseauxSociauxComponent } from './info-user-reseaux-sociaux/info-user-reseaux-sociaux.component';
import { InfoUserContactEntreprisesComponent } from './info-user-contact-entreprises/info-user-contact-entreprises.component';
import { InfoUserPersonnesContactsComponent } from './info-user-personnes-contacts/info-user-personnes-contacts.component';
import { ProfilListItemValueComponent } from './profil-list-item-value/profil-list-item-value.component';
import { InfoUserActivitesComponent } from './info-user-activites/info-user-activites.component';
import { InfoUserContibuablePhysiqueComponent } from './info-user-contibuable-physique/info-user-contibuable-physique.component';
import { InfoUserContibuableMoraleComponent } from './info-user-contibuable-morale/info-user-contibuable-morale.component';
import { InfoUserAgentComponent } from './info-user-agent/info-user-agent.component';
import { InfoUserActeurComponent } from './info-user-acteur/info-user-acteur.component';
import { InfoUserIndivisionComponent } from './info-user-indivision/info-user-indivision.component';
import { ProfilListItemIconComponent } from './profil-list-item-icon/profil-list-item-icon.component';
import { InfoUserMembresComponent } from './info-user-membres/info-user-membres.component';
import { UserProfilService } from '@sycadApp/services/data-references/system/user-profil.service';
import { InfoUserBornagesComponent } from "./info-user-bornages/info-user-bornages.component";
import { InfoUserContributionFonciereComponent } from "./info-user-contribution-fonciere/info-user-contribution-fonciere.component";
import { InfoUserExonerationsComponent } from "./info-user-exonerations/info-user-exonerations.component";
import { InfoUserMandatsComponent } from "./info-user-mandats/info-user-mandats.component";
import { InfoUserMutationsComponent } from "./info-user-mutations/info-user-mutations.component";
import { InfoUserRetraitComponent } from "./info-user-retrait/info-user-retrait.component";
import { MatDataTableSharedModule } from "@sycadApp/shared/material-modules/materialDataTableShared.module";
import { InfoUserAttributionsComponent } from "./info-user-attributions/info-user-attributions.component";
import { UserProfilAttributionService } from "@sycadApp/services/data-references/system/user-profil-attribution.service";
import { UserProfilBornageService } from "@sycadApp/services/data-references/system/user-profil-bornage.service";
import { UserProfilContributionFService } from "@sycadApp/services/data-references/system/user-profil-contribution.service";
import { UserProfilExonerationService } from "@sycadApp/services/data-references/system/user-profil-exoneration.service";
import { UserProfilMandatService } from "@sycadApp/services/data-references/system/user-profil-mandat.service";
import { UserProfilMutationService } from "@sycadApp/services/data-references/system/user-profil-mutation.service";
import { UserProfilRetraitService } from "@sycadApp/services/data-references/system/user-profil-retrait.service";
import { InfoUserMorcellementComponent } from "./info-user-morcellement/info-user-morcellement.component";
import { UserProfilMorcellementService } from "@sycadApp/services/data-references/system/user-profil-morcellement.service";
import { InfoUserLotissementComponent } from "./info-user-lotissement/info-user-lotissement.component";
import { InfoUserMiseAJourComponent } from "./info-user-mise-a-jour/info-user-mise-a-jour.component";
import { InfoUserAmenagementComponent } from "./info-user-amenagement/info-user-amenagement.component";
import { InfoUserFusionComponent } from "./info-user-fusion/info-user-fusion.component";
import { UserProfilLotissementService } from "@sycadApp/services/data-references/system/user-profil-lotissement.service";
import { UserProfilMiseAJourService } from "@sycadApp/services/data-references/system/user-profil-mise-a-jour.service";
import { UserProfilAmenagementService } from "@sycadApp/services/data-references/system/user-profil-amenagement.service";
import { UserProfilFusionService } from "@sycadApp/services/data-references/system/user-profil-fusion.service";
import { InfoUserDemandeDocumentComponent } from './info-user-demande-document/info-user-demande-document.component';
import { UserProfilDemandeDocumentService } from "@sycadApp/services/data-references/system/user-profil-demande-document.service";
import { TextMaskModule } from "angular2-text-mask";

@NgModule({
  declarations: [
    UserProfilComponent,
    CropperAvatarComponent,
    AvatarEditionComponent,
    EmailsEditionComponent,
    TelephonesEditionComponent,
    AdresseEditionComponent,
    AvatarShowComponent,
    ModificationInformationProfile,
    InfoUserAdresseComponent,
    InfoUserTelephoneComponent,
    InfoUserEmailsComponent,

    InfoUserParentsComponent,
    InfoUserPieceComplementairesComponent,
    ProfilListItemComponent,
    InfoUserPieceOfficiellleComponent,
    InfoUserReseauxSociauxComponent,
    InfoUserContactEntreprisesComponent,
    InfoUserPersonnesContactsComponent,
    ProfilListItemValueComponent,
    InfoUserActivitesComponent,
    InfoUserContibuablePhysiqueComponent,
    InfoUserContibuableMoraleComponent,
    InfoUserAgentComponent,
    InfoUserActeurComponent,
    InfoUserIndivisionComponent,
    ProfilListItemIconComponent,
    InfoUserMembresComponent,
    InfoUserBornagesComponent,
    InfoUserContributionFonciereComponent,
    InfoUserExonerationsComponent,
    InfoUserMandatsComponent,
    InfoUserMutationsComponent,
    InfoUserRetraitComponent,
    InfoUserAttributionsComponent,
    InfoUserMorcellementComponent,
    InfoUserLotissementComponent,
    InfoUserMiseAJourComponent,
    InfoUserAmenagementComponent,
    InfoUserFusionComponent,
    InfoUserDemandeDocumentComponent

  ],
  imports: [
    CommonModule,
    TextMaskModule,
    UserProfilRoutingModule,
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
    MatCardModule,
    MatTableModule,
    MatDataTableSharedModule
  ],
  providers: [
    UserProfilService,
    UserProfilAttributionService,
    UserProfilBornageService,
    UserProfilContributionFService,
    UserProfilExonerationService,
    UserProfilMandatService,
    UserProfilMutationService,
    UserProfilRetraitService,
    UserProfilMorcellementService,
    UserProfilLotissementService,
    UserProfilMiseAJourService,
    UserProfilAmenagementService,
    UserProfilFusionService,
  UserProfilDemandeDocumentService],
  entryComponents: [CropperAvatarComponent],
  exports: [
    AvatarShowComponent,
    InfoUserAdresseComponent,
    InfoUserTelephoneComponent,
    InfoUserEmailsComponent,
    InfoUserActeurComponent,
    InfoUserActivitesComponent,
    InfoUserAgentComponent,
    InfoUserContactEntreprisesComponent,
    InfoUserContibuableMoraleComponent,
    InfoUserContibuablePhysiqueComponent,
    InfoUserIndivisionComponent,
    InfoUserParentsComponent,
    InfoUserPersonnesContactsComponent,
    InfoUserPieceComplementairesComponent,
    InfoUserPieceOfficiellleComponent,
    InfoUserReseauxSociauxComponent,
    InfoUserMembresComponent,
    InfoUserBornagesComponent,
    InfoUserContributionFonciereComponent,
    InfoUserExonerationsComponent,
    InfoUserMandatsComponent,
    InfoUserMutationsComponent,
    InfoUserRetraitComponent,
    InfoUserAttributionsComponent,
    InfoUserMorcellementComponent,
    InfoUserLotissementComponent,
    InfoUserMiseAJourComponent,
    InfoUserAmenagementComponent,
    InfoUserFusionComponent,
    InfoUserDemandeDocumentComponent
  ],
})
export class UserProfilModule {}
