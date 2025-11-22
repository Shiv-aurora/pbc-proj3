# Testing Guide

Quick checklist to test all features.

## 🌐 Access

1. Start: `npm start`
2. Open: `http://localhost:4200/`

## ✅ Quick Test Flow

### 1. Dashboard
- [ ] Page loads
- [ ] Current date shows
- [ ] Quote displays
- [ ] Navbar at top

### 2. Add Habit
- [ ] Click "+ Add New Habit"
- [ ] Enter name (required)
- [ ] Enter description (optional)
- [ ] Click "Add Habit"
- [ ] Habit appears

### 3. Check Off Habit
- [ ] Click checkbox
- [ ] Name gets strikethrough
- [ ] Chart updates
- [ ] Click again to uncheck

### 4. View Chart
- [ ] 7-day bar chart shows
- [ ] Completion percentage displays
- [ ] Green bar for completed days
- [ ] Beige bar for incomplete days

### 5. Delete Habit
- [ ] Click trash icon
- [ ] Confirm deletion
- [ ] Habit removes

### 6. Data Persistence
- [ ] Add habits
- [ ] Check some off
- [ ] Refresh page
- [ ] All data still there

### 7. Responsive
- [ ] Resize window
- [ ] Test mobile view (F12 → device toolbar)
- [ ] Everything still works

## 🎯 Success Criteria

All these work:
- ✅ Add habits
- ✅ Check/uncheck
- ✅ Delete habits
- ✅ See charts
- ✅ Data saves
- ✅ Mobile responsive

## 🐛 Known Behavior

- Can only check once per day (by design)
- No edit feature (delete and re-add)
- Data is local only (no cloud sync)

Done? You're ready to present! 🎉
