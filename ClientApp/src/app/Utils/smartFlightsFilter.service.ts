import { Injectable } from '@angular/core';
import { FormatServerResultService } from './formatServerResult.service';
import { QualityParam, ParamTypes } from '../interfaces/QualityParam';

@Injectable({
  providedIn: 'root',
})
export class SmartFlightsFilterService {

  constructor(private formatFlightResultsService: FormatServerResultService) { }

  public getBestTripsResults(serverResult: any[], qualityParams: QualityParam[]): Trip[] {
    const trips = this.formatFlightResultsService.getTripsFromServerResult(serverResult);

    const tripScores: TripScores[] = trips.map(trip => {
      const tripScore: TripScores = { trip: trip, numberOfStopsScore: 0, priceScore: 0, totalQualityPoints: 0, tripLengthScore: 0 };
      return tripScore;
    });

    qualityParams.forEach(param => {
      this.setTripsScoresByParam(tripScores, param);
    });

    return tripScores.sort((a, b) => a.totalQualityPoints - b.totalQualityPoints).map(tripScore => tripScore.trip);
  }
  private calcNumOfStops(trip: Trip): number {
    return trip.outbound.flights.length + (trip.inbound === null ? 0 : trip.inbound.flights.length);
  }
  private calcPrice(trip: Trip): number {
    return trip.lowestPriceAgent.price;
  }
  private calcTripLength(trip: Trip): number {
    return trip.outbound.duration + (trip.inbound === null ? 0 : trip.inbound.duration);
  }

  private setTripsScoresByParam(tripScores: TripScores[], param: QualityParam): void {
    switch (param.paramType) {
      case ParamTypes.numberOfStops: {
        tripScores.sort((a, b) => {
          return this.calcNumOfStops(a.trip) - this.calcNumOfStops(b.trip);
        });
        break;
      }
      case ParamTypes.price: {
        tripScores.sort((a, b) => {
          return this.calcPrice(a.trip) - this.calcPrice(b.trip);
        });
        break;
      }
      case ParamTypes.totalTripLength: {
        tripScores.sort((a, b) => {
          return this.calcTripLength(a.trip) - this.calcTripLength(b.trip);
        });
        break;
      }
    }
    for (let index = 0; index < tripScores.length; index++) {
      const tripScore = tripScores[index];
      tripScore.totalQualityPoints += index * param.paramImportancePrecent;
    }
  }
}
