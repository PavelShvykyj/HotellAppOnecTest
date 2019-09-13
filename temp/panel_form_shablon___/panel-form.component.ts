import { animate, trigger, transition, query, stagger, animateChild } from '@angular/animations';
import { Component, OnInit, OnDestroy, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';
import { Subscription, Observable, Subject, BehaviorSubject } from 'rxjs';
import { disappearTrigger } from './panel-form.animate'
import { OptionsService } from '../options.service'
import { IMenuContent, IPanelContent, IMenuMessage } from '../IMenuContetnt';


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
export class PanelFormComponent implements OnInit, OnDestroy {

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
  
  
  @Input('messages')
  messages : IMenuMessage[] = [];  

  @Input('menucontent')
  menucontent : IPanelContent = {
    actions : [],
    links : [],
    print : []
}

  @Output('actioneventer')
  actioneventer : EventEmitter<string> = new EventEmitter<string>();
  
  constructor(private breakpointObserver: BreakpointObserver, private OptionsService : OptionsService) {
    this.themesStateSubsciption = OptionsService.handler.subscribe(res => {
      this.themes = res.themes
      });

    this.screnStateSubsciption = this.breakpointObserver
    .observe([
              
              Breakpoints.XSmall
            ])
    .subscribe((state: BreakpointState) => {
      
      let NewscreenState = state.breakpoints; 
      NewscreenState["no_show"] = false;
      if (this.screenState[this._Breakpoints.XSmall] != NewscreenState[this._Breakpoints.XSmall]) {
        this.screenState = NewscreenState;
        this.screenState["no_show"] = false;
        this.litleButtonsLayoutEventer.next(this.GetLitleButtonsLayout());  
      }
    });
  }

  ngOnInit() {
    this.litleButtonsLayoutEventer.next(this.GetLitleButtonsLayout());
  }

  ngOnDestroy() {
    this.screnStateSubsciption.unsubscribe();
    this.themesStateSubsciption.unsubscribe();  
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

  ClearMesaages() {
    this.messages = [];
  }
}



