
import {ElementLiquidation} from '@sycadApp/models/impot/element-liquidation.model';
export class ElementImpot{
  id: number;
  baseImpot: Formule;
  modifiable: boolean;
  ordreTrie: number;
  elementLiquidation: ElementLiquidation;
  taux: Formule;

}
export class Formule {
  id: number;
  titre: string;
  expression: string;

}
export enum FormuleElement{
  VCI="Vci",
  BAREMETJ="baremetj",
  BAREMECF="baremecf",
  SUPERFICIE="superficie",
  PRIX_DECLARE="PrixDeclare",
  BASE_INSUFISANT="BaseInsufisant",
}
