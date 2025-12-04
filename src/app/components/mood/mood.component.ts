import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import * as Papa from 'papaparse';

interface MoodEntry {
  date: string;
  mood: string;
  // add more fields to match your CSV headers
}

@Component({
  selector: 'app-mood',                       // <app-mood></app-mood>
  standalone: true,
  imports: [CommonModule],                    // for *ngIf, *ngFor in the template
  templateUrl: './mood.component.html',
  styleUrls: ['./mood.component.scss']
})
export class MoodComponent implements OnInit {

  moodData: MoodEntry[] = [];
  loading = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadMoodData();
  }

  private loadMoodData(): void {
    this.http.get('assets/daylio/daylio_mood.csv', { responseType: 'text' })
      .subscribe({
        next: (csv: string) => {
          Papa.parse<MoodEntry>(csv, {
            header: true,
            skipEmptyLines: true,
            complete: (results: Papa.ParseResult<MoodEntry>) => {
              this.moodData = results.data;
              this.loading = false;
              console.log('Parsed data:', this.moodData);
            }
          });
        },
        error: (err) => {
          console.error('Error loading CSV:', err);
          this.loading = false;
        }
      });
  }  
}
