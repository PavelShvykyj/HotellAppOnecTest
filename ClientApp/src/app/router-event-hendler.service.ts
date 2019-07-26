import { Injectable } from '@angular/core';
import {  
  NavigationStart,  
  NavigationEnd,  
  Event,  
  Router  
} from "@angular/router";  
import { Subject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RouterEventHendlerService {


  private eventSubject : Subject<Event> = new Subject<Event>();
  public eventEmiter : Observable<Event> = this.eventSubject.asObservable();

  constructor(private router : Router) {
    this.router.events.subscribe((event : Event) => {
      console.log("event in service", event);
      this.eventSubject.next(event);
    });
   }
 }   



