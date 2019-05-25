import { Component, Inject, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, tap, startWith, switchMap, debounceTime, distinctUntilChanged, takeWhile, first } from 'rxjs/operators';

@Component({
  selector: 'app-flights-results',
  templateUrl: './flightsResults.component.html',
  styleUrls: ['./flightsResults.component.css']
})

export class FlightsResultsComponent {
  @Input() flightsResults: Trip[];
  tripOptions: Trip[];
  whereTo = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
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
          return this.filter(val || '');
        })
      );

      this.toOptions = this.whereTo.valueChanges
      .pipe(
        startWith(null),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(val => {
          return this.filter(val || '');
        })
      );
  }

  filter(val: string): Observable<any[]> {
    const params = new HttpParams().set('query', val);
    return this.http.get<any[]>(this.baseUrl + 'api/SkyScanner/GetPlaces', { params: params })
      .pipe();
  }




  isOneWay() {
    return this.tripType === 'oneWay';
  }

  swapDestinations() {
    alert('swap');
  }

  onSearch() {
    const params: HttpParams = new HttpParams();
    params.append('outboundDate', this.departureDate.value);
    params.append('inboundDate', this.returnDate.value);
    params.append('originPlace', this.whereFrom.value);
    params.append('destinationPlace', this.whereTo.value);
    params.append('people', '2');

    this.http.get<Trip[]>(this.baseUrl + 'api/SkyScanner/flights', { params: params })
      .subscribe(tripOptions => {
        this.tripOptions = [{
          agents: 'el-al', 'arrive': '12/12/19', departure: '01/12/19',
          inbound: 'tlv', outbound: 'jfk'
        }];
      },
        error => console.error(error));
  }
}

interface Trip {
  agents: string;
  departure: string;
  arrive: string;
  inbound: string;
  outbound: string;
}
