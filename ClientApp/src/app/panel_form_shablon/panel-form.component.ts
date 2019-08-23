import { animate, trigger, transition, query, stagger, animateChild } from '@angular/animations';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';
import { Subscription, Observable, Subject, BehaviorSubject } from 'rxjs';
import { disappearTrigger } from './panel-form.animate'
import { OptionsService } from '../options.service'

@Component({
  selector: 'panel-form',
  templateUrl: './panel-form.component.html',
  styleUrls: ['./panel-form.component.scss'],
  animations : [
    trigger('disappearmessages', [
      transition('void=>*', [
        query('@disappear', stagger(200,animateChild()))
      ])

    ]),
    disappearTrigger 

  ]
})
export class PanelFormComponent implements OnInit, OnDestroy, AfterViewInit {

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

    let firstmessage = {
      message_content : "first user message", 
      isError : false
    }

   
    let message = {
      message_content : "some user message", 
      isError : false
    }

    let longmessage = {
      message_content : "some user message long long abra kadabra - is power", 
      isError : false
    }

    let erromessage = {
      message_content : "some error message", 
      isError : true
    }


    this.messages.push(firstmessage);
    this.messages.push(longmessage);
    this.messages.push(erromessage);
    this.messages.push(message);

  }


  Test(message) {
    console.log(message);
  }
}



