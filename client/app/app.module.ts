import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { SettingsComponent } from './settings/settings.component';
import { RichmenulistComponent } from './richmenulist/richmenulist.component';

import { LineService } from './line.service';
import { MessageService } from './message.service';
import { AuthService } from './auth.service';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './token.interceptor';

import { FormsModule } from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';
import { HttpModule }    from '@angular/http';
import { HttpClient } from 'selenium-webdriver/http';
import { RichmenudetailComponent } from './richmenudetail/richmenudetail.component';
import { RichmenueditorComponent } from './richmenueditor/richmenueditor.component';


@NgModule({
  declarations: [
    AppComponent,
    SettingsComponent,
    RichmenulistComponent,
    RichmenudetailComponent,
    RichmenueditorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    HttpModule
  ],
  providers: [
    LineService,
    MessageService,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
