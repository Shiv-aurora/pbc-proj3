import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Food } from '../models/food.model';

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  private readonly STORAGE_KEY='wellness_foods';
  private foodsSubject:BehaviorSubject<Food[]>;
  public foods$: Observable<Food[]>;

  constructor() { 
    const initialFoods=this.loadFoodsFromStorage();
    this.foodsSubject=new BehaviorSubject<Food[]>(initialFoods); 
    this.foods$=this.foodsSubject.asObservable();
  }

  //Load habits from localStorage
  private loadFoodsFromStorage():Food[]{
    try{
      const data=localStorage.getItem(this.STORAGE_KEY);
      if(data){
        const foods=JSON.parse(data);
        return foods.map((f:any)=>({
          ...f,
          createdAt:new Date(f.createdAt)
        }));
      }
    }catch(error){
      console.error('Error loading foods from storage:', error); 
    }
    return[];
  }

  //Save foods to localStorage
  private saveFoodsToStorage(foods:Food[]): void{
    try{
      localStorage.setItem(this.STORAGE_KEY,JSON.stringify(foods));
    }catch(error){
      console.error('Error saving foods to storage:',error);
    }
  }

  //Get all foods
  getFoods():Food[]{
    return this.foodsSubject.value;
  }

  //Get single food by ID
  getFood(id:string): Food|undefined{
    return this.foodsSubject.value.find(f=>f.id===id);
  }

  //Add new food
  addFood(name:string, calories:number): Food{
    const newFood: Food={
      id:this.generateId(),
      name,
      calories,
      createdAt: new Date(),
    };

    const foods=[...this.foodsSubject.value,newFood]; 
    this.foodsSubject.next(foods);
    this.saveFoodsToStorage(foods); 
    return newFood;
  }

  //Update existing food
  updateFood(id:string,updates:Partial<Food>):void{
    const foods=this.foodsSubject.value.map(f=>f.id===id?{...f,...updates}:f)
    this.foodsSubject.next(foods);
    this.saveFoodsToStorage(foods); 
  };

  //Generate unique ID
  private generateId():string{
    return `habit_${Date.now()}_${Math.random().toString(36).substring(2,9)}`;
  }
}


