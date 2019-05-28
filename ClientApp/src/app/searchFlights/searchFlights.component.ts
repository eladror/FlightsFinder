import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SafeHtml } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { catchError, map, tap, startWith, switchMap, debounceTime, distinctUntilChanged, takeWhile, first } from 'rxjs/operators';

@Component({
  selector: 'app-search-flights',
  templateUrl: './searchFlights.component.html',
  styleUrls: ['./searchFlights.component.css']
})

export class SearchFlightsComponent {
  tripOptions: Trip[];
  whereTo = new FormControl();
  tripType = 'roundTrip';
  departureDate = new FormControl(new Date());
  returnDate = new FormControl(new Date());
  whereFrom = new FormControl();

  fromOptions: Observable<any[]>;
  toOptions: Observable<any[]>;

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
    this.fromOptions = this.whereFrom.valueChanges
      .pipe(
        startWith(null),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(val => {
          return this.getFlightPlacesFromServer(val || '');
        })
      );

    this.toOptions = this.whereTo.valueChanges
      .pipe(
        startWith(null),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(val => {
          return this.getFlightPlacesFromServer(val || '');
        })
      );
  }

  getFlightPlacesFromServer(val: string): Observable<any[]> {
    const params = new HttpParams().set('query', val);
    return this.http.get<any[]>(this.baseUrl + 'api/SkyScanner/GetPlaces', { params: params }).pipe();
  }

  isOneWay() {
    return this.tripType === 'oneWay';
  }

  swapDestinations() {
  }

  onSearch() {
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
        this.tripOptions = this.formatResults(tripOptions, whereFrom, whereTo).filter(result =>
          (result.outbound.flights.length === 1 && result.inbound.flights.length === 1));
      },
        error => console.error(error));
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
