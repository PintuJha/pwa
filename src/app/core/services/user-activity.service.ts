import { Injectable, NgZone } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { LOCAL_SESSION_STORAGE } from 'src/app/shared/constants/constans';

@Injectable({
    providedIn: 'root'
})
export class UserActivityService {
    private activitySubject = new Subject<boolean>();
    private idleTime = 1200 * 1000; // 20 minutes
    private timeoutId: any;

    constructor(private ngZone: NgZone) {
        this.idleTime = Number(localStorage.getItem(LOCAL_SESSION_STORAGE.IDLE_TIMEOUT)) * 1000;
    }

    monitorUserActivity(): Observable<boolean> {
        this.resetTimer();
        this.ngZone.runOutsideAngular(() => {
            window.addEventListener('mousemove', this.activityDetected, true);
            window.addEventListener('keydown', this.activityDetected, true);
            window.addEventListener('click', this.activityDetected, true);
            window.addEventListener('touchstart', this.activityDetected, true);
            window.addEventListener('keypress', this.activityDetected, true);
            window.addEventListener('touchmove', this.activityDetected, true);
            window.addEventListener('MSPointerMove', this.activityDetected, true);
            window.addEventListener('DOMMouseScroll', this.activityDetected, true);
            window.addEventListener('scroll', this.activityDetected, true);
        });

        return this.activitySubject.asObservable().pipe(debounceTime(50)); // Emit values after a short delay
    }


    private activityDetected = (): void => {
        this.activitySubject.next(true); // User is active
        this.resetTimer();
    };

    public resetTimer(): void {
        clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(() => {
            this.activitySubject.next(false); // User is idle
        }, this.idleTime);
    }


    stopMonitoring(): void {
        window.removeEventListener('mousemove', this.activityDetected, true);
        window.removeEventListener('keydown', this.activityDetected, true);
        window.removeEventListener('click', this.activityDetected, true);
        window.removeEventListener('touchstart', this.activityDetected, true);
        window.removeEventListener('scroll', this.activityDetected, true);
        window.removeEventListener('keypress', this.activityDetected, true);
        window.removeEventListener('touchmove', this.activityDetected, true);
        window.removeEventListener('MSPointerMove', this.activityDetected, true);
        window.removeEventListener('DOMMouseScroll', this.activityDetected, true);
        clearTimeout(this.timeoutId);
    }
}
