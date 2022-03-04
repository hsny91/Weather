import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, mergeMap, Observable } from 'rxjs';
import { Location } from '@angular/common';
import { LocationResult } from 'src/app/models/location-result';
import { LocationWeather } from 'src/app/models/location-weather';
import { ZipLocation } from 'src/app/models/zip-location';
import { LocationService } from 'src/app/services/location.service';
import { WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-weather-forecast',
  templateUrl: './weather-forecast.component.html',
  styleUrls: ['./weather-forecast.component.css'],
})
export class WeatherForecastComponent implements OnInit {
  zipcode: any[] = [];
  dailyWeather$!: Observable<LocationWeather[]>;
  cityInfos!: LocationWeather[];

  constructor(
    private weatherService: WeatherService,
    private locationService: LocationService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getDailyWeather();
  }

  backToMainPage() {
    this.location.back();
  }

  getDailyWeather() {
    this.zipcode.push(this.route.snapshot.paramMap.get('zip'));
    this.dailyWeather$ = this.locationService
      .getMultipleLocationInfo(this.zipcode)
      .pipe(
        mergeMap((cityInfos) => {
          const flattenedArray = this.flattenCities(cityInfos);
          this.cityInfos = flattenedArray;
          const postions = this.getCityPositions(flattenedArray);

          return this.weatherService.getMultipelWeatherData(postions);
        }),
        map((weatherDatas) => {
          return this.cityInfos.map((city, idx) => {
            if (city) city.weather = weatherDatas[idx];
            return city;
          });
        })
      );
  }

  flattenCities(locations: LocationResult[]) {
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
