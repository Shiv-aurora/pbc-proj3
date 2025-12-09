import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodChart } from './food-chart';

describe('FoodChart', () => {
  let component: FoodChart;
  let fixture: ComponentFixture<FoodChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoodChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FoodChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
