import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToastService } from '../services/toast.service';
import { CHANGE_PASSWORD, LOCAL_SESSION_STORAGE, TOAST_TYPE } from 'src/app/shared/constants/constans';
import { ChangePasswordService } from '../services/change-password.service';
import { Router } from '@angular/router';
import { NotifyService } from '../services/notify.service';
import { CommonService } from '../services/common.service';
import { DictionaryValidatorPipe } from 'src/app/shared/pipes/dictionary-validator.pipe';
import { ChangePasswordDTO } from 'src/app/shared/model/change-password-Dto';
import { GET_DICTIONARY_PAYLOAD } from 'src/app/shared/model/shared.model';
import { ConfigService } from '../services/config.service';
import { Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { MaterialExampleModule } from 'src/app/shared/angular-material/MaterialExampleModule';
import { SharedModule } from "../../shared/shared.module";
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MaterialExampleModule, SharedModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})

export class ChangePasswordComponent implements OnInit, OnDestroy {
  changePasswordDTO: ChangePasswordDTO = new ChangePasswordDTO();
  validationError: boolean = true;
  validationError1: boolean = true;
  validationError2: boolean = true;
  validationError3: boolean = true;
  validationError4: boolean = true;
  validationError5: boolean = true;
  validationError6: boolean = true;
  validationontime: boolean = false;
  encryptedString: string = '';
  decryptedString: string = '';
  validationCode: any;
  changePasswordForm!: FormGroup;
  newPassword!: string;
  oldPassword!: string;
  confirmPassword!: string;
  updatePassword!: string;
  userData: any;
  TempPWD: any;
  userEmail: any;
  rangevalue: any;
  passwordFieldType: string = 'password';
  passwordFieldType1: string = 'password';
  passwordFieldType2: string = 'password';
  logoutTimout!: any;
  preferredLang: any;
  langId!: any;
  changepasswordLabels: any = {
    usernotfound: '',
    oldpasswordisincorrect: '',
    temppasswordisincorrect: '',
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
    changeTempPassword: '',
    passwordPolicyFeatures: '',
  }
  translatePipe!: DictionaryValidatorPipe;
  private destroy$ = new Subject<void>();

  constructor(private toast: ToastService,
    private changePasswordService: ChangePasswordService,
    public dialog: MatDialog, private router: Router,
    private authService: AuthenticationService,
    private configService: ConfigService,
    private notifyService: NotifyService,
    private commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) { }

  ngOnInit(): void {
    this.preferredLang = (localStorage.getItem(LOCAL_SESSION_STORAGE.BASELANGID));
    this.langId = this.preferredLang;
    this.getPasswordPolicyList();
    Promise.resolve().then(() => { this.getDictionaryData(); });
    this.createChangePasswordForm();
    this.userData = JSON.parse(localStorage.getItem(LOCAL_SESSION_STORAGE.USER_DATA)!);
    this.notifyService.isLanguageChanged.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        if (res) {
          this.langId = this.preferredLang;
          this.getDictionaryData()
          this.notifyService.isLanguageChanged.next(false)
        }
      }
    });
    this.TempPWD = this.data.tempPWD;
  }
  //Get Dictionary Data Payload.
  dictionaryData: GET_DICTIONARY_PAYLOAD = {
    languageId: 0,
    dictionaryCodes: [],
    appId: ""
  };
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

  /**
 * @function to hide and show password.
 * @return void.
 */
  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  togglePasswordVisibility1(): void {
    this.passwordFieldType1 = this.passwordFieldType1 === 'password' ? 'text' : 'password';
  }

  togglePasswordVisibility2(): void {
    this.passwordFieldType2 = this.passwordFieldType2 === 'password' ? 'text' : 'password';
  }

  /**
   * @function to fetch dictionary data for user preffered language
   */
  getDictionaryData(): void {
    this.dictionaryData.languageId = this.langId;
    this.dictionaryData.appId = '104';
    this.dictionaryData.dictionaryCodes = CHANGE_PASSWORD;

    this.commonService.getDictionaryByLangPanelDictIds(this.dictionaryData).subscribe({
      next: (resp) => {
        this.changepasswordLabels.passwordencryption = resp?.data?.find((data: any) => data?.dictionaryCode == 297)?.value;
        this.changepasswordLabels.passwordminimumLength = resp?.data?.find((data: any) => data?.dictionaryCode == 298)?.value;
        this.changepasswordLabels.password = resp?.data?.find((data: any) => data?.dictionaryCode == 652)?.value;
        this.changepasswordLabels.usernotfound = resp?.data?.find((data: any) => data?.dictionaryCode == 685)?.value;
        this.changepasswordLabels.oldpasswordisincorrect = resp?.data?.find((data: any) => data?.dictionaryCode == 686)?.value;
        this.changepasswordLabels.temppasswordisincorrect = resp?.data?.find((data: any) => data?.dictionaryCode == 1092)?.value;
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
        this.changepasswordLabels.changeTempPassword = resp?.data?.find(
          (data: any) => data?.dictionaryCode == 915
        )?.value;
        this.changepasswordLabels.passwordPolicyFeatures = resp?.data?.find(
          (data: any) => data?.dictionaryCode == 1261
        )?.value;
      }
    });
  }
  /**
   * @function to create change password form.
   * @returns void.
   */
  createChangePasswordForm(): void {
    this.changePasswordForm = new FormGroup({
      oldPassword: new FormControl(''),
      newPassword: new FormControl(''),
      confirmPassword: new FormControl('')
    });
  }

  /**
   * @function to save form data.
   * @returns void.
   */
  onSave(): void {
    this.validationontime = false;
    let email: string;
    let userId: number;
    if (this.userData && this.userData.email) {
      email = this.userData.email;
      userId = this.userData.userId;
    } else if (this.data && this.data.userEmail) {
      email = this.data.userEmail;
      userId = this.data.userId;
    } else {
      email = ''; // Default or fallback value if both are unavailable
      userId = 0;
    }
    this.userEmail = email;
    this.newPassword = this.changePasswordForm.controls['newPassword'].value;
    this.oldPassword = this.changePasswordForm.controls['oldPassword'].value;
    this.confirmPassword = this.changePasswordForm.controls['confirmPassword'].value;

    // Check if any of the fields are empty.
    if (!this.newPassword?.trim() || !this.oldPassword?.trim() || !this.confirmPassword?.trim()) {
      this.toast.show(this.changepasswordLabels.mandatory, TOAST_TYPE.INFO);
      return;
    }

    // If the new password doesn't match the confirm password, show an error.
    if (this.newPassword !== this.confirmPassword) {
      this.toast.show(this.changepasswordLabels.newoldpassword, TOAST_TYPE.INFO);
      return;
    } else if (this.newPassword === this.confirmPassword) {
      this.updatePassword = this.newPassword;
      this.oldPassword = this.changePasswordForm.controls['oldPassword'].value;
    }

    // Encrypt both the old password and new password.
    this.oldPassword = this.authService.encryptPassword(this.oldPassword);
    this.updatePassword = this.authService.encryptPassword(this.updatePassword);
    this.confirmPassword = this.authService.encryptPassword(this.confirmPassword);

    const payload = {
      id: userId,
      username: this.userEmail,
      oldPassword: this.oldPassword,
      updatePassword: this.updatePassword,
      confirmPassword: this.confirmPassword
    };

    // Calls the service to update the password.
    this.changePasswordService.onSavePassword(payload).subscribe({
      next: (res) => {
        this.validationCode = Array.isArray(res.messageCode) ? res.messageCode : [];
        const message = res.messageCode;

        if (res.messageCode == '685') {
          this.toast.show(this.changepasswordLabels.usernotfound, TOAST_TYPE.INFO);
          return;
        } else if (res.messageCode == '686') {
          if (Number(this.TempPWD) == 1) {
            this.toast.show(this.changepasswordLabels.temppasswordisincorrect, TOAST_TYPE.INFO);
          } else {
            this.toast.show(this.changepasswordLabels.oldpasswordisincorrect, TOAST_TYPE.INFO);
          }
          return;
        } else if (res.messageCode == '687') {
          this.toast.show(this.changepasswordLabels.passwordchange, TOAST_TYPE.SUCCESS);
          this.dialog.closeAll();
          this.logOut();
        } else {
          this.validationontime = true;
          this.validation();
        }
      },
    });
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
 * @function to logout from dashboard
 * @returns land the user to login page
 */
  logOut() {
    this.clearBSPKeysFromStorage();
    this.configService.loadAppConfig();
    this.router.navigate(['/login']);
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

  decryptString(encStr: string): string {
    if (!encStr) {
      return '';
    }

    let dcy = '';

    for (let i = 0; i < encStr.length; i += 3) {
      const temp = parseInt(encStr.substring(i, i + 3), 10);
      let charCode;

      if (temp >= 0 && temp < 64) {
        charCode = temp + 128;
      } else if (temp >= 64 && temp < 128) {
        charCode = temp + 128;
      } else if (temp >= 128 && temp < 192) {
        charCode = temp - 128;
      } else if (temp >= 192 && temp < 256) {
        charCode = temp - 128;
      } else {
        throw new Error('Invalid character code in encrypted string');
      }

      dcy += String.fromCharCode(charCode);
    }

    return dcy;
  }

  // Example usage
  onEncrypt() {
    this.oldPassword = this.encryptString(this.oldPassword);
    this.updatePassword = this.encryptString(this.updatePassword);
  }

  closeDialog(): void {
    if (this.changePasswordForm.controls['oldPassword'].value != '') {
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    // clearTimeout(this.logoutTimout);
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

}
