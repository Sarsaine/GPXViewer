import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';

@Injectable()
export class LocationService {

    public getCurrentLocation(): Observable<any> {
        return new Observable(obs => {
            navigator.geolocation.getCurrentPosition(pos => {
                obs.next(pos);
                obs.complete();
            }, (err) => throwError(err));
        });
    }
}
