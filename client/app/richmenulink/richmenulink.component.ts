import { Component, OnInit } from '@angular/core';
import { LineService } from '../line.service';

@Component({
  selector: 'app-richmenulink',
  templateUrl: './richmenulink.component.html',
  styleUrls: ['./richmenulink.component.css']
})
export class RichmenulinkComponent implements OnInit {

  constructor(
    private lineService: LineService
  ) { }

  userId: string;
  richMenuId: string;

  ngOnInit() {
    this.userId = localStorage.getItem('userId');
  }

  getRichMenuIdOfUser() {
    this.lineService.getRichMenuIdOfUser(this.userId)
    .subscribe(
      data => { this.richMenuId = data; }
    );
  }

  linkRichMenuToUser(){
    this.lineService.linkRichMenuToUser(this.userId, this.richMenuId).subscribe();
  }

  unlinkRichMenuToUser(){
    this.lineService.unlinkRichMenuToUser(this.userId).subscribe();
  }
}
