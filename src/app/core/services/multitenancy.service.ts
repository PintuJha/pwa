import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MultitenancyService {

  //Observable to check if reload data is required.
  reloadData: BehaviorSubject<boolean> = new BehaviorSubject(false);
  //Observable to check if PO is being edited.
  isEditing: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private http: HttpService) {}

  /**
   * @service to get PO data for selected app and unit id.
   * @returns Observable.
   */
  getPOdata(appId: number, unitId: number): Observable<any> {
    return this.http.getData(`getpurchaseorders/${appId}/${unitId}`);
  }

  /**
   * @service to save and edit PO data.
   * @params PO data.
   * @returns Observable.
   */
  savePO(payload: any): Observable<any> {
    return this.http.postData("savepurchaseorder", payload);
  }

  /**
   * @service to send e-mail to spoc.
   * @params selected nodes email.
   * @returns Observable.
   */
  mailToSpoc(payload: any): Observable<any> {
    return this.http.postData("sendpurchaseordermail", payload);
  }

  /**
   * @service to delete PO.
   * @params PO id, App id, Unit id.
   * @returns Observable.
   */
  deletePO(data: any): Observable<any> {
    return this.http.deleteDataWithPayload("deletepurchaseorder", data);
  }
}
