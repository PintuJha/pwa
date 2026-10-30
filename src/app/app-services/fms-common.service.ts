import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/core/services/http.service';
import { APS_PATHS } from 'src/app/shared/constants/constans';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { APSCommonDTO } from '../../app-models/APSCommonDTO';

@Injectable({
  providedIn: 'root'
})
export class FmsCommonService {

  constructor(private http: HttpService) { }

  getUserDivisionList() {
    return this.http.getData(APS_PATHS.GET_GROUP_DIVISION_LIST);
  }

  getDateWiseUploadedFileList(apsCommonDTO: APSCommonDTO) {
    const headers = new HttpHeaders().set("X-APP-ID", "438").set("X-UNIT-ID", "1");
    return this.http.postData(APS_PATHS.GET_DATE_WISE_UPLOADED_FILE_LIST, apsCommonDTO, headers);
  }

  getCodeDetailByCodeMasterName(appId: number, codeMasterName: string) {
    const params = new HttpParams().set('appId', appId).set('codeMasterName', codeMasterName);
    return this.http.postData(APS_PATHS.GET_CODE_MASTER_BY_CODE_MASTER_NAME, params);
  }

  getCommonValuesByCommonMasterName(appId: number, commonMasterName: string) {
    const params = new HttpParams().set('appId', appId).set('commonMasterName', commonMasterName);
    return this.http.postData(APS_PATHS.GET_COMMON_VALUES_BY_COMMON_MASTER_NAME, params);
  }

  getEmailList(params: any) {
    return this.http.getDataWithParams("api/fmsCommonApi/getUserEmailList", params);
  }

}
