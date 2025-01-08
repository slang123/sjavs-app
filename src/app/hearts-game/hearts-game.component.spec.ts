import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeartsGameComponent } from './hearts-game.component';

describe('HeartsGameComponent', () => {
  let component: HeartsGameComponent;
  let fixture: ComponentFixture<HeartsGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeartsGameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeartsGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
