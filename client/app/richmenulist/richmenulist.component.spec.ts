import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RichmenulistComponent } from './richmenulist.component';

describe('RichmenulistComponent', () => {
  let component: RichmenulistComponent;
  let fixture: ComponentFixture<RichmenulistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RichmenulistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RichmenulistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
