import { Injectable } from '@angular/core';
import { QualityParam } from '../interfaces/QualityParam';
import { DataDisplayService } from './dataDisplay.service';

@Injectable({
    providedIn: 'root',
})
export class FormatServerResultService {

    constructor(private dataDisplayService: DataDisplayService) { }

    getTripsFromServerResult(results: any[]): Trip[] {
        results.forEach((trip) => {
            trip.lowestPriceAgent = trip.agents.sort((a, b) => (a.price) - (b.price))[0];

            trip.outbound.arrive = this.setDateValue(trip.outbound.arrive);
            trip.outbound.departure = this.setDateValue(trip.outbound.departure);
            trip.outbound.daysDiff = this.dataDisplayService.getDatesDiffreceInDays(trip.outbound.departure, trip.outbound.arrive);

            trip.outbound.flights.forEach(flight => {
                flight.arrive = this.setDateValue(flight.arrive);
                flight.departure = this.setDateValue(flight.departure);
                flight.daysDiff = this.dataDisplayService.getDatesDiffreceInDays(flight.departure, flight.arrive);
            });

            if (trip.inbound) {
                trip.inbound.arrive = this.setDateValue(trip.inbound.arrive);
                trip.inbound.departure = this.setDateValue(trip.inbound.departure);
                trip.inbound.daysDiff = this.dataDisplayService.getDatesDiffreceInDays(trip.inbound.departure, trip.inbound.arrive);

                trip.inbound.flights.forEach(flight => {
                    flight.arrive = this.setDateValue(flight.arrive);
                    flight.departure = this.setDateValue(flight.departure);
                    flight.daysDiff = this.dataDisplayService.getDatesDiffreceInDays(flight.departure, flight.arrive);
                });
            }
        });

        return results;
    }

    setDateValue(date: string): Date {
        if (date) {
            return new Date(date);
        }
    }
}
