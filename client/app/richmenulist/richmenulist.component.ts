import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LineService } from '../line.service';
import { richMenu } from '../richMenu';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser'
import { SafeUrl } from '@angular/platform-browser/src/security/dom_sanitization_service';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-richmenulist',
  templateUrl: './richmenulist.component.html',
  styleUrls: ['./richmenulist.component.css']
})
export class RichmenulistComponent implements OnInit {

  @Input() displayNew: boolean;
  @Output() emitSelectedRichmenu = new EventEmitter();
  @Output() emitAuthenticationError = new EventEmitter();

  constructor(
    private lineService: LineService,
    private sanitizer: DomSanitizer
  ) { }

  richMenus: richMenu[];
  window: Window;

  ngOnInit() {
  }

  load(): void {
    this.richMenus = new Array<richMenu>();
    this.lineService.getRichMenuList()
      .subscribe(data => { 
        this.loadImages(data);      
      }, (err)=>{
        this.emitAuthenticationError.emit();
      })      
  }

  loadImages(richMenus: richMenu[]) {
    if(!richMenus){
      return;
    }
    this.richMenus = richMenus;
    for (var i = 0; i < this.richMenus.length; i++) {
      this.lineService.downloadRichMenuImage(this.richMenus[i].richMenuId).subscribe(
        data => { 
          this.setImage(data); 
        }        
      );
    }
  }

  setImage(data: any) {
    if (data.image.type === "application/octet-stream") {
      var reader = new FileReader();
      reader.onloadend = () => {
        this.richMenus.find(x => x.richMenuId === data.richMenuId).image = reader.result;
      }
      reader.readAsDataURL(data.image);
    }
  }

  getImage(richMenu: richMenu): SafeUrl {
    if (richMenu.image != null) {
      return this.sanitizer.bypassSecurityTrustUrl(richMenu.image);
    }
  }

  onSelect(richMenu: richMenu): void {
    this.emitSelectedRichmenu.emit(richMenu);
  }

  delete(richMenu: richMenu) {
    this.lineService.deleteRichMenu(richMenu.richMenuId).subscribe(
      () => { this.load(); }
    );
  }
}
