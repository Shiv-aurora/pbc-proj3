import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder,Validators, FormGroup } from '@angular/forms';
import { FoodService } from '../../services/food.service';
import { Food } from '../../models/food.model';
import { Subscription } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { FoodChart } from '../food-chart/food-chart';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-food',
    standalone:true,
    imports: [ReactiveFormsModule,MatExpansionModule,FoodChart,CommonModule,MatIconModule],
    templateUrl: './food.component.html',
    styleUrls: ['./food.component.scss']
})
export class FoodComponent implements OnInit,OnDestroy{
  currentDate:string='';
  foods: Food[]=[];
  foodForm: FormGroup;
  showAddForm=false; 
  private sub!:Subscription; 

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

  get formName(){
    return this.foodForm.get('name');
  }

  ngOnInit(){
    this.sub=this.foodService.foods$.subscribe(foods=>{
      this.foods=foods;
    });
    this.setCurrentDate();
    this.resetOnSunday();
  }
  
  ngOnDestroy(){
    this.sub.unsubscribe(); 
  }

  trackByFoodId(index:number,food:Food):string{
    return food.id;
  }

  //Daily Date
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

  //Sunday Reset
  private resetOnSunday():void{
    const today=new Date();
    const day=today.getDay(); 
    const lastReset=localStorage.getItem('lastReset');
    if(day===0&&lastReset!==today.toDateString()){
      this.foodService.clearFoods();
      localStorage.setItem('lastReset',today.toDateString());
    }
  }

  clearFoods():void{
    this.foodService.clearFoods();
  }

  toggleAddForm():void{
    this.showAddForm=!this.showAddForm;
    if(!this.showAddForm){
      this.foodForm.reset();
    }
  }

  onSubmit():void{
    if(this.foodForm.valid){
      this.foodService.addFood(
        this.foodForm.value.name,
        Number(this.foodForm.value.calories)
      );
      this.foodForm.reset();
      this.showAddForm=false;
    }
  }

  deleteFood(id:string):void{
    this.foodService.deleteFood(id);
  }
}
