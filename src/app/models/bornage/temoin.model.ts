import { FormPageContribuablePhysiqueComponent } from "@sycadApp/features/annuaire-identite-domaine/contribuable-physique/contribuable-physique-form-page/form-page-contribuable-physique/form-page-contribuable-physique.component";
import { ContribuablePhysiqueUserInfo } from "../data-references/contribuables/contribuable-physique";
import { PieceOfficielle, ProfessionElement } from "../data-references/contribuables/global.model";
import { Contact, Genre } from "../data-references/system/model";



export class Temoin{
    id:number;
    prenoms: string;
    nom: string;
    genre: Genre;
    profession:ProfessionElement;
    telephone:string;
    email:string;
    pieceOfficielle:PieceOfficielle;
}