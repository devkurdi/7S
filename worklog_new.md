---
Task ID: 1
Agent: Main
Task: Redesign quiz app - everything inside HOME, hardcoded questions data

Work Log:
- Created src/lib/questions.ts with 30 hardcoded bilingual questions across 8 categories
- Updated src/lib/store.ts with new state management for inline quiz and localStorage leaderboard
- Completely rewrote src/app/page.tsx as all-in-one HOME page
- Build successful, dev server running on port 3000

Stage Summary:
- App fully redesigned with all content inside HOME
- Questions hardcoded in src/lib/questions.ts - easy to add more
- Leaderboard uses localStorage (top 100)
- 30 bilingual questions, sequential quiz flow with timer and scoring
