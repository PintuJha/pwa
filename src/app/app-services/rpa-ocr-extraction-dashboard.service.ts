import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/core/services/http.service';
import { CONSTANTS, LOCAL_SESSION_STORAGE } from 'src/app/shared/constants/constans';
import { RpaExtractionDto } from '../../app-models/rpa-extraction-dto';

@Injectable({
  providedIn: 'root'
})
export class RpaOcrExtractionDashboardService {
  private apiBaseUrl: string;
  token = LOCAL_SESSION_STORAGE.TOKEN;
  headers = new HttpHeaders().set("X-APP-ID", CONSTANTS.APS_APP_ID).set("X-UNIT-ID", CONSTANTS.APS_UNIT_ID);

  constructor(
    private http: HttpService
  ) {
    this.apiBaseUrl = sessionStorage.getItem(LOCAL_SESSION_STORAGE.API_URL)!;
  }

  getDocumentQueueSearchData(rpaExtractionDto: RpaExtractionDto) {

    return this.http.postData("api/v1/document-queue/search", rpaExtractionDto, this.headers);
  }

}
