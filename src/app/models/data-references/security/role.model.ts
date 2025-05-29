import { Permission } from '@sycadApp/models/data-references/security/permission.model';

 
  
  export class RoleElement {
    id: number;
    libelle: string;
    type: string;
    code: string;
    locked:boolean;
    permissions:Permission[];
    excludes:Permission[];
   }

   export class RoleAutocomplete {
    id: number;
    libelle: string;
   }
    
   export class RoleItem{
    id: number;
    libelle: string;
    type: string;
    code: string;
    locked:boolean;
    permissions:String[];
    excludes:String[];
   } 
