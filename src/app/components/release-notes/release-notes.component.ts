import { AfterViewInit, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { VersionManagementService } from 'src/app/core/services/version-management.service';
import { CONSTANTS, LOCAL_SESSION_STORAGE, RELEASE_NOTES, RESPONSE, TOAST_TYPE } from 'src/app/shared/constants/constans';
import { ToastService } from 'src/app/core/services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { DictionaryValidatorPipe } from 'src/app/shared/pipes/dictionary-validator.pipe';
import { NotifyService } from 'src/app/core/services/notify.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonService } from 'src/app/core/services/common.service';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MaterialExampleModule } from 'src/app/shared/angular-material/MaterialExampleModule';
import { SharedModule } from "../../shared/shared.module";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';


export const MY_DATE_FORMATS = {
  parse: { dateInput: 'DD-MMM-YYYY' },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD-MMM-YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-release-notes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatPaginatorModule, MaterialExampleModule, SharedModule],
  templateUrl: './release-notes.component.html',
  styleUrl: './release-notes.component.scss',
   providers: [
      {
        provide: DateAdapter, useClass: MomentDateAdapter,
        deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
      },
      { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    ],
})
export class ReleaseNotesComponent implements OnInit, AfterViewInit, OnDestroy {
  tabIndex: number = 0;
  masterData: Array<any> = [];
  currentData: any;
  currentDesc: any
  startDate: any;
  adminPanelId!: string;
  pageNo: number = 0;
  historyDesc: Array<any> = [];
  endDate: Date = new Date();
  totalRecords: any
  paginationPageSize: number = 50;
  historyData: Array<any> = [];
  searchForm!: FormGroup
  totalPages: number = 0;
  labelAndButtonValue: any = {
    latestRelease: '',
    history: '',
    version: '',
    releaseType: '',
    releaseDate: '',
    close: '',
    search: '',
    reset: '',
    noRecordFound: ''
  }
  pageNumber: number = 1;
  private translatePipe = new DictionaryValidatorPipe();
  //Observable to unsubscribe subcription on component destroy from DOM.
  private destroy$ = new Subject<void>();
  dictionaryData: any = {
    languageId: 0,
    panelId: 0,
    dictionaryCodes: [],
  };

  constructor(private fb: FormBuilder, private commonService: CommonService, private versionService: VersionManagementService, private toast: ToastService, @Inject(MAT_DIALOG_DATA) public data: any, private notifyService: NotifyService, private sanitizer: DomSanitizer) {
    this.translatePipe = new DictionaryValidatorPipe();
  }

  ngOnInit(): void {

    this.createSearchForm();
    this.getHistory()
    this.prevDateGetter()

    this.getDictionaryData()
    this.notifyService.isLanguageChanged.pipe(takeUntil(this.destroy$)).subscribe({
      next: (resp) => {
        if (resp) {
          this.getDictionaryData()
          this.notifyService.isLanguageChanged.next(false)
        }
      }
    })
    this.getDescriptionData()
  }

  /**
     * @function to get previous date on one year ago
     * @returns void.
    */
  prevDateGetter() {
    this.startDate = this.commonService.prevDateGetter();
    this.searchForm.controls['startDate'].patchValue(this.startDate)
  }
  getHistory() {
    this.versionService.getVersionHistroy().subscribe({
      next: (res) => {
        if (res?.status == RESPONSE.SUCCESS) {
          let desc = this.descriptionArr?.find((resp: any) => resp?.dictionaryCode == res?.data?.currentVersion.description);
          res.data.currentVersion.description = !!desc?.value ? desc?.value : ''
          this.currentData = res?.data?.currentVersion;
          this.currentDesc = this.safeHTMLContent(this.currentData['description']);
          this.historyData = res?.data?.historyVersion;

          // Map over the historyVersion array and sanitize each description

          this.historyDesc = res?.data?.historyVersion.map((item: any) => {

            if (this.descriptionArr.some(res => res?.dictionaryCode == item?.description)) {
              item.description = this.descriptionArr.find(res => res?.dictionaryCode == item?.description)?.value;
            }


            return {
              ...item,
              description: this.safeHTMLContent(!!item?.description ? item?.description : '')
            };
          });
          this.masterData = res?.data.historyVersion;
          this.totalRecords = res?.data.historyVersion.length;
          this.totalPages = Math.ceil(this.totalRecords / this.paginationPageSize);
        } else {
          this.currentData = '';
          this.currentDesc = '';
          this.historyData = [];
          this.totalPages = 0;
          this.totalRecords = 0;
          this.toast.show(CONSTANTS.RECORD_NOT_FOUND, TOAST_TYPE.INFO);
        }
      },
      error: (error) => {
      }
    });
  }

  safeHTMLContent(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  /**
    * @function to function to initialize search form
    * @returns void.
   */
  createSearchForm() {
    this.searchForm = this.fb.group({
      searchedText: [''],
      startDate: [''],
      endDate: ['']
    });
    this.searchForm.controls['endDate'].patchValue(this.endDate);
    this.searchForm.controls['startDate'].patchValue(this.startDate);
  }

  ngAfterViewInit() {

  }

  descriptionArr: Array<any> = [];
  getDescriptionData(): void {

    const defaultApp = JSON.parse(sessionStorage.getItem(LOCAL_SESSION_STORAGE.BASELANGID)!);
    const appId = JSON.parse(localStorage.getItem(LOCAL_SESSION_STORAGE.SELECTED_APP_ID)!);
    const baseLangId = JSON.parse(sessionStorage.getItem(LOCAL_SESSION_STORAGE.USER_DATA)!).baseLangId;
    //Subject and Message.
    let data;
    this.versionService.getDescriptionData(baseLangId, appId).subscribe({
      next: (res: any) => {
        if (res) {
          this.descriptionArr = res.data?.filter((res: { categoryTypeId: number; }) => res.categoryTypeId == CONSTANTS.FMS_HTML);
          this.getHistory();
        } else {
          this.getHistory();
        }
      }
    });
  }

  /**
    * @function to search data in the grid
    * @returns void.
   */
  searchRecord() {
    if (!this.searchForm?.controls['endDate']?.value) {
      this.toast.show(CONSTANTS.DATE_MANDATORY, TOAST_TYPE.INFO)
      return
    }
    let search = this.searchForm.controls['searchedText'].value;
    let startDate = this.commonService.formatDate(this.searchForm.controls['startDate'].value)
    let endDate = this.commonService.formatDate(this.searchForm.controls['endDate'].value)
    this.versionService.searchVersionList(this.pageNo, this.paginationPageSize, startDate, endDate, search, 'history').subscribe({
      next: res => {
        if (res.status == RESPONSE.SUCCESS) {
          this.historyData = res?.data?.data?.filter((item: any) => item.id !== this.currentData?.id);
          this.totalRecords = res?.data?.totalRecords
          this.totalPages = Math.ceil(this.totalRecords / this.paginationPageSize);
        } else {
          this.toast.show(CONSTANTS.RECORD_NOT_FOUND, TOAST_TYPE.INFO);
          this.totalPages = 0;
          this.totalRecords = 0;
        }
      },
      error: (errorResponse: HttpErrorResponse) => {
        this.toast.show(CONSTANTS.ERROR, TOAST_TYPE.ERROR)
      }
    })
  }

  /**
    * @function to load data on server side pagination
    * @returns void.
   */
  onPageChange(event: PageEvent) {
    this.pageNo = event.pageIndex;
    this.pageNumber = event.pageIndex + 1;
    this.paginationPageSize = event.pageSize;
    this.totalPages = Math.ceil(this.totalRecords / this.paginationPageSize);
    this.searchRecord();
  }




  /**
    * @function to reset form
    * @returns void.
   */
  reset() {
    this.createSearchForm();
    this.historyData = this.masterData;
    this.totalRecords = this.masterData.length
  }

  /**
      * @function to change tab for current version and history
      * @returns void.
     */
  tabChanged(event: any) {
    this.tabIndex = event.index
  }

  /**
    * @function to function update current version api popup
    * @returns void.
   */
  close() {
    if (this.data['data'] == 'current') {
      this.versionService.updateCurrentVersion(this.currentData.versionNo).subscribe((res: any) => {
      })
    }
  }


  getDictionaryData() {
    let langId = parseInt(JSON.parse(sessionStorage.getItem(LOCAL_SESSION_STORAGE.USER_DATA)!).baseLangId);
    const appId = JSON.parse(localStorage.getItem(LOCAL_SESSION_STORAGE.SELECTED_APP_ID)!);
    let params = {
      'languageId': langId,
      'appId': 104,
      'dictionaryCodes': RELEASE_NOTES
    }
    this.commonService.getDictionaryByLangPanelDictIds(params).subscribe({
      next: (resp: any) => {
        if (resp.status === 'success') {
          this.labelAndButtonValue.version = resp?.data?.find((data: any) => data?.dictionaryCode == 64)?.value;
          this.labelAndButtonValue.releaseType = resp?.data?.find((data: any) => data?.dictionaryCode == 920)?.value;
          this.labelAndButtonValue.releaseDate = resp?.data?.find((data: any) => data?.dictionaryCode == 63)?.value;
          this.labelAndButtonValue.close = resp?.data?.find((data: any) => data?.dictionaryCode == 37)?.value;
          this.labelAndButtonValue.search = resp?.data?.find((data: any) => data?.dictionaryCode == 71)?.value;
          this.labelAndButtonValue.reset = resp?.data?.find((data: any) => data?.dictionaryCode == 102)?.value;
          this.labelAndButtonValue.versionType = resp?.data?.find((data: any) => data?.dictionaryCode == 111)?.value;
          this.labelAndButtonValue.noRecordFound = resp?.data?.find((data: any) => data?.dictionaryCode == 243)?.value;
          this.labelAndButtonValue.history = resp?.data?.find((data: any) => data?.dictionaryCode == 251)?.value;
          this.labelAndButtonValue.latestRelease = resp?.data?.find((data: any) => data?.dictionaryCode == 252)?.value;
          this.labelAndButtonValue.searchHistoryCategory = resp?.data?.find((data: any) => data?.dictionaryCode == 380)?.value;
        }
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
