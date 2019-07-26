import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { RouterEventHendlerService } from '../router-event-hendler.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnDestroy {
  isExpanded = false;

  private eventSubsciption : Subscription;
  constructor(private routeventer : RouterEventHendlerService) {
      this.eventSubsciption = this.routeventer.eventEmiter.subscribe(event  => {
      //console.log("In nav menu ",event);
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
