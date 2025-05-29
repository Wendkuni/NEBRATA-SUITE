import { Injectable } from "@angular/core";
import { HttpClient, HttpParams} from "@angular/common/http";
import { environment } from "environments/environment";
import { HistoriqueWorkflow, Processus} from '@sycadApp/models/workflow/common/general';

@Injectable()
export class EnteteDossierService {
  constructor(public http: HttpClient) {
  }


  get(numero:String, codeProcessus:String) {
    return this.http.get<HistoriqueWorkflow>(`${environment.PROCESSUS.PPROCESSUS}/${numero}/${codeProcessus}`);
  }

  getProcessus(codeProcessus: String) {
    return this.http.get<Processus>(`${environment.PROCESSUS.PPROCESSUS}/${codeProcessus}`);
  }

  getProcessusPublic(codeProcessus: String) {
    return this.http.get<Processus>(`${environment.PROCESSUS.PPROCESSUS}/public/${codeProcessus}`);
  }
}
