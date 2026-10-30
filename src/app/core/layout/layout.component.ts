import * as screenfull from 'screenfull';
import { Router } from '@angular/router';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatDialog } from '@angular/material/dialog';
import { Component, HostListener, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FlatNode } from '../../shared/model/FlatNode';
import { LogOutDTO } from '../../shared/model/logoutDTO';
import { MenuNode } from '../../shared/model/MenuNodeDTO';
import { LayoutService } from '../services/layout.service';
import { CommonService } from '../services/common.service';
import { ConfigService } from '../services/config.service';
import { ComboDTO } from '../../shared/model/combo-detail-dto';
import { MenuListService } from '../services/menu-list.service';
import { CONSTANTS, LOCAL_SESSION_STORAGE, PROFILE_IMAGE_CONSTANT, TOAST_TYPE } from '../../shared/constants/constans';
import { NotifyService } from '../../core/services/notify.service';
import { LinkToAdminService } from '../services/link-to-admin.service';
import { configDetailsDTO } from '../../shared/model/configDetails-DTO';
import { GET_DICTIONARY_PAYLOAD } from '../../shared/model/shared.model';
import { APPS_UNITS, LAYOUT_DICT, UNITS_DATA } from '../../shared/model/layout.model';
import { CheckTokenExpiryService } from '../services/check-token-expiry.service';
import { VersionManagementService } from '../services/version-management.service';
import { AccessControlService } from '../../core/services/access-control.service';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { ReleaseNotesComponent } from '../../components/release-notes/release-notes.component';
import { PolicyPopupComponent } from '../policy/policy-popup/policy-popup.component';
import { ToastService } from '../services/toast.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})

export class LayoutComponent implements OnInit {
  logOutdto: LogOutDTO = new LogOutDTO();
  userDetails: any;
  fullName: any;
  parsedJson: any;
  // menuListJSON: MenuNode[] = [];
  configDetails: configDetailsDTO[] = [];
  basePanelTitle: any;
  superAdminEmail!: any;
  isSuperAdmin!: string;
  email!: any;
  active: number = 0;
  userId!: any;
  appId!: any;
  bspCopyright: any;
  bspBestView: any;
  chromeVersion: any;
  edgeVersion: any;
  currentVersion: string = ''
  bspCopyrightUrl: any;
  bspBestViewTooltip: any;
  formattedDate: any;
  bspVersion: any;
  safariVersion: any;
  logouttime: any;
  lastvisittime: any;
  layoutForm!: FormGroup;
  languageList: ComboDTO[] = [];
  copyRight: string = "";
  appName: string = "Fund Flow Management System";
  currentLanguage: number = 0;
  userName!: string;
  profileImgUrl!: string;

  private previousNode: FlatNode | null = null;
  isSwitchToAdminPresent: boolean = false;
  langId: any;
  drawer: any;
  menuData: any;
  goLiveDate: any;

  private get screenfull(): screenfull.Screenfull {
    return screenfull as screenfull.Screenfull;
  }

  // STATIC TREE TRANSFORMER
  private _transformer = (node: MenuNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      resourceId: node.resourceId,
      updBy: node.updBy,
      indeterminate: node.indeterminate,
      displayOrder: node.displayOrder,
      toolTipId: node.toolTipId,
      labelLink: node.labelLink,
      updStamp: node.updStamp,
      menuCode: node.menuCode,
      id: node.id,
      selected: node.selected,
      entBy: node.entBy,
      isVisibleToSuperAdmin: node.isVisibleToSuperAdmin,
      entStamp: node.entStamp,
      oldVersionId: node.oldVersionId,
      resourceName: node.resourceName,
      directParentId: node.directParentId,
      panelTypeId: node.panelTypeId,
      actionType: node.actionType,
      isSubMenuAvailable: node.isSubMenuAvailable,
      versionId: node.versionId,
      statusId: node.statusId,
      rbacRoleName: node.rbacRoleName,
      menuCodeDisplay: node.menuCodeDisplay,
      iconCode: node.iconCode,
      iconFileValue: node.iconFileValue,
      menuType: node.menuType,
      rbacRoleID: node.rbacRoleID,
      parentStatusId: node.parentStatusId,
      level: level,
      toolTipName: node.toolTipName
    };
  }

  //Dictionary values.
  layoutLabels = {
    noAppsLinked: '',
    noUnitsAssigned: ''
  }

  //Get Dictionary Data Payload.
  dictionaryData: GET_DICTIONARY_PAYLOAD = {
    languageId: 0,
    dictionaryCodes: [],
    appId: "0"
  };

  // STATIC TREE
  StatictreeControl = new FlatTreeControl<FlatNode>(
    node => node.level, node => node.expandable);
  //STATIC TREE FLATTENER
  statictreeFlattener = new MatTreeFlattener(
    this._transformer, node => node.level, node => node.expandable, node => node.children
  );
  // STATIC TREE
  StaticDataSource = new MatTreeFlatDataSource(this.StatictreeControl, this.statictreeFlattener);
  //Application and Unit form.
  appAndUnitForm!: FormGroup;
  //Applications array.
  applications = signal<APPS_UNITS[]>([]);
  //Units array.
  units = signal<UNITS_DATA[]>([]);
  //Flag to check layout component initial render.
  isFirstRender!: boolean;
  productLogoValue: any;
  productLogoUrl: any;

  constructor(
    private http: HttpClient,   // ✅ ADD THIS
    private router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private commonService: CommonService,
    private configService: ConfigService,
    private notifyService: NotifyService,
    private menuService: MenuListService,
    private layoutService: LayoutService,
    private admPanelService: LinkToAdminService,
    private versionService: VersionManagementService,
    private accessControlService: AccessControlService,
    private checkTokenExpiryService: CheckTokenExpiryService,
    private toast: ToastService
  ) {
  }

  ngOnInit(): void {
    this.getMenuDetails();   // ✅ ADD THIS
    this.checkLayoutInitialRender();
    this.userDetails = (sessionStorage.getItem(LOCAL_SESSION_STORAGE.USER_DATA));
    this.fullName = JSON.parse(this.userDetails).userName
      ?.replace(/\s*\[\d+\]\s*/g, '')
      .trim();

    this.email = JSON.parse(this.userDetails).email;
    this.userId = JSON.parse(this.userDetails).userId;
    this.getUserApplications();
    this.getConfigDetails();
    this.getDictionaryData();
    this.getLastVisitTime();
    this.getHistory();
    this.createAppAndUnitForm();
    this.getLanguageList();
    this.commonService.configValue$.subscribe(value => {
      if (value != null || value == undefined) {
        this.copyRight = value?.copyright;
        this.appName = value?.appNameValue;
      }
    });
    let switchToAdmin = localStorage.getItem(LOCAL_SESSION_STORAGE.SWITCH_TO_ADMIN);
    if (switchToAdmin == "ENABLED") {
      this.isSwitchToAdminPresent = true
    } else {
      this.isSwitchToAdminPresent = false
    }
    this.currentLanguage = parseInt(JSON.parse(localStorage.getItem(LOCAL_SESSION_STORAGE.BASELANGID)!));
    if (!this.isFirstRender) {
      const id = localStorage.getItem(LOCAL_SESSION_STORAGE.SELECTED_MENU_ID)!;
      this.getbuttonlevelAccess(+id);
    }
    this.layoutForm = this.fb.group({
      prefferedLanguage: [],
    });
    this.getUserName();
    this.notifyService.isLanguageListUpdated$.subscribe({
      next: (resp) => {
        if (resp) {
          this.getLanguageList();
          this.notifyService.isLanguageListUpdated.next(false);
        }
      }
    });

    this.notifyService.isCurrentVersionChange.subscribe({
      next: (resp) => {
        if (resp) {
          this.getHistory();
          this.notifyService.isCurrentVersionChange.next(false);
        }
      }
    })

    this.commonService.configValue$.subscribe(value => {
      if (value != null || value == undefined) {
        this.copyRight = value?.copyright;
        this.appName = value?.appNameValue;

        if (value?.productLogoName) {
          const extension = value.productLogoName.split('.').pop()?.toLowerCase();
          const fileTypes: { [key: string]: string } = {
            png: 'image/png',
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            ico: 'image/x-icon',
            svg: 'image/svg+xml'
          };

          const mimeType = fileTypes[extension || ''] || 'image/jpeg';

          this.productLogoUrl = `data:${mimeType};base64,${this.productLogoValue}`;
        }
      }
    });

  }

  /**
   * @function to checkout layout component initial render.
   * @returns void.
   */
  checkLayoutInitialRender(): void {
    this.layoutService.layoutInitialRender.subscribe({
      next: (res) => {
        this.isFirstRender = res;
      }
    });
  }

  /**
   * @function to create application and unit form.
   * @returns void.
   */
  createAppAndUnitForm(): void {
    this.appAndUnitForm = new FormGroup({
      application: new FormControl(''),
      unit: new FormControl('')
    });
  }

  /**
   * @function to patch app and unit id at login.
   * @returns void.
   */
  patchDropdownValues(): void {
    const selectedAppId = localStorage.getItem(LOCAL_SESSION_STORAGE.SELECTED_APP_ID)!;
    const selectedUnitId = localStorage.getItem(LOCAL_SESSION_STORAGE.SELECTED_UNIT_ID)!;
    this.appAndUnitForm.controls['application'].patchValue(JSON.parse(selectedAppId));
    this.appAndUnitForm.controls['unit'].patchValue(JSON.parse(selectedUnitId));
    this.getMenuDetails();
  }

  /**
   * @function to get apps linked to logged in user.
   * @returns void.
   */
  getUserApplications(): void {
    let selectedAppId: number;

    selectedAppId = JSON.parse(localStorage.getItem(LOCAL_SESSION_STORAGE.SELECTED_APP_ID)!);


    this.layoutService.getUserApplications(this.userId, selectedAppId).subscribe({
      next: (res) => {
        if (res) {
          if (res.data.length !== 0 || res.data !== null) {
            if (res.messageCode == 635) {
              res.data.forEach((app: any) => app['appName'] = `${app?.appName} (${app?.appId})`);
              this.applications.set(res.data);
              if (this.isFirstRender) {
                const storedAppId = localStorage.getItem(LOCAL_SESSION_STORAGE.SELECTED_APP_ID);
                this.appId = storedAppId ? JSON.parse(storedAppId) : null;
                const selectedAppId = this.appId ?? res?.data?.[0]?.id;
                if (selectedAppId) {
                  localStorage.setItem(LOCAL_SESSION_STORAGE.SELECTED_APP_ID, JSON.stringify(selectedAppId));
                }
                this.getSelectedAppUnits(selectedAppId);
              } else if (!this.isFirstRender) {
                this.getSelectedAppUnits(selectedAppId);
                this.patchDropdownValues();
              }
            }
          }
        }
      }
    });
  }

  /**
   * @function to get units assigned to selected app.
   * @returns void.
   */
  getSelectedAppUnits(selectedAppId: number): void {
    this.layoutService.getUserAssignedUnits(this.userId, selectedAppId).subscribe({
      next: (res) => {
        if (res) {
          if (res.messageCode == 1219) {
            this.units.set(res.data);
            localStorage.setItem(LOCAL_SESSION_STORAGE.SELECTED_UNIT_ID, JSON.stringify(res.data[0].orgDataId));
            // localStorage.setItem(LOCAL_SESSION_STORAGE.SELECTED_UNIT_ID, JSON.stringify(1));

            this.patchDropdownValues();
          } else if (res.messageCode != 635) {
            // this.toast.show("System Error in fetching Tenant Data", TOAST_TYPE.ERROR);
            localStorage.setItem(LOCAL_SESSION_STORAGE.SELECTED_UNIT_ID, JSON.stringify(1));
          }
        }
      }
    });
  }

  /**
   * @function to capture app selection.
   * @returns void.
   */
  onAppSelect(event: { value: number }): void {
    const selectedAppId = event.value;

    if (selectedAppId === undefined) {
      return;
    }
    this.notifyService.isCurrentVersionChange.next(true);
    // Call checkUserPolicyAcceptance before proceeding
    this.layoutService.checkUserPolicyAcceptance(this.userId, selectedAppId).subscribe({
      next: (response) => {
        if (response.status === 'error' && response.message === 'Policy is not configured') {
          this.toast.show(CONSTANTS.CONFIGURETHEPOLICY, TOAST_TYPE.INFO);
          this.appAndUnitForm.controls['application'].patchValue(JSON.parse(localStorage.getItem(LOCAL_SESSION_STORAGE.SELECTED_APP_ID)!));
          this.appAndUnitForm.controls['unit'].patchValue(JSON.parse(localStorage.getItem(LOCAL_SESSION_STORAGE.SELECTED_UNIT_ID)!));
          return;
        }
        else if (response.data.policyId === "0" || response.data.isPolicyValue === "0") {
          // Show policy acceptance modal (User needs to accept policy)
          const dialogRef = this.dialog.open(PolicyPopupComponent, {
            disableClose: true,
            width: '60%',
            data: { appId: selectedAppId }
          });

          // Listen for dialog close event
          dialogRef.afterClosed().subscribe((result) => {
            if (result === "accepted") {
              this.router.navigateByUrl('/login');
              localStorage.setItem(LOCAL_SESSION_STORAGE.SELECTED_APP_ID, JSON.stringify(selectedAppId));
            }
          });

        } else {
          // Proceed with fetching selected app units
          localStorage.setItem(LOCAL_SESSION_STORAGE.SELECTED_APP_ID, JSON.stringify(selectedAppId));
          this.getSelectedAppUnits(selectedAppId);
          this.layoutService.isSelectedAppUnitChanged.next(true);
        }
      },
      error: (error: Error) => {
        console.error("Error checking policy acceptance", error);
      }
    })
  }


  /**
   * @function to capture unit selection.
   * @returns void.
   */
  onUnitSelect(event: { value: number }): void {
    const selectedUnitId = event.value;

    if (selectedUnitId === undefined) {
      return;
    }

    localStorage.setItem(LOCAL_SESSION_STORAGE.SELECTED_UNIT_ID, JSON.stringify(selectedUnitId));
    this.layoutService.isSelectedAppUnitChanged.next(true);

    this.getMenuDetails();
  }

  getHistory() {
    this.versionService.getVersionHistroy().subscribe({
      next: (res) => {
        if (res.status == 'success') {
          this.currentVersion = res?.data?.currentVersion?.versionNo
        } else {
          this.currentVersion = '';
        }
      },
      error: (error) => {
      }
    });
  }

  // STATIC TREE
  // hasStaticChild = (_: number, node: FlatNode) => node.expandable;

  resetNestedNodes(node: any): void {
    // Implement logic to reset the state of the nested nodes for example, close all nested nodes
    this.StatictreeControl.collapse(node);
  }

  /**
  * @function to show the application is fullscreen view
  */
  toggleFullscreen() {
    if (this.screenfull.enabled) {
      this.screenfull.toggle();
    }
  }

  /**
  * @function to logout from dashboard
  * @returns land the user to login page
  */
  logOut() {
    this.clearBSPKeysFromStorage();
  }

  /**
  * @function to fetch configuration details
  * @returns configuration data.
  */
  getConfigDetails(): void {
    let selectedAppId = JSON.parse(localStorage.getItem(LOCAL_SESSION_STORAGE.SELECTED_APP_ID)!);
    let params = { appId: selectedAppId }
    this.menuService.getConfigDetailsList(params).subscribe({
      next: (data) => {
        this.parsedJson = data;
        if (this.parsedJson != "0") {
          // this.goLiveDate = this.parsedJson.Go_Live_Date.split('|')[0];
          // if (this.goLiveDate != undefined && this.goLiveDate != null) {
          //   localStorage.setItem(LOCAL_SESSION_STORAGE.GO_LIVE_DATE, this.goLiveDate);
          // }
          this.superAdminEmail = this.parsedJson.admSuperAdminEmail;
          this.bspVersion = this.parsedJson.BSP_Version;
          this.basePanelTitle = this.parsedJson.BSP_Panel_Title.split('|')[0];
          this.bspCopyright = this.parsedJson.BSP_Copyright_Footer.split('|')[0];
          this.bspCopyrightUrl = this.parsedJson.BSP_Copyright_Footer.split('|')[1];
          this.bspBestView = this.parsedJson.BSP_Best_View_Footer.split('|')[0];
          this.bspBestViewTooltip = this.parsedJson.BSP_Best_View_Footer.split('|')[1];
          this.chromeVersion = this.bspBestView.split(',')[0];
          this.edgeVersion = this.bspBestView.split(',')[1];
          this.safariVersion = this.bspBestView.split(',')[2];
        }
      }
    });
  }

  /**
  * @function to fetch menu details
  * @returns menu data.
  */
  // getMenuDetails(): void {
  //   const selectedAppId = localStorage.getItem(LOCAL_SESSION_STORAGE.SELECTED_APP_ID)!;
  //   const selectedUnitId = localStorage.getItem(LOCAL_SESSION_STORAGE.SELECTED_UNIT_ID)!;
  //   // const selectedUnitId = CONSTANTS.DEFAULT_UNIT_ID;
  //   let params = {
  //     userId: this.userId,
  //     languageId: this.currentLanguage,
  //     unitId: selectedUnitId,
  //     appId: selectedAppId,
  //     panelName: "bsp"
  //   }

  //   if (!params.appId || !params.unitId) {
  //     return;
  //   }

  //   this.menuService.getMenuDetailsList(params).subscribe({
  //     next: (data) => {
  //       if (data.data != "") {
  //         this.parsedJson = data.data;
  //         this.menuListJSON = this.sortMenuData(JSON.parse(data.data));
  //         this.StaticDataSource.data = this.menuListJSON;
  //         this.checkTokenExpiryService.isDataAvailable$.next(true);
  //       }
  //     }
  //   });
  // }

  /**
  * @function to short the menu data according to display order
  * @returns sorted menu data.
  */
  // sortMenuData(data: any[]): any[] {
  //   // Sort main menu items
  //   data.sort((a, b) => {
  //     return a.displayOrder - b.displayOrder;
  //   });
  //   // Recursively sort children
  //   data.forEach(item => {
  //     if (item.children && item.children.length > 0) {
  //       item.children = this.sortMenuData(item.children);
  //     }
  //     // Replace empty resourceName with "@missing"
  //     if (!item.resourceName || item.resourceName.trim() === "") {
  //       item.resourceName = "@missing";
  //     }
  //   });
  //   return data;
  // }





  menuListJSON: any[] = [];
  expandedMenu: Set<number> = new Set();   // NEW — store expanded UL/LI menu

  // ==========Json Menu Code by me=================
  getMenuDetails(): void {

    this.http.get<any[]>('assets/menu.json').subscribe({
      next: (data) => {
        if (data && data.length > 0) {

          // Direct assign JSON
          this.menuListJSON = this.sortMenuData(data);

          // optional
          this.checkTokenExpiryService.isDataAvailable$.next(true);
        }
      },
      error: (err) => {
        console.error("Error loading menu.json", err);
      }
    });

  }

  // ==========Dynamic Menu Code Comment by me=================
  // getMenuDetails(): void {
  //   const selectedAppId = localStorage.getItem(LOCAL_SESSION_STORAGE.SELECTED_APP_ID)!;
  //   const selectedUnitId = localStorage.getItem(LOCAL_SESSION_STORAGE.SELECTED_UNIT_ID)!;

  //   let params = {
  //     userId: this.userId,
  //     languageId: this.currentLanguage,
  //     unitId: selectedUnitId,
  //     appId: selectedAppId,
  //     panelName: "bsp"
  //   };

  //   if (!params.appId || !params.unitId) {
  //     return;
  //   }

  //   this.menuService.getMenuDetailsList(params).subscribe({
  //     next: (data) => {
  //       if (data.data != "") {
  //         this.parsedJson = data.data;

  //         // Sort data for UL-LI menu
  //         this.menuListJSON = this.sortMenuData(JSON.parse(data.data));

  //         // Your old StaticDataSource was for mat-tree
  //         // Now UL-LI uses menuListJSON directly
  //         this.checkTokenExpiryService.isDataAvailable$.next(true);
  //       }
  //     }
  //   });
  // }

  /**
   * Sort menu data by displayOrder (same as before)
   */
  sortMenuData(data: any[]): any[] {
    data.sort((a, b) => a.displayOrder - b.displayOrder);

    data.forEach(item => {
      if (item.children && item.children.length > 0) {
        item.children = this.sortMenuData(item.children);
      }

      if (!item.resourceName || item.resourceName.trim() === "") {
        item.resourceName = "@missing";
      }
    });

    return data;
  }

  /**
   * Check if node has children
   */
  hasStaticChild(node: any): boolean {
    return node.children && node.children.length > 0;
  }

  // /**
  //  * Toggle UL-LI expand/collapse
  //  */
  // toggleNode(node: any): void {
  //   if (this.expandedMenu.has(node.resourceId)) {
  //     this.expandedMenu.delete(node.resourceId);
  //   } else {
  //     this.expandedMenu.add(node.resourceId);
  //   }
  // }

  // /**
  //  * Check if node is expanded in UL-LI menu
  //  */
  // isExpanded(node: any): boolean {
  //   return this.expandedMenu.has(node.resourceId);
  // }






  /**
  * @function to insert a logout-Time and UserID in table.
  * @returns updated logout-Time.
  */
  getLogoutTime() {
    this.checkTokenExpiryService.isUserLoggedout$.next(true);
    this.logout();
    localStorage.setItem(LOCAL_SESSION_STORAGE.LOGOUT, Date.now().toString());
    this.checkTokenExpiryService.isUserLoggedout$.next(true);
    this.logOutdto.userId = this.userId;
    this.menuService.getLogoutTime(this.logOutdto).subscribe({
      next: (data: any) => {
        this.logouttime = data;
      }
    })
    this.clearBSPKeysFromStorage();
    this.router.navigate(['/login']);
    this.configService.hitCaptcha.next(true);
    this.checkTokenExpiryService.isUserLoggedIn$.next(false);
    this.checkTokenExpiryService.autoClosed$.next(false);
    this.checkTokenExpiryService.isDataAvailable$.next(false);
    this.configService.loadAppConfig();
  }

  // OKTA LOGOUT
  async logout() {
    // await this.oktaLoginService.logout();
  }

  /**
  * @function to fetch data from table based on userid.
  * @returns last visited time.
  */

  getLastVisitTime() {
    this.logOutdto.userId = this.userId;
    this.menuService.getLastVisitTime(this.logOutdto).subscribe({
      next: (data: any) => {
        if (!data && !data.LastVisitTime[0]?.lastVisitTime) {
          this.formattedDate = this.getFormattedCurrentDate();
        } else {
          this.lastvisittime = data.LastVisitTime[0].lastVisitTime;
          if (!this.lastvisittime) {
            this.formattedDate = this.lastvisittime;
          }
          this.formattedDate = this.lastvisittime;
        }
      }
    })
  }

  getFormattedCurrentDate(): string {
    const now = new Date();

    const day = String(now.getDate()).padStart(2, '0');
    const month = now.toLocaleString('en-US', { month: 'short' }); // Dec, Jan, Feb...
    const year = now.getFullYear();

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }

  switchToAdminPanel() {
    let winUserId = JSON.parse(sessionStorage.getItem(LOCAL_SESSION_STORAGE.USER_DATA)!).userDetails.userName;
    if (winUserId != undefined || winUserId != '') {
      winUserId = JSON.parse(sessionStorage.getItem(LOCAL_SESSION_STORAGE.USER_DATA)!).userDetails.userName;
    } else {
      winUserId = JSON.parse(localStorage.getItem(LOCAL_SESSION_STORAGE.USER_DATA)!).userDetails.userName;
    }

    let domain = JSON.parse(this.userDetails).userDetails.domain;
    this.admPanelService.getUserDetailsForSSO(winUserId, domain).subscribe({
      next: (response) => {
        let uuid = response.uuid;
        let winUserId = response.winUserId;
        let domain = response.domain;
        let appId = "104";
        this.admPanelService.generateSSOForAdmin(winUserId, domain, uuid, appId).subscribe({
          next: (response: any) => {
            window.open(response.redirectUrl, '_blank');
          },
          error: (error: any) => {
            console.log(error)
          }
        })
      },
      error: (error) => {
      }
    })
  }

  /**
   * @function to get list of all languages
   */
  getLanguageList() {

    this.commonService.getLanguageCombo().subscribe({
      next: (response: any) => {
        this.languageList = JSON.parse(JSON.stringify(response)).data?.sort((a: any, b: any) => a?.value?.localeCompare(b?.value))
        this.currentLanguage = parseInt(JSON.parse(localStorage.getItem(LOCAL_SESSION_STORAGE.BASELANGID)!));
        this.layoutForm.controls['prefferedLanguage'].patchValue(this.currentLanguage);
      }
    })
  }

  /**
   * @function to update user preffered language for application
   */
  updatePrefferedLanguage() {
    let prefLangId = this.layoutForm.controls['prefferedLanguage'].value;
    this.commonService.updatePrefferefLanguage(this.userId, prefLangId).subscribe({
      next: (res: any) => {
        sessionStorage.setItem(LOCAL_SESSION_STORAGE.USER_DATA, JSON.stringify({
          'email': JSON.parse(JSON.stringify(res)).data.email,
          'fullName': JSON.parse(JSON.stringify(res)).data.fullName,
          'username': JSON.parse(JSON.stringify(res)).data.username,
          'userId': JSON.parse(JSON.stringify(res)).data.userId,
          'domain': JSON.parse(JSON.stringify(res)).data.domain,
          'role': JSON.parse(JSON.stringify(res)).data.role,
          'baseLangId': JSON.parse(JSON.stringify(res)).data.baseLanguage
        }));
        sessionStorage.setItem(LOCAL_SESSION_STORAGE.BASELANGID, JSON.parse(JSON.stringify(res)).data.baseLanguage);
        localStorage.setItem(LOCAL_SESSION_STORAGE.BASELANGID, JSON.parse(JSON.stringify(res)).data.baseLanguage);
        this.currentLanguage = parseInt(JSON.parse(localStorage.getItem(LOCAL_SESSION_STORAGE.BASELANGID)!));
        this.notifyService.isBaseLanguageChnaged(true);
        this.getMenuDetails();
      },
      error: () => {

      }
    });

  }

  /**
  * @function to opens Release Notes dialog box.
  * @returns void.
  */
  onReleaseNote(): void {
    this.dialog.open(ReleaseNotesComponent, {
      width: '90%',
      maxWidth: '100%',
      data: { data: 'version' },
      disableClose: true,
      panelClass: 'AddLanguagedialog'
    });
  }

  openDialog(): void {
    this.dialog.open(ChangePasswordComponent, {
      width: '40%',
      disableClose: true,
      panelClass: 'changepassword'
    });
  }

  getbuttonlevelAccess(id: any) {
    const selectedAppId = localStorage.getItem(LOCAL_SESSION_STORAGE.SELECTED_APP_ID)!;
    const selectedUnitId = localStorage.getItem(LOCAL_SESSION_STORAGE.SELECTED_UNIT_ID)!;
    this.active = id;
    let params = {
      userId: this.userId,
      resourceId: id,
      languageId: this.currentLanguage,   //added to  resolve the issue of missing parameters
      unitId: selectedUnitId, //added to  resolve the issue of missing parameters
      appId: selectedAppId,
      panelName: "bsp"
    }

    if (!params.appId || !params.unitId) {
      return;
    }

    this.menuService.getButtonLevelAccess(params).subscribe({
      next: (data) => {
        if (!data || data.length === 0) {
          return;
        }

        this.parsedJson = data;

        let accessMap = new Map<string, boolean>();

        for (let item of this.parsedJson) {
          // Check if the current item has children
          if (item.children && item.children.length > 0) {
            // Iterate over each child in the current item
            for (let child of item.children) {
              // Check if the child is of type "function" and add to accessMap
              if (child.menuType === "function") {
                accessMap.set(child.resourceName, child.selected);
                this.accessControlService.setAccess(child.resourceName, child.selected);
              }
            }
          }
        }

        let addBtnAccess;
        let editBtnAccess;
        let deleteBtnAccess;

        const buttonAccessData = data[0].children;

        buttonAccessData.map((data: any) => {
          if (data.resourceName == 'Add') {
            addBtnAccess = data.selected;
            const addPermissionMode = data.permissionDeniedMode;
            this.layoutService.addPermissionMode.next(addPermissionMode);
          }

          if (data.resourceName == 'Edit') {
            editBtnAccess = data.selected;
            const editPermissionMode = data.permissionDeniedMode;
            this.layoutService.editPermissionMode.next(editPermissionMode);
          }

          if (data.resourceName == 'Delete') {
            deleteBtnAccess = data.selected;
            const deletePermissionMode = data.permissionDeniedMode;
            this.layoutService.deletePermissionMode.next(deletePermissionMode);
          }
        });

        localStorage.setItem(LOCAL_SESSION_STORAGE.SELECTED_MENU_ID, JSON.stringify(id));
        localStorage.setItem(LOCAL_SESSION_STORAGE.ADD_ACCESS, JSON.stringify(addBtnAccess));
        localStorage.setItem(LOCAL_SESSION_STORAGE.EDIT_ACCESS, JSON.stringify(editBtnAccess));
        localStorage.setItem(LOCAL_SESSION_STORAGE.DELETE_ACCESS, JSON.stringify(deleteBtnAccess));

        this.notifyService.buttonLevelAccess.next(accessMap);
        this.accessControlService.setAccess('Add', true);
        this.accessControlService.setAccess('Edit', false);

      }
    });
  }

  // toggleNode(node: FlatNode) {
  //   if (node.menuType == 'menu') {
  //     if (this.previousNode && this.previousNode !== node) {
  //       this.StatictreeControl.collapse(this.previousNode);
  //     }
  //     this.previousNode = this.StatictreeControl.isExpanded(node) ? node : null;
  //   }
  // }

  /**
  * @function to get dictionary data.
  * @returns void.
  */
  getDictionaryData(): void {
    const baseLangId = JSON.parse(sessionStorage.getItem(LOCAL_SESSION_STORAGE.USER_DATA)!).baseLangId;
    const appId = JSON.parse(localStorage.getItem(LOCAL_SESSION_STORAGE.SELECTED_APP_ID)!);
    this.dictionaryData.languageId = baseLangId;
    this.dictionaryData.appId = appId;
    this.dictionaryData.dictionaryCodes = LAYOUT_DICT;

    this.commonService.getDictionaryByLangPanelDictIds(this.dictionaryData).subscribe({
      next: (res) => {
        this.layoutLabels.noAppsLinked = res?.data?.find((data: any) => data.dictionaryCode == 708)?.value;
        this.layoutLabels.noUnitsAssigned = res?.data?.find((data: any) => data.dictionaryCode == 709)?.value;
      }
    });
  }

  getSvgDataUrl(svgString: string): string {
    if (svgString != undefined) {
      const base64Svg = btoa(svgString);  // Convert the SVG string to base64
      return `data:image/svg+xml;base64,${base64Svg}`;  // Create the data URL
    }
    return "";
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
 * @function to get user name from session storage.
 * @returns void.
 */
  getUserName(): void {
    const userData = localStorage.getItem(LOCAL_SESSION_STORAGE.USER_DATA)!;
    if (userData) {
      const parsedData = JSON.parse(userData);
      this.userName = parsedData.userDetails.userName;
      this.userId = parsedData.userId;

      // Construct profile picture URL
      this.profileImgUrl = PROFILE_IMAGE_CONSTANT.PROFILE_IMAGE_BASE_URL + this.userName;
    }
  }





  // @HostListener('document:click', ['$event'])
  // onClick(event: MouseEvent) {
  //   if (this.drawer && this.drawer.opened) {
  //     const drawerElement = document.querySelector('.main_container');
  //     const clickedInsideDrawer = drawerElement?.contains(event.target as Node);
  //     const clickedMenuButton = (event.target as Element)?.closest('.open');

  //     if (!clickedInsideDrawer && !clickedMenuButton) {
  //       this.drawer.close();
  //     }
  //   }
  // }


  // @HostListener('document:click', ['$event'])
  // onClickOutside(event: Event) {
  //   const clickedInsideMenu = (event.target as HTMLElement).closest('.custom-drawer');
  //   const clickedMenuButton = (event.target as HTMLElement).closest('.menu_btn');
  //   // If clicked outside menu AND not menu button → close menu
  //   if (!clickedInsideMenu && !clickedMenuButton) {
  //     this.isMenuOpen = false;
  //   }
  // }


  isMenuOpen = false;
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    // this.isPinnedByClick = !this.isPinnedByClick;
    console.log("Menu State:", this.isMenuOpen);
  }

  isDarkMode = false;
  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-theme', this.isDarkMode);
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  // isPinnedByClick = false;  // For toggle button
  expandedNode: any = null;      // for accordion open
  activeParentNode: any = null;  // for active highlight
  /**
   * Toggle UL-LI expand/collapse
   */
  toggleNode(node: any) {
    // Accordion behavior
    if (this.expandedNode === node) {
      this.expandedNode = null;
      this.activeParentNode = null;
    } else {
      this.expandedNode = node;
      this.activeParentNode = node;
    }
  }
  /**
   * Check if node is expanded in UL-LI menu
   */
  isExpanded(node: any) {
    return this.expandedNode === node;
  }

  isParentActive(node: any) {
    return this.activeParentNode === node;
  }

  // openMenuOnHover() {
  //   if (!this.isPinnedByClick) {
  //     this.isMenuOpen = true;
  //   }
  // }

  // closeMenuOnLeave() {
  //   if (!this.isPinnedByClick) {
  //     this.isMenuOpen = false;
  //   }
  // }

}