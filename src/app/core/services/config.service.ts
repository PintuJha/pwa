import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { LOCAL_SESSION_STORAGE } from 'src/app/shared/constants/constans';

interface AppConfig {
  apiUrl: string;
  cdpUrl: string;
  adminRedirectUrl: string;
  oktaRedirectUri: string;
  dictionaryWSUrl:string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  appConfig!: string;
  cdpConfig!: string;
  adminRedirectConfig!: string;
  dictionaryWSUrl!:string;
  oktaRedirectUri: any;
  hitCaptcha: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor(private http: HttpClient) { }

  loadAppConfig(): Observable<void> {
    return this.http.get<AppConfig>("/assets/path.json").pipe(
      tap((data: AppConfig) => {
        this.appConfig = data.apiUrl
        this.cdpConfig = data.cdpUrl
        this.dictionaryWSUrl = data.dictionaryWSUrl
        this.adminRedirectConfig = data.adminRedirectUrl
        this.oktaRedirectUri = data.oktaRedirectUri;
        this.hitCaptcha.next(true);
        sessionStorage.setItem(LOCAL_SESSION_STORAGE.API_URL, this.appConfig);
        sessionStorage.setItem(LOCAL_SESSION_STORAGE.CDP_URL, this.cdpConfig);
        sessionStorage.setItem(LOCAL_SESSION_STORAGE.ADMIN_REDIRECT_URL, this.adminRedirectConfig);
        sessionStorage.setItem(LOCAL_SESSION_STORAGE.DICTIONARY_WS_URL, this.dictionaryWSUrl);
      }),
      map(() => void 0)
    );
  }
}
