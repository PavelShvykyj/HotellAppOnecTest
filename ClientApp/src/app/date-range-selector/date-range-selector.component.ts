import { Component, OnInit } from '@angular/core';
import { IMenuContent } from '../IMenuContetnt';

@Component({
  selector: 'date-range-selector',
  templateUrl: './date-range-selector.component.html',
  styleUrls: ['./date-range-selector.component.scss']
})
export class DateRangeSelectorComponent implements OnInit {

  menucontetnt_fast_forward : IMenuContent = {
    actions : [
      {
        name : "week",
        iconeName : "add"
      },

      {
        name : "10 days",
        iconeName : "add"
      },

      {
        name : "month",
        iconeName : "add"
      },

    ],
    menubutton : {
      className : "primary",
      iconeName : "fast_forward"
    },

    links : []

  }


  menucontetnt_fast_rewind : IMenuContent = {
    actions : [
      {
        name : "week",
        iconeName : "remove"
      },

      {
        name : "10 days",
        iconeName : "remove"
      },

      {
        name : "month",
        iconeName : "remove"
      },

    ],
    menubutton : {
      className : "primary",
      iconeName : "fast_rewind"
    },

    links : []

  }

  constructor() { }

  ngOnInit() {
  }

  OnMenuActionForward(action : string) {
    // arrow_forward_ios 
  }

  OnMenuActionRewind(action : string) {
    // arrow_forward_ios 
  }

  
}
