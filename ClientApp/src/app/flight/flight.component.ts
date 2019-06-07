import { Component, Input } from '@angular/core';
import { DataDisplayService } from '../Utils/dataDisplay.service';

@Component({
  selector: 'app-flight',
  templateUrl: './flight.component.html',
  styleUrls: ['./flight.component.css']
})

export class FlightComponent {
  @Input() flight: Flight;

  constructor(private dataDisplayService: DataDisplayService) {
  }

  displayFn(place: Place) {
    return place ? place.placeName + ' (' + place.airportId + ')' : place;
  }
}
