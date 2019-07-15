import { Component, OnInit } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IRoommStockInfo } from './roomstockinfo';

@Component({
  selector: 'app-roomstock',
  templateUrl: './roomstock.component.html',
  styleUrls: ['./roomstock.component.css']
})
export class RoomstockComponent implements OnInit {

  private BASE_URL: string = "/api";
  public datatable : Array<IRoommStockInfo> = [];
  private requststarted : boolean = false;
  private requststartedat : Date = new Date(0,0,0,0,0,0);
  private requstfinisedat : Date = new Date(0,0,0,0,0,0);
  private requstduration : Number = 0;

  constructor(private http: HttpClient) {


   }

  ngOnInit() {
  }

  Onectest() {
    let connection = this.BASE_URL + "/Values/roomstock/5";
    let headers = new HttpHeaders().append('Authorization', 'none').append('Content-Type', 'text/json')
    this.datatable = [];
    this.requststarted = true;
    this.requststartedat = new Date();
    this.requstfinisedat = new Date(0,0,0,0,0,0);
    this.requstduration = 0;
    let start = Date.now();

    this.http.get(connection, {
      headers: headers,
      observe: 'body',
      withCredentials: true,
      reportProgress: false,
      responseType: 'text'
    }).subscribe(res =>
      {
        this.requstfinisedat = new Date();
        this.requstduration = Date.now() - start;
        this.requststarted = false;

        this.datatable = JSON.parse(res)
      },
                 err => console.log(err) );


  }





}
