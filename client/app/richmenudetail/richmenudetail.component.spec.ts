import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RichmenudetailComponent } from './richmenudetail.component';

describe('RichmenudetailComponent', () => {
  let component: RichmenudetailComponent;
  let fixture: ComponentFixture<RichmenudetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RichmenudetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RichmenudetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
