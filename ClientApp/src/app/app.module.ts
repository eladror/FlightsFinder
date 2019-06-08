import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

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
  MatProgressSpinnerModule, MatProgressBarModule, MatSelectModule
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

@NgModule({
  imports: [MatToolbarModule, MatTabsModule, MatIconModule,
    FormsModule, MatInputModule, MatFormFieldModule,
    ReactiveFormsModule, MatAutocompleteModule, MatButtonModule, MatNativeDateModule,
    MatDatepickerModule, MatRadioModule, MatCardModule, MatGridListModule,
    MatDividerModule, MatExpansionModule, MatProgressSpinnerModule, MatProgressBarModule, MatSelectModule],
  exports: [MatToolbarModule, MatTabsModule, MatIconModule,
    FormsModule, MatInputModule, MatFormFieldModule,
    ReactiveFormsModule, MatAutocompleteModule, MatButtonModule, MatNativeDateModule,
    MatDatepickerModule, MatRadioModule, MatCardModule, MatGridListModule,
    MatDividerModule, MatExpansionModule, MatProgressSpinnerModule, MatProgressBarModule, MatSelectModule],
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
    HomeComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' }
    ]),
    AngularMaterialModule
  ],
  providers: [DataDisplayService, SmartFlightsFilterService],
  bootstrap: [AppComponent]
})
export class AppModule { }


