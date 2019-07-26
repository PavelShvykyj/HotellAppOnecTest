import { async } from '@angular/core/testing';
import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ILoggmessage } from '../../loggmessage';
import { IOneCSessionStatus } from './OneCSessionStatus';
//import { NgxSpinnerService } from "ngx-spinner";



@Component({
  selector: 'app-counter-component',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.css']
})
export class CounterComponent {
  public currentCount = 0;
  private BASE_URL: string = "/api";
  public log : Array<ILoggmessage> = [];
  public sessionstatus : IOneCSessionStatus = this.EmptyOneCSessionStatus()
  public options;
  public requeststarted : boolean = false;

  public incrementCounter() {
    this.currentCount++;
  }

  
  constructor(private http: HttpClient
              //private spinner: NgxSpinnerService
              ) 
  {
    
    
  }


  SetOptions() {

    if(this.options == undefined) {
      console.log("empty options");
      return;
    }

    let connection = this.BASE_URL + "/Values/onecoptions";
    let headers = new HttpHeaders().append('Authorization', 'none').append('Content-Type', 'text/json')
    
    this.options.MAX_BADREQUEST_COUNT = 5; 
    
    console.log("out ",this.options);

    this.http.post(connection,this.options, {
      headers: headers,
      
      observe: 'body',
      withCredentials: true,
      reportProgress: false,
      responseType: 'text'
    }).subscribe(res => console.log("In ",res),
                 err => console.log(err) );
  }


  GetOptions() {

    let connection = this.BASE_URL + "/Values/onecoptions";
    let headers = new HttpHeaders().append('Authorization', 'none').append('Content-Type', 'text/json')
    
    //this.spinner.show();
    this.requeststarted = true;
    this.http.get(connection, {
      headers: headers,
      observe: 'body',
      withCredentials: true,
      reportProgress: false,
      responseType: 'text'
    }).subscribe(res => {let options = JSON.parse(res);  console.log(options); this.options = options; 
                          this.requeststarted = false;
                          //this.spinner.hide(); 
                        },
                 err => {console.log(err); 
                  this.requeststarted = false;
                        //this.spinner.hide();
                        });
  }


  

  GetOneCSesiionStatus() {

    this.sessionstatus = this.EmptyOneCSessionStatus();

    let connection = this.BASE_URL + "/Values/onecsessionstatus";
    let headers = new HttpHeaders().append('Authorization', 'none').append('Content-Type', 'text/json')
    this.requeststarted = true;

    this.http.get(connection, {
      headers: headers,
      observe: 'body',
      withCredentials: true,
      reportProgress: false,
      responseType: 'text'
    }).subscribe(res => {this.sessionstatus = JSON.parse(res); 
                          this.requeststarted = false;
                          //this.spinner.hide();
                        },
                 err => {console.log(err); 
                  this.requeststarted = false;       
                  //this.spinner.hide();
                        } );
  }


  Onectest() {
    let connection = this.BASE_URL + "/Values";
    let headers = new HttpHeaders().append('Authorization', 'none').append('Content-Type', 'text/json')
    
    
    this.requeststarted = true;
    this.http.get(connection, {
      headers: headers,
      observe: 'body',
      withCredentials: true,
      reportProgress: false,
      responseType: 'text'
    }).subscribe(res => {this.log = JSON.parse(res); this.log.sort((a,b) => (a.start > b.start) ? -1 : ((b.start > a.start) ? 1 : 0));
      this.requeststarted = false;
                        //this.spinner.hide();
                        },
                 err => {console.log(err); 
                  this.requeststarted = false;      
                  //this.spinner.hide();
                         });


  }

  async StartOneCSesiionStatus() {
    let connection = this.BASE_URL + "/Values/startonecsession";
    let headers = new HttpHeaders().append('Authorization', 'none').append('Content-Type', 'text/json')
    //this.spinner.show();
    this.requeststarted = true;
    await this.http.get(connection, {
      headers: headers,
      observe: 'body',
      withCredentials: true,
      reportProgress: false,
      responseType: 'text'
    }).toPromise();
    //this.spinner.hide();
    this.requeststarted = false;
    this.GetOneCSesiionStatus();
  }

  async StopOneCSesiionStatus() {
    let connection = this.BASE_URL + "/Values/stoponecsession";
    let headers = new HttpHeaders().append('Authorization', 'none').append('Content-Type', 'text/json')
    this.requeststarted = true;
    //this.spinner.show();
    await this.http.get(connection, {
      headers: headers,
      observe: 'body',
      withCredentials: true,
      reportProgress: false,
      responseType: 'text'
    }).toPromise();
    this.requeststarted = false;
    //this.spinner.hide();

    this.GetOneCSesiionStatus();
  }


  EmptyOneCSessionStatus() : IOneCSessionStatus {

    return  {    
      LastResponseStatus : 0,
      BadResponseCount : 0,
      PingTimerStarted : false, 
      OneCSesionId : ""
    }

  }

}
