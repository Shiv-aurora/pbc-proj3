import { Component, Input, OnChanges, Optional, SimpleChanges } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts'
import { ChartData, ChartType } from 'chart.js';
import { Food } from '../../models/food.model';
@Component({
  selector: 'app-food-chart',
  standalone:true,
  imports: [BaseChartDirective],
  templateUrl: './food-chart.html',
  styleUrls: ['./food-chart.scss'],
})
export class FoodChart implements OnChanges {
  @Input() dailyFood: Food[]=[];
  pieChartType:ChartType='pie';
  pieChartData:ChartData<'pie'>={
    labels:[],
    datasets:[{data:[]}]
  };

  ngOnChanges(){
    this.updateChart();
  }

  updateChart(){
    this.pieChartData={
      labels:this.dailyFood.map(f=>f.name),
      datasets:[
        {
          data:this.dailyFood.map(f=>f.calories)
        }
      ]
    };
  }

  pieChartOptions={
    animation:{
      animateRotate:true,
      animateScale:true,
      duration:800,
      easing:'easeOutQuart'
    },
    responsive:true,
    maintainAspectRatio:false
  };
}