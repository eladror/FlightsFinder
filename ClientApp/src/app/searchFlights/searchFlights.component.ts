import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-search-flights',
  templateUrl: './searchFlights.component.html',
  styleUrls: ['./searchFlights.component.css']
})

export class SearchFlightsComponent {
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  tripType = 'roundTrip';

  isOneWay() {
    return this.tripType === 'oneWay';
  }
}
