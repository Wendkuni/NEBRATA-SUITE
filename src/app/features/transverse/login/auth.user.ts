import { CategorieActeur } from '@sycadApp/models/data-references/contribuables/global.model';
import {Adresse, Contact} from '@sycadApp/models/data-references/system/model';



export enum TypeUser {
    AGENT="AGENT",CONTRIBUABLEPHYSIQUE="CONTRIBUABLEPHYSIQUE",CONTRIBUABLEMORAL="CONTRIBUABLEMORAL",ACTEUR="ACTEUR"
 }


export class AuthentificatedUser {
    guid: string;
    username: string;
    emails: Contact[];
    telephones: Contact[];
    adresses:Adresse[]
    avatar:string;
    optConfigured: boolean;
    createdAt: Date;
    lastPasswordResetDate: Date;
    editedAt: Date;
    typeUser: TypeUser;
    categorie:CategorieActeur
}


export class TokenJwt {
    token : string;
    type : string;
    issuer : string;
    audience : string;
    expiredDate : Date;

}
