import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { richMenu } from './richMenu';
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { MessageService } from './message.service';
import { Binary } from '@angular/compiler';
import { Readable } from "stream";
@Injectable()
export class LineService {

  private lineApiUrl = '';  // URL to web api

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  /**
   * Get Rich Menu // https://developers.line.me/en/docs/messaging-api/reference/#get-rich-menu
   * @param richMenuId 
   */
  getRichMenu(richMenuId: string): Observable<richMenu> {
    return this.http.get<richMenu>('richmenu/' + richMenuId).pipe(
      catchError(this.handleError<richMenu>(`get richMenu : ${richMenuId}`))
    );
  }

  /**
   * Create Rich Menu https://developers.line.me/en/docs/messaging-api/reference/#create-rich-menu
   * @param richMenu 
   */
  createRichMenu(richMenu: richMenu): Observable<string> {
    return this.http.post<string>('richmenu', richMenu, { headers: { "Content-Type": "application/json" } }).pipe(
      map(data => data['richMenuId']),
      catchError(this.handleError<string>('create richMenu'))
    );
  }

  /**
   * Delete Rich Menu https://developers.line.me/en/docs/messaging-api/reference/#delete-rich-menu
   * @param richMenuId 
   */
  deleteRichMenu(richMenuId: string): Observable<any> {
    return this.http.delete('richmenu/' + richMenuId).pipe(
      catchError(this.handleError(`delete richMenu: ${richMenuId}`))
    );
  }

  /**
 * Get Rich Menu Id of User https://developers.line.me/en/docs/messaging-api/reference/#get-rich-menu-id-of-user
 * @param userId 
 */
  getRichMenuIdOfUser(userId: string): Observable<string> {
    return this.http.get<string>(`user/${userId}/richmenu`).pipe(
      map(data => data['richMenuId']),
      catchError(this.handleError<string>(`get richMenu for user: ${userId}`))
    )
  }

  /**
   * Link rich menu to user https://developers.line.me/en/docs/messaging-api/reference/#link-rich-menu-to-user
   * @param userId 
   * @param richMenuId 
   */
  linkRichMenuToUser(userId: string, richMenuId: string): Observable<any> {
    return this.http.post(`user/${userId}/richmenu/${richMenuId}`, null).pipe(
      catchError(this.handleError<string>(`link richMenu ${richMenuId} for user: ${userId}`))
    );
  }

  /**
     * Unlink rich menu from user https://developers.line.me/en/docs/messaging-api/reference/#unlink-rich-menu-from-user
     * @param userId 
     */
  unlinkRichMenuToUser(userId: string): Observable<any> {
    return this.http.delete(`user/${userId}/richmenu`).pipe(
      catchError(this.handleError(`unlink richMenu for user: ${userId}`))
    );
  }

  /**
   * Download rich menu image https://developers.line.me/en/docs/messaging-api/reference/#download-rich-menu-image
   * @param richMenuId  
   */
  downloadRichMenuImage(richMenuId: string): Observable<any> {
    return this.http.get(`richmenu/${richMenuId}/content`, { responseType: 'blob' }).pipe(
      map(data => ({ "image": data, "richMenuId": richMenuId })),
      catchError(this.handleError<Blob>(`download image for richMenu ${richMenuId}`))
    );
  }

  /**
   * Upload rich menu image https://developers.line.me/en/docs/messaging-api/reference/#upload-rich-menu-image
   * @param richMenuId 
   * @param image 
   * @param contentType 
   */
  uploadRichMenuImage(richMenuId: string, image: string, contentType: string): Observable<any> {
    return this.http.post<any>(`richmenu/${richMenuId}/content`, image, { headers: { "Content-Type": contentType } }).pipe(
      catchError(this.handleError(`upload image for richMenu ${richMenuId}`))
    );
  }

  /**
   * Get Rich Menu List https://developers.line.me/en/docs/messaging-api/reference/#get-rich-menu-list
   */
  getRichMenuList(): Observable<richMenu[]> {
    return this.http.get<richMenu[]>('richmenu/list').pipe(
      map((data) => {
        if (data["message"]) {
          throw data["message"];
        }
        else {
          return data["richmenus"];
        }
      })
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add('HeroService: ' + message);
  }
}
