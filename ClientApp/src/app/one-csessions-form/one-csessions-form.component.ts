import { animate, trigger, transition, query, stagger, animateChild } from '@angular/animations';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';
import { Subscription, Observable, Subject, BehaviorSubject, from } from 'rxjs';
import { disappearTrigger } from './one-csessions-form.animate'
import { OptionsService } from '../options.service'
import { ILoggmessage } from '../../loggmessage';
import { IOneCSessionStatus } from './OneCSessionStatus';
import { SessionLogSourse } from './one-csession-logsourse'
import { catchError, finalize } from 'rxjs/operators';


interface IBodyFlexStatus  {
  BodyLayout : string,
  BodyAlign : string
}


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
  messagesSubsciption : Subscription ;
  litleButtonsLayoutEventer = new BehaviorSubject<string>("column");
  litleButtonsLayout$ : Observable<string> = this.litleButtonsLayoutEventer.asObservable();
  
  BodyLayoutEventer = new BehaviorSubject<IBodyFlexStatus>({BodyLayout : "row", BodyAlign : "start start"});
  BodyLayout$ : Observable<IBodyFlexStatus> = this.BodyLayoutEventer.asObservable();
  
  
  sessionStatusUpdatingEventer = new BehaviorSubject<boolean>(false);
  sessionStatusUpdating$ = this.sessionStatusUpdatingEventer.asObservable();
  messages : Array<{message_content : string, isError : boolean }> = [];  

   
  sessionstatus : IOneCSessionStatus = this.EmptyOneCSessionStatus()
  options;
  

  /// table options
  displayedColumns: string[] = ['start', 'content', 'duration', 'status', 'error', 'errorcontent'];
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
      
      let BodyFlexStatus : IBodyFlexStatus;

      if(this.screenState[this._Breakpoints.XSmall] || this.screenState[this._Breakpoints.Small]) {
        BodyFlexStatus = {BodyLayout : "column", BodyAlign : "start stretch"}; 
        this.displayedColumns = ['start', 'content',  'status' ];
        
      }
      else {
        BodyFlexStatus = {BodyLayout : "row", BodyAlign : "start start"}; 
        this.displayedColumns = ['start', 'content', 'duration', 'status', 'error', 'errorcontent'];
      }
      
      this.BodyLayoutEventer.next(BodyFlexStatus);
      
    });
  
    
    this.StarterMessages()

  }

   ngAfterViewInit() {
  }


  ngOnInit() {
   
    this.litleButtonsLayoutEventer.next(this.GetLitleButtonsLayout());
    this.dataSource = new SessionLogSourse(this.OptionsService);
    this.messagesSubsciption = this.dataSource.messages$.subscribe(message => this.messages.push(message));
    this.RefreshAll();
  }

  ngOnDestroy() {
    this.messagesSubsciption.unsubscribe();
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

  RefreshLog() {
    this.dataSource.GetLog();
  }


  GetOneCSesiionStatus() {

    this.sessionstatus = this.EmptyOneCSessionStatus();
    this.sessionStatusUpdatingEventer.next(true);
    
    this.OptionsService.GetOneCSesiionStatus()
      .pipe(
        catchError((err)=>{
          console.log(err);
          this.messages.push({message_content: "Ошибка при обновлении сессии.",isError : true})
          return JSON.stringify(this.EmptyOneCSessionStatus())}),
        finalize(() => {this.sessionStatusUpdatingEventer.next(false);}))
      .subscribe(res => 
        {
          this.messages.push({message_content: "Состояние сессии обновлено.",isError : false})
          this.sessionstatus = JSON.parse(res);});
  }

  RefreshAll() {
    this.GetOneCSesiionStatus();
    this.dataSource.GetLog();
  }
 
  StartOneCSesiion() {
    this.sessionStatusUpdatingEventer.next(true);
    this.OptionsService.StartOneCSesiion()
      .pipe(finalize(() =>{
        this.RefreshAll();
        this.sessionStatusUpdatingEventer.next(false)}))
        .toPromise()
          .then(() =>this.messages.push({message_content: "Прошел запрос на соединение с 1С.",isError : false}))
          .catch(err => this.messages.push({message_content: "Ошибка при запросе на соединение с 1С.",isError : true}));
  }

  StopOneCSesiion() {
    this.sessionStatusUpdatingEventer.next(true);
    this.OptionsService.StopOneCSesiion()
    .pipe(finalize(() =>{
      this.RefreshAll();
      this.sessionStatusUpdatingEventer.next(false)}))
      .toPromise()
        .then(() =>this.messages.push({message_content: "Прошел запрос на разрыв 1С.",isError : false}))
          .catch(err => this.messages.push({message_content: "Ошибка при запросе на соединение с 1С.",isError : true}));
    
    this.RefreshAll();
  }


}



