import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { PATH } from 'src/app/shared/constants/constans';
import { LogOutDTO } from 'src/app/shared/model/logoutDTO';


@Injectable({
  providedIn: 'root'
})
export class MenuListService {

  constructor(private http: HttpClient, private httpService: HttpService) { }

  /**
 * @function to fetch configuration details
 * @param data.
 * @returns observable that can be subscribed in the calling component.
 */
  getConfigDetailsList(params: { [x: string]: any } | undefined): Observable<any> {
    return this.httpService.getDataWithParams(PATH.GET_CONFIGDETAILS, params);
  }

  /**
 * @function to fetch menus details list
 * @param data.
 * @returns observable that can be subscribed in the calling component.
 */
  getMenuDetailsList(params: { [x: string]: any } | undefined): Observable<any> {
    return this.httpService.getDataWithParams('get/menu/list', params);
  }
  getButtonLevelAccess(params: { [x: string]: any } | undefined): Observable<any> {
    return this.httpService.getDataWithParams('rbac/button/level/Access', params);
  }


  getLogoutTime(logOutdto: LogOutDTO): Observable<any> {
    return this.httpService.postData(PATH.LOGOUT, logOutdto);
  }

  getLastVisitTime(params: { [x: string]: any } | undefined): Observable<any> {
    return this.httpService.getDataWithParams(PATH.LAST_VISITEDTIME, params);
  }

}
