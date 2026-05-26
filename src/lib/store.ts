import { create } from 'zustand'

export type Lang = 'badini' | 'sorani'

export type AppView = 'welcome' | 'quiz' | 'admin' | 'results'

export interface QuizQuestion {
  id: string
  textBadini: string
  textSorani: string
  option1Badini: string
  option1Sorani: string
  option2Badini: string
  option2Sorani: string
  option3Badini: string
  option3Sorani: string
  option4Badini: string
  option4Sorani: string
  correctAnswer: number
  categoryId: string
  category: {
    id: string
    nameBadini: string
    nameSorani: string
  }
}

export interface QuizCategory {
  id: string
  nameBadini: string
  nameSorani: string
  _count?: { questions: number }
}

export interface ParticipantData {
  id: string
  name: string
  avatar: string | null
}

interface AppState {
  view: AppView
  setView: (view: AppView) => void
  lang: Lang
  setLang: (lang: Lang) => void
  participant: ParticipantData | null
  setParticipant: (p: ParticipantData | null) => void
  selectedCategoryId: string | null
  setSelectedCategoryId: (id: string | null) => void
  currentQuestionIndex: number
  setCurrentQuestionIndex: (i: number) => void
  questions: QuizQuestion[]
  setQuestions: (q: QuizQuestion[]) => void
  answeredQuestionIds: string[]
  addAnsweredQuestionId: (id: string) => void
  correctCount: number
  incrementCorrect: () => void
  wrongCount: number
  incrementWrong: () => void
  score: number
  setScore: (s: number) => void
  isAdminAuth: boolean
  setIsAdminAuth: (v: boolean) => void
  resetQuiz: () => void
}

export const useAppStore = create<AppState>((set) => ({
  view: 'welcome',
  setView: (view) => set({ view }),
  lang: 'badini',
  setLang: (lang) => set({ lang }),
  participant: null,
  setParticipant: (participant) => set({ participant }),
  selectedCategoryId: null,
  setSelectedCategoryId: (selectedCategoryId) => set({ selectedCategoryId }),
  currentQuestionIndex: 0,
  setCurrentQuestionIndex: (currentQuestionIndex) => set({ currentQuestionIndex }),
  questions: [],
  setQuestions: (questions) => set({ questions }),
  answeredQuestionIds: [],
  addAnsweredQuestionId: (id) =>
    set((state) => ({ answeredQuestionIds: [...state.answeredQuestionIds, id] })),
  correctCount: 0,
  incrementCorrect: () => set((state) => ({ correctCount: state.correctCount + 1 })),
  wrongCount: 0,
  incrementWrong: () => set((state) => ({ wrongCount: state.wrongCount + 1 })),
  score: 0,
  setScore: (score) => set({ score }),
  isAdminAuth: false,
  setIsAdminAuth: (isAdminAuth) => set({ isAdminAuth }),
  resetQuiz: () =>
    set({
      currentQuestionIndex: 0,
      questions: [],
      answeredQuestionIds: [],
      correctCount: 0,
      wrongCount: 0,
      score: 0,
      selectedCategoryId: null,
    }),
}))
