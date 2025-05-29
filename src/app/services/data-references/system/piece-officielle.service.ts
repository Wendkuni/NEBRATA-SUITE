import { Injectable } from "@angular/core";
import { HttpClient} from "@angular/common/http";
import { environment } from "environments/environment";

@Injectable()
export class PieceOfficielleService {
  constructor(public http: HttpClient) {
  }

  public getUrl(): string {
    return environment.USERS.INDIVISIONS_API;
  }

  public delete(guid: string, id: number) {
    return this.http.delete(`${environment.USERS.CONTRIBUABLE_API}/${guid}/pieces` + "/" + id);
  }
  public update(guid: string, ressource: any) {
    return this.http.patch(`${environment.USERS.CONTRIBUABLE_API}/${guid}/pieces`, ressource);
  }


  public get(guid: string, id: number) {
    return this.http.get(`${environment.USERS.CONTRIBUABLE_API}/${guid}/pieces` + "/" + id);
  }
 
}