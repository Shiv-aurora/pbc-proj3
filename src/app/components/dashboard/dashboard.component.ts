import { Component, OnInit } from '@angular/core';
import { HabitTrackerComponent } from '../habit-tracker/habit-tracker.component';

@Component({
    selector: 'app-dashboard',
    imports: [HabitTrackerComponent],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  currentDate: string = '';
  motivationalQuote: string = '';
  quoteAuthor: string = '';

  private quotes = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
    { text: "Believe in yourself. You are braver than you think, more talented than you know, and capable of more than you imagine.", author: "Roy T. Bennett" },
    { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
    { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
    { text: "Your limitation—it's only your imagination.", author: "Unknown" }
  ];

  ngOnInit() {
    this.setCurrentDate();
    this.setRandomQuote();
  }

  private setCurrentDate(): void {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    this.currentDate = date.toLocaleDateString('en-US', options);
  }

  private setRandomQuote(): void {
    const randomIndex = Math.floor(Math.random() * this.quotes.length);
    const quote = this.quotes[randomIndex];
    this.motivationalQuote = quote.text;
    this.quoteAuthor = quote.author;
  }
}
