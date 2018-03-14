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

  @Input() selectedRichMenu: richMenu;
  @Output() selectedRichMenuChange: EventEmitter<richMenu> = new EventEmitter();
  @Output() emitAuthenticationError = new EventEmitter();
  @Input() displayList: boolean;

  constructor(
    private lineService: LineService,
    private sanitizer: DomSanitizer
  ) { }

  richMenus: richMenu[];
  window: Window;

  ngOnInit() {
  }

  public load(userId: string): void {
    this.richMenus = new Array<richMenu>();
    if (userId) {
      this.lineService.getRichMenuIdOfUser(userId).subscribe(
        data => {
          if (data) {
            this.lineService.getRichMenu(data).subscribe(
              data => {
                this.loadImages(new Array<richMenu>(data));
              }
            );
          }
          else {
            this.richMenus = new Array<richMenu>();
          }
        }
      );
    }
    else {
      this.lineService.getRichMenuList()
        .subscribe(data => {
          this.loadImages(data);
        }, (err) => {
          this.emitAuthenticationError.emit();
        })
    }
  }

  private loadImages(richMenus: richMenu[]): void {
    if (!richMenus) {
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

  public setImage(data: any): void {
    if (data.image.type === "application/octet-stream") {
      var reader = new FileReader();
      reader.onloadend = () => {
        this.richMenus.find(x => x.richMenuId === data.richMenuId).image = reader.result;
      }
      reader.readAsDataURL(data.image);
    }
  }

  public getImage(richMenu: richMenu): SafeUrl {
    if (richMenu.image != null) {
      return this.sanitizer.bypassSecurityTrustUrl(richMenu.image);
    }
  }

  public onSelect(richMenu: richMenu): void {
    this.selectedRichMenuChange.emit(richMenu);
  }
}
