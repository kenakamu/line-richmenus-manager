import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { richMenu, bounds, action, area, size, postbackAction, messageAction, uriAction } from '../richMenu';
import { LineService } from '../line.service';
import { IgxDialog, IgxList } from 'igniteui-js-blocks/main';

@Component({
  selector: 'app-richmenueditor',
  templateUrl: './richmenueditor.component.html',
  styleUrls: ['./richmenueditor.component.css']
})
export class RichmenueditorComponent implements OnInit, OnChanges {

  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('alert') alert: IgxDialog;
  @ViewChild('img') img: ElementRef
  @ViewChild('imgdiv') imgdiv: ElementRef;
  @ViewChild('igxlist') igxlist: IgxList;
  @ViewChild('nameInput') nameInput: ElementRef;
  @ViewChild('chatBarTextInput') chatBarTextInput: ElementRef;
  @ViewChild('labelInput') labelInput: ElementRef;
  @Input() displayNew: boolean = false;
  @Output() emitClose = new EventEmitter();
  constructor(
    private lineService: LineService
  ) { }

  richMenu: richMenu;
  bounds: bounds;
  actionType: string;
  label: string;
  text: string;
  data: string;
  uri: string;
  imageType: string;
  imageData: string;
  ctx: CanvasRenderingContext2D;
  rect: ClientRect;
  drawing: boolean;
  newRect: boolean;
  actionTypes: string[] = ["message", "postback", "uri"];
  scale: number;
  focusElement: ElementRef;

  ngOnInit() {
  }

  ngOnChanges() {
    this.richMenu = new richMenu();
    this.bounds = new bounds();
    this.actionType = "message";
    this.label = "";
    this.text = "";
    this.data = "";
    this.uri = "";
    this.imageType = "";
    this.drawing = false;
    this.newRect = true;
  }

  public loadImage(input: HTMLInputElement): void {
    if (!input.value) {
      return;
    }
    let fileExt = input.value.split('.')[1].toLowerCase();
    if (fileExt !== ('png' || 'jpg' || 'jpeg')) {
      input.value = "";
      this.alert.message = "Only png or jpeg are supported.";
      this.alert.open();
      return;
    }
    else if (fileExt === "png") {
      this.imageType = "image/png";
    }
    else {
      this.imageType = "image/jpeg";
    }

    let reader = new FileReader();
    // Callback when file read.
    reader.onload = () => {
      input.value = "";
      this.img.nativeElement.src = reader.result;
    }

    reader.readAsDataURL(input.files[0]);
  }

  private checkImage(): void {
    if (this.img.nativeElement.src && this.img.nativeElement.naturalWidth === 2500 && (this.img.nativeElement.naturalHeight === 1686 || 843)) {
      this.richMenu.size.width = this.img.nativeElement.naturalWidth;
      this.richMenu.size.height = this.img.nativeElement.naturalHeight;
      this.scale = this.img.nativeElement.naturalWidth / this.imgdiv.nativeElement.clientWidth;
      this.canvas.nativeElement.style.backgroundImage = `url('${this.img.nativeElement.src}')`;
      this.canvas.nativeElement.style.display = 'block';
      this.canvas.nativeElement.width = this.img.nativeElement.naturalWidth / this.scale;
      this.canvas.nativeElement.height = this.img.nativeElement.naturalHeight / this.scale;
      this.ctx = this.canvas.nativeElement.getContext('2d');
      this.rect = this.canvas.nativeElement.getBoundingClientRect();
    }
    else {
      this.img.nativeElement.src = "";
      this.alert.message = "Image size should be 2500x1686px or 2500x843px";
      this.alert.open();
    }
  }

  public addArea(): void {
    if (this.bounds.width == null || 0) {
      this.alert.message = "Use mouse to specify area in the image first.";
      this.alert.open();
      return;
    }
    if (this.label === "") {
      this.alert.message = "Label is mandatory";
      this.alert.open();
      this.focusElement = this.labelInput;
      return;
    }
    if (this.richMenu.areas.length === 20) {
      this.alert.message = "You cannot add more than 20 areas.";
      this.alert.open();
      return;
    }
    let newArea = new area();
    Object.assign(newArea.bounds = new bounds(), this.bounds);
    if (this.actionType === "postback") {
      newArea.action = new postbackAction(this.label, this.data, this.text);
    }
    else if (this.actionType === "message") {
      newArea.action = new messageAction(this.label, this.text);
    }
    else if (this.actionType === "uri") {
      newArea.action = new uriAction(this.label, this.uri);
    }
    this.richMenu.areas.push(newArea);
  }

  public deleteArea(area: area): void {
    let i = this.richMenu.areas.indexOf(area);
    this.richMenu.areas.splice(i, 1);
    this.ctx.clearRect(0, 0, this.rect.width, this.rect.height);
    this.drawAllRect();
  }

  public createRichMenu(): void {
    if (!this.richMenu.name || /^\s*$/.test(this.richMenu.name)) {
      this.alert.message = "Name is mandatory";
      this.alert.open();
      this.focusElement = this.nameInput;
      return;
    }
    if (!this.richMenu.chatBarText || /^\s*$/.test(this.richMenu.chatBarText)) {
      this.alert.message = "ChatBar Text is mandatory";
      this.alert.open();
      this.focusElement = this.chatBarTextInput;
      return;
    }
    if (this.richMenu.areas.length === 0) {
      this.alert.message = "Add at least one area.";
      this.alert.open();
      return;
    }
    this.lineService.createRichMenu(this.richMenu)
      .subscribe(data => {
        this.lineService.uploadRichMenuImage(data, this.img.nativeElement.src, this.imageType)
          .subscribe(() => {
            this.emitClose.emit(true);
          });
      });
  }

  public cancel(): void {
    this.emitClose.emit(true);
  }

  public resetAndClose(): void {
    this.emitClose.emit(true);
  }

  public closeAlert(): void {
    this.alert.close();
    if (this.focusElement) {
      this.focusElement.nativeElement.focus();
    }
  }

  private startDrawing(evt): void {
    if (this.img.nativeElement.src === "") {
      this.alert.message = "Select image first.";
      this.alert.open();
      return;
    }
    if (this.newRect) {
      this.ctx.beginPath();
      this.newRect = false;
      this.ctx.font = "30px sans-serif";
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.fillStyle = "rgba(255,255,255,0.7)";
      this.bounds.x = Math.floor((evt.clientX - this.rect.left) * this.scale);
      this.bounds.y = Math.floor((evt.clientY - this.rect.top) * this.scale);
      this.drawing = true;
    }
  }

  private keepDrawing(evt): void {
    if (!this.drawing) {
      return;
    }
    this.bounds.width = Math.floor((evt.clientX - this.rect.left) * this.scale - this.bounds.x);
    this.bounds.height = Math.floor((evt.clientY - this.rect.top) * this.scale - this.bounds.y);
    this.clearAndStroke();
    this.drawAllRect();
  }

  private stopDrawing(evt): void {
    if (this.newRect) {
      return;
    }
    this.bounds.width = Math.floor((evt.clientX - this.rect.left) * this.scale - this.bounds.x);
    this.bounds.height = Math.floor((evt.clientY - this.rect.top) * this.scale - this.bounds.y);
    if (this.bounds.width < 0) {
      this.bounds.x += this.bounds.width;
      this.bounds.width = this.bounds.width * -1;
    }
    if (this.bounds.height < 0) {
      this.bounds.y += this.bounds.height;
      this.bounds.height = this.bounds.height * -1;
    }
    this.fillAndStrokeText((this.richMenu.areas.length + 1).toString(), this.bounds);
    this.drawing = false;
    this.newRect = true;
    this.drawAllRect();
  }

  private drawAllRect(): void {
    for (let i: number = 0; i < this.richMenu.areas.length; i++) {
      let area = this.richMenu.areas[i];
      this.fillAndStrokeText((i + 1).toString(), area.bounds);
    }
  }

  public updateRect(): void {
    this.bounds.x = +this.bounds.x;
    this.bounds.y = +this.bounds.y;
    this.bounds.width = +this.bounds.width;
    this.bounds.height = +this.bounds.height;

    this.ctx.clearRect(0, 0, this.rect.width, this.rect.height);
    this.fillAndStrokeText((this.richMenu.areas.length + 1).toString(), this.bounds);
    this.drawAllRect();
  }

  private clearAndStroke(): void {
    this.ctx.clearRect(0, 0, this.rect.width, this.rect.height);
    this.ctx.strokeRect(this.bounds.x / this.scale, this.bounds.y / this.scale, this.bounds.width / this.scale, this.bounds.height / this.scale);
  }

  private fillAndStrokeText(count: string, bounds: bounds): void {
    this.ctx.fillRect(bounds.x / this.scale, bounds.y / this.scale, bounds.width / this.scale, bounds.height / this.scale);
    this.ctx.strokeText(count,
      bounds.x / this.scale + bounds.width / this.scale / 2,
      bounds.y / this.scale + bounds.height / this.scale / 2);
  }
}
