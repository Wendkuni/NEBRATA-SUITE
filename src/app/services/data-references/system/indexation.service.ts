import {Injectable} from '@angular/core';
import {GenericDatasource} from '@sycadApp/models/generic-datasource';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Indexation} from '@sycadApp/models/data-references/system/model';

@Injectable(
)
export class IndexationService extends GenericDatasource<Indexation, Indexation, Indexation> {
  constructor(public http:HttpClient) {
    super(http);
  } 
  public getUrl():string{
    return environment.APPLICATION.INDEXATION;
  };



  public  getDateFields(): string[] {
    return ["lastIndexationDate"];
  }

  public indexAllObject() {
    return this.http.patch(this.getUrl() + '/execute' , {});
  }

  public indexOneObjet(id:number) {
    return this.http.patch(this.getUrl() + '/execute'+ '/'  + id, {  observe: "response"});
  }

}
