import { Injectable } from "@angular/core";
import { HttpClient, HttpParams} from "@angular/common/http";
import { environment } from "environments/environment";
import { HistoriqueWorkflow } from '@sycadApp/models/workflow/common/general';
import { map, tap } from 'rxjs/operators';
import { GlobalDateConverter } from '@sycadApp/shared/global-date-converter';

@Injectable()
export class HistoriqueWorkflowService {
  constructor(public http: HttpClient) {
  }
  public  getDateFields(): string[] {
    return ["dateAction","dateValidite","dateCreationDossier","dateModificationDossier","dateDoc","dateCreation","dateNaissance","createdAt","dateExpiration","dateObtention"];
  }
   
  get(id:number) {
    return this.http.get<HistoriqueWorkflow>(`${environment.PROCESSUS.HISTORIQUE}/${id}`);
  }
    list(numero:String) {
      let that = this;
    return this.http.get<Array<HistoriqueWorkflow>>(`${environment.PROCESSUS.HISTORIQUE}/by/${numero}`) .pipe(   
      tap((list) => {
        list.forEach(function(item){
          GlobalDateConverter.convertToDate(item,that.getDateFields());
        })
      }),
    );;
  }

 
}