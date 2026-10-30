import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TOAST_TYPE } from '../../shared/constants/constans';

//Just add the new required types here and TypeScript will require the public consumer to pass a valid type.
export type SnackBarType = TOAST_TYPE.ERROR | TOAST_TYPE.SUCCESS | TOAST_TYPE.WARNING | TOAST_TYPE.INFO;

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private snackbar: MatSnackBar, private zone: NgZone) { }

  /**
   * @service to initiate MAT-SNACKBAR.
   * @param message.
   * @param type.
   * @returns void.
   */
  show(message: string, type: SnackBarType): void {
    this.zone.run(() => {
      this.snackbar.open(
        message, 'x', {
        panelClass: ['snackbar-container', type],
        verticalPosition: 'top',
        horizontalPosition: 'center',
        duration: 3000
      },
      );
    });
  }
}