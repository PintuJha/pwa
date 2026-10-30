import { Injectable } from '@angular/core';
import { HttpService } from '../../core/services/http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageSimulatorService {

  constructor(private http: HttpService) { }

  sendSMS(mobile: number, messageType: boolean, msgBody: any): Observable<any>{

    const param = {'sendTo': mobile, 'quickFlag': messageType, 'message' : msgBody}
    return this.http.postData('sms/process', param);
  }

  sendTeamsMsg(recieverId:any, message:any){
    const param = {'recieverId': recieverId, 'message': message}
    return this.http.postData('send/message/msteams', param);
  }

  getAllTemplates(langId:string, panelId: string): Observable<any> {
    const param = {'panelTypeId': panelId, 'langId': langId}
    return this.http.getDataWithParams('template/data', param );
}
}
