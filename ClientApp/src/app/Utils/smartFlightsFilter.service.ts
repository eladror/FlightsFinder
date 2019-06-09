import { Injectable } from '@angular/core';
import { QualityParam } from '../interfaces/QualityParam';
import { FormatServerResultService } from './formatServerResult.service';

@Injectable({
  providedIn: 'root',
})
export class SmartFlightsFilterService {

  constructor(private formatFlightResultsService: FormatServerResultService) { }

  public getBestTripsResults(serverResult: any[], qualityParams: QualityParam[]): Trip[] {
    const trips = this.formatFlightResultsService.getTripsFromServerResult(serverResult).filter(result =>
      (result.outbound.flights.length <= 1 &&
        (!result.inbound || result.inbound.flights.length === 1)));

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
