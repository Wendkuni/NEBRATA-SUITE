import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralGlobalSharedModule } from '@sycadApp/shared/generalShared.module';
import { MatButtonIndicatorSharedModule } from '@sycadApp/shared/material-modules/materialButtonIndicatorShared.module';
import { MatFormControlSharedModule } from '@sycadApp/shared/material-modules/materialFormControlShared.module';
import {
  DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE,
  MatNativeDateModule
} from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { UploadSharedModule } from '@sycadApp/shared/uploadShared.module';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { LocalisationComponent } from './data-references-domaine/localisation/localisation.component';
import { AttributaireFormComponent } from './annuaire-identite/attributaire-form/attributaire-form.component';
import { CardGeneralContribuableFormComponent } from './annuaire-identite/card-general-contribuable-form/card-general-contribuable-form.component';
import { MandatFormComponent } from './annuaire-identite/mandat-form/mandat-form.component';
import { RapideContribuableFormComponent } from './annuaire-identite/rapide-contribuable-form/rapide-contribuable-form.component';
import { RapideContribuableMoralFormComponent } from './annuaire-identite/rapide-contribuable-moral-form/rapide-contribuable-moral-form.component';
import { RapideContribuablePhysiqueFormComponent } from './annuaire-identite/rapide-contribuable-physique-form/rapide-contribuable-physique-form.component';
import { CredentialFormComponent } from './annuaire-identite/credential-form/credential-form.component';
import { AdresseFormComponent } from './data-references-domaine/contact-form/adresse-form/adresse-form.component';
import { ContactEntrepriseFormComponent } from './data-references-domaine/contact-form/contact-entreprise-form/contact-entreprise-form.component';
import { EmailFormComponent } from './data-references-domaine/contact-form/email-form/email-form.component';
import { PersonneContactFormComponent } from './data-references-domaine/contact-form/personne-contact-form/personne-contact-form.component';
import { ReseauSociauxFormComponent } from './data-references-domaine/contact-form/reseau-sociaux-form/reseau-sociaux-form.component';
import { TelephoneFormComponent } from './data-references-domaine/contact-form/telephone-form/telephone-form.component';
import { RemoteAutocompeteModule } from './data-references-domaine/field-remote-autocomplete/remote-autocompete.module';
import { RechercheSintaxComponent } from './data-references-domaine/recherche-ifu/recherche-ifu.component';
import { ObservationFormComponent } from './data-references-domaine/observation-form/observation-form.component';
import { PieceOfficielleFormComponent } from './data-references-domaine/piece-officielle/piece-officielle-form/piece-officielle-form.component';
import { ChoixParcelleFormComponent } from './plan-cadastral/choix-parcelle-form/choix-parcelle-form.component';
import { IlotFormRuralComponent } from './plan-cadastral/ilot-form-rural/ilot-form-rural.component';
import { IlotFormComponent } from './plan-cadastral/ilot-form/ilot-form.component';
import { SectionFormComponent } from './plan-cadastral/section-form/section-form.component';
import { TransitionFormComponent } from './processus/transition-form/transition-form.component';
import { CycledeVieParcelleComponent } from './plan-cadastral/cycle-de-vie-parcelle/app-cycledevie-parcelle.component';
import { DocumentScanFormComponent } from './processus/document-scan-form/document-scan-form.component';
import { DossierFormComponent } from './processus/dossier-form/dossier-form.component';
import { DossierPieceFormComponent } from './processus/dossier-piece/dossier-piece-form/dossier-piece-form.component';
import { ConfigFormComponent } from './workflow-domain/config-form/config-form.component';
import { ConfigProcessusFormComponent } from './workflow-domain/config-processus-form/config-processus-form.component';
import {
  ElementImpotComponent
} from './data-references-domaine/element-impot/element-impot.component';

import { ImmeubleFormComponent } from './bornage/immeuble-form/immeuble-form.component';
import { ParcelleDelimitationFormComponent } from './bornage/parcelle-delimitation-form/parcelle-delimitation-form.component';
import { TemoinFormComponent } from './bornage/temoin-form/temoin-form.component';
import { ParcelleMorcellementFormComponent } from './plan-cadastral/parcelle-form-morcellement/parcelle-form.component';
import { ParcelleFormFusionComponent } from './plan-cadastral/parcelle-form-fusion/parcelle-form-fusion.component';
import { ParcellesADesactiveFormComponent } from './plan-cadastral/parcelles-adesactive-form/parcelles-adesactive-form.component';
import { IlotsADesactiveFormComponent } from './plan-cadastral/ilots-adesactive-form/ilots-adesactive-form.component';
import { SectionADesactiveFormComponent } from './plan-cadastral/section-adesactive-form/section-adesactive-form.component';
import { ParcellesAModifierFormComponent } from './plan-cadastral/parcelles-amodifier-form/parcelles-amodifier-form.component';
import { ParcelleFormAjouterComponent } from './plan-cadastral/parcelle-a-ajouter/parcelle-form-ajouter.component';
import { ImpotFormComponent } from './impot/impot-form/impot-form.component';
import { ListReglementTitreComponent } from './impot/list-reglement-titre/list-reglement-titre.component';
import { MatSortModule } from '@angular/material/sort';
import { ListImpotExonerationComponent } from './impot/list-impot-exoneration/list-impot-exoneration.component';
import { IlotAAjouterComponent } from './plan-cadastral/ilot-aajouter/ilot-aajouter.component';
import { SectionsAModifierComponent } from './plan-cadastral/sections-amodifier/sections-amodifier.component';
import { IlotsAModifierComponent } from './plan-cadastral/ilots-amodifier/ilots-amodifier.component';
import { SectionAAjouterFormComponent } from './plan-cadastral/section-aajouter-form/section-aajouter-form.component';
import { NumerotationSectionComponent } from './plan-cadastral/numerotation-section/numerotation-section.component';
import { RapideContribuableIndivisionFormComponent } from './annuaire-identite/rapide-contribuable-indivision-form/rapide-contribuable-indivision-form.component';
import { MatStepperModule } from '@angular/material/stepper';
import { RechercheOniComponent } from './data-references-domaine/recherche-oni/recherche-oni.component';
import {
  SdSectionAajouterFormComponent
} from "@sycadShared/form-components/plan-cadastral/sd-section-aajouter-form/sd-section-aajouter-form.component";
import {
  SdSectionAajouterComponent
} from "@sycadShared/form-components/plan-cadastral/sd-section-aajouter/sd-section-aajouter.component";
import {
  MatProgressSpinnerModule
} from "@angular/material/progress-spinner";
import { SdSectionrecupAajouterComponent } from './plan-cadastral/sd-sectionrecup-aajouter/sd-sectionrecup-aajouter.component';
import {
  SdSectionAmodifierFormComponent
} from "@sycadShared/form-components/plan-cadastral/sd-section-amodifier-form/sd-section-amodifier-form.component";
import {
  SdSectionAdesactiveComponent
} from "@sycadShared/form-components/plan-cadastral/sd-section-adesactive/sd-section-adesactive.component";
import {
  IlotParcelleAajouterComponent
} from "@sycadShared/form-components/plan-cadastral/ilot-parcelle-aajouter/ilot-parcelle-aajouter.component";
import {
  IlotParcelleAajouterFormComponent
} from "@sycadShared/form-components/plan-cadastral/ilot-parcelle-aajouter-form/ilot-parcelle-aajouter-form.component";
import { ParcelleMapComponent } from './plan-cadastral/parcelle-map/parcelle-map.component';
import { ParcelleVisualiserComponent } from './plan-cadastral/parcelle-visualiser/parcelle-visualiser.component';
import { PlanNumericComponent } from './plan-cadastral/plan-numeric/plan-numeric.component';
import { ParametreReportFormComponent } from './workflow-domain/parametre-report-form/parametre-report-form.component';
import { ParcellePopupComponent } from './plan-cadastral/parcelle-popup/parcelle-popup.component';
import {
  DocumentPvFormComponent
} from "@sycadShared/form-components/processus/document-pv-form/document-pv-form.component";
import {
  IlotsParcellesComponent
} from "@sycadShared/form-components/plan-cadastral/ilots-parcelles/ilots-parcelles.component";
import {
  IlotsParcellesFormComponent
} from "@sycadShared/form-components/plan-cadastral/ilots-parcelles-form/ilots-parcelles-form.component";
import {
  TransitionFonctionnellesFormComponent
} from "@sycadShared/form-components/data-references-domaine/transition-fonctionnelle-form/transition-fonctionnelle-form.component";
import {
  CardGeneralDossierAndContribuableComponent
} from "@sycadShared/form-components/annuaire-identite/card-general-dossier-and-contribuable/card-general-dossier-and-contribuable.component";
import {
  MomentDateAdapter
} from "@angular/material-moment-adapter";
import { TextMaskModule } from 'angular2-text-mask';
import { DocumentEnregistrementForm } from './data-references-domaine/document-enregistrement/document-enregistrement.component';
import { ParcelleInexistanteComponent } from './plan-cadastral/parcelle-inexistante/parcelle-inexistante.component';

const MY_DATE_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY', // this is how your date will be parsed from Input
  },
  display: {
    dateInput: 'DD/MM/YYYY', // this is how your date will get displayed on the Input
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

@NgModule({
  declarations: [PieceOfficielleFormComponent,ImpotFormComponent,
    LocalisationComponent,
    DossierPieceFormComponent,
    RechercheSintaxComponent,
    RechercheOniComponent,
    PersonneContactFormComponent,
    ContactEntrepriseFormComponent,
    TelephoneFormComponent,
    EmailFormComponent,
    ElementImpotComponent,
    AdresseFormComponent,
    DocumentPvFormComponent,
    ReseauSociauxFormComponent,
    CredentialFormComponent,
    DossierFormComponent,
    SectionFormComponent,
    ObservationFormComponent,
    IlotFormComponent,
    IlotFormRuralComponent,
    DocumentScanFormComponent,
    AttributaireFormComponent,
    RapideContribuablePhysiqueFormComponent,
    RapideContribuableMoralFormComponent,
    RapideContribuableIndivisionFormComponent,
    CardGeneralContribuableFormComponent,
    MandatFormComponent,
    ChoixParcelleFormComponent,
    ParcelleInexistanteComponent,
    ConfigFormComponent,
    ConfigProcessusFormComponent,
    TransitionFormComponent,
    RapideContribuableFormComponent,
    CycledeVieParcelleComponent,
    TemoinFormComponent,
    ImmeubleFormComponent,
    ParcelleDelimitationFormComponent,
    ParcelleMorcellementFormComponent,
    ParcelleFormFusionComponent,
    ParcellesADesactiveFormComponent,
    IlotsADesactiveFormComponent,
    SectionADesactiveFormComponent,
    ParcellesAModifierFormComponent,
    ParcelleFormAjouterComponent,
    ListReglementTitreComponent,
    ListImpotExonerationComponent,
    IlotsAModifierComponent,
    SectionsAModifierComponent,
    IlotAAjouterComponent,
    SectionAAjouterFormComponent,
    NumerotationSectionComponent,
    SdSectionAajouterFormComponent,
    SdSectionAajouterComponent,
    SdSectionrecupAajouterComponent,
    SdSectionAmodifierFormComponent,
    SdSectionAdesactiveComponent,
    IlotParcelleAajouterComponent,
    IlotParcelleAajouterFormComponent,
    ParcelleMapComponent,
    ParcelleVisualiserComponent,
    PlanNumericComponent,
    ParcellePopupComponent,
    IlotsParcellesComponent,
    IlotsParcellesFormComponent,
    ParametreReportFormComponent,
    ParcellePopupComponent,
    TransitionFonctionnellesFormComponent,
    CardGeneralDossierAndContribuableComponent,
    DocumentEnregistrementForm
  ],
  imports: [
    CommonModule,
    TextMaskModule,
    NgOptionHighlightModule,
    GeneralGlobalSharedModule,
    MatButtonIndicatorSharedModule,
    MatFormControlSharedModule,
    MatNativeDateModule,
    MatDividerModule,
    MatFormFieldModule,
    MatSortModule,
    MatTooltipModule,
    MatListModule,
    MatSelectModule,
    MatInputModule,
    MatMenuModule,
    MatCardModule,
    MatTabsModule,
    FormsModule,
    MatGridListModule,
    RemoteAutocompeteModule,
    MatExpansionModule,
    UploadSharedModule,
    ReactiveFormsModule,
    MatTableModule,
    MatStepperModule,
    MatPaginatorModule,
    AngularEditorModule,
    MatProgressSpinnerModule
  ],

    exports: [
        NgOptionHighlightModule,
        PieceOfficielleFormComponent,
        RechercheSintaxComponent,
        RechercheOniComponent,
        ObservationFormComponent,
        SectionFormComponent,
        TelephoneFormComponent,
        DossierPieceFormComponent,
        EmailFormComponent,
        AdresseFormComponent,
        DossierFormComponent,
        ReseauSociauxFormComponent,
        CredentialFormComponent,
        ContactEntrepriseFormComponent,
        PersonneContactFormComponent,
        IlotFormComponent,
        IlotFormRuralComponent,
        DocumentScanFormComponent,
        RemoteAutocompeteModule,
        LocalisationComponent,
        ElementImpotComponent,
        ObservationFormComponent,
        AttributaireFormComponent,
        RapideContribuablePhysiqueFormComponent,
        RapideContribuableMoralFormComponent,
        RapideContribuableIndivisionFormComponent,
        CardGeneralContribuableFormComponent,
        MandatFormComponent,
        ChoixParcelleFormComponent,
        ParcelleInexistanteComponent,
        ConfigFormComponent,
        ConfigProcessusFormComponent,
        TransitionFormComponent,
        RapideContribuableFormComponent,
        CycledeVieParcelleComponent,
        TemoinFormComponent,
        ImmeubleFormComponent,
        ParcelleDelimitationFormComponent,
        ParcelleMorcellementFormComponent,
        ParcelleFormFusionComponent,
        ParcellesADesactiveFormComponent,
        IlotsADesactiveFormComponent,
        SectionADesactiveFormComponent,
        ParcellesAModifierFormComponent,
        ParcelleFormAjouterComponent,
        ImpotFormComponent,
        ListReglementTitreComponent,
        ListImpotExonerationComponent,
        IlotAAjouterComponent,
        IlotsAModifierComponent,
        SectionsAModifierComponent,
        SectionAAjouterFormComponent,
        NumerotationSectionComponent,
        SdSectionAajouterComponent,
        SdSectionAajouterComponent,
        SdSectionAajouterFormComponent,
        SdSectionrecupAajouterComponent,
        SdSectionAmodifierFormComponent,
        SdSectionAmodifierFormComponent,
        SdSectionAdesactiveComponent,
        SdSectionAdesactiveComponent,
        IlotParcelleAajouterComponent,
        IlotParcelleAajouterFormComponent,
        ParcelleMapComponent,
        ParcelleVisualiserComponent,
        ParcelleVisualiserComponent,
        PlanNumericComponent,
        TransitionFonctionnellesFormComponent,
        ParametreReportFormComponent,
        DocumentPvFormComponent,CardGeneralDossierAndContribuableComponent, IlotsParcellesComponent,
  IlotsParcellesFormComponent, DocumentEnregistrementForm
    ],
 entryComponents:[
      RapideContribuablePhysiqueFormComponent, RapideContribuableMoralFormComponent, CycledeVieParcelleComponent, RapideContribuableIndivisionFormComponent
    ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT }
  ]

})
export class GenericsFormModule { }
