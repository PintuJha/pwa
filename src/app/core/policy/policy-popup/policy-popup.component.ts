import { Component, HostListener, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { CONSTANTS, LOCAL_SESSION_STORAGE, POLICY, TOAST_TYPE } from 'src/app/shared/constants/constans';
import { PolicyService } from '../../services/policy.service';
import { ToastService } from '../../services/toast.service';
import { ConfigService } from '../../services/config.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { NotifyService } from '../../services/notify.service';
import { Subject, takeUntil } from 'rxjs';
import { GET_DICTIONARY_PAYLOAD } from 'src/app/shared/model/shared.model';
import { CommonService } from '../../services/common.service';
import { CommonModule } from '@angular/common';
import { MaterialExampleModule } from 'src/app/shared/angular-material/MaterialExampleModule';

@Component({
  selector: 'app-policy-popup',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MaterialExampleModule],
  templateUrl: './policy-popup.component.html',
  styleUrl: './policy-popup.component.scss'
})
export class PolicyPopupComponent {

  accepted: boolean = false;
  parsedJson: any;
  userDetails!: any;
  fullName!: any;
  email!: any;
  isPolicyAccepted: any;
  userId: any;
  appId: any;
  policyDictonaryCode: any;
  policyAcceptanceTime: any;
  policyContent: any;
  isPolicyValue: any;
  policyContentID: any;
  isPolicyUpdated: any;
  langId!: any;
  preferredLang: any;
  private destroy$ = new Subject<void>();
  constructor(private router: Router, private policyService: PolicyService, private toast: ToastService, private configService: ConfigService, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<PolicyPopupComponent>, private notifyService: NotifyService, private commonService: CommonService) {
    this.appId = data.appId;
  }

  ngOnInit(): void {
    this.userDetails = (sessionStorage.getItem(LOCAL_SESSION_STORAGE.USER_DATA));
    if (this.userDetails != null) {
      this.fullName = JSON.parse(this.userDetails).fullName;
      this.email = JSON.parse(this.userDetails).email;
      this.userId = JSON.parse(this.userDetails).userId;
      this.preferredLang = (sessionStorage.getItem(LOCAL_SESSION_STORAGE.BASELANGID));
      this.langId = JSON.parse(this.preferredLang);
      this.notifyService.isLanguageChanged.pipe(takeUntil(this.destroy$)).subscribe({
        next: (res) => {
          if (res) {
            this.getDictionaryData()
            this.notifyService.isLanguageChanged.next(false)
          }
        }
      });
      this.getDictionaryData()
      this.getPolicyDetails();
    } else {
      this.clearBSPKeysFromStorage();
      this.router.navigate(['/login']);
    }
  }

  /**
* @function to get policy details
* @returns policy details data.
*/
  getPolicyDetails() {
    let appId = this.appId;
    let params = { userEmail: this.email, userId: this.userId, appId: appId, langId: this.langId };
    this.policyService.getPolicyDetails(params).subscribe({
      next: (data) => {
        this.parsedJson = data;
        if (this.parsedJson.value != "") {
          this.policyContent = this.parsedJson.value;
          this.policyContentID = this.parsedJson.dictionaryCode;
          this.policyContent = this.policyContent.replace(/"/g, '');
        } else {
          this.toast.show(this.layoutLabels?.policyNotConfiguredMsg || CONSTANTS.CONFIGURETHEPOLICY, TOAST_TYPE.INFO);
        }
      }
    });
  }
  //Get Dictionary Data Payload.
  dictionaryData: GET_DICTIONARY_PAYLOAD = {
    languageId: 0,
    dictionaryCodes: [],
    appId: "0"
  };

  //Dictionary values.
  layoutLabels = {
    policy_acceptance: '',
    accept_policy: '',
    term_conditions: '',
    accept: '',
    policyNotConfiguredMsg: '',
    acceptThePolicyMsg: ''
    // noUnitsAssigned: ''
  }
  getDictionaryData(): void {
    const userData = JSON.parse(sessionStorage.getItem(LOCAL_SESSION_STORAGE.USER_DATA) || '{}');
    const baseLangId = userData?.baseLangId || 1;
    this.dictionaryData.languageId = baseLangId;
    this.dictionaryData.appId = '104';
    this.dictionaryData.dictionaryCodes = POLICY;

    this.commonService.getDictionaryByLangPanelDictIds(this.dictionaryData).subscribe({
      next: (res) => {
        this.layoutLabels.policy_acceptance = res?.data?.find((data: any) => data.dictionaryCode == 1240)?.value;
        this.layoutLabels.accept_policy = res?.data?.find((data: any) => data.dictionaryCode == 1241)?.value;
        this.layoutLabels.term_conditions = res?.data?.find((data: any) => data.dictionaryCode == 1242)?.value;
        this.layoutLabels.accept = res?.data?.find((data: any) => data.dictionaryCode == 1283)?.value;
        this.layoutLabels.policyNotConfiguredMsg = res?.data?.find((data: any) => data.dictionaryCode == 1294)?.value;
        this.layoutLabels.acceptThePolicyMsg = res?.data?.find((data: any) => data.dictionaryCode == 1295)?.value;
      }
    });
  }
  /**
* @function to store the value if checkbox is checked
*/
  onCheckboxChange(event: any) {
    const checked = event.target.checked;
    if (checked) {
      this.accepted = true;
    } else {
      this.accepted = false;
    }
  }

  /**
* @function to call updatePolicyAcceptanceFlag method if checkbox is checked
*/
  onAccept() {
    if (this.accepted) {
      this.updatePolicyAcceptanceFlag();
    } else {
      this.toast.show(this.layoutLabels?.acceptThePolicyMsg || CONSTANTS.POLICY, TOAST_TYPE.INFO);
    }
  }


  /**
 * @function to update Policy Acceptance details
 * @returns whether update operation executed successful or not.
 */
  updatePolicyAcceptanceFlag() {

    if (this.policyContentID == undefined || this.policyContentID == null) {
      this.toast.show(this.layoutLabels?.policyNotConfiguredMsg || CONSTANTS.CONFIGURETHEPOLICY, TOAST_TYPE.INFO);
      return;
      // this.policyDictonaryCode = 1;
    } else {
      this.policyDictonaryCode = this.policyContentID;
    }
    let params = {
      userId: this.userId,
      isPolicyAccepted: "1",
      appId: this.appId,
      policyAcceptanceTime: Date.now(),
      policyDictonaryCode: this.policyDictonaryCode
    };
    this.policyService.updatePolicyAcceptanceFlag(params).subscribe({
      next: (data) => {
        this.parsedJson = data;
        this.isPolicyUpdated = this.parsedJson.result;
        if (this.isPolicyUpdated == "1") {
          this.dialogRef.close("accepted");
        }
      }
    });
  }

  /**
  * @function onPopState
  * @description Routes to the login page when the browser's back or forward button is clicked.
  * @returns void
  */
  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    this.clearBSPKeysFromStorage();
    this.configService.loadAppConfig();
    this.router.navigate(['/login']);
  }

  onCancel() {
    this.router.navigateByUrl('/dashboard');
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
