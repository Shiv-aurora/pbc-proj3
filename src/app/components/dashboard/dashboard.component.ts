import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HabitTrackerComponent } from '../habit-tracker/habit-tracker.component';
import { GoalsService, Goal } from '../../services/goals.service';
import { FoodService } from '../../services/food.service';
import { HabitService } from '../../services/habit.service';
import { Food } from '../../models/food.model';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-dashboard',
    imports: [CommonModule, RouterModule, HabitTrackerComponent],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentDate: string = '';
  greeting: string = '';
  motivationalQuote: string = '';
  quoteAuthor: string = '';

  // Goals data
  activeGoals: Goal[] = [];
  totalGoals: number = 0;
  completedGoalsCount: number = 0;

  // Food data
  foods: Food[] = [];
  totalCalories: number = 0;
  calorieGoal: number = 2000;

  // Habits data
  totalHabits: number = 0;
  completedHabitsToday: number = 0;

  private subscriptions: Subscription[] = [];

  private quotes = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
    { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { text: "Your limitation—it's only your imagination.", author: "Unknown" }
  ];

  constructor(
    private goalsService: GoalsService,
    private foodService: FoodService,
    private habitService: HabitService
  ) {}

  ngOnInit() {
    this.setCurrentDate();
    this.setGreeting();
    this.setRandomQuote();
    this.loadGoalsData();
    this.loadFoodData();
    this.loadHabitsData();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private setCurrentDate(): void {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    };
    this.currentDate = date.toLocaleDateString('en-US', options);
  }

  private setGreeting(): void {
    const hour = new Date().getHours();
    if (hour < 12) this.greeting = 'Good morning';
    else if (hour < 17) this.greeting = 'Good afternoon';
    else this.greeting = 'Good evening';
  }

  private setRandomQuote(): void {
    const randomIndex = Math.floor(Math.random() * this.quotes.length);
    const quote = this.quotes[randomIndex];
    this.motivationalQuote = quote.text;
    this.quoteAuthor = quote.author;
  }

  private loadGoalsData(): void {
    const sub = this.goalsService.goals$.subscribe(goals => {
      this.activeGoals = goals.filter(g => g.status === 'active').slice(0, 3);
      this.totalGoals = goals.filter(g => g.status === 'active').length;
      this.completedGoalsCount = goals.filter(g => g.status === 'completed').length;
    });
    this.subscriptions.push(sub);
  }

  private loadFoodData(): void {
    const sub = this.foodService.foods$.subscribe(foods => {
      this.foods = foods.slice(-5).reverse();
      this.totalCalories = foods.reduce((sum, f) => sum + f.calories, 0);
    });
    this.subscriptions.push(sub);
  }

  private loadHabitsData(): void {
    const sub = this.habitService.habits$.subscribe(habits => {
      this.totalHabits = habits.length;
      this.completedHabitsToday = habits.filter(h => 
        this.habitService.isCompletedToday(h.id)
      ).length;
    });
    this.subscriptions.push(sub);
  }

  getGoalProgress(goal: Goal): number {
    return this.goalsService.getProgressPercentage(goal);
  }

  getGoalCategoryColor(goal: Goal): string {
    return this.goalsService.getCategoryInfo(goal.category).color;
  }

  getGoalCategoryIcon(goal: Goal): string {
    return this.goalsService.getCategoryInfo(goal.category).icon;
  }

  getCaloriePercentage(): number {
    return Math.min(100, Math.round((this.totalCalories / this.calorieGoal) * 100));
  }

  getHabitPercentage(): number {
    if (this.totalHabits === 0) return 0;
    return Math.round((this.completedHabitsToday / this.totalHabits) * 100);
  }
}
