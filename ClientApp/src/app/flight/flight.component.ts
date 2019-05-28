import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-flight',
  templateUrl: './flight.component.html',
  styleUrls: ['./flight.component.css']
})

export class FlightComponent {
  @Input() flight: Flight;

  constructor() {
  }
}
