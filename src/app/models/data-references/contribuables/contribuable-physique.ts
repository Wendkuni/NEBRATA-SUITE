
import { Genre, Civilite, Adresse, TypePieceIdentite } from '@sycadApp/models/data-references/system/model';
import { PersonneAContacter } from '@sycadApp/models/data-references/contribuables/global.model';
import { AuthentificatedUser } from '@sycadApp/features/transverse/login/auth.user';

export class ContribuablePhysiqueUserInfo  extends AuthentificatedUser {
    prenoms: string;
    nom: string;
    genre: Genre;
    civilite: Civilite;
    dateNaissance: Date;
    lieuNaissance: string;
    nomPere : string;
    prenomPere : string;
    nomMere : string;
    prenomMere : string;
    personnesContacts : PersonneAContacter[];
    pieceIdentites: TypePieceIdentite[];
    adresses: Adresse[];
}
