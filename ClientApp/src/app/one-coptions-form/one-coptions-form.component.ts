import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
// import { RouterEventHendlerService } from '../router-event-hendler.service';
// import { Subscription } from 'rxjs';
// import { Router } from '@angular/router';


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

  // private eventSubsciption : Subscription;
  constructor() {
    // (private router : Router)
    // this.eventSubsciption = this.router.events.subscribe(event  => {
    //   console.log("event in component", event);
    // });
   }

   ngAfterViewInit() {
    setTimeout(() => {
      this.panelExpanded = true;
      this.showMessages = true;
    }, 10);
  }


  ngOnInit() {
  }



  ngOnDestroy() {
    // console.log("OPTIONS DESTROIDE")
    // this.eventSubsciption.unsubscribe();
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
    }, 10);

  }

  GetLitleButtonsLayout() : string {
    if(this.panelExpanded) {
      return "row wrap";
    }
    else {
      return "column";
    }
  }

  GetPanelFlexOption() {
    if(this.panelExpanded) {
      return "1 0 20%";
    }
    else {
      return "1 0 5%";
    }
  }

  GetBodyFlexOption() {
    if(this.panelExpanded) {
      return "1 0 80%";
    }
    else {
      return "1 0 95%";
    }
  }

  GetFooterFlexOption() {
    if(this.panelExpanded) {
      return "1 0 ";
    }
    else {
      return "5 0 ";
    }
  }


  Test(message) {
    console.log(message);
  }
}



