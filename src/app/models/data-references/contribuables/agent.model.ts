
import { BureauElement, BureauItem, BureauNestedElement } from '@sycadApp/models/data-references/organigramme/bureau.model';
import { ServiceElement, ServiceItem, ServiceNestedElement } from '@sycadApp/models/data-references/organigramme/service.model';
import { StructureElement, StructureItem, StructureNestableElement } from '@sycadApp/models/data-references/organigramme/structure.model';
import {  ContribuablePhysiqueElement, ContribuablePhysiqueItem } from '@sycadApp/models/data-references/contribuables/contribuable-physique.model';
import {
  NationaliteAutocomplete,
  PieceOfficielle,
  ProfessionAutocomplete,
  ProfessionElement,
  SituationMatrimonialeAutocomplete,
  SituationMatrimonialeElement, TitreHonorifiqueAutocomplete
} from '@sycadApp/models/data-references/contribuables/global.model';
import {ArrondissementNestableElement} from '@sycadApp/models/data-references/territoire/arrondissement.model';
import {ProvinceElement} from '@sycadApp/models/data-references/territoire/province.model';


export class AgentElement extends ContribuablePhysiqueElement{
  matricule: string;
  codeUnique:string;
  fonction:string;
  nomDeJeuneFille:string;
  situationMatrimoniale:SituationMatrimonialeAutocomplete;
  ville:string;
  rue: string;
  porte:string;
  quartier: string;
  province:ProvinceElement;
  arrondissement:ArrondissementNestableElement;
  pieceOfficielle:PieceOfficielle;
  pieceComplementaire: PieceOfficielle [];
  profession:ProfessionElement;
  nationalite:NationaliteAutocomplete;
  titreHonorifique:TitreHonorifiqueAutocomplete;
  affectation: {
    bureau: BureauNestedElement;
    service: ServiceNestedElement;
    structure: StructureNestableElement;
    signataire:boolean;
    interim:boolean;
  }

}


export class AgentItem extends ContribuablePhysiqueItem{
  matricule: string;
  fonction:string;
  bureau: BureauItem;
  service: ServiceItem;
  structure: StructureItem;
}
export class AgentAutocomplete{
  guid: string;
  username: string;
  matricule: string;
  fonction:string;
}
