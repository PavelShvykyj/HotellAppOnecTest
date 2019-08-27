import { OptionsService } from './../options.service';
import { Injectable } from '@angular/core';

import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IOneCOptions } from './IOneCOptions';



@Injectable()
export class OneCOptionsResolver implements Resolve<Observable<IOneCOptions>> {
  constructor(private _optionsService : OptionsService) {

  }

  EmptyOptions() : IOneCOptions {
    return {
        BASE_URL : "",
        LOGIN : "",
        MAX_BADREQUEST_COUNT : 0,
        PASSWORD : "", 
        PING_FREQUENCY : 0, 
        REQUEST_TIMEOUT : 0, 
        USE_LOG : false
    }

  }

  resolve() {
    return this._optionsService.GetOneCOptions()
                                .pipe(map(res =>((JSON.parse(res) as IOneCOptions)),
                                          this.EmptyOptions()
    ))
  }
}