import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { HttpService } from 'src/app/core/services/http.service';
import { APS_PATHS, CONSTANTS, LOCAL_SESSION_STORAGE } from 'src/app/shared/constants/constans';
import { RpaExtractionDto } from '../../app-models/rpa-extraction-dto';

@Injectable({
  providedIn: 'root'
})
export class DocumentRepostoryService {
  private apiBaseUrl: string;
  token = LOCAL_SESSION_STORAGE.TOKEN;
  headers = new HttpHeaders().set("X-APP-ID", CONSTANTS.APS_APP_ID).set("X-UNIT-ID", CONSTANTS.APS_UNIT_ID);

  constructor(private http: HttpService) {
    this.apiBaseUrl = sessionStorage.getItem(LOCAL_SESSION_STORAGE.API_URL)!;
  }

  getDocumentRepositorySearchData(rpaExtractionDto: RpaExtractionDto) {
    return this.http.postData("api/ocr/invoices/search", rpaExtractionDto, this.headers);
  }

  getCodeDetailByCodeMasterName(appId: number, codeMasterName: string) {
    const params = new HttpParams().set('appId', appId).set('codeMasterName', codeMasterName);
    return this.http.postData(APS_PATHS.GET_CODE_MASTER_BY_CODE_MASTER_NAME, params);
  }
}
