import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

  setItem(value: string) {
    const zips = this.getItems('zipcodes');
    !zips.includes(value) ? zips.push(value) : zips;
    localStorage.setItem('zipcodes', JSON.stringify(zips));
  }

  getItems(key: string) {
    const zipsString = localStorage.getItem(key);
    if (zipsString) return JSON.parse(zipsString);
    return [];
  }

  removeItem(value: string) {
    const zips = this.getItems('zipcodes');
    const index = zips.indexOf(value);
    if (index > -1) {
      zips.splice(index, 1);
    }
    localStorage.setItem('zipcodes', JSON.stringify(zips));
  }
}
