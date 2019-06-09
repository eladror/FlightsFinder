import { Component, Inject, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, tap, startWith, switchMap, debounceTime, distinctUntilChanged, takeWhile, first } from 'rxjs/operators';
import { trigger, state, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-flights-results',
  templateUrl: './flightsResults.component.html',
  styleUrls: ['./flightsResults.component.css']
})

export class FlightsResultsComponent {
  @Input() flightsResults: Trip[];
  dataSource: any[];
  expandedElement: Trip | null;

  constructor() {
  }
}
