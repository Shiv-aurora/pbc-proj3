# Wellness App - Quick Guide

## 🚀 Start the App

```bash
cd "/Volumes/SSD/pbc final /wellness-app"
npm start
```

Open: **http://localhost:4200/**

## ✨ What It Does

- **Dashboard** - Shows date and motivational quotes
- **Habit Tracker** - Add, check off, and delete daily habits
- **7-Day Charts** - Visual progress tracking
- **Auto-Save** - Everything saves automatically (localStorage)

## 🎨 Design

- **Colors**: Warm beige, cream, and brown tones
- **Fonts**: Playfair Display (headings) + Inter (body)
- **Layout**: Professional website with navbar
- **Responsive**: Works on mobile and desktop

## 📂 Code Structure

```
src/app/
├── components/
│   ├── navbar/           # Top navigation
│   ├── dashboard/        # Main page
│   ├── habit-tracker/    # Habit CRUD
│   └── habit-chart/      # 7-day chart
├── services/
│   └── habit.service.ts  # Business logic
└── models/
    └── habit.model.ts    # Data types
```

## 🛠️ Tech Stack

- Angular 18 + TypeScript
- Chart.js for visualizations
- SCSS for styling
- LocalStorage for data
- Reactive Forms

## ✅ Features for Class

- Components with parent-child communication
- Routing setup
- Services with dependency injection
- Reactive forms with validation
- Data visualization
- localStorage persistence

## 🎯 Quick Test

1. Add a habit
2. Check it off
3. See chart update
4. Refresh page (data persists!)



