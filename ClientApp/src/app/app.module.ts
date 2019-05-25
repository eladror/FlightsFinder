import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { SearchFlightsComponent } from './searchFlights/searchFlights.component';
import { FlightsResultsComponent } from './flightsResults/flightsResults.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatToolbarModule, MatTabsModule, MatIconModule, MatInputModule,
  MatFormFieldModule, MatAutocompleteModule, MatButtonModule, MatNativeDateModule, MatDatepickerModule, MatRadioModule,
} from '@angular/material';

@NgModule({
  imports: [MatToolbarModule, MatTabsModule, MatIconModule,
    FormsModule, MatInputModule, MatFormFieldModule,
    ReactiveFormsModule, MatAutocompleteModule, MatButtonModule, MatNativeDateModule,
    MatDatepickerModule, MatRadioModule],
  exports: [MatToolbarModule, MatTabsModule, MatIconModule,
    FormsModule, MatInputModule, MatFormFieldModule,
    ReactiveFormsModule, MatAutocompleteModule, MatButtonModule, MatNativeDateModule,
    MatDatepickerModule, MatRadioModule],
})
export class AngularMaterialModule { }
@NgModule({
  declarations: [
    AppComponent,
    SearchFlightsComponent,
    FlightsResultsComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'counter', component: CounterComponent },
      { path: 'fetch-data', component: FetchDataComponent },
    ]),
    AngularMaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }


