import { MatTableDataSource } from '@angular/material/table';
import {StructureElement} from '@sycadApp/models/data-references/organigramme/structure.model';
import {TypeTitreRecette} from '@sycadApp/models/impot/type-titre-recette.model';
import { Exoneration } from '../evaluation/exoneration.model';
import { NatureImpot } from './nature-impot.model';

export class ModeReglement{
  id: number;
  code:string;
  libelle: string;
}
export class TitreRecette{
  id: number;
  numeroTitre:string;
  codeTitre:string;
  montant :number ;
  montantReglement :number ;
  estSolder: Boolean ;
  montantRestant :number ;
  montantExoneration :number ;
  dateTitre: Date ;
  montantglobal:number ;
  contribuable: string;
  contribuableDeclarant: string ;
  etatTitre: string ;
  natureTitreRecette: string ;
  modeReglement:ModeReglement;
  typeTitreRecette: TypeTitreRecette;
  impots:Impot[]
  reglements:ReglementTitreRecette[] | MatTableDataSource<ReglementTitreRecette>;
}

export class ReglementTitreRecette {
  id: number;
  numeroQuittance: string;
  dateReglement: Date;
  montant: number;
  titreRecette: TitreRecette;
  modeReglement: string;
}

export class Impot {
  id: number;
  observation: string;
  typeDroit: string;
  rumap: string;
  montant: number ;
  montantExoneration :number ;
  natureImpot: NatureImpot;
  exonerations:Exoneration[];
  valeurElementLiquidations: ValeurElementLiquidation[];
}
export class ValeurElementLiquidation {
  id: number;
  observation: string;
  montant: number ;
  baseImpot: number;
  taux: number;
}
