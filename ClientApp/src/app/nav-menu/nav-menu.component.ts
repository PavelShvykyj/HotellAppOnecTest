import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { RouterEventHendlerService } from '../router-event-hendler.service';
import { NavigationStart, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnDestroy {
  isExpanded = false;
  isDataLoading = false;


  private eventSubsciption : Subscription;
  constructor(private routeventer : RouterEventHendlerService) {
      this.eventSubsciption = this.routeventer.eventEmiter.subscribe(event  => {
      if (event instanceof NavigationStart) {
        this.isDataLoading = true;
      }

      else if(event instanceof NavigationEnd) {
        
        setTimeout(() => {
          this.isDataLoading = false;
        }, 2500);
      }

      
        //console.log("In nav menu ", event);
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
}
