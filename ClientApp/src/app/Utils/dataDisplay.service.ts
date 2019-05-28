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
    const hours: string = date.getHours().toString();
    const minutes: string = (date.getMinutes() === 0) ? '00' : date.getMinutes().toString();

    return day + ' ' + monthNames[monthIndex] + ' ' + year + '  -  ' + hours + ':' + minutes;
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
}
