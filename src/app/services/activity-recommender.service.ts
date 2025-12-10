import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

interface MoodEntry {
  date: string;
  weekday: string;
  time: string;
  mood: string;
  activities: string[];
}

export interface ActivityScore {
  activity: string;
  positiveCount: number;
  negativeCount: number;
  totalCount: number;
  positivePercentage: number;
  moodBoostScore: number;
}

export interface DailyRecommendation {
  activity: string;
  reason: string;
  positivePercentage: number;
  icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class ActivityRecommenderService {
  
  // Define which moods are positive vs negative
  private readonly POSITIVE_MOODS = [
    'yolo', 'focused', 'excited', 'blessed', 'good', 'happy', 
    'chill', 'cool', 'over the moon', 'happiest day', 'grateful',
    'motivated', 'peaceful', 'relaxed'
  ];
  
  private readonly NEGATIVE_MOODS = [
    'angry', 'awful', 'bad', 'sad af', 'scared', 'sick', 
    'triggered', 'weak', 'worried', 'anxious', 'stressed'
  ];

  private readonly ACTIVITY_ICONS: { [key: string]: string } = {
    'meditation': '🧘',
    'walk': '🚶',
    'reading': '📖',
    'good meal': '🍽️',
    'cooking': '👨‍🍳',
    'prayer': '🙏',
    'fasting': '🌙',
    'shower': '🚿',
    'writing': '✍️',
    'learning': '📚',
    'art': '🎨',
    'youtube': '📺',
    'streaming': '🎬',
    'reddit': '💬',
    'audio books': '🎧',
    'watching series': '📺',
    'language learning': '🗣️',
    'coding': '💻',
    'travel': '✈️',
    'cleaning': '🧹',
    'new things': '✨',
    'power nap': '😴',
    'documentary': '🎥',
    'quran': '📿',
    'exercise': '💪',
    'news update': '📰'
  };

  private activityScores: ActivityScore[] = [];
  private moodData: MoodEntry[] = [];
  private dataLoaded = new BehaviorSubject<boolean>(false);
  
  public dataLoaded$ = this.dataLoaded.asObservable();

  constructor(private http: HttpClient) {
    this.loadAndAnalyzeData();
  }

  private loadAndAnalyzeData(): void {
    this.http.get<MoodEntry[]>('assets/data/mood-data/daylio_clean.json')
      .subscribe({
        next: (data) => {
          this.moodData = data;
          this.analyzeActivityMoodCorrelations();
          this.dataLoaded.next(true);
        },
        error: (err) => {
          console.error('Error loading mood data for recommendations:', err);
        }
      });
  }

  private analyzeActivityMoodCorrelations(): void {
    const activityStats: { [key: string]: { positive: number; negative: number; neutral: number } } = {};

    // Count positive/negative occurrences for each activity
    this.moodData.forEach(entry => {
      const isPositive = this.POSITIVE_MOODS.includes(entry.mood.toLowerCase());
      const isNegative = this.NEGATIVE_MOODS.includes(entry.mood.toLowerCase());

      entry.activities?.forEach(activity => {
        if (!activityStats[activity]) {
          activityStats[activity] = { positive: 0, negative: 0, neutral: 0 };
        }

        if (isPositive) {
          activityStats[activity].positive++;
        } else if (isNegative) {
          activityStats[activity].negative++;
        } else {
          activityStats[activity].neutral++;
        }
      });
    });

    // Calculate scores for each activity
    this.activityScores = Object.entries(activityStats)
      .map(([activity, stats]) => {
        const total = stats.positive + stats.negative + stats.neutral;
        const positivePercentage = total > 0 ? Math.round((stats.positive / total) * 100) : 0;
        
        // Mood boost score: how much better than average (50%) this activity performs
        const moodBoostScore = positivePercentage - 50;

        return {
          activity,
          positiveCount: stats.positive,
          negativeCount: stats.negative,
          totalCount: total,
          positivePercentage,
          moodBoostScore
        };
      })
      // Filter out activities with too few data points
      .filter(score => score.totalCount >= 10)
      // Sort by positive percentage
      .sort((a, b) => b.positivePercentage - a.positivePercentage);
  }

  /**
   * Get top N activities that correlate with positive moods
   */
  getTopPositiveActivities(count: number = 5): ActivityScore[] {
    return this.activityScores.slice(0, count);
  }

  /**
   * Get activities that correlate with negative moods (to potentially avoid)
   */
  getActivitiesToAvoid(count: number = 3): ActivityScore[] {
    return [...this.activityScores]
      .sort((a, b) => a.positivePercentage - b.positivePercentage)
      .slice(0, count);
  }

  /**
   * Get a daily recommendation - picks from top activities with some variety
   */
  getDailyRecommendation(): DailyRecommendation {
    const topActivities = this.getTopPositiveActivities(10);
    
    if (topActivities.length === 0) {
      return {
        activity: 'meditation',
        reason: 'Meditation is known to improve mental wellness',
        positivePercentage: 80,
        icon: '🧘'
      };
    }

    // Use day of year to rotate through recommendations
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const selectedActivity = topActivities[dayOfYear % topActivities.length];

    return {
      activity: selectedActivity.activity,
      reason: `People who do this are ${selectedActivity.positivePercentage}% more likely to report positive moods`,
      positivePercentage: selectedActivity.positivePercentage,
      icon: this.getActivityIcon(selectedActivity.activity)
    };
  }

  /**
   * Get multiple recommendations for variety
   */
  getRecommendations(count: number = 3): DailyRecommendation[] {
    const topActivities = this.getTopPositiveActivities(count * 2);
    
    // Shuffle and pick
    const shuffled = topActivities.sort(() => Math.random() - 0.5);
    
    return shuffled.slice(0, count).map(activity => ({
      activity: activity.activity,
      reason: `${activity.positivePercentage}% positive mood correlation`,
      positivePercentage: activity.positivePercentage,
      icon: this.getActivityIcon(activity.activity)
    }));
  }

  /**
   * Get all activity scores for insights page
   */
  getAllActivityScores(): ActivityScore[] {
    return this.activityScores;
  }

  /**
   * Get icon for an activity
   */
  getActivityIcon(activity: string): string {
    return this.ACTIVITY_ICONS[activity.toLowerCase()] || '✨';
  }

  /**
   * Get mood category for a mood string
   */
  getMoodCategory(mood: string): 'positive' | 'negative' | 'neutral' {
    if (this.POSITIVE_MOODS.includes(mood.toLowerCase())) return 'positive';
    if (this.NEGATIVE_MOODS.includes(mood.toLowerCase())) return 'negative';
    return 'neutral';
  }
}

