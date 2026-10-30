import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpService } from 'src/app/core/services/http.service';
import { CONSTANTS, LOCAL_SESSION_STORAGE } from 'src/app/shared/constants/constans';

@Injectable({
  providedIn: 'root'
})
export class ApprovalBenchService {

  headers = new HttpHeaders()
    .set('X-APP-ID', CONSTANTS.APS_APP_ID)
    .set('X-UNIT-ID', CONSTANTS.APS_UNIT_ID);

  constructor(private http: HttpService) { }

  getPendingDocuments(payload: any): Observable<any> {
    return this.http.postData('api/ocr/invoices/search', payload, this.headers);
  }
  submitApprovals(payload: {
    userId: number;
    actionId: number;
    remarks: string;
    invoices: any[];
  }): Observable<any> {
    return this.http.postData('api/approvalBench/submitApprovals', payload, this.headers);
  }

}