import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Food } from '../models/food.model';

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  private foodsSubject=new BehaviorSubject<Food[]>(this.loadFoods());
  public foods$=this.foodsSubject.asObservable();

  getFoods():Food[]{
    return this.foodsSubject.value;
  }

  addFood(name:string,calories:number):void{
    const newFood:Food={
      id:this.generateId(),
      name,
      calories,
      createdAt:new Date()
    };
    const updated=[...this.foodsSubject.value,newFood];
    this.foodsSubject.next(updated);
    this.saveFoods(updated);
  }

  deleteFood(id:string):void{
    const updated=this.foodsSubject.value.filter(f=>f.id!==id);
    this.foodsSubject.next(updated);
    this.saveFoods(updated);
  }

  clearFoods():void{
    this.foodsSubject.next([]);
    this.saveFoods([]);
  }

  private loadFoods():Food[]{
    const data=localStorage.getItem('foods');
    return data?JSON.parse(data):[];
  }

  private saveFoods(foods:Food[]):void{
    localStorage.setItem('foods',JSON.stringify(foods));
  }

  //Get single food by ID
  getFood(id:string): Food|undefined{
    return this.foodsSubject.value.find(f=>f.id===id);
  }

  //Generate unique ID
  private generateId():string{
    return `foods${Date.now()}_${Math.random().toString(36).substring(2,9)}`;
  }
}


