

import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';
import { Subscription, Observable, Subject, BehaviorSubject } from 'rxjs';

import { OptionsService } from '../options.service'
import { ActivatedRoute } from '@angular/router';
import { ITCPOptions } from './ITCPOptions';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PanelFormComponent } from '../panel_form_shablon/panel-form.component';
import { IPanelContent } from '../IMenuContetnt';




@Component({
  selector: 'tcp-options-form',
  templateUrl: './tcp-options-form.component.html',
  styleUrls: ['./tcp-options-form.component.scss'],

})
export class TCPOptionsFormComponent implements OnInit, OnDestroy, AfterViewInit {

  themes = {
    "brown" : false,
    "grey"  : false,
    "contrast"  : false,
  }
  
 
  _Breakpoints : typeof Breakpoints = Breakpoints;
  screenState : {[key : string] : boolean } = {"no_show" : true}; 
  screnStateSubsciption : Subscription ;
  themesStateSubsciption : Subscription ;
  
  options : ITCPOptions;
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


  constructor(private breakpointObserver: BreakpointObserver, private OptionsService : OptionsService, private route: ActivatedRoute) {
    
    this.options = this.route.snapshot.data.tcpoptions;
    
    this.form = new FormGroup({ 
      'TIMEOUT' : new FormControl(this.options.TIMEOUT, Validators.required),
      'LONG_TIMEOUT' : new FormControl(this.options.LONG_TIMEOUT, Validators.required),
      'SHORT_TIMEOUT' : new FormControl(this.options.SHORT_TIMEOUT, [Validators.required, Validators.min(1)]),
      'HOST' : new FormControl(this.options.HOST, Validators.required),
      'PORT' : new FormControl(this.options.PORT, Validators.required),
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
    this.ShowMessage("На этой странице настраиваются параметры подключения к TCP серверу", false);
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
        this.form.setValue((JSON.parse(res) as ITCPOptions));
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
    .SetTCPOptions(this.form.value)
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

 
  
  
   


  get TIMEOUT() {
    return this.form.get('TIMEOUT');
  }
  get LONG_TIMEOUT() {
    return this.form.get('LONG_TIMEOUT');
  }
  get SHORT_TIMEOUT() {
    return this.form.get('SHORT_TIMEOUT');
  }
  get HOST() {
    return this.form.get('HOST');
  }
  get PORT() {
    return this.form.get('PORT');
  }
    
  get USE_LOG() {
    return this.form.get('USE_LOG');
  }

  
  
  
  
  
  
 
}



