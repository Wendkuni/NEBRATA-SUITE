import { Transmission } from "@sycadApp/models/workflow/common/general";

export class UserDossierInfo {
    numero: string;
    icad:string;
    dateCreationDossier: Date;
    typeDossier: string;
    dateModificationDossier: Date;
    etatDossier: boolean;
    terminer: boolean;
    objet: string;
    transmission: Transmission
}