
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { IMenuContent } from '../IMenuContetnt';
import { NgModel } from '@angular/forms';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import { OptionsService } from '../options.service';

export interface IRange {
  start : Date,
  end : Date
}


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

    links : [
      {name : "home",
      iconeName : "home",
      link : "/" }
    ]

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

  _rangestart : Date = this.AddToDate(new Date(),0,0,-10);
  _rangeend : Date  = this.AddToDate(new Date(),0,0,10); 

  @Output('RangeChange')
  RangeChangeTrigger : EventEmitter<IRange> = new EventEmitter<IRange>();

  @Input('AutoEmit')
  AutoEmit : boolean = false;

  constructor(private Options : OptionsService) { }

  ngOnInit() {
  }

  EmitChangeRange() {
    if(this._rangestart && this._rangeend && this._rangeend>= this._rangestart) {
      let res : IRange = {
        start : this._rangestart,
        end : this._rangeend
      }
      this.RangeChangeTrigger.emit(res);
    }
  }

  OnMenuActionForward(action : string) {
    let days : number = 0;
    let months : number = 0;
    switch (action) {
      case "week":
        days = 7
        break;
      case "10 days":
        days = 10;
        break;
      case "month":
        months = 1;
            break;
      default:
        break;
    }
    this._rangestart = this.AddToDate(this._rangestart,0,months,days);
    this._rangeend = this.AddToDate(this._rangeend,0,months,days);
    this.EmitChangeRange()
  }

  OnMenuActionRewind(action : string) {
    let days : number = 0;
    let months : number = 0;
    switch (action) {
      case "week":
        days = -7
        break;
      case "10 days":
        days = -10;
        break;
      case "month":
        months = -1;
            break;
      default:
        break;
    }
    this._rangestart = this.AddToDate(this._rangestart,0,months,days);
    this._rangeend = this.AddToDate(this._rangeend,0,months,days);
    this.EmitChangeRange()
  }

  ChangeRange(model : NgModel , days : number) {
    model.control.setValue(this.AddToDate(model.control.value,0,0,days));
    this.EmitChangeRange()
  }

  DateChangeEvent(event : MatDatepickerInputEvent<Date> ,rangestartref : NgModel ,rangeendref : NgModel) {
    if(rangestartref.valid && rangeendref.valid && this.AutoEmit) {
      this.EmitChangeRange()
    }
  }


  AddToDate(startDate : Date ,
            years : number = 0, 
            months : number = 0,                
            days : number = 0,
            hours : number = 0) : Date {

    let res : Date = new Date(startDate.getFullYear()+years,
                              startDate.getMonth()+months,
                              startDate.getDate()+days,
                              startDate.getHours()+hours      )
    
                              return res;
  }

  
}
