import {  IPanelContent } from './../IMenuContetnt';

import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';
import { Subscription, Observable,  BehaviorSubject } from 'rxjs';
import { OptionsService } from '../options.service'
import { IOneCSessionStatus } from './IOneCSessionStatus';
import { SessionLogSourse } from './one-csession-logsourse'
import { catchError, finalize } from 'rxjs/operators';
import { PanelFormComponent } from '../panel_form_shablon/panel-form.component';


interface IBodyFlexStatus  {
  BodyLayout : string,
  BodyAlign : string
}


@Component({
  selector: 'one-csessions-form',
  templateUrl: './one-csessions-form.component.html',
  styleUrls: ['./one-csessions-form.component.scss'],
})
export class OneCSessionsFormComponent implements OnInit, OnDestroy, AfterViewInit {

  themes = {
    "brown" : true,
    "grey"  : false,
    "contrast" : false
  }

  
  panelcontent : IPanelContent = {
    actions : [
      {
        name : ["Остановить сессии"],
        iconeName : "lock",
      },

      {
        name : ["Запустить сессии"],
        iconeName : "lock_open",
      },
    ],
    links : [ 
      {
        name : ["Настройки","приложения"],
        iconeName : "settings_applications",
        link : "/appoptions"
      },

      {
        name : ["Настройки 1C"],
        iconeName : "build",
        link : "/onecoptions"
      },

      {
        name : ["Состояние", "подключения к 1С"],
        iconeName : "av_timer",
        link : "/counter"
      }
     ],
    print : [      
      {
        name : ["Печатные формы", " не назначены."],
        iconeName : "cancel",
      }
     ]
    }


  
  _Breakpoints : typeof Breakpoints = Breakpoints;
  
  screenState : {[key : string] : boolean } = {"no_show" : true}; 
  screnStateSubsciption : Subscription ;
  themesStateSubsciption : Subscription ;
  messagesSubsciption : Subscription ;
  
  BodyLayoutEventer = new BehaviorSubject<IBodyFlexStatus>({BodyLayout : "row", BodyAlign : "start start"});
  BodyLayout$ : Observable<IBodyFlexStatus> = this.BodyLayoutEventer.asObservable();
  
  sessionStatusUpdatingEventer = new BehaviorSubject<boolean>(false);
  sessionStatusUpdating$ = this.sessionStatusUpdatingEventer.asObservable();
  
  sessionstatus : IOneCSessionStatus = this.EmptyOneCSessionStatus()
  options;
  
  /// table options
  displayedColumns: string[] = ['start', 'content', 'duration', 'status', 'error', 'errorcontent'];
  dataSource :  SessionLogSourse;

  @ViewChild(PanelFormComponent, {static : false})
  panelform : PanelFormComponent  


  constructor(private breakpointObserver: BreakpointObserver, private OptionsService : OptionsService) {
    this.themesStateSubsciption = OptionsService.handler.subscribe(res => {
      this.themes = res.themes
      });



    this.screnStateSubsciption = this.breakpointObserver
    .observe([
              Breakpoints.Small,
              Breakpoints.XSmall
            ])
    .subscribe((state: BreakpointState) => {
      
      this.screenState = state.breakpoints; 
      this.screenState["no_show"] = false;
      
      
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
  
    
    

  }

   ngAfterViewInit() {
    this.StarterMessages();
  }


  ngOnInit() {
   
    
    this.dataSource = new SessionLogSourse(this.OptionsService);
    this.messagesSubsciption = this.dataSource.messages$.subscribe(message  =>  this.ShowMessage(message.message_content, message.isError));
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


  StarterMessages() {


    this.ShowMessage("На этой странице можно управлять сессиями сервиса 1С.",false);
 
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
          this.ShowMessage("Ошибка при обновлении сессии.", true)
          return JSON.stringify(this.EmptyOneCSessionStatus())}),
        finalize(() => {this.sessionStatusUpdatingEventer.next(false);}))
      .subscribe(res => 
        {
          this.ShowMessage( "Состояние сессии обновлено.", false)
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
          .then(() =>this.ShowMessage( "Прошел запрос на соединение с 1С.",false))
          .catch(err => this.ShowMessage("Ошибка при запросе на соединение с 1С.",true));
  }

  StopOneCSesiion() {
    this.sessionStatusUpdatingEventer.next(true);
    this.OptionsService.StopOneCSesiion()
    .pipe(finalize(() =>{
      this.RefreshAll();
      this.sessionStatusUpdatingEventer.next(false)}))
      .toPromise()
        .then(() =>this.ShowMessage("Прошел запрос на разрыв 1С.",false))
          .catch(err => this.ShowMessage("Ошибка при запросе на соединение с 1С.", true));
    
    this.RefreshAll();
  }

  ShowMessage(content : string , isError : boolean) {
    this.panelform.messages.push({message_content : content, isError :  isError} )
  }


  OnPanelAction(action : string ) {
   

    switch (action) {
     case "Запустить сессии":
       this.StartOneCSesiion();
       break;
   
      case "Остановить сессии":
        this.StopOneCSesiion();
        break;
      case "Печатные формы":
          console.log("Печатные формы ");
          break;
        
     
     default:
       break;
   }
    

  }


}



