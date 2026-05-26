import { create } from 'zustand'
import { HardcodedQuestion } from './questions'

export type Lang = 'badini' | 'sorani'

export interface PlayerData {
  id: string
  name: string
  avatar: string | null
  score: number
  correctCount: number
  totalAnswered: number
  createdAt: number
}

export type SectionView = 'home' | 'quiz' | 'results'

interface AppState {
  // Language
  lang: Lang
  setLang: (lang: Lang) => void

  // Current view
  section: SectionView
  setSection: (s: SectionView) => void

  // Player info
  playerName: string
  setPlayerName: (n: string) => void
  playerAvatar: string | null
  setPlayerAvatar: (a: string | null) => void

  // Selected category
  selectedCategory: string
  setSelectedCategory: (c: string) => void

  // Quiz state
  quizQuestions: HardcodedQuestion[]
  setQuizQuestions: (q: HardcodedQuestion[]) => void
  currentQuestionIndex: number
  setCurrentQuestionIndex: (i: number) => void
  selectedAnswer: number | null
  setSelectedAnswer: (a: number | null) => void
  isAnswered: boolean
  setIsAnswered: (v: boolean) => void
  correctCount: number
  incrementCorrect: () => void
  wrongCount: number
  incrementWrong: () => void
  score: number
  addScore: (pts: number) => void
  timeLeft: number
  setTimeLeft: (t: number) => void

  // Admin
  isAdminAuth: boolean
  setIsAdminAuth: (v: boolean) => void

  // Leaderboard (stored in localStorage)
  leaderboard: PlayerData[]
  setLeaderboard: (entries: PlayerData[]) => void
  addPlayerToLeaderboard: (player: PlayerData) => void

  // Reset
  resetQuiz: () => void
}

const LEADERBOARD_KEY = '7s_squad_leaderboard'

function loadLeaderboard(): PlayerData[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(LEADERBOARD_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveLeaderboard(entries: PlayerData[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries))
  } catch { /* ignore */ }
}

export const useAppStore = create<AppState>((set, get) => ({
  lang: 'badini',
  setLang: (lang) => set({ lang }),

  section: 'home',
  setSection: (section) => set({ section }),

  playerName: '',
  setPlayerName: (playerName) => set({ playerName }),
  playerAvatar: null,
  setPlayerAvatar: (playerAvatar) => set({ playerAvatar }),

  selectedCategory: '',
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),

  quizQuestions: [],
  setQuizQuestions: (quizQuestions) => set({ quizQuestions }),
  currentQuestionIndex: 0,
  setCurrentQuestionIndex: (currentQuestionIndex) => set({ currentQuestionIndex }),
  selectedAnswer: null,
  setSelectedAnswer: (selectedAnswer) => set({ selectedAnswer }),
  isAnswered: false,
  setIsAnswered: (isAnswered) => set({ isAnswered }),
  correctCount: 0,
  incrementCorrect: () => set((s) => ({ correctCount: s.correctCount + 1 })),
  wrongCount: 0,
  incrementWrong: () => set((s) => ({ wrongCount: s.wrongCount + 1 })),
  score: 0,
  addScore: (pts) => set((s) => ({ score: s.score + pts })),
  timeLeft: 120,
  setTimeLeft: (timeLeft) => set({ timeLeft }),

  isAdminAuth: false,
  setIsAdminAuth: (isAdminAuth) => set({ isAdminAuth }),

  leaderboard: [],
  setLeaderboard: (leaderboard) => {
    set({ leaderboard })
    saveLeaderboard(leaderboard)
  },
  addPlayerToLeaderboard: (player) => {
    const current = get().leaderboard
    // Check if player already exists by name, update their score
    const existing = current.findIndex(p => p.name === player.name)
    let updated: PlayerData[]
    if (existing >= 0) {
      updated = [...current]
      updated[existing] = {
        ...updated[existing],
        score: updated[existing].score + player.score,
        correctCount: updated[existing].correctCount + player.correctCount,
        totalAnswered: updated[existing].totalAnswered + player.totalAnswered,
        avatar: player.avatar || updated[existing].avatar,
      }
    } else {
      updated = [...current, player]
    }
    // Sort by score descending
    updated.sort((a, b) => b.score - a.score)
    // Keep top 100
    updated = updated.slice(0, 100)
    set({ leaderboard: updated })
    saveLeaderboard(updated)
  },

  resetQuiz: () =>
    set({
      currentQuestionIndex: 0,
      selectedAnswer: null,
      isAnswered: false,
      correctCount: 0,
      wrongCount: 0,
      score: 0,
      timeLeft: 120,
      quizQuestions: [],
    }),
}))
