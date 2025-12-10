import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface MoodEntry {
  date: string;
  weekday: string;
  time: string;
  mood: string;
  activities: string[];
}

@Component({
    selector: 'app-mood',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './mood.component.html',
    styleUrls: ['./mood.component.scss']
})
export class MoodComponent implements OnInit {

  moodData: MoodEntry[] = [];
  loading = true;
  error: string | null = null;
  
  // For mood statistics
  moodCounts: { [key: string]: number } = {};
  topActivities: { name: string; count: number }[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadMoodData();
  }

  private loadMoodData(): void {
    this.http.get<MoodEntry[]>('assets/data/mood-data/daylio_clean.json')
      .subscribe({
        next: (data: MoodEntry[]) => {
          this.moodData = data;
          this.calculateStats();
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading mood data:', err);
          this.error = 'Error loading dataset';
          this.loading = false;
        }
      });
  }

  private calculateStats(): void {
    // Count moods
    this.moodCounts = {};
    const activityCounts: { [key: string]: number } = {};

    this.moodData.forEach(entry => {
      // Count moods
      this.moodCounts[entry.mood] = (this.moodCounts[entry.mood] || 0) + 1;
      
      // Count activities
      entry.activities?.forEach(activity => {
        activityCounts[activity] = (activityCounts[activity] || 0) + 1;
      });
    });

    // Get top 10 activities
    this.topActivities = Object.entries(activityCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  getMoodEmoji(mood: string): string {
    const moodEmojis: { [key: string]: string } = {
      'happy': '😊',
      'good': '🙂',
      'meh': '😐',
      'bad': '😔',
      'awful': '😢',
      'yolo': '🤪',
      'focused': '🎯',
      'excited': '🎉',
      'relaxed': '😌',
      'stressed': '😰',
      'tired': '😴',
      'anxious': '😟',
      'grateful': '🙏',
      'motivated': '💪',
      'peaceful': '☮️'
    };
    return moodEmojis[mood.toLowerCase()] || '📝';
  }

  getMoodColor(mood: string): string {
    const moodColors: { [key: string]: string } = {
      'happy': '#4CAF50',
      'good': '#8BC34A',
      'meh': '#FFC107',
      'bad': '#FF9800',
      'awful': '#f44336',
      'yolo': '#9C27B0',
      'focused': '#2196F3',
      'excited': '#E91E63',
      'relaxed': '#00BCD4',
      'stressed': '#FF5722',
      'tired': '#795548',
      'anxious': '#FF7043',
      'grateful': '#66BB6A',
      'motivated': '#7C4DFF',
      'peaceful': '#26A69A'
    };
    return moodColors[mood.toLowerCase()] || '#9E9E9E';
  }
}
