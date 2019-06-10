import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { SatNativeDateModule, SatDatepickerModule } from 'saturn-datepicker';

import { AppComponent } from './app.component';
import { SearchFlightsComponent } from './searchFlights/searchFlights.component';
import { FlightsResultsComponent } from './flightsResults/flightsResults.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatToolbarModule, MatTabsModule, MatIconModule, MatInputModule,
  MatFormFieldModule, MatAutocompleteModule, MatButtonModule,
  MatNativeDateModule, MatDatepickerModule, MatRadioModule, MatCardModule,
  MatGridListModule, MatDividerModule, MatExpansionModule,
  MatProgressSpinnerModule, MatProgressBarModule, MatSelectModule, MatButtonToggleModule,
  MatDialogModule, MatCheckboxModule, MatSliderModule
} from '@angular/material';
import { DataDisplayService } from './Utils/dataDisplay.service';
import { FlightComponent } from './flight/flight.component';
import { TripComponent } from './Trip/trip.component';
import { FlightOptionHeaderComponent } from './flightOption/flightOptionHeader.component';
import { ErrorMessageComponent } from './errorMessage/errorMessage.component';
import { NoResultsMessageComponent } from './noResultsMessage/noResultsMessage.component';
import { SmartFlightsFilterService } from './Utils/smartFlightsFilter.service';
import { LoadingBarComponent } from './loadingBar/loadingBar.component';
import { FlightOptionDetailsComponent } from './flightOption/flightOptionDetails.component';
import { DaysOffDialogComponent } from './daysOffDialog/daysOffDialog.component';
import { FormatServerResultService } from './Utils/formatServerResult.service';
import { FilterTripsService } from './Utils/filterTrips.Service';
import { DaysOffUtilsService } from './Utils/daysOffUtils.service';

@NgModule({
  imports: [MatToolbarModule, MatTabsModule, MatIconModule,
    FormsModule, MatInputModule, MatFormFieldModule,
    ReactiveFormsModule, MatAutocompleteModule, MatButtonModule, MatNativeDateModule,
    MatDatepickerModule, MatRadioModule, MatCardModule, MatGridListModule,
    MatDividerModule, MatExpansionModule, MatProgressSpinnerModule,
    MatProgressBarModule, MatSelectModule, MatButtonToggleModule,
    MatDialogModule, MatCheckboxModule, MatSliderModule],
  exports: [MatToolbarModule, MatTabsModule, MatIconModule,
    FormsModule, MatInputModule, MatFormFieldModule,
    ReactiveFormsModule, MatAutocompleteModule, MatButtonModule, MatNativeDateModule,
    MatDatepickerModule, MatRadioModule, MatCardModule, MatGridListModule,
    MatDividerModule, MatExpansionModule, MatProgressSpinnerModule,
    MatProgressBarModule, MatSelectModule, MatButtonToggleModule,
    MatDialogModule, MatCheckboxModule, MatSliderModule],
})
export class AngularMaterialModule { }
@NgModule({
  declarations: [
    AppComponent,
    SearchFlightsComponent,
    FlightsResultsComponent,
    TripComponent,
    FlightComponent,
    FlightOptionHeaderComponent,
    ErrorMessageComponent,
    NoResultsMessageComponent,
    LoadingBarComponent,
    FlightOptionDetailsComponent,
    DaysOffDialogComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    SatDatepickerModule,
    SatNativeDateModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' }
    ]),
    AngularMaterialModule
  ],
  entryComponents: [DaysOffDialogComponent],
  providers: [DataDisplayService, SmartFlightsFilterService,
    FormatServerResultService, FilterTripsService, DaysOffUtilsService],
  bootstrap: [AppComponent]
})
export class AppModule { }


