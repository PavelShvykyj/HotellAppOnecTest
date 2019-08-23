import { OptionsService } from './../options.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RouterEventHendlerService } from '../router-event-hendler.service';
import { NavigationStart, NavigationEnd } from '@angular/router';
import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent implements OnDestroy, OnInit  {
  isExpanded = false;
  isDataLoading = false;
  
  _Breakpoints : typeof Breakpoints = Breakpoints;
  screenState : {[key : string] : boolean } = {"no_show" : true}; 
  
  


  themes = {
    "brown" : false,
    "grey"  : false,
    "contrast"  : false,
  }

  private eventSubsciption : Subscription ;
  private screnStateSubsciption : Subscription ;

  
  constructor(private routeventer : RouterEventHendlerService, private breakpointObserver: BreakpointObserver, private OptionsService : OptionsService )  {
      
     OptionsService.GetOptions();
     OptionsService.handler.subscribe(res => {
      this.themes = res.themes
      });
    
     this.eventSubsciption = this.routeventer.eventEmiter.subscribe(event  => {
      if (event instanceof NavigationStart) {
        this.isDataLoading = true;
      }
      else if(event instanceof NavigationEnd) {
        this.isDataLoading = false;
      }



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
      });
        
    })

   }
 
   ngOnDestroy() {
    this.eventSubsciption.unsubscribe();
    this.screnStateSubsciption.unsubscribe();
   }

   ngOnInit() {
   
    

   }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
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
        themeName = element+"-theme-nav";
      }  
    });

    
    return themeName;
  }

}
