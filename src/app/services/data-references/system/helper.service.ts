import { BehaviorSubject,Observable, of } from 'rxjs';
import { catchError, map, tap, share } from 'rxjs/operators';



export class HelperService {

    public  handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
    
          // TODO: send the error to remote logging infrastructure
          console.error(error); // log to console instead
    
          // TODO: better job of transforming error for user consumption
          this.log(`${operation} en erreur: ${error.message}, à propager vers le serveur pour observabilité`);
    
          // Let the app keep running by returning an empty result.
          return of(result as T);
        };
      }
      public log(message: string) {
       // console.log(message);
      }
}