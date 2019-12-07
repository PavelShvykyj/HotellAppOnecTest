import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { OptionsService } from '../options.service'
import { AngularFirestore } from '@angular/fire/firestore';
import { IPanelContent } from '../IMenuContetnt';
import { PanelFormComponent } from '../panel_form_shablon/panel-form.component';



@Component({
  selector: 'app-options-form',
  templateUrl: './app-options-form.component.html',
  styleUrls: ['./app-options-form.component.scss'],

})
export class AppOptionsFormComponent implements OnInit, OnDestroy, AfterViewInit {

  themes = {
    "brown" : false,
    "grey"  : false,
    "contrast"  : false,
  }
  
  
  _Breakpoints : typeof Breakpoints = Breakpoints;
  screenState : {[key : string] : boolean } = {"no_show" : true}; 
  screnStateSubsciption : Subscription ;
  themesStateSubsciption : Subscription ;
  
  panelcontent : IPanelContent = {
    actions : [],
    links : [ 
      {
        name : ["Настройки","приложения"],
        iconeName : "settings_applications",
        link : "/appoptions"
      },

      {
        name : ["Настройки 1C"],
        iconeName : "build",
        link : "/onecoptions"
      },


      {
        name : ["Состояние", "подключения к 1С"],
        iconeName : "av_timer",
        link : "/counter"
      }
     ],
    print : [      
      {
        name : ["Печатные формы", " не назначены."],
        iconeName : "cancel",
      }
     ]
    }
  
  @ViewChild(PanelFormComponent, {static : false})
  panelform : PanelFormComponent  


  constructor(private breakpointObserver: BreakpointObserver, private OptionsService : OptionsService, private fdb : AngularFirestore ) {
    
    this.themesStateSubsciption = OptionsService.handler.subscribe(res => {
      this.themes = res.themes
      });


    this.screnStateSubsciption = this.breakpointObserver
    .observe([
              Breakpoints.Small,
              Breakpoints.XSmall
            ])
    .subscribe((state: BreakpointState) => {
      
      this.screenState = state.breakpoints; 
      this.screenState["no_show"] = false;
      
      
    });
  
  
  }

   ngAfterViewInit() {
    this.ShowMessage("На этой странице можно устанвить общие настройки программы.", false)
  }


  ngOnInit() {
    
  }



  ngOnDestroy() {
    this.screnStateSubsciption.unsubscribe(); 
    this.themesStateSubsciption.unsubscribe(); 
  }


  SetTheme(theme : string) {
    let props : Array<string> = Object.getOwnPropertyNames(this.themes);
    props.forEach(element => {
      this.themes[element] = false;
    });

    this.themes[theme] = true;
    this.OptionsService.SetOptions({themes : this.themes});

  }





  GetThemeClass() : string {
    let props : Array<string> = Object.getOwnPropertyNames(this.themes);
    let themeName : string ; 
    props.forEach(element => {
      if(this.themes[element] == true) {
        themeName = element+"-theme-panel";
      }  
    });

    
    return themeName;
  }



  
  
  TestFB() {
    
    
    
    let start : number =  Date.now();
    this.ShowMessage('start '+ start, false);

    // this.fdb.collection('courses',ref => ref.where('seqNo','>=',1).where('seqNo','<=',4).orderBy('seqNo').orderBy('lessonsCount'))
    //         .snapshotChanges()
    //         .pipe(
    //           map(snaps => {
    //             return snaps.map(snap => {
    //               let fulldata : any = snap.payload.doc.data();
    //               return {id : snap.payload.doc.id, 
    //                       title : fulldata.titles.description,
    //                       s : fulldata.seqNo,
    //                       l : fulldata.lessonsCount}
    //             })
    //           }), first())
    //         .subscribe(val =>{
    //           let duration = start - Date.now()
    //           this.messages.push({isError : false , message_content : 'duration '+ duration})
              
              
    //         } );

  }
  
  ShowMessage(content : string , isError : boolean) {
    this.panelform.messages.push({message_content : content, isError :  isError} )
  }


  OnPanelAction(action : string ) {
    console.log(action);
  }


}



