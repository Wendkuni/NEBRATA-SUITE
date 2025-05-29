import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {
  IlotElement,
  IlotItem,
  ParcelleElement
} from "@sycadApp/models/data-references/territoire/localite.model";
import * as L from 'leaflet';
import 'proj4leaflet';
import 'leaflet-mouse-position';
import 'leaflet.fullscreen';
import {HttpClient} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {
  RemoteAutocompleteExtend, RemoteAutocompleteExtendBehavior
} from "@sycadShared/form-components/model/remote-autocomplete";
import {
  Ilot,
  Section
} from "@sycadApp/models/data-references/contribuables/global.model";
import {
  debounceTime,
  forkJoin,
  fromEvent,
  Observable,
  of,
  Subject
} from "rxjs";
import {
  CommunesService
} from "@sycadApp/services/data-references/territoire/communes.service";
import {
  SectionService
} from "@sycadApp/services/cession-parcelle/section.service";
import {
  IlotService
} from "@sycadApp/services/cession-parcelle/ilot.service";
import {
  CommuneAutocomplete
} from "@sycadApp/models/data-references/territoire/commune.model";
import {
  RemoteAutocompleteCommuneZoneCompetence
} from "@sycadFeature/plan-cadastral-domaine/plan-cadastral-sectionnement/edition-plan-cadastral-sectionnement/creation/remote-autocomple-zone-competence";
import {
  ParcelleService
} from "@sycadApp/services/cession-parcelle/parcelle.service";
import {SycadUtils} from "@sycadShared/utils.functions";
import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";
import {catchError, map, switchMap} from "rxjs/operators";
import {
  Parametre
} from "@sycadApp/models/data-references/system/model";
import {
  PopupService
} from "@sycadApp/services/cession-parcelle/popup.service";
import {
  ArrondissementAutocomplete,
  ArrondissementItem
} from "@sycadApp/models/data-references/territoire/arrondissement.model";
import {
  ArrondissementsService
} from "@sycadApp/services/data-references/territoire/arrondissements.service";
@Component({
  selector: 'app-plan-numeric',
  templateUrl: './plan-numeric.component.html',
  styleUrls: ['./plan-numeric.component.scss'],
  animations: [
    trigger('expandCollapse', [
      state('expanded', style({width: '100%'})),
      state('collapsed', style({
        width: '0',
        display: 'none'
      })),
      transition('expanded <=> collapsed', [animate('0.1s ease-in-out')]),
    ])
  ]

})
export class PlanNumericComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('mapContainer', {static: false}) mapContainer: ElementRef;
  parcelleChoisie: ParcelleElement;
  communeChoisie: CommuneAutocomplete;
  sectionChoisie: Section;
  ilotChoisie: IlotItem;

  public callbackAutocompleteParcelleByIlot: (search: string, params: Map<string, any>) => Observable<any[]>;

  public parcelleRemoteAutocomplte = new RemoteAutocompleteExtend<ParcelleElement>();

  public communeRemoteAutocomplete = new RemoteAutocompleteCommuneZoneCompetence<CommuneAutocomplete>();
  public sectionRemoteAutocomplete = new RemoteAutocompleteExtend<Section>();
  public ilotRemoteAutocomplete = new RemoteAutocompleteExtend<Ilot>();
  public arrondissementRemoteAutocomplete= new RemoteAutocompleteExtendBehavior<ArrondissementAutocomplete>();
  public codeArrondissementChoisie: string;
  public idArrondissementChoisie: number;
  private _onDestroy = new Subject<void>();

  onChange: any = (_: Number) => {
  };

  onTouch: any = () => {
  };

  private carte: L.Map;
  private marker: L.Marker;
  public parcelleChoisieId: Number;
  public sectionChoisieId: number;
  public ilotChoisieId: number;
  public communeId: number;
  afficherPremiereColonne: boolean = true;
  customControl: L.Control;
  controlRecenter: L.Control;
  private isDragging = false;
  private selectedLayer: L.GeoJSON | null = null;

  loading: boolean = false;
  parcelleIcon: any;
  coordinatesControl: any;

  showSatellite = true;
  showBndt = true;
  estCentre = false;
  valeurLatLng: L.LatLngExpression = [0, 0];

  coucheGoogleMap: L.TileLayer;
  coucheCommune: any;
  coucheCommuneUnique: any;
  coucheSection: any;
  coucheBurkinaFaso: any;
  coucheParcellaires: any;
  coucheParcelleUnique: any;
  parcelleByCommune = '';
  filtreCommuneCompetence = '';
  geoserverUrl: string;
  username = '';
  password = '';

  /**Les url **/
  urlCoucheBNDT: string;
  urlCoucheCadastrale: string;
  urlCoucheGoogle = 'https://www.google.com/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}';

  /** Les filtres CQL **/
  listeCodeCommune: string[] = [];
  communeFiltreQuery: string;
  sectionFiltreQuery: string;
  urlQueryParcelle: string;

  constructor(private http: HttpClient,
              public _snackBar: MatSnackBar,
              private cdr: ChangeDetectorRef,
              private renderer: Renderer2,
              private arrondissementService: ArrondissementsService,
              public communeService: CommunesService,
              public sectionService: SectionService,
              public popupService: PopupService,
              public parcelleService: ParcelleService,
              public ilotService: IlotService) {
    this.callbackAutocompleteParcelleByIlot = (search: string, params: Map<string, any>) => {
      return this.parcelleService.autocompletionByIlot(search, params).pipe(
        map(response => {
          return response.body;
        }),
        catchError((err) => {
          return of([]);
        })
      );
    };
    // this.arrondissementRemoteAutocomplete = new RemoteAutocompleteArrondissementCommune<ArrondissementAutocomplete>();
  }


  ngOnInit(): void {
    this.estCentre = false;
    if (this.carte) {
      this.carte.remove();
    }
  this.initializeComponent()

    }

  ngAfterViewInit(): void {
    forkJoin({
      user: this.http.get<Parametre>(this.parcelleService.getGeoserverUrl() + `/retrouver_par_labelle/geoserver_user_username`),
      pass: this.http.get<Parametre>(this.parcelleService.getGeoserverUrl() + `/retrouver_par_labelle/geoserver_user_password`),
    }).subscribe(results => {
      this.username = results.user.valeur;
      this.password = results.pass.valeur;
    });
    this.communeService.autocompleteByZoneCompetenceCommuneAgent().subscribe(data => {
      data.forEach(element => {
        this.listeCodeCommune.push(element.code);
      });
      if (this.listeCodeCommune.length > 0) {
        this.filtreCommuneCompetence = `code IN (${this.listeCodeCommune.map(code => `'${code}'`).join(', ')})`;
        this.parcelleByCommune = `commune IN (${this.listeCodeCommune.map(code => `'${code}'`).join(', ')})`;
      }
      this.initMap();
      this.updateLayers();
      this.refreshMap();
      this.cdr.detectChanges();
    });


  }

  private initializeComponent(): void {
    this.communeRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.communeService);
    this.http.get<Parametre>(this.parcelleService.getGeoserverUrl()+`/retrouver_par_labelle/geoserver_url_auth`).subscribe(param=>{
      this.geoserverUrl = param.valeur;
      this.urlCoucheBNDT = this.geoserverUrl + '/bndt/wms';
      this.urlCoucheCadastrale = this.geoserverUrl + '/cadastrebf/wms';
    });
  }
  initMap(): void {
    this.carte = L.map(this.mapContainer.nativeElement, {
      fullscreenControl: true,
      minZoom: 6,
      maxZoom: 22
    }).setView([0, 0], 7);

    const resizeObserver = new ResizeObserver(() => {
      this.carte.invalidateSize();
    });
    resizeObserver.observe(this.mapContainer.nativeElement);

    L.control.scale({
      position: 'bottomleft',
      imperial: false
    }).addTo(this.carte);
    this.carte.attributionControl.setPrefix(false);
    this.carte.attributionControl.addAttribution('SCR: ITRF_2008_BFTM');
    // Création d'un contrôle pour afficher les coordonnées
    this.coordinatesControl = L.control({position: 'bottomleft'});
    this.coordinatesControl.onAdd = (map: any) => {
      const div = L.DomUtil.create('div', 'coordinates-display');
      div.innerHTML = 'Déplacez la souris sur la carte pour voir les coordonnées.';
      div.style.backgroundColor = 'white';
      div.style.alignItems = 'center';
      div.style.justifyContent = 'center';
      return div;
    };
    // Ajout du contrôle à la carte
    this.coordinatesControl.addTo(this.carte);
    this.carte.on('mousemove', (event: any) => {
      const latlng = event.latlng;
      this.updateCoordinatesDisplay(latlng.lat, latlng.lng);
    });
    this.coucheGoogleMap = this.parcelleService.chargerCouche(this.urlCoucheGoogle, 1, {subdomains: ['mt0', 'mt1', 'mt2', 'mt3']});
    this.coucheBurkinaFaso = this.parcelleService.chargerCouche(this.urlCoucheBNDT, 2, {nomCouche: "adm_pays"},this.username,this.password);
   if(this.listeCodeCommune.length>=351){
     this.coucheCommune = this.parcelleService.chargerCouche(this.urlCoucheBNDT, 3, {
       nomCouche: "adm_commune",
       styles: "style_bndt_commune"
     },this.username,this.password);
     this.coucheSection = this.parcelleService.chargerCouche(this.urlCoucheCadastrale, 4, {
       nomCouche: "plan_cadastre_sections",
       styles: "style_plan_cadastre_sections"
     },this.username,this.password);
     this.coucheParcellaires = this.parcelleService.chargerCouche(this.urlCoucheCadastrale, 5,
       {
         nomCouche: "plan_cadastre_parcelles",
         styles: "style_plan_cadastre_parcelles"
       },this.username,this.password);
   }else {
     this.coucheCommune = this.parcelleService.chargerCouche(this.urlCoucheBNDT, 3, {
       nomCouche: "adm_commune",
       styles: "style_bndt_commune",
       cql_filter: this.filtreCommuneCompetence
     },this.username,this.password);
     this.coucheSection = this.parcelleService.chargerCouche(this.urlCoucheCadastrale, 4, {
       nomCouche: "plan_cadastre_sections",
       styles: "style_plan_cadastre_sections",
       cql_filter: this.parcelleByCommune
     },this.username,this.password);
     this.coucheParcellaires = this.parcelleService.chargerCouche(this.urlCoucheCadastrale, 5,
       {
         nomCouche: "plan_cadastre_parcelles",
         styles: "style_plan_cadastre_parcelles",
         cql_filter: this.parcelleByCommune
       },this.username,this.password);
   }
    this.addHideBouton();
    this.parcelleClic();
  }

  updateCoordinatesDisplay(lat: number, lng: number) {
    // Mise à jour du texte des coordonnées dans le contrôle personnalisé
    const coordinatesElement = document.querySelector('.coordinates-display');
    if (coordinatesElement) {
      coordinatesElement.innerHTML = `Latitude: ${lat.toFixed(6)}, Longitude: ${lng.toFixed(6)}`;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.parcelleChoisie != null) {
      this.carte.removeControl(this.controlRecenter);
      this.controlRecenter = null;
    }
  }

  registerOnChange(fn: () => {}): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: (_: Number) => {}): void {
    this.onTouch = fn;
  }

  refreshMap() {
    if (this.carte) {
      this.carte.invalidateSize();
    }
  }

  public callbackAutocompleteSection=(search:string,params:Map<string,any>)=> {

    return this.sectionService.autocompletionByArrondissement(search,params).pipe(
      map(response => {
        return response.body;
      }),
      catchError((err) => {
        return of([]);
      })
    );
  };
  initSection() {
    if(!this.sectionRemoteAutocomplete.init) {
      this.sectionRemoteAutocomplete.callbackAutocomplete=this.callbackAutocompleteSection;
      this.sectionRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy);
      this.sectionRemoteAutocomplete.mapFunction=(section: Section)=>{
        if(section.numeroAncien) {
          section.libelle=section.numero+ "("+section.numeroAncien +")";
        }
        return section;
      }
    }
  }

  public callbackAutocompleteArrondissement=(search:string,params:Map<string,any>)=> {
    return this.arrondissementService.autocompletionByCommune(search,params).pipe(
      map(response => {
        return response.body;
      }),
      catchError((err) => {
        return of([]);
      })
    );
  };
  initArrondissement() {
    if(!this.arrondissementRemoteAutocomplete.init) {
      this.arrondissementRemoteAutocomplete.callbackAutocomplete=this.callbackAutocompleteArrondissement;
      this.arrondissementRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy);
      this.arrondissementRemoteAutocomplete.mapFunction=(arrondissement: ArrondissementAutocomplete)=>{
        return arrondissement;
      }
    }
  }

  public onSearchCommune(eventNgSelect) {
    this.communeRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  public onChangeCommune(commune: CommuneAutocomplete) {
    this.estCentre = false;
    this.codeArrondissementChoisie = null;
    this.idArrondissementChoisie = null;
    this.sectionChoisieId = null;
    this.ilotChoisieId = null;
    this.parcelleChoisie = null;
    this.parcelleChoisieId = null;
    this.urlQueryParcelle = null;
    if (!commune) {
      // Si aucune commune sélectionnée, vider la liste des arrondissements
      this.arrondissementRemoteAutocomplete.listRessource$.next([]);
      this.sectionRemoteAutocomplete.listRessource$ = of([]);
      this.ilotRemoteAutocomplete.listRessource$ = of([]);
      this.parcelleRemoteAutocomplte.listRessource$ = of([]);
    }
    this.communeChoisie = commune;
    this.communeFiltreQuery = `code='${this.communeChoisie.code}'`;
    this.coucheCommuneUnique = this.parcelleService.chargerCouche(this.urlCoucheBNDT, 3, {
      nomCouche: "adm_commune",
      styles: "style_bndt_commune",
      cql_filter: this.communeFiltreQuery
    },this.username,this.password).addTo(this.carte);
    if (this.coucheParcelleUnique) {
      this.carte.removeLayer(this.coucheParcelleUnique);
    }
    this.coucheSection.addTo(this.carte);
    this.coucheParcellaires.addTo(this.carte);
    this.getGeometrieCouche("bndt", "adm_commune", this.communeFiltreQuery, 11);
    this.initArrondissement();

    this.arrondissementRemoteAutocomplete.params.set("commune", commune?.id);
    this.arrondissementRemoteAutocomplete.term.next(commune.nom);

    this.arrondissementRemoteAutocomplete.listRessource$.subscribe(arrondissements => {
      if (arrondissements && arrondissements.length===1) {
        arrondissements.forEach(arrondissement=>{
          if(arrondissement.commune.code === commune.code){
            this.codeArrondissementChoisie = arrondissement.code;
            this.idArrondissementChoisie = arrondissement.id;
            this.onChangeArrondissement(arrondissement);// Sélection automatique
          }
        })

      }

    });

  }

  onSearchArrondissement(event: any): void {
    this.arrondissementRemoteAutocomplete.term.next(event.term);
  }

  onChangeArrondissement(arrondissement: ArrondissementAutocomplete): void {
    this.sectionChoisieId = null;
    this.ilotChoisieId = null;
    this.parcelleChoisie = null;
    this.parcelleChoisieId = null;
    this.sectionRemoteAutocomplete.listRessource$ = of([])
    this.ilotRemoteAutocomplete.listRessource$ = of([])
    this.parcelleRemoteAutocomplte.listRessource$ = of([])
    if(!arrondissement){
      this.sectionRemoteAutocomplete.listRessource$ = of([])
      this.ilotRemoteAutocomplete.listRessource$ = of([])
      this.parcelleRemoteAutocomplte.listRessource$ = of([])
    }
    this.initSection();
    this.codeArrondissementChoisie = arrondissement.code;
    this.idArrondissementChoisie = arrondissement.id;
    this.sectionRemoteAutocomplete.params.set("arrondissement", arrondissement?.id);
    this.sectionRemoteAutocomplete.term.next("");
  }

  public onSearchSection(eventNgSelect) {
    this.sectionRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  public onChangeSection(section: Section) {
    this.estCentre = false;
    this.ilotChoisieId = null;
    this.parcelleChoisie = null;
    this.parcelleChoisieId = null;
    this.urlQueryParcelle = null;
    this.sectionChoisie = section;
    if (this.coucheParcelleUnique) {
      this.carte.removeLayer(this.coucheParcelleUnique);
    }
    this.sectionFiltreQuery = `commune='${this.communeChoisie.code}' AND nston='${this.sectionChoisie.numero}'`;
    this.getGeometrieCouche("cadastrebf", "plan_cadastre_sections", this.sectionFiltreQuery, 15);
    this.initIlot();
    this.onChange(null);
    this.parcelleRemoteAutocomplte.listRessource$ = of([])
    this.ilotRemoteAutocomplete.params.set("section", section?.id);
    this.ilotRemoteAutocomplete.params.set("arrondissement", this.idArrondissementChoisie);
    this.ilotRemoteAutocomplete.term.next("");
  }

  public callbackAutocompleteIlot=(search:string,params:Map<string,any>)=> {
    return this.ilotService.autocompletionPublicBySectionAndArrondissement(search,params).pipe(
      map(response => {
        return response.body;
      }),
      catchError((err) => {
        return of([]);
      })
    );
  };
  initIlot() {
    if (!this.ilotRemoteAutocomplete.init) {
      this.ilotRemoteAutocomplete.callbackAutocomplete= this.callbackAutocompleteIlot;
      this.ilotRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy);
      this.ilotRemoteAutocomplete.mapFunction = (ilot: IlotElement) => {
        if (ilot.numeroAncien) {
          ilot.libelle = ilot.numero+ "("+ilot.numeroAncien +")";
        }
        return ilot;
      }
    }
  }

  public onSearchIlot(eventNgSelect) {
    this.ilotRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  public onChangeIlot(ilot: IlotItem) {
    this.estCentre = false;
    this.ilotChoisie = ilot;
    if (this.coucheParcelleUnique) {
      this.carte.removeLayer(this.coucheParcelleUnique);
    }
    this.initParcelle();

    this.parcelleChoisie = null;
    this.parcelleChoisieId = null
    this.urlQueryParcelle = null;

    this.parcelleRemoteAutocomplte.params.set("ilot", ilot?.id);
    this.parcelleRemoteAutocomplte.term.next("");
  }

  initParcelle() {
    if (!this.parcelleRemoteAutocomplte.init) {

      this.parcelleRemoteAutocomplte.callbackAutocomplete = this.callbackAutocompleteParcelleByIlot;

      this.parcelleRemoteAutocomplte.initializeRemoteAutocompletion(this._onDestroy);
      this.parcelleRemoteAutocomplte.mapFunction = (parcelle: ParcelleElement) => {
        if (parcelle.numeroAncien) {
          parcelle.label = parcelle.numero+ "("+parcelle.numeroAncien +")" ;
        }
        return parcelle;
      }
    }
    this.updateParcelleFilter();
  }

  public onSearchParcelle(eventNgSelect) {
    this.parcelleRemoteAutocomplte.term.next(eventNgSelect.term);
  }

  updateParcelleFilter() {
    this.parcelleRemoteAutocomplte.params.set("ilot", this.ilotChoisieId);
  }

  public onChangeParcelle(parcelle: ParcelleElement) {
    this.estCentre = false;
    if (this.controlRecenter) {
      this.carte.removeControl(this.controlRecenter);
      this.controlRecenter = null;
    }
    this.carte.removeControl(this.customControl);
    this.customControl = null;
    this.addRecenterButton();
    this.afficherCacher();
    this.parcelleChoisie = parcelle;
    this.urlQueryParcelle = `commune='${this.communeChoisie?.code}' AND nston='${this.sectionChoisie?.numero}'
    AND nilotn='${this.ilotChoisie?.numero}' AND nplen='${this.parcelleChoisie?.numero}'`;
    if (this.coucheParcelleUnique) {
      this.carte.removeLayer(this.coucheParcelleUnique);
    }
    this.coucheParcelleUnique = this.parcelleService.chargerCouche(this.urlCoucheCadastrale, 6,
      {
        nomCouche: "plan_cadastre_parcelles",
        styles: "nouveau_style_parcelles",
        cql_filter: this.urlQueryParcelle
      },this.username,this.password);
    this.coucheParcelleUnique.addTo(this.carte);
    this.getGeometrieCouche("cadastrebf", "plan_cadastre_parcelles", this.urlQueryParcelle, 20);
    this.onChange(parcelle.id);
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  addViewBouton() {
    this.customControl = L.control({position: 'topleft'});
    this.customControl.onAdd = () => {
      const button = L.DomUtil.create('button', 'leaflet-bar leaflet-control leaflet-control-custom');
      let matIcon = this.renderer.createElement('mat-icon');
      this.renderer.addClass(matIcon, 'material-icons');
      const text = this.renderer.createText('chevron_right');  // nom de l'icône
      this.renderer.appendChild(matIcon, text);
      this.renderer.appendChild(button, matIcon);
      button.style.backgroundColor = 'white';
      button.style.width = '30px';
      button.style.height = '30px';
      button.style.display = 'flex';
      button.style.justifyContent = 'center';
      button.style.alignItems = 'center';
      L.DomEvent.on(button, 'click', () => {
        this.toggleMapPart();
      });
      return button;
    };
    this.customControl.addTo(this.carte);
  }

  addHideBouton() {
    this.customControl = L.control({position: 'topleft'});
    this.customControl.onAdd = () => {
      const button = L.DomUtil.create('button', 'leaflet-bar leaflet-control leaflet-control-custom');
      let matIcon = this.renderer.createElement('mat-icon');
      this.renderer.addClass(matIcon, 'material-icons');
      const text = this.renderer.createText('chevron_left');
      this.renderer.appendChild(matIcon, text);
      this.renderer.appendChild(button, matIcon);
      button.style.backgroundColor = 'white';
      button.style.width = '30px';
      button.style.height = '30px';
      button.style.display = 'flex';
      button.style.justifyContent = 'center';
      button.style.alignItems = 'center';
      L.DomEvent.on(button, 'click', () => {
        this.toggleMapPart();
      });
      return button;
    };
    this.customControl.addTo(this.carte);
  }

  removeCustomControl(): void {
    // Retirer le bouton personnalisé si la partie est cachée
    if (this.customControl) {
      this.carte.removeControl(this.customControl);
      this.customControl = null;
    }
  }

  toggleMapPart(): void {
    this.afficherPremiereColonne = !this.afficherPremiereColonne;
    this.afficherCacher();
  }

  afficherCacher() {
    if (this.afficherPremiereColonne) {
      this.removeCustomControl();
      this.addHideBouton();
    } else {
      this.removeCustomControl();
      this.addViewBouton();
    }
  }

  getGeometrieCouche(workspace: string, nomCouche: string, filtre: string, zoom: number) {
    this.loading = true;
    let cql_filter = encodeURIComponent(filtre);
    this.parcelleService.getObjetFeatures(workspace, nomCouche, cql_filter).subscribe(data => {
      if (data.features.length === 0) {
        this.openSnackBar("Aucune coordonnée trouvée", "Ok");
        this.loading = false;
      }
      data.features.forEach(feature => {
        let centroid;
        centroid = this.parcelleService.calculerCentroidMultiPolygon(feature.geometry.coordinates);
        this.valeurLatLng = [centroid[1], centroid[0]];
        if (!this.estCentre) {
          this.carte.setView(this.valeurLatLng, zoom);
        }
        this.loading = false;
        this.estCentre = true;
      })
      this.parcelleIcon = L.icon({
        iconUrl: 'assets/img/vendor/leaflet/marker-icon-2x.png',
        iconSize: [32, 50],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });
      if (!this.marker) {
        this.marker = L.marker(this.valeurLatLng, {icon: this.parcelleIcon}).addTo(this.carte);
      } else {
        this.marker.setLatLng(this.valeurLatLng);
      }
      this.marker = this.marker.bindPopup('<b>Point de localisation</b>');
    }, errorResponse => {
      let errorData = {
        message: "Impossible de récupérer la géométrie! " +
          "Si le problème persiste,veuillez contactez l'administrateur"
      };
      this.loading = false;
      SycadUtils.notifyRemoteError(errorData, this._snackBar);
    });

  }

  updateLayers(): void {
    if (this.showSatellite) {
      this.coucheGoogleMap.addTo(this.carte);
    } else {
      this.carte.removeLayer(this.coucheGoogleMap);
    }
    if (this.showBndt) {
      this.coucheBurkinaFaso.addTo(this.carte);
      this.coucheCommune.addTo(this.carte);
      this.loading = true
      this.coucheCommune.on('load', () => {
        if (!this.estCentre) {
          this.carte.setView([12.3714, -1.5197], 7);
        }
        this.loading = false;
        this.estCentre = true;
      });
    } else {
      this.carte.removeLayer(this.coucheBurkinaFaso);
      this.carte.removeLayer(this.coucheCommune);
    }

  }

  toggleGoogleSatelliteLayer() {
    if (this.carte.hasLayer(this.coucheGoogleMap)) {
      this.carte.removeLayer(this.coucheGoogleMap);// Retirer si déjà ajouté
    } else {
      this.carte.addLayer(this.coucheGoogleMap);// Ajouter si non présent
      this.coucheGoogleMap.bringToBack();
    }
  }

  private recenterMap(): void {
    this.estCentre = false;
    this.getGeometrieCouche("cadastrebf", "plan_cadastre_parcelles", this.urlQueryParcelle, 20);
  }

  private addRecenterButton(): void {
    this.controlRecenter = L.control({position: 'topleft'});
    this.controlRecenter.onAdd = () => {
      const containeur = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
      let matIcon = this.renderer.createElement('mat-icon');
      this.renderer.addClass(matIcon, 'material-icons');
      const text = this.renderer.createText('my_location');  // nom de l'icône
      this.renderer.appendChild(matIcon, text);
      this.renderer.appendChild(containeur, matIcon);
      containeur.style.backgroundColor = 'white';
      containeur.style.cursor = 'pointer';
      containeur.style.width = '30px';
      containeur.style.height = '30px';
      containeur.style.display = 'flex';
      containeur.style.alignItems = 'center';
      containeur.style.justifyContent = 'center';
      L.DomEvent.on(containeur, 'click', () => {
        this.recenterMap();
      });
      return containeur;
    };
    this.controlRecenter.addTo(this.carte);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4000,
      verticalPosition: "top",
    });
  }

  private readonly selectedStyle = {
    color: '#27b286',
    weight: 2,
    fillOpacity: 0.5,
    fillColor: '#27b286'
  };

  parcelleClic() {
    // Désactiver le zoom au double-clic
    this.carte.doubleClickZoom.disable();

    // Gestion du drag
    this.carte.on('mousedown', () => {
      this.isDragging = false;
    });

    this.carte.on('mousemove', () => {
      this.isDragging = true;
    });

    this.carte.on('mouseup', () => {
      setTimeout(() => {
        this.isDragging = false;
      }, 50);
    });

    // Gestion du double-clic
    fromEvent(this.carte, 'dblclick')
      .pipe(debounceTime(100))
      .subscribe((e: any) => {
        // Empêcher la propagation de l'événement
        e.originalEvent.preventDefault();
        e.originalEvent.stopPropagation();

        if (this.isDragging) return;

        if (this.parcelleService.isClickOnControl(e)) {
          return; // Ne rien faire si le clic est sur un contrôle
        }

        const url = this.getFeatureInfoUrl(e.latlng);

        if (this.selectedLayer) {
          this.carte.removeLayer(this.selectedLayer);
          this.selectedLayer = null;
        }

        this.loading = true;
        this.http.get(url).subscribe((response: any) => {
          this.loading = false;
          if (response.features && response.features.length > 0) {
            const properties = response.features[0].properties;
            this.selectedLayer = L.geoJSON(response.features[0], {
              style: this.selectedStyle
            }).addTo(this.carte);

            const popupContent = this.popupService.createPopupContent(properties);
            L.popup({
              maxWidth: 400,
              className: 'custom-popup'
            })
              .setLatLng(e.latlng)
              .setContent(popupContent)
              .openOn(this.carte);
          } else {
            this.openSnackBar("Aucune donnée de parcelle trouvée à cet emplacement.", "Ok");
          }
        });
      });
  }

  getFeatureInfoUrl(latlng) {
    const point = this.carte.latLngToContainerPoint(latlng, this.carte.getZoom());
    const size = this.carte.getSize();

    const params = {
      request: 'GetFeatureInfo',
      service: 'WMS',
      srs: 'EPSG:4326',
      styles: '',
      transparent: true,
      version: '1.1.1',
      format: 'image/png',
      bbox: this.carte.getBounds().toBBoxString(),
      height: size.y,
      width: size.x,
      layers: 'plan_cadastre_parcelles',
      query_layers: 'plan_cadastre_parcelles',
      info_format: 'application/json',
      x: Math.round(point.x),
      y: Math.round(point.y),
      i: Math.round(point.x),
      j: Math.round(point.y)
    };

    return this.urlCoucheCadastrale + L.Util.getParamString(params, this.urlCoucheCadastrale, true);
  }



}
