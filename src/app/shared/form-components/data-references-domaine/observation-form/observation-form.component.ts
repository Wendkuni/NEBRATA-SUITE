import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { environment } from 'environments/environment';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-observation-form',
  templateUrl: './observation-form.component.html',
  styleUrls: ['./observation-form.component.scss']
})
export class ObservationFormComponent implements OnInit {

  
  private _onDestroy = new Subject<void>();
  @Input("formGroup") dossierForm;
  
  get observation() { return this.dossierForm.get('observation'); }
  
  constructor(
    private fb: FormBuilder,
    private mediaObserver: MediaObserver
    ) {}

    public activeMediaQuery = '';

    ngAfterContentInit() {
      this.mediaObserver.media$.subscribe((change: MediaChange) => {
        this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
      });
    }
  ngOnInit(): void {

  }
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: "7rem",
    minHeight: "4rem",
    width: "auto",
    minWidth: "0",
    translate: "yes",
    enableToolbar: true,
    showToolbar: true,
    placeholder: "Saisir un texte...",
    defaultParagraphSeparator: "",
    defaultFontName: "",
    defaultFontSize: "",
    fonts: [
      { class: "arial", name: "Arial" },
      { class: "times-new-roman", name: "Times New Roman" },
      { class: "calibri", name: "Calibri" },
      { class: "comic-sans-ms", name: "Comic Sans MS" },
    ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: "redText",
        class: "redText",
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ],
    //uploadUrl: environment.APPLICATION.UPLOAD_FILE_API,
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: "top",
    toolbarHiddenButtons: [["bold", "italic"], ["fontSize"]],
  };
}
