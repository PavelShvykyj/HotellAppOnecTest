import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';
import { Subscription, Observable, Subject } from 'rxjs';


@Component({
  selector: 'one-coptions-form',
  templateUrl: './one-coptions-form.component.html',
  styleUrls: ['./one-coptions-form.component.scss']
})
export class OneCOptionsFormComponent implements OnInit, OnDestroy, AfterViewInit {

  themes = {
    "brown" : true,
    "grey"  : false,
    "contrast" : false
  }
  
  panelExpanded : boolean = false;
  showMessages : boolean = false;
  _Breakpoints : typeof Breakpoints = Breakpoints;
  screenState : {[key : string] : boolean } = {"no_show" : true}; 
  screnStateSubsciption : Subscription ;
  litleButtonsLayoutEventer = new Subject<string>();
  litleButtonsLayout : Observable<string> = this.litleButtonsLayoutEventer.asObservable();


  
  constructor(private breakpointObserver: BreakpointObserver) {
  
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
  
  }

   ngAfterViewInit() {
    setTimeout(() => {
      this.ChangeExpandedPanel();
      this.showMessages = true;
    }, 10);
  }


  ngOnInit() {
  }



  ngOnDestroy() {
    this.screnStateSubsciption.unsubscribe(); 
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
    setTimeout(() => {
      this.showMessages = this.panelExpanded;
      this.litleButtonsLayoutEventer.next(this.GetLitleButtonsLayout());
    }, 10);

  }

  GetLitleButtonsLayout() : string {
    if(this.panelExpanded || this.screenState[this._Breakpoints.XSmall]) {
      console.log("row wrap");
      return "row wrap";
    }
    else {
      console.log("column");
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

  GetBodyFlexOption() {
    return "1 0 auto";
    // if(this.panelExpanded) {
    //   return "1 0 80%";
    // }
    // else {
    //   return "1 0 95%";
    // }
  }

  GetFooterFlexOption() {
    if(this.panelExpanded) {
      return "1 0 auto";
    }
    else {
      return "5 0 auto";
    }
  }


  Test(message) {
    console.log(message);
  }
}



