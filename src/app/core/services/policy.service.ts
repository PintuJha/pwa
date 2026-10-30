import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { PATH } from 'src/app/shared/constants/constans';

@Injectable({
  providedIn: 'root'
})
export class PolicyService {

  constructor(private http: HttpClient, private httpService: HttpService) { }

  /**
   * @function to check whether policy is accepted by user
   * @param data.
   * @returns observable that can be subscribed in the calling component.
   */
  isPolicyAccepetedCheck(params: any): Observable<any> {
    return this.httpService.getDataWithParams(PATH.CHECKISPOLICYACCEPTED, params);
  }


  /**
 * @function to fetch policy details
 * @param data.
 * @returns observable that can be subscribed in the calling component.
 */
  getPolicyDetails(params:any): Observable<any> {
    return this.httpService.getDataWithParams(PATH.GET_POLICY_DETAILS, params);
  }

  /**
  * @function to update policy details for user
  * @param data.
  * @returns observable that can be subscribed in the calling component.
  */
  updatePolicyAcceptanceFlag(params: any): Observable<any> {
    return this.httpService.getDataWithParams(PATH.UPDATE_POLICY_DETAILS, params);
  }

}
