import { IPanelContent } from '../IMenuContetnt';
import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';
import { Subscription, Observable,  BehaviorSubject } from 'rxjs';
import { OptionsService } from '../options.service'
import { ITCPStatus, TCPTaskType, ITCPTask } from './ITCPStatus';
import { TCPSessionLogSourse } from './tcp-session-logsourse'
import { catchError, finalize } from 'rxjs/operators';
import { PanelFormComponent } from '../panel_form_shablon/panel-form.component';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { TcptaskFormComponent } from '../tcptask-form/tcptask-form.component';


interface IBodyFlexStatus  {
  BodyLayout : string,
  BodyAlign : string
}


@Component({
  selector: 'tcp-sessions-form',
  templateUrl: './tcp-sessions-form.component.html',
  styleUrls: ['./tcp-sessions-form.component.scss'],
})
export class TCPSessionsFormComponent implements OnInit, OnDestroy, AfterViewInit {

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

      {
        name : ["Выполнить задание"],
        iconeName : "add_to_queue",
      },

    ],
    links : [ 
      {
        name : ["Настройки","приложения"],
        iconeName : "settings_applications",
        link : "/appoptions"
      },

      {
        name : ["Настройки TCP"],
        iconeName : "wifi_tethering",
        link : "/tcpoptions"
      },

      {
        name : ["Состояние", "подключения к TCP"],
        iconeName : "av_timer",
        link : "/tcpcounter"
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
  tasktype : typeof TCPTaskType = TCPTaskType
  screenState : {[key : string] : boolean } = {"no_show" : true}; 
  screnStateSubsciption : Subscription ;
  themesStateSubsciption : Subscription ;
  messagesSubsciption : Subscription ;
  BodyLayoutEventer = new BehaviorSubject<IBodyFlexStatus>({BodyLayout : "row", BodyAlign : "start start"});
  BodyLayout$ : Observable<IBodyFlexStatus> = this.BodyLayoutEventer.asObservable();
  
  sessionStatusUpdatingEventer = new BehaviorSubject<boolean>(false);
  sessionStatusUpdating$ = this.sessionStatusUpdatingEventer.asObservable();
  
  sessionstatus : ITCPStatus = this.EmptyTCPSessionStatus()
  options;
  
  /// table options
  displayedColumns: string[] = ['start', 'content', 'duration', 'status', 'error', 'errorcontent'];
  dataSource :  TCPSessionLogSourse;

  @ViewChild(PanelFormComponent, {static : false})
  panelform : PanelFormComponent  


  constructor(private breakpointObserver: BreakpointObserver, 
              private OptionsService : OptionsService,
              private dialog: MatDialog  
    ) {
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
    this.dataSource = new TCPSessionLogSourse(this.OptionsService);
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


    this.ShowMessage("На этой странице можно управлять сессиями TCP сервиса.",false);
 
  }

  EmptyTCPSessionStatus() : ITCPStatus {

    return  {    
      connected : false,
      workon : { 
        taskType : TCPTaskType.reconnect,
        parametr : "non"
      },
      bufersize : 0
    }

  }

  RefreshLog() {
    this.dataSource.GetLog();
  }

  GetOneCSesiionStatus() {

    this.sessionstatus = this.EmptyTCPSessionStatus();
    this.sessionStatusUpdatingEventer.next(true);
    
    this.OptionsService.GetTCPSesiionStatus()
      .pipe(
        catchError((err)=>{
          console.log(err);
          this.ShowMessage("Ошибка при обновлении сессии.", true)
          return JSON.stringify(this.EmptyTCPSessionStatus())}),
        finalize(() => {this.sessionStatusUpdatingEventer.next(false);}))
      .subscribe(res => 
        {
          this.ShowMessage( "Состояние сессии обновлено.", false)
          this.sessionstatus = JSON.parse(res);
        });
  }

  RefreshAll() {
    this.GetOneCSesiionStatus();
    this.dataSource.GetLog();
  }
 
  StartOneCSesiion() {
    this.sessionStatusUpdatingEventer.next(true);
    this.OptionsService.StartTCPSesiion()
      .pipe(finalize(() =>{
        this.RefreshAll();
        this.sessionStatusUpdatingEventer.next(false)}))
        .toPromise()
          .then(() =>this.ShowMessage( "Прошел запрос на соединение с TCP",false))
          .catch(err => this.ShowMessage("Ошибка при запросе на соединение с TCP",true));
  }

  StopOneCSesiion() {
    this.sessionStatusUpdatingEventer.next(true);
    this.OptionsService.StopTCPSesiion()
    .pipe(finalize(() =>{
      this.RefreshAll();
      this.sessionStatusUpdatingEventer.next(false)}))
      .toPromise()
        .then(() =>this.ShowMessage("Прошел запрос на разрыв TCP",false))
          .catch(err => this.ShowMessage("Ошибка при запросе на разрыв TCP", true));
    
    this.RefreshAll();
  }

  AddTask() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "300px"
    const dialogref = this.dialog.open(TcptaskFormComponent,dialogConfig);
    dialogref.afterClosed().subscribe(res => {
        if(res) {
          this.RequestAddTask(res as ITCPTask);
        }
    })
  }

  RequestAddTask(task : ITCPTask) {
    this.sessionStatusUpdatingEventer.next(true);
    this.OptionsService.AddTCPTask(task)
      .pipe(finalize(() =>{
        this.RefreshAll();
        this.sessionStatusUpdatingEventer.next(false)}))
        .toPromise()
          .then(() =>this.ShowMessage("Задача добавлена",false))
          .catch(err => this.ShowMessage("Ошибка при добавлении задачи",true));
  }

  ShowMessage(content : string , isError : boolean) {
    if(this.panelform.messages){
      this.panelform.messages.push({message_content : content, isError :  isError} )
    }
    
  }

  OnPanelAction(action : string ) {
    switch (action) {
     case "Запустить сессии":
       this.StartOneCSesiion();
       break;
     case "Остановить сессии":
        this.StopOneCSesiion();
        break;
     case "Выполнить задание":
          this.AddTask();
          break;
     case "Печатные формы":
          console.log("Печатные формы ");
          break;
     default:
       break;
   }
    

  }


}



 