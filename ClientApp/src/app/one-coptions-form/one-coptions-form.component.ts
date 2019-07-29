import { Component, OnInit, OnDestroy } from '@angular/core';
// import { RouterEventHendlerService } from '../router-event-hendler.service';
// import { Subscription } from 'rxjs';
// import { Router } from '@angular/router';


@Component({
  selector: 'one-coptions-form',
  templateUrl: './one-coptions-form.component.html',
  styleUrls: ['./one-coptions-form.component.css']
})
export class OneCOptionsFormComponent implements OnInit, OnDestroy {

  // private eventSubsciption : Subscription;
  constructor() {
    // (private router : Router)
    // this.eventSubsciption = this.router.events.subscribe(event  => {
    //   console.log("event in component", event);
    // });
   }

  ngOnInit() {
  }

  ngOnDestroy() {
    // console.log("OPTIONS DESTROIDE")
    // this.eventSubsciption.unsubscribe();
  }

}
