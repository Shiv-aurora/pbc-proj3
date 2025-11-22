import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { HabitService } from '../../services/habit.service';
import { HabitStats } from '../../models/habit.model';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-habit-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './habit-chart.component.html',
  styleUrl: './habit-chart.component.scss'
})
export class HabitChartComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() habitId!: string;
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  
  private chart: Chart | null = null;
  habitStats: HabitStats | null = null;

  constructor(private habitService: HabitService) {}

  ngOnInit() {
    this.loadHabitStats();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['habitId'] && !changes['habitId'].firstChange) {
      this.loadHabitStats();
      this.updateChart();
    }
  }

  ngAfterViewInit() {
    this.createChart();
    
    // Subscribe to habit changes to update chart
    this.habitService.habits$.subscribe(() => {
      this.loadHabitStats();
      this.updateChart();
    });
  }

  private loadHabitStats(): void {
    if (this.habitId) {
      this.habitStats = this.habitService.getHabitStats(this.habitId);
    }
  }

  private createChart(): void {
    if (!this.chartCanvas || !this.habitStats) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const labels = this.getLast7DayLabels();
    const data = this.habitStats.last7Days.map(completed => completed ? 1 : 0);

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Completed',
          data: data,
          backgroundColor: data.map(val => 
            val === 1 ? 'rgba(139, 115, 85, 0.7)' : 'rgba(212, 197, 169, 0.3)'
          ),
          borderColor: data.map(val => 
            val === 1 ? 'rgba(139, 115, 85, 1)' : 'rgba(212, 197, 169, 0.6)'
          ),
          borderWidth: 1,
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 1,
            ticks: {
              stepSize: 1,
              callback: function(value) {
                return value === 1 ? '✓' : '';
              }
            },
            grid: {
              display: false
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.parsed.y === 1 ? 'Completed ✓' : 'Not completed';
              }
            }
          }
        }
      }
    };

    this.chart = new Chart(ctx, config);
  }

  private updateChart(): void {
    if (!this.chart || !this.habitStats) return;

    const data = this.habitStats.last7Days.map(completed => completed ? 1 : 0);
    
    this.chart.data.datasets[0].data = data;
    this.chart.data.datasets[0].backgroundColor = data.map(val => 
      val === 1 ? 'rgba(139, 115, 85, 0.7)' : 'rgba(212, 197, 169, 0.3)'
    );
    this.chart.data.datasets[0].borderColor = data.map(val => 
      val === 1 ? 'rgba(139, 115, 85, 1)' : 'rgba(212, 197, 169, 0.6)'
    );
    
    this.chart.update();
  }

  private getLast7DayLabels(): string[] {
    const labels: string[] = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      labels.push(days[date.getDay()]);
    }
    
    return labels;
  }
}
