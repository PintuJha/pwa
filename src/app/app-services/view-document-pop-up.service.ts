import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/core/services/http.service';
import { LOCAL_SESSION_STORAGE, CONSTANTS } from 'src/app/shared/constants/constans';
import { APSCommonDTO } from '../../app-models/APSCommonDTO';

import { Observable } from 'rxjs';
import { ConfigService } from 'src/app/core/services/config.service';
import { OcrFieldDataRequestDTO } from '../../app-models/ocr-request-data-dto';

@Injectable({
  providedIn: 'root'
})
export class ViewDocumentPopUpService {

  private apiBaseUrl: string;
  token = LOCAL_SESSION_STORAGE.TOKEN;
  headers = new HttpHeaders().set("X-APP-ID", CONSTANTS.APS_APP_ID).set("X-UNIT-ID", CONSTANTS.APS_UNIT_ID);

  constructor(
    private http: HttpService,
    private httpClient: HttpClient,
    private configService: ConfigService
  ) {
    this.apiBaseUrl = sessionStorage.getItem(LOCAL_SESSION_STORAGE.API_URL)!;
  }

  getDocumentFieldData(apsCommonDTO: APSCommonDTO) {
    return this.http.postData("api/viewDocument/getDocsOcrDetails", apsCommonDTO, this.headers);
    // return this.http.get('assets/fieldData.json');
  }

  updateDocsOcrDetails(ocrRequestDataDTO: OcrFieldDataRequestDTO) {
    return this.http.postData("api/viewDocument/updateDocsOcrDetails", ocrRequestDataDTO, this.headers);
  }

  updateDocsDetails(apsCommonDTO: APSCommonDTO) {
    return this.http.postData("api/viewDocument/updateDocsDetails", apsCommonDTO, this.headers);
  }

  downloadInvoiceDocument(apsCommonDTO: APSCommonDTO): Observable<Blob> {
    const apiBaseUrl = this.configService.appConfig;
    const authKey = JSON.parse(localStorage.getItem(LOCAL_SESSION_STORAGE.TOKEN) || "");
    const headers = new HttpHeaders()
      .set("Authorization", authKey)
      .set("X-APP-ID", CONSTANTS.APS_APP_ID)
      .set("X-UNIT-ID", CONSTANTS.UNIT_ID);

    const httpOptions = {
      responseType: 'blob' as const,
      headers,
    };

    return this.httpClient.post(`${apiBaseUrl}/api/viewDocument/downloadFile`, apsCommonDTO, httpOptions);
  }
}
