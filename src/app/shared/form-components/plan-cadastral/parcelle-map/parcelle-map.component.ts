import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef, forwardRef,
  Input, OnChanges,
  OnDestroy,
  OnInit, Renderer2, SimpleChanges,
  ViewChild,
} from '@angular/core';
import * as L from 'leaflet';
import 'proj4leaflet';
import 'leaflet-mouse-position';
import {HttpClient} from "@angular/common/http";
import {
  ParcelleElement
} from "@sycadApp/models/data-references/territoire/localite.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SycadUtils} from "@sycadShared/utils.functions";
import {debounceTime, forkJoin, fromEvent, Subject} from "rxjs";
import {
  environment
} from "../../../../../environments/environment";
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {ActivatedRoute, Router} from '@angular/router';
import {
  ParcelleService
} from "@sycadApp/services/cession-parcelle/parcelle.service";
import {
  Parametre
} from "@sycadApp/models/data-references/system/model";
import {
  RemoteAutocompleteCommuneZoneCompetence
} from "@sycadFeature/plan-cadastral-domaine/plan-cadastral-sectionnement/edition-plan-cadastral-sectionnement/creation/remote-autocomple-zone-competence";
import {
  CommuneAutocomplete
} from "@sycadApp/models/data-references/territoire/commune.model";
import {
  CommunesService
} from "@sycadApp/services/data-references/territoire/communes.service";
import {
  PopupService
} from "@sycadApp/services/cession-parcelle/popup.service";

@Component({
  selector: 'app-parcelle-map',
  templateUrl: './parcelle-map.component.html',
  styleUrls: ['./parcelle-map.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ParcelleMapComponent),
    multi: true
  }]
})
export class ParcelleMapComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  @Input("parcelleChoisie")
  parcelleElement: ParcelleElement;
  @ViewChild('elementRef', {static: false}) elementRef: ElementRef;
  private isDragging = false;

  public communeRemoteAutocomplete = new RemoteAutocompleteCommuneZoneCompetence<CommuneAutocomplete>();

  private map: L.Map;
  private marker: L.Marker;
  coordonneesControl: any;
  private selectedLayer: L.GeoJSON | null = null;

  loading: boolean = false;
  private _onDestroy = new Subject<void>();

  showSatellite = true;
  showWmsLayer = true;
  showBndt = true;
  estCentre = false;
  src: string = 'ITRF_2008_BFTM';
  parcelleLatLng: L.LatLngExpression = [12.3714, -1.5197];
  CQL_FILTER: any;
  parcelleIcon: any;
  listeCodeCommune: string[] = [];

  /** Les filtres CQL **/
  filtreParcelle: string;
  username = '';
  password = '';
  parcelleByCommune = '';
  filtreCommuneCompetence = '';

  coucheGoogleMap: L.TileLayer;
  coucheCommune: L.TileLayer;
  coucheSection: L.TileLayer;
  coucheBurkinaFaso: L.TileLayer;
  coucheParcellaires: L.TileLayer;
  coucheParcelleUnique: L.TileLayer;
  geoserverUrl: string;

  /**Les url **/
  urlCoucheBNDT : string;
  urlCoucheCadastrale: string;
  urlCoucheGoogle = 'https://www.google.com/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}';

  /***Les styles de parcelle **/

  constructor(private router: Router,private route: ActivatedRoute, public popupService: PopupService,private renderer: Renderer2, public communeService: CommunesService, public parcelleService: ParcelleService, private http: HttpClient, public _snackBar: MatSnackBar, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.estCentre = false;
    if (this.map) {
      this.map.remove();
    }
    this.communeRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.communeService);
    this.http.get<Parametre>(this.parcelleService.getGeoserverUrl()+`/retrouver_par_labelle/geoserver_url_auth`).subscribe(param=>{
      this.geoserverUrl = param.valeur;
      this.urlCoucheBNDT = this.geoserverUrl + '/bndt/wms';
      this.urlCoucheCadastrale = this.geoserverUrl + '/cadastrebf/wms';
    });

  }

  ngAfterViewInit(): void {
    forkJoin({
      user: this.http.get<Parametre>(this.parcelleService.getGeoserverUrl() + `/retrouver_par_labelle/geoserver_user_username`),
      pass: this.http.get<Parametre>(this.parcelleService.getGeoserverUrl() + `/retrouver_par_labelle/geoserver_user_password`)
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['parcelleElement'] && changes['parcelleElement'].currentValue) {
      if (!this.map) {
        this.refreshMap();
        this.cdr.detectChanges();
      } else {
        this.estCentre = false;
        this.initMap();
        this.updateLayers();// Met à jour les couches lors de l'initialisation
        this.refreshMap();
        this.cdr.detectChanges();
      }
    }
  }

  initMap(): void {
    if (this.map) {
      this.map.remove();  // Supprimer la carte existante si elle existe déjà
    }
    this.map = L.map(this.elementRef.nativeElement, {fullscreenControl: true,
      minZoom: 6,
      maxZoom: 22 }).setView([0, 0], 20);
    L.control.scale({
      position: 'bottomleft', // Position de l'échelle (bottomleft, bottomright, topleft, topright).
      imperial: false, // Désactive les unités impériales (miles)
    }).addTo(this.map);
    const resizeObserver = new ResizeObserver(() => {
      this.map.invalidateSize();
    });
    resizeObserver.observe(this.elementRef.nativeElement);


    this.map.attributionControl.setPrefix(false);
    this.map.attributionControl.addAttribution('SCR: ITRF_2008_BFTM');

    // Création d'un contrôle pour afficher les coordonnées
    this.coordonneesControl = L.control({ position: 'bottomleft' });
    this.coordonneesControl.onAdd = (map: any) => {
      const div = L.DomUtil.create('div', 'coordinates-display');
      div.innerHTML = 'Déplacez la souris sur la carte pour voir les coordonnées.';
      div.style.backgroundColor = 'rgba(165,165,173,0.86)';
      div.style.alignItems = 'center';
      div.style.justifyContent = 'center';
      return div;
    };
    // Ajout du contrôle à la carte
    this.coordonneesControl.addTo(this.map);
    this.map.on('mousemove', (event: any) => {
      const latlng = event.latlng;
      this.updateCoordinatesDisplay(latlng.lat, latlng.lng);
    });
    this.filtreParcelle = `commune='${this.parcelleElement?.ilot.section.commune ? this.parcelleElement?.ilot.section.commune.code
      : this.parcelleElement?.arrondissement.commune.code}' AND nston='${this.parcelleElement?.ilot.section.numero}' AND nilotn='${this.parcelleElement?.ilot.numero}' AND nplen='${this.parcelleElement?.numero}'`;
    this.coucheGoogleMap = this.parcelleService.chargerCouche(this.urlCoucheGoogle, 1);
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
      this.coucheParcellaires = this.parcelleService.chargerCouche(this.urlCoucheCadastrale, 5, {
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
      this.coucheParcellaires = this.parcelleService.chargerCouche(this.urlCoucheCadastrale, 5, {
        nomCouche: "plan_cadastre_parcelles",
        styles: "style_plan_cadastre_parcelles",
        cql_filter: this.parcelleByCommune
      },this.username,this.password);
    }
      this.coucheParcelleUnique = this.parcelleService.chargerCouche(this.urlCoucheCadastrale, 6, {
        nomCouche: "plan_cadastre_parcelles",
        styles: "nouveau_style_parcelles",
        cql_filter: this.filtreParcelle
      },this.username,this.password);
      this.coucheParcelleUnique.on('tileloadstart', () => {
        this.loading = true; // Afficher le spinner
      });
      this.coucheParcelleUnique.on('tileload', () => {
        this.loading = false; // Masquer le spinner lorsque le chargement est terminé
      });

      this.coucheParcelleUnique.on('tileerror', () => {
        this.loading = false; // Masquer également en cas d'erreur
      });
    this.addRecenterButton();
    this.parcelleClic();
  }

  updateCoordinatesDisplay(lat: number, lng: number) {
    // Mise à jour du texte des coordonnées dans le contrôle personnalisé
    const coordinatesElement = document.querySelector('.coordinates-display');
    if (coordinatesElement) {
      coordinatesElement.innerHTML = `Latitude: ${lat.toFixed(6)}, Longitude: ${lng.toFixed(6)}`;
    }
  }

  refreshMap() {
    if (this.map) {
      this.map.invalidateSize();
    }
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }


  getParcelles(workspace:string,nomCouche: string,filtre?: string) {
    this.loading = true;
    this.parcelleService.getObjetFeatures(workspace,nomCouche,filtre).subscribe(data => {
      if (data.features.length === 0) {
        // this.openSnackBar("Aucune coordonnée trouvée pour cette parcelle", "Ok");
        this.loading = false;
      }
      data.features.forEach(feature => {
        let centroid;
        centroid = this.parcelleService.calculerCentroidMultiPolygon(feature.geometry.coordinates);
        // Inversion des coordonnées pour leaflet [lat, lng]
        this.parcelleLatLng = [centroid[1], centroid[0]];
        if (!this.estCentre) {
          this.map.setView(this.parcelleLatLng, 20);
        }
        this.loading = false;
        this.estCentre = true;
      });
      this.parcelleIcon = L.icon({
        iconUrl: 'assets/img/vendor/leaflet/marker-icon-2x.png',
        iconSize: [32, 50],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });
      this.marker = L.marker(this.parcelleLatLng, {icon: this.parcelleIcon}).addTo(this.map);
      this.marker.bindPopup('<b>Localisation de la parcelle</b>');
    }, errorResponse => {
      let errorData = {
        message: "Impossible de récupérer la géométrie de la parcelle! " +
          "Si le problème persiste,veuillez contactez l'administrateur"
      };
      this.loading = false;
      SycadUtils.notifyRemoteError(errorData, this._snackBar);
    });

  }

  updateLayers(): void {
    // Retirez toutes les couches
    this.map.eachLayer(layer => {
      if (layer instanceof L.TileLayer) {
        this.map.removeLayer(layer);
      }
    });
    // Ajoutez les couches en fonction des checkbox
    if (this.showSatellite) {
      this.coucheGoogleMap.addTo(this.map);
    }
    if (this.showBndt) {
      this.coucheBurkinaFaso.addTo(this.map);
      this.coucheCommune.addTo(this.map);
    }
    if (this.showWmsLayer) {
      this.CQL_FILTER = encodeURIComponent(`commune='${this.parcelleElement.ilot.section.commune ? this.parcelleElement.ilot.section.commune.code
        : this.parcelleElement.arrondissement.commune.code}' AND nston='${this.parcelleElement.ilot.section.numero}'
      AND nilotn='${this.parcelleElement.ilot.numero}'
       AND nplen='${this.parcelleElement.numero}'`);
      this.coucheSection.addTo(this.map);
      this.coucheParcellaires.addTo(this.map);
      this.coucheParcelleUnique.addTo(this.map);
      this.coucheParcelleUnique.on('load', () => {
        this.map.invalidateSize();
        this.getParcelles("cadastrebf","plan_cadastre_parcelles",this.CQL_FILTER);
      });
    }

  }

  recentrer() {
    this.estCentre = false;
    this.getParcelles("cadastrebf","plan_cadastre_parcelles",this.CQL_FILTER);
  }

  // Ajouter un bouton personnalisé à la carte pour recentrer sur la parcelle
  private addRecenterButton(): void {
    const controlRecenter = L.Control.extend({
      options: {
        position: 'topleft'
      },
      onAdd: (map) => {
        const containeur = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
        let matIcon = this.renderer.createElement('mat-icon');
        this.renderer.addClass(matIcon, 'material-icons');
        const text = this.renderer.createText('my_location');  // nom de l'icône
        this.renderer.appendChild(matIcon, text);
        this.renderer.appendChild(containeur, matIcon);
        containeur.style.backgroundColor = '#dcdada';
        containeur.style.cursor = 'pointer';
        containeur.style.width = '30px';
        containeur.style.height = '30px';
        containeur.style.display = 'flex';
        containeur.style.alignItems = 'center';
        containeur.style.justifyContent = 'center';
        containeur.setAttribute('matTooltip', 'Superposer Google Satellite');
        containeur.setAttribute('matTooltipPosition', 'below');
        containeur.onclick = () => {
          this.map.invalidateSize();
           this.recentrer();
        };
        return containeur;
      }
    });
    this.map.addControl(new controlRecenter());
  }

  private readonly selectedStyle = {
    color: '#27b286',
    weight: 2,
    fillOpacity: 0.5,
    fillColor: '#27b286'
  };
  parcelleClic() {
    // Désactiver le zoom au double-clic
    this.map.doubleClickZoom.disable();

    // Gestion du drag
    this.map.on('mousedown', () => {
      this.isDragging = false;
    });

    this.map.on('mousemove', () => {
      this.isDragging = true;
    });

    this.map.on('mouseup', () => {
      setTimeout(() => {
        this.isDragging = false;
      }, 50);
    });

    // Gestion du double-clic
    fromEvent(this.map, 'dblclick')
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
          this.map.removeLayer(this.selectedLayer);
          this.selectedLayer = null;
        }

        this.loading = true;
        this.http.get(url).subscribe((response: any) => {
          this.loading = false;
          if (response.features && response.features.length > 0) {
            const properties = response.features[0].properties;
            this.selectedLayer = L.geoJSON(response.features[0], {
              style: this.selectedStyle
            }).addTo(this.map);

            const popupContent = this.popupService.createPopupContent(properties);
            L.popup({
              maxWidth: 400,
              className: 'custom-popup'
            })
              .setLatLng(e.latlng)
              .setContent(popupContent)
              .openOn(this.map);
          } else {
            this.openSnackBar("Aucune donnée de parcelle trouvée à cet emplacement.", "Ok");
          }
        });
      });
  }

  getFeatureInfoUrl(latlng) {
    const point = this.map.latLngToContainerPoint(latlng, this.map.getZoom());
    const size = this.map.getSize();

    const params = {
      request: 'GetFeatureInfo',
      service: 'WMS',
      srs: 'EPSG:4326',
      styles: '',
      transparent: true,
      version: '1.1.1',
      format: 'image/png',
      bbox: this.map.getBounds().toBBoxString(),
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
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4000,
      verticalPosition: "top",
    });
  }


}
