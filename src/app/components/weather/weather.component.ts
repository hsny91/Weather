import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map, mergeMap, Observable} from 'rxjs';
import { LocationResult } from 'src/app/models/location-result';
import { LocationWeather } from 'src/app/models/location-weather';
import { ZipLocation } from 'src/app/models/zip-location';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { LocationService } from 'src/app/services/location.service';
import { WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css'],
})
export class WeatherComponent implements OnInit {
  locationInfo$!: Observable<ZipLocation>;
  weatherInfo$!: Observable<LocationWeather[]>;
  locationInfos: LocationWeather[] = [];

  constructor(
    private locationService: LocationService,
    private weatherService: WeatherService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getWeatherInfo();
  }

  removeZip(zipcode: string) {
    this.localStorageService.removeItem(zipcode);
    this.router.navigate(['/']);
    this.getWeatherInfo();
  }

  getWeatherInfo() {
    const zipcodes = this.localStorageService.getItems('zipcodes');
    this.weatherInfo$ = this.locationService
      .getMultipleLocationInfo(zipcodes)
      .pipe(
        mergeMap((locationInfos) => {
          const flattenedArray = this.flattenLocations(locationInfos);
          this.locationInfos = flattenedArray;
          const postions = this.getCityPositions(flattenedArray);
          return this.weatherService.getMultipelWeatherData(postions);
        }),
        map((weatherDatas) => {
          return this.locationInfos.map((city, idx) => {
            if (city) city.weather = weatherDatas[idx];
            return city;
          });
        })
      );
  }

  start(zipcode: string) {
    this.localStorageService.setItem(zipcode);
    this.getWeatherInfo();
  }

  flattenLocations(locations: LocationResult[]) {
    return locations
      .map((item) => item?.results)
      .filter((res) => res?.length)
      .flat(2);
  }

  getCityPositions(locations: LocationWeather[]) {
    return locations.map((location) => ({
      lat: location?.attrs.lat,
      lon: location?.attrs.lon,
      label: location?.attrs.label,
    })) as ZipLocation[];
  }
}
