import { OptionsService } from './../options.service';
import { CollectionViewer, DataSource} from "@angular/cdk/collections";
import { ILoggmessage } from "src/loggmessage";
import { BehaviorSubject, Observable, of } from "rxjs";
import { catchError, finalize } from 'rxjs/operators';

export class SessionLogSourse implements DataSource<ILoggmessage> {

    private logSubject = new BehaviorSubject<ILoggmessage[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();

    constructor(private otionservice : OptionsService) {}

    GetLog() {
        this.loadingSubject.next(true);
        this.otionservice.GetSessionLog()
        .pipe( 
            catchError(() => of("")),
            finalize(() => this.loadingSubject.next(false))
        )
        .subscribe(res => this.logSubject.next((JSON.parse(res) as Array<ILoggmessage>)));
    }


    connect(collectionViewer: CollectionViewer) : Observable<Array<ILoggmessage>> {
        return this.logSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer) : void {
        this.logSubject.complete();
        this.loadingSubject.complete();
    }
}