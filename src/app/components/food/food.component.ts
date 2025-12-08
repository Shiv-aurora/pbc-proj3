import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { FoodService } from '../../services/food.service';
import { Food } from '../../models/food.model';

@Component({
  selector: 'app-food',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './food.component.html',
  styleUrls: ['./food.component.scss']
})
export class FoodComponent {
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

  toggleAddForm():void{
    this.showAddForm=!this.showAddForm; 
    if(!this.showAddForm){
      this.foodForm.reset();
    }
  }

  onSubmit():void{
    if(this.foodForm.valid){
      const{name, calories}=this.foodForm.value;
      this.foodService.addFood(name,calories||undefined);
      this.foodForm.reset();
      this.showAddForm=false;
    }
  }

  get formName(){
    return this.foodForm.get('foodName');
  }
}
