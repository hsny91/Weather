import { HttpClient } from '@angular/common/http';
import { defer } from 'rxjs';
import { DailyWeather } from '../models/daily-weather';
import { Weather } from '../models/weather';
import { WeatherDescription } from '../models/weather-description';

import { WeatherService } from './weather.service';

export function asyncData<T>(data: T) {
  return defer(() => Promise.resolve(data));
}

describe('WeatherService', () => {
  let service: WeatherService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    service = new WeatherService(httpClientSpy);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return expectedLocationResult (HttpClient called)', (done: DoneFn) => {
    const expectedWeather: Weather[] = [
      {
        current: {
          temp: 1,
          weather: [{} as WeatherDescription],
        },
        daily: [{} as DailyWeather],
      },
    ];

    httpClientSpy.get.and.returnValue(asyncData(expectedWeather[0]));

    service
      .getMultipelWeatherData([
        { lat: 23, lon: 23, label: 'Luzern', detail: '6003' },
      ])
      .subscribe({
        next: (locationInfo) => {
          expect(locationInfo).toEqual(expectedWeather);
          done();
        },
        error: done.fail,
      });
    expect(httpClientSpy.get.calls.count()).toBe(1);
  });
});
