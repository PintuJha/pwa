import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { ChangePasswordDTO } from 'src/app/shared/model/change-password-Dto';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {

  constructor(private httpService: HttpService) { }

  onSavePassword(payload: any) {
    return this.httpService.postData('updateChangePassword', payload);
  }

  getPasswordPolicyList(changePasswordDTO: ChangePasswordDTO) {
    return this.httpService.getDataWithParams('doGetPasswordPolicy', changePasswordDTO);
  }
}
