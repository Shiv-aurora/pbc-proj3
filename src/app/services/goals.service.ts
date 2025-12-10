import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type GoalCategory = 'fitness' | 'mindfulness' | 'learning' | 'finance' | 'creativity' | 'health' | 'career' | 'other';
export type ProgressType = 'percentage' | 'numeric' | 'boolean';
export type GoalStatus = 'active' | 'completed' | 'paused';

export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: GoalCategory;
  progressType: ProgressType;
  currentValue: number;
  targetValue: number;
  unit?: string;
  targetDate: string;
  createdAt: string;
  status: GoalStatus;
  completedAt?: string;
}

export interface CategoryInfo {
  id: GoalCategory;
  name: string;
  icon: string;
  color: string;
}

@Injectable({
  providedIn: 'root'
})
export class GoalsService {
  private readonly STORAGE_KEY = 'wellness_goals';
  private goalsSubject: BehaviorSubject<Goal[]>;
  public goals$: Observable<Goal[]>;

  readonly categories: CategoryInfo[] = [
    { id: 'fitness', name: 'Fitness', icon: '◆', color: '#4CAF50' },
    { id: 'mindfulness', name: 'Mindfulness', icon: '○', color: '#9C27B0' },
    { id: 'learning', name: 'Learning', icon: '□', color: '#2196F3' },
    { id: 'finance', name: 'Finance', icon: '△', color: '#FF9800' },
    { id: 'creativity', name: 'Creativity', icon: '☆', color: '#E91E63' },
    { id: 'health', name: 'Health', icon: '♥', color: '#f44336' },
    { id: 'career', name: 'Career', icon: '▲', color: '#607D8B' },
    { id: 'other', name: 'Other', icon: '●', color: '#795548' }
  ];

  constructor() {
    const initialGoals = this.loadGoalsFromStorage();
    this.goalsSubject = new BehaviorSubject<Goal[]>(initialGoals);
    this.goals$ = this.goalsSubject.asObservable();
  }

  private loadGoalsFromStorage(): Goal[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading goals from storage:', error);
    }
    return [];
  }

  private saveGoalsToStorage(goals: Goal[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(goals));
    } catch (error) {
      console.error('Error saving goals to storage:', error);
    }
  }

  getGoals(): Goal[] {
    return this.goalsSubject.value;
  }

  getActiveGoals(): Goal[] {
    return this.goalsSubject.value.filter(g => g.status === 'active');
  }

  getCompletedGoals(): Goal[] {
    return this.goalsSubject.value.filter(g => g.status === 'completed');
  }

  getGoal(id: string): Goal | undefined {
    return this.goalsSubject.value.find(g => g.id === id);
  }

  addGoal(goalData: Omit<Goal, 'id' | 'createdAt' | 'status' | 'currentValue'>): Goal {
    const newGoal: Goal = {
      ...goalData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      status: 'active',
      currentValue: 0
    };

    const goals = [...this.goalsSubject.value, newGoal];
    this.goalsSubject.next(goals);
    this.saveGoalsToStorage(goals);
    return newGoal;
  }

  updateGoal(id: string, updates: Partial<Goal>): void {
    const goals = this.goalsSubject.value.map(g =>
      g.id === id ? { ...g, ...updates } : g
    );
    this.goalsSubject.next(goals);
    this.saveGoalsToStorage(goals);
  }

  updateProgress(id: string, newValue: number): void {
    const goal = this.getGoal(id);
    if (!goal) return;

    const updates: Partial<Goal> = { currentValue: newValue };
    
    // Auto-complete if target reached
    if (goal.progressType === 'boolean' && newValue === 1) {
      updates.status = 'completed';
      updates.completedAt = new Date().toISOString();
    } else if (goal.progressType !== 'boolean' && newValue >= goal.targetValue) {
      updates.status = 'completed';
      updates.completedAt = new Date().toISOString();
    }

    this.updateGoal(id, updates);
  }

  toggleComplete(id: string): void {
    const goal = this.getGoal(id);
    if (!goal) return;

    if (goal.status === 'completed') {
      this.updateGoal(id, { status: 'active', completedAt: undefined });
    } else {
      this.updateGoal(id, { 
        status: 'completed', 
        completedAt: new Date().toISOString(),
        currentValue: goal.targetValue
      });
    }
  }

  deleteGoal(id: string): void {
    const goals = this.goalsSubject.value.filter(g => g.id !== id);
    this.goalsSubject.next(goals);
    this.saveGoalsToStorage(goals);
  }

  getProgressPercentage(goal: Goal): number {
    if (goal.progressType === 'boolean') {
      return goal.currentValue === 1 ? 100 : 0;
    }
    if (goal.targetValue === 0) return 0;
    return Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
  }

  getDaysRemaining(goal: Goal): number {
    const target = new Date(goal.targetDate);
    const today = new Date();
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getGoalStatus(goal: Goal): 'on-track' | 'behind' | 'ahead' | 'overdue' | 'completed' {
    if (goal.status === 'completed') return 'completed';
    
    const daysRemaining = this.getDaysRemaining(goal);
    if (daysRemaining < 0) return 'overdue';
    
    const progress = this.getProgressPercentage(goal);
    const totalDays = Math.ceil(
      (new Date(goal.targetDate).getTime() - new Date(goal.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    const daysElapsed = totalDays - daysRemaining;
    const expectedProgress = totalDays > 0 ? (daysElapsed / totalDays) * 100 : 0;
    
    if (progress >= expectedProgress + 10) return 'ahead';
    if (progress < expectedProgress - 10) return 'behind';
    return 'on-track';
  }

  getCategoryInfo(category: GoalCategory): CategoryInfo {
    return this.categories.find(c => c.id === category) || this.categories[7];
  }

  private generateId(): string {
    return `goal_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}

