import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewGratitudesComponent } from './new-gratitudes.component';

describe('NewGratitudesComponent', () => {
  let component: NewGratitudesComponent;
  let fixture: ComponentFixture<NewGratitudesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewGratitudesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewGratitudesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
