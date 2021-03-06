import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { RoomstockComponent } from './roomstock/roomstock.component';
//import { NgxSpinnerModule } from "ngx-spinner";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

/// MATERIAL COMPONENTS ///
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { OneCOptionsFormComponent } from './one-coptions-form/one-coptions-form.component';
import { RouterEventHendlerService } from './router-event-hendler.service';
import { PreloadpageComponent } from './preloadpage/preloadpage.component';

/// MATERIAL COMPONENTS ///


@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    RoomstockComponent,
    OneCOptionsFormComponent,
    PreloadpageComponent
    
  ],
  imports: [
    /// MATERIAL COMPONENTS ///
    MatProgressSpinnerModule,
    MatCheckboxModule,
    /// MATERIAL COMPONENTS ///
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    //NgxSpinnerModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'counter', component: CounterComponent },
      { path: 'fetch-data', component: FetchDataComponent },
      { path: 'roomstock', component: RoomstockComponent },
      { path: 'onecoptions', component: OneCOptionsFormComponent },
    ])
  ],
  providers: [RouterEventHendlerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
