import { Component, Input } from '@angular/core';
import { DataDisplayService } from '../Utils/dataDisplay.service';

@Component({
  selector: 'app-trip',
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.css']
})

export class TripComponent {
  @Input() trip: Trip;

  constructor(private dataDisplayService: DataDisplayService) {

  }

  selectAgent(agent: Agent) {
    window.open(agent.BookingUrl, '_blank');
  }
}

