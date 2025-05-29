import { NatureImpot } from "./nature-impot.model";
import { ExerciceFiscale } from "./exercice-fiscale.model";

export class CalendrierFiscale{
    id:number;
    idSintax:number;
	libelle:string;
	dateButoir: Date;
	exerciceFiscale:ExerciceFiscale;
	natureImpot:NatureImpot ;
	datedebut:Date;
	datefin:Date;;




}

