import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityRecommenderService, DailyRecommendation, ActivityScore } from '../../services/activity-recommender.service';

@Component({
  selector: 'app-activity-recommender',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activity-recommender.component.html',
  styleUrls: ['./activity-recommender.component.scss']
})
export class ActivityRecommenderComponent implements OnInit {
  
  dailyRecommendation: DailyRecommendation | null = null;
  topActivities: ActivityScore[] = [];
  activitiesToAvoid: ActivityScore[] = [];
  isLoading = true;
  showInsights = false;

  constructor(private recommenderService: ActivityRecommenderService) {}

  ngOnInit(): void {
    this.recommenderService.dataLoaded$.subscribe(loaded => {
      if (loaded) {
        this.loadRecommendations();
        this.isLoading = false;
      }
    });
  }

  private loadRecommendations(): void {
    this.dailyRecommendation = this.recommenderService.getDailyRecommendation();
    this.topActivities = this.recommenderService.getTopPositiveActivities(5);
    this.activitiesToAvoid = this.recommenderService.getActivitiesToAvoid(3);
  }

  toggleInsights(): void {
    this.showInsights = !this.showInsights;
  }

  getActivityIcon(activity: string): string {
    return this.recommenderService.getActivityIcon(activity);
  }

  getBarWidth(percentage: number): number {
    // Scale from 0-100 to show relative difference
    // Most activities are 40-80%, so scale to show variation
    return Math.max(10, Math.min(100, (percentage - 30) * 1.5));
  }

  getBarColor(percentage: number): string {
    if (percentage >= 70) return '#4CAF50';
    if (percentage >= 55) return '#8BC34A';
    if (percentage >= 45) return '#FFC107';
    return '#FF9800';
  }
}

