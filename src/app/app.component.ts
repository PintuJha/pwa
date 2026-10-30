import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription, filter, takeUntil } from 'rxjs';
import { SsoOktaService } from './core/services/sso-okta.service';
import { MatDialog } from '@angular/material/dialog';
import { CheckTokenExpiryService } from './core/services/check-token-expiry.service';
import { SessionExpiryDialogComponent } from './components/session-expiry-dialog/session-expiry-dialog.component';
import { SingleActionDialogComponent } from './components/single-action-dialog/single-action-dialog.component';
import { BnNgIdleService } from 'bn-ng-idle';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { ConfigService } from './core/services/config.service';
import { DialogService } from './core/services/dialog.service';
import { CONSTANTS, LOCAL_SESSION_STORAGE, RESPONSE, TOAST_TYPE } from './shared/constants/constans';
import { GET_DICTIONARY_PAYLOAD } from './shared/model/shared.model';
import { IDEAL_TIMEOUT_DICT } from './shared/model/ideal-timeout.model';
import { CommonService } from './core/services/common.service';
import { LocaleService } from './core/services/locale.service';
import { LayoutService } from './core/services/layout.service';
import { UserActivityService } from './core/services/user-activity.service';
import { ToastService } from './core/services/toast.service';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './components/spinner/spinner.component';


export const DATE_FORMAT = {
  DATE: '',
  LOCALE: ''
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SpinnerComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  isUserActive: boolean = true;
  @HostListener('document:mousemove', ['$event'])

  /**
 * @function to capture user's mouse movement.
 * @param mouse event.
 * @returns void.
 */
  onMouseMove(e: any) {
    if (e) {
      this.isIdle = false;
    }
    if ((this.refreshCount >= 1) && !this.isIdle) {
      this.refreshCount = 0;
    }
  }

  //App Title.
  title = 'Base_Panel';
  //Boolean to check if Idle Screen dialog box is open.
  isIdleDialogOpen: boolean = false;
  //Boolean to check if user is logged out.
  isUserLoggedOut: boolean = false;
  //Boolean to check if user is logged in.
  isUserLoggedIn: boolean = false;
  //Idle Screen Timeout time.
  idleTimeout: number = 1200;
  //Boolean to set show Idle Screen Timeout Dialog Box.
  showIdleScreenDialog: boolean = true;
  //Boolean to check if session is refreshed.
  isSessionRefreshed: boolean = false;
  //Count of session getting refresh after idle timeout.
  refreshCount: number = 0;
  //Boolean to check if screen is idle.
  isIdle: boolean = true;
  //Boolean to check if dialog box is closed by dialog service.
  isAutoClosed: boolean = false;
  //Config Response Data.
  parsedJson: any;
  //App date format.
  public appDateFormat!: string;
  //System Locale.
  public locale!: string;

  //Loggedin user information.
  userData!: any;
  //Current panel id.
  panelTypeId!: any;
  //Loggedin user e-mail.
  userEmail!: string;
  //ADM panel superAdmin email id.
  adm_super_admin_email!: string;
  //BSP panel superAdmin email id.
  bsp_super_admin_email!: string;
  //Base Language of Logged in user.
  baseLangId!: number;
  langId: any;
  formObject: any; // Object to store form data

  //Get Dictionary Data Payload.
  dictionaryData: GET_DICTIONARY_PAYLOAD = {
    languageId: 0,
    dictionaryCodes: [],
    appId: ""
  };

  //Ideal Timeout Dialog box Labels.
  idealTimeoutLabels = {
    yourSessionIsIdeal: '',
    continue: '',
    logout: '',
    minutes: '',
    seconds: '',
    login: '',
    sessionExpired: '',
    yourSessionExpired: '',
    systemError: '',
  }

  private ngUnsubscribe = new Subject<void>();
  private navigationSub: Subscription | undefined;

  isActive: boolean = false;
  private activitySubscription!: Subscription;

  constructor(private dialog: MatDialog, private checkTokenExpiryService: CheckTokenExpiryService,
    private toast: ToastService, private router: Router, private oktaLoginService: SsoOktaService,
    private route: ActivatedRoute, private bnIdle: BnNgIdleService, private configService: ConfigService,
    private dialogService: DialogService, private commonService: CommonService, private localeService: LocaleService,
    private layoutService: LayoutService,
    private titleService: Title,
    private userActivityService: UserActivityService
  ) {
    if (localStorage.getItem(LOCAL_SESSION_STORAGE.TEMP_PWD_GENERATED) == "1") {
      this.clearBSPKeysFromStorage();
    }
    this.setSession();
    this.checkLayoutInitialRender();
  }

  ngOnInit(): void {
    this.oktaLoginService.handleCallback();
    this.navigationSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.ngUnsubscribe)
    ).subscribe((event) => {
      this.forgetPwdRedirect();
    });
    this.activitySubscription = this.userActivityService.monitorUserActivity().subscribe(isActive => {
      this.isActive = isActive;
      if (!isActive) {
        localStorage.setItem(LOCAL_SESSION_STORAGE.USER_ACTIVE, 'false');
      } else {
        localStorage.setItem(LOCAL_SESSION_STORAGE.USER_ACTIVE, 'true');
      }
    });
    this.listenStorageEvents();
    this.initiateIdealScreenTimer();
    this.loadDateFormatFromSession();
    this.getDictionaryData();
    this.getWhiteLabelDictionaryData();
  }

  getWhiteLabelDictionaryData() {

    this.commonService.getWhiteLabelDictionaryData(CONSTANTS.DEFAULT_LANG_ID, Number(CONSTANTS.APS_APP_ID)).subscribe({
      next: (res) => {
        if (res?.status === RESPONSE.SUCCESS && res?.data) {
          this.formObject = res.data;
          this.commonService.setConfigValue(this.formObject);
          this.titleService.setTitle(this.formObject.appTitleValue);
        }
      },
      error: (err) => {
        this.toast.show(this.idealTimeoutLabels.systemError, TOAST_TYPE.ERROR);
        console.error('Error fetching config value:', err);
      }
    });
  }

  /**
   * @function to check if layout component is rendered for the first time after login.
   * @returns void.
   */
  checkLayoutInitialRender(): void {
    this.layoutService.layoutInitialRender.next(false);
  }

  /**
   * @function to load the date format from session storage.
   * @returns void.
   */
  loadDateFormatFromSession(): void {
    this.locale = this.localeService.getLocale();
    DATE_FORMAT.LOCALE = this.locale;
    const savedDateFormat = localStorage.getItem(LOCAL_SESSION_STORAGE.APP_DATE_FORMAT);
    if (savedDateFormat) {
      DATE_FORMAT.DATE = savedDateFormat;
    }
  }

  /**
  * @function to set panel id and superAdmin data in session storage in multi tab session.
  * @returns void.
  */
  setSession() {
    if (this.isUserLoggedOut && !this.isUserLoggedIn) {
      return;
    }
    if (!(sessionStorage.getItem(LOCAL_SESSION_STORAGE.USER_DATA)) && (localStorage.getItem(LOCAL_SESSION_STORAGE.USER_DATA))) {
      const userdata = localStorage.getItem(LOCAL_SESSION_STORAGE.USER_DATA)!;
      sessionStorage.setItem(LOCAL_SESSION_STORAGE.USER_DATA, userdata);
    }
  }

  /**
 * @function to initiate ideal timer.
 * @returns void.
 */
  initiateIdealScreenTimer(): void {
    this.checkTokenExpiryService.isDataAvailable$.subscribe({
      next: (res) => {
        if (res) {
          this.getAllAdmSysConfig();
        }
      }
    })
  }

  /**
 * @function to listen storage events.
 * @returns void.
 */
  listenStorageEvents(): void {
    // Listen for storage events
    window.addEventListener('storage', this.handleStorageEvent.bind(this));
    window.addEventListener('storage', (event) => {
      if (event.key === 'logout') {
        this.handleLogout();
      }
      if (event.key === LOCAL_SESSION_STORAGE.USER_ACTIVE) {
        if (localStorage.getItem(LOCAL_SESSION_STORAGE.USER_ACTIVE) === "true") {
          const openDialogs = this.dialog.openDialogs;
          for (const dialog of openDialogs) {
            if (dialog.componentInstance instanceof ConfirmComponent) {
              dialog.close(true);
            }
          }
        }
      }
    });

    // Check if the session expiry dialog should be shown
    const expiryTime = localStorage.getItem(LOCAL_SESSION_STORAGE.EXPIRY_TIME);
    const showExpiryDialog = localStorage.getItem(LOCAL_SESSION_STORAGE.SHOW_EXPIRY_DIALOG);
    if (expiryTime && showExpiryDialog === 'true') {
      this.showExpiryDialog(parseInt(expiryTime, 10));
    }
  }

  /**
   * @function to start idle screen time check on app first render and if user refreshes the app manually.
   * @returns void.
   */
  checkIdleTimeout(): void {

    const token = localStorage.getItem(LOCAL_SESSION_STORAGE.TOKEN);
    if (token) {
      this.checkTokenExpiryService.isUserLoggedIn$.next(true);
    }

    this.checkTokenExpiryService.isUserLoggedout$.subscribe(res => this.isUserLoggedOut = res);
    this.checkTokenExpiryService.isIdleDialogOpen$.subscribe(res => this.isIdleDialogOpen = res);
    this.checkTokenExpiryService.isUserLoggedIn$.subscribe(res => this.isUserLoggedIn = res);
    this.checkTokenExpiryService.autoClosed$.subscribe(res => this.isAutoClosed = res);

    // Start monitoring user activity
    this.bnIdle.startWatching(this.idleTimeout).subscribe((isTimedOut) => {
      if (!token || (this.isUserLoggedOut && !this.isUserLoggedIn)) {
        this.bnIdle.resetTimer();
        return;
      }

      if (!this.isUserLoggedOut && this.isUserLoggedIn) {
        if (this.isIdleDialogOpen || this.isAutoClosed) {
          this.bnIdle.resetTimer();
          return;
        }

        // ✅ Only trigger idle logic if the user is truly idle
        if (!this.isActive) {
          this.isIdle = true;
          this.checkTokenExpiryService.continueFromIdle$.next(true);

          if (this.showIdleScreenDialog && localStorage.getItem(LOCAL_SESSION_STORAGE.USER_ACTIVE) === "false") {
            this.bnIdle.stopTimer();
            this.checkTokenExpiryService.isIdleDialogOpen$.next(true);
            const dialogData = {
              message: `${this.idealTimeoutLabels.yourSessionIsIdeal || 'Your system was idle for more than'} ${this.idleTimeout / 60} ${this.idealTimeoutLabels.minutes || 'minutes'}.`,
              buttonText: {
                ok: `${this.idealTimeoutLabels.continue || 'Continue'}`,
                cancel: `${this.idealTimeoutLabels.logout || 'Logout'}`
              }
            };
            const singleActionDialogRef = this.dialogService.openDialog(ConfirmComponent, {
              disableClose: true,
              data: dialogData
            });
            singleActionDialogRef.afterClosed().subscribe((confirmed: any) => {
              this.bnIdle.startWatching(this.idleTimeout);
              if (confirmed !== 'skip') {
                this.isActive = true;
                this.handleDialogClose(confirmed);
              }
              this.checkTokenExpiryService.isIdleDialogOpen$.next(false);
              this.checkTokenExpiryService.autoClosed$.next(true);
            });
          } else {
            if ((this.refreshCount >= 1) && this.isIdle) {
              return;
            }
            localStorage.setItem(LOCAL_SESSION_STORAGE.CONTINUESESSION, 'true');
            this.checkTokenExpiryService.isIdleDialogOpen$.next(false);
            this.checkTokenExpiryService.continueFromIdle$.next(true);
            this.checkTokenExpiryService.autoClosed$.next(true);
            this.isSessionRefreshed = true;
            this.refreshCount++;
          }
        }
      }
    })
  }

  /**
 * This method manually resets the idle timer on user activity.
 */
  resetIdleTimer(): void {
    const resetEvents = ['mousemove', 'keypress', 'click', 'scroll']; // User activity events
    resetEvents.forEach(event => {
      document.addEventListener(event, () => {
        this.bnIdle.resetTimer(this.idleTimeout);
      });
    });
  }

  /**
   * @function to handle dialog box close event.
   * @param dialog box action.
   * @returns void.
   */
  handleDialogClose(confirmed: any): void {
    if (confirmed) {
      this.checkTokenExpiryService.isIdleDialogOpen$.next(false);
      localStorage.setItem(LOCAL_SESSION_STORAGE.CONTINUESESSION, 'true');
      this.checkTokenExpiryService.continueFromIdle$.next(true);
      this.checkTokenExpiryService.extendSession();
      this.checkTokenExpiryService.autoClosed$.next(true);
    } else {
      this.checkTokenExpiryService.isUserLoggedout$.next(true);
      this.checkTokenExpiryService.isIdleDialogOpen$.next(false);
      this.clearBSPKeysFromStorage();
      this.configService.loadAppConfig();
      this.configService.hitCaptcha.next(true);
      this.router.navigate(['/login']);
      this.checkTokenExpiryService.isUserLoggedIn$.next(false);
      this.checkTokenExpiryService.autoClosed$.next(true);
      this.checkTokenExpiryService.isDataAvailable$.next(false);
      this.dialog.closeAll();
    }
  }

  /**
   * @function to check if user has logged out and perform logout function on all tabs user is logged in.
   * @returns void.
   */
  handleLogout(): void {
    this.checkTokenExpiryService.logout();
  }

  /**
   * @function to handel timeout functionality using local storage variables across all tabs user is logged in.
   * @param event from all tabs.
   * @returns void.
   */
  handleStorageEvent(event: StorageEvent): void {
    if (event.key === 'BSP_showExpiryDialog' && event.newValue === 'true') {
      const expiryTime = localStorage.getItem(LOCAL_SESSION_STORAGE.EXPIRY_TIME);
      if (expiryTime) {
        this.showExpiryDialog(parseInt(expiryTime, 10));
      }
    }
    else if (event.key === 'continueSession' && event.newValue === 'true') {
      this.extendSessionOnAllTabs();
    }
    else if (event.key === 'logoutSession' && event.newValue === 'true') {
      this.checkTokenExpiryService.logout();
    }
    else if (event.key === 'sessionExpired' && event.newValue === 'true') {
      this.openSingleActionDialog();
    }
    else if (event.key === 'closeSingleActionDialog' && event.newValue === 'true') {
      this.closeSingleActionDialog();
    }
  }

  /**
   * @function to show and session expiry dialog box or logout user across all tabs user is logged in.
   * @param expiryTime of JWT token.
   * @returns void.
   */
  private showExpiryDialog(expiryTime: number): void {
    const dialogRef = this.dialog.open(SessionExpiryDialogComponent, {
      data: { expiryTime: expiryTime }
    });

    dialogRef.afterClosed().subscribe(result => {
      localStorage.removeItem('BSP_showExpiryDialog');
      if (result === 'continue') {
        this.checkTokenExpiryService.extendSession();
      } else if (result === 'logout' || result === 'timeExpired') {
        this.checkTokenExpiryService.logout();
      }
    });
  }

  /**
   * @function to close session expiry dialog box across all tabs user is logged in.
   * @returns void.
   */
  private extendSessionOnAllTabs(): void {
    const openDialogs = this.dialog.openDialogs;
    for (const dialog of openDialogs) {
      if (dialog.componentInstance instanceof SessionExpiryDialogComponent) {
        dialog.close();
      }
    }
    this.checkTokenExpiryService.extendSession();
  }

  /**
   * @function to open single action dialog box and on login click logout user across all tabs user is logged in.
   * @returns void.
   */
  private openSingleActionDialog(): void {
    const dialogData = {
      title: 'Session Expired.',
      content: 'Your Session is expired.',
      buttonText: 'Logout.'
    };
    const dialogRef = this.dialog.open(SingleActionDialogComponent, {
      disableClose: true,
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirmed') {
        this.checkTokenExpiryService.logout();
      }
    });
  }

  /**
   * @function to close single action dialog box across all tabs user is logged in.
   * @returns void.
   */
  private closeSingleActionDialog(): void {
    const openDialogs = this.dialog.openDialogs;
    for (const dialog of openDialogs) {
      if (dialog.componentInstance instanceof SingleActionDialogComponent) {
        dialog.close();
      }
    }
  }

  forgetPwdRedirect() {
    if (this.router.url.includes(('forgetresetPWD'))) {
      this.router.navigate(['forgetResetPWD']);
      this.ngUnsubscribe.next();
      this.ngUnsubscribe.complete();
      if (this.navigationSub) {
        this.navigationSub.unsubscribe();
      }
    }
  }

  ngOnDestroy(): void {
    this.activitySubscription.unsubscribe();
    this.userActivityService.stopMonitoring();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    if (this.navigationSub) {
      this.navigationSub.unsubscribe();
    }
  }

  /**
 * @function to get list of all configuration in ADM tab.
 * @returns void.
*/
  getAllAdmSysConfig() {
    const appId = localStorage.getItem(LOCAL_SESSION_STORAGE.SELECTED_APP_ID);
    const params = { appId: appId };

    this.checkTokenExpiryService.getAllSysConfigList(params).subscribe({
      next: (res) => {
        this.parsedJson = res;

        if (this.parsedJson && this.parsedJson !== "0") {
          const appDateFormatValue = this.parsedJson.App_Date_Format;
          if (appDateFormatValue) {
            this.appDateFormat = appDateFormatValue.split('|')[0];
            DATE_FORMAT.DATE = this.appDateFormat;
            localStorage.setItem(LOCAL_SESSION_STORAGE.APP_DATE_FORMAT, this.appDateFormat);
          }
          const idleTimeoutValue = this.parsedJson.BSP_Idle_Timeout;
          if (idleTimeoutValue) {
            this.idleTimeout = +idleTimeoutValue.split('|')[0];
            localStorage.setItem(
              LOCAL_SESSION_STORAGE.IDLE_TIMEOUT,
              this.idleTimeout.toString()
            );
          }
          const showIdleDialogValue = this.parsedJson.BSP_Show_Idle_Screen_Dialog;
          if (showIdleDialogValue) {
            const flag = showIdleDialogValue.split('|')[0].toLowerCase();
            this.showIdleScreenDialog = flag === 'true';
          }
        }
        this.checkIdleTimeout();
      }
    });
  }


  /**
* @function to get dictionary data.
* @returns void.
*/
  getDictionaryData(): void {
    if (sessionStorage.getItem(LOCAL_SESSION_STORAGE.BASELANGID) !== null) {
      this.baseLangId = JSON.parse(sessionStorage.getItem(LOCAL_SESSION_STORAGE.BASELANGID)!);
    }
    let appId = CONSTANTS.ADM_APP_ID;

    this.dictionaryData.languageId = this.baseLangId ? this.baseLangId : 1;
    this.dictionaryData.appId = appId.toString();
    this.dictionaryData.dictionaryCodes = IDEAL_TIMEOUT_DICT;

    this.commonService.getDictionaryByLangPanelDictIds(this.dictionaryData).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.idealTimeoutLabels.yourSessionIsIdeal = res?.data?.find((data: any) => data.dictionaryCode == 557)?.value;
          this.idealTimeoutLabels.seconds = res?.data?.find((data: any) => data.dictionaryCode == 559)?.value;
          this.idealTimeoutLabels.minutes = res?.data?.find((data: any) => data.dictionaryCode == 558)?.value;
          this.idealTimeoutLabels.continue = res?.data?.find((data: any) => data.dictionaryCode == 498)?.value;
          this.idealTimeoutLabels.logout = res?.data?.find((data: any) => data.dictionaryCode == 499)?.value;
          this.idealTimeoutLabels.sessionExpired = res?.data?.find((data: any) => data.dictionaryCode == 776)?.value;
          this.idealTimeoutLabels.yourSessionExpired = res?.data?.find((data: any) => data.dictionaryCode == 502)?.value;
          this.idealTimeoutLabels.login = res?.data?.find((data: any) => data.dictionaryCode == 503)?.value;
          this.idealTimeoutLabels.systemError = res?.data?.find((data: any) => data?.dictionaryCode == 633)?.value;
        }
      }
    })
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