import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoalsService, Goal, GoalCategory, ProgressType, CategoryInfo } from '../../services/goals.service';

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.scss']
})
export class GoalsComponent implements OnInit {
  goals: Goal[] = [];
  showAddForm = false;
  editingGoal: Goal | null = null;
  activeTab: 'active' | 'completed' = 'active';
  
  // Form state
  newGoal = {
    title: '',
    description: '',
    category: 'fitness' as GoalCategory,
    progressType: 'numeric' as ProgressType,
    targetValue: 10,
    unit: '',
    targetDate: this.getDefaultTargetDate()
  };

  // For progress update modal
  showProgressModal = false;
  progressGoal: Goal | null = null;
  tempProgressValue = 0;

  categories: CategoryInfo[] = [];

  constructor(private goalsService: GoalsService) {
    this.categories = this.goalsService.categories;
  }

  ngOnInit(): void {
    this.goalsService.goals$.subscribe(goals => {
      this.goals = goals;
    });
  }

  get activeGoals(): Goal[] {
    return this.goals.filter(g => g.status === 'active');
  }

  get completedGoals(): Goal[] {
    return this.goals.filter(g => g.status === 'completed');
  }

  get displayedGoals(): Goal[] {
    return this.activeTab === 'active' ? this.activeGoals : this.completedGoals;
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.resetForm();
    }
  }

  selectCategory(category: GoalCategory): void {
    this.newGoal.category = category;
  }

  selectProgressType(type: ProgressType): void {
    this.newGoal.progressType = type;
    if (type === 'boolean') {
      this.newGoal.targetValue = 1;
      this.newGoal.unit = '';
    } else if (type === 'percentage') {
      this.newGoal.targetValue = 100;
      this.newGoal.unit = '%';
    }
  }

  submitGoal(): void {
    if (!this.newGoal.title.trim()) return;

    this.goalsService.addGoal({
      title: this.newGoal.title.trim(),
      description: this.newGoal.description.trim() || undefined,
      category: this.newGoal.category,
      progressType: this.newGoal.progressType,
      targetValue: this.newGoal.targetValue,
      unit: this.newGoal.unit || undefined,
      targetDate: this.newGoal.targetDate
    });

    this.toggleAddForm();
  }

  openProgressModal(goal: Goal): void {
    this.progressGoal = goal;
    this.tempProgressValue = goal.currentValue;
    this.showProgressModal = true;
  }

  closeProgressModal(): void {
    this.showProgressModal = false;
    this.progressGoal = null;
  }

  updateProgress(): void {
    if (this.progressGoal) {
      this.goalsService.updateProgress(this.progressGoal.id, this.tempProgressValue);
      this.closeProgressModal();
    }
  }

  incrementProgress(amount: number): void {
    if (this.progressGoal) {
      this.tempProgressValue = Math.max(0, Math.min(
        this.progressGoal.targetValue,
        this.tempProgressValue + amount
      ));
    }
  }

  toggleComplete(goal: Goal): void {
    this.goalsService.toggleComplete(goal.id);
  }

  deleteGoal(goal: Goal): void {
    if (confirm('Are you sure you want to delete this goal?')) {
      this.goalsService.deleteGoal(goal.id);
    }
  }

  getProgressPercentage(goal: Goal): number {
    return this.goalsService.getProgressPercentage(goal);
  }

  getDaysRemaining(goal: Goal): number {
    return this.goalsService.getDaysRemaining(goal);
  }

  getGoalStatus(goal: Goal): string {
    return this.goalsService.getGoalStatus(goal);
  }

  getCategoryInfo(category: GoalCategory): CategoryInfo {
    return this.goalsService.getCategoryInfo(category);
  }

  getStatusLabel(goal: Goal): string {
    const status = this.getGoalStatus(goal);
    const days = this.getDaysRemaining(goal);
    
    switch (status) {
      case 'completed': return 'Completed!';
      case 'overdue': return `${Math.abs(days)} days overdue`;
      case 'ahead': return 'Ahead of schedule';
      case 'behind': return 'Behind schedule';
      default: return `${days} days left`;
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  private resetForm(): void {
    this.newGoal = {
      title: '',
      description: '',
      category: 'fitness',
      progressType: 'numeric',
      targetValue: 10,
      unit: '',
      targetDate: this.getDefaultTargetDate()
    };
  }

  private getDefaultTargetDate(): string {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date.toISOString().split('T')[0];
  }
}

