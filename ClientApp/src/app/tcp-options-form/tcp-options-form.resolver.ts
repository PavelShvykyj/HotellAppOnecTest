import { OptionsService } from '../options.service';
import { Injectable } from '@angular/core';

import { Resolve } from '@angular/router';
import { Observable , of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ITCPOptions } from './ITCPOptions';



@Injectable()
export class TCPOptionsResolver implements Resolve<Observable<ITCPOptions>> {
  constructor(private _optionsService : OptionsService) {

  }

  EmptyOptions() : ITCPOptions {
    return {
        TIMEOUT : 0,
        SHORT_TIMEOUT : 0,
        LONG_TIMEOUT : 0,
        PORT : 0,
        HOST : "",
        USE_LOG : true
        };
  }

  resolve() {
    let resoult = this._optionsService
    .GetTCPOptions()
    .pipe(
      catchError(err =>of(JSON.stringify(this.EmptyOptions()))),
      map(res =>((JSON.parse(res) as ITCPOptions)))
      );
 
    return resoult 
  }
} 
