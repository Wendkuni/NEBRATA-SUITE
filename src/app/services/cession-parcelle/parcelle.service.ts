import { Injectable } from '@angular/core';
import {GenericDatasource} from "@sycadApp/models/generic-datasource";
import {HttpClient, HttpParams, HttpResponse} from "@angular/common/http";
import {environment} from "environments/environment";
import { ParcelleAutocomplete, ParcelleElement, ParcelleItem } from '@sycadApp/models/data-references/territoire/localite.model';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GlobalDateConverter } from '@sycadApp/shared/global-date-converter';
import * as L from 'leaflet';

@Injectable()
export class ParcelleService extends GenericDatasource<ParcelleItem, ParcelleElement, ParcelleAutocomplete>{


  constructor(public http: HttpClient) {super(http); }
  getUrl(): string {
    return environment.TERRITOIRE.PARCELLE_API;
  }
  getGeoserverUrl(){
    return environment.APPLICATION.PARAMETRES_API;
  }

//lister les parcelles  (non désactivé et actif)
public autocompletion(search: string, otherParams: Map<string,any>=null): Observable<HttpResponse<ParcelleAutocomplete[]>> {
  let params = new HttpParams()
    .set(this.mapping.limitName, "12")
    .set(this.mapping.searchName, search);
  if(otherParams) {
    otherParams.forEach((value: string, key: any) => {
      params=params.set(key,value);
    });
  }
    return this.http.get<ParcelleAutocomplete[]>(this.getUrl() + "/autocomplete", {
    observe: "response",
    params,
  }).pipe(
    tap((element) => {
      GlobalDateConverter.convertToDate(element,this.getDateFields());
    })
  );
}

//lister des parcelles attribué/muté/affecté par ilot ou simplement libre (non désactivé)
public autocompletionByIlotLibreOrByOwn(search: string, otherParams: Map<string,any>=null): Observable<HttpResponse<ParcelleAutocomplete[]>> {
  let params = new HttpParams()
    .set(this.mapping.limitName, "12")
    .set(this.mapping.searchName, search);
    otherParams.forEach((value: string, key: any) => {
        params=params.set(key,value);
    });

    return this.http.get<ParcelleAutocomplete[]>(this.getUrl() + "/autocomplete-parcelles-by-ilot-libre-or-by-own", {
    observe: "response",
    params,
  }).pipe(
    tap((element) => {
      GlobalDateConverter.convertToDate(element,this.getDateFields());
    })
  );
}

//lister des parcelles attribué/muté/affecté par ilot (non désactivé) et non libre
  public autocompletionByIlotByOwn(search: string, otherParams: Map<string,any>=null): Observable<HttpResponse<ParcelleAutocomplete[]>> {
    let params = new HttpParams()
      .set(this.mapping.limitName, "12")
      .set(this.mapping.searchName, search);
      otherParams.forEach((value: string, key: any) => {
          params=params.set(key,value);
      });

      return this.http.get<ParcelleAutocomplete[]>(this.getUrl() + "/autocomplete-parcelles-by-ilot-by-own", {
      observe: "response",
      params,
    }).pipe(
      tap((element) => {
        GlobalDateConverter.convertToDate(element,this.getDateFields());
      })
    );
  }

//lister toutes les parcelles par ilot (non désactivé)
  public autocompletionByIlot(search: string, otherParams: Map<string,any>=null): Observable<HttpResponse<ParcelleAutocomplete[]>> {
    let params = new HttpParams()
      .set(this.mapping.limitName, "12")
      .set(this.mapping.searchName, search);
      otherParams.forEach((value: string, key: any) => {
          params=params.set(key,value);
      });

      return this.http.get<ParcelleAutocomplete[]>(this.getUrl() + "/autocomplete-parcelles-by-ilot", {
      observe: "response",
      params,
    }).pipe(
      tap((element) => {
        GlobalDateConverter.convertToDate(element,this.getDateFields());
      })
    );
  }

  //lister toutes les parcelles (libre) par ilot (non désactivé)
  public autocompletionByIlotAndLibre(search: string, otherParams: Map<string,any>=null): Observable<HttpResponse<ParcelleAutocomplete[]>> {
    let params = new HttpParams()
      .set(this.mapping.limitName, "12")
      .set(this.mapping.searchName, search);
      otherParams.forEach((value: string, key: any) => {
          params=params.set(key,value);
      });

      return this.http.get<ParcelleAutocomplete[]>(this.getUrl() + "/autocomplete-parcelles-by-ilot-and-libre", {
      observe: "response",
      params,
    }).pipe(
      tap((element) => {
        GlobalDateConverter.convertToDate(element,this.getDateFields());
      })
    );
  }
  //lister toutes les parcelles (occupée) par ilot (non désactivé)
  public autocompletionByIlotAndOccupee(search: string, otherParams: Map<string,any>=null): Observable<HttpResponse<ParcelleAutocomplete[]>> {
    let params = new HttpParams()
      .set(this.mapping.limitName, "12")
      .set(this.mapping.searchName, search);
      otherParams.forEach((value: string, key: any) => {
          params=params.set(key,value);
      });

      return this.http.get<ParcelleAutocomplete[]>(this.getUrl() + "/autocomplete-parcelles-by-ilot-and-occupee", {
      observe: "response",
      params,
    }).pipe(
      tap((element) => {
        GlobalDateConverter.convertToDate(element,this.getDateFields());
      })
    );
  }
//lister de mes parcelles attribué/muté par ilot (non désactivé) et non libre
  public autocompletionByIlotByConnected(search: string, otherParams: Map<string,any>=null): Observable<HttpResponse<ParcelleAutocomplete[]>> {
    let params = new HttpParams()
      .set(this.mapping.limitName, "12")
      .set(this.mapping.searchName, search);
      otherParams.forEach((value: string, key: any) => {
          params=params.set(key,value);
      });

      return this.http.get<ParcelleAutocomplete[]>(this.getUrl() + "/autocomplete-parcelles-by-ilot-by-me", {
      observe: "response",
      params,
    }).pipe(
      tap((element) => {
        GlobalDateConverter.convertToDate(element,this.getDateFields());
      })
    );
  }
//lister de les parcelles attribué/muté par ilot suivant le mandat (non désactivé) et non libre
public autocompletionByIlotByMandat(search: string, otherParams: Map<string,any>=null): Observable<HttpResponse<ParcelleAutocomplete[]>> {
  let params = new HttpParams()
    .set(this.mapping.limitName, "12")
    .set(this.mapping.searchName, search);
    otherParams.forEach((value: string, key: any) => {
        params=params.set(key,value);
    });

    return this.http.get<ParcelleAutocomplete[]>(this.getUrl() + "/autocomplete-parcelles-by-ilot-by-mandat", {
    observe: "response",
    params,
  }).pipe(
    tap((element) => {
      GlobalDateConverter.convertToDate(element,this.getDateFields());
    })
  );
}
  chargerCouche(url: string,indexCouche: number,options?: {nomCouche?: string, cql_filter?: string, styles?: string ,subdomains?: string[]},username?:string,password?:string):L.tileLayer {
    const headers =  {
      headers: {
        'Authorization': 'Basic ' + btoa(username + ':' + password)
      }
    }
    const wmsOptions: any = {
      format: 'image/png',
      transparent: true,
      version: '1.1.1',
      width: 256,
      height: 256,
      minZoom: 0,
      maxZoom:50,
      zIndex: indexCouche,
    };
    if (options?.cql_filter) {
      wmsOptions.cql_filter = options.cql_filter;
    }
    if (options?.nomCouche) {
      wmsOptions.layers = options.nomCouche;
    }
    if (options?.styles) {
      wmsOptions.styles = options.styles;
    }
    if (options?.subdomains) {
      wmsOptions.subdomains = options.subdomains;
    }
    return L.tileLayer.wms(url, wmsOptions,headers);
  }

  calculerCentroidMultiPolygon(multiPolygon: number[][][][]): number[] {
    let xSum = 0;
    let ySum = 0;
    let totalPoints = 0;
    // Parcourir chaque polygone du MultiPolygon
    multiPolygon.forEach(polygon => {
      polygon[0].forEach(point => {
        xSum += point[0]; // lng
        ySum += point[1]; // lat
        totalPoints++;
      });
    });
    // Calculer le centroïde
    const centroid = [xSum / totalPoints, ySum / totalPoints];
    return centroid; // retourne [lng, lat]
  }
  getObjetFeatures(workspace:string,nomCouche: string,filtre?: string): Observable<any>{
    let apiUrlGeoserver=environment.USERS.GEOSERVER_API+'/recuperer_features';
    let params = new HttpParams()
      .set('workspace', workspace)
      .set('nomCouche', nomCouche)
      .set('filtre', filtre);
    return this.http.get<any>(apiUrlGeoserver,{params});
  }
  getParcelleByCommuneSectionIlot(numeroParcelle:string,codeCommune: string,numeroSection:string,numeroIlot: string): Observable<ParcelleElement>{
    let url = this.getUrl()+`/trouver_parcelle_par_commune_section_ilot/${numeroParcelle}/${codeCommune}/${numeroSection}/${numeroIlot}`;
    return this.http.get<any>(url);
  }

  public isClickOnControl(e: L.LeafletMouseEvent): boolean {
    // Récupérer l'élément cliqué
    const clickedElement = e.originalEvent.target as HTMLElement;

    // Vérifier si l'élément ou un de ses parents a la classe leaflet-control
    let currentElement = clickedElement;
    while (currentElement && currentElement !== document.body) {
      if (currentElement.classList.contains('leaflet-control')) {
        return true;
      }
      currentElement = currentElement.parentElement!;
    }
    return false;
  }
}
