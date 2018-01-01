import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RichmenueditorComponent } from './richmenueditor.component';

describe('RichmenueditorComponent', () => {
  let component: RichmenueditorComponent;
  let fixture: ComponentFixture<RichmenueditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RichmenueditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RichmenueditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
