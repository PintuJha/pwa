import { Component, OnInit } from '@angular/core';
import { CONSTANTS, PATH } from '../../shared/constants/constans';
import { HttpService } from 'src/app/core/services/http.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagenotfound',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagenotfound.component.html',
  styleUrls: ['./pagenotfound.component.scss']
})
export class PagenotfoundComponent implements OnInit {

  errorMessage: string = CONSTANTS.PAGE_NOT_FOUND

  constructor(private httpService: HttpService) { }

  ngOnInit(): void {
  }

  // to get data and redirect url from okta
  getParam(): void {
    const urlParams = new URLSearchParams(window.location.href).toString();
    console.log(urlParams);
    const url = decodeURIComponent(
      urlParams
    );
    if (urlParams.includes('id_token')) {
      const idToken = url.split("id_token=")[1].split("&")[0];
      const param = { token: idToken };

      this.httpService.getDataWithParams(PATH.GET_OKTA_DATA, param).subscribe({
        next: (resp) => {
          const newUrl = resp.redirectUrl;
          window.location.href = newUrl;
        },
      });
    }
  }

}
