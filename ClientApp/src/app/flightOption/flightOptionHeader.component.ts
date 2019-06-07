import { Component, Input } from '@angular/core';
import { DataDisplayService } from '../Utils/dataDisplay.service';

@Component({
  selector: 'app-flight-option-header',
  templateUrl: './flightOptionHeader.component.html',
  styleUrls: ['./flightOptionHeader.component.css']
})

export class FlightOptionHeaderComponent {
  @Input() flightOption: FlightOption;
  @Input() isOutbound: boolean;

  outboundTitle = 'Outbound';
  inboundTitle = 'Return';

  constructor(private DataDisplayService: DataDisplayService) {
  }
}

