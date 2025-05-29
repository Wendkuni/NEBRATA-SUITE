import {Processus} from '@sycadApp/models/workflow/common/general';



export  class ExonerationCategorie {
  id: number;
  code: string;
  motif: string;
  taux: number;
  montant: number;
  etatMev: string;
  refLoi: string;
  actif: boolean;
  codeProcessus: Processus;
}

