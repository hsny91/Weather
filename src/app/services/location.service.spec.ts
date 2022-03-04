import { HttpClient } from '@angular/common/http';
import { defer } from 'rxjs';
import { LocationResult } from '../models/location-result';
import { Weather } from '../models/weather';
import { ZipLocation } from '../models/zip-location';

import { LocationService } from './location.service';

export function asyncData<T>(data: T) {
  return defer(() => Promise.resolve(data));
}

describe('LocationService', () => {
  let service: LocationService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    service = new LocationService(httpClientSpy);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return expectedLocationResult (HttpClient called)', (done: DoneFn) => {
    const expectedLocationResult: LocationResult[] = [
      {
        results: [
          {
            attrs: {} as ZipLocation,
            weather: {} as Weather,
          },
        ],
      },
    ];

    httpClientSpy.get.and.returnValue(asyncData(expectedLocationResult[0]));

    service.getMultipleLocationInfo(['4500']).subscribe({
      next: (zipInfo) => {
        expect(zipInfo).toEqual(expectedLocationResult);
        done();
      },
      error: done.fail,
    });
    expect(httpClientSpy.get.calls.count()).toBe(1);
  });
});
