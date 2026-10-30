import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpService } from './http.service';
import { LOCAL_SESSION_STORAGE} from '../../shared/constants/constans';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VersionManagementService {
  public userId = JSON.parse(sessionStorage.getItem(LOCAL_SESSION_STORAGE.USER_DATA)!)
  public currentVersion = signal('');
  reloadGridData: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor(private http: HttpService, private https: HttpClient) { }
  pagination: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public dataOfDropDown = signal([]);


  searchVersionList(page: number, pageSize: number, fromDate: string, toDate: string, search: string, searchType: string) {
    let appId = localStorage.getItem(LOCAL_SESSION_STORAGE.SELECTED_APP_ID)!;
    const params = { pageNo: page, pageSize: pageSize, fromDate: fromDate, toDate: toDate, searchVal: search, searchType: searchType, appId: appId }
    return this.http.getDataWithParams('searchVersion', params);
  }

  getVersionHistroy() {
    let appId = localStorage.getItem(LOCAL_SESSION_STORAGE.SELECTED_APP_ID)!;
    if (!!appId) {
      const params = { appId: appId };
      return this.http.getDataWithParams('versionHistory', params);
    } else {
      return this.http.getDataWithParams('versionHistory');
    }

  }

  loginCurrentVersionHistory(versionId: string, appId: number) {
    const params = { UserId: this.userId.userId, versionId: versionId, appId: appId }
    return this.http.getDataWithParams('getVersionDisplayFlag', params);
  }




  /**
 * @function to get template master subject and message.
 * @returns observable.
 */
  getDescriptionData(langId: number, appId: number) {
    const param = { langId: langId, appId: appId };
    return this.http.getDataWithParams('get/dictionary/master', param);
  }

  updateCurrentVersion(versionId: string) {
    let url = `updateVersionToUser?userId=${this.userId.userId}&versionId=${versionId}`
    return this.http.updateData(url, '');
  }
}
