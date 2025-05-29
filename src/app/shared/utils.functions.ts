import { RemoteErrorMessageSnackbarComponent } from './app-toast/snackbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { animate, style, transition, trigger } from '@angular/animations';


export class SycadUtils {

  public static notifyRemoteInfo(infoData,snackBar: MatSnackBar):void {
    let data = {};
    if (infoData.message) {
      data["message"] = infoData.message;
    } else {
      data["message"] = "Opération effectuée avec succès !";
    }
    data["class"] = "info";

      snackBar.openFromComponent(RemoteErrorMessageSnackbarComponent, {
        data,
        panelClass: "mat-snack-bar-info-message",
        duration: 25000,
        verticalPosition: "top",
        horizontalPosition: 'center'

      });

    }

  public static notifyRemoteWarning(warningData,snackBar: MatSnackBar):void {
    let data = {};
    if (warningData.message) {
      data["message"] = warningData.message;
    } else {
      data["message"] = "Une alerte a été déclenchée";
    }
    data["class"] = "warning";

      snackBar.openFromComponent(RemoteErrorMessageSnackbarComponent, {
        data,
        panelClass: "mat-snack-bar-warning-message",
        duration: 25000,
        verticalPosition: "top",
        horizontalPosition: 'center'

      });

    }

   public static notifyRemoteError(errorData,snackBar: MatSnackBar):void {
    let data = {};
    if (errorData.message) {
      data["message"] = errorData.message;
    } else {
      data["message"] = "L'action n'a pas pu être effectuée";
    }
    data["class"] = "error";

      snackBar.openFromComponent(RemoteErrorMessageSnackbarComponent, {
        data,
        panelClass: "mat-snack-bar-error-message",
        duration: 25000,
        verticalPosition: "top",
        horizontalPosition: 'center'

      });

    }
}


export function mettreANullLesBlank(data) {
  for (let key in data) {
    if (data[key] === '') {
      data[key] = null;
    } else if (typeof data[key] === 'object' && data[key] !== null) {
      if (Array.isArray(data[key])) {
        // Si la valeur est un tableau, on parcourt ses éléments
        data[key] = data[key].map(item => {
          if (typeof item === 'object' && item !== null) {
            // Appel récursif si l'élément est un objet ou un tableau
            return mettreANullLesBlank(item);
          }
          return item; // Retourne l'élément si ce n'est ni un objet ni un tableau
        });
      } else {
        // Appel récursif si la valeur est un objet
        mettreANullLesBlank(data[key]);
      }
    }
  }
  return data;
}



export function hasPermission(perms:String[],myRoles: String[]):boolean{

  if(myRoles==null) {
    return null;
  }

  let i=0;
  let trouve:boolean=false;
   while(i<perms.length && !trouve){
         trouve=myRoles.indexOf(perms[i])>=0;
        i++;
   }
   return trouve;
}
