<<<<<<< HEAD
# NEBRATA-SUITE
SYC@D
=======
# # SYCAD-FRONTEND

Template orienté feature. Angular version 9.0.0.

## Environnement de dév

Run `npm start` pour le build continue. 

Run `npm run mock ` pour les mocks (qui sont sensés respectés le contrat d'interface)


mock auth  :  user1 ou user2 ou user3 ou user3 // password = pass12345



## ng-select
https://github.com/ng-select/ng-select
https://ng-select.github.io/ng-select#/append-to-element

## ngx-mat-select-search
 https://www.npmjs.com/package/ngx-mat-select-search


  ng g  c features/site-web-externe/pageDetail


 https://alligator.io/angular/async-validators/

 #https://indepth.dev/lazy-loading-angular-modules-with-ivy/
 

 creation module : ng generate module features/profiles --route=profiles  --module sycad-routing
ng generate module features/config-workflow-sectionnement --route=/configuration-processus/sectionnement  --module sycad-routing


 ng generate module features/situationMatrimoniale --route=configuration/situation-matrimoniale  --module sycad-routing
 ng generate module features/CategoriePieceProcessus --route=configuration-metier/categorie-piece-processus  --module sycad-routing

 ng g  c SiteWebRootPageComponent


 ng g  c features/annuaire-identite-domaine/gestion-compte/EditionCreationUser
ng g  c features/annuaire-identite-domaine/gestion-compte/edition-creation-user/completerSaisieParContribuable
ng g  c features/annuaire-identite-domaine/gestion-compte/edition-creation-user/renvoyerVersContribuable
ng g  c features/annuaire-identite-domaine/gestion-compte/edition-creation-user/envoiePourValidation


ng generate module features/site-web-externe --route=/  --module sycad-routing


  ng generate module features/processus/plan-cadastral --route=processus/plan-cadatral  --module sycad-routing
   ng g  c features/processus/plan-cadastral/edition-plan-cadastral/EditionPlanCadastral
  ng g class features/processus/plan-cadastral/edition-plan-cadastral/EditionPlanCadastral
  ng g  c features/processus/plan-cadastral/edition-plan-cadastral/creation
  ng g  c features/processus/plan-cadastral/edition-plan-cadastral/SaisieSectionnement
  ng g  c features/processus/plan-cadastral/edition-plan-cadastral/CompleterAvantValidation
  ng g  c features/processus/plan-cadastral/edition-plan-cadastral/EnvoiePourValidation
  ng g  c features/processus/plan-cadastral/edition-plan-cadastral/ValiderLaSaisie
  ng g  c features/processus/plan-cadastral/edition-plan-cadastral/RejeterLaSaisie


ng generate module features/bornage-domaine/BornageDelimitation --route=processus/bornage-delimitation  --module sycad-routing
  ng g  c features/bornage-domaine/processus/BornageDelimitation

 ng g  c features/bornage-domaine/bornage-delimitation/edition-bornage-delimitation/CreationParContribuable

    ng g  c features/processus/plan-cadastral/edition-plan-cadastral/GeneralRejeterLaSaisie
    ng g  c features/processus/plan-cadastral/edition-plan-cadastral/GeneralSaisie
    ng g  c features/processus/plan-cadastral/edition-plan-cadastral/GeneralValiderLaSaisie



    ng g  c shared/form/global-form/dossierForm
  ng g  c shared/form/global-form/observationForm
    ng g  c shared/form/global-form/IlotForm
ng g  c shared/form/global-form/DocumentForm

ng g  c shared/form-components/bornage/TemoinForm
ng g  c shared/form-components/bornage/ImmeubleForm
ng g  c shared/form-components/bornage/ParcelleDelimitationForm

  ng g  c shared/form/global-form/rapideContribuablePhysiqueForm
  ng g  c shared/form/global-form/cardGeneralContribuableForm
    ng g  c shared/form/global-form/mandatForm

ng g  c shared/form/global-form/choixParcelleForm

  ng g  c shared/form/global-form/rapideContribuableForm

ng g  c shared/form-components/processus/AnnulationDossierTransition
ng g  c shared/form-components/processus/RenvoyerDossierTransition
 ng g  c features/bornage-domaine/bornage-delimitation/edition-bornage-delimitation/saisieBrouillonParAgent
 ng g  c features/bornage-domaine/bornage-delimitation/edition-bornage-delimitation/saisieBrouillonParActeur
 ng g  c features/bornage-domaine/bornage-delimitation/edition-bornage-delimitation/saisieBrouillonParContribuable
 ng g  c features/bornage-domaine/bornage-delimitation/edition-bornage-delimitation/EditionRequisition
 ng g  c features/bornage-domaine/bornage-delimitation/edition-bornage-delimitation/NumerotationDBT
  ng g  c features/bornage-domaine/bornage-delimitation/edition-bornage-delimitation/AffectationDBT

  ng g  c features/bornage-domaine/bornage-delimitation/edition-bornage-delimitation/AffectationAgentDBT

  ng generate module features/processus/plan-cadastral-tournee-de-conservation --route=processus/plan-cadastral-tournee-de-conservation  --module sycad-routing
ng g  c shared/form-components/impot/listReglementTitre
ng g  c shared/form-components/impot/listImpotExoneration

Amenagement  => amenagement(ok)
Fusionnement  => fusionnement
Lotissement  => lotissement(ok)
MiseAJourLotissement  => miseajourlotissement
Morcellement  => morcellement(ok)
Sectionnement  => sectionnement(ok)
TourneeDeConservation  => tourneedeconservation


ng g  c features/transverse/create-compte/formCreation

   ng g  c features/processus/plan-cadastral-amenagement/EditionPlanCadastralAmenagement
   ng g  c features/processus/plan-cadastral-amenagement/edition-amenagement/CreationAmenagement
   ng g  c features/processus/plan-cadastral-amenagement/edition-amenagement/ValidationSaisiAmenagementmodule
   ng g  c features/processus/plan-cadastral-amenagement/edition-amenagement/RejetSaisieAmenagement
   ng g  c features/processus/plan-cadastral-lotissement/edition-plan-cadastral-lotissement/SaisieLotissement
   ng g  c features/processus/plan-cadastral-lotissement/edition-plan-cadastral-lotissement/Envoyer-pour-validation-lotissement

   ng g  c features/processus/plan-cadastral-fusionnement/EditionPlanCadastralFusionnement
   ng g  c features/processus/plan-cadastral-fusionnement/edition-plan-cadastral-fusionnement/CreationFusionnement
   ng g  c features/processus/plan-cadastral-fusionnement/edition-plan-cadastral-fusionnement/ValidationSaisiFusionnement
   ng g  c features/processus/plan-cadastral-fusionnement/edition-plan-cadastral-fusionnement/RejetSaisieFusionnement

   ng g  c shared/processus/transmission
      ng g  c shared/processus/transmissionCreateur

   ng g  c features/processus/plan-cadastral-lotissement/edition-plan-cadastral-lotissement/Immatriculation
   ng g  c features/processus/plan-cadastral-lotissement/edition-plan-cadastral-lotissement/EnvoyerPourControleValidation
   ng g  c features/processus/plan-cadastral-lotissement/edition-plan-cadastral-lotissement/CompleterAvantValidation
      ng g  c features/processus/plan-cadastral-lotissement/edition-plan-cadastral-lotissement/CreationParActeur



  ng generate module features/impot-domaine/contributionFonciere --route=processus/contribution-fonciere --module sycad-routing

   ng g  c features/impot-domaine/EditionContributionFonciere
ng g  c features/impot-domaine/VueContributionFonciere
 ng g  c features/impot-domaine/contribution-fonciere/edition-contribution-fonciere/SaisieParAgent
 ng g  c features/impot-domaine/contribution-fonciere/edition-contribution-fonciere/SaisieParContribuable


ng g  c features/impot-domaine/contribution-fonciere/edition-contribution-fonciere/CalculCF
ng g  c features/impot-domaine/contribution-fonciere/edition-contribution-fonciere/EnvoieVersSintax
ng g  c features/impot-domaine/contribution-fonciere/edition-contribution-fonciere/PenaliteCF
ng g  c features/impot-domaine/contribution-fonciere/edition-contribution-fonciere/ReglementTitre


ng g  c features/bornage-domaine/bornage-delimitation/edition-bornage-delimitation/CalculLiqBornage
ng g  c features/bornage-domaine/bornage-delimitation/edition-bornage-delimitation/EnvoieLiqBornageVersSintax
ng g  c features/bornage-domaine/bornage-delimitation/edition-bornage-delimitation/SolderLiqBornage
ng g  c features/bornage-domaine/bornage-delimitation/edition-bornage-delimitation/ReglementLiqBornage

ng g  c features/plan-cadastral-domaine/domaine-morcellement/edition-domaine-morcellement/CalculLiquidation
ng g  c features/plan-cadastral-domaine/domaine-morcellement/edition-domaine-morcellement/EnvoieVersSintax
ng g  c features/plan-cadastral-domaine/domaine-morcellement/edition-domaine-morcellement/SolderLiquidation
ng g  c features/plan-cadastral-domaine/domaine-morcellement/edition-domaine-morcellement/ReglementLiquidation


ng g  c features/plan-cadastral-domaine/plan-cadastral-fusion/edition-plan-cadastral-fusion/CalculLiqFusion
ng g  c features/plan-cadastral-domaine/plan-cadastral-fusion/edition-plan-cadastral-fusion/EnvoieLiqFusionVersSintax
ng g  c features/plan-cadastral-domaine/plan-cadastral-fusion/edition-plan-cadastral-fusion/SolderLiqFusion
ng g  c features/plan-cadastral-domaine/plan-cadastral-fusion/edition-plan-cadastral-fusion/ReglementLiqFusion

- script win 10 (powershell en tant que admin)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser



ng g  c features/transverse/create-compte/completerSaisie


ng g  c features/cession-parcelle-domaine/saisie-differee-attribution/edition-sd-attribution/BlocageSaisieAttribution


ng generate module features/cession-parcelle-domaine/saisieDiffereePvAttribution --route=processus/saisie-pv-attribution  --module sycad-routing
ng g  c features/cession-parcelle-domaine/saisie-differee-pv-attribution/VueSaisieAttribution
ng g  c features/cession-parcelle-domaine/saisie-differee-pv-attribution/EditionSaisieAttribution
ng g  c features/cession-parcelle-domaine/saisie-differee-pv-attribution/edition-saisie-attribution/CreationSaisiePvAttribution
ng g  c features/cession-parcelle-domaine/saisie-differee-pv-attribution/edition-saisie-attribution/SaisiePvAttribution
ng g  c features/cession-parcelle-domaine/saisie-differee-pv-attribution/edition-saisie-attribution/BlocagePvAttribution

## help création vue config processus 
 ng generate module features/workflow-config-domaine/saisiePvAttribution --route=configuration-processus/saisie-pv-attribution --module sycad-routing
 ng g  c features/workflow-config-domaine/saisie-pv-attribution/formConfigPvAttribution



ng g  c features/plan-cadastral-domaine/plan-cadastral-mise-a-jour-lotissement/choixProcessus
>>>>>>> 6d0518b (en refection)
