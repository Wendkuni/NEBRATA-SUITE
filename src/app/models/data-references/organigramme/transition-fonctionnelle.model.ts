import {
  TypeTransition
} from "@sycadApp/models/data-references/system/type-transition.model";
import {
  DomaineFonctionnel
} from "@sycadApp/models/data-references/system/domaine-fonctionnel.model";


export class TransitionFonctionnelle {
    id: number;
    typeTransition: TypeTransition;
    domaineFonctionnels: DomaineFonctionnel[];
}

