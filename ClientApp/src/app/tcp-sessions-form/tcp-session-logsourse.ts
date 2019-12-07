import { OptionsService } from '../options.service';
import { CollectionViewer, DataSource} from "@angular/cdk/collections";
import { ILoggmessage } from "src/loggmessage";
import { BehaviorSubject, Observable, of } from "rxjs";
import { catchError, finalize } from 'rxjs/operators';

export class TCPSessionLogSourse implements DataSource<ILoggmessage> {

    private logSubject = new BehaviorSubject<ILoggmessage[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private messagesSubject = new BehaviorSubject<{message_content : string, isError : boolean }>({message_content : 'data sourse is ready', isError : false });
    public messages$ = this.messagesSubject.asObservable();
    public loading$ = this.loadingSubject.asObservable();



    constructor(private otionservice : OptionsService) {}

    GetLog() {
        this.loadingSubject.next(true);
        this.otionservice.GetTCPSessionLog()
        .pipe( 
            catchError((err) => { 
                this.messagesSubject.next({message_content : 'Ошибки при получении лога', isError : true })
                return of("")} ),
            finalize(() => this.loadingSubject.next(false))
        )
        .subscribe(res => {
            this.messagesSubject.next({message_content : 'Лог получен успешно', isError : false })
            return this.logSubject.next((JSON.parse(res) as Array<ILoggmessage>));
        });
    }


    connect(collectionViewer: CollectionViewer) : Observable<Array<ILoggmessage>> {
        return this.logSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer) : void {
        this.logSubject.complete();
        this.loadingSubject.complete();
    }
}