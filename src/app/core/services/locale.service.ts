import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocaleService {

  constructor() { }

  getLocale(): string {
    return navigator.language || 'en-US';
  }
}
