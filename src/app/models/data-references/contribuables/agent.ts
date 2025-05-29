import { ContribuablePhysiqueUserInfo } from './contribuable-physique';
import { BureauItem } from '@sycadApp/models/data-references/organigramme/bureau.model';
import { ServiceItem } from '@sycadApp/models/data-references/organigramme/service.model';
import { StructureItem } from '@sycadApp/models/data-references/organigramme/structure.model';

export class AgentUserInfo extends ContribuablePhysiqueUserInfo{
    matricule: string;
    fonction: string;
    bureau: BureauItem;
    service: ServiceItem;
    structure: StructureItem;
}
