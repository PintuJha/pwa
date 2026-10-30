import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LOCAL_SESSION_STORAGE, URL } from '../../shared/constants/constans';
import { ConfigService } from '../../core/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class LinkToAdminService {

  adminRedirectUrl!: string;
  bspUrl!: string;

  constructor(private http: HttpClient, private configService: ConfigService,) {
    this.adminRedirectUrl = sessionStorage.getItem(LOCAL_SESSION_STORAGE.ADMIN_REDIRECT_URL)!;
    this.bspUrl = this.configService.appConfig;
  }

  getUserDetailsForSSO(winUserId: string, domain: string): Observable<any> {
    this.adminRedirectUrl = sessionStorage.getItem(LOCAL_SESSION_STORAGE.ADMIN_REDIRECT_URL)!;
    if (!this.adminRedirectUrl) {
      this.adminRedirectUrl = this.configService.adminRedirectConfig;
    }
    const httpParams = new HttpParams()
      .set('winUserId', winUserId)
      .set('domain', domain);

    const encodedUrl = encodeURI(`${this.adminRedirectUrl}genrateSSO`);

    return this.http.get(encodedUrl, { params: httpParams });
  }

  generateSSOForAdmin(winUserId: string, domain: string, uuid: string, appId: string): Observable<any> {
    const encodedUrl = encodeURI(`${this.adminRedirectUrl}genrateSSOURL`);
    const httpParams = new HttpParams()
      .set('winUserId', winUserId)
      .set('domain', domain)
      .set('uuid', uuid)
      .set('appId', appId);
    return this.http.get(encodedUrl, { params: httpParams });
  }

  getUserDetailsForSSObsp(winUserId: string, domain: string): Observable<any> {
    this.bspUrl = this.configService.appConfig;
    const httpParams = new HttpParams()
      .set('winUserId', winUserId)
      .set('domain', domain);

    const encodedUrl = encodeURI(`${this.bspUrl}/genrateSSO`);

    return this.http.get(encodedUrl, { params: httpParams });
  }

  generateSSOForAdminBsp(winUserId: string, domain: string, uuid: string): Observable<any> {
    const encodedUrl = encodeURI(`${this.bspUrl}/genrateSSOURL`);
    const httpParams = new HttpParams()
      .set('winUserId', winUserId)
      .set('domain', domain)
      .set('uuid', uuid);
    return this.http.get(encodedUrl, { params: httpParams });
  }
}
