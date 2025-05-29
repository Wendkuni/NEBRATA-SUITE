import { HttpClient, HttpResponse, HttpParams } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { SycadTableContext, MappingAPIParams } from "@sycadApp/libs/model-table";
import { map, catchError, tap } from "rxjs/operators";
import { Config } from "protractor";

import { MappingAPIParam } from './generic-datasource';
import { GlobalDateConverter } from '@sycadApp/shared/global-date-converter';
import { Quittance } from "./workflow/common/general";
import { environment } from "environments/environment";





export abstract class GenericProcessusDatasource<ITEM, ELEMENT> {
  constructor(public http: HttpClient) {}

  public abstract getUrl(): string;
  public mapping: MappingAPIParams = MappingAPIParam();

  public  getDateFields(): string[] {
    return [];
  }

  public creer(data: any) {
    return this.http.post(this.getUrl(), data).pipe(
      tap((element) => {
        GlobalDateConverter.convertToDate(element,this.getDateFields());
      })
    );
  }
  public executer(data: any) {
    return this.http.patch(this.getUrl(), data).pipe(
      tap((element) => {
        GlobalDateConverter.convertToDate(element,this.getDateFields());
      })
    );
  }
  
  public search(context: SycadTableContext<ITEM>): Observable<SycadTableContext<ITEM>> {
    let httpParams = context.getParams(this.mapping);
    return this.http
      .get<SycadTableContext<ITEM>>(this.getUrl(), { observe: "response", params: httpParams })
      .pipe(   
        map((response) => {
          return response.body;
        }),
        tap((ctx) => {
          let that=this;
          ctx.items.forEach(function(item){
            GlobalDateConverter.convertToDate(item,that.getDateFields());
          })
        }),
      );
  }
  public getQuittances(reference: string, codeImpot: string) {
    return this.http.get<Quittance>(environment.CONFIGURATION.QUITTANCE_SINTAX + "/" + reference+"/"+codeImpot ).pipe(
      tap((element:Quittance) => {
        GlobalDateConverter.convertToDate(element,this.getDateFields());
      })
    );  
  }


  public get(numero: string) {
    return this.http.get<ELEMENT>(this.getUrl() + "/" + numero ).pipe(
      tap((element:ELEMENT) => {
        GlobalDateConverter.convertToDate(element,this.getDateFields());
      })
    );  
  }
}
