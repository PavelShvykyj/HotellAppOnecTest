import { OptionsService } from './../options.service';
import { Injectable } from '@angular/core';

import { Resolve } from '@angular/router';
import { Observable , of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { IOneCOptions } from './IOneCOptions';



@Injectable()
export class OneCOptionsResolver implements Resolve<Observable<IOneCOptions>> {
  constructor(private _optionsService : OptionsService) {

  }

  EmptyOptions() : IOneCOptions {
    return {
        BASE_URL : "",
        LOGIN : "",
        MAX_BADREQUEST_COUNT : 5,
        PASSWORD : "", 
        PING_FREQUENCY : 10000, 
        REQUEST_TIMEOUT : 1000, 
        USE_LOG : true
        };
  }

  resolve() {
    let resoult = this._optionsService
    .GetOneCOptions()
    .pipe(
      catchError(err =>of(JSON.stringify(this.EmptyOptions()))),
      map(res =>((JSON.parse(res) as IOneCOptions)))
      );
 
    return resoult }
} 
