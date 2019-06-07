import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SafeHtml } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { catchError, map, tap, startWith, switchMap, debounceTime, distinctUntilChanged, takeWhile, first, finalize } from 'rxjs/operators';
import { SmartFlightsFilterService } from '../Utils/smartFlightsFilter.service';
import { QualityParam, ParamTypes } from '../interfaces/QualityParam';
import { searchState } from '../enums/searchState';

@Component({
  selector: 'app-search-flights',
  templateUrl: './searchFlights.component.html',
  styleUrls: ['./searchFlights.component.css']
})

export class SearchFlightsComponent {
  loadingProgress = 0;
  loadingMessage = 'Searching for flights...';
  searchStatesEnum = searchState;
  currentSearchState: searchState = searchState.empty;
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
    { paramType: ParamTypes.price, paramImportancePrecent: 40 },
    { paramType: ParamTypes.totalTripLength, paramImportancePrecent: 40 },
    { paramType: ParamTypes.numberOfStops, paramImportancePrecent: 20 }
  ];

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string,
    private smartFlightsFilterService: SmartFlightsFilterService) {
    let fromLoadingRequestNumber = 0;
    let fromFinishedRequestNumber = 0;
    this.whereFrom.valueChanges
      .pipe(
        startWith(null),
        debounceTime(500),
        tap(() => {
          fromLoadingRequestNumber++;
          this.isLoadingFromOptions = true;
        }),
        distinctUntilChanged(),
        switchMap(val =>
          this.getFlightPlacesFromServer(val || '')
            .pipe(finalize(() => {
              fromFinishedRequestNumber++;
              if (fromFinishedRequestNumber === fromFinishedRequestNumber) {
                this.isLoadingFromOptions = false;
              }
            }))
        )
      ).subscribe(result => this.fromOptions = result);

    let toLoadingRequestNumber = 0;
    let toFinishedRequestNumber = 0;
    this.whereTo.valueChanges
      .pipe(
        startWith(null),
        debounceTime(500),
        tap(() => {
          toLoadingRequestNumber++;
          this.isLoadingToOptions = true;
        }),
        distinctUntilChanged(),
        switchMap(val =>
          this.getFlightPlacesFromServer(val || '')
            .pipe(finalize(() => {
              toFinishedRequestNumber++;
              if (toFinishedRequestNumber === toLoadingRequestNumber) {
                this.isLoadingToOptions = false;
              }
            }))
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
    this.setCurrentState(searchState.loading);
    this.manageLoadingValue();

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
          this.setCurrentState(searchState.noResults);
          return;
        }

        this.setCurrentState(searchState.succsses);

        this.tripOptions = this.smartFlightsFilterService.getBestTripsResults(
          this.formatResults(tripOptions, whereFrom, whereTo), this.qualityParams).filter(result =>
            (result.outbound.flights.length === 1 && result.inbound.flights.length === 1));
      },
        error => {
          this.setCurrentState(searchState.error);
          this.tripOptions = [];
          console.error(error);
        });
  }

  manageLoadingValue() {
    this.loadingProgress = 5;

    const tid = setInterval(() => {
      if (this.currentSearchState === searchState.loading &&
        this.loadingProgress < 90) {
        this.loadingProgress += 5;
      } else {
        clearInterval(tid);
      }
    }, 500);
  }

  setCurrentState(state: searchState) {
    if (this.currentSearchState === searchState.loading) {
      this.loadingProgress = 100;
      setTimeout(() => {
        this.currentSearchState = state;
        this.loadingProgress = 0;
      }, 500);
    } else {
      this.currentSearchState = state;
    }
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
