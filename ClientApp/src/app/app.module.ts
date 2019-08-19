
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LayoutModule } from '@angular/cdk/layout';
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
import { PanelFormComponent } from './panel_form_shablon/panel-form.component';


/// MATERIAL COMPONENTS ///
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatMenuModule} from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';


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
    PanelFormComponent,
    PreloadpageComponent
    
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
    /// MATERIAL COMPONENTS ///
    FlexLayoutModule,
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    LayoutModule,
    //NgxSpinnerModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'counter', component: CounterComponent },
      { path: 'fetch-data', component: FetchDataComponent },
      { path: 'roomstock', component: RoomstockComponent },
      { path: 'onecoptions', component: OneCOptionsFormComponent },
      { path: 'shablon', component: PanelFormComponent },
    ])
  ],
  providers: [RouterEventHendlerService],
  bootstrap: [AppComponent]
})
export class AppModule { 

  // constructor(overlayContainer: OverlayContainer) {
  //   overlayContainer.getContainerElement().classList.add('brown-app-theme');
  //   overlayContainer.getContainerElement().classList.add('grey-app-theme');
  //   overlayContainer.getContainerElement().classList.add('contrast-app-theme');
  //}

}
