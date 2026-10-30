import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})

export class LayoutService {

  //Observable to check if layout component is rendered for the first time after login.
  layoutInitialRender: BehaviorSubject<boolean> = new BehaviorSubject(false);
  //Observable to store add button hidden/disable value.
  addPermissionMode: BehaviorSubject<number> = new BehaviorSubject(0);
  //Observable to store edit button hidden/disable value.
  editPermissionMode: BehaviorSubject<number> = new BehaviorSubject(0);
  //Observable to store delete button hidden/disable value.
  deletePermissionMode: BehaviorSubject<number> = new BehaviorSubject(0);
  //
  isSelectedAppUnitChanged: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private http: HttpService) { }

  /**
   * @service to get apps linked to logged in user's id.
   * @params user's id.
   * @returns Observable.
   */
  getUserApplications(userId: number, appId: number): Observable<any> {
    let param;
    if (!appId) {
      param = { userId: userId };
    } else {
      param = { userId: userId, appId: appId };
    }
    return this.http.getDataWithParams('getappdropdown', param);
  }

  getUserAssignedUnits(userId: number, appId: number): Observable<any> {
    let param;
    if (!appId) {
      param = { userId: userId };
    } else {
      param = { userId: userId, appId: appId, orgId: 2 };
    }
    return this.http.getDataWithParams('getunitdropdown', param);
  }
  /**
 * Service method to check if the logged-in user has accepted the policy for a specific application.
 * @param userId - The ID of the user (optional).
 * @param appId - The ID of the application (optional, defaults to 0 if not provided).
 * @returns Observable<any> - An observable containing the policy acceptance status.
 */
  checkUserPolicyAcceptance(userId?: number, appId?: number): Observable<any> {
    let params = { userId: userId, appId: appId || 0 }; // Ensure appId defaults to 0 if not provided
    return this.http.getDataWithParams('checkUserPolicyAcceptance', params);
  }
}
