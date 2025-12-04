import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CaloriesComponent } from './components/calories/calories.component';
import { MoodComponent } from './components/mood/mood.component';
import { HabitComponent } from './habit/habit.component';


export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  // Future routes can be added here:
   { path: 'habits', component: HabitComponent },
   { path: 'mood', component: MoodComponent },
  { path: 'calories', component: CaloriesComponent },
  { path: '**', redirectTo: '/dashboard' }
];
