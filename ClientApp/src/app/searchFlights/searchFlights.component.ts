import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, map, tap, startWith, switchMap, debounceTime, distinctUntilChanged, takeWhile, first, finalize } from 'rxjs/operators';
import { SmartFlightsFilterService } from '../Utils/smartFlightsFilter.service';
import { QualityParam, ParamTypes } from '../interfaces/QualityParam';
import { searchState } from '../enums/searchState';
import { DataDisplayService } from '../Utils/dataDisplay.service';
import { MatDialog } from '@angular/material';
import { DaysOffDialogComponent } from '../daysOffDialog/daysOffDialog.component';
import { FilterParams, FilterTripsService } from '../Utils/filterTrips.Service';
import { DaysOffUtilsService, DateRange, Day, weekDay } from '../Utils/daysOffUtils.service';

@Component({
  selector: 'app-search-flights',
  templateUrl: './searchFlights.component.html',
  styleUrls: ['./searchFlights.component.scss']
})

export class SearchFlightsComponent {
  loadingProgress = 0;
  loadingMessage = 'Searching for flights...';
  searchStatesEnum = searchState;
  currentSearchState: searchState = searchState.empty;
  minAutocompliteLength = 2;
  allTripOptions: Trip[];
  filteredTripOptions: Trip[];
  whereTo = new FormControl();
  tripType = 'roundTrip';
  whereFrom = new FormControl();
  departureDate: FormControl;
  returnDate: FormControl;
  minDate: Date;
  maxDate: Date;
  daysOffDateRange: DateRange;
  searchByDates = 'Dates';
  searchByDaysOff = 'DaysOff';
  datesToggleValue = this.searchByDates;

  isLoadingFromOptions = false;
  isLoadingToOptions = false;
  fromOptions: any[];
  toOptions: any[];
  serverResult: any[] = [];

  qualityParams: QualityParam[] = [
    { paramType: ParamTypes.price, paramImportancePrecent: 40 },
    { paramType: ParamTypes.totalTripLength, paramImportancePrecent: 40 },
    { paramType: ParamTypes.numberOfStops, paramImportancePrecent: 20 }
  ];
  minSliderValue = 10;
  maxSliderValue = 70;
  sliderValue = (this.maxSliderValue + this.minSliderValue) / 2;

  numberOfPassengersOptions = [1, 2, 3, 4, 5, 6, 7, 8];
  numberOfPassengers = 2;

  numberOfDaysOffOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  numberOfDaysOff = 4;

  daysOff: Day[] = [
    { name: weekDay.sunday, isFreeDay: false },
    { name: weekDay.monday, isFreeDay: false },
    { name: weekDay.tuesday, isFreeDay: false },
    { name: weekDay.wednesday, isFreeDay: false },
    { name: weekDay.thursday, isFreeDay: false },
    { name: weekDay.friday, isFreeDay: true },
    { name: weekDay.saturday, isFreeDay: true },
  ];

  filterParams: FilterParams = {
    maxPrice: undefined,
    flightTime: {
      inbound: { morning: true, afternoon: true, evening: true, night: true },
      outbound: { morning: true, afternoon: true, evening: true, night: true }
    },
    numOfStops: { zero: true, one: true, two: false, threeAndMore: false }
  };

  minPriceSliderValue = 0;
  maxPriceSliderValue = 3000;
  priceSliderValue: number;

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string,
    private smartFlightsFilterService: SmartFlightsFilterService,
    private dataDisplayService: DataDisplayService, private dialog: MatDialog,
    private filterTripsService: FilterTripsService, private daysOffUtilsService: DaysOffUtilsService) {
    this.initializeDates();
    this.subscribeToWhereFromField();
    this.subscribeToWhereToField();
  }

  initializeDates() {
    this.departureDate = new FormControl(new Date());
    const returnDate = new Date();
    returnDate.setDate(returnDate.getDate() + 1);
    this.returnDate = new FormControl(returnDate);
    this.minDate = new Date();
    this.maxDate = new Date(this.minDate.getFullYear() + 1, this.minDate.getMonth(), this.minDate.getDate());
    const returnDateForRange = new Date();
    returnDateForRange.setDate(returnDate.getDate() + 7);
    this.daysOffDateRange = { begin: new Date(), end: returnDateForRange };
  }

  subscribeToWhereFromField() {
    let fromLoadingRequestNumber = 0;
    let fromFinishedRequestNumber = 0;

    this.whereFrom.valueChanges
      .pipe(
        startWith(null),
        debounceTime(500),
        tap(() => {
          fromLoadingRequestNumber++;
          this.isLoadingFromOptions = true;
        }),
        distinctUntilChanged(),
        switchMap(val =>
          this.getFlightPlacesFromServer(val || '')
            .pipe(finalize(() => {
              fromFinishedRequestNumber++;
              if (fromFinishedRequestNumber === fromFinishedRequestNumber) {
                this.isLoadingFromOptions = false;
              }
            }))
        )
      ).subscribe(result => this.fromOptions = result);

  }

  subscribeToWhereToField() {
    let toLoadingRequestNumber = 0;
    let toFinishedRequestNumber = 0;
    this.whereTo.valueChanges
      .pipe(
        startWith(null),
        debounceTime(500),
        tap(() => {
          toLoadingRequestNumber++;
          this.isLoadingToOptions = true;
        }),
        distinctUntilChanged(),
        switchMap(val =>
          this.getFlightPlacesFromServer(val || '')
            .pipe(finalize(() => {
              toFinishedRequestNumber++;
              if (toFinishedRequestNumber === toLoadingRequestNumber) {
                this.isLoadingToOptions = false;
              }
            }))
        )
      ).subscribe(re => { this.toOptions = re; });
  }

  getFlightPlacesFromServer(val: string): Observable<any[]> {
    if (val && val.length >= this.minAutocompliteLength) {
      const params = new HttpParams().set('query', val);
      return this.http.get<any[]>(this.baseUrl + 'api/SkyScanner/GetPlaces', { params: params });
    }
    return of([]);
  }

  onSearch() {
    this.resetResults();
    this.setCurrentState(searchState.loading);
    this.manageLoadingValue();

    if (this.datesToggleValue === this.searchByDaysOff) {
      const searchDates: DateRange[] =
        this.daysOffUtilsService.getDatesToSerach(this.daysOffDateRange, this.numberOfDaysOff, this.daysOff);


      const observables = [];
      searchDates.forEach((dateRange: DateRange) => {
        observables.push(this.requestFromServer(dateRange.begin, dateRange.end));
      });

      forkJoin(observables).subscribe((results: any[][]) => {

        results.forEach((tripOptions: any[]) => {
          this.serverResult.push(...tripOptions);
        });
        this.allTripOptions = this.smartFlightsFilterService.getBestTripsResults(this.serverResult, this.qualityParams);
        if (this.allTripOptions.length === 0) {
          this.setCurrentState(searchState.noResults);
          return;
        }

        this.filteredTripOptions = this.filterTripsService.getFilteredTrips(this.allTripOptions, this.filterParams);
        this.setCurrentState(searchState.succsses);

      }, error => this.onError(error));
    } else {

      this.requestFromServer(this.departureDate.value, this.returnDate.value).subscribe((tripOptions: any[]) => {
        this.serverResult = tripOptions;
        this.allTripOptions = this.smartFlightsFilterService.getBestTripsResults(this.serverResult, this.qualityParams);

        if (this.allTripOptions.length === 0) {
          this.setCurrentState(searchState.noResults);
          return;
        }

        this.filteredTripOptions = this.filterTripsService.getFilteredTrips(this.allTripOptions, this.filterParams);
        this.setCurrentState(searchState.succsses);
      },
        error => this.onError(error));
    }
  }

  requestFromServer(departureDate: Date, returnDate: Date) {
    departureDate = this.addHoursToDate(departureDate, 3);
    returnDate = this.addHoursToDate(returnDate, 3);

    const param = new HttpParams()
      .append('outboundDate', departureDate ? departureDate.toISOString() : null)
      .append('inboundDate', returnDate ? returnDate.toISOString() : null)
      .append('originPlace', JSON.stringify(this.whereFrom.value))
      .append('destinationPlace', JSON.stringify(this.whereTo.value))
      .append('people', this.numberOfPassengers.toString())
      .append('oneWay', this.isOneWay().toString());

    return this.http.post<any[]>(this.baseUrl + 'api/SkyScanner/flights', param);
  }

  onError(error) {
    this.setCurrentState(searchState.error);
    this.resetResults();
    console.error(error);
  }

  resetResults() {
    this.serverResult = [];
    this.allTripOptions = [];
    this.filteredTripOptions = [];
  }

  onSliderInputChange(value: number) {
    this.qualityParams.find(param => param.paramType === ParamTypes.price)
      .paramImportancePrecent = value;

    this.qualityParams.find(param => param.paramType === ParamTypes.totalTripLength)
      .paramImportancePrecent = (this.maxSliderValue + this.minSliderValue) - value;

    this.allTripOptions = this.smartFlightsFilterService.getBestTripsResults(this.serverResult, this.qualityParams);
    this.filteredTripOptions = this.filterTripsService.getFilteredTrips(this.allTripOptions, this.filterParams);
  }

  isOneWay() {
    return this.tripType === 'oneWay';
  }

  swapDestinations() {
    const dest = this.whereFrom.value;
    this.whereFrom.setValue(this.whereTo.value);
    this.whereTo.setValue(dest);
  }

  onDatesToggleValueChange(val: string) {
    this.datesToggleValue = val;
  }

  manageLoadingValue() {
    this.loadingProgress = 2;

    const tid = setInterval(() => {
      if (this.currentSearchState === searchState.loading &&
        this.loadingProgress < 90) {
        this.loadingProgress += 2;
      } else {
        clearInterval(tid);
      }
    }, 500);
  }

  setCurrentState(state: searchState) {
    if (this.currentSearchState === searchState.loading) {
      this.loadingProgress = 100;
      setTimeout(() => {
        this.currentSearchState = state;
        this.loadingProgress = 0;
      }, 500);
    } else {
      this.currentSearchState = state;
    }
  }

  openDaysOffDialog(): void {
    const dialogRef = this.dialog.open(DaysOffDialogComponent, {
      width: '350px',
      data: this.daysOff
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.daysOff = result;
      }
    });
  }

  onPriceSliderInputChange(value: number) {
    this.priceSliderValue = value;
    this.filterParams.maxPrice = this.priceSliderValue;
    this.filteredTripOptions = this.filterTripsService.getFilteredTrips(this.allTripOptions, this.filterParams);
  }

  onPriceInputLiveChange(event) {
    this.priceSliderValue = event.value;
  }

  resetPriceSlider() {
    this.priceSliderValue = undefined;
    this.filterParams.maxPrice = this.priceSliderValue;
    this.filteredTripOptions = this.filterTripsService.getFilteredTrips(this.allTripOptions, this.filterParams);
  }

  onCheckboxChanged() {
    this.filteredTripOptions = this.filterTripsService.getFilteredTrips(this.allTripOptions, this.filterParams);
  }

  resetStopsCheckboxs() {
    this.filterParams.numOfStops = { zero: true, one: true, two: false, threeAndMore: false };
    this.onCheckboxChanged();
  }

  resetOutboundTimesCheckboxs() {
    this.filterParams.flightTime.outbound = { morning: true, afternoon: true, evening: true, night: true };
    this.onCheckboxChanged();
  }

  resetInboundTimesCheckboxs() {
    this.filterParams.flightTime.inbound = { morning: true, afternoon: true, evening: true, night: true };
    this.onCheckboxChanged();
  }

  addHoursToDate(date: Date, hours: number) {
    date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
    return date;
  }
}
