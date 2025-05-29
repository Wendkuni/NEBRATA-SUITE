import { Permission } from '@sycadApp/models/data-references/security/permission.model';
import { RoleAutocomplete, RoleElement } from '@sycadApp/models/data-references/security/role.model';
import { CategorieActeur } from '../contribuables/global.model';

   export class ProfilElement {
    id: number;
    libelle: string;
    type: string;
    permissions: Permission [];
    excludes: Permission [];
    roles: RoleElement [];
   }

   export class ProfilItem {
      id: number;
      libelle: string;
      type: string;
      permissions:Permission [];
      excludes:Permission [];
      roles: RoleElement [];
     }

     export class ProfilAutocomplete {
      id: number;
      type:string;
      libelle: string;
     }
    