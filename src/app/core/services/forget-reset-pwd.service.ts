import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { HttpService } from './http.service';
import { PATH } from 'src/app/shared/constants/constans';

@Injectable({
  providedIn: 'root'
})
export class ForgetResetPwdService {

  constructor(private http: HttpClient, private httpService: HttpService) { }


  sendResetPwdUrl(params: { [x: string]: string | number | boolean; } | undefined): Observable<any> {
    return this.httpService.postData("resetpassword", params);
  }

  validateResetPWDURL(params: { [x: string]: string | number | boolean; } | undefined): Observable<any> {
    return this.httpService.getDataWithParams("validateTempPwd", params);
  }

  saveNewPWD(params: { [x: string]: string | number | boolean; } | undefined): Observable<any> {
    return this.httpService.postData("savepwd", params);
  }

  confimationResetPWDURL(params: { [x: string]: string | number | boolean; } | undefined): Observable<any> {
    return this.httpService.getDataWithParams(PATH.GENERATE_PASSWORD, params);
  }

/**
 * Retrieves the expiration time for an email and appId.
 *
 * @param {Record<string, string | number | boolean> | undefined} params - 
 * The request parameters containing email and appId.
 * @returns {Observable<any>} - An observable containing the response data.
 */
getGenerateExpireTime(params: Record<string, string | number | boolean> | undefined): Observable<any> {
  return this.httpService.getDataWithParams(PATH.GET_GENERATE_EXPIRE_TIME, params);
}

  onSavePassword(payload: any) {
    return this.httpService.postData('savepwd', payload);
  }

}
