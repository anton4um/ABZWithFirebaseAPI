import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AquaintedComponent } from './aquainted.component';

describe('AquaintedComponent', () => {
  let component: AquaintedComponent;
  let fixture: ComponentFixture<AquaintedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AquaintedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AquaintedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
