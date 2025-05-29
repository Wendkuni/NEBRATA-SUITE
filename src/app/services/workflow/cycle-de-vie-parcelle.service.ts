import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MappingAPIParams, SycadTableContext } from '@sycadApp/libs/model-table';
import { GenericDatasource, MappingAPIParam } from '@sycadApp/models/generic-datasource';
import { Mandat } from '@sycadApp/models/workflow/common/general';
import { CycleDeVieParcelle } from '@sycadApp/shared/form-components/plan-cadastral/cycle-de-vie-parcelle/app-cycledevie-parcelle.component';
import { GlobalDateConverter } from '@sycadApp/shared/global-date-converter';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class CycleDeVieParcelleService  {

    public mapping: MappingAPIParams = MappingAPIParam();
    public icad:string;

  constructor(public http: HttpClient) {

  }
  getUrl():string {
    return environment.CONFIGURATION.CYLE_DE_VIE;
  }
  public  getDateFields(): string[] {
    return ["dateCreationDossier","dateDossier", "date"];
  }
  public isExist(id: string | number) {
    return this.http.head(this.getUrl() + "/" + id, { observe: "response" });
  }
 
  public search(context: SycadTableContext<CycleDeVieParcelle>): Observable<SycadTableContext<CycleDeVieParcelle>> {
    let httpParams = context.getParams(this.mapping);
    httpParams= httpParams.set("icad", this.icad);
    if(!context.filters){
        context.filters=new Map<string, string>();
        context.filters.set("icad", this.icad);
    }else {
        context.filters.set("icad", this.icad);
    }
    return this.http
      .get<SycadTableContext<CycleDeVieParcelle>>(this.getUrl(), { observe: "response", params: httpParams })
      .pipe(   
        map((response) => {
          return response.body;
        }),
        tap((ctx) => {
          let that=this;
         // ctx.filters=new Map<string, string>();
          //ctx.filters.set("icad", this.icad);
          ctx.items.forEach(function(item){
            GlobalDateConverter.convertToDate(item,that.getDateFields());
          })
        }),
      );
  }


}
