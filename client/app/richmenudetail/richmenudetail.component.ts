import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewChecked} from '@angular/core';
import { richMenu, bounds } from '../richMenu';
import { LineService } from '../line.service';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser'
import { SafeUrl } from '@angular/platform-browser/src/security/dom_sanitization_service';
import { IgxList } from 'igniteui-js-blocks/main';

@Component({
  selector: 'app-richmenudetail',
  templateUrl: './richmenudetail.component.html',
  styleUrls: ['./richmenudetail.component.css']
})
export class RichmenudetailComponent implements OnInit, OnChanges, AfterViewChecked {

  @Input() richMenu: richMenu;
  @Input() displayDetail: boolean;
  @Output() emitClose = new EventEmitter();
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('img') img: ElementRef;
  @ViewChild('igxlist') igxlist: IgxList;

  constructor(
    private lineService: LineService,
    private sanitizer: DomSanitizer
  ) { }

  ctx: CanvasRenderingContext2D;
  rect: ClientRect;
  scale: number = 6;

  ngOnInit() {
  }

  ngOnChanges() {
    if(!this.img){
      return;
    }
    this.getImage();
  }

  ngAfterViewChecked(): void{
    this.getImage();
    if (this.igxlist) {
      this.igxlist.element.nativeElement.children[0].style.overflowY = "scroll";
    }
  }

  getImage(): void {
    if (this.richMenu && this.richMenu.image != null) {
      this.img.nativeElement.src = this.richMenu.image;
    }
  }

  
  checkImage() {
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

  drawAllRect(): void {
    for (let i: number = 0; i < this.richMenu.areas.length; i++) {
      let area = this.richMenu.areas[i];
      this.fillAndStrokeText((i + 1).toString(), area.bounds);
    }
  }

  fillAndStrokeText(count: string, bounds: bounds): void {
    this.ctx.fillRect(bounds.x / this.scale, bounds.y / this.scale, bounds.width / this.scale, bounds.height / this.scale);
    this.ctx.strokeText(count,
      bounds.x / this.scale + bounds.width / this.scale / 2,
      bounds.y / this.scale + bounds.height / this.scale / 2);
  }

  delete() {
    this.lineService.deleteRichMenu(this.richMenu.richMenuId).subscribe(
      () => {
        this.richMenu = null;
        this.emitClose.emit();
      }
    );
  }
}
