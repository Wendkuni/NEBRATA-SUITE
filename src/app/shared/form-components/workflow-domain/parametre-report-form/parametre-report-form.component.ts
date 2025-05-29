import { Component, OnInit, ViewChild, OnDestroy, OnChanges,forwardRef, SimpleChanges, Input, ViewEncapsulation } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormGroup,
} from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { DropzoneComponent, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface ParametreReportFormValue {
  id: number;
  file: string;
  code: string;
  type: number;
  description: string;
}

@Component({
  selector: 'app-dossier-parametre-report',
  templateUrl: './parametre-report-form.component.html',
  styleUrls: ['./parametre-report-form.component.scss'],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ParametreReportFormComponent), multi: true }],
  encapsulation: ViewEncapsulation.None,
})
export class ParametreReportFormComponent implements ControlValueAccessor, OnInit, OnDestroy, OnChanges  {

  @Input()
  touched: boolean;

  @Input("formGroup")
  template: FormGroup;

  @ViewChild(DropzoneComponent, { static: false })
  dropzoneComponentRef?: DropzoneComponent;
  public piecesJointes: string[] = [];

  private _onDestroy = new Subject<void>();

  onChange: any = (_: ParametreReportFormValue) => {};

  onTouch: any = () => {};

  private subscription = new Subscription();

  public config: DropzoneConfigInterface = {
    clickable: true,
    maxFiles: 1,
    autoReset: null,
    resizeWidth :300,
    resizeHeight :300,
    thumbnailHeight: 300,
    thumbnailWidth: 300,
    acceptedFiles: '.jrxml',
    errorReset: null,
    cancelReset: null
  };

  get file() {return this.template.get("file");}
  get code() {return this.template.get("code");}
  get description() {return this.template.get("description");}
  get type() {return null;}

  constructor(
    private _snackBar: MatSnackBar,
    private mediaObserver: MediaObserver,
    ) {}

  public parametreReport = null;
  public isNotFixedValue:boolean=true;
  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });


  }
  ngOnInit(): void {

    this.subscription.add(
      this.template.valueChanges.subscribe((value: ParametreReportFormValue) => {
        this.onChange(value);
      })
    );

    if(this.template.value.code != null){
      this.parametreReport = this.template.value;
    } else {
      this.refresh();
    }

  }

  copyToClipboard() {
    const codeValue = this.template.get('code').value;
    navigator.clipboard.writeText(codeValue).then(() => {
      this.openSnackBar("Code copié dans le presse papier","OK");
    }).catch(err => {
      this.openSnackBar("Erreur de copie","OK");
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition:'top'

    });
  }

  refresh(){
    this.template.patchValue({
      code: this.generateRandomCode()
    });
  }

  generateRandomCode(length: number = 16): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }

    return result;
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
    this.subscription.unsubscribe();
  }

  public onUploadError(args: any): void {
    this.dropzoneComponentRef.directiveRef.reset();
  }
  public resetDropZone(): void {
    this.dropzoneComponentRef.directiveRef.reset();
  }
  public onUploadSuccess(remoteResponse): void {
    this.file.setValue(remoteResponse[1].name);
  }

  public onUploadInit(args: any): void {

  }
  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['touched'] && simpleChanges['touched'].currentValue) {
      this.template.markAllAsTouched();
    }
  }

  writeValue(value: null | ParametreReportFormValue): void {
    if (value) {
      this.template.reset(value);
    }
  }

  registerOnChange(fn: () => {}): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: (_: ParametreReportFormValue) => {}): void {
    this.onTouch = fn;
  }

}
