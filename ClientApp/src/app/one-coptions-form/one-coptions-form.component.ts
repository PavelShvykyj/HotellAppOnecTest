import { IOneCSessionStatus } from './../counter/OneCSessionStatus';
import { animate, trigger, transition, query, stagger, animateChild } from '@angular/animations';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';
import { Subscription, Observable, Subject, BehaviorSubject } from 'rxjs';
import { disappearTrigger } from './one-coptions-form.animate'
import { OptionsService } from '../options.service'
import { ActivatedRoute } from '@angular/router';
import { IOneCOptions } from './IOneCOptions';
import { FormGroup, FormControl, Validators } from '@angular/forms';




@Component({
  selector: 'one-coptions-form',
  templateUrl: './one-coptions-form.component.html',
  styleUrls: ['./one-coptions-form.component.scss'],
  animations : [
    trigger('disappearmessages', [
      transition('void=>*', [
        query('@disappear', stagger(200,animateChild()))
      ])

    ]),
    disappearTrigger 

  ]
})
export class OneCOptionsFormComponent implements OnInit, OnDestroy, AfterViewInit {

  themes = {
    "brown" : false,
    "grey"  : false,
    "contrast"  : false,
  }
  
  panelExpanded : boolean = false;
  _Breakpoints : typeof Breakpoints = Breakpoints;
  screenState : {[key : string] : boolean } = {"no_show" : true}; 
  screnStateSubsciption : Subscription ;
  themesStateSubsciption : Subscription ;
  litleButtonsLayoutEventer = new BehaviorSubject<string>("column");
  litleButtonsLayout : Observable<string> = this.litleButtonsLayoutEventer.asObservable();
  messages : Array<{message_content : string, isError : boolean }> = [];  
  options : IOneCOptions;
  form : FormGroup;

  constructor(private breakpointObserver: BreakpointObserver, private OptionsService : OptionsService, private route: ActivatedRoute) {
    
    this.options = this.route.snapshot.data.onecoptions;
    
    this.form = new FormGroup({ 
      'BASE_URL' : new FormControl(this.options.BASE_URL, Validators.required),
      'LOGIN' : new FormControl(this.options.LOGIN, Validators.required),
      'MAX_BADREQUEST_COUNT' : new FormControl(this.options.MAX_BADREQUEST_COUNT, [Validators.required, Validators.min(1)]),
      'PASSWORD' : new FormControl(this.options.PASSWORD, Validators.required),
      'PING_FREQUENCY' : new FormControl(this.options.PING_FREQUENCY, [Validators.required, Validators.min(1000)]),
      'REQUEST_TIMEOUT' : new FormControl(this.options.REQUEST_TIMEOUT, [Validators.required, Validators.min(1000)]),
      'USE_LOG' : new FormControl(this.options.USE_LOG)
    })

    

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
    console.log(this.options);


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
    this.OptionsService.SetOptions({themes : this.themes});

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
      message_content : "На этой странице настраиваются параметры подключения к серверу 1С", 
      isError : false
    }
    this.messages.push(startmessage);
  }

  getErrorMessage(control : FormControl ) : string {
    if (control.hasError('required')) {
      return "поле не должно быть пустым..."
    }

    if (control.hasError('min')) {
      return `минимальное значение ${control.getError('min').min} ...`;
    }

    return "Значение заполнено не верно..."
    
  }


  // ОБРАБОТЧИКИ СОБЫТИЙ ФОРМЫ
  Cansel() {

  } 

  Save() {
    
  } 


  //  FORM GET SET

  get BASE_URL() {
    return this.form.get('BASE_URL');
  }
  get LOGIN() {
    return this.form.get('LOGIN');
  }
  get MAX_BADREQUEST_COUNT() {
    return this.form.get('MAX_BADREQUEST_COUNT');
  }
  get PASSWORD() {
    return this.form.get('PASSWORD');
  }
  get PING_FREQUENCY() {
    return this.form.get('PING_FREQUENCY');
  }
  get REQUEST_TIMEOUT() {
    return this.form.get('REQUEST_TIMEOUT');
  }
    
  get USE_LOG() {
    return this.form.get('USE_LOG');
  }

  
  
  
  
  
  
 
}



