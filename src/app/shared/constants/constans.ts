export enum CONSTANTS {
   UNAUTHORIZED = 'UNAUTHORIZED',
   INVALID_USER_ID = 'Invalid user id',
   DATE_MANDATORY = 'End Date is Mandatory',
   INVALID_LOGIN_CREDENTIALS = 'Invalid login credentials',
   WRONG_USERNAME_PASSWORD = 'You have entered wrong username or password',
   PAGE_NOT_FOUND = "Page Not Found",
   AG_GRID_THEME = "ag-theme-quartz",
   SUCCESS = 'Operation Completed Successfully.',
   RECORD_NOT_FOUND = 'Record not found.',
   DIALOG_BOX_CLOSE_MESSAGE = 'Are you sure want to close? You will loose your unsaved data!',
   YES = 'Yes',
   NO = 'No',
   SAVE = 'Save',
   NO_CHANGES_TO_SAVE = 'No changes to Save.',
   DELETE_RECORD_CONCENT = 'Are you sure you want to delete this record?',
   INPUT_BOX_EMPTY = "Mandatory field cannot be left blank.",
   POLICY = 'Please accept the policy to proceed.',
   CONFIGURETHEPOLICY = 'Policy is not configured.',
   ERROR = "ERROR",
   TEMP_PWD_ALERT = "Temporary password is already generated. Kindly login through mail.",
   APPNOTASSIGNED = 'Role is not assigned to user',
   HTML = 3,
   FMS_HTML = 441,
   TEMP_PWD_VALIDATION = 'Enter the valid temporary password',
   POLICY_IS_NOT_VALID = 'Policy is not valid',
   ADM_PANEL_APP_ID = '104',
   APS_APP_ID = "438",
   APS_UNIT_ID = "2",
   UNIT_ID = "1",
   ADM_APP_ID = 104,
   DEFAULT_LANG_ID = 1,
   DEFAULT_UNIT_ID = 1,
   BSP_APP_CLIENTSECRET_KEY = "fj4YSDx9r5JxdnR2J5u7oQ==",
   ERROR_OCCURED_IN_OPERATION = 'An error occurred while processing your request.',
   UPLOAD_FAILURE_NOTIFICATION = 'Upload unsuccessful. Details have been sent to your email.',
   PERMISSION_DENIED_CONTACT_ADMIN = 'Permission denied. Please contact admin.',
   DEFAULT_GO_LIVE_DATE = "1598918400",
   FMS_PANEL_APP_ID = 438,
   DOC_TYPE_MST = "Doc_Type_Mst",
   ANNEXURE_1 = 'Annexure-1',
   ANNEXURE_2 = 'Annexure-2',
   ANNEXURE_7 = 'Annexure-7',
   ANNEXURE_8 = 'Annexure-8',
   NAME = 'Name',
   BANK_NAME = 'Name of Bank',
   LENDER_NAME = 'Name of Lender',
   DATE_FORMATE = 'DD-MM-YYYY',
   SUCCESSFULL = "SUCCESS",
   DATE_TYPE = "Date_Type",
   DOC_CATEGORY = "CM_Doc_category",
   DOC_UPLOAD_STATUS = "CD_Doc_Upload_Status",
   DEFAULT_YEAR_TYPE = "CALENDAR",
   FINANCIAL_YEAR_TYPE = "FINANCIAL",
}
export enum ERROR_CODES {
   SUCCESS = "0006",
   VERIFIED_STATUS = "0005",
   UNAUTHORIZED = 401,
   ISSUCCESS = 'success',
}

export enum ROLES {
   CORPORATE_TEAM = "Corporate Team",
   DIVISION_USER = "division debt position user group",
   FUNDFLOW_USER = "Division Fundflow_ICD_BSS User Group",
}


export enum AG_GRID_THEME {
   AG_THEME_QUARTZ = "ag-theme-quartz"
}

export enum RESPONSE {
   SUCCESS = "success",
   ERROR = "error"
}

export enum URL {
   ADM_BASE_URL = 'http://localhost:7079/',
}

export enum PATH {
   LOGIN = 'login',
   GET_DEVICE_MASTER = 'api/deviceMaster',
   GET_MENUDETAILS = 'getMenuList',
   GET_CONFIGDETAILS = 'getConfigList',
   GET_MENU = 'getMainMenu',
   GET_SUBMENU = 'getSubMenu',
   GET_NESTEDMENU = 'getNestedMenu',
   CHECKISPOLICYACCEPTED = 'isPolicyAccepetedCheck',
   GET_POLICY_DETAILS = 'getPolicyDetails',
   UPDATE_POLICY_DETAILS = 'updatePolicyAcceptanceDetails',
   LAST_VISITEDTIME = 'lastvisitedtime',
   LOGOUT = 'logout1',
   CAPTCHA = 'getCaptcha',
   GET_ALL_LANGUAGE_COMBO = "getAllLanguageCombo",
   UPDATE_PREFFERED_LANGUAGE = 'updateUserPrefferedLanguage',
   GET_OKTA_DATA = 'getOctaData',
   GENERATE_PASSWORD = 'temppwd',
   GET_GENERATE_EXPIRE_TIME = 'getGenerateExpireTime',
   GET_WHITE_LABEL_DATA = 'whitelabel/get/data',

};

export enum APS_PATHS {
   GET_GROUP_DIVISION_LIST = 'get-group-division-list',
   GET_DATE_WISE_UPLOADED_FILE_LIST = 'api/fmsCommonApi/getWorkingDays',
   GET_DAILY_DEBT_POSITION_LIST_DATA = 'api/dailyUploadView/getDailyDebtPositionListData',
   GET_TAB_WISE_ANNEXURE_DETAILS = 'api/allAnnexureSummary/getTabWiseAnnexureDetails',
   DOWNLOAD_ANNEXURE_SUMMARY_EXCEL = 'api/allAnnexureSummary/downloadAllAnnexureSummaryExcel',
   GET_CODE_MASTER_BY_CODE_MASTER_NAME = 'api/fmsCommonApi/getCodeMasterByCodeMasterName',
   GET_COMMON_VALUES_BY_COMMON_MASTER_NAME = 'api/fmsCommonApi/getCommonMasterByCommonMasterName',
   GET_ALL_REUPLOAD_DATA = 'api/reUpload-approval-screens/get/all-pending-data',
   GET_DEBT_POSITION_COMPARISON = 'api/debtPositionComparison/getDebtPositionComparisonData',
   UPDATE_APPROVAL_REQUEST = 'api/reUpload-approval-screens/process-approval',
   GET_FUND_FLOW_DASHBOARD_DETAILS = 'api/fundFlowDashboard/getFundflowDashboardDetails',
   GET_CONSOLIDATED_FUND_FLOW_DASHBOARD_DETAILS = 'api/consolidatedFundFlowDashboard/getConsolidatedFundflowDashboardDetails',
   GET_WORKING_CAPITAL_LIMIT_DATA = 'api/workingCapitalLimit/getWorkingCapitalLimitData',
   GET_CONSOLIDATED_BANK_STOCK_STATEMENT_DASHBOARD_DETAILS = 'api/consolidatedBankStockStatementDashboard/getConsolidatedBankStockStatementDashboardDetails',

   GET_MONTHLY_DEBT_POSITION_LIST_DATA = 'api/monthWiseUploadView/getMonthWiseTabListData',
   GET_CONSOLIDATED_FUND_FLOW_SCO_DASHBOARD_DETAILS = 'api/consolidatedFundFlowScoDashboard/getConsolidatedFundflowScoDashboardDetails',

}

export enum SERVER_PATHS {
   DEV = '/',
};

export enum DATE_FORMAT {
   DATE = 'DD-MMM-YYYY',
   YEAR = 'YYYY'
};

export enum LOCALE {
   EN_US = 'en-US'
};

export enum LOCAL_SESSION_STORAGE {
   USER_DATA = 'BSP_userdata',
   BASELANGID = 'BSP_baseLangId',
   USER_EMAIL = 'BSP_email',
   USER_ID = 'BSP_userId',
   TOKEN = 'BSP_token',
   PREFERREDLANG = 'BSP_preferredLang',
   CONTINUESESSION = 'BSP_continueSession',
   APP_DATE_FORMAT = 'BSP_APP_DATE_FORMAT',
   SESSIONEXPIRED = 'BSP_sessionExpired',
   LOGOUTSESSION = 'BSP_logoutSession',
   CLOSE_SINGLE_ACTION_DIALOG = 'BSP_closeSingleActionDialog',
   SHOW_EXPIRY_DIALOG = 'BSP_showExpiryDialog',
   EXPIRY_TIME = 'BSP_expiryTime',
   IS_SUPER_ADMIN = 'BSP_isSuperAdmin',
   SWITCH_TO_ADMIN = 'BSP_switchToAdmin',
   SELECTED_APP_ID = 'BSP_selectedAppId',
   SELECTED_UNIT_ID = 'BSP_selectedUnitId',
   LOGOUT = 'BSP_logout',
   SELECTED_MENU_ID = 'BSP_selectedMenuId',
   ADD_ACCESS = 'BSP_addAccess',
   EDIT_ACCESS = 'BSP_editAccess',
   DELETE_ACCESS = 'BSP_deleteAccess',
   CURRENT_VERSION = 'BSP_currentVersion',
   ADMIN_REDIRECT_URL = 'BSP_adminRedirectUrl',
   CDP_URL = 'BSP_cdpUrl',
   DICTIONARY_WS_URL = 'BSP_dictionaryWSUrl',
   API_URL = 'BSP_apiUrl',
   FLOW = 'flow',
   PANELID = 'BSP_panelId',
   TEMP_PWD_GENERATED = 'BSP_tempPwdGenerated',
   BSP_selectedAppId = "BSP_selectedAppId",
   POLICY_PREFFERED_LANG = 'BSP_policyPrefferedLang',
   IDLE_TIMEOUT = "BSP_idleTimeoutTime",
   TIME_BEFORE_TOKEN_EXPIRY = "BSP_timeBeforeTokenExpiry",
   USER_ACTIVE = "BSP_userActive",
   GO_LIVE_DATE = "FMS_Go_Live_Date",
}

export enum TOAST_TYPE {
   SUCCESS = 'success',
   ERROR = 'error',
   WARNING = 'warning',
   RECORD_SAVED = 'Record Saved Successfully',
   INFO = 'info',
}



export enum REUPLOAD_STATUS {
   PENDING = 'Approval in Progress',
   APPROVE = 'Approved',
   REJECT = 'Rejected',
}
export const DASHBOARD_DICT = [
   "70", "187"
]

export const RELEASE_NOTES = ['64',
   '920',
   '63',
   '37',
   '71',
   '102',
   '111',
   '243',
   '251',
   '252',
   '380', '29', '37', '75', '76', '83', '102', '238', '111', '250', '251', '787', '287', '278', '785', '786', '763', '545', '788'];

export const CHANGE_PASSWORD = [685, 686, 687, 36, 37, 693, 694, 695, 696, 697, 698, 699, 703, 236, 730, 737, 729, 730, 731, 732, 733, 734, 735, 736, 304, 297, 298, 915, 1092, 299, 300, 301, 302, 1261, 1296, 1297, 1298, 1300, 42, 1291, 1337, 1091, 1090, 1347];

export const POLICY = [
   1240, 1241, 1242, 1283, 1294, 1295
]

export const LOGIN_COMPONENT_DICTIONARIES = [
   1330, 1337, 1296, 1303, 1302, 1304, 1305, 1306, 1307, 42, 503, 1308, 1309, 1310, 132, 133, 1311, 1312, 1313, 471, 1061, 1314, 1063, 1315, 1316, 1317, 1318, 1319, 1320, 1321, 1322, 1323, 1324, 1294, 1325, 1326, 1327, 1328, 1089, 847, 305, 1329, 1330, 1331, 1064, 1063, 1062, 1061, 1332, 1333, 173
]

export enum PROFILE_IMAGE_CONSTANT {
   PROFILE_IMAGE_BASE_URL = 'https://oneappscoreservice.motherson.com/GlobalApps/GetUserProfilePicture?userid=MIND\\'
}

export const DAILY_DEBT_POSITION_DICTIONARIES = [
   1480, 1464, 1542, 1543, 1540, 1544, 1546, 1545, 1547, 1536, 1548, 1549, 1537, 1550, 1551, 1538, 1539, 1494, 1456, 1495, 1496, 1497, 1498, 1499, 1500, 1501, 1502, 1503, 1504, 1505, 1506, 1507, 1508, 1509, 1510, 1511, 1512, 1513, 1514, 1454, 1515, 1535, 1516, 1517, 1518, 1519, 1520, 1521, 1522, 1523, 1524, 1534, 1525, 1526, 1527, 1528, 1529, 1523, 1530, 1531, 1532, 1533,
]

export const DEBT_COMPARISON_DICTIONARIES = [
   1554, 1517, 1519, 1464, 1467, 1494, 1552, 1553, 1518, 1480
]

export const FUND_FLOW_DASHBOARD_DICTIONARIES = [
   1567, 1560, 1561, 1562, 1563, 1564, 1565, 1566, 1480, 1464, 1542, 1543, 1540, 1544, 1546, 1545, 1547, 1536, 1548, 1549, 1537, 1550, 1551, 1538, 1539, 1494, 1456, 1495, 1496, 1497, 1498, 1499, 1500, 1501, 1502, 1503, 1504, 1505, 1506, 1507, 1508, 1509, 1510, 1511, 1512, 1513, 1514, 1454, 1515, 1535, 1516, 1517, 1518, 1519, 1520, 1521, 1522, 1523, 1524, 1534, 1525, 1526, 1527, 1528, 1529, 1523, 1530, 1531, 1532, 1533,
]


