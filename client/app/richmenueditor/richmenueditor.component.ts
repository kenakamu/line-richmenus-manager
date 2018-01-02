import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { richMenu, bounds, action, area, size, postbackAction, messageAction, uriAction } from '../richMenu';
import { LineService } from '../line.service';
import { IgxDialog } from 'igniteui-js-blocks/main';

@Component({
  selector: 'app-richmenueditor',
  templateUrl: './richmenueditor.component.html',
  styleUrls: ['./richmenueditor.component.css']
})
export class RichmenueditorComponent implements OnInit {

  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('alert') alert: IgxDialog;
  @ViewChild('img') img: ElementRef
  @Input() displayNew: boolean = false;
  @Output() emitClose = new EventEmitter();
  constructor(
    private lineService: LineService
  ) { }

  richMenu: richMenu = new richMenu();
  bounds: bounds = new bounds();
  actionType: string = "message";
  label: string = "";
  text: string = "";
  data: string = "";
  uri: string = "";
  imageType: string = "";
  imageData: string = "";
  ctx: CanvasRenderingContext2D;
  rect: ClientRect;
  drawing: boolean = false;
  newRect: boolean = true;
  actionTypes: string[] = ["message", "postback", "uri"];

  ngOnInit() {
  }

  loadImage(input: HTMLInputElement) {
    if (!input.value && (input.value.split('.')[1].toLowerCase() !== 'png' || 'jpg' || 'jpeg')) {
      input.value = this.imageData = "";
      this.alert.message = "Only png or jpeg are supported.";
      this.alert.open();
      return;
    }

    if (input.value.split('.')[1].toLowerCase() === "png") {
      this.imageType = "image/png";
    }
    else {
      this.imageType = "image/jpeg";
    }

    var reader = new FileReader();
    // Callback when file read.
    reader.onload = () => {
      input.value = "";
      this.imageData = reader.result;
      this.img.nativeElement.src = this.imageData;
    }

    reader.readAsDataURL(input.files[0]);
  }

  checkImage() {
    if (this.img.nativeElement.src && this.img.nativeElement.naturalWidth === 2500 && (this.img.nativeElement.naturalHeight === 1686 || 843)) {
      this.richMenu.size.width = this.img.nativeElement.naturalWidth;
      this.richMenu.size.height = this.img.nativeElement.naturalHeight;
      this.canvas.nativeElement.style.backgroundImage = `url('${this.imageData}')`;
      this.canvas.nativeElement.width = this.img.nativeElement.naturalWidth / 4;
      this.canvas.nativeElement.height = this.img.nativeElement.naturalHeight / 4;
      this.ctx = this.canvas.nativeElement.getContext('2d');
      this.rect = this.canvas.nativeElement.getBoundingClientRect()
    }
    else {
      this.img.nativeElement.src = this.imageData = "";
      this.alert.message = "Image size should be 2500x1686px or 2500x843px";
      this.alert.open();
    }
  }

  addArea() {
    if (this.bounds.width == null || 0) {
      this.alert.message = "Use mouse to specify area in the image first.";
      this.alert.open();
      return;
    }
    if (this.label === "") {
      this.alert.message = "Label is mandatory";
      this.alert.open();
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
      let action = new postbackAction();
      action.type = "postback";
      action.label = this.label;
      action.data = this.data;
      action.text = this.text;
      newArea.action = action;
    }
    else if (this.actionType === "message") {
      let action = new messageAction();
      action.type = "message";
      action.label = this.label;
      action.text = this.text;
      newArea.action = action;
    }
    else if (this.actionType === "uri") {
      let action = new uriAction();
      action.type = "uri";
      action.label = this.label;
      action.uri = this.uri;
      newArea.action = action;
    }
    this.richMenu.areas.push(newArea);
  }

  deleteArea(area: area) {
    let i = this.richMenu.areas.indexOf(area);
    this.richMenu.areas.splice(i, 1);
  }

  createRichMenu() {
    if (!this.richMenu.name || /^\s*$/.test(this.richMenu.name)) {
      this.alert.message = "Name is mandatory";
      this.alert.open();
      return;
    }
    if (!this.richMenu.chatBarText || /^\s*$/.test(this.richMenu.chatBarText)) {
      this.alert.message = "ChatBar Text is mandatory";
      this.alert.open();
      return;
    }
    this.lineService.createRichMenu(this.richMenu)
      .subscribe(data => {
        this.lineService.uploadRichMenuImage(data, this.imageData, this.imageType)
          .subscribe(() => {
            this.emitClose.emit(true);
          });
      });
  }

  cancel(){
    this.emitClose.emit(true);
  }

  resetAndClose(){
    this.emitClose.emit(true);
  }

  keepDrawing(evt) {
    if (!this.drawing) {
      return;
    }
    this.bounds.width = evt.clientX - Math.floor(this.rect.left) - this.bounds.x;
    this.bounds.height = evt.clientY - Math.floor(this.rect.top) - this.bounds.y;
    this.ctx.clearRect(0, 0, this.rect.width, this.rect.height);
    this.ctx.strokeRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
    this.drawAllRect();
  }

  startDrawing(evt) {
    if (this.imageData === "") {
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
    }
    this.bounds.x = evt.clientX - Math.floor(this.rect.left);
    this.bounds.y = evt.clientY - Math.floor(this.rect.top);
    this.drawing = true;
  }

  stopDrawing(evt) {
    if (!this.newRect) {
      return;
    }
    this.bounds.width = evt.clientX - Math.floor(this.rect.left) - this.bounds.x;
    this.bounds.height = evt.clientY - Math.floor(this.rect.top) - this.bounds.y;
    if (this.bounds.width < 0) {
      this.bounds.x += this.bounds.width;
      this.bounds.width = this.bounds.width * -1;
    }
    if (this.bounds.height < 0) {
      this.bounds.y += this.bounds.height;
      this.bounds.height = this.bounds.height * -1;
    }
    this.ctx.fillRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
    this.ctx.strokeText((this.richMenu.areas.length + 1).toString(), this.bounds.x + this.bounds.width / 2, this.bounds.y + this.bounds.height / 2);
    this.drawing = false;
    this.drawAllRect();
  }

  drawAllRect(): void {
    for (let i: number = 0; i < this.richMenu.areas.length; i++) {
      let area = this.richMenu.areas[i];
      this.ctx.fillRect(area.bounds.x, area.bounds.y, area.bounds.width, area.bounds.height);
      this.ctx.strokeText((i + 1).toString(), area.bounds.x + area.bounds.width / 2, area.bounds.y + area.bounds.height / 2);
    }
  }

  updateRect(): void {
    this.bounds.x = +this.bounds.x;
    this.bounds.y = +this.bounds.y;
    this.bounds.width = +this.bounds.width;
    this.bounds.height = +this.bounds.height;

    this.ctx.clearRect(0, 0, this.rect.width, this.rect.height);
    this.ctx.strokeRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
    this.ctx.fillRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
    this.ctx.strokeText((this.richMenu.areas.length + 1).toString(), this.bounds.x + (this.bounds.width / 2), this.bounds.y + (this.bounds.height / 2));
  }
}
