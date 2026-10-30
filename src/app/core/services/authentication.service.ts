import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { HttpService } from './http.service';
import { ConfigService } from './config.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from '../../shared/model/authConfig'
import { LOCAL_SESSION_STORAGE, PATH, TOAST_TYPE } from 'src/app/shared/constants/constans';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  apiBaseUrl: string;

  private configValueSubject = new BehaviorSubject<string | null>(null);
  public configValue$: Observable<string | null> = this.configValueSubject.asObservable();

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private oauthService: OAuthService,
    private httpservice: HttpService,
    private toast: ToastService
  ) {
    this.apiBaseUrl = this.configService.appConfig;
    this.getParam();
  }
  setConfigValue(value: string) {
    this.configValueSubject.next(value);
  }
  /**
  * @function to verify domain user
  * @param email
  * @returns observable
  */
  verifyUser(email: string): Observable<any> {
    let payload = {
      username: email
    }
    this.apiBaseUrl = this.configService.appConfig;
    return this.http.post<any>(`${this.apiBaseUrl}/validateUserId`, payload)
      .pipe(map((data) => {
        if (data.message == "Domain user.") {
          this.loginImplicit();
        } else if (data.messageCode == 1065) {
          sessionStorage.setItem(LOCAL_SESSION_STORAGE.USER_EMAIL, JSON.stringify(data.data.email));
          return data
        } else if (data.messageCode == 1062) {
          this.toast.show("User account is locked contact your administartor", TOAST_TYPE.INFO);
        }
        else {
          return data;
        }
      }));
  }

  /**
   * @function to send user details to server
   * @param username
   * @param password
   * @returns user details and access token
   */
  login(username: string, password: string, userId: string) {

    let payload = {
      username: username,
      password: password,
      userId: userId
    };

    return this.http.post<any>(`${this.apiBaseUrl}/login`, payload)
      .pipe(
        map((data: any) => {
          if (data.messageCode == '1510') {
            // Proceed only if status is '0006'
            sessionStorage.setItem(LOCAL_SESSION_STORAGE.USER_DATA, JSON.stringify(data.data));
            sessionStorage.setItem(LOCAL_SESSION_STORAGE.USER_ID, JSON.stringify(data.data?.userId));
            sessionStorage.setItem(LOCAL_SESSION_STORAGE.TOKEN, JSON.stringify(data.data?.token));
            sessionStorage.setItem(LOCAL_SESSION_STORAGE.PREFERREDLANG, JSON.stringify(data.data?.baseLangId));
            sessionStorage.setItem(LOCAL_SESSION_STORAGE.BASELANGID, JSON.stringify(data.data?.baseLangId));

            localStorage.setItem(LOCAL_SESSION_STORAGE.USER_DATA, JSON.stringify(data.data));
            localStorage.setItem(LOCAL_SESSION_STORAGE.USER_ID, JSON.stringify(data.data?.userId));
            localStorage.setItem(LOCAL_SESSION_STORAGE.TOKEN, JSON.stringify(data.data?.token));
            localStorage.setItem(LOCAL_SESSION_STORAGE.PREFERREDLANG, JSON.stringify(data.data?.baseLangId));
            localStorage.setItem(LOCAL_SESSION_STORAGE.BASELANGID, JSON.stringify(data.data?.baseLangId));

            return data;
          }
          else {
            return data;
          }
        }),
        catchError(error => {
          console.error('Error occurred:', error);
          return of(null); // or you can return throwError(error) if you want to propagate the error
        })
      );

  }

  /**
   * @function check if access token is stored in browser
   *  @returns access token
   */
  isLoggedIn() {
    // let userToken = JSON.parse(sessionStorage.getItem(LOCAL_SESSION_STORAGE.TOKEN)!);
    let userToken = localStorage.getItem(LOCAL_SESSION_STORAGE.TOKEN)!;

    if (userToken == null) {
      const tokenString = localStorage.getItem(LOCAL_SESSION_STORAGE.TOKEN);
      if (tokenString) {
        userToken = JSON.parse(tokenString);
      }
    }
    if (!userToken) {
      return false;
    } else {
      return this.http.post(this.apiBaseUrl + `/validateToken`, userToken);
    }
  }

  /**
  * @function encrypting password into binary
  * @param oldPassword
  * @returns encrypted password
  */
  encryptPassword(oldPassword: string): string {
    var newPassword: string = "";
    var length = oldPassword.length;
    var newPassword: string = "";
    var temp: number[] = new Array(length);
    var i: number = 0;
    var ran: number = (Math.floor(Math.random() * 256) + 1);
    var ch;

    for (i = 0; i < length; i++) {
      ch = oldPassword.charCodeAt(i) //charAt(i);
      temp[i] = parseInt("" + ch);

      if ((temp[i] >= 0) && (temp[i] < 64))
        temp[i] += 128;
      else if ((temp[i] >= 64) && (temp[i] < 128))
        temp[i] += 128;
      else if ((temp[i] >= 128) && (temp[i] < 192))
        temp[i] -= 128;
      else if ((temp[i] >= 192) && (temp[i] < 256))
        temp[i] -= 128;
      temp[i] += ran;
      newPassword += this.convertToBoolean(temp[i]);
    }
    newPassword += this.convertToBoolean(ran);
    return newPassword;
  }

  //Function to convert number in binary format.
  convertToBoolean(intcode: number) {
    var num: number = intcode;
    var quot: any;
    var div: number = 2;
    var rem: any;
    var temp: number[] = new Array(9);
    var temp2: number[] = new Array(9);
    var len: number = temp.length;
    var str: string = "";
    var k: number = 0;
    for (k = 0; num != 0; k++) {
      quot = num / div;
      quot = parseInt(quot);
      rem = num % div;
      rem = parseInt(rem);
      temp[k] = rem;
      num = quot;
    }

    for (let i = k; i < len; i++)
      temp[i] = 0;

    for (let i = len - 1, j = 0; i >= 0; i--, j++) {
      temp2[j] = temp[i];
    }

    for (let i = 0; i < len; i++)
      str += temp2[i];
    return str;
  }

  encryptPasswordWithoutRandom(oldPassword: string): string {
    var newPassword: string = "";
    var length = oldPassword.length;
    var temp: number[] = new Array(length);
    var i: number = 0;
    var ch;

    for (i = 0; i < length; i++) {
      ch = oldPassword.charCodeAt(i);
      temp[i] = parseInt("" + ch);

      if ((temp[i] >= 0) && (temp[i] < 64))
        temp[i] += 128;
      else if ((temp[i] >= 64) && (temp[i] < 128))
        temp[i] += 128;
      else if ((temp[i] >= 128) && (temp[i] < 192))
        temp[i] -= 128;
      else if ((temp[i] >= 192) && (temp[i] < 256))
        temp[i] -= 128;

      newPassword += this.convertToBoolean(temp[i]);
    }
    return newPassword;
  }

  registerSuccessfulLogin(
    email: string,
    token: string,
    domain: string,
    userId: number
  ) {
    sessionStorage.setItem(LOCAL_SESSION_STORAGE.USER_DATA, JSON.stringify({
      'email': email,
      'token': token,
      'username': email,
      'userId': userId,
      'domain': domain,
    }));
    sessionStorage.setItem(LOCAL_SESSION_STORAGE.TOKEN, JSON.stringify(token))

    localStorage.setItem(LOCAL_SESSION_STORAGE.USER_DATA, JSON.stringify({
      'email': email,
      'token': token,
      'username': email,
      'userId': userId,
      'domain': domain,
    }));
    localStorage.setItem(LOCAL_SESSION_STORAGE.TOKEN, JSON.stringify(token))


  }

  afterLoginUserDetail(userId: number) {
    const httpParams = new HttpParams()
      .set('userId', userId);
    this.apiBaseUrl = this.configService.appConfig;
    const encodedUrl = encodeURI(`${this.apiBaseUrl}/afterLoginUserDetails`);
    return this.http.
      get(encodedUrl, { params: httpParams })
      .pipe(
        map(res => {
          sessionStorage.setItem(LOCAL_SESSION_STORAGE.USER_DATA, JSON.stringify(JSON.parse(JSON.stringify(res)).body.data));
          sessionStorage.setItem(LOCAL_SESSION_STORAGE.PREFERREDLANG, JSON.stringify(JSON.parse(JSON.stringify(res)).body.data.baseLangId));
          sessionStorage.setItem(LOCAL_SESSION_STORAGE.BASELANGID, JSON.parse(JSON.stringify(res)).body.data.baseLangId);
          sessionStorage.setItem(LOCAL_SESSION_STORAGE.SELECTED_APP_ID, JSON.parse(JSON.stringify(res)).body.selectedAppId);
          localStorage.setItem(LOCAL_SESSION_STORAGE.SWITCH_TO_ADMIN, (JSON.parse(JSON.stringify(res)).body.data.userDetails.switchToAdmin) ? "ENABLED" : "DISABLED");
          localStorage.setItem(LOCAL_SESSION_STORAGE.USER_DATA, JSON.stringify(JSON.parse(JSON.stringify(res)).body.data));
          localStorage.setItem(LOCAL_SESSION_STORAGE.PREFERREDLANG, JSON.stringify(JSON.parse(JSON.stringify(res)).body.data.baseLangId));
          localStorage.setItem(LOCAL_SESSION_STORAGE.BASELANGID, JSON.parse(JSON.stringify(res)).body.data.baseLangId)
          localStorage.setItem(LOCAL_SESSION_STORAGE.SELECTED_APP_ID, JSON.parse(JSON.stringify(res)).body.data.userDetails.selectedAppId);
          return JSON.stringify(JSON.parse(JSON.stringify(res)).body);
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(error.error.message);
        })
      );
  }

  /**
   * @service to get captcha value.
   * @returns Observable
   */
  getCaptcha(): Observable<any> {
    this.apiBaseUrl = this.configService.appConfig;
    return this.http.get(`${this.apiBaseUrl}/${PATH.CAPTCHA}`);
  }

  async loginImplicit() {
    authConfig.redirectUri = this.configService.oktaRedirectUri;
    this.oauthService.configure(authConfig);
    this.oauthService.initImplicitFlow();
    await this.oauthService.loadDiscoveryDocument();
    sessionStorage.setItem(LOCAL_SESSION_STORAGE.FLOW, 'implicit');
    this.oauthService.initLoginFlow('/some-state;p1=1;p2=2?p3=3&p4=4');
  }

  getParam() {
    const urlParams = new URLSearchParams(window.location.href).toString();
    const url = decodeURIComponent(
      urlParams
    );

    if (url.includes('id_token')) {
      const token = url.split('=')[1].split('&')[0];
      const param = { token: token };
      this.httpservice.getDataWithParams(PATH.GET_OKTA_DATA, param).subscribe({
        next: (resp) => {
          const newUrl = resp.redirectUrl;
          window.location.href = newUrl;
        },
      });
    }
  }
}
