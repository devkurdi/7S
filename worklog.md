---
Task ID: 1
Agent: main
Task: Complete rewrite of 7S SQUAD PSYAR quiz app with new features

Work Log:
- Read and analyzed all existing project files (page.tsx, store.ts, schema.prisma, API routes)
- Updated Zustand store: changed 'welcome' view to 'home', added 'top' view for leaderboard
- Completely rewrote page.tsx with new architecture:
  - NavBar component with HOME/QUIZ/TOP navigation tabs
  - ADMIN PANEL button on top-right with modal password login
  - Language toggle (Badini/Surani) on top-left
  - HomePage: Beautiful professional design with name input + visual feedback (green checkmark), avatar upload, category selection, start button, mini TOP 5 leaderboard
  - QuizPage: Sequential question flow, 120s timer, correct/wrong/timeout visual feedback, auto-advance, 10 points per correct answer
  - TopPage: Full leaderboard showing up to 100 players with search, ranked by score, gold/silver/bronze badges, player name + points + avatar
  - ResultsPage: Score summary with percentage, correct/wrong counts, retry/home buttons
  - AdminPage: Password-protected (00998877), tabbed UI for categories and questions CRUD
- Added new translation keys: homeTab, quizTab, topTab, rank, searchPlayer, noPlayersYet, totalPoints, welcomeBack, profileSection, enterNameToStart
- Fixed missing lucide-react icon (Ranking) - removed unused import
- Cleaned up unused icon imports (Brain, Flame, ChevronLeft, ArrowRight)
- Build verified successfully with no errors

Stage Summary:
- Complete rewrite of page.tsx (~900 lines) with all user-requested features
- HOME page with professional design, name input with visual feedback, ADMIN PANEL on top-right
- TOP leaderboard page showing 1-100 players with names and points
- Sequential quiz flow with 10 points per correct answer
- All text in Badini Kurdish with Surani support
- Build passes successfully
