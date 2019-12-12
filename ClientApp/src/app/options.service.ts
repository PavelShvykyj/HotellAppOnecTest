import { ITCPTask } from './tcp-sessions-form/ITCPStatus';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IOneCOptions } from './one-coptions-form/IOneCOptions';
import { ITCPOptions } from './tcp-options-form/ITCPOptions';

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

  get primary() : string {
    let res : string = "primary";
    if  (this.eventer.value.themes["brown"] || this.eventer.value.themes["grey"]) 
      res =  "accent";
    return res;
  }

  get accent() : string {
    let res : string = "accent";
    
    if  (this.eventer.value.themes["contrast"]) 
      res =  "primary";
    
    return res;
  }

  get warn() : string {
    return "warn"
  }



  GetOptions() {
    let connection = this.BASE_URL + "/ONEC/proxy";
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
    
    let connection = this.BASE_URL + "/ONEC/proxy";
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

    let connection = this.BASE_URL + "/ONEC/onecoptions";
    let headers = new HttpHeaders().append('Authorization', 'none').append('Content-Type', 'text/json');
    

    return this.http.get(connection, {
      headers: headers,
      observe: 'body',
      withCredentials: false,
      reportProgress: false,
      responseType: 'text'
    })
  }

   GetOneCOptionsAsynk() : Promise<string> {

    let connection = this.BASE_URL + "/ONEC/onecoptions";
    let headers = new HttpHeaders().append('Authorization', 'none').append('Content-Type', 'text/json');
    

    return  this.http.get(connection, {
      headers: headers,
      observe: 'body',
      withCredentials: false,
      reportProgress: false,
      responseType: 'text'
    }).toPromise()
  }


  GetTCPOptions() : Observable<string> {

    let connection = this.BASE_URL + "/TCP/tcpoptions";
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
    let connection = this.BASE_URL + "/ONEC/onecoptions";
    let headers = new HttpHeaders().append('Authorization', 'none').append('Content-Type', 'text/json');
    

    return this.http.post(connection,JSON.stringify(options) ,{
      headers: headers,
      observe: 'body',
      withCredentials: false,
      reportProgress: false,
      responseType: 'text'
    })

  }

  SetTCPOptions(options : ITCPOptions) {
    let connection = this.BASE_URL + "/TCP/tcpoptions";
    let headers = new HttpHeaders().append('Authorization', 'none').append('Content-Type', 'text/json');
    

    return this.http.post(connection,JSON.stringify(options) ,{
      headers: headers,
      observe: 'body',
      withCredentials: false,
      reportProgress: false,
      responseType: 'text'
    })

  }

  GetSessionLog() {
    let connection = this.BASE_URL + "/ONEC";
    let headers = new HttpHeaders().append('Authorization', 'none').append('Content-Type', 'text/json')
    
    return this.http.get(connection, {
      headers: headers,
      observe: 'body',
      withCredentials: true,
      reportProgress: false,
      responseType: 'text'
    })
  }

  GetTCPSessionLog() {
    let connection = this.BASE_URL + "/TCP";
    let headers = new HttpHeaders().append('Authorization', 'none').append('Content-Type', 'text/json')
    
    return this.http.get(connection, {
      headers: headers,
      observe: 'body',
      withCredentials: true,
      reportProgress: false,
      responseType: 'text'
    })


  }

  GetOneCSesiionStatus() {
    let connection = this.BASE_URL + "/ONEC/onecsessionstatus";
    let headers = new HttpHeaders().append('Authorization', 'none').append('Content-Type', 'text/json')
    
    return this.http.get(connection, {
      headers: headers,
      observe: 'body',
      withCredentials: true,
      reportProgress: false,
      responseType: 'text'
    }); 

  }

  GetTCPSesiionStatus() {
    let connection = this.BASE_URL + "/TCP/tcpstatus";
    let headers = new HttpHeaders().append('Authorization', 'none').append('Content-Type', 'text/json')
    
    return this.http.get(connection, {
      headers: headers,
      observe: 'body',
      withCredentials: true,
      reportProgress: false,
      responseType: 'json'
    })
    .pipe(map(res => {return JSON.stringify(res)} )); 
  }

  GetTCPTasks() {
    let connection = this.BASE_URL + "/TCP/tcpstasks";
    let headers = new HttpHeaders().append('Authorization', 'none').append('Content-Type', 'text/json')
    
    return this.http.get(connection, {
      headers: headers,
      observe: 'body',
      withCredentials: true,
      reportProgress: false,
      responseType: 'json'
    })
    .pipe(map(res => {return JSON.stringify(res)} )); 
  }




  StartOneCSesiion() {
    let connection = this.BASE_URL + "/ONEC/startonecsession";
    let headers = new HttpHeaders().append('Authorization', 'none').append('Content-Type', 'text/json')
    
    return this.http.get(connection, {
      headers: headers,
      observe: 'body',
      withCredentials: true,
      reportProgress: false,
      responseType: 'text'
    });
  }

  StartTCPSesiion() {
    let connection = this.BASE_URL + "/TCP/start";
    let headers = new HttpHeaders().append('Authorization', 'none').append('Content-Type', 'text/json')
    
    return this.http.get(connection, {
      headers: headers,
      observe: 'body',
      withCredentials: true,
      reportProgress: false,
      responseType: 'text'
    });
  }

  StopOneCSesiion() {
    let connection = this.BASE_URL + "/ONEC/stoponecsession";
    let headers = new HttpHeaders().append('Authorization', 'none').append('Content-Type', 'text/json')
    return this.http.get(connection, {
      headers: headers,
      observe: 'body',
      withCredentials: true,
      reportProgress: false,
      responseType: 'text'
    });

  }

  StopTCPSesiion(clearbuffer : boolean = false) {
    let connection = this.BASE_URL + `/TCP/stop/${clearbuffer}`;
    let headers = new HttpHeaders().append('Authorization', 'none').append('Content-Type', 'text/json')
    
    return this.http.get(connection, {
      headers: headers,
      observe: 'body',
      withCredentials: true,
      reportProgress: false,
      responseType: 'text'
    }); 


  }

  AddTCPTask(newtask : ITCPTask) {
    let connection = this.BASE_URL + "/TCP/addtask";
    let headers = new HttpHeaders().append('Authorization', 'none').append('Content-Type', 'text/json');
    
    
    return this.http.post(connection,JSON.stringify(newtask) ,{
      headers: headers,
      observe: 'body',
      withCredentials: false,
      reportProgress: false,
      responseType: 'json'
    })


  }

  AddOneCTask(newtask : IProxyParametr) {
    let connection = this.BASE_URL + "/ONEC/proxy";
    let headers = new HttpHeaders().append('Authorization', 'none').append('Content-Type', 'text/json');
    

    console.log(JSON.stringify(newtask));

    return this.http.post(connection, JSON.stringify(newtask) ,{
      headers: headers,
      observe: 'body',
      withCredentials: false,
      reportProgress: false,
      responseType: 'text'
    })


  }


}
