import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocationService } from 'src/app/services/location.service';
import { of } from 'rxjs';

import { WeatherComponent } from './weather.component';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { WeatherService } from 'src/app/services/weather.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AppModule } from 'src/app/app.module';

describe('WeatherComponent', () => {
  let component: WeatherComponent;
  let fixture: ComponentFixture<WeatherComponent>;
  let router: Router;

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
  const localStorageService = {
    getItems: () => ZIPS,
    setItem: (a: string) => ZIPS.push(a),
    removeItem: (a: string) => ZIPS.splice(ZIPS.indexOf(a), 1),
  };

  beforeEach(async () => {
    ZIPS = ['1233', '2345', '4568'];
    await TestBed.configureTestingModule({
      declarations: [WeatherComponent],
      imports: [AppModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: LocationService,
          useValue: locationService,
        },
        {
          provide: LocalStorageService,
          useValue: localStorageService,
        },
        {
          provide: WeatherService,
          useValue: weatherService,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeatherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('removeZip', () => {
    it('should call router.navigate method inside removeZip method', () => {
      const component = fixture.componentInstance;
      const navigateSpy = spyOn(router, 'navigate');
      component.removeZip('4568');
      expect(navigateSpy).toHaveBeenCalledWith(['/']);
    });

    it('should call localStorageService.removeItem method inside removeZip method', () => {
      const component = fixture.componentInstance;
      const localStorageServiceSpy = spyOn(localStorageService, 'removeItem');
      component.removeZip('4568');
      expect(localStorageServiceSpy).toHaveBeenCalled();
    });
    it('should call getWeatherInfo() inside removeZip method', () => {
      const component = fixture.componentInstance;
      const getWeatherInfoSpy = spyOn(component, 'getWeatherInfo');
      component.removeZip('4568');
      expect(getWeatherInfoSpy).toHaveBeenCalled();
    });
  });

  it('should call and get all weather informations with the id of given zip', () => {
    const component = fixture.componentInstance;
    //component.getWeatherInfo();
    fixture.detectChanges();
    component.weatherInfo$.subscribe((weather) => {
      weather.forEach((item) => {
        expect(item.attrs).not.toBeNull();
        expect(item.weather).not.toBeNull();
      });
    });
  });
  describe('start', () => {
    it('should call all related methods inside removeZip method', () => {
      const component = fixture.componentInstance;
      const localStorageServiceSpy = spyOn(localStorageService, 'setItem');
      component.start('6003');
      expect(localStorageServiceSpy).toHaveBeenCalled();
      expect(localStorageServiceSpy).toHaveBeenCalledWith('6003');
    });
    it('should call all related methods inside removeZip method', () => {
      const component = fixture.componentInstance;
      const getWeatherInfoSpy = spyOn(component, 'getWeatherInfo');
      component.start('6003');
      expect(getWeatherInfoSpy).toHaveBeenCalled();
    });
  });
});
