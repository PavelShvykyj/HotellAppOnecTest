import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IOneCOptions } from './one-coptions-form/IOneCOptions';

export interface  IProxyParametr
{
    URL : string, 
    Metod : string, 
    Body : string | {[key : string] : any}
}


@Injectable({
  providedIn: 'root'
})
export class OptionsService {

  private eventer = new BehaviorSubject({themes : {
    "brown" : true,
    "grey"  : false,
    "contrast"  : false
  }});
  
  public handler = this.eventer.asObservable();

  private BASE_URL: string = "/api";

  
  constructor(private http: HttpClient) { }

  GetOptions() {
    let connection = this.BASE_URL + "/Values/proxy";
    let headers = new HttpHeaders().append('Authorization', 'none').append('Content-Type', 'text/json');
    let proxyparametr : IProxyParametr = {
      URL : "options",
      Metod : "GET",
      Body : "empty"
    }

    this.http.post(connection, JSON.stringify(proxyparametr) ,{
      headers: headers,
      observe: 'body',
      withCredentials: false,
      reportProgress: false,
      responseType: 'text'
    }).subscribe(res => { console.log('servise response ', JSON.parse(res))
                          this.eventer.next(JSON.parse(res))},
                 err => console.log(err) );


  }


  SetOptions(options : string | {[key : string] : any} ) {
    
    let BodyParametr : string;
    if (typeof options == "string") {
      this.eventer.next(JSON.parse(options));
      BodyParametr = options; 
    } 
    else {
      let newoptions = {"themes" : {
        "brown" : options.themes.brown,
        "grey"  : options.themes.grey,
        "contrast"  : options.themes.contrast
      }}
      
      this.eventer.next(newoptions);  
      BodyParametr = JSON.stringify(newoptions);    
    }
    
    let connection = this.BASE_URL + "/Values/proxy";
    let headers = new HttpHeaders().append('Authorization', 'none').append('Content-Type', 'text/json');
    let proxyparametr : IProxyParametr = {
      URL : "options",
      Metod : "POST",
      Body : BodyParametr
    }

    console.log(JSON.stringify(proxyparametr));

    this.http.post(connection, JSON.stringify(proxyparametr) ,{
      headers: headers,
      observe: 'body',
      withCredentials: false,
      reportProgress: false,
      responseType: 'text'
    }).subscribe(res => {},
                 err => {console.log(err)});

  }

  GetOneCOptions() : Observable<string> {

    let connection = this.BASE_URL + "/Values/onecoptions";
    let headers = new HttpHeaders().append('Authorization', 'none').append('Content-Type', 'text/json');
    

    return this.http.get(connection, {
      headers: headers,
      observe: 'body',
      withCredentials: false,
      reportProgress: false,
      responseType: 'text'
    })
  }

  SetOneCOptions(options : IOneCOptions) {
    let connection = this.BASE_URL + "/Values/onecoptions";
    let headers = new HttpHeaders().append('Authorization', 'none').append('Content-Type', 'text/json');
    

    return this.http.post(connection,JSON.stringify(options) ,{
      headers: headers,
      observe: 'body',
      withCredentials: false,
      reportProgress: false,
      responseType: 'text'
    })

  }


}
