import { Injectable } from '@angular/core';
import {Record} from '../components/records/Record'
import {RECORDS} from '../components/records/MockRecords'
import { Observable, of } from 'rxjs'
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { stringify } from 'querystring';
import { JsonpCallbackContext } from '@angular/common/http/src/jsonp';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})


export class RecordService {

  private recordsUrl = 'http://localhost:3000/api/records'; // check for it

  constructor(private http: HttpClient, private messageService: MessageService) {
    
   }

  getRecords(): Observable<Record[]> {
    this.messageService.add('RecordService: fetched records');
    return this.http.get<Record[]>(this.recordsUrl).pipe(
      tap(records => this.log(`getRecords fetched records`)),
      catchError(this.handleError('getRecords', [])));
  }

  private log(message: string) {
    this.messageService.add('RecordService: ' + message);
  }

  /** GET record by id. Will 404 if id not found */
  getRecordById(id: number): Observable<Record> {
    const url = `${this.recordsUrl}/${id}`;
    return this.http.get<Record>(url).pipe(
      tap(_ => this.log(`fetched record id=${id}`)),
      catchError(this.handleError<Record>(`getRecordById id=${id}`))
    );
  }

  addRecord (record: Record): Observable<Record> {
    return this.http.post<Record>(this.recordsUrl, record, httpOptions).pipe(
      tap((record: Record) => this.log(`added record w/ id=${record.id}`)),
      catchError(this.handleError<Record>('addRecord'))
    );
  }

  updateRecord (record: Record): Observable<any> {

    return this.http.put(this.recordsUrl, record, httpOptions).pipe(
      tap(_ => this.log(`updated record name=${record.name}, phonenumber=${record.phonenumber}`)),
      catchError(this.handleError<any>('updateRecord'))
    );
  }

  getRecord(name: string): Observable<Record> {
    // TODO: send the message _after_ fetching the record
    const url = `${this.recordsUrl}/${name}`;
    return this.getRecordById(1);
    
    //this.messageService.add(`RecordService: fetRecord fetched record name=${name}`);
    //return of(RECORDS.find(record => record.name === name));
  }

  /** DELETE: delete the record from the server */
  deleteRecord (record: Record | number): Observable<Record> {
    const id = typeof record === 'number' ? record : record.id;
    const url = `${this.recordsUrl}/${id}`;

    return this.http.delete<Record>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted record id=${id}`)),
      catchError(this.handleError<Record>('deleteRecord'))
    );
  }

  /* GET records whose name contains search term */
  searchRecords(term: string): Observable<Record[]> {
    if (!term.trim()) {
      // if not search term, return empty record array.
      return of([]);
    }

    const filter = `?filter={"where":{"name":{"like":"${term}","options":"i"}}}`;
    const url = `${this.recordsUrl}`+filter;
    return this.http.get<Record[]>(url).pipe(
      tap(records => {
        var count = Object.keys(records).length;
        if (count > 1) this.log(`found ${count} records matching "${term}"`)
        else if (count === 1) this.log(`found ${count} record matching "${term}"`)
        else this.log(`found 0 record matching "${term},"`)
      }
        
    
    ),
      catchError(this.handleError<Record[]>('searchRecords', []))
    );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
   
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
   
      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}` + error.error.error.message);
   
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
