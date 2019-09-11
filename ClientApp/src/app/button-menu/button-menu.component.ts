import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { IMenuContent } from '../IMenuContetnt';
import { Subscription } from 'rxjs';
import { OptionsService } from '../options.service';

@Component({
  selector: 'button-menu',
  templateUrl: './button-menu.component.html',
  styleUrls: ['./button-menu.component.scss']
})
export class ButtonMenuComponent implements OnInit, OnDestroy {

  @Input('menucontent')
  menucontent : IMenuContent = {
    menubutton : {className : "dark", iconeName : "more_vert"},
    actions : [],
    links : []
  }

  @Output('actioneventer')
  actioneventer : EventEmitter<string> = new EventEmitter<string>();


  themes = {
    "brown" : true,
    "grey"  : false,
    "contrast" : false
  };

  themesStateSubsciption : Subscription ;

  constructor(private OptionsService : OptionsService) { 
    this.themesStateSubsciption = OptionsService.handler.subscribe(res => {
      this.themes = res.themes });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.themesStateSubsciption.unsubscribe();  
  }

  OnActionButtonClick(action : string) {
    this.actioneventer.emit(action);
  }

  GetThemeClass() : string {
    let props : Array<string> = Object.getOwnPropertyNames(this.themes);
    let themeName : string ; 
    props.forEach(element => {
      if(this.themes[element] == true) {
        themeName = element;
      }  
    });

    
    return themeName;
  }

 
}
