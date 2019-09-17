

import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';
import { Subscription, Observable, Subject, BehaviorSubject } from 'rxjs';

import { OptionsService } from '../options.service'
import { ActivatedRoute } from '@angular/router';
import { IOneCOptions } from './IOneCOptions';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PanelFormComponent } from '../panel_form_shablon/panel-form.component';
import { IPanelContent } from '../IMenuContetnt';




@Component({
  selector: 'one-coptions-form',
  templateUrl: './one-coptions-form.component.html',
  styleUrls: ['./one-coptions-form.component.scss'],

})
export class OneCOptionsFormComponent implements OnInit, OnDestroy, AfterViewInit {

  themes = {
    "brown" : false,
    "grey"  : false,
    "contrast"  : false,
  }
  
 
  _Breakpoints : typeof Breakpoints = Breakpoints;
  screenState : {[key : string] : boolean } = {"no_show" : true}; 
  screnStateSubsciption : Subscription ;
  themesStateSubsciption : Subscription ;
  
  options : IOneCOptions;
  form : FormGroup;

  @ViewChild(PanelFormComponent, {static : false})
  panelform : PanelFormComponent  

  panelcontent : IPanelContent = {
    actions : [],
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
              Breakpoints.Small,
              Breakpoints.XSmall
            ])
    .subscribe((state: BreakpointState) => {
      
      this.screenState = state.breakpoints; 
      this.screenState["no_show"] = false;
      
      
    });
  
    
    

  }

   ngAfterViewInit() {
    this.StarterMessages()
  }


  ngOnInit() {
  }



  ngOnDestroy() {
    this.screnStateSubsciption.unsubscribe(); 
    this.themesStateSubsciption.unsubscribe(); 
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
    this.ShowMessage("На этой странице настраиваются параметры подключения к серверу 1С", false);
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
    this.OptionsService
    .GetOneCOptions()
    .toPromise()
    .then(res =>
      {
        this.form.setValue((JSON.parse(res) as IOneCOptions));
        this.ShowMessage("Настройки успешно считаны", false);
      })
    .catch(err =>
      {
        console.log(err);
        this.ShowMessage("При получении настроек произошли ошибки", true);
      });
  } 

  Save() {
    if(! this.form.valid) {
      this.ShowMessage("Данные заполнены не верно. Сохранение невозможно", true);

      return;
    }
    
    
    this.OptionsService
    .SetOneCOptions(this.form.value)
    .toPromise()
    .then(res =>
      {
        this.ShowMessage("Настройки успешно сохранены", false);
      })
    .catch(err =>
      {
        console.log(err);
        this.ShowMessage("При сохранении настроек произошли ошибки", true);
      });

  } 
 
 
  ShowMessage(content : string , isError : boolean) {
    this.panelform.messages.push({message_content : content, isError :  isError} )
  }


  OnPanelAction(action : string ) {
    console.log(action);
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



