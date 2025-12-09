import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface MoodEntry {
  date: string;
  mood: string;
  // add more fields to match your CSV headers
}

@Component({
    selector: 'app-mood',
    standalone: true,
    imports: [CommonModule], // for *ngIf, *ngFor in the template
    templateUrl: './mood.component.html',
    styleUrls: ['./mood.component.scss']
})
export class MoodComponent implements OnInit {

  moodData: MoodEntry[] = [];
  loading = true;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadMoodData();
  }

  private loadMoodData(): void {
    this.http.get('assets/data/daylio_clean.json', { responseType: 'text' })
      .subscribe({
        next: (csv: string) => {
        },
        error: (err) => {
          console.error('Error loading CSV:', err);
          this.error = 'Error loading dataset';
          this.loading = false;
        }
      });
  }  
}
