import {DegreSuccessoral} from '@sycadApp/models/evaluation/degre-successoral.model';
import {ContribuableType} from '@sycadApp/models/impot/package-impot.model';
import {NatureImpot} from '@sycadApp/models/impot/nature-impot.model';
import {ArrondissementElement, ArrondissementNestableItem} from '@sycadApp/models/data-references/territoire/arrondissement.model';
import {DestinationParcelle} from '@sycadApp/models/bornage/destinationParcelle.model';
import { CommuneNestedElement } from '../data-references/territoire/commune.model';
import { Processus } from '../workflow/common/general';
import {
  CessionSource
} from "@sycadApp/models/workflow/common/attribution-source.model";

export class BaremeImpot{
  id: number;
  degreSuccessoral: DegreSuccessoral;
  trancheMin: number;
  trancheMax: number;
  valeur: number;
  taux: number;
  unite: string;
  etatMev: EtatMiseEnValeur;
  domaine: TerritoireDomaine;
  contribuableType: ContribuableType;
  destination: DestinationParcelle;
  natureImpot: NatureImpot;
  arrondissement: ArrondissementNestableItem;
  commune:CommuneNestedElement;
  processus:Processus;
  cessionSource: CessionSource

}
export enum EtatMiseEnValeur{
  NON_BATI="NON_BATI",
  BATI="BATI"
}
export enum TerritoireDomaine{
  ETAT="ETAT",
  PARTICULIER="PARTICULIER",
  COLLECTIVITE="COLLECTIVITE"
}
