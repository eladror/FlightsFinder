import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataDisplayService {

  getDateDispaly(date: Date): string {
    const monthNames = [
      'January', 'February', 'March',
      'April', 'May', 'June', 'July',
      'August', 'September', 'October',
      'November', 'December'
    ];

    const day = date.getDate();
    const monthIndex: string = date.getMonth().toString();
    const year: string = date.getFullYear().toString();

    return day + ' ' + monthNames[monthIndex] + ' ' + year;
  }

  getTimeDispaly(date: Date): string {
    let hours: string = date.getHours().toString();
    let minutes: string = date.getMinutes().toString();

    if (hours.length === 1) {
      hours = '0' + hours;
    }

    if (minutes.length === 1) {
      minutes = '0' + minutes;
    }

    return hours + ':' + minutes;
  }

  getDatesDiffreceInDays(date1: Date, date2: Date): number {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;

    const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  }

  getDatesDiffreceInHours(date1: Date, date2: Date): string {
    const _MS_PER_MINUTES = 1000 * 60;

    const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate(), date1.getHours(), date1.getMinutes());
    const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate(), date2.getHours(), date2.getMinutes());
    const minutsDiff = Math.floor((utc2 - utc1) / _MS_PER_MINUTES);

    return this.getMinutesToHoursDisplay(minutsDiff);
  }


  getMinutesToHoursDisplay(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours + ':' + remainingMinutes + ' Hours';
  }

  getStopsDisplay(stops: number): string {
    if (stops === 1) {
      return 'Non-Stop';
    }

    return ((stops - 1) + ' Stops');
  }

  getPlaceDisplay(place: Place) {
    return place ? place.placeName + ' (' + place.airportId + ')' : place;
  }
}
