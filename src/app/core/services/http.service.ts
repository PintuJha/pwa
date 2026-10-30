import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, Subject, catchError, map, tap, throwError } from 'rxjs';
import { LOCAL_SESSION_STORAGE, SERVER_PATHS } from 'src/app/shared/constants/constans';
import { ConfigService } from './config.service';


@Injectable({
  providedIn: 'root'
})
export class HttpService {
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  private _refreshrequired = new Subject<void>();

  get refreshrequired() {
    return this._refreshrequired;
  }

  apiBaseUrl!: string;
  cdpBaseUrl!: string;

  constructor(private configService: ConfigService, private http: HttpClient, private sanitizer: DomSanitizer) {
    this.getBaseUrl();
  }


  getBaseUrl() {
    this.apiBaseUrl = this.configService.appConfig;
    this.cdpBaseUrl = this.configService.cdpConfig;
  }

  get(url: string): Observable<any> {
    return this.http.get(url);
  }

  getUrl(url?: string) {
    this.apiBaseUrl = this.configService.appConfig;
    if (this.apiBaseUrl === undefined) {
      this.apiBaseUrl = sessionStorage.getItem(LOCAL_SESSION_STORAGE.API_URL)!;
    }
    return this.apiBaseUrl + url;
  }

  // Post
  postData(url: any, data: any, headers?: any): Observable<any> {
    let API_URL = this.getUrl(`${SERVER_PATHS.DEV}${url}`);
    return this.http.post(API_URL, data, { headers }).pipe(catchError(this.error));
  }


  // Post
  postCDPdata(data: any): Observable<any> {
    if (this.cdpBaseUrl == undefined && this.cdpBaseUrl == null) {
      this.cdpBaseUrl = sessionStorage.getItem(LOCAL_SESSION_STORAGE.CDP_URL)!;
    }
    let API_URL = this.cdpBaseUrl;
    return this.http.post(API_URL, data).pipe(tap(() => {
      this.refreshrequired.next();
    }), catchError(this.error));
  }


  // Get
  getData(url: any) {
    let API_URL = this.getUrl(`${SERVER_PATHS.DEV}${url}`);

    return this.http.get(decodeURI(API_URL));
  }


  // Get Image
  getImage(url: string) {
    let API_URL = this.getUrl(`${SERVER_PATHS.DEV}${url}`);
    return this.http.get(decodeURI(API_URL),
      {
        headers: new HttpHeaders().set('content-type', 'application/json'),
        responseType: 'blob',
        observe: 'response',
      }
    )
      .pipe(
        map((res: any) => {
          const blob = res.body;
          return this.sanitizer.bypassSecurityTrustUrl(
            URL.createObjectURL(blob)
          );
        })
      );
  }

  // Download
  download(url: any): Observable<any> {

    let httpParams = new HttpParams();
    let API_URL = this.getUrl(`${SERVER_PATHS.DEV}${url}`);
    return this.http
      .get(encodeURI(API_URL), {
        headers: this.headers,
        responseType: "blob",
        params: httpParams,
      })

      .pipe(map((res) => {
        return res;
      }),
        catchError(this.error.bind(this))

      );

  }

  // Get Data with Params
  getDataWithParams(url: any, data?: { [x: string]: any; }): Observable<any> {
    let httpParams = new HttpParams();
    if (data) {

      Object.keys(data).forEach(function (key) {
        httpParams = httpParams.append(key, data[key]);
      });
    }
    let API_URL = this.getUrl(`${SERVER_PATHS.DEV}${url}`);

    return this.http.get(encodeURI(API_URL), {
      params: httpParams,
    });
  }

  // Update
  updateData(url: any, data: any, headers?: any): Observable<any> {
    let API_URL = this.getUrl(`${SERVER_PATHS.DEV}${url}`);

    return this.http
      .put(API_URL, data, { headers })
      .pipe(catchError(this.error));
  }


  // Delete
  deleteData(url: any, data?: any): Observable<any> {
    let API_URL = this.getUrl(`${SERVER_PATHS.DEV}${url}${data}`);

    return this.http.delete(API_URL).pipe(catchError(this.error));
  }

  //Delete Api call with multiple params
  deleteDataWithParams(url: any, data?: { [x: string]: any; }): Observable<any> {
    let httpParams = new HttpParams();
    if (data) {
      Object.keys(data).forEach(function (key) {
        httpParams = httpParams.append(key, data[key]);
      });
    }
    let API_URL = this.getUrl(`${SERVER_PATHS.DEV}${url}`);

    return this.http.delete(encodeURI(API_URL), {
      params: httpParams,
    });
  }

  deleteDataWithPayload(url: any, data?: { [x: string]: any; }): Observable<any> {
    let API_URL = this.getUrl(`${SERVER_PATHS.DEV}${url}`);

    return this.http.delete(encodeURI(API_URL), {
      body: data
    });
  }

  // Handle Errors
  error(error: HttpErrorResponse) {
    if (typeof error == 'string') {
      return throwError(error);
    } else {
      let errorMessage = {};
      if (error.error instanceof ErrorEvent) {
        errorMessage = error.error;
      } else {
        errorMessage = { code: error.status, message: error.error };
      }
      return throwError(errorMessage);
    }
  }
}
