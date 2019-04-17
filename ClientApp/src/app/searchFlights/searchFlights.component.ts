import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-search-flights',
  templateUrl: './searchFlights.component.html',
  styleUrls: ['./searchFlights.component.css']
})

export class SearchFlightsComponent {
  tripOptions: Trip[];
  whereTo = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  tripType = 'roundTrip';
  departureDate = new FormControl(new Date());
  returnDate = new FormControl(new Date());
  whereFrom = new FormControl();

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {

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
