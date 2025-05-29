import {
  ChangeDetectorRef,
  Component, forwardRef,
  Input, OnDestroy,
  OnInit,
} from '@angular/core';
import {
  AttributionParcelle
} from "@sycadApp/models/workflow/sd-attribution.model";
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {Subject} from "rxjs";


@Component({
  selector: 'app-parcelle-visualiser',
  templateUrl: './parcelle-visualiser.component.html',
  styleUrls: ['./parcelle-visualiser.component.scss'],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ParcelleVisualiserComponent), multi: true }],
})
export class ParcelleVisualiserComponent<T> implements OnInit ,OnDestroy{

  @Input("attribution")
  attribution: T;
  private _onDestroy = new Subject<void>();
  constructor( private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.cdr.detectChanges();
  }
  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
