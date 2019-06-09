import { Injectable } from '@angular/core';
import { filter } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class FilterTripsService {
    getFilteredTrips(trips: Trip[], filterParams: FilterParams): Trip[] {
        let filteredTrips = trips;
        if (filterParams.maxPrice) { filteredTrips = this.getTripsFilteredMaxPrice(filteredTrips, filterParams.maxPrice); }
        if (filterParams.numOfStops) { filteredTrips = this.getTripsFilteredByStopsNum(filteredTrips, filterParams); }
        if (filterParams.flightTime) { filteredTrips = this.getTripsFilteredFlightTime(filteredTrips, filterParams); }

        return filteredTrips;
    }

    private getTripsFilteredMaxPrice(trips: Trip[], maxPrice: number): Trip[] {
        const filteredTrips = trips.filter(trip => {
            return trip.lowestPriceAgent.price <= maxPrice;
        });

        return filteredTrips;
    }

    private getTripsFilteredByStopsNum(trips: Trip[], filterParams: FilterParams): Trip[] {
        const stopsNums = this.getStopsNumberArray(filterParams);

        const filteredTrips = trips.filter(trip => {
            const outbondStopsNum = trip.outbound.flights.length - 1;
            const inboundStopsNum = trip.inbound.flights.length - 1;

            return (stopsNums.includes(outbondStopsNum) && stopsNums.includes(inboundStopsNum));
        });

        return filteredTrips;
    }

    private getTripsFilteredFlightTime(trips: Trip[], filterParams: FilterParams): Trip[] {
        let filteredTrips = trips.filter(trip => {
            return this.isInWantedHoursRange(trip.outbound.departure, filterParams.flightTime.outbound);
        });

        filteredTrips  = filteredTrips.filter(trip => {
            return this.isInWantedHoursRange(trip.inbound.departure, filterParams.flightTime.inbound);
        });

        return filteredTrips;
    }

    private getStopsNumberArray(filterParams: FilterParams): number[] {
        const result = [];
        if (filterParams.numOfStops.zero) { result.push(0); }
        if (filterParams.numOfStops.one) { result.push(1); }
        if (filterParams.numOfStops.two) { result.push(2); }
        if (filterParams.numOfStops.threeAndMore) { result.push(3, 4); }

        return result;
    }

    private isInWantedHoursRange(date: Date, dayTimes: DayTimes): boolean {
        const hours = date.getHours();

        if (dayTimes.morning && (hours >= 5 && hours <= 11)) { return true; }
        if (dayTimes.afternoon && (hours >= 12 && hours <= 16)) { return true; }
        if (dayTimes.evening && (hours >= 17 && hours <= 20)) { return true; }
        if (dayTimes.night && (hours >= 21 && hours <= 4)) { return true; }

        return false;
    }
}

export interface FilterParams {
    maxPrice: number;
    numOfStops: { zero: boolean, one: boolean, two: boolean, threeAndMore: boolean };
    flightTime: { outbound: DayTimes, inbound: DayTimes };
}

export interface DayTimes {
    morning: boolean;
    afternoon: boolean;
    evening: boolean;
    night: boolean;
}
