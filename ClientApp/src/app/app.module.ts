
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LayoutModule } from '@angular/cdk/layout';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule} from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
//import { NgxSpinnerModule } from "ngx-spinner";



//// INTERNAL (OWN CREATED elements)
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { RoomstockComponent } from './roomstock/roomstock.component';
import { RouterEventHendlerService } from './router-event-hendler.service';
import { PreloadpageComponent } from './preloadpage/preloadpage.component';
import { OneCOptionsFormComponent } from './one-coptions-form/one-coptions-form.component';
import { OneCSessionsFormComponent } from './one-csessions-form/one-csessions-form.component';
import { AppOptionsFormComponent } from './app-options-form/app-options-form.component';
import { PanelFormComponent } from './panel_form_shablon/panel-form.component';
import { OptionsService } from './options.service';
import { OneCOptionsResolver } from './one-coptions-form/one-coptions-form.resolver';
import { ReceptionFormComponent } from './reception_form/reception-form.component';
import { ReceptionSubperiodComponent } from './reception-subperiod/reception-subperiod.component';
import { DateRangeSelectorComponent } from './date-range-selector/date-range-selector.component';

/// MATERIAL COMPONENTS ///
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatMenuModule} from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card'
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTableModule} from '@angular/material/table';
import {MatBadgeModule} from '@angular/material/badge';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ButtonMenuComponent } from './button-menu/button-menu.component';      
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';


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
    OneCSessionsFormComponent,
    AppOptionsFormComponent,
    PanelFormComponent,
    PreloadpageComponent,
    ReceptionFormComponent,
    ReceptionSubperiodComponent,
    DateRangeSelectorComponent,
    ButtonMenuComponent
  ],
  imports: [
    /// MATERIAL COMPONENTS ///
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatMenuModule,
    MatToolbarModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatTableModule,
    MatBadgeModule,
    MatGridListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    /// MATERIAL COMPONENTS ///
    FlexLayoutModule,
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,

    //NgxSpinnerModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'counter', component: OneCSessionsFormComponent },
      { path: 'fetch-data', component: DateRangeSelectorComponent },
      { path: 'roomstock', component: ReceptionFormComponent },
      { path: 'appoptions', component: AppOptionsFormComponent },
      { path: 'onecoptions', component: OneCOptionsFormComponent, resolve : {onecoptions : OneCOptionsResolver} },
      { path: 'shablon', component: PanelFormComponent },
    ])
  ],
  providers: [RouterEventHendlerService,
              OptionsService,
              OneCOptionsResolver,
              MatDatepickerModule,
              {provide: MAT_DATE_LOCALE, useValue: 'ru-RU'},
              ],
  bootstrap: [AppComponent]
})
export class AppModule { 

  

}
