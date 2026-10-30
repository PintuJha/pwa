import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { CommonService } from 'src/app/core/services/common.service';
import { ConfigService } from 'src/app/core/services/config.service';
import { ForgetResetPwdService } from 'src/app/core/services/forget-reset-pwd.service';
import { NotifyService } from 'src/app/core/services/notify.service';
import { CHANGE_PASSWORD, CONSTANTS, LOCAL_SESSION_STORAGE } from 'src/app/shared/constants/constans';
import { ChangePasswordDTO } from 'src/app/shared/model/change-password-Dto';
import { LogOutDTO } from 'src/app/shared/model/logoutDTO';
import { GET_DICTIONARY_PAYLOAD } from 'src/app/shared/model/shared.model';
import { DictionaryValidatorPipe } from 'src/app/shared/pipes/dictionary-validator.pipe';

@Component({
  selector: 'app-generate-password',
  templateUrl: './generate-password.component.html',
  styleUrl: './generate-password.component.scss',
})
export class GeneratePasswordComponent {

  logOutdto: LogOutDTO = new LogOutDTO();
  userDetails: any;
  message: string = "";
  appId: any;
  languageId!: number;
  email!: string;
  userId!: number;
  parsedJson: any;
  expireLink: any;
  confirmationMail: any;
  constructor(private menuService: ForgetResetPwdService,
    private route: ActivatedRoute, private router: Router, private notifyService: NotifyService, private commonService: CommonService, public dialog: MatDialog, private appConfigService: ConfigService, private forgetResetPwdService: ForgetResetPwdService,) {
  }
  changePasswordDTO: ChangePasswordDTO = new ChangePasswordDTO();
  changepasswordLabels: any = {
    temporarypassword: '',
    welcomeMessage: '',
    temporarypasswordalready: '',
    expireLink: '',
    refresh: '',
  }
  translatePipe!: DictionaryValidatorPipe;
  dictionaryData: GET_DICTIONARY_PAYLOAD = {
    languageId: 0,
    dictionaryCodes: [],
    appId: "0"
  };
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.route.queryParamMap.subscribe({
      next: (paramMap) => {
        this.appId = paramMap.get('appId')
      }
    })
    this.route.queryParams.subscribe(s => {
      this.email = s['email']
      this.userId = s['userId']
      this.languageId = s['langId']
      this.getGenerateExpireTime();
    });

  }

  getGeneratePassword() {
    let params = { email: this.email, appId: this.appId, userId: this.userId };
    setTimeout(() => {
      this.menuService.confimationResetPWDURL(params).subscribe({
        next: (data) => {
          if (data.messageCode == 200) {
            this.message = data.data.message
          } else {
            this.message = data.message
          }
        },
        error(err) {
          console.log('error found');
        },
      })
    })
  }

  /**
    * @function to fetch dictionary data for user preffered language
    */
  getDictionaryData() {
    this.dictionaryData.languageId = this.languageId;
    this.dictionaryData.appId = CONSTANTS.ADM_PANEL_APP_ID;
    this.dictionaryData.dictionaryCodes = CHANGE_PASSWORD;
    this.commonService.getDictionaryByLangPanelDictIds(this.dictionaryData).subscribe({
      next: (resp) => {
        if (resp.status === 'success') {
          this.changepasswordLabels.temporarypassword = resp?.data?.find((data: any) => data?.dictionaryCode == 1091)?.value;
          this.changepasswordLabels.welcomeMessage = resp?.data?.find((data: any) => data?.dictionaryCode == 1337)?.value;
          this.changepasswordLabels.temporarypasswordalready = resp?.data?.find((data: any) => data?.dictionaryCode == 1090)?.value;
          this.changepasswordLabels.expireLink = resp?.data?.find((data: any) => data?.dictionaryCode == 1297)?.value;
          this.changepasswordLabels.refresh = resp?.data?.find((data: any) => data?.dictionaryCode == 1347)?.value;

        }
        if (this.expireLink === 0) {
          this.getGeneratePassword();
        }
      }
    });
  }

  /**
* Retrieves the expiration status of a password reset link based on query parameters.
*
* This method extracts `appId` and `email` from the route query parameters,
* constructs the required request parameters, and then calls the
* `forgetResetPwdService.getGenerateExpireTime()` method to fetch expiration details.
*/
  getGenerateExpireTime() {
    this.confirmationMail = 'confirmation';
    // Prepare the request parameters
    const params = { email: this.email, appId: this.appId, mailType: this.confirmationMail };

    // Delay execution to ensure values are properly set
    setTimeout(() => {
      this.forgetResetPwdService.getGenerateExpireTime(params).subscribe({
        next: (data) => {
          this.parsedJson = data;
          this.expireLink = this.parsedJson.data; // Store expiration status
          this.getDictionaryData();
          console.log(this.expireLink); // Log expiration status for debugging
        },
        error(err) {
          console.error('Error occurred while fetching expiration status:', err);
        },
      });
    });
  }

  /**
    * @function to clear session and local storage for ADM data.
    * @returns void.
    */
  clearADMKeysFromStorage() {
    const keysToClear = Object.values(LOCAL_SESSION_STORAGE);
    keysToClear.forEach((key) => {
      // Remove key from sessionStorage if it exists
      if (sessionStorage.getItem(key) !== null) {
        sessionStorage.removeItem(key);
      }
      // Remove key from localStorage if it exists
      if (localStorage.getItem(key) !== null) {
        localStorage.removeItem(key);
      }
    });

    this.dialog.closeAll();
  }

  /**
   * @function clears login form field and navigates user back to enter login  screen
   * @returns void
   */
  login(): void {
    this.clearADMKeysFromStorage();
    this.router.navigate(['/login']);
    this.appConfigService.loadAppConfig();
  }


}
