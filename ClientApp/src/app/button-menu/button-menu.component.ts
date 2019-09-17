import { Component,  Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { IMenuContent } from '../IMenuContetnt';
import { Subscription } from 'rxjs';
import { OptionsService } from '../options.service';

@Component({
  selector: 'button-menu',
  templateUrl: './button-menu.component.html',
  styleUrls: ['./button-menu.component.scss']
})
export class ButtonMenuComponent implements  OnDestroy {

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

  constructor(private Options : OptionsService) { 
    this.themesStateSubsciption = Options.handler.subscribe(res => {
      this.themes = res.themes });
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

    
    return themeName+" h-100";
  }

 
}
