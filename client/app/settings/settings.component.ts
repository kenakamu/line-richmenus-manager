import { Component, OnInit } from '@angular/core';
import { settings } from '../settings';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  settings: settings = {
    token: localStorage.getItem('token'),
    userId: localStorage.getItem('userId')
  };

  constructor() { }

  ngOnInit() {
  }

  save(): void {
    localStorage.setItem('token', this.settings.token);
    localStorage.setItem('userId', this.settings.userId);
  }
}
