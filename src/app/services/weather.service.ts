import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, forkJoin, Observable, throwError } from 'rxjs';
import { Weather } from '../models/weather';
import { ZipLocation } from '../models/zip-location';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  apiUrl: string =
    'https://api.openweathermap.org/data/2.5/onecall?&exclude=hourly,minutely,hourly,alerts&appid=1207975b9b4890068b6221a1bf3f3ae5&units=metric';

  constructor(private http: HttpClient) {}

  getMultipelWeatherData(locations: ZipLocation[]): Observable<Weather[]> {
    const urls = locations.map(
      (location) => `${this.apiUrl}&lat=${location?.lat}&lon=${location?.lon}`
    );
    const observables = urls.map((a) => this.http.get<Weather>(a));
    return forkJoin(observables).pipe(catchError(this.handleWeatherError));
  }

  handleWeatherError(error: HttpErrorResponse) {
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
      () => 'Something bad happened in Weather Api; please try again later.'
    );
  }
}
