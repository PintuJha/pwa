// src/app/core/services/webservice-api.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONSTANTS, LOCAL_SESSION_STORAGE } from 'src/app/shared/constants/constans';

@Injectable({
  providedIn: 'root'
})
export class WebserviceApiService {

  constructor(private http: HttpClient) { }

/**
 * @function to get dictionary from the dictionary web service.
 * @returns observable.
 */
  getDictionary(params: {
    appId: string;
    languageId: string;
    dictionaryCodes: string;
  }): Observable<any> {

    const adminRedirectUrl = sessionStorage.getItem(LOCAL_SESSION_STORAGE.DICTIONARY_WS_URL)!;

    const requestBody = {
      authorizationData: {
        appId: params.appId,
        clientSecret: CONSTANTS.BSP_APP_CLIENTSECRET_KEY
      },
      dictionaryDTO: {
        langId: params.languageId,
        dictionaryCode: Array.isArray(params.dictionaryCodes)
      ? params.dictionaryCodes.join(',')
      : params.dictionaryCodes
      }
    };
    return this.http.post(adminRedirectUrl, requestBody);

  }
}
