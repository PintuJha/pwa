
import { Component, HostListener, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { ChangePasswordService } from 'src/app/core/services/change-password.service';
import { CommonService } from 'src/app/core/services/common.service';
import { ConfigService } from 'src/app/core/services/config.service';
import { ForgetResetPwdService } from 'src/app/core/services/forget-reset-pwd.service';
import { NotifyService } from 'src/app/core/services/notify.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { CONSTANTS, ERROR_CODES, LOCAL_SESSION_STORAGE, TOAST_TYPE } from 'src/app/shared/constants/constans';
import { ChangePasswordDTO } from 'src/app/shared/model/change-password-Dto';
import { CHANGE_PASSWORD } from 'src/app/shared/model/ideal-timeout.model';
import { GET_DICTIONARY_PAYLOAD } from 'src/app/shared/model/shared.model';
import { DictionaryValidatorPipe } from 'src/app/shared/pipes/dictionary-validator.pipe';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss'],
})
export class ForgetPasswordComponent implements OnInit, OnDestroy {

  loginSubscription: Subject<any> = new Subject();
  loginForm !: FormGroup;
  userDetails!: any;
  fullName!: any;
  userId!: any;
  email!: any;
  statusdata!: any;
  newPassword!: any;
  confirmPassword!: any;
  parsedJson: any;
  verifiedStatus: any;
  appId: any;
  expireLink: any;
  temp: any;


  changePasswordDTO: ChangePasswordDTO = new ChangePasswordDTO();
  validationError: boolean = true;
  validationError1: boolean = true;
  validationError2: boolean = true;
  validationError3: boolean = true;
  validationError4: boolean = true;
  validationError5: boolean = true;
  validationError6: boolean = true;
  validationontime: boolean = false;
  changepasswordLabels: any = {
    usernotfound: '',
    oldpasswordisincorrect: '',
    passwordchange: '',
    save: '',
    close: '',
    newPassword: '',
    oldPassword: '',
    confirmPassword: '',
    enterOldPassword: '',
    enterNewPassword: '',
    enterConfirmPassword: '',
    changepassword: '',
    newoldpassword: '',
    mandatory: '',
    passwordexpired: '',
    passwordshort: '',
    passwordlong: '',
    passwordupparcase: '',
    passwordlowercase: '',
    passwordnumbric: '',
    passwordspecialcharacter: '',
    passwordlast: '',
    passworddiffrent: '',
    passwordusername: '',
    passwordencryption: '',
    welcomeMessage: '',
    expireLink: '',
    tempPassword: '',
    confirmationMessage: '',
    validate: '',
    clear: '',
    invalidPassword: '',
    bothPasswordSame: '',
    temppassword: '',
    newpassword: '',
    confirmpassword: '',
    refresh: '',
  }
  translatePipe!: DictionaryValidatorPipe;
  rangevalue: any;
  dictionaryData: GET_DICTIONARY_PAYLOAD = {
    languageId: 0,
    dictionaryCodes: [],
    appId: "0"
  };
  validationCode: any;

  passwordFieldType: string = 'password';
  passwordFieldType1: string = 'password';
  passwordFieldType2: string = 'password';
  private destroy$ = new Subject<void>();


  constructor(
    private router: Router,
    private fb: FormBuilder,
    private forgetResetPwdService: ForgetResetPwdService,
    private toast: ToastService,
    private changePasswordService: ChangePasswordService,
    private commonService: CommonService,
    private configService: ConfigService,
    private route: ActivatedRoute,
    private notifyService: NotifyService,
    private authService: AuthenticationService,
  ) {
  }

  ngOnInit(): void {
    this.getGenerateExpireTime();
    this.createValidationForm();
    this.getDictionaryData();
    this.notifyService.isLanguageChanged.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        if (res) {
          this.getDictionaryData();
          this.notifyService.isLanguageChanged.next(false);
        }
      },
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
    // Extract appId from query parameters
    this.route.queryParamMap.subscribe({
      next: (paramMap) => {
        this.appId = paramMap.get('appId');
      }
    });

    // Extract email from query parameters
    this.route.queryParams.subscribe(params => {
      this.changePasswordDTO.email = params['email'];
      this.changePasswordDTO.languageId = params['langId'];

    });
    this.temp = 'temp';

    // Prepare the request parameters
    const params = { email: this.changePasswordDTO.email, appId: this.appId, mailType: this.temp };

    // Delay execution to ensure values are properly set
    setTimeout(() => {
      this.forgetResetPwdService.getGenerateExpireTime(params).subscribe({
        next: (data) => {
          this.parsedJson = data;
          this.expireLink = this.parsedJson.data; // Store expiration status
        },
        error(err) {
          console.error('Error occurred while fetching expiration status:', err);
        },
      });
    });
  }


  /**
 * Validates the temporary password by checking the expiration status.
 *
 * This method first calls `getGenerateExpireTime()` to determine whether
 * the password reset link has expired. If the link is still valid (`expireLink == 0`),
 * it proceeds to verify the user. Otherwise, it sets `expireLink` to 1,
 * indicating expiration.
 */
  onValidateTempPwd() {
    // Fetch expiration status of the reset link
    this.getGenerateExpireTime();

    // If the link is still valid, proceed with user verification
    if (this.expireLink == 0) {
      this.verifyUser();
    } else {
      // Mark the link as expired
      this.expireLink = 1;
    }
  }


  /**
   * Handles the validation and save process.
   * Calls `getGenerateExpireTime()` to determine expiration status.
   * If `expireLink` is 0, proceeds with form submission; otherwise, sets `expireLink` to 1.
   */
  onValidationSave() {
    this.getGenerateExpireTime(); // Generate expiration time for the link

    if (this.expireLink == 0) {
      this.onSubmit(); // Proceed with form submission if no expiration
    } else {
      this.expireLink = 1; // Set expiration flag if not already set
    }
  }

  /**
  * @function initilizating login form
  * @returns void
  */
  createValidationForm(): void {
    this.loginForm = this.fb.group({
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      tempPassword: ['', Validators.required]
    });
  }


  onSubmit() {
    this.validationontime = false;
    const newPassword = this.loginForm.get('newPassword')?.value;
    const confirmPassword = this.loginForm.get('confirmPassword')?.value;
    const temppwd = this.loginForm.get('tempPassword')?.value;
    // Check if any of the fields are empty.
    if (!newPassword?.trim() || !confirmPassword?.trim()) {
      this.toast.show(this.changepasswordLabels.mandatory, TOAST_TYPE.INFO);
      return;
    }
    if (newPassword !== confirmPassword) {
      this.toast.show(this.changepasswordLabels.bothPasswordSame, TOAST_TYPE.INFO);
      return;
    }
    else if (confirmPassword != null && newPassword != null) {
      if (newPassword == confirmPassword) {
        let payload = {
          email: this.email,
          tempPass: this.authService.encryptPassword(temppwd),
          newPassword: this.authService.encryptPassword(newPassword),
          confirmPassword: this.authService.encryptPassword(confirmPassword)
        };
        this.forgetResetPwdService.saveNewPWD(payload).subscribe({
          next: (res) => {
            this.validationCode = Array.isArray(res.data) ? res.data : [];
            const messageCode = res.messageCode;
            if (messageCode === 685) {
              this.toast.show(this.changepasswordLabels.usernotfound, TOAST_TYPE.INFO);
              return; 164
            } else if (messageCode === 1094) {
              this.toast.show(this.changepasswordLabels.passwordchange, TOAST_TYPE.SUCCESS);
              this.clearBSPKeysFromStorage();
              this.configService.loadAppConfig();
              this.router.navigate(['/login']);
            } else {
              this.validationontime = true;
              this.validation();
            }
          }
        });
      }
    } else {
      this.toast.show("Field should be not blank", TOAST_TYPE.INFO);
    }
  }


  /**
 * @function to verify if user is domain user
 * @returns void
 */
  verifyUser(): void {
    const tempPassword = this.loginForm.get('tempPassword')?.value;
    if (!tempPassword?.trim()) {
      this.toast.show(this.changepasswordLabels.mandatory, TOAST_TYPE.INFO);
      return;
    }
    let params = { tempPwd: tempPassword };
    this.forgetResetPwdService.validateResetPWDURL(params).subscribe({
      next: (data) => {
        const messageCode = data.messageCode;
        if (messageCode === 1291) {
          this.toast.show(this.changepasswordLabels.invalidPassword, TOAST_TYPE.INFO);
          return;
        }
        this.parsedJson
          = data;
        this.statusdata = this.parsedJson.status;
        if (data.status == ERROR_CODES.ISSUCCESS) {
          this.email = this.parsedJson.data.email;
          this.loginForm.get('tempPassword')?.disable();
          this.verifiedStatus = "0005";
          this.getDictionaryData();
        } else if (data.Status == CONSTANTS.ERROR) {
          this.toast.show(CONSTANTS.TEMP_PWD_VALIDATION, TOAST_TYPE.INFO);
        } else {
          this.toast.show(CONSTANTS.CONFIGURETHEPOLICY, TOAST_TYPE.INFO);
        }
      }
    });

  }


  /**
  * @function clears login form field and navigates user back to enter login id screen
  * @returns void
  */
  clear(): void {
    // this.loginForm.reset()
    if (this.statusdata == 'success') {
      // If tempPassword was validated successfully, reset only confirm and new password fields
      this.loginForm.get('confirmPassword')?.reset();
      this.loginForm.get('newPassword')?.reset();
    } else {
      this.loginForm.get('tempPassword')?.reset();
    }

  }

  /**
    * @function clears login form field and navigates user back to enter login  screen
    * @returns void
    */
  login(): void {
    this.clearBSPKeysFromStorage();
    this.router.navigate(['/login']);
    this.configService.loadAppConfig();
  }
  ngOnDestroy(): void {
    this.loginSubscription.unsubscribe();
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    this.clearBSPKeysFromStorage();
    this.router.navigate(['/login']);
  }

  /**
* @function A method call for fetch data from table
* @returns data list of policy value.
*/
  getPasswordPolicyList() {
    this.changePasswordService.getPasswordPolicyList(this.changePasswordDTO).subscribe({
      next: (data: any) => {
        this.changePasswordDTO.isEncryptionRequired = data?.data[0].encryptionRequired;
        this.changePasswordDTO.minimumLength = data?.data[0].minimumLength;
        this.changePasswordDTO.maxmumLength = data?.data[0].maximumLength;
        this.changePasswordDTO.isUpperCaseMust = data?.data[0]?.isUpperCaseMust;
        this.changePasswordDTO.isLowerCaseMust = data?.data[0].isLowerCaseMust;
        this.changePasswordDTO.numericDigitRequired = data?.data[0].numericDigitRequired;
        this.changePasswordDTO.specialCharRequired = data?.data[0].specialCharRequired;
        this.changePasswordDTO.lastPWDnotallowcount = data?.data[0].lastpwdnotallowcount;
        this.changePasswordDTO.lastpwdmatchcount = data?.data[0].lastpwdmatchcount;
        this.changePasswordDTO.allowUsernameinpwd = data?.data[0].allowusernameinpwd;
        this.changePasswordDTO.isPassMinLengthMust = data?.data[0].isPassMinLengthMust;
        this.changePasswordDTO.isPassMaxLengthMust = data?.data[0].isPassMaxLengthMust;
        this.rangevalue = `(${this.changePasswordDTO.minimumLength}~${this.changePasswordDTO.maxmumLength})`;
      }
    })
  }

  /**
   * @function to fetch dictionary data for user preffered language
   */
  getDictionaryData() {
    this.dictionaryData.languageId = this.changePasswordDTO.languageId;
    this.dictionaryData.appId = CONSTANTS.ADM_PANEL_APP_ID;
    this.dictionaryData.dictionaryCodes = CHANGE_PASSWORD;
    this.commonService.getDictionaryByLangPanelDictIds(this.dictionaryData).subscribe({
      next: (resp) => {
        if (resp.status === 'success') {
          this.changepasswordLabels.passwordencryption = resp?.data?.find((data: any) => data?.dictionaryCode == 297)?.value;
          this.changepasswordLabels.passwordminimumLength = resp?.data?.find((data: any) => data?.dictionaryCode == 298)?.value;
          this.changepasswordLabels.password = resp?.data?.find((data: any) => data?.dictionaryCode == 652)?.value;
          this.changepasswordLabels.usernotfound = resp?.data?.find((data: any) => data?.dictionaryCode == 685)?.value;
          this.changepasswordLabels.oldpasswordisincorrect = resp?.data?.find((data: any) => data?.dictionaryCode == 686)?.value;
          this.changepasswordLabels.passwordchange = resp?.data?.find((data: any) => data?.dictionaryCode == 687)?.value;
          this.changepasswordLabels.save = resp?.data?.find((data: any) => data?.dictionaryCode == 36)?.value;
          this.changepasswordLabels.close = resp?.data?.find((data: any) => data?.dictionaryCode == 37)?.value;
          this.changepasswordLabels.oldPassword = resp?.data?.find((data: any) => data?.dictionaryCode == 693)?.value;
          this.changepasswordLabels.newPassword = resp?.data?.find((data: any) => data?.dictionaryCode == 694)?.value;
          this.changepasswordLabels.confirmPassword = resp?.data?.find((data: any) => data?.dictionaryCode == 695)?.value;
          this.changepasswordLabels.enterOldPassword = resp?.data?.find((data: any) => data?.dictionaryCode == 696)?.value;
          this.changepasswordLabels.enterNewPassword = resp?.data?.find((data: any) => data?.dictionaryCode == 697)?.value;
          this.changepasswordLabels.enterConfirmPassword = resp?.data?.find((data: any) => data?.dictionaryCode == 698)?.value;
          this.changepasswordLabels.changepassword = resp?.data?.find((data: any) => data?.dictionaryCode == 699)?.value;
          this.changepasswordLabels.changepassword = resp?.data?.find((data: any) => data?.dictionaryCode == 699)?.value;
          this.changepasswordLabels.newoldpassword = resp?.data?.find((data: any) => data?.dictionaryCode == 703)?.value;
          this.changepasswordLabels.mandatory = resp?.data?.find((data: any) => data?.dictionaryCode == 236)?.value;
          this.changepasswordLabels.passwordexpired = resp?.data?.find((data: any) => data?.dictionaryCode == 737)?.value;
          this.changepasswordLabels.passwordshort = resp?.data?.find((data: any) => data?.dictionaryCode == 729)?.value;
          this.changepasswordLabels.passwordlong = resp?.data?.find((data: any) => data?.dictionaryCode == 730)?.value;
          this.changepasswordLabels.passwordupparcase = resp?.data?.find((data: any) => data?.dictionaryCode == 299)?.value;
          this.changepasswordLabels.passwordlowercase = resp?.data?.find((data: any) => data?.dictionaryCode == 300)?.value;
          this.changepasswordLabels.passwordnumbric = resp?.data?.find((data: any) => data?.dictionaryCode == 301)?.value;
          this.changepasswordLabels.passwordspecialcharacter = resp?.data?.find((data: any) => data?.dictionaryCode == 302)?.value;
          this.changepasswordLabels.passwordlast = resp?.data?.find((data: any) => data?.dictionaryCode == 735)?.value;
          this.changepasswordLabels.passworddiffrent = resp?.data?.find((data: any) => data?.dictionaryCode == 736)?.value;
          this.changepasswordLabels.passwordusername = resp?.data?.find((data: any) => data?.dictionaryCode == 304)?.value;
          this.changepasswordLabels.welcomeMessage = resp?.data?.find((data: any) => data?.dictionaryCode == 1337)?.value;
          this.changepasswordLabels.expireLink = resp?.data?.find((data: any) => data?.dictionaryCode == 1297)?.value;
          this.changepasswordLabels.tempPassword = resp?.data?.find((data: any) => data?.dictionaryCode == 915)?.value;
          this.changepasswordLabels.confirmationMessage = resp?.data?.find((data: any) => data?.dictionaryCode == 1298)?.value;
          this.changepasswordLabels.validate = resp?.data?.find((data: any) => data?.dictionaryCode == 1300)?.value;
          this.changepasswordLabels.clear = resp?.data?.find((data: any) => data?.dictionaryCode == 42)?.value;
        }
        this.changepasswordLabels.invalidPassword = resp?.data?.find((data: any) => data?.dictionaryCode == 1291)?.value;
        this.changepasswordLabels.bothPasswordSame = resp?.data?.find((data: any) => data?.dictionaryCode == 1093)?.value;
        this.changepasswordLabels.passwordPolicyFeatures = resp?.data?.find((data: any) => data?.dictionaryCode == 1261)?.value;
        this.changepasswordLabels.temppassword = resp?.data?.find((data: any) => data?.dictionaryCode == 1339)?.value;
        this.changepasswordLabels.newpassword = resp?.data?.find((data: any) => data?.dictionaryCode == 1340)?.value;
        this.changepasswordLabels.confirmpassword = resp?.data?.find((data: any) => data?.dictionaryCode == 1341)?.value;
        this.changepasswordLabels.refresh = resp?.data?.find((data: any) => data?.dictionaryCode == 1347)?.value;
        this.getPasswordPolicyList();
      }
    });
  }

  validation() {
    this.validationError = false;
    this.validationError1 = false;
    this.validationError2 = false;
    this.validationError3 = false;
    this.validationError4 = false;
    this.validationError5 = false;
    this.validationError6 = false;

    const dynamicValue = this.changePasswordDTO.lastpwdmatchcount;
    const targetString = `735,${dynamicValue},736`;
    if (Array.isArray(this.validationCode)) {
      this.validationError = this.validationCode.includes("731");
      this.validationError1 = this.validationCode.includes("732");
      this.validationError2 = this.validationCode.includes("733");
      this.validationError3 = this.validationCode.includes("734");
      this.validationError4 = this.validationCode.includes("304");
      this.validationError5 = this.validationCode.includes(targetString);
      this.validationError6 = this.validationCode.includes("730") || this.validationCode.includes("729");
    }
  }

  encryptString(dcyStr: string): string {
    if (!dcyStr) {
      return '';
    }
    let enc = '';
    for (let i = 0; i < dcyStr.length; i++) {
      const charCode = dcyStr.charCodeAt(i);

      if (charCode >= 0 && charCode < 64) {
        enc += (charCode + 128).toString();
      } else if (charCode >= 64 && charCode < 128) {
        enc += (charCode + 128).toString();
      } else if (charCode >= 128 && charCode < 192) {
        enc += (charCode - 128).toString();
      } else if (charCode >= 192 && charCode < 256) {
        enc += (charCode - 128).toString();
      }
    }
    return enc;
  }


  togglePasswordVisibility1(): void {
    this.passwordFieldType1 =
      this.passwordFieldType1 === 'password' ? 'text' : 'password';
  }

  togglePasswordVisibility2(): void {
    this.passwordFieldType2 =
      this.passwordFieldType2 === 'password' ? 'text' : 'password';
  }

  /**
* @function to clear session and local storage for BSP data.
* @returns void.
*/
  clearBSPKeysFromStorage() {
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
  }
  /**
   * @function to hide and show password.
   * @return void.
   */
  togglePasswordVisibility(): void {
    this.passwordFieldType =
      this.passwordFieldType === 'password' ? 'text' : 'password';
  }
}
