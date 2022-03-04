import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AppModule } from 'src/app/app.module';
import { LocationService } from 'src/app/services/location.service';
import { WeatherService } from 'src/app/services/weather.service';

import { WeatherForecastComponent } from './weather-forecast.component';

describe('WeatherForecastComponent', () => {
  let component: WeatherForecastComponent;
  let fixture: ComponentFixture<WeatherForecastComponent>;
  let route: ActivatedRoute;
  let location: Location;

  let ZIPS: string[] = [];
  const locationService = {
    getMultipleLocationInfo: () =>
      of([
        {
          results: [
            {
              id: 3156,
              weight: 100,
              attrs: {
                detail: '6003',
                lat: 47.05450439453125,
                label: '<b>6003 - Luzern (LU)</b>',
              },
            },
          ],
        },
      ]),
  };
  const weatherService = {
    getMultipelWeatherData: () =>
      of([
        {
          lat: 47.0545,
          lon: 8.3092,
          current: {
            temp: 1.44,
            feels_like: 1.44,
            weather: [
              {
                id: 800,
                main: 'Clear',
                description: 'clear sky',
                icon: '01n',
              },
            ],
          },
          daily: [
            {
              dt: 1646305200,
              temp: {
                day: 9.93,
                min: -0.1,
                max: 10.56,
              },
              weather: [
                {
                  id: 800,
                  main: 'Clear',
                  description: 'clear sky',
                  icon: '01d',
                },
              ],
            },
          ],
        },
      ]),
  };

  beforeEach(async () => {
    ZIPS = [];
    await TestBed.configureTestingModule({
      declarations: [WeatherForecastComponent],
      imports: [AppModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: LocationService,
          useValue: locationService,
        },
        {
          provide: WeatherService,
          useValue: weatherService,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '6003',
              },
            },
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeatherForecastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    route = TestBed.inject(ActivatedRoute);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call and get all weather-forecast informations with the id of given zip', () => {
    const component = fixture.componentInstance;
    const spyRoute = spyOn(route.snapshot.paramMap, 'get');
    component.getDailyWeather();
    fixture.detectChanges();

    component.getDailyWeather();
    spyRoute.and.returnValue('6003');
    expect(spyRoute).toHaveBeenCalled();

    component.dailyWeather$.subscribe((weather) => {
      weather.forEach((item) => {
        expect(item.attrs).not.toBeNull();
        expect(item.weather).not.toBeNull();
      });
    });
  });
});
