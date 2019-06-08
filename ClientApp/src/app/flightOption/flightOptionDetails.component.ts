import { Component, Input } from '@angular/core';
import { DataDisplayService } from '../Utils/dataDisplay.service';

@Component({
  selector: 'app-flight-option-details',
  templateUrl: './flightOptionDetails.component.html',
  styleUrls: ['./flightOptionDetails.component.css']
})

export class FlightOptionDetailsComponent {
  @Input() flightOption: FlightOption;

  constructor(private dataDisplayService: DataDisplayService) {
  }
}

