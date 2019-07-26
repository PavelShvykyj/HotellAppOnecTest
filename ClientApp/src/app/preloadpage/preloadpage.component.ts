import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'preloadpage',
  templateUrl: './preloadpage.component.html',
  styleUrls: ['./preloadpage.component.css']
})
export class PreloadpageComponent implements OnInit {

  
  private _spenttime : Date = new Date();
  private spenttime : Date = this._spenttime;


  constructor() { 
    this.spenttime.setMinutes(0,0,0);
    setInterval(() => {
      
      let sec = this._spenttime.getSeconds();
      let min = this._spenttime.getMinutes();
      let ms = this._spenttime.getMilliseconds()+50;
      this._spenttime.setMinutes(min,sec,ms);
      this.spenttime = new Date();
      this.spenttime.setMinutes(min,sec,ms);
      
    },50);
  }

  ngOnInit() {
  }

}
