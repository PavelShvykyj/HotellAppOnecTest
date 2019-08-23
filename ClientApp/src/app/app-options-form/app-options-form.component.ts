import { animate, trigger, transition, query, stagger, animateChild } from '@angular/animations';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';
import { Subscription, Observable, Subject, BehaviorSubject } from 'rxjs';
import { disappearTrigger } from './app-options-form.animate'
import { OptionsService } from '../options.service'


@Component({
  selector: 'app-options-form',
  templateUrl: './app-options-form.component.html',
  styleUrls: ['./app-options-form.component.scss'],
  animations : [
    trigger('disappearmessages', [
      transition('void=>*', [
        query('@disappear', stagger(200,animateChild()))
      ])

    ]),
    disappearTrigger 

  ]
})
export class AppOptionsFormComponent implements OnInit, OnDestroy, AfterViewInit {

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
  
    // FAKE
    this.StarterMessages()

  }

   ngAfterViewInit() {
  }


  ngOnInit() {
    this.litleButtonsLayoutEventer.next(this.GetLitleButtonsLayout());
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
    console.log(message);
    this.messages.splice(this.messages.lastIndexOf(message),1);
  }

  /// FAKE

  StarterMessages() {

    let startmessage = {
      message_content : "На этой странице можно установить параметры приложения. Такие как цветовая гамма.", 
      isError : false
    }

    this.messages.push(startmessage);

  }


  Test(message) {
    console.log(message);
  }
}



