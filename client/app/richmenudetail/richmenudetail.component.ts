import { Component, OnInit, Input } from '@angular/core';
import { richMenu } from '../richMenu';
import { LineService } from '../line.service';

@Component({
  selector: 'app-richmenudetail',
  templateUrl: './richmenudetail.component.html',
  styleUrls: ['./richmenudetail.component.css']
})
export class RichmenudetailComponent implements OnInit {

  @Input() richMenu: richMenu;

  constructor(
    private lineService: LineService
  ) { }

  ngOnInit() {
  }

  delete() {
    this.lineService.deleteRichMenu(this.richMenu.richMenuId).subscribe(
      () => { this.richMenu = null; }
    );
  }
}
