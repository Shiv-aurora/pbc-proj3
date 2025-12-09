import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { FoodService } from '../../services/food.service';
import { Food } from '../../models/food.model';
import { FoodChart } from '../food-chart/food-chart';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
    selector: 'app-food',
    imports: [ReactiveFormsModule,MatExpansionModule,FoodChart],
    templateUrl: './food.component.html',
    styleUrls: ['./food.component.scss']
})
export class FoodComponent implements OnInit{
  currentDate:string='';
  foods: Food[]=[];
  foodForm: FormGroup;
  showAddForm=false; 

  constructor(
    private foodService:FoodService,
    private fb: FormBuilder
  ){
    this.foodForm=this.fb.group({
      name:['',[Validators.required,Validators.minLength(2)]],
      calories:['',[Validators.required]],
    });
  }

  get formCalories(){
    return this.foodForm.get('calories'); 
  }

  ngOnInit(){
    this.setCurrentDate();
  }

  private setCurrentDate():void{
    const date=new Date();
    const options:Intl.DateTimeFormatOptions={
      weekday:'long',
      year:'numeric',
      month:'long',
      day:'numeric'
    };
    this.currentDate=date.toLocaleDateString('en-US',options);
  }

  toggleAddForm():void{
    this.showAddForm=!this.showAddForm; 
    if(!this.showAddForm){
      this.foodForm.reset();
    }
  }

  onSubmit():void{
    if(this.foodForm.valid){
      this.foods.push(this.foodForm.value);
      this.foodForm.reset();
    }
  }

  get formName(){
    return this.foodForm.get('food');
  }
}
