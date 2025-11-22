import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Habit, CheckIn, HabitStats } from '../models/habit.model';

@Injectable({
  providedIn: 'root'
})
export class HabitService {
  private readonly STORAGE_KEY = 'wellness_habits';
  private habitsSubject: BehaviorSubject<Habit[]>;
  public habits$: Observable<Habit[]>;

  constructor() {
    const initialHabits = this.loadHabitsFromStorage();
    this.habitsSubject = new BehaviorSubject<Habit[]>(initialHabits);
    this.habits$ = this.habitsSubject.asObservable();
  }

  /**
   * Load habits from localStorage
   */
  private loadHabitsFromStorage(): Habit[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        const habits = JSON.parse(data);
        // Convert createdAt strings back to Date objects
        return habits.map((h: any) => ({
          ...h,
          createdAt: new Date(h.createdAt)
        }));
      }
    } catch (error) {
      console.error('Error loading habits from storage:', error);
    }
    return [];
  }

  /**
   * Save habits to localStorage
   */
  private saveHabitsToStorage(habits: Habit[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(habits));
    } catch (error) {
      console.error('Error saving habits to storage:', error);
    }
  }

  /**
   * Get all habits
   */
  getHabits(): Habit[] {
    return this.habitsSubject.value;
  }

  /**
   * Get a single habit by ID
   */
  getHabit(id: string): Habit | undefined {
    return this.habitsSubject.value.find(h => h.id === id);
  }

  /**
   * Add a new habit
   */
  addHabit(name: string, description?: string): Habit {
    const newHabit: Habit = {
      id: this.generateId(),
      name,
      description,
      createdAt: new Date(),
      checkIns: []
    };

    const habits = [...this.habitsSubject.value, newHabit];
    this.habitsSubject.next(habits);
    this.saveHabitsToStorage(habits);
    return newHabit;
  }

  /**
   * Update an existing habit
   */
  updateHabit(id: string, updates: Partial<Habit>): void {
    const habits = this.habitsSubject.value.map(h => 
      h.id === id ? { ...h, ...updates } : h
    );
    this.habitsSubject.next(habits);
    this.saveHabitsToStorage(habits);
  }

  /**
   * Delete a habit
   */
  deleteHabit(id: string): void {
    const habits = this.habitsSubject.value.filter(h => h.id !== id);
    this.habitsSubject.next(habits);
    this.saveHabitsToStorage(habits);
  }

  /**
   * Toggle today's check-in for a habit
   */
  toggleTodayCheckIn(habitId: string): void {
    const today = this.getTodayString();
    const habit = this.getHabit(habitId);
    
    if (!habit) return;

    const checkInIndex = habit.checkIns.findIndex(c => c.date === today);
    
    if (checkInIndex >= 0) {
      // Toggle existing check-in
      habit.checkIns[checkInIndex].completed = !habit.checkIns[checkInIndex].completed;
    } else {
      // Add new check-in for today
      habit.checkIns.push({ date: today, completed: true });
    }

    this.updateHabit(habitId, { checkIns: habit.checkIns });
  }

  /**
   * Check if a habit is completed today
   */
  isCompletedToday(habitId: string): boolean {
    const habit = this.getHabit(habitId);
    if (!habit) return false;

    const today = this.getTodayString();
    const todayCheckIn = habit.checkIns.find(c => c.date === today);
    return todayCheckIn?.completed || false;
  }

  /**
   * Get statistics for a habit over the last 7 days
   */
  getHabitStats(habitId: string): HabitStats {
    const habit = this.getHabit(habitId);
    const last7Days: boolean[] = [];
    
    if (!habit) {
      return { habitId, last7Days: Array(7).fill(false), completionRate: 0 };
    }

    // Get the last 7 days including today
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = this.getDateString(date);
      
      const checkIn = habit.checkIns.find(c => c.date === dateString);
      last7Days.push(checkIn?.completed || false);
    }

    const completedDays = last7Days.filter(d => d).length;
    const completionRate = Math.round((completedDays / 7) * 100);

    return {
      habitId,
      last7Days,
      completionRate
    };
  }

  /**
   * Get today's date as YYYY-MM-DD string
   */
  private getTodayString(): string {
    return this.getDateString(new Date());
  }

  /**
   * Convert a Date to YYYY-MM-DD string
   */
  private getDateString(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Generate a unique ID
   */
  private generateId(): string {
    return `habit_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}

