import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  constructor() {}

  public buttonLevelAccess = new Subject<any>;
  ismenuClicked$ = this.buttonLevelAccess.asObservable();

  public isLanguageChanged = new BehaviorSubject<boolean>(false);
  isLanguageChanged$ = this.isLanguageChanged.asObservable();

  public isLanguageListUpdated = new BehaviorSubject<boolean>(false);
  isLanguageListUpdated$ = this.isLanguageListUpdated.asObservable();

  isBaseLanguageChnaged(val: any) {
    this.isLanguageChanged.next(val);
  }
  isLanguageListUpdate(val: any) {
    this.isLanguageListUpdated.next(val);
  }

  whenMenuClicked(val: any) {
    this.buttonLevelAccess.next(val);
  }
  public isCurrentVersionChange = new BehaviorSubject<boolean>(false);


}
