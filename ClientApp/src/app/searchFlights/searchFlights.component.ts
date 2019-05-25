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
    alert('swap');
  }

  onSearch() {
    const paaram = new HttpParams()
      .append('outboundDate', this.departureDate.value.toISOString())
      .append('inboundDate', this.returnDate.value.toISOString())
      .append('originPlace', JSON.stringify(this.whereFrom.value))
      .append('destinationPlace', JSON.stringify(this.whereTo.value))
      .append('people', '2');


    this.http.post<Trip[]>(this.baseUrl + 'api/SkyScanner/flights', paaram)
      .subscribe(tripOptions => {
        this.tripOptions = [{
          agents: 'el-al', 'arrive': '12/12/19', departure: '01/12/19',
          inbound: 'tlv', outbound: 'jfk'
        }];
      },
        error => console.error(error));
  }

  displayFn(option: any) {
    return option ? option.placeName + ' (' + option.airportId + ')' : option;
  }
}

interface Trip {
  agents: string;
  departure: string;
  arrive: string;
  inbound: string;
  outbound: string;
}
