import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './token.interceptor';
import { FormsModule } from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';
import { HttpModule }    from '@angular/http';
import { HttpClient } from 'selenium-webdriver/http';

import { IgxNavbarModule, IgxButtonModule, IgxIconModule, IgxLabelModule, 
  IgxRadioModule ,IgxCardModule, IgxLayout, IgxListModule, IgxDialogModule, 
  IgxRippleModule } from 'igniteui-js-blocks/main';

import { RichmenulistComponent } from './richmenulist/richmenulist.component';
import { RichmenudetailComponent } from './richmenudetail/richmenudetail.component';
import { RichmenueditorComponent } from './richmenueditor/richmenueditor.component';
import { RichmenulinkComponent } from './richmenulink/richmenulink.component';

import { LineService } from './line.service';
import { MessageService } from './message.service';
import { AuthService } from './auth.service';


@NgModule({
  declarations: [
    AppComponent,
    RichmenulistComponent,
    RichmenudetailComponent,
    RichmenueditorComponent,
    RichmenulinkComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    HttpModule,
    IgxNavbarModule,
    IgxButtonModule,
    IgxIconModule,
    IgxLabelModule,
    IgxRadioModule,
    IgxCardModule,
    IgxLayout,
    IgxListModule,
    IgxDialogModule,
    IgxRippleModule
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
