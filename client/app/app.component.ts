import { Component, ViewChild, OnInit } from '@angular/core';
import { richMenu } from './richMenu';
import { IgxDialog } from 'igniteui-js-blocks/main';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  @ViewChild('settings') settings: IgxDialog;
  @ViewChild('alert') alert: IgxDialog;

  title = 'LINE RichMenu Manager';

  selectedRichMenu: richMenu;
  loadRichMenus: boolean;
  displayNew: boolean = false;
  userId: string;
  token: string;

  constructor() {
    this.userId = localStorage.getItem('userId');
    this.token = localStorage.getItem('token');
  }

  ngOnInit() {
    if (localStorage.getItem('token')) {
      this.loadRichMenus = true;
    }
    else {
      this.settings.open();
    }
  }

  closeSettings() {
    if (this.token) {
      localStorage.setItem('userId', this.userId);
      localStorage.setItem('token', this.token);
      this.settings.close();
      this.loadRichMenus = true;
    }
  }

  emitSelectedRichmenu(e): void {
    this.selectedRichMenu = e;
  }

  emitNew(e): void {
    this.displayNew = true;
  }

  emitAuthenticationError(e):void{
    this.loadRichMenus = false;    
    this.alert.title ="Authentication Failed";
    this.alert.message = "Please check your access token";
    this.alert.open();
    this.settings.open();
  }

  emitloadedRichMenus(e):void{
    this.loadRichMenus = false;
  }
  
  emitClose(e): void {
    this.displayNew = false;
    this.loadRichMenus = true;
  }

  loadRichMenu(): void {
    this.loadRichMenus = true;
    
  }

  openSettings(): void {
    this.settings.open();
  }

  newRichMenu(): void {
    this.displayNew = false;
    this.displayNew = true;
  }
}
