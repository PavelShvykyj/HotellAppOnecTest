import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ILoggmessage } from '../../loggmessage';




@Component({
  selector: 'app-counter-component',
  templateUrl: './counter.component.html'
})
export class CounterComponent {
  public currentCount = 0;
  private BASE_URL: string = "/api";
  public log : Array<ILoggmessage> = [];
  
  public incrementCounter() {
    this.currentCount++;
  }

  
  constructor(private http: HttpClient) {
    this.log.length
    
  }


  Onectest() {
    let connection = this.BASE_URL + "/Values";
    let headers = new HttpHeaders().append('Authorization', 'none').append('Content-Type', 'text/json')
    
    this.http.get(connection, {
      headers: headers,
      observe: 'body',
      withCredentials: true,
      reportProgress: false,
      responseType: 'text'
    }).subscribe(res => this.log = JSON.parse(res),
                 err => console.log(err) );


  }


}
