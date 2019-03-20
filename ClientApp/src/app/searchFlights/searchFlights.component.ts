import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-search-flights',
  templateUrl: './searchFlights.component.html',
  styleUrls: ['./searchFlights.component.css']
})

export class SearchFlightsComponent {
  whereTo = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  tripType = 'roundTrip';
  departureDate = new FormControl(new Date());
  returnDate = new FormControl(new Date);
  whereFrom = new FormControl();

  isOneWay() {
    return this.tripType === 'oneWay';
  }

  onSearch() {
    alert(this.whereFrom.value);
  }
}