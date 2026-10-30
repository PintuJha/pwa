import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { of, Subject, switchMap, takeUntil } from 'rxjs';
import { ConfirmComponent } from 'src/app/components/confirm/confirm.component';
import { ChangePasswordComponent } from 'src/app/core/change-password/change-password.component';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { CheckTokenExpiryService } from 'src/app/core/services/check-token-expiry.service';
import { CommonService } from 'src/app/core/services/common.service';
import { ConfigService } from 'src/app/core/services/config.service';
import { ForgetResetPwdService } from 'src/app/core/services/forget-reset-pwd.service';
import { LayoutService } from 'src/app/core/services/layout.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { CONSTANTS, LOCAL_SESSION_STORAGE, LOGIN_COMPONENT_DICTIONARIES, RESPONSE, ROLES, TOAST_TYPE } from 'src/app/shared/constants/constans';
import { ComboDTO } from 'src/app/shared/model/combo-detail-dto';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {

  showPasswordOnPress!: boolean;
  loginForm !: FormGroup;
  verifiedStatus: string = '';
  loginSubscription: Subject<any> = new Subject();
  parsedJson: any;
  captchaShowCount: number = 0;
  captchaConfigCount!: number;
  captchaValue!: string;
  showCaptcha!: boolean;
  showCaptchaAtVerifyUser!: boolean;
  currentLanguage: number = 0;
  languageList: ComboDTO[] = [];
  private intervalId: any;
  private countdownIntervalId: any;
  userId!: any;
  userDetails!: any;
  whiteLabelList: any;
  welMsg: string = " ";
  formObject: any;
  corporateUser: boolean = false;

  loginComponentLabelsAndMessages = {
    welcomeToBasePanel: 'Welcome to Base Panel',
    loginToYourAccount: 'Please log in to your account',
    admTitle: 'Component Assembly Framework (CAF)',
    email: 'Email',
    defaultLangugae: 'Default Language',
    verifyUser: 'Verify User',
    okta: 'Okta',
    clear: 'Clear',
    login: 'Login',
    passwordPlaceholder: 'Enter your Password',
    captchaPlaceholder: 'Enter the given code',
    emailIdPlaceholder: 'Enter your email ID',
    rightClickNotAllowedMsg: 'right-click not allowed',
    policyNotValidMsg: 'Policy is not valid',
    policyNotConfiguredMsg: 'Policy is not configured',
    changeTempPwdToNewMsg: 'Please change your temporary password to a new one for account security. Click on proceed to update your password.',
    wrongUsernamePwdMsg: 'You have entered wrong username or password',
    roleIsNotAssignedToUserMsg: 'Role is not assigned to user',
    userAccountLockedMsg: 'User account is locked. Contact your administrator.',
    loginAttemptLeftMsg: 'Login failed. You have &attemptsLeft attempt(s) left before your account is locked.',
    permissionDeniedContactAdminMsg: 'Permission denied Contact your administrator',
    wrongCaptchaEnteredMsg: 'Wrong Captcha Entered',
    enterCaptchaMsg: 'Please Enter Captcha',
    enterYourPwdMsg: 'Please Enter Your Password',
    invalidLoginCredentialsMsg: 'Invalid login credentials',
    userIsInactiveMsg: 'User is inactive',
    userAccountDeletedMsg: 'User account deleted',
    userDoesNotExistMsg: 'User does not exist',
    enterMail: 'Please Enter Email',
    enterTheGivenCodeBelow: 'Enter the given code below.',
    password: 'Password',
    forgetPwd: 'Forget Password',
    proceed: 'Proceed',
    cancel: 'Cancel',
    exceptionCaughtMsg: 'Exception caught',
    tempPwdReqAlreadyRaiseMsg: 'Request already raised, next request can be raised after  &timer min of previous request',
    tempPwdExpiryTimeMsg: 'Your password is valid and will expire on &formattedExpiryDate.',
    pwdExpiryAlertMsg: 'Your password will expire in &daysUntilExpiry days. Please update it before that to avoid losing access.',
    mailSentMsg: 'Mail Sent',
    errorOccuredInOpsMsg: 'Error occured in operation',
    pwdNeverExpiresMsg: 'Password never expires',
    pwdExpiryMsg: 'Your password has expired.Please update your password to continue accessing your account.',
    domainUserMsg: 'Domain user.',
    userAccountLockMsg: 'User account is locked',
    tokenGenerationErrorMsg: 'Token generation error.',
    pwdDecryptionErrorMsg: 'Password decryption error.',
    confirm: 'Confirm',
    inactiveUserMsg: 'User is inactive or deleted. Reset password request denied.',
  }

  faviconIconUrl: any;
  faviconIconValue: any;
  imageFormObject: any;
  fundflowUser: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private forgetResetPwdService: ForgetResetPwdService,
    private toast: ToastService,
    private commonService: CommonService,
    private checkTokenExpiryService: CheckTokenExpiryService,
    private configService: ConfigService,
    private layoutService: LayoutService,
    public dialog: MatDialog,
    private titleService: Title,
  ) {
    this.logging();
  }

  ngOnInit(): void {
    this.getLanguageList();
    this.configService.hitCaptcha.subscribe({
      next: (res) => {
        if (res) {
          this.getCaptcha();
        }
      }
    });
    this.commonService.getWhiteLabelDictionaryData(CONSTANTS.DEFAULT_LANG_ID, Number(CONSTANTS.APS_APP_ID)).subscribe({
      next: (res) => {
        if (res?.status === RESPONSE.SUCCESS && res?.data) {
          this.formObject = res.data;
          this.commonService.setConfigValue(this.formObject);
          this.welMsg = this.formObject.welcomeMessageValue;
          this.titleService.setTitle(this.formObject.appTitleValue);
        }
      },
      error: (err) => {
        this.toast.show(this.loginComponentLabelsAndMessages.exceptionCaughtMsg, TOAST_TYPE.ERROR);
        console.error('Error fetching config value:', err);
      }
    });
    this.createValidationForm();
  }

  /**
  * @function to navigate on dashboard if user is already logged in
  * @returns void
  */
  logging(): void {
    if (!this.authService.isLoggedIn()) return;
    else {
      this.router.navigate(['/dashboard'])
    }
  }


  // Get white label Images from database
  getImage(): void {
    this.commonService.getWhiteLabelDictionaryData(CONSTANTS.DEFAULT_LANG_ID, Number(CONSTANTS.APS_APP_ID)).subscribe({
      next: (res) => {
        if (res?.status === RESPONSE.SUCCESS && res.data) {
          this.imageFormObject = res.data;
          this.commonService.setImageValue(this.imageFormObject);
          this.faviconIconValue = this.imageFormObject.faviconIcon;
          if (this.imageFormObject?.faviconIconName) {
            const extension = res.data.faviconIconName.split('.').pop()?.toLowerCase();
            const fileTypes: { [key: string]: string } = {
              png: 'image/png',
              jpg: 'image/jpeg',
              jpeg: 'image/jpeg',
              ico: 'image/x-icon',
              svg: 'image/svg+xml'
            };

            const mimeType = fileTypes[extension || ''] || 'image/jpeg';

            this.faviconIconUrl = `data:${mimeType};base64,${this.faviconIconValue}`;
          }
        }
        const faviconBase64 = 'data:image/x-icon;base64,' + res.data.faviconIcon;
        this.setFavicon(faviconBase64);
      }
    });
  }

  setFavicon(iconUrl: string): void {
    let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = iconUrl;
  }

  /**
* @function to set selected language Id as a system language for multilingual functionality.
* @returns void.
*/
  onlanguageSelect(event: any) {
    let prefferedLanguage = this.loginForm.controls['prefferedLanguage'].value;
    sessionStorage.setItem(LOCAL_SESSION_STORAGE.POLICY_PREFFERED_LANG, prefferedLanguage);
    sessionStorage.setItem(LOCAL_SESSION_STORAGE.BASELANGID, prefferedLanguage);
    localStorage.setItem(LOCAL_SESSION_STORAGE.BASELANGID, prefferedLanguage);
    this.getDictionaryData();
  }

  /**
   * @function initilizating login form
   * @returns void
   */
  createValidationForm(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      captcha: [''],
      prefferedLanguage: ['', []]
    });
  }

  /**
 * @function to verify if user is domain user
 * @returns void
 */
  verifyUser(): void {
    if (!this.loginForm.controls['username'].value) {
      this.toast.show(this.loginComponentLabelsAndMessages.enterMail, TOAST_TYPE.INFO);
      return;
    };
    if (this.showCaptcha && (this.captchaConfigCount == 0) && this.showCaptchaAtVerifyUser) {
      const captchaValue = this.loginForm.controls['captcha'].value;
      if (!captchaValue) {
        this.toast.show(this.loginComponentLabelsAndMessages.enterCaptchaMsg, TOAST_TYPE.INFO);
        return;
      }
      else if (captchaValue !== this.captchaValue) {
        this.toast.show(this.loginComponentLabelsAndMessages.wrongCaptchaEnteredMsg, TOAST_TYPE.INFO);
        this.getCaptcha();
        return;
      }
    }

    const username = this.loginForm.get('username')?.value.trim();
    this.authService.verifyUser(username).subscribe({
      next: (res: any) => {
        this.userDetails = res;
        if (res.messageCode == 1065) {
          this.userDetails = res;
          this.loginForm.controls['username'].disable();
          this.verifiedStatus = res?.messageCode;
          sessionStorage.setItem(LOCAL_SESSION_STORAGE.BASELANGID, res?.data.baseLangId)
          localStorage.setItem(LOCAL_SESSION_STORAGE.BASELANGID, res?.data.baseLangId)
          this.userId = res.data.userId;
          if (this.showCaptchaAtVerifyUser) {
            this.showCaptcha = false;
            clearInterval(this.countdownIntervalId);
          }
        }
        else if (res.messageCode == '1061') {
          this.toast.show(this.loginComponentLabelsAndMessages.userDoesNotExistMsg, TOAST_TYPE.INFO);
        }
        else if (res.messageCode == '1063') {
          this.toast.show(this.loginComponentLabelsAndMessages.userIsInactiveMsg, TOAST_TYPE.INFO);
        }
      },
      error: (errorResponse: HttpErrorResponse) => {
        alert(this.loginComponentLabelsAndMessages.invalidLoginCredentialsMsg);
        this.getCaptcha();
      }
    })
  }



  /**
  * @function to submit login form.
  * @returns void
  */
  onSubmit(): void {
    if (this.loginForm.invalid && this.verifiedStatus == '1065') {
      this.toast.show(this.loginComponentLabelsAndMessages.enterYourPwdMsg, TOAST_TYPE.INFO);
      return;
    } else if (this.loginForm.invalid) {
      return;
    }
    if (this.showCaptcha && (this.captchaConfigCount != 0) && this.showCaptchaAtVerifyUser) {
      const captchaValue = this.loginForm.controls['captcha'].value;
      if (!captchaValue) {
        this.toast.show(this.loginComponentLabelsAndMessages.enterCaptchaMsg, TOAST_TYPE.INFO);
        return;
      }
      else if (captchaValue !== this.captchaValue) {
        this.toast.show(this.loginComponentLabelsAndMessages.wrongCaptchaEnteredMsg, TOAST_TYPE.INFO);
        this.getCaptcha();
        return;
      }
    }
    this.authService.login(
      this.loginForm.get('username')?.value.trim(), this.authService.encryptPassword(this.loginForm.get('password')?.value), this.userId
    ).pipe(takeUntil(this.loginSubscription))
      .subscribe({
        next: data => {
          if (data) {
            //  TO SHOW ALERT FOR PWD EXPIRY
            if (!data.data?.passwordExpiryAlert.pwdExpFlag && data.data?.passwordExpiryAlert.showAlert == true) {
              const message = data.passwordExpiryAlert.message;
              switch (true) {
                case /Your password has expired\. Please update your password to continue accessing your account\./.test(message):
                  this.toast.show(this.loginComponentLabelsAndMessages.pwdExpiryMsg, TOAST_TYPE.INFO);
                  break;

                case /Your password will expire in (\d+) days\. Please update it before that to avoid losing access\./.test(message): {
                  const match = message.match(/Your password will expire in (\d+) days/);
                  const formattedMessage = match
                    ? this.loginComponentLabelsAndMessages.pwdExpiryAlertMsg.replace('&daysUntilExpiry', match[1])
                    : message;
                  this.toast.show(formattedMessage, TOAST_TYPE.INFO);
                  break;
                }

                case /Your password is valid and will expire on (.+?)\./.test(message): {
                  const match = message.match(/Your password is valid and will expire on (.+?)\./);
                  const formattedMessage = match
                    ? this.loginComponentLabelsAndMessages.tempPwdExpiryTimeMsg.replace('&formattedExpiryDate', match[1])
                    : message;
                  this.toast.show(formattedMessage, TOAST_TYPE.INFO);
                  break;
                }

                case /Password never expires/.test(message):
                  this.toast.show(this.loginComponentLabelsAndMessages.pwdNeverExpiresMsg, TOAST_TYPE.INFO);
                  break;

                case /Error occurred in operation/.test(message):
                  this.toast.show(this.loginComponentLabelsAndMessages.errorOccuredInOpsMsg, TOAST_TYPE.INFO);
                  break;

                default:
                  this.toast.show(message, TOAST_TYPE.INFO);
              }
            }
            //  TO OPEN CHANGE PASSWORD  FOR PWD EXPIRED
            if (data.data?.passwordExpiryAlert.pwdExpFlag && (data?.messageCode == '1510')) {
              localStorage.setItem(LOCAL_SESSION_STORAGE.TEMP_PWD_GENERATED, "1")
              const dialogRef = this.dialog.open(ConfirmComponent, {
                disableClose: true,
                data: {
                  message: this.loginComponentLabelsAndMessages.pwdExpiryMsg,
                  confirm: this.loginComponentLabelsAndMessages.confirm,
                  buttonText: {
                    ok: this.loginComponentLabelsAndMessages.proceed,
                    cancel: this.loginComponentLabelsAndMessages.cancel
                  }
                }
              });
              dialogRef.afterClosed().subscribe((confirmed: boolean) => {
                if (confirmed) {
                  const dialogRef2 = this.dialog.open(ChangePasswordComponent, {
                    width: '40%',
                    disableClose: true,
                    panelClass: 'changepassword',
                    data: { userEmail: this.loginForm.get('username')?.value.trim() }
                  });
                  dialogRef2.afterClosed().subscribe((result: boolean) => {
                    this.clear();
                  }
                  );
                } else {
                  this.checkTokenExpiryService.logout();
                  this.clear();
                }
              })
              return;
            }
            else if (data.messageCode == '1062') {
              this.toast.show(this.loginComponentLabelsAndMessages.userAccountLockedMsg, TOAST_TYPE.INFO);
              return;
            }
            else if (data?.messageCode != '1510' || !data.data?.userDetails?.hasAccess) {
              const maxLoginAttempts = parseInt(data.data?.userDetails?.maxLoginFailAttemptsValue, 10); // Assuming this value is provided in the response
              const loginFailureCount = parseInt(data.data?.userDetails?.loginFailureCount, 10); // Assuming this value is provided in the response
              const attemptsLeft = (maxLoginAttempts) - loginFailureCount;
              if (!data.data?.userDetails?.hasAccess && attemptsLeft > 0 && data?.messageCode != "1061") {
                this.toast.show(this.loginComponentLabelsAndMessages.permissionDeniedContactAdminMsg, TOAST_TYPE.INFO);
              } else if (attemptsLeft > 0) {
                const defaultMessage = `Login failed. You have ${attemptsLeft} attempt(s) left before your account is locked.`;
                let message = this.loginComponentLabelsAndMessages.loginAttemptLeftMsg
                  ? this.loginComponentLabelsAndMessages.loginAttemptLeftMsg.replace('&attemptsLeft', `${attemptsLeft}`)
                  : defaultMessage;
                this.toast.show(message, TOAST_TYPE.INFO);
                if (this.showCaptchaAtVerifyUser) {
                  this.captchaShowCount += 1;
                  if (this.captchaShowCount >= this.captchaConfigCount) {
                    this.getCaptcha();
                    this.showCaptcha = true;
                  }
                }
              } else {
                this.toast.show(this.loginComponentLabelsAndMessages.userAccountLockedMsg, TOAST_TYPE.INFO);
              }
              return;
            }
            localStorage.setItem(LOCAL_SESSION_STORAGE.IS_SUPER_ADMIN, data.data?.userDetails?.superAdmin ? "ENABLED" : "DISABLED");
            localStorage.setItem(LOCAL_SESSION_STORAGE.SWITCH_TO_ADMIN, (data.data?.userDetails?.switchToAdmin) ? "ENABLED" : "DISABLED");
            if (data.data?.userDetails?.selectedAppId != null) {
              localStorage.setItem(LOCAL_SESSION_STORAGE.SELECTED_APP_ID, data.data?.userDetails?.selectedAppId)
            } else {
              this.toast.show(this.loginComponentLabelsAndMessages.roleIsNotAssignedToUserMsg, TOAST_TYPE.INFO);
              this.verifiedStatus = '';
              this.loginForm.controls['username'].enable();
              this.loginForm.reset();
              this.clearBSPKeysFromStorage();
              this.configService.loadAppConfig();
              return;
            }
            if (data.messageCode == '1085') {
              this.toast.show(this.loginComponentLabelsAndMessages.wrongUsernamePwdMsg, TOAST_TYPE.INFO);
              if (!this.showCaptchaAtVerifyUser) {
                this.captchaShowCount += 1;
                if (this.captchaShowCount >= this.captchaConfigCount) {
                  this.getCaptcha();
                  this.showCaptcha = true;
                }
              }
              return;
            }
            if (data.data?.userDetails?.policyDetails?.isTempPwdGenerated == "1") {
              localStorage.setItem(LOCAL_SESSION_STORAGE.TEMP_PWD_GENERATED, "1")
              const dialogRef = this.dialog.open(ConfirmComponent, {
                disableClose: true,
                data: {
                  message: this.loginComponentLabelsAndMessages.changeTempPwdToNewMsg,
                  confirm: this.loginComponentLabelsAndMessages.confirm,
                  buttonText: {
                    ok: this.loginComponentLabelsAndMessages.proceed,
                    cancel: this.loginComponentLabelsAndMessages.cancel
                  }
                }
              });
              dialogRef.afterClosed().subscribe((confirmed: boolean) => {
                if (confirmed) {
                  const dialogRef2 = this.dialog.open(ChangePasswordComponent, {
                    width: '40%',
                    disableClose: true,
                    panelClass: 'changepassword',
                    data: { userEmail: this.loginForm.get('username')?.value.trim(), tempPWD: data.data?.userDetails?.policyDetails.isTempPwdGenerated.toString() }
                  });
                  dialogRef2.afterClosed().subscribe((result: boolean) => {
                    this.clear();
                  }
                  );
                } else {
                  this.checkTokenExpiryService.logout();
                  this.clear();
                }
              })
              return;
            }
            else if (data.data?.userDetails?.policyDetails.newUserPolicy == "0" || data.data?.userDetails?.policyDetails.isPolicyAcceptednew == "0" || data.data?.userDetails?.policyDetails.isPolicyValue == "0") {
              this.router.navigate(['/policy']);
            } else if (data.data?.userDetails?.policyDetails.policyNotConfigured == "true") {
              this.toast.show(this.loginComponentLabelsAndMessages.policyNotConfiguredMsg, TOAST_TYPE.INFO);
              this.clear();
              return;
            }
            else if (data.data?.userDetails?.policyDetails?.policyDictionaryNotValid == "true") {
              this.toast.show(this.loginComponentLabelsAndMessages.policyNotValidMsg, TOAST_TYPE.INFO);
              this.clear();
              return;
            } else if (data.messageCode == '1510') {
              this.authService.setConfigValue(JSON.parse(JSON.stringify(data)).Default_Landing_Page);
              localStorage.removeItem(LOCAL_SESSION_STORAGE.TEMP_PWD_GENERATED)
              this.layoutService.layoutInitialRender.next(true);
              this.getRole();
              if (this.corporateUser) {
                this.router.navigate(['/dashboard'])
              } else if (this.fundflowUser) {
                this.router.navigate(['/monthly-upload-view'])
              } else {
                this.router.navigate(['/dashboard'])
              }
              let token = localStorage.getItem(LOCAL_SESSION_STORAGE.TOKEN);
              this.checkTokenExpiryService.isUserLoggedIn$.next(true);
              this.checkTokenExpiryService.startSession(token!);
              this.captchaConfigCount = 0;
            }
          }
        },
        error: (errorResponse: HttpErrorResponse) => {
        }
      })
  }


  /**
   * @function clears login form field and navigates user back to enter login id screen
   * @returns void
   */
  clear(): void {
    if (this.showCaptchaAtVerifyUser) {
      this.verifiedStatus = '';
      this.loginForm.controls['username'].enable();
      this.loginForm.reset();
      this.showCaptcha = true;
      this.captchaShowCount = 0;
      this.getCaptcha();
      this.clearBSPKeysFromStorage();
      this.configService.loadAppConfig();
      this.getLanguageList();
    }
    if (!this.showCaptchaAtVerifyUser) {
      this.verifiedStatus = '';
      this.loginForm.controls['username'].enable();
      this.loginForm.reset();
      this.showCaptcha = false;
      this.captchaShowCount = 0;
      this.clearBSPKeysFromStorage();
      this.configService.loadAppConfig();
      this.getLanguageList();
    }

  }

  /**
   * @function to get captcha value.
   * @returns void.
   */
  getCaptcha(): void {
    this.captchaValue = '';
    this.authService.getCaptcha().subscribe({
      next: (res) => {
        const captcha = JSON.parse(JSON.stringify(res)).Captcha;
        const isPassPolicyAccepted = res.enablecaptcha;
        this.loginForm.controls['captcha'].patchValue('');
        this.captchaValue = captcha;
        if (isPassPolicyAccepted == 0) {
          this.showCaptchaAtVerifyUser = false;
        } else if (isPassPolicyAccepted == 0 && res.maxBadLoginAttempts == 0) {
          this.showCaptchaAtVerifyUser = false;
        } else if (isPassPolicyAccepted == 1) {
          this.showCaptchaAtVerifyUser = true;
          if (isPassPolicyAccepted == 1 && this.captchaShowCount >= res.maxBadLoginAttempts) {
            this.showCaptcha = true;
          } else {
            this.showCaptcha = false;
          }
          this.captchaConfigCount = res.maxBadLoginAttempts;
        }
      }
    })
  }

  /**
  * @function for reset the password navigates user back to enter login id screen
  * @returns void
  */
  forgetResetPWD() {
    this.userId = this.userDetails.data.userId;
    let payload = {
      email: this.loginForm.get('username')?.value.trim(),
      userId: this.userId,
    };
    this.forgetResetPwdService.sendResetPwdUrl(payload).subscribe({
      next: (data) => {
        this.parsedJson = data;
        if (data.responseCode != 200) {
          if (data.message == "Permission Denied") {
            this.toast.show(this.loginComponentLabelsAndMessages.permissionDeniedContactAdminMsg, TOAST_TYPE.INFO);
          }
        }
        switch (data.messageCode) {
          case 200:
            this.toast.show(this.loginComponentLabelsAndMessages.mailSentMsg, TOAST_TYPE.SUCCESS);
            break;
          case 1476:
            const match = data.message.match(/Password reset email already sent. Please retry after (\d+) minutes./);
            const message = match
              ? this.loginComponentLabelsAndMessages.tempPwdReqAlreadyRaiseMsg.replace('&timer', match[1])
              : data.message;
            this.toast.show(message, TOAST_TYPE.SUCCESS);
            break;
          case 1063:
            this.toast.show(this.loginComponentLabelsAndMessages.inactiveUserMsg, TOAST_TYPE.INFO);
            break;
          case 1211:
            this.toast.show(this.loginComponentLabelsAndMessages.exceptionCaughtMsg, TOAST_TYPE.SUCCESS);
            break;
          default:
            this.toast.show(data.message, TOAST_TYPE.SUCCESS);
        }
      }
    }
    );
  }

  getLanguageList() {
    const config$ = sessionStorage.getItem(LOCAL_SESSION_STORAGE.API_URL) == null
      ? this.configService.loadAppConfig()
      : of(void 0);

    config$.pipe(
      switchMap(() => this.commonService.getLanguageCombo())
    ).subscribe({
      next: (response) => {
        this.languageList = JSON.parse(JSON.stringify(response)).data;
        if (!this.currentLanguage) {
          const baseLang = this.languageList.find(lang => lang.baseLanguage === 1);
          this.currentLanguage = baseLang?.id ?? 1;
        }

        this.loginForm.controls['prefferedLanguage'].patchValue(this.currentLanguage);
        sessionStorage.setItem(LOCAL_SESSION_STORAGE.POLICY_PREFFERED_LANG, JSON.stringify(this.currentLanguage));
        this.getDictionaryData();
      }
    });
  }

  /**
 * @function to call okta login.
 * @returns to okta page.
 */
  oktaLogin() {
    this.authService.loginImplicit();
  }

  /**
* @function for restrict right click on login page.
* @returns void
*/
  onContextMenu(event: MouseEvent) {
    event.preventDefault();
    this.toast.show(this.loginComponentLabelsAndMessages.rightClickNotAllowedMsg, TOAST_TYPE.INFO);
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
* @function to get dictionary data for multilingual functionality.
* @returns void.
*/
  getDictionaryData() {
    let langId = this.loginForm.controls['prefferedLanguage'].value;
    const appId = CONSTANTS.ADM_PANEL_APP_ID;
    let params = {
      'languageId': langId,
      'appId': appId,
      'dictionaryCodes': LOGIN_COMPONENT_DICTIONARIES
    }
    this.commonService.getDictionaryByLangPanelDictIds(params).subscribe({
      next: (resp) => {
        if (resp.status === 'success') {
          this.loginComponentLabelsAndMessages.welcomeToBasePanel = resp?.data?.find((data: any) => data.dictionaryCode == 1337)?.value;
          this.loginComponentLabelsAndMessages.loginToYourAccount = resp?.data?.find((data: any) => data.dictionaryCode == 1303)?.value;
          this.loginComponentLabelsAndMessages.admTitle = resp?.data?.find((data: any) => data.dictionaryCode == 1302)?.value;
          this.loginComponentLabelsAndMessages.email = resp?.data?.find((data: any) => data.dictionaryCode == 1304)?.value;
          this.loginComponentLabelsAndMessages.defaultLangugae = resp?.data?.find((data: any) => data.dictionaryCode == 1305)?.value;
          this.loginComponentLabelsAndMessages.verifyUser = resp?.data?.find((data: any) => data.dictionaryCode == 1306)?.value;
          this.loginComponentLabelsAndMessages.okta = resp?.data?.find((data: any) => data.dictionaryCode == 1307)?.value;
          this.loginComponentLabelsAndMessages.clear = resp?.data?.find((data: any) => data.dictionaryCode == 42)?.value;
          this.loginComponentLabelsAndMessages.login = resp?.data?.find((data: any) => data.dictionaryCode == 503)?.value;
          this.loginComponentLabelsAndMessages.passwordPlaceholder = resp?.data?.find((data: any) => data.dictionaryCode == 1310)?.value;
          this.loginComponentLabelsAndMessages.captchaPlaceholder = resp?.data?.find((data: any) => data.dictionaryCode == 1309)?.value;
          this.loginComponentLabelsAndMessages.emailIdPlaceholder = resp?.data?.find((data: any) => data.dictionaryCode == 1308)?.value;
          this.loginComponentLabelsAndMessages.rightClickNotAllowedMsg = resp?.data?.find((data: any) => data.dictionaryCode == 1326)?.value;
          this.loginComponentLabelsAndMessages.policyNotValidMsg = resp?.data?.find((data: any) => data.dictionaryCode == 1325)?.value;
          this.loginComponentLabelsAndMessages.policyNotConfiguredMsg = resp?.data?.find((data: any) => data.dictionaryCode == 1294)?.value;
          this.loginComponentLabelsAndMessages.changeTempPwdToNewMsg = resp?.data?.find((data: any) => data.dictionaryCode == 1324)?.value;
          this.loginComponentLabelsAndMessages.wrongUsernamePwdMsg = resp?.data?.find((data: any) => data.dictionaryCode == 1323)?.value;
          this.loginComponentLabelsAndMessages.roleIsNotAssignedToUserMsg = resp?.data?.find((data: any) => data.dictionaryCode == 1322)?.value;
          this.loginComponentLabelsAndMessages.userAccountLockedMsg = resp?.data?.find((data: any) => data.dictionaryCode == 1321)?.value;
          this.loginComponentLabelsAndMessages.loginAttemptLeftMsg = resp?.data?.find((data: any) => data.dictionaryCode == 1320)?.value;
          this.loginComponentLabelsAndMessages.permissionDeniedContactAdminMsg = resp?.data?.find((data: any) => data.dictionaryCode == 1319)?.value;
          this.loginComponentLabelsAndMessages.wrongCaptchaEnteredMsg = resp?.data?.find((data: any) => data.dictionaryCode == 1318)?.value;
          this.loginComponentLabelsAndMessages.enterCaptchaMsg = resp?.data?.find((data: any) => data.dictionaryCode == 1317)?.value;
          this.loginComponentLabelsAndMessages.enterYourPwdMsg = resp?.data?.find((data: any) => data.dictionaryCode == 1316)?.value;
          this.loginComponentLabelsAndMessages.invalidLoginCredentialsMsg = resp?.data?.find((data: any) => data.dictionaryCode == 1315)?.value;
          this.loginComponentLabelsAndMessages.userIsInactiveMsg = resp?.data?.find((data: any) => data.dictionaryCode == 1063)?.value;
          this.loginComponentLabelsAndMessages.userAccountDeletedMsg = resp?.data?.find((data: any) => data.dictionaryCode == 1314)?.value;
          this.loginComponentLabelsAndMessages.userDoesNotExistMsg = resp?.data?.find((data: any) => data.dictionaryCode == 1061)?.value;
          this.loginComponentLabelsAndMessages.enterMail = resp?.data?.find((data: any) => data.dictionaryCode == 471)?.value;
          this.loginComponentLabelsAndMessages.enterTheGivenCodeBelow = resp?.data?.find((data: any) => data.dictionaryCode == 1313)?.value;
          this.loginComponentLabelsAndMessages.password = resp?.data?.find((data: any) => data.dictionaryCode == 1312)?.value;
          this.loginComponentLabelsAndMessages.forgetPwd = resp?.data?.find((data: any) => data.dictionaryCode == 1311)?.value;
          this.loginComponentLabelsAndMessages.proceed = resp?.data?.find((data: any) => data.dictionaryCode == 133)?.value;
          this.loginComponentLabelsAndMessages.cancel = resp?.data?.find((data: any) => data.dictionaryCode == 132)?.value;
          this.loginComponentLabelsAndMessages.exceptionCaughtMsg = resp?.data?.find((data: any) => data.dictionaryCode == 1327)?.value;
          this.loginComponentLabelsAndMessages.tempPwdReqAlreadyRaiseMsg = resp?.data?.find((data: any) => data.dictionaryCode == 1328)?.value;
          this.loginComponentLabelsAndMessages.tempPwdExpiryTimeMsg = resp?.data?.find((data: any) => data.dictionaryCode == 1329)?.value;
          this.loginComponentLabelsAndMessages.pwdExpiryAlertMsg = resp?.data?.find((data: any) => data.dictionaryCode == 1330)?.value;
          this.loginComponentLabelsAndMessages.mailSentMsg = resp?.data?.find((data: any) => data.dictionaryCode == 1089)?.value;
          this.loginComponentLabelsAndMessages.errorOccuredInOpsMsg = resp?.data?.find((data: any) => data.dictionaryCode == 847)?.value;
          this.loginComponentLabelsAndMessages.pwdNeverExpiresMsg = resp?.data?.find((data: any) => data.dictionaryCode == 305)?.value;
          this.loginComponentLabelsAndMessages.pwdExpiryMsg = resp?.data?.find((data: any) => data.dictionaryCode == 1331)?.value;
          this.loginComponentLabelsAndMessages.domainUserMsg = resp?.data?.find((data: any) => data.dictionaryCode == 1064)?.value;
          this.loginComponentLabelsAndMessages.userAccountLockMsg = resp?.data?.find((data: any) => data.dictionaryCode == 1062)?.value;
          this.loginComponentLabelsAndMessages.pwdDecryptionErrorMsg = resp?.data?.find((data: any) => data.dictionaryCode == 1333)?.value;
          this.loginComponentLabelsAndMessages.tokenGenerationErrorMsg = resp?.data?.find((data: any) => data.dictionaryCode == 1332)?.value;
          this.loginComponentLabelsAndMessages.confirm = resp?.data?.find((data: any) => data.dictionaryCode == 173)?.value;
          this.loginComponentLabelsAndMessages.inactiveUserMsg = resp?.data?.find((data: any) => data.dictionaryCode == 1344)?.value;
        }
      }
    })
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (this.countdownIntervalId) {
      clearInterval(this.countdownIntervalId);
    }
    this.loginSubscription.unsubscribe();
  }

  getRole() {
    const userdataString = localStorage.getItem(LOCAL_SESSION_STORAGE.USER_DATA);
    if (userdataString) {
      const userdata = JSON.parse(userdataString);
      const assignedRoles = userdata.userDetails.assignedUserRoles || [];
      const corporateTeam = assignedRoles.some((role: any) =>
        role.roleName.includes(ROLES.CORPORATE_TEAM)
      );
      const fundflowTeam = assignedRoles.some((role: any) =>
        role.roleName.includes(ROLES.FUNDFLOW_USER)
      );
      if (corporateTeam) {
        this.corporateUser = true;
      } else if (fundflowTeam) {
        this.fundflowUser = true;
        this.corporateUser = false;
      } else {
        this.corporateUser = false;
      }
    } else {
      console.error("Role data not found in localStorage.");
    }
  }
}
