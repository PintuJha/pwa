import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonService } from 'src/app/core/services/common.service';
import { CONSTANTS, LOCAL_SESSION_STORAGE } from 'src/app/shared/constants/constans';
import { SESSION_EXPIRY_DICT } from 'src/app/shared/model/session-expiry-dialog.model';
import { GET_DICTIONARY_PAYLOAD } from 'src/app/shared/model/shared.model';
import { CommonModule } from '@angular/common';
import { MaterialExampleModule } from 'src/app/shared/angular-material/MaterialExampleModule';
import { DictionaryValidatorPipe } from 'src/app/shared/pipes/dictionary-validator.pipe';
import { SharedModule } from "../../shared/shared.module";


@Component({
  selector: 'app-session-expiry-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MaterialExampleModule, SharedModule],
  templateUrl: './session-expiry-dialog.component.html',
  styleUrls: ['./session-expiry-dialog.component.scss']
})
export class SessionExpiryDialogComponent implements OnInit, OnDestroy {

  //Get Dictionary Data Payload.
  dictionaryData: GET_DICTIONARY_PAYLOAD = {
    languageId: 0,
    appId: "0",
    dictionaryCodes: [],
  };
  //Session Expiry Dialog box labels.
  sessionExpiryDialogLabels = {
    sessionExpiry: '',
    sessionWillExpireIn: '',
    continue: '',
    logout: ''
  }
  //JWT token Expiry Time.
  expiryTime!: number;
  //Dialog Box Timer time.
  remainingTime!: string;
  //Base Language Id of User.
  baseLangId!: number;
  //Timer Interval.
  private interval: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SessionExpiryDialogComponent>,
    private commonService: CommonService,
  ) {
    this.expiryTime = data.expiryTime;
  }

  ngOnInit(): void {
    this.getDictionaryData();
    this.startTimer();
    window.addEventListener('storage', this.handleStorageEvent.bind(this));
  }

  /**
   * @function to start session expiry timer in dialog box.
   * @returns void.
   */
  startTimer(): void {
    this.interval = setInterval(() => {
      const now = Date.now();
      const timeLeft = this.expiryTime - now;

      if (timeLeft <= 0) {
        clearInterval(this.interval);
        this.dialogRef.close('timeExpired');
        localStorage.setItem(LOCAL_SESSION_STORAGE.SESSIONEXPIRED, 'true');
      } else {
        const minutes = Math.floor(timeLeft / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        this.remainingTime = `${minutes}min ${seconds}sec`;
      }
    }, 1000);
  }

  /**
   * @function to and dialog box action across all the tabs user is logged in.
   * @param event from local storage.
   * @returns void.
   */
  handleStorageEvent(event: StorageEvent): void {
    if (event.key === 'continueSession' && event.newValue === 'true') {
      this.dialogRef.close();
    } else if (event.key === 'logoutSession' && event.newValue === 'true') {
      this.dialogRef.close('logout');
    }
  }

  /**
   * @function to handle continue session action on dialog box.
   * @returns void.
   */
  onContinue(): void {
    localStorage.setItem(LOCAL_SESSION_STORAGE.CONTINUESESSION, 'true');
    this.dialogRef.close('continue');
  }

  /**
   * @function to handle logout action on dialog box.
   * @returns void.
   */
  onLogout(): void {
    localStorage.setItem(LOCAL_SESSION_STORAGE.LOGOUTSESSION, 'true');
    this.dialogRef.close('logout');
  }

  /**
* @function to get dictionary data.
* @returns void.
*/
  getDictionaryData(): void {
    this.baseLangId = JSON.parse(sessionStorage.getItem(LOCAL_SESSION_STORAGE.USER_DATA)!).baseLangId;
    const appId = JSON.stringify(CONSTANTS.ADM_APP_ID);
    this.dictionaryData.languageId = this.baseLangId;
    this.dictionaryData.appId = appId;
    this.dictionaryData.dictionaryCodes = SESSION_EXPIRY_DICT;

    this.commonService.getDictionaryByLangPanelDictIds(this.dictionaryData).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.sessionExpiryDialogLabels.sessionExpiry = res?.data?.find((data: any) => data.dictionaryCode == 497)?.value;
          this.sessionExpiryDialogLabels.sessionWillExpireIn = res?.data?.find((data: any) => data.dictionaryCode == 496)?.value;
          this.sessionExpiryDialogLabels.continue = res?.data?.find((data: any) => data.dictionaryCode == 498)?.value;
          this.sessionExpiryDialogLabels.logout = res?.data?.find((data: any) => data.dictionaryCode == 499)?.value;
        }
      }
    })
  }

  /**
   * @function that run when component is destroyed.
   * @returns void.
   */
  ngOnDestroy(): void {
    clearInterval(this.interval);
    window.removeEventListener('storage', this.handleStorageEvent.bind(this));
  }
}
