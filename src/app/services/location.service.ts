import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, forkJoin, Observable, throwError } from 'rxjs';
import { LocationResult } from '../models/location-result';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  apiUrl: string =
    'https://api3.geo.admin.ch/rest/services/api/SearchServer?type=locations&origins=zipcode&searchText=';

  constructor(private http: HttpClient) {}

  getMultipleLocationInfo(zipcodes: string[]): Observable<LocationResult[]> {
    const urls = zipcodes.map((zip) => `${this.apiUrl}${zip}`);
    const observables = urls.map((url) => this.http.get<LocationResult>(url));
    return forkJoin(observables).pipe(catchError(this.handleLocationError));
  }

  handleLocationError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('error:' + error.error.message);
    } else {
      switch (error.status) {
        case 404:
          console.error('Not Found');
          break;
        case 403:
          console.error('Access Denied');
          break;
        case 500:
          console.error('Interval Server');
          break;
        default:
          console.error('An unknown error occurred.');
      }
    }
    return throwError(
      () => 'Something bad happened in Location Api; please try again later.'
    );
  }
}
