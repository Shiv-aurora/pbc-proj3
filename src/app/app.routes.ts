import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FoodComponent } from './components/food/food.component';
import { MoodComponent } from './components/mood/mood.component';
import { HabitTrackerComponent } from './components/habit-tracker/habit-tracker.component';
import { GoalsComponent } from './components/goals/goals.component';


export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'habits', component: HabitTrackerComponent },
  { path: 'goals', component: GoalsComponent },
  { path: 'mood', component: MoodComponent },
  { path: 'food', component: FoodComponent },
  { path: '**', redirectTo: '/dashboard' }
];
