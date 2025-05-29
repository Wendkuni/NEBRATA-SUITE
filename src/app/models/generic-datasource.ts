import { HttpClient, HttpResponse, HttpParams } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { SycadTableContext, MappingAPIParams } from "@sycadApp/libs/model-table";
import { map, catchError, tap } from "rxjs/operators";
import { Config } from "protractor";
import { GlobalDateConverter } from '@sycadApp/shared/global-date-converter';
import { CessionSourceType } from "./workflow/common/attribution-source.model";




export function MappingAPIParam() {
  return new MappingAPIParams(
    "page",
    "limit",
    "sort",
    "order",
    "ASC",
    "DESC",
    "search",
    "_fulltext",
    "_sort"
  );
}

export abstract class GenericDatasource<ITEM, ELEMENT, AUTOCOMPLETE> {
  constructor(public http: HttpClient) {}

  public abstract getUrl(): string;
  public mapping: MappingAPIParams = MappingAPIParam();

  public  getDateFields(): string[] {
    return [];
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

  public autocompletion(search: string, otherParams: Map<string,any>=null): Observable<HttpResponse<AUTOCOMPLETE[]>> {
    let params = new HttpParams()
      .set(this.mapping.limitName, "12")
      .set(this.mapping.searchName, search);
    if(otherParams) {
      otherParams.forEach((value: string, key: any) => {
        params=params.set(key,value);
      });
    }
      return this.http.get<AUTOCOMPLETE[]>(this.getUrl() + "/autocomplete", {
      observe: "response",
      params,
    }).pipe(
      tap((element) => {
        GlobalDateConverter.convertToDate(element,this.getDateFields());
      })
    );
  }

  public add(ressource: any) {
    return this.http.post(this.getUrl(), ressource).pipe(
      tap((element) => {
        GlobalDateConverter.convertToDate(element,this.getDateFields());
      })
    );
  }

  public update(ressource: any) {
    return this.http.patch(this.getUrl(), ressource);
  }
  public get(id: string | number) {
    return this.http.get<ELEMENT>(this.getUrl() + "/" + id).pipe(
      tap((element:ELEMENT) => {
        GlobalDateConverter.convertToDate(element,this.getDateFields());
      })
    );
  }

  public delete(id: string | number) {
    return this.http.delete(this.getUrl() + "/" + id);
  }

  public isExist(id: string | number) {
    return this.http.head(this.getUrl() + "/" + id, { observe: "response" });
  }

  public getListContribuableByIcad(icad: string ) {
    return this.http.get<any[]>(this.getUrl() + "/" + icad).pipe(
      tap((element) => {
        GlobalDateConverter.convertToDate(element,this.getDateFields());
      })
    );
  }
  public getContribuableByIcad(icad: string , attributionType:CessionSourceType) {
    return this.http.get<any>(this.getUrl() + "/" + icad + "/" +attributionType).pipe(
      tap((element) => {
        GlobalDateConverter.convertToDate(element,this.getDateFields());
      })
    );
  }
}
