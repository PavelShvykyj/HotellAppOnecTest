import { animate, trigger, transition, query, stagger, animateChild } from '@angular/animations';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';
import { Subscription, Observable, Subject, BehaviorSubject, from } from 'rxjs';
import { disappearTrigger } from './one-csessions-form.animate'
import { OptionsService } from '../options.service'
import { ILoggmessage } from '../../loggmessage';
import { IOneCSessionStatus } from './OneCSessionStatus';
import { SessionLogSourse } from './one-csession-logsourse'


@Component({
  selector: 'one-csessions-form',
  templateUrl: './one-csessions-form.component.html',
  styleUrls: ['./one-csessions-form.component.scss'],
  animations : [
    trigger('disappearmessages', [
      transition('void=>*', [
        query('@disappear', stagger(200,animateChild()))
      ])

    ]),
    disappearTrigger 

  ]
})
export class OneCSessionsFormComponent implements OnInit, OnDestroy, AfterViewInit {

  themes = {
    "brown" : true,
    "grey"  : false,
    "contrast" : false
  }
  
  panelExpanded : boolean = false;
  _Breakpoints : typeof Breakpoints = Breakpoints;
  screenState : {[key : string] : boolean } = {"no_show" : true}; 
  screnStateSubsciption : Subscription ;
  themesStateSubsciption : Subscription ;
  litleButtonsLayoutEventer = new BehaviorSubject<string>("column");
  litleButtonsLayout : Observable<string> = this.litleButtonsLayoutEventer.asObservable();
  messages : Array<{message_content : string, isError : boolean }> = [];  

   
  sessionstatus : IOneCSessionStatus = this.EmptyOneCSessionStatus()
  options;
  requeststarted : boolean = false;

  /// table options
  displayedColumns: string[] = ['start', 'content',   'duration', 'status', 'error', 'errorcontent'];
  dataSource :  SessionLogSourse;
  
  constructor(private breakpointObserver: BreakpointObserver, private OptionsService : OptionsService) {
    this.themesStateSubsciption = OptionsService.handler.subscribe(res => {
      this.themes = res.themes
      });



    this.screnStateSubsciption = this.breakpointObserver
    .observe([
              Breakpoints.Large, 
              Breakpoints.Medium,
              Breakpoints.Small,
              Breakpoints.XSmall
            ])
    .subscribe((state: BreakpointState) => {
      
      this.screenState = state.breakpoints; 
      this.screenState["no_show"] = false;
      this.litleButtonsLayoutEventer.next(this.GetLitleButtonsLayout());  
      
    });
  
    
    this.StarterMessages()

  }

   ngAfterViewInit() {
  }


  ngOnInit() {
    this.litleButtonsLayoutEventer.next(this.GetLitleButtonsLayout());
    this.dataSource = new SessionLogSourse(this.OptionsService);
    this.dataSource.GetLog();

  }

  ngOnDestroy() {
    this.screnStateSubsciption.unsubscribe();
    this.themesStateSubsciption.unsubscribe();  
  }

  SetTheme(theme : string) {
    let props : Array<string> = Object.getOwnPropertyNames(this.themes);
    props.forEach(element => {
      this.themes[element] = false;
    });

    this.themes[theme] = true;

  }

  ChangeExpandedPanel() {
    this.panelExpanded = !this.panelExpanded;
    this.litleButtonsLayoutEventer.next(this.GetLitleButtonsLayout());
  }

  GetLitleButtonsLayout() : string {
    if(this.panelExpanded || this.screenState[this._Breakpoints.XSmall]) {
      return "row wrap";
    } 
    else {
      return "column";
    }
  }

  GetPanelFlexOption() {
    if(this.panelExpanded && !this.screenState[this._Breakpoints.XSmall]) {
      return "1 0 252px";
    }
    else if(!this.panelExpanded && !this.screenState[this._Breakpoints.XSmall]) {
      return "1 0 64px";
    }
    else {
      return "";
    }
  }

  GetThemeClass() : string {
    let props : Array<string> = Object.getOwnPropertyNames(this.themes);
    let themeName : string ; 
    props.forEach(element => {
      if(this.themes[element] == true) {
        themeName = element+"-theme-panel";
      }  
    });
    return themeName;
  }

  OnPanelMessageClick(message) {
    console.log(message);
    this.messages.splice(this.messages.lastIndexOf(message),1);
  }

  StarterMessages() {

    let startmessage = {
      message_content : "На этой странице можно управлять сессиями сервиса 1С.", 
      isError : false
    }

    this.messages.push(startmessage);
 
  }

  ClearMesaages() {
    this.messages = [];
  }

  EmptyOneCSessionStatus() : IOneCSessionStatus {

    return  {    
      LastResponseStatus : 0,
      BadResponseCount : 0,
      PingTimerStarted : false, 
      OneCSesionId : ""
    }

  }

  fakeclick() {
    this.requeststarted = !this.requeststarted;
  }
}



