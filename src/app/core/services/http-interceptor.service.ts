import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject, catchError, debounceTime, finalize, throwError } from 'rxjs';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

import { SpinnerService } from './spinner.service';
import { ERROR_CODES, LOCAL_SESSION_STORAGE, URL } from '../../shared/constants/constans';
import { CheckTokenExpiryService } from './check-token-expiry.service';
import { Router } from '@angular/router';
import { ConfigService } from './config.service';


const noTokenEndpoints = [
  URL.ADM_BASE_URL + 'genrateSSO',
  URL.ADM_BASE_URL + 'genrateSSOURL'
];

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  userDetails: any;
  baseLangId!: string;
  isUserLoggedin: boolean = false;
  isUserLoggedOut: boolean = true;
  private totalRequests: number = 0;
  private apiCalls = new Subject<void>();

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private loadingService: SpinnerService,
    private checkTokenExpiryService: CheckTokenExpiryService,
     private configService: ConfigService
  ) {
    this.userDetails = (localStorage.getItem(LOCAL_SESSION_STORAGE.USER_DATA));
    this.baseLangId = (localStorage.getItem(LOCAL_SESSION_STORAGE.BASELANGID)!);
    this.checkUserLoginLogout();
    this.setupDebounce();
  }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    this.apiCalls.next();

    if (!sessionStorage.getItem(LOCAL_SESSION_STORAGE.USER_DATA)) {
      sessionStorage.setItem(LOCAL_SESSION_STORAGE.USER_DATA, this.userDetails);
    }
    if (!sessionStorage.getItem(LOCAL_SESSION_STORAGE.BASELANGID)) {
      sessionStorage.setItem(LOCAL_SESSION_STORAGE.BASELANGID, this.baseLangId);
    }

    let request: any;
    let token;
    if (localStorage.getItem(LOCAL_SESSION_STORAGE?.TOKEN) != undefined) {
      token = JSON.parse(localStorage.getItem(LOCAL_SESSION_STORAGE?.TOKEN)!);
    }

    if ((localStorage.getItem(LOCAL_SESSION_STORAGE.TOKEN)) && (!sessionStorage.getItem(LOCAL_SESSION_STORAGE.TOKEN))) {
      sessionStorage.setItem(LOCAL_SESSION_STORAGE.TOKEN, token);
    }

    if (token) {
      let content_type :any = req.headers.get('content-type');
      if(!!content_type && content_type==='multipart/form-data'){
        request = req.clone({ headers: req.headers.set('Content-Type', '')})
      }else if(!!content_type && content_type!=='multipart/form-data'){
        request = req.clone({ headers: req.headers.set('Content-Type', content_type)})
      }
      if (noTokenEndpoints.includes(req.url)) {
        request = req.clone({
          setHeaders: {
            'skip':"true",
            'timeOffset': new Date().getTimezoneOffset().toString(),
          }
        });
      } else {
        request = req.clone({
          setHeaders: {
            'skip':"true",
            'Authorization': token,
            'timeOffset': new Date().getTimezoneOffset().toString(),
          }
        });
      }
    }

    this.totalRequests++;
    this.loadingService.setLoading(true);

    return next.handle(request ? request : req).pipe(catchError(err => {
      if (err instanceof HttpErrorResponse) {
        if ((err.status === ERROR_CODES.UNAUTHORIZED) || (err.status === 304)) {
          console.error(err);
          this.clearBSPKeysFromStorage();
          this.configService.loadAppConfig();
          this.router.navigate(['/login']);
        }
      }

      const error = err || err.statusText;

      return throwError(() => {
        new Error(error);
        console.log(error, 'from interceptor');
      });

    })).pipe(finalize(() => {
      this.totalRequests--;
      if (this.totalRequests == 0) {
        this.loadingService.setLoading(false);
      }
    }));
  }

  /**
   * @function to extend session based on last API call made.
   * @returns void.
   */
  private setupDebounce(): void {
    if (this.isUserLoggedOut) {
      return;
    }

    if (this.isUserLoggedin) {
      this.apiCalls.pipe(
        debounceTime(5 * 60 * 1000)  //milliseconds after last API call.
      ).subscribe(() => {
        this.checkTokenExpiryService.extendSession();
      });
    }
  }

  /**
   * @function to check user login logout status.
   * @returns void.
   */
  checkUserLoginLogout(): void {
    this.checkTokenExpiryService.isUserLoggedIn$.subscribe({
      next: (res) => {
        this.isUserLoggedin = res;
      }
    });
    this.checkTokenExpiryService.isUserLoggedout$.subscribe({
      next: (res) => {
        this.isUserLoggedOut = res;
      }
    });
  }

  /**
* @function to clear session and local storage for BSP data.
* @returns void.
*/
  clearBSPKeysFromStorage() {
    const keysToClear = Object.values(LOCAL_SESSION_STORAGE);

    keysToClear.forEach((key) => {
      // Remove key from sessionStorage if it exists
      if (sessionStorage.getItem(key) !== null) {
        sessionStorage.removeItem(key);
      }

      // Remove key from localStorage if it exists
      if (localStorage.getItem(key) !== null) {
        localStorage.removeItem(key);
      }
    });
  }
}
