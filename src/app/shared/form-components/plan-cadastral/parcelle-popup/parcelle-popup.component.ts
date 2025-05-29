import {
  Component, EventEmitter,
  Input,
  OnInit, Output
} from '@angular/core';
import {
  ParcelleService
} from "@sycadApp/services/cession-parcelle/parcelle.service";
import {Subject} from "rxjs";

@Component({
  selector: 'app-parcelle-popup',
  templateUrl: './parcelle-popup.component.html',
  styleUrls: ['./parcelle-popup.component.scss']
})
export class ParcellePopupComponent implements OnInit {

  @Input() data: any;
  // parcelleElement: ParcelleElement;
  @Output() destroyed = new EventEmitter<void>();
  private _onDestroy = new Subject<void>();
  constructor(private parcelleService: ParcelleService) { }

  parcelleElement: any = {
    ilot: { section: { commune: {} } },
    arrondissement: {},
    quartier: {},
    localite: {},
    destination: {},
  };
  ngOnInit(): void {
    this.parcelleService.getParcelleByCommuneSectionIlot(this.data.nplen,this.data.commune,
      this.data.nston,this.data.nilotn).subscribe(parcelle=>{
      this.parcelleElement= parcelle;
    })
  }
  ngOnDestroy() {
    this.destroyed.emit();
    this._onDestroy.next();
    this._onDestroy.complete();
  }


}
