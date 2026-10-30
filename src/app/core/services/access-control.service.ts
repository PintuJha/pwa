import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccessControlService {
  private accessMap: Map<string, boolean> = new Map([
    ["Add", true],
    ["Edit", true],
    ["Delete", true],
    ["Reports", true],
    ["Copy", true]
  ]);

  getAccess(level: string): boolean {
    return this.accessMap.get(level) || false;
  }

  setAccess(level: string, value: boolean): void {
    this.accessMap.set(level, value);
  }
}
