import { Injectable } from "@angular/core";
import { HttpClient, HttpParams} from "@angular/common/http";
import { environment } from "environments/environment";

@Injectable()
export class ContactContribuableService {
  constructor(public http: HttpClient) {
  }

  searchUsername(guid: string, username: string) {
    let params = new HttpParams()
    .set("guid", (guid)?guid:"");
    return this.http.get<boolean>(`${environment.USERS.CONTRIBUABLE_CHECK_API}/username/${username}`,{
      params
    });
  }

  searchCodeUnique(guid: string, codeUnique: string) {
    let params = new HttpParams()
    .set("guid", (guid)?guid:"");
    return this.http.get<boolean>(`${environment.USERS.CONTRIBUABLE_CHECK_API}/code-unique/${codeUnique}`,{
      params
    });
  }

  searchNumeroPiece(guid: string, numero: string, categorie:number) {
    let params = new HttpParams()
    .set("guid", (guid)?guid:"");
    return this.http.get<boolean>(`${environment.USERS.CONTRIBUABLE_CHECK_API}/numero-piece/${numero}/${categorie}`,{
      params
    });
  }

  searchNipPiece(guid: string, numero: string, categorie:number) {
    let params = new HttpParams()
    .set("guid", (guid)?guid:"");
    return this.http.get<boolean>(`${environment.USERS.CONTRIBUABLE_CHECK_API}/nip-piece/${numero}/${categorie}`,{
      params
    });
  }

  searchDenomination(guid: string, denomination: string) {
    let params = new HttpParams()
    .set("guid", (guid)?guid:"");
    return this.http.get<boolean>(`${environment.USERS.CONTRIBUABLE_CHECK_API}/denomination/${denomination}`,{
      params
    });
  }

  searchNumeroCnss(guid: string, numero: string) {
    let params = new HttpParams()
    .set("guid", (guid)?guid:"");
    return this.http.get<boolean>(`${environment.USERS.CONTRIBUABLE_CHECK_API}/num-cnss/${numero}`,{
      params
    });
  }

  searchEmail(guid: string, email: string) {
    let params = new HttpParams()
    .set("guid", (guid)?guid:"");
    return this.http.get<boolean>(`${environment.USERS.CONTRIBUABLE_CHECK_API}/email/${email}`,{
      params
    });
  }

  searchTelephone(guid: string, numero: string) {
    let params = new HttpParams()
    .set("guid", (guid)?guid:"");
    return this.http.get<boolean>(`${environment.USERS.CONTRIBUABLE_CHECK_API}/telephone/${numero}`,{
      params
    });
  }

  public getUrl(): string {
    return environment.USERS.INDIVISIONS_API;
  }

  public updateTelephone(guid: string, ressource: any) {
    return this.http.patch(`${environment.USERS.CONTRIBUABLE_API}/${guid}/telephones`, ressource);
  }

  public deleteTelephone(guid: string, id: number) {
    return this.http.delete(`${environment.USERS.CONTRIBUABLE_API}/${guid}/telephones` + "/" + id);
  }
  public getTelephone(guid: string, id: number) {
    return this.http.get(`${environment.USERS.CONTRIBUABLE_API}/${guid}/telephones` + "/" + id);
  }


  public updateEmail(guid: string, ressource: any) {
    return this.http.patch(`${environment.USERS.CONTRIBUABLE_API}/${guid}/emails`, ressource);
  }

  public deleteEmail(guid: string, id: number) {
    return this.http.delete(`${environment.USERS.CONTRIBUABLE_API}/${guid}/emails` + "/" + id);
  }
  public getEmail(guid: string, id: number) {
    return this.http.get(`${environment.USERS.CONTRIBUABLE_API}/${guid}/emails` + "/" + id);
  }
 

  public updateContactEntreprise(guid: string, ressource: any) {
    return this.http.patch(`${environment.USERS.CONTRIBUABLE_MORAL_API}/${guid}/contact-entreprises`, ressource);
}
public deleteContactEntreprise(guid: string, id: number) {
    return this.http.delete(`${environment.USERS.CONTRIBUABLE_MORAL_API}/${guid}/contact-entreprises` + "/" + id);
}
public getContactEntreprise(guid: string, id: number) {
    return this.http.get(`${environment.USERS.CONTRIBUABLE_MORAL_API}/${guid}/contact-entreprises` + "/" + id);
}
  public updateAdresse(guid: string, ressource: any){
    return this.http.patch(`${environment.USERS.CONTRIBUABLE_API}/${guid}/adresses`, ressource);
  }
  public deleteAdresse(guid: string, id: number) {
    return this.http.delete(`${environment.USERS.CONTRIBUABLE_API}/${guid}/adresses` + "/" + id);
  }
  public getAdresse(guid: string, id: number) {
    return this.http.get(`${environment.USERS.CONTRIBUABLE_API}/${guid}/adresses` + "/" + id);
  }

  public updateReseauSocial(guid: string, ressource: any){
    return this.http.patch(`${environment.USERS.CONTRIBUABLE_API}/${guid}/reseaux-sociaux`, ressource);
  }
  public deleteReseauSocial(guid: string, id: number) {
    return this.http.delete(`${environment.USERS.CONTRIBUABLE_API}/${guid}/reseaux-sociaux` + "/" + id);
  }
  public getReseauSocial(guid: string, id: number) {
    return this.http.get(`${environment.USERS.CONTRIBUABLE_API}/${guid}/reseaux-sociaux` + "/" + id);
  }
  public updatePersonneAContacter(guid: string, ressource: any) {
    return this.http.patch(`${environment.USERS.CONTRIBUABLE_API}/${guid}/personne-a-contacter`, ressource);
}

public deletePersonneAContacter(guid: string, id: number) {
    return this.http.delete(`${environment.USERS.CONTRIBUABLE_API}/${guid}/personne-a-contacter` + "/" + id);
}
public getPersonneAContacter(guid: string, id: number) {
    return this.http.get(`${environment.USERS.CONTRIBUABLE_API}/${guid}/personne-a-contacter` + "/" + id);
}
 
}