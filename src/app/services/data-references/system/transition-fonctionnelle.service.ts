import { Injectable } from "@angular/core";
import { HttpClient, HttpParams} from "@angular/common/http";
import { environment } from "environments/environment";

@Injectable()
export class TransitionFonctionnelleService {
  constructor(public http: HttpClient) {
  }

  public deleteTransitionFonctionnelle(structureId: number, id: number) {
      return this.http.delete(`${environment.USERS.TRANSITION_FONCTIONNELLE_API}/${id}/structure` + "/" + structureId);
  }

}
