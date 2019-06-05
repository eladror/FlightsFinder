import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SafeHtml } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { catchError, map, tap, startWith, switchMap, debounceTime, distinctUntilChanged, takeWhile, first, finalize } from 'rxjs/operators';
import { SmartFlightsFilterService } from '../Utils/smartFlightsFilter.service';
import { QualityParam, ParamTypes } from '../interfaces/QualityParam';

@Component({
  selector: 'app-search-flights',
  templateUrl: './searchFlights.component.html',
  styleUrls: ['./searchFlights.component.css']
})

export class SearchFlightsComponent {
  showErrorMessage = false;
  showNoResultMessage = false;

  minAutocompliteLength = 2;
  tripOptions: Trip[];
  whereTo = new FormControl();
  tripType = 'roundTrip';
  departureDate = new FormControl(new Date());
  returnDate = new FormControl(new Date());
  whereFrom = new FormControl();

  isLoadingFromOptions = false;
  isLoadingToOptions = false;
  fromOptions: any[];
  toOptions: any[];

  qualityParams: QualityParam[] = [
    { paramType: ParamTypes.price, paramImportancePrecent: 40},
    { paramType: ParamTypes.totalTripLength, paramImportancePrecent: 40 },
    { paramType: ParamTypes.numberOfStops, paramImportancePrecent: 20 }
  ];

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string,
    private smartFlightsFilterService: SmartFlightsFilterService) {
    this.whereFrom.valueChanges
      .pipe(
        startWith(null),
        debounceTime(500),
        tap(() => { this.isLoadingFromOptions = true; }),
        distinctUntilChanged(),
        switchMap(val =>
          this.getFlightPlacesFromServer(val || '')
            .pipe(finalize(() => this.isLoadingFromOptions = false))
        )
      ).subscribe(result => this.fromOptions = result);

    this.whereTo.valueChanges
      .pipe(
        startWith(null),
        debounceTime(500),
        tap(() => this.isLoadingToOptions = true),
        distinctUntilChanged(),
        switchMap(val =>
          this.getFlightPlacesFromServer(val || '')
            .pipe(finalize(() => this.isLoadingToOptions = false))
        )
      ).subscribe(re => { this.toOptions = re; });
  }

  getFlightPlacesFromServer(val: string): Observable<any[]> {
    if (val && val.length >= this.minAutocompliteLength) {
      const params = new HttpParams().set('query', val);
      return this.http.get<any[]>(this.baseUrl + 'api/SkyScanner/GetPlaces', { params: params });
    }
    return of([]);
  }

  isOneWay() {
    return this.tripType === 'oneWay';
  }

  swapDestinations() {
  }

  onSearch() {
    this.showErrorMessage = false;
    this.showNoResultMessage = false;
    const whereFrom: string = this.displayFn(this.whereFrom.value);
    const whereTo = this.displayFn(this.whereTo.value);

    const param = new HttpParams()
      .append('outboundDate', this.departureDate.value ? this.departureDate.value.toISOString() : null)
      .append('inboundDate', this.returnDate.value ? this.returnDate.value.toISOString() : null)
      .append('originPlace', JSON.stringify(this.whereFrom.value))
      .append('destinationPlace', JSON.stringify(this.whereTo.value))
      .append('people', '2');

    this.http.post<any[]>(this.baseUrl + 'api/SkyScanner/flights', param)
      .subscribe((tripOptions: any[]) => {
        if (tripOptions.length === 0) {
          this.showNoResultMessage = true;
          return;
        }

        this.tripOptions = this.smartFlightsFilterService.getBestTripsResults(
          this.formatResults(tripOptions, whereFrom, whereTo), this.qualityParams).filter(result =>
            (result.outbound.flights.length === 1 && result.inbound.flights.length === 1));
      },
        error => {
          this.showErrorMessage = true;
          this.tripOptions = [];
          console.error(error);
        });
  }

  displayFn(option: any) {
    return option ? option.placeName + ' (' + option.airportId + ')' : option;
  }

  formatResults(results: any[], whereFrom: string, whereTo: string): Trip[] {
    results.forEach(trip => {
      trip.whereFrom = whereFrom;
      trip.whereTo = whereTo;

      trip.lowestPriceAgent = trip.agents.sort((a, b) => (a.price) - (b.price))[0];

      trip.outbound.arrive = this.setDateValue(trip.outbound.arrive);
      trip.outbound.departure = this.setDateValue(trip.outbound.departure);
      trip.inbound.arrive = this.setDateValue(trip.inbound.arrive);
      trip.inbound.departure = this.setDateValue(trip.inbound.departure);

      trip.inbound.flights.forEach(flight => {
        flight.arrive = this.setDateValue(flight.arrive);
        flight.departure = this.setDateValue(flight.departure);
      });

      trip.outbound.flights.forEach(flight => {
        flight.arrive = this.setDateValue(flight.arrive);
        flight.departure = this.setDateValue(flight.departure);
      });
    });

    return results;
  }

  setDateValue(date: string): Date {
    if (date) {
      return new Date(date);
    }
  }
}
