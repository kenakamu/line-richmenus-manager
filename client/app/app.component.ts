import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
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
  @ViewChild('input') input: ElementRef;
  @ViewChild(RichmenulistComponent) richmenulistComponent: RichmenulistComponent;

  title = 'LINE RichMenu Manager';

  selectedRichMenu: richMenu = null;
  displayList: boolean = true;
  displayNew: boolean = false;
  userId: string = localStorage.getItem('userId');
  token: string = localStorage.getItem('token');

  ngOnInit() {
    if (localStorage.getItem('token')) {
      this.richmenulistComponent.load(null);
    }
    else {
      this.settings.open();
    }
  }

  public closeSettings(): void {
    if (this.token) {
      localStorage.setItem('token', this.token);
      this.settings.close();
      this.richmenulistComponent.load(null);
    }
  }

  public emitNew(e): void {
    this.displayNew = true;
    this.displayList = false;
  }

  public emitAuthenticationError(e): void {
    this.alert.open();
    this.settings.open();
  }

  public searchRichMenuForUserId(e) {
    if (e.keyCode === 13) {
      this.input.nativeElement.style.display = "none";
      if (!this.userId) {
        return;
      }
      localStorage.setItem('userId', this.userId);
      this.loadRichMenu(this.userId);
    }
  }

  public loadRichMenu(userId: string): void {
    this.displayNew  = false;
    this.displayList = true;
    this.selectedRichMenu = null;
    this.richmenulistComponent.load(userId);
  }

  public openSettings(): void {
    this.settings.open();
  }

  public newRichMenu(): void {
    this.selectedRichMenu = null;
    this.displayList = false;
    this.displayNew = true;
  }
}
