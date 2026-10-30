import { Injectable } from '@angular/core';
import { HttpService } from '../../core/services/http.service';
import { APS_PATHS, PATH } from '../../shared/constants/constans';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CommonService {


  constructor(private http: HttpService) {
  }

  private ImageValueSubject = new BehaviorSubject<String | null>(null)
  public imageValue$: Observable<any | null> = this.ImageValueSubject.asObservable();

  
  getLanguageCombo() {
    return this.http.getData(PATH.GET_ALL_LANGUAGE_COMBO);
  }

  getWhiteLabellData() {
    return this.http.getData(PATH.GET_WHITE_LABEL_DATA);
  }

  updatePrefferefLanguage(userId: number, prefferedLanguage: number) {
    const params = {
      "userId": userId,
      "prefLanguage": prefferedLanguage
    }
    return this.http.postData(PATH.UPDATE_PREFFERED_LANGUAGE, params);
  }

  /**
   * Fetches dictionary data from CDP.
   */
  getDictionaryByLangPanelDictIds(params: any) {
    return this.http.postCDPdata(params);
  }

  /**
  * @function to get previous date on one year ago
  * @returns void.
 */
  prevDateGetter() {
    var currentDate = new Date();
    var previousYearDate = new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), currentDate.getDate());
    var formattedPreviousYearDate = previousYearDate.toISOString().split('T')[0];
    return formattedPreviousYearDate
  }

  /**
      * @function to function to format date
      * @returns void.
     */
  formatDate(date: any) {
    var dateToModify = new Date(date);
    // Extract day, month, and year
    var day: any = dateToModify.getDate() < 31 ? dateToModify.getDate() + 1 : dateToModify.getDate();
    var month: any = dateToModify.getMonth() + 1; // January is 0
    var year = dateToModify.getFullYear();
    // Format day and month with leading zeros if necessary
    day = (day < 10) ? '0' + day : day;
    month = (month < 10) ? '0' + month : month;
    // Formatted date string in the desired format (DD.MM.YYYY)
    var formattedDate = day + '.' + month + '.' + year;
    return formattedDate
  }

  private configValueSubject = new BehaviorSubject<string | null>(null);
  public configValue$: Observable<any | null> = this.configValueSubject.asObservable();

  setConfigValue(value: string) {
    this.configValueSubject.next(value);
  }
  getWhiteLabelDictionaryData(langId: number, appId: number) {
    const params = { appId: appId, langId: langId };
    return this.http.getDataWithParams('fetch-whitelabel-data', params);
  }

  setImageValue(value: string) {
    this.ImageValueSubject.next(value);
  }

  getConfigValue(configKey: string) {
    const appId = JSON.parse(localStorage.getItem('defaultApplication')!);
    const params = { 'configKey': configKey, 'appId': appId.codeId }
    return this.http.getDataWithParams('get/configvalue', params);
  }

  getUserDivisionList() {
    return this.http.getData(APS_PATHS.GET_GROUP_DIVISION_LIST);
  }

}
