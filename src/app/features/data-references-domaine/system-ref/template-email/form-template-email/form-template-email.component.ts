import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subject, of } from "rxjs";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { RemoteErrorMessageSnackbarComponent } from "@sycadApp/shared/app-toast/snackbar.component";
import { TemplateEmailService } from '@sycadApp/services/data-references/system/template-email.service';

import { AngularEditorConfig } from "@kolkov/angular-editor";
import { TemplateEmail } from "@sycadApp/models/data-references/system/template-email";
import { SycadUtils } from "@sycadShared/utils.functions";
import { MediaChange, MediaObserver } from "@angular/flex-layout";
import { ActivatedRoute, Router } from "@angular/router";
import { AppConfirmService } from "@sycadApp/shared/app-confirm/app-confirm.service";
import { DateAdapter } from "@angular/material/core";
import { getErrors } from "@sycadApp/shared/validators/global-pattern";
import { takeUntil } from "rxjs/operators";
import { environment } from "environments/environment";

@Component({
  selector: "app-form-template-email",
  templateUrl: "./form-template-email.component.html",
  styleUrls: ["./form-template-email.component.scss"],
})
export class FormTemplateEmailComponent implements OnInit {
  public formulaire: FormGroup;
  private _onDestroy = new Subject<void>();
  public isLoadingResults:boolean = false;
  public templateEmail: TemplateEmail;

  get subject() { return this.formulaire.get("subject");}
  get textRich() { return this.formulaire.get("textRich");  }

  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }

  constructor(
    public TemplateEmailService: TemplateEmailService,
    private _snackBar: MatSnackBar,
    public fb: FormBuilder,
    private router: Router,
    public confirmService: AppConfirmService,
    private route: ActivatedRoute,
    private _adapter: DateAdapter<any>,
    private mediaObserver: MediaObserver,
  ) {
    this.templateEmail = this.route.snapshot.data["templateEmail"],
    this.formulaire = this.fb.group({
      id: null,
      subject: [null, [Validators.required]],
      textRich: [null, [Validators.required]]
    });
  }
  public formErrors: Array<string>;
  ngOnInit(): void {
    this.formulaire.valueChanges.pipe(
      takeUntil(this._onDestroy)
    ).subscribe(() => {
      this.formErrors = getErrors(this.formulaire);
    });

    if (this.templateEmail) {
      this.formulaire.patchValue({
        id: this.templateEmail.id,
        subject: this.templateEmail.subject,
        textRich: this.templateEmail.textRich
      });
    } else {
      this.templateEmail = new TemplateEmail();
    }
  }

  onSubmit() {
    if (!this.formulaire.valid) {
      return false;
    } else {
      if (this.formulaire.value) {
        this.isLoadingResults = true;
        if (this.formulaire.value.id) {
          this.TemplateEmailService.update(this.formulaire.value).subscribe(
            (data) => {
              this.isLoadingResults = false;
              this.openSnackBar("Le template email est modifié avec succès", "ok");
             this.router.navigate([environment.FRONTEND_ROUTES.CONFIGURATION_TEMPLATE_EMAIL]);
            },
            (errorResponse) => {
              this.isLoadingResults = false;
              SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
            }
          );
        }
      }
    }
  }

  //
  /*destructure d'instance*/
  resetForm(){
    this.router.navigate([`${environment.FRONTEND_ROUTES.CONFIGURATION_TEMPLATE_EMAIL}`]);

  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition: "top",
    });
  }
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  /*fin destructure d'instance*/

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: "21rem",
    minHeight: "15rem",
    width: "auto",
    minWidth: "0",
    translate: "yes",
    enableToolbar: true,
    showToolbar: true,
    placeholder: "Enter text here...",
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
   // uploadUrl: environment.APPLICATION.UPLOAD_FILE_API,
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: "top",
    toolbarHiddenButtons: [["bold", "italic"], ["fontSize"]],
  };

}
