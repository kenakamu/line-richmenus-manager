import { Component, ViewChild, OnInit } from '@angular/core';
import { richMenu } from './richMenu';
import { IgxDialog } from 'igniteui-js-blocks/main';
import { RichmenulistComponent } from './richmenulist/richmenulist.component';
import { RichmenudetailComponent } from './richmenudetail/richmenudetail.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  @ViewChild('settings') settings: IgxDialog;
  @ViewChild('alert') alert: IgxDialog;
  @ViewChild(RichmenulistComponent) richmenulistComponent: RichmenulistComponent;

  title = 'LINE RichMenu Manager';

  selectedRichMenu: richMenu;
  displayNew: boolean = false;
  userId: string;
  token: string;

  constructor() {
    this.userId = localStorage.getItem('userId');
    this.token = localStorage.getItem('token');
  }

  ngOnInit() {
    if (localStorage.getItem('token')) {
      this.richmenulistComponent.load();
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
      this.richmenulistComponent.load();
    }
  }

  emitSelectedRichmenu(richMenu: richMenu): void {
    this.selectedRichMenu = richMenu;
  }

  emitNew(e): void {
    this.displayNew = true;
  }

  emitAuthenticationError(e): void {
    this.alert.open();
    this.settings.open();
  }

  loadRichMenu(): void {
    this.displayNew = false;
    this.richmenulistComponent.load();
  }

  openSettings(): void {
    this.settings.open();
  }

  newRichMenu(): void {
    this.displayNew = false;
    this.displayNew = true;
  }
}
