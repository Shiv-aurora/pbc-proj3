import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HabitService } from '../../services/habit.service';
import { Habit } from '../../models/habit.model';
import { HabitChartComponent } from '../habit-chart/habit-chart.component';

@Component({
    selector: 'app-habit-tracker',
    imports: [CommonModule, ReactiveFormsModule, HabitChartComponent],
    templateUrl: './habit-tracker.component.html',
    styleUrl: './habit-tracker.component.scss'
})
export class HabitTrackerComponent implements OnInit {
  habits: Habit[] = [];
  habitForm: FormGroup;
  showAddForm = false;

  constructor(
    private habitService: HabitService,
    private fb: FormBuilder
  ) {
    this.habitForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['']
    });
  }

  ngOnInit() {
    this.loadHabits();
    this.habitService.habits$.subscribe(habits => {
      this.habits = habits;
    });
  }

  private loadHabits(): void {
    this.habits = this.habitService.getHabits();
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.habitForm.reset();
    }
  }

  onSubmit(): void {
    if (this.habitForm.valid) {
      const { name, description } = this.habitForm.value;
      this.habitService.addHabit(name, description || undefined);
      this.habitForm.reset();
      this.showAddForm = false;
    }
  }

  toggleHabit(habitId: string): void {
    this.habitService.toggleTodayCheckIn(habitId);
  }

  isCompletedToday(habitId: string): boolean {
    return this.habitService.isCompletedToday(habitId);
  }

  deleteHabit(habitId: string): void {
    if (confirm('Are you sure you want to delete this habit?')) {
      this.habitService.deleteHabit(habitId);
    }
  }

  get formName() {
    return this.habitForm.get('name');
  }
}
