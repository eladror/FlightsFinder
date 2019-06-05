import { Injectable } from '@angular/core';
import { QualityParam } from '../interfaces/QualityParam';

@Injectable({
  providedIn: 'root',
})
export class SmartFlightsFilterService {

  public getBestTripsResults(trips: Trip[], qualityParams: QualityParam[]): Trip[] {
    const tripScores: TripScores[] = [];

    qualityParams.forEach(param => {
      this.setTripsScoresByParam(tripScores, param);
    });

    this.setTripsTotalScore(tripScores);

    return trips;
  }

  private setTripsScoresByParam(tripScores: TripScores[], param: QualityParam): void {
  }

  private setTripsTotalScore(tripScores: TripScores[]): void {
  }
}
