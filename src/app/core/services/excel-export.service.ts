import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { LOCAL_SESSION_STORAGE } from 'src/app/shared/constants/constans';

@Injectable({
  providedIn: 'root'
})
export class ExcelExportService {

  constructor(private configService: ConfigService, private http: HttpClient) { }

  excelExport(data: any) {
    let apiBaseUrl = this.configService.appConfig;
    let authKey = localStorage.getItem(LOCAL_SESSION_STORAGE.TOKEN);
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: authKey!,
      }),
      responseType: 'blob' as 'json',
    };
    return this.http.post(`${apiBaseUrl}/generate/excel/single/sheet`,
       data,
      httpOptions
      );
  }
}
