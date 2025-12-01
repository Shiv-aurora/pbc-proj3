import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CaloriesComponent } from './components/calories/calories.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  // Future routes can be added here:
  // { path: 'habits', component: HabitsComponent },
  // { path: 'mood', component: MoodComponent },
  { path: 'calories', component: CaloriesComponent },
  { path: '**', redirectTo: '/dashboard' }
];
