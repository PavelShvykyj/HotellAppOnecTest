import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { RouterEventHendlerService } from '../router-event-hendler.service';
import { NavigationStart, NavigationEnd } from '@angular/router';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent implements OnDestroy {
  isExpanded = false;
  isDataLoading = false;
  

  themes = {
    "brown" : true,
    "grey"  : false,
    "contrast"  : false,
  }

  private eventSubsciption : Subscription;
  constructor(private routeventer : RouterEventHendlerService, public breakpointObserver: BreakpointObserver) {
      this.eventSubsciption = this.routeventer.eventEmiter.subscribe(event  => {
      if (event instanceof NavigationStart) {
        this.isDataLoading = true;
      }
      else if(event instanceof NavigationEnd) {
        this.isDataLoading = false;
      }

      this.breakpointObserver
      .observe(['(min-width: 500px)'])
      .subscribe((state: BreakpointState) => {
        
        
        if (state.matches) {
          console.log('Viewport is 500px or over!');
        } else {
          console.log('Viewport is getting smaller!');
        }
      });
        
    })

   }
 
   ngOnDestroy() {
    this.eventSubsciption.unsubscribe();
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
