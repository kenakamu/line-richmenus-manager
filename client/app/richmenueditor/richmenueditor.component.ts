import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { richMenu, bounds, action, area, size, postbackAction, messageAction, uriAction } from '../richMenu';
import { LineService } from '../line.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser'
import { MessageService } from '../message.service';

@Component({
  selector: 'app-richmenueditor',
  templateUrl: './richmenueditor.component.html',
  styleUrls: ['./richmenueditor.component.css']
})
export class RichmenueditorComponent implements OnInit {

  @ViewChild('canvas') canvas: ElementRef;

  constructor(
    private http: HttpClient,
    public messageService: MessageService,
    private lineService: LineService
  ) { }

  richMenu: richMenu = new richMenu();
  bounds: bounds = new bounds();
  actionType: string = "message";
  label: string = "";
  text: string = "";
  data: string = "";
  uri: string = "";
  imagePath: string = "";
  imageType: string = "";
  imageData: string = "";
  ctx: CanvasRenderingContext2D;
  drawing: boolean = false;
  newRect: boolean = true;
  actionTypes: string[] = ["message", "postback", "uri"];
  richMenuId: string = "";

  ngOnInit() {
    this.richMenu.size = new size();
    this.richMenu.areas = new Array<area>();
    this.ctx = this.canvas.nativeElement.getContext('2d');
  }

  loadImage(input: HTMLInputElement, img: HTMLImageElement) {
    if (!input.value && (input.value.split('.')[1].toLowerCase() !== 'png' || 'jpg' || 'jpeg')) {
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
    reader.onload = (event: ProgressEvent) => {
      input.value = "";
      this.imageData = reader.result;
      img.src = this.imageData;
    };

    reader.readAsDataURL(input.files[0]);
  }

  addArea() {
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
    this.lineService.createRichMenu(this.richMenu)
      .subscribe(data => {
        this.lineService.uploadRichMenuImage(data, this.imageData, this.imageType)
          .subscribe();
      });
  }

  uploadImage() {
    this.lineService.uploadRichMenuImage(this.richMenuId, this.imageData, this.imageType)
    .subscribe();
  }

  checkImage(img: HTMLImageElement, canvas: HTMLCanvasElement) {
    if (img.src && img.naturalWidth === 2500 && (img.naturalHeight === 1686 || 843)) {
      this.richMenu.size.width = img.naturalWidth;
      this.richMenu.size.height = img.naturalHeight;
      let index = this.messageService.messages.findIndex(x => x === "Image size should be 2500x1686px or 2500x843px");
      this.messageService.messages.splice(index, 1);
      canvas.style.backgroundImage = `url('${this.imageData}')`;
      canvas.width = img.naturalWidth / 4;
      canvas.height = img.naturalHeight / 4;
    }
    else {
      this.messageService.add("Image size should be 2500x1686px or 2500x843px");
      img.src = this.imageData = null;
    }
  }

  keepDrawing(evt) {
    if (!this.drawing) {
      return;
    }
    var rect = this.canvas.nativeElement.getBoundingClientRect();
    this.bounds.width = evt.clientX - rect.left - this.bounds.x;
    this.bounds.height = evt.clientY - rect.top - this.bounds.y;
    this.ctx.clearRect(0, 0, rect.width, rect.height);
    this.ctx.strokeRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
    this.drawAllRect();
  }

  startDrawing(evt) {
    if (this.newRect) {
      this.ctx.beginPath();
      this.newRect = false;
      this.ctx.font = "30px sans-serif";
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.fillStyle = "rgba(255,255,255,0.7)";
    }
    var rect = this.canvas.nativeElement.getBoundingClientRect();
    this.bounds.x = evt.clientX - rect.left;
    this.bounds.y = evt.clientY - rect.top;
    this.drawing = true;
  }

  stopDrawing(evt) {
    var rect = this.canvas.nativeElement.getBoundingClientRect();
    this.bounds.width = evt.clientX - rect.left - this.bounds.x;
    this.bounds.height = evt.clientY - rect.top - this.bounds.y;
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

    var rect = this.canvas.nativeElement.getBoundingClientRect();
    this.ctx.clearRect(0, 0, rect.width, rect.height);
    this.ctx.strokeRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
    this.ctx.fillRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
    this.ctx.strokeText((this.richMenu.areas.length + 1).toString(), this.bounds.x + (this.bounds.width / 2), this.bounds.y + (this.bounds.height / 2));
  }
}
