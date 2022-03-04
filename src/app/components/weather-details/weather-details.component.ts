import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { DailyWeather } from 'src/app/models/daily-weather';
import { LocationWeather } from 'src/app/models/location-weather';
import { WeatherDescription } from 'src/app/models/weather-description';
import { ZipLocation } from 'src/app/models/zip-location';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'app-weather-details',
  templateUrl: './weather-details.component.html',
  styleUrls: ['./weather-details.component.css'],
  animations: [
    trigger('simpleFadeAnimation', [
      state('in', style({opacity: 1})),
      transition(':enter', [
        style({opacity: 0}),
        animate(300)
      ]),
      transition(':leave',
        animate(300, style({opacity: 0})))
    ])
  ]
})

export class WeatherDetailsComponent implements OnInit {

  simpleFadeAnimation:string = "";
  
  @Input() locationData$!:Observable<ZipLocation>;
  @Input() weatherData$!:Observable<LocationWeather[]>;
  @Input() weatherDescription$!:Observable<WeatherDescription>
  @Input() weatherDaily$!:Observable<DailyWeather>;
  @Output() removeZip = new EventEmitter<string>()

  constructor() { }

  ngOnInit(): void {
    this.simpleFadeAnimation= "in";
  }

  removeWeatherDetail(zip:string){
    this.removeZip.emit(zip)
  }

}
