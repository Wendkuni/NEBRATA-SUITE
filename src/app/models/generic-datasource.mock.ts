
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SycadTableContext, MappingAPIParams } from '@sycadApp/libs/model-table';
import { map } from 'rxjs/operators';


export abstract class GenericDatasourceMock<T extends {id: number}> {

    constructor(public http:HttpClient) { 
    }
    
    public abstract getUrl():string;
    public mapping : MappingAPIParams = new MappingAPIParams("_page","_limit", "_sort", "_order","asc","desc","q","_like" ,"");

    public search(context:SycadTableContext<any>): Observable<SycadTableContext<any>> {
      
        let params = context.getParams(this.mapping);      
        return this.http.get<T[]>(this.getUrl(),{observe: 'response', params}).pipe(
            map( reponse => {
            context.items=reponse.body;
            context.totalCount=Number(reponse.headers.get('X-Total-Count'));
            return context;
              
            })
        );  
    }  

    public autocompletion(search:string, otherParams: Map<string,any>=null): Observable<HttpResponse<T[]>> {  
        let params = new HttpParams()
        .set(this.mapping.limitName,"12")
        .set(this.mapping.searchName,search);
        otherParams.forEach((value: string, key: any) => {
            params=params.set(key,value);
        });

        return this.http.get<T[]>(this.getUrl(),{observe: 'response',params});
    } 
       
    public add(ressource:T){	    
        return this.http.post(this.getUrl(), ressource);
    }



    public update(ressource:T){
        return this.http.put(this.getUrl()+"/"+ressource.id, ressource);
    }

    public delete(ressource: T, id: number) {
        return this.http.delete(this.getUrl() + "/" + id);
    } 

    public isExist(ressource: T, id:number) {
        return this.http.head(this.getUrl() + "/" + id);
    } 
}
