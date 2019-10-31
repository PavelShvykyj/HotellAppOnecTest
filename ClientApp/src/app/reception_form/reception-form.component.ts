
import { Component, OnInit, OnDestroy, AfterViewInit, HostListener, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';
import { Subscription, Observable,  BehaviorSubject } from 'rxjs';

import { OptionsService } from '../options.service'
import { IRange } from '../date-range-selector/date-range-selector.component';
import { IPanelContent } from '../IMenuContetnt';
import { PanelFormComponent } from '../panel_form_shablon/panel-form.component';
import { debounceTime } from 'rxjs/operators';


enum GridElementType {
  Period,
  SubPeriod,
  Box,
  BoxIntime,
  Header,
  HeaderPanel,
  FooterPanel,
  Empty
}

enum BoxIntimeStatus {
  free,
  reserved,
  accommodation,
  arrived,
  departure,
  cleaning,
  disabled
}

interface IGridElementOptions {
  rowspan: number,
  colspan: number
}

interface IPeriodData {
  title: string,
  subtitle: string,
  periodbegin: Date,
  periodlenth: number
}

interface ISubPeriodData {
  perioddata: IPeriodData
}

interface IBoxData {
  title: string,
  id: string,
  boxnumber: number
}

interface IBoxInTimeData {
  box: IBoxData,
  status: BoxIntimeStatus,
  periodbegin: Date
}

interface IHeaderData {
  title: string
}

interface IGridElementData {
  data: IPeriodData | ISubPeriodData | IBoxData | IBoxInTimeData | IHeaderData
}

interface IGridElementObject {
  gridoptions: IGridElementOptions,
  dataoptions: IGridElementData,
  elementtype : GridElementType
}


interface IGridOptions {
  cols: number
  rowHeight: string
}

interface IGridObjectData {
  options: IGridOptions,
  elements : Array<IGridElementObject>
}



@Component({
  selector: 'reception-form',
  templateUrl: './reception-form.component.html',
  styleUrls: ['./reception-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
  
})
export class ReceptionFormComponent implements OnInit, OnDestroy, AfterViewInit {

  themes = {
    "brown" : true,
    "grey"  : false,
    "contrast" : false
  }
  
  
  _Breakpoints : typeof Breakpoints = Breakpoints;
  screenState : {[key : string] : boolean } = {"no_show" : true}; 
  screnStateSubsciption : Subscription ;
  themesStateSubsciption : Subscription ;

  GridData: IGridObjectData = this.GetGridObjectExample();
  GridElementtype : typeof GridElementType = GridElementType;

  panelcontent : IPanelContent = {
    actions : [
      {
        name : ["Добавить"],
        iconeName : "add",
      },
      {
        name : ["Редактировать"],
        iconeName : "edit",
      },
      {
        name : ["Удалить"],
        iconeName : "delete",
      },
    ],
    links : [ 
      {
        name : ["Перейти"],
        iconeName : "send",
        link : "/"
      },

      {
        name : ["Перейти"],
        iconeName : "send",
        link : "/"
      },

      {
        name : ["Перейти"],
        iconeName : "send",
        link : "/"
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

  constructor(private breakpointObserver: BreakpointObserver, private Options : OptionsService, private changeDetector : ChangeDetectorRef) {
    this.themesStateSubsciption = Options.handler.subscribe(res => {
      this.themes = res.themes
      });

    this.screnStateSubsciption = this.breakpointObserver
    .observe([
              Breakpoints.Small,
              Breakpoints.XSmall,
              Breakpoints.Medium,
              Breakpoints.Tablet,
              Breakpoints.Web
            ])
            .pipe(
              debounceTime(200)
            )

    .subscribe((state: BreakpointState) => {
      console.log('event');
      let NewscreenState = state.breakpoints; 
      NewscreenState["no_show"] = false;
      if (this.screenState[this._Breakpoints.Small]  != NewscreenState[this._Breakpoints.Small]  || 
          this.screenState[this._Breakpoints.XSmall] != NewscreenState[this._Breakpoints.XSmall] ||
          this.screenState[this._Breakpoints.Medium] != NewscreenState[this._Breakpoints.Medium] ||
          this.screenState[this._Breakpoints.Web] != NewscreenState[this._Breakpoints.Web] )
         
      {
        
        console.log('resize');
        this.screenState = NewscreenState;
        this.screenState["no_show"] = false;
        this.ReformatRoomstockGreed();
        
      }
    });
  }

  //  @HostListener('window:resize', ['$event'])
  //  onResize(event) {   
  //   console.log('on resize');
  //  }


  ngAfterViewInit() {
    this.StarterMessages()
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.screnStateSubsciption.unsubscribe();
    this.themesStateSubsciption.unsubscribe();  
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


  StarterMessages() {
    this.ShowMessage("Основаня форма рецепции. Здесь можно поселить и выселить гостей",false);
  }


  ReformatRoomstockGreed() {    
    if(this.screenState[this._Breakpoints.Small] || this.screenState[this._Breakpoints.XSmall]) {
      this.SmallFormat();
      
    } else {
      this.Format();
    }
      
    this.changeDetector.detectChanges();
  }

  SmallFormat() {
    this.GridData = this.GetGridObjectExampleSmall();   
  }

  Format() {
    this.GridData = this.GetGridObjectExample();   
  }


  /// FAKE
  GetGridObjectExampleSmall(): IGridObjectData {
    let options : IGridOptions  = { cols: 21, rowHeight: "20px" };
    let res: IGridObjectData = {
      options: options,
      elements : []
    };

    let elementbox = {
      gridoptions: { rowspan: 2, colspan: 21 },
      dataoptions: {
        data: {
          title: "Flore 1",
          id: "Flore 1",
          boxnumber: "Flore 1"
        }
      },
      elementtype : GridElementType.Box
    }
    res.elements.push(elementbox);

    for (let index = 1; index < 15; index++) {
      let elementbox = {
        
          gridoptions: { rowspan: 2, colspan: 21 },
          dataoptions: {
            data: {
              title: "room " + index,
              id: index.toString(),
              boxnumber: index
            }
          },
          elementtype : GridElementType.Box
      }
      res.elements.push(elementbox)

      let MainPeriod : IGridElementObject = 
      {
        gridoptions: { rowspan: 2, colspan: 21 },
        dataoptions: {
          data:
          {
            title: "Month",
            subtitle: "2019",
            periodbegin: new Date(),
            periodlenth: 1
          }
        },
        elementtype : GridElementType.Period
      };
    
    res.elements.push(MainPeriod);  

      for (let indexdate = 1; indexdate < 32; indexdate++) {
        let elementboxintime: IGridElementObject = {
          gridoptions: { rowspan: 2, colspan: 3 },
          dataoptions: {
            data: {
              box: {
                title: "room " + index,
                id: index.toString(),
                boxnumber: index
              },
              status: BoxIntimeStatus.free,
              periodbegin: new Date(2019, 1, indexdate)

            }
          },
          elementtype : GridElementType.BoxIntime
        }
        res.elements.push(elementboxintime)
      }
    }
    return res;
  }

  /// FAKE
  GetGridObjectExample(): IGridObjectData {
    let empty : IGridElementObject  = {
      gridoptions: { rowspan: 2, colspan: 1 },
      dataoptions: {
        data: {
          title: "",
          subtitle: "",
          periodlenth: 0
        }
      },
      elementtype : GridElementType.Empty
    }
 
    let options : IGridOptions  = { cols: 105, rowHeight: "fit" };
    let res: IGridObjectData = {
      options: options,
      elements : []
    };

    let infopanel : IGridElementObject = {
      gridoptions: { rowspan: 3, colspan: 105 },
      dataoptions: { data: { title: "" } },
      elementtype : GridElementType.HeaderPanel
    }

    res.elements.push(infopanel);

    let header : IGridElementObject = {
      gridoptions: { rowspan: 4, colspan: 11 },
      dataoptions: { data: { title: "HOTEL" } },
      elementtype : GridElementType.Header
    }

    res.elements.push(header);

    let MainPeriod : IGridElementObject = 
      {
        gridoptions: { rowspan: 2, colspan: 93 },
        dataoptions: {
          data:
          {
            title: "Month",
            subtitle: "2019",
            periodbegin: new Date(),
            periodlenth: 1
          }
        },
        elementtype : GridElementType.Period
      };
    
    res.elements.push(MainPeriod);  
    res.elements.push(empty);

    for (let index = 1; index < 32; index++) {
      let element : IGridElementObject  = {
        gridoptions: { rowspan: 2, colspan: 3 },
        dataoptions: {
          data: {
            title: index.toString(),
            subtitle: "day",
            periodbegin: new Date(),
            periodlenth: 1
          }
        },
        elementtype : GridElementType.SubPeriod
      }
      res.elements.push(element);
    }

    res.elements.push(empty);

    let elementbox = {
      gridoptions: { rowspan: 2, colspan: 104 },
      dataoptions: {
        data: {
          title: "Flore 1",
          id: "Flore 1",
          boxnumber: "Flore 1"
        }
      },
      elementtype : GridElementType.Box
    }
    res.elements.push(elementbox);
    res.elements.push(empty);

    for (let index = 1; index < 15; index++) {
      let elementbox = {
        
          gridoptions: { rowspan: 2, colspan: 11 },
          dataoptions: {
            data: {
              title: "room " + index,
              id: index.toString(),
              boxnumber: index
            }
          },
          elementtype : GridElementType.Box
      }
      res.elements.push(elementbox)


      for (let indexdate = 1; indexdate < 32; indexdate++) {
        let elementboxintime: IGridElementObject = {
          gridoptions: { rowspan: 2, colspan: 3 },
          dataoptions: {
            data: {
              box: {
                title: "room " + index,
                id: index.toString(),
                boxnumber: index
              },
              status: BoxIntimeStatus.free,
              periodbegin: new Date(2019, 1, indexdate)

            }
          },
          elementtype : GridElementType.BoxIntime
        }
        res.elements.push(elementboxintime)
      }
      res.elements.push(empty);
    }
    

    let footerpanel : IGridElementObject = {
      gridoptions: { rowspan: 1, colspan: 105 },
      dataoptions: { data: { title: "" } },
      elementtype : GridElementType.FooterPanel
    }

    res.elements.push(footerpanel);
    
    
    return res;
  }

  GetEmtyGridObject() : IGridObjectData {
    let options : IGridOptions  = { cols: 105, rowHeight: "fit" };
    let res: IGridObjectData = {
      options: options,
      elements : []
    };

    return res;
  }

  OnRangeChange(range : IRange) {
    console.log(range.start);
    console.log(range.end);
  }

  ShowMessage(content : string , isError : boolean) {
    this.panelform.messages.push({message_content : content, isError :  isError} )
  }

  OnPanelAction(action : string ) {
    console.log(action);
  }

}



