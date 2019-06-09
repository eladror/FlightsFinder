import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class FilterTripsService {
    getTripsFromServerResult(trips: Trip[]): Trip[] {
        return [];
    }
}

export interface FilterParams {
    maxPrice: number;
    numOfStops: { one: boolean, two: boolean, three: boolean, four: boolean };
    flightTime: { morning: boolean, afternoon: boolean, evening: boolean, night: boolean };
}
