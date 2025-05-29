import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { SketchPageComponent } from "./layout/sketch-page/sketch-page.component";

import { NotFoundComponent } from "./layout/not-found/not-found.component";
import { ErrorComponent } from "./layout/error/error.component";
import { environment } from 'environments/environment';
import { AuthGuard } from './features/transverse/login/_guards/auth.guard';
import {
  DroitImmobilierModule
} from "@sycadFeature/data-references-domaine/generique-ref/droit-immobilier/droit-immobilier.module";
import {
  DomaineFonctionnelModule
} from "@sycadFeature/data-references-domaine/generique-ref/domaine-fonctionnel/domaine-fonctionnel.module";




// @ts-ignore
const routes: Routes = [
  //{ path: '', redirectTo: '/', pathMatch: 'full' },
  /*{
     path: environment.FRONTEND_ROUTES.SITE_EXTERNE,
     component: SiteWebRootPageComponentComponent,
     children: [

     ]
     }, */

    {
      path: environment.FRONTEND_ROUTES.SITE_EXTERNE,
      loadChildren: () =>
        import("./features/site-web-externe/site-web-externe.module").then((mod) => mod.SiteWebExterneModule)
    },

  {
    path: environment.FRONTEND_ROUTES.VUE_360,
    component: SketchPageComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: environment.FRONTEND_ROUTES.BASE_VUE_360,
        loadChildren: () =>
          import("./features/dashboard-domaine/dashboard.module").then((mod) => mod.DashboardModule),
        data: { breadcrumb: "360" },
      },
      {
        path: environment.FRONTEND_ROUTES.CONTRIBUABLE_AGENT,
        loadChildren: () =>
          import("./features/annuaire-identite-domaine/agents/agent.module").then((mod) => mod.AgentsModule),
        data: { breadcrumb: "Agent" },
      },
      {
        path: environment.FRONTEND_ROUTES.CONTRIBUABLE_INDIVISION,
        loadChildren: () =>
          import("./features//annuaire-identite-domaine/indivisions/indivisions.module").then((m) => m.IndivisionsModule),
        data: { breadcrumb: "contribuable indivision" },
      },

      {
        path: environment.FRONTEND_ROUTES.CONTRIBUABLE_ACTEUR,
        loadChildren: () =>
          import("./features//annuaire-identite-domaine/acteurs/acteurs.module").then((m) => m.ActeursModule),
        data: { breadcrumb: "Acteur" },
      },
      {
        path: environment.FRONTEND_ROUTES.CONTRIBUABLE_PHYSIQUE,
        loadChildren: () =>
          import("./features//annuaire-identite-domaine/contribuable-physique/contribuable-physique.module").then(
            (m) => m.ContribuablePhysiqueModule
          ),
        data: { breadcrumb: "contribuable physique" },
      },
      {
        path: environment.FRONTEND_ROUTES.CONTRIBUABLE_MORAL,
        loadChildren: () =>
          import("./features//annuaire-identite-domaine/contribuable-moral/contribuable-moral.module").then(
            (m) => m.ContribuableMoralModule
          ),
        data: { breadcrumb: "contribuable moral" },
      },
      {
        path: environment.FRONTEND_ROUTES.CONTRIBUABLE_PROFIL,
        loadChildren: () =>
          import("./features/annuaire-identite-domaine/profil-contribuable/user-profil/user-profil.module").then((m) => m.UserProfilModule),
      },
      {
        path: environment.FRONTEND_ROUTES.CONTRIBUABLE_VIEW_PROFIL,
        loadChildren: () =>
          import("./features/annuaire-identite-domaine/profil-contribuable/user-profil-view-only/user-profil-view-only.module").then(
            (m) => m.UserProfilViewOnlyModule
          ),
      },
      {
        path: environment.FRONTEND_ROUTES.SECURITY_PROFILE,
        loadChildren: () =>
          import("./features/data-references-domaine/securite-ref/profiles/profiles.module").then((m) => m.ProfilesModule),
        data: { breadcrumb: "securité profile" },
      },
      {
        path: environment.FRONTEND_ROUTES.SECURITY_ROLES,
        loadChildren: () => import("./features/data-references-domaine/securite-ref/roles/roles.module").then((m) => m.RolesModule),
        data: { breadcrumb: "security role" },
      },
      {
        path: environment.FRONTEND_ROUTES.ORGANIGRAMME_BUREAU,
        loadChildren: () => import("./features/data-references-domaine/organigramme-ref/bureau/bureau.module").then((m) => m.BureauModule),
        data: { breadcrumb: "organisation bureau" },
      },
      {
        path: environment.FRONTEND_ROUTES.ORGANIGRAMME_SERVICE,
        loadChildren: () =>
          import("./features/data-references-domaine/organigramme-ref/services/services.module").then((m) => m.ServicesModule),
        data: { breadcrumb: "organisation service" },
      },
      {
        path: environment.FRONTEND_ROUTES.ORGANIGRAMME_STRUCTURE,
        loadChildren: () =>
          import("./features/data-references-domaine/organigramme-ref/structure/structure.module").then((m) => m.StructureModule),
        data: { breadcrumb: "organisation structure" },
      },
      {
        path: environment.FRONTEND_ROUTES.ORGANIGRAMME_LIVRE_FONCIER,
        loadChildren: () =>
          import('./features/data-references-domaine/livre-foncier/livre-foncier.module').then((m) => m.LivreFoncierModule),
        data: { breadcrumb: 'Livre foncier' },
      },
      {
        path: environment.FRONTEND_ROUTES.ORGANIGRAMME_TYPE_STRUCTURE,
        loadChildren: () =>
          import("./features/data-references-domaine/organigramme-ref/type-structure/type-structure.module").then(
            (m) => m.TypeStructureModule
          ),
        data: { breadcrumb: "organisation type structure" },
      },

      {
        path: environment.FRONTEND_ROUTES.TERRITOIRE_LOCALITE,
        loadChildren: () =>
          import("./features/data-references-domaine/territoire-ref/localite/localite.module").then((m) => m.LocaliteModule),
        data: { breadcrumb: "territoire localite" },
      },
      {
        path: environment.FRONTEND_ROUTES.TERRITOIRE_ARRONDISSEMENT,
        loadChildren: () =>
          import("./features/data-references-domaine/territoire-ref/arrondissements/arrondissements.module").then(
            (m) => m.ArrondissementsModule
          ),
        data: { breadcrumb: "territoire arrondissement" },
      },
      {
        path: environment.FRONTEND_ROUTES.TERRITOIRE_COMMUNE,
        loadChildren: () =>
          import("./features/data-references-domaine/territoire-ref/communes/communes.module").then((m) => m.CommunesModule),
        data: { breadcrumb: "territoire commune" },
      },
      {
        path: environment.FRONTEND_ROUTES.TERRITOIRE_PROVINCE,
        loadChildren: () =>
          import("./features/data-references-domaine/territoire-ref/provinces/provinces.module").then((m) => m.ProvincesModule),
        data: { breadcrumb: "territoire province" },
      },
      {
        path: environment.FRONTEND_ROUTES.TERRITOIRE_REGION,
        loadChildren: () =>
          import("./features/data-references-domaine/territoire-ref/regions/regions.module").then((m) => m.RegionsModule),
        data: { breadcrumb: "territoire region" },
      },

      {
        path: environment.FRONTEND_ROUTES.CONFIGURATION_STATUS_JURIDIQUE,
        loadChildren: () =>
          import("./features/data-references-domaine/generique-ref/status-juridique/status-juridique.module").then(
            (m) => m.StatusJuridiqueModule
          ),
        data: { breadcrumb: "configuration statut juridique" },
      },
      {
        path: environment.FRONTEND_ROUTES.CONFIGURATION_RELATION_INDIVISION,
        loadChildren: () =>
          import("./features/data-references-domaine/generique-ref/relation-indivision/relation-indivision.module").then(
            (m) => m.RelationIndivisionModule
          ),
        data: { breadcrumb: "configuration indivision relation" },
      },
      {
        path: environment.FRONTEND_ROUTES.CONFIGURATION_CATEGORIE_PIECE,
        loadChildren: () =>
          import("./features/data-references-domaine/generique-ref/categorie-piece/categorie-piece.module").then(
            (m) => m.CategoriePieceModule
          ),
        data: { breadcrumb: "configuration catégorie piece identité" },
      },
      {
        path: environment.FRONTEND_ROUTES.CONFIGURATION_CATEGORIE_ACTEUR,
        loadChildren: () =>
          import("./features/data-references-domaine/generique-ref/categorie-acteur/categorie-acteur.module").then(
            (m) => m.CategorieActeurModule
          ),
        data: { breadcrumb: "configuration categorie acteur" },
      },
      {
        path: environment.FRONTEND_ROUTES.CONFIGURATION_CIVILITE,
        loadChildren: () =>
          import("./features/data-references-domaine/generique-ref/civilites/civilites.module").then((m) => m.CivilitesModule),
        data: { breadcrumb: "configuration civilité" },
      },
      { path: environment.FRONTEND_ROUTES.CONFIGURATION_PROFESSION,
        loadChildren: () => import('./features/data-references-domaine/generique-ref/profession/profession.module').then(m => m.ProfessionModule),
      data: {breadcrumb: "Profession"}
      },
      { path: environment.FRONTEND_ROUTES.CONFIGURATION_SECTEUR_ACTIVITE,
        loadChildren: () => import('./features/data-references-domaine/generique-ref/secteur-activite/secteur-activite.module').then(m => m.SecteurActiviteModule),
        data: {breadcrumb: "Secteurs d'activités"}
      },
      { path: environment.FRONTEND_ROUTES.CONFIGURATION_REGIME_FISCAL,
        loadChildren: () => import('./features/data-references-domaine/generique-ref/regime-fiscal/regime-fiscal.module').then(m => m.RegimeFiscalModule),
        data: {breadcrumb: "Régime fiscal"}
        },
      { path: environment.FRONTEND_ROUTES.CONFIGURATION_NATIONALITE,
        loadChildren: () => import('./features/data-references-domaine/generique-ref/nationalite/nationalite.module').then(m => m.NationaliteModule),
       data: {breadcrumb: "Nationalité"}
       },
      { path: environment.FRONTEND_ROUTES.CONFIGURATION_TITRE_HONORIFIQUE,
        loadChildren: () => import('./features/data-references-domaine/generique-ref/titre-honorifique/titre-honorifique.module').then(m => m.TitreHonorifiqueModule),
        data: {breadcrumb: "Titre honorifique"}
      },

      {
        path: environment.FRONTEND_ROUTES.CONFIGURATION_DATA_STORE,
        loadChildren: () =>
          import("./features/data-references-domaine/system-ref/data-store/data-store.module").then((m) => m.DataStoreModule),
        data: { breadcrumb: "configuration data store" },
      },
      {
        path: environment.FRONTEND_ROUTES.CONFIGURATION_TEMPLATE_EMAIL,
        loadChildren: () =>
          import("./features/data-references-domaine/system-ref/template-email/template-email.module").then(
            (m) => m.TemplateEmailModule
          ),
        data: { breadcrumb: "configuration template email" },
      },
      {
        path: environment.FRONTEND_ROUTES.SYSTEM_AUDIT,
        loadChildren: () => import("./features/data-references-domaine/system-ref/audit/audit.module").then((m) => m.AuditModule),
        data: { breadcrumb: "audit" },
      },

      {
        path: environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_SECTIONNEMENT,
         loadChildren: () => import('@sycadFeature/plan-cadastral-domaine/plan-cadastral-sectionnement/sectionnement.module').then(m => m.PlanCadastralModule),
         data: {  }

     },
      { path:  environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_AMENAGEMENT, loadChildren: () => import('./features/plan-cadastral-domaine/plan-cadastral-amenagement/amenagement.module').then(m => m.AmenagementModule) },

      { path:  environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_FUSION, loadChildren: () => import('./features/plan-cadastral-domaine/plan-cadastral-fusion/fusion.module').then(m => m.PlanCadastralFusionnementModule) },
      { path: environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_LOTISSEMENT, loadChildren: () => import('./features/plan-cadastral-domaine/plan-cadastral-lotissement/lotissement.module').then(m => m.LotissementModule) },
      { path: environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_MAJ_PLAN_CADASTRE, loadChildren: () => import('./features/plan-cadastral-domaine/plan-cadastral-mise-a-jour-lotissement/maj-lotissement.module').then(m => m.PlanCadastralMiseAJourLotissementModule) },
      { path: environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_MORCELLEMENT, loadChildren: () => import('./features/plan-cadastral-domaine/plan-cadastral-morcellement/domaine-morcellement.module').then(m => m.DomaineMorcellementModule) },
      { path: environment.FRONTEND_ROUTES.PROCESSUS_ENTITES_CADASTRALES, loadChildren: () => import('./features/plan-cadastral-domaine/entites-cadastrales/entites-cadastrales.module').then(m => m.EntitesCadastralesModule) },
      { path: environment.FRONTEND_ROUTES.CONFIGURATION_SITUATION_MATRIMONIALE, loadChildren: () => import('./features/data-references-domaine/generique-ref/situation-matrimoniale/situation-matrimoniale.module').then(m => m.SituationMatrimonialeModule)
      },
      { path: environment.FRONTEND_ROUTES.CONFIGURATION_TYPE_IMMEUBLE,
        loadChildren: () => import('./features/data-references-domaine/bornage-ref/type-immeuble/type-immeuble.module').then(m => m.TypeImmeubleModule),
       data: {breadcrumb: "Type immeuble"}
       },
      { path: environment.FRONTEND_ROUTES.CONFIGURATION_DROIT_IMMOBILIER,
        loadChildren: () => import('@sycadFeature/data-references-domaine/generique-ref/droit-immobilier/droit-immobilier.module').then(m => m.DroitImmobilierModule),
        data: {breadcrumb: "Droit immobilier"}
      },
      { path: environment.FRONTEND_ROUTES.CONFIGURATION_DOMAINE_FONCTIONNEL,
        loadChildren: () => import('@sycadFeature/data-references-domaine/generique-ref/domaine-fonctionnel/domaine-fonctionnel.module').then(m => m.DomaineFonctionnelModule),
        data: {breadcrumb: "Domaine fonctionnel"}
      },
      { path: environment.FRONTEND_ROUTES.CONFIGURATION_MOTIF_REJET,
        loadChildren: () => import('@sycadFeature/data-references-domaine/generique-ref/motif-rejet/motif-rejet.module').then(m => m.MotifRejetModule),
        data: {breadcrumb: "Motif Rejet"}
      },
      { path: environment.FRONTEND_ROUTES.CONFIGURATION_TYPE_TRANSITION,
        loadChildren: () => import('@sycadFeature/data-references-domaine/generique-ref/type-transition/type-transition.module').then(m => m.TypeTransitionModule),
        data: {breadcrumb: "Type transition"}
      },
      { path: environment.FRONTEND_ROUTES.CONFIGURATION_TYPE_DOCUMENT,
        loadChildren: () => import('./features/data-references-domaine/generique-ref/document-type/document-type.module').then(m => m.DocumentTypeModule),
      data: {breadcrumb: "Type document"}
      },
      { path: environment.FRONTEND_ROUTES.CONFIGURATION_DESTINATION_PARCELLE,
        loadChildren: () => import('./features/data-references-domaine/generique-ref/destination-parcelle/destination-parcelle.module').then(m => m.DestinationParcelleModule),
       data: {breadcrumb: "Destination de la parcelle"}
       },
      { path: environment.FRONTEND_ROUTES.CONFIGURATION_QUARTIER,
        loadChildren: () => import('./features/data-references-domaine/territoire-ref/quartier/quartier.module').then(m => m.QuartierModule) ,
      data: {breadcrumb: "Quartier"}
      },
      { path: environment.FRONTEND_ROUTES.CONFIGURATION_ATTRIBUTION_SOURCE,
        loadChildren: () => import('./features/data-references-domaine/generique-ref/cession-source/cession-source.module').then(m => m.CessionSourceModule),
       data: {breadcrumb: "Mode cession"}
       },

      { path: environment.FRONTEND_ROUTES.CONFIGURATION_CATEGORIE_IMMEUBLE,
        loadChildren: () => import('./features/data-references-domaine/bornage-ref/categorie-immeuble/categorie-immeuble.module').then(m => m.CategorieImmeubleModule),
      data: {breadcrumb: "Catégorie d'immeuble"}
      },
      { path: environment.FRONTEND_ROUTES.CONFIGURATION_PARCELLE_BAREME,
        loadChildren: () => import('./features/data-references-domaine/liquidation-ref/parcelle-bareme/parcelle-bareme.module').then(m => m.ParcelleBaremeModule),
      data: {breadcrumb: "Barême de parcelle"}
      },

      { path: environment.FRONTEND_ROUTES.CONFIGURATION_NATURE_IMPOT,
        loadChildren: () => import('./features/data-references-domaine/liquidation-ref/nature-impot/nature-impot.module').then(m => m.NatureImpotModule),
      data: {breadcrumb: "Nature impôt"}
      },
      { path: environment.FRONTEND_ROUTES.CONFIGURATION_TYPE_TITRE_RECETTE,
        loadChildren: () => import('./features/data-references-domaine/liquidation-ref/type-titre-recette/type-titre-recette.module').then(m => m.TypeTitreRecetteModule),
        data: {breadcrumb: "Type du titre recette"}
      },
      { path: environment.FRONTEND_ROUTES.CONFIGURATION_ELEMENT_LIQUIDATION,
        loadChildren: () => import('./features/data-references-domaine/liquidation-ref/element-liquidation/element-liquidation.module').then(m => m.ElementLiquidationModule) ,
      data: {breadcrumb: "Elément de liquidation"}
      },
      { path: environment.FRONTEND_ROUTES.CONFIGURATION_PACKAGE_IMPOT,
        loadChildren: () => import('./features/data-references-domaine/liquidation-ref/package-impot/package-impot.module').then(m => m.PackageImpotModule),
      data: {breadcrumb: "Package impôt"}
      },
      { path: environment.FRONTEND_ROUTES.CONFIGURATION_EXONERATION_CATEGORIE,
        loadChildren: () => import('./features/data-references-domaine/liquidation-ref/exoneration-categorie/exoneration-categorie.module').then(m => m.ExonerationCategorieModule),
       data: {breadcrumb: "Catégorie exoneration"}
       },
      { path: environment.FRONTEND_ROUTES.CONFIGURATION_MODE_REGLEMENT,
        loadChildren: () => import('./features/data-references-domaine/liquidation-ref/mode-reglement/mode-reglement.module').then(m => m.ModeReglementModule)
      },
      { path: environment.FRONTEND_ROUTES.CONFIGURATION_EXONERATION,
        loadChildren: () => import('./features/data-references-domaine/liquidation-ref/exoneration/exoneration.module').then(m => m.ExonerationModule),
      data: {breadcrumb: "Exoneration"}
      },
      { path: environment.FRONTEND_ROUTES.CONFIGURATION_SYSTEM_IMPOSITION,
        loadChildren: () => import('./features/data-references-domaine/liquidation-ref/system-imposition/system-imposition.module').then(m => m.SystemImpositionModule),
      data: {breadcrumb: "Système d'imposition"}
      },
      { path: environment.FRONTEND_ROUTES.CONFIGURATION_DEGRE_SUCCESSORAL,
        loadChildren: () => import('./features/data-references-domaine/liquidation-ref/degre-successoral/degre-successoral.module').then(m => m.DegreSuccessoralModule),
      data: {breadcrumb: "Degré successoral"}
      },
      { path: environment.FRONTEND_ROUTES.CONFIGURATION_EXERCICE_FISCALE,
        loadChildren: () => import('./features/data-references-domaine/liquidation-ref/exercice-fiscale/exercice-fiscale.module').then(m => m.ExerciceFiscaleModule),
      data: {breadcrumb: "Exercice fiscal"}
      },
      { path: environment.FRONTEND_ROUTES.CONFIGURATION_BAREME_IMPOT,
        loadChildren: () => import('./features/data-references-domaine/liquidation-ref/bareme-impot/bareme-impot.module').then(m => m.BaremeImpotModule),
      data: {breadcrumb: "Barême impôt"}
      },
      { path: environment.FRONTEND_ROUTES.CONFIGURATION_FORMULE,
        loadChildren: () => import('./features/data-references-domaine/liquidation-ref/formule/formule.module').then(m => m.FormuleModule),
      data: {breadcrumb: "Formule"}
      },
      { path: environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_ATTRIBUTION,
        loadChildren: () => import('./features/cession-parcelle-domaine/saisie-differee-attribution/sd-attribution.module').then(m => m.SdAttributionModule),
        data: {breadcrumb: "Saisie différée attribution"}
      },
      { path: environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_MUTATION,
        loadChildren: () => import('./features/cession-parcelle-domaine/saisie-differee-mutation/sd-mutation.module').then(m => m.SdMutationModule),
        data: {breadcrumb: "Saisie différée mutation"}
      },
      { path: environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_AFFECTATION,
        loadChildren: () => import('./features/cession-parcelle-domaine/saisie-differee-affectation/sd-affectation.module').then(m => m.SdAffectationModule),
        data: {breadcrumb: "Saisie différée affectation"}
      },
      { path: environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_DEMANDE_DOCUMENT,
        loadChildren: () => import('./features/cession-parcelle-domaine/saisie-differee-demande-document/sd-demandedocument.module').then(m => m.SdDeamandeDocumentModule),
        data: {breadcrumb: "Saisie différée demande document"}
      },
      { path: environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_DELIVRANCE_AAP,
        loadChildren: () => import('./features/e-titres/saisie-differee-delivrance-aap/sd-delivrance-aap.module').then(m => m.SdDelivranceAapModule),
        data: {breadcrumb: "Délivrance d'attestations d'attribution de parcelles"}
      },
      { path: environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_RETRAIT,
        loadChildren: () => import('./features/cession-parcelle-domaine/saisie-differee-retrait/sd-retrait.module').then(m => m.SdRetraitModule),
        data: {breadcrumb: "Saisie différée retrait"}
      },
      { path: environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_MAJ,
        loadChildren: () => import('./features/plan-cadastral-domaine/saisie-differee-maj-plan/sd-maj-plan.module').then(m => m.SdMajModule),
        data: { breadcrumb: "Mise à jour plan cadastral"}
      },
      { path: environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_SECTIONNEMENT,
        loadChildren: () => import('./features/plan-cadastral-domaine/saisie-differee-sectionnement/sd-sectionnement.module').then(m => m.SdSectionnementModule),
        data: { breadcrumb: "Saisie différée sectionnement"}
      }
      ,
      { path: environment.FRONTEND_ROUTES.PROCESSUS_BORNAGE_DELIMITATION, loadChildren: () => import('./features/plan-cadastral-domaine/bornage-delimitation/bornage-delimitation.module').then(m => m.BornageDelimitationModule) },

      { path: environment.FRONTEND_ROUTES.CONFIGURATION_WORKFLOW, loadChildren: () => import('./features/workflow-config-domaine/config-workflow.module').then(m => m.ConfigWorkflowModule), data: { breadcrumb: "Workflow des processus"} },
      { path: environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_PV_ATTRIBUTION, loadChildren: () => import('./features/cession-parcelle-domaine/saisie-differee-pv-attribution/saisie-differee-pv-attribution.module').then(m => m.SaisieDiffereePvAttributionModule),data: {breadcrumb: "Archivage de PV"} },


      { path: environment.FRONTEND_ROUTES.APP_MENU, loadChildren: () => import('./features/data-references-domaine/system-ref/menu/menu.module').then(m => m.MenuModule)},
      { path: environment.FRONTEND_ROUTES.CONFIGURATION_MANDAT, loadChildren: () => import('./features/annuaire-identite-domaine/mandat-simple-list/mandat.module').then(m => m.MandatModule),data: {breadcrumb: "Mandat"} },
      { path: environment.FRONTEND_ROUTES.PROCESSUS_CONTRIBUTION_FONCIERE, loadChildren: () => import('./features/impot-domaine/contribution-fonciere/contribution-fonciere.module').then(m => m.ContributionFonciereModule) },
      { path: environment.FRONTEND_ROUTES.CONFIGURATION_CALENDRIER_FISCALE, loadChildren: () => import('./features/data-references-domaine/liquidation-ref/calendrier-fiscale/calendrier-fiscale.module').then(m => m.CalendrierFiscaleModule) },
      { path: 'processus/mandat', loadChildren: () => import('./features/annuaire-identite-domaine/gestion-mandat/mandat.module').then(m => m.MandatModule) },
	  { path: environment.FRONTEND_ROUTES.PROCESSUS_EXONERATION, loadChildren: () => import('./features/impot-domaine/gestion-exoneration/exoneration.module').then(m => m.ExonerationModule) },
      { path:  environment.FRONTEND_ROUTES.GESTION_INDEXATION, loadChildren: () => import('./features/data-references-domaine/system-ref/gestion-indexation/gestion-indexation.module').then(m => m.GestionIndexationModule),
        data: { breadcrumb: "configuration indexation" }, },
        { path: environment.FRONTEND_ROUTES.GESTION_COMPTE, loadChildren: () => import('./features/annuaire-identite-domaine/gestion-compte/gestion-compte.module').then(m => m.GestionCompteModule) },
    ],
  },
  {
    path:  environment.FRONTEND_ROUTES.SYSTEM_LOGIN,
    loadChildren: () => import("./features/transverse/login/login.module").then((mod) => mod.LoginModule),
  },


  {
    path:  environment.FRONTEND_ROUTES.SYSTEM_RECUPERATION_COMPTE,
    loadChildren: () =>
      import("./features/transverse/recuperation-compte/recuperation-compte.module").then(
        (m) => m.RecuperationCompteModule
      ),
  },
  {
    path:  environment.FRONTEND_ROUTES.SYSTEM_RECUPERATION_COMPTE_REDEFINIR_PASSWORD,
    loadChildren: () =>
      import("./features/transverse/create-new-password/create-new-password.module").then(
        (m) => m.CreateNewPasswordModule
      ),
  },
  {
    path: environment.FRONTEND_ROUTES.SYSTEM_CREER_COMPTE, loadChildren: () =>
      import('./features/transverse/create-compte/create-compte.module').then(
        m => m.CreateCompteModule),
  },
  { path:  environment.FRONTEND_ROUTES.SYSTEM_ERROR, component: ErrorComponent, data: { breadcrumb: "Error" } },



  { path: "**", component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false, relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class SycadRoutingModule {}
