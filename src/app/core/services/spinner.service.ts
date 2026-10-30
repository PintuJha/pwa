import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  // Spinner loading state.
  private loading: boolean = false;

  constructor() { }

  /**
   * @function to set loading state for spinner.
   * @param loading.
   * @returns void.
   */
  setLoading(loading: boolean): void {
    this.loading = loading;
  }

  /**
   * @function to capture spinner loading state.
   * @returns boolean;
   */
  getLoading(): boolean {
    return this.loading;
  }

}
