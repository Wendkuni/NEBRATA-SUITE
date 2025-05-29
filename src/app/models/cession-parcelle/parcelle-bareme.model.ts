import {ArrondissementElement, ArrondissementNestableItem} from '@sycadApp/models/data-references/territoire/arrondissement.model';
import {ArrondissementZone} from '@sycadApp/models/data-references/territoire/arrondissement-zone.model';
import {DestinationParcelle} from '@sycadApp/models/bornage/destinationParcelle.model';
import {CommuneElement} from '@sycadApp/models/data-references/territoire/commune.model';

export class ParcelleBareme{
  id: number;
  valeur: number;
  commune: CommuneElement;
  arrondissement: ArrondissementNestableItem;
  arrondissementZone: ArrondissementZone;
  destination: DestinationParcelle;

}
