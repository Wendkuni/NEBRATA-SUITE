import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map, tap, share, finalize } from 'rxjs/operators';

import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { GlobalDateConverter } from '@sycadApp/shared/global-date-converter';
import { HelperService } from '../../../services/data-references/system/helper.service';
import { TokenJwt, AuthentificatedUser } from '@sycadApp/features/transverse/login/auth.user';




@Injectable({ providedIn: 'root' })
export class AuthenticationService extends HelperService {
  private currentToken: TokenJwt;
  private loadingPageFirstTime:Boolean=true;
  private currentUserSubject: BehaviorSubject<AuthentificatedUser>=new BehaviorSubject<AuthentificatedUser>(null);



  public get currentTokenValue(): TokenJwt {
    return this.currentToken;
  }

  public get pageFirstTime(): Boolean {
    return this.loadingPageFirstTime;
  }

   public pageLoaded(): void {
     this.loadingPageFirstTime=false;
  }
  constructor(private http: HttpClient, public router:Router) {
    super();
   try {
    this.currentToken = JSON.parse(localStorage.getItem('currentToken'));

   }catch(e) {
    this.handleErrorServer();
   }

  }

  login(username: string, password: string, token: string, rememberMe: boolean) {

    let body = new HttpParams().set("username", username).set("password", password).set("token", token).set("rememberMe", rememberMe ? "true" : "false");


    let headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
    return this.http.post<TokenJwt>(`${environment.AUTH.LOGIN_API}`, body, { headers: headers,withCredentials:true })
      .pipe(    tap((jwtObjet) => {
        GlobalDateConverter.convertToDate(jwtObjet,["expiredDate"]);
      }),map(jwtObjet => {
        this.currentToken = jwtObjet;
        //console.log("this.currentToken",this.currentToken)
        localStorage.setItem('currentToken', JSON.stringify(jwtObjet));
        return jwtObjet;
      }));
  }

  updateAvatar(fileName) {
    let user = Object.assign({}, this.currentUserSubject.getValue())
        user.avatar=fileName;
    this.currentUserSubject.next(user);
  }
  public checkIfAmLogin(): Observable<boolean> {

    return this.http.head(environment.AUTH.CHECK_IF_I_AM_LIGIN, { observe: "response" }).pipe(
      map((res) => {
        if(res.status===200){
          return  true;
         }else {
           return false;
         }
      }),
      catchError((err) => {
       // this.handleErrorServer();
        return of(false)
      }),);
  }

  getMe(): BehaviorSubject<AuthentificatedUser> {
    if( !this.currentUserSubject.getValue()) {
     this.me().subscribe();
    }
    return this.currentUserSubject;
  }
  me(): Observable<AuthentificatedUser> {


    return this.http.get<AuthentificatedUser>(`${environment.AUTH.ME_API}`,{withCredentials:true }).pipe(
      tap((user) => {
        GlobalDateConverter.convertToDate(user,["createdAt","dateNaissance","editedAt","lastPasswordResetDate","dateDeCreation","createdAt","dateExpiration","dateObtention"]);
      }),
      tap(user => {

       this.currentUserSubject.next(user);

      }),
      catchError((err) => {
        this.handleErrorServer();
        return of(null)
      }),
      finalize(()=> {
        this.handleError<AuthentificatedUser>(`GET MY CONNECTED PROFILE`)
      }),
      share()
    );
  }

  refresh(): Observable<TokenJwt> {
    return this.http.get<TokenJwt>(`${environment.AUTH.REFRESH_TOKEN_API}`,{ withCredentials:true }).pipe(
      tap(tokenObject => {
        if(tokenObject){
          this.currentToken = tokenObject;
          localStorage.setItem('currentToken', JSON.stringify(tokenObject));
          this.router.navigate(["/"]);
        }

      }),
      share()
    );
  }


  handleErrorServer() {
    this.handleError<any>(`ERROR SERVER`)
   // console.log("handleErrorServer");

    this.router.navigate(['/error']);
  }
  logout() {

       localStorage.removeItem('currentToken');
       this.currentToken=null;

    this.http.get(`${environment.AUTH.LOGOUT_API}`).subscribe(
      {
      next: value => console.log(value),
      error: err => console.error(err),
      complete: () => {
        console.info("logout sucess");
        location.href =environment.FRONTEND_ROUTES.SITE_EXTERNE;
      }
      }
    );




  }
}
