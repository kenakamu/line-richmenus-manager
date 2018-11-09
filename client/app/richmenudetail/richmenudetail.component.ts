import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { richMenu, bounds } from '../richMenu';
import { LineService } from '../line.service';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser'
import { SafeUrl } from '@angular/platform-browser/src/security/dom_sanitization_service';
import { IgxList, IgxLabel, IgxDialog } from 'igniteui-js-blocks/main';

@Component({
  selector: 'app-richmenudetail',
  templateUrl: './richmenudetail.component.html',
  styleUrls: ['./richmenudetail.component.css']
})
export class RichmenudetailComponent implements OnInit, AfterViewChecked {

  @Input() richMenu: richMenu;
  @Output() richMenuDeleted: EventEmitter<boolean> = new EventEmitter();
  @Output() richMenuDefaultSet: EventEmitter<boolean> = new EventEmitter();
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('img') img: ElementRef;
  @ViewChild('imgdiv') imgdiv: ElementRef;
  @ViewChild('settings') settings: IgxDialog;
  @ViewChild('info') info: IgxDialog;
  
  constructor(
    private lineService: LineService,
    private sanitizer: DomSanitizer
  ) { }

  ctx: CanvasRenderingContext2D;
  rect: ClientRect;
  scale: number;
  userId: string = "";
  link: boolean = false;

  ngOnInit() {
  }

  ngAfterViewChecked() {
    if (this.richMenu && this.richMenu.image != null) {
      this.img.nativeElement.src = this.richMenu.image;
    }
  }

  public checkImage(): void {
    this.scale = this.img.nativeElement.naturalWidth / this.imgdiv.nativeElement.clientWidth;
    this.canvas.nativeElement.style.backgroundImage = `url('${this.richMenu.image}')`;
    this.canvas.nativeElement.width = this.img.nativeElement.naturalWidth / this.scale;
    this.canvas.nativeElement.height = this.img.nativeElement.naturalHeight / this.scale;
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.rect = this.canvas.nativeElement.getBoundingClientRect();
    this.ctx.font = "30px sans-serif";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillStyle = "rgba(255,255,255,0.7)";
    this.drawAllRect();
  }

  public drawAllRect(): void {
    for (let i: number = 0; i < this.richMenu.areas.length; i++) {
      let area = this.richMenu.areas[i];
      this.fillAndStrokeText((i + 1).toString(), area.bounds);
    }
  }

  private fillAndStrokeText(count: string, bounds: bounds): void {
    this.ctx.fillRect(bounds.x / this.scale, bounds.y / this.scale, bounds.width / this.scale, bounds.height / this.scale);
    this.ctx.strokeText(count,
      bounds.x / this.scale + bounds.width / this.scale / 2,
      bounds.y / this.scale + bounds.height / this.scale / 2);
  }

  public delete(): void {
    this.lineService.deleteRichMenu(this.richMenu.richMenuId).subscribe(
      () => {
        this.richMenu = null;
        this.richMenuDeleted.emit(true);
      }
    );
  }

  public linkToUser(): void {
    this.link = true;
    this.userId = localStorage.getItem('userId');
    this.settings.open();
  }

  public unlinkToUser(): void {
    this.link = false;
    this.userId = localStorage.getItem('userId');
    this.settings.open();
  }

  public linkRichMenu(): void {
    if (!this.userId || this.userId === "") {
      return;
    }
    localStorage.setItem('userId', this.userId);
    if (this.link) {
      this.lineService.linkRichMenuToUser(this.userId, this.richMenu.richMenuId).subscribe(() => {
        this.settings.close();
      });
    }
    else {
      this.lineService.unlinkRichMenuToUser(this.userId).subscribe(() => {
        this.settings.close();
      });
    }
  }

  public setDefault(): void {
    this.lineService.setDefaultRichMenu(this.richMenu.richMenuId).subscribe(() => {
      this.info.open();
      this.richMenuDefaultSet.emit(true);
    });
  }
}
