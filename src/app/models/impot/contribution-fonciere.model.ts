
import { Dossier } from '@sycadApp/models/workflow/common/general';
import {CalendrierFiscale, ExerciceFiscale} from "@sycadApp/models/impot/exercice-fiscale.model";
import { GeneralContribuable } from '../data-references/contribuables/global.model';
import { ParcelleElement } from '../data-references/territoire/localite.model';
import { TitreRecette } from './mode-reglement.model';
import { CalendrierFiscaleService } from '@sycadApp/services/impot/calendrier-fiscale.service';




export class DossierContributionFonciere  extends Dossier{
    contribuable: GeneralContribuable;
    exerciceFiscale: ExerciceFiscale;
    calendrierFiscale: CalendrierFiscale;
    valeurDeclare: number;
    parcelle: ParcelleElement;
    titresRecette: TitreRecette[];
  }