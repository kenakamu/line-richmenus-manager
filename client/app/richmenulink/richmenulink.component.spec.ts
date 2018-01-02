import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RichmenulinkComponent } from './richmenulink.component';

describe('RichmenulinkComponent', () => {
  let component: RichmenulinkComponent;
  let fixture: ComponentFixture<RichmenulinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RichmenulinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RichmenulinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
