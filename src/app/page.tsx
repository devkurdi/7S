'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useAppStore, Lang, DBQuestion, DBCategory, PlayerData, TabView } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  UserPlus, Shield, Plus, Trash2, Trophy, CheckCircle2,
  XCircle, BookOpen, Languages, Search,
  Star, Zap, Sparkles, Eye, EyeOff,
  Gamepad2, Crown, Target, CircleDot, Medal,
  Users, ChevronDown, ChevronUp, Play, RotateCcw, ArrowLeft, ListChecks, BarChart3,
  Clock, Flame, Brain, MapPin, Atom, Globe2, Dumbbell, Lightbulb,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { motion, AnimatePresence } from 'framer-motion'

// ===================== TRANSLATIONS =====================
const translations = {
  badini: {
    appName: '7S SQUAD PSYAR',
    welcome: 'بەخێربێیت',
    enterName: 'ناڤێ خۆ بنڤیسە...',
    uploadAvatar: 'وێنە یان لۆگۆ باربکە',
    startQuiz: 'دەستپێبکە',
    selectCategory: 'جۆرێ پرسیارێ هەڵبژێرە',
    allCategories: 'تەڤایەتی',
    nextQuestion: 'پرسیارا دواوە',
    viewResults: 'ئەنجامەکان ببینە',
    correct: 'بەرسڤ دروسته!',
    wrong: 'ببوورە بەرسڤ خەلەتە',
    wrongCorrectIs: 'بەرسڤا درست ئەڤەیە',
    timeUp: 'دەم ب دوماهی هات!',
    timeUpCorrectIs: 'بەرسڤا درست ئەڤەیە',
    seconds: 'چرکە',
    question: 'پرسیار',
    of: 'ژ',
    score: 'خاڵ',
    correctAnswers: 'بەرسڤێن دروست',
    wrongAnswers: 'بەرسڤێن خەلەت',
    adminPanel: 'ADMIN PANEL',
    adminPassword: 'پەیڤا نهێنی ئەدمین',
    addCategory: 'جۆرێ نوو زێدەبکە',
    addQuestion: 'پرسیارێ نوو زێدەبکە',
    delete: 'ژێببە',
    save: 'پاشەکەوتبکە',
    noQuestions: 'پرسیارێ نین',
    backToHome: 'گەڕانەوە دەستپێک',
    quizComplete: 'کویز تەواو بوو!',
    yourScore: 'خاڵێ تە',
    questions: 'پرسیار',
    invalidPassword: 'پەیڤا نهێنی خەلەتە!',
    badini: 'بادینی',
    sorani: 'سورانی',
    retryQuiz: 'دووبارە کویز',
    excellent: 'ئەلەم! سەرکەوتن!',
    good: 'باشە! بەردەوامبە!',
    tryAgain: 'هەوڵبدەرەوە!',
    availableQuestions: 'پرسیارێن بەردەست',
    chooseAndStart: 'جۆرێ هەڵبژێرە و دەستپێبکە',
    pointsPerQuestion: '١٠ خاڵ',
    topList: 'TOP',
    playerName: 'ناوی یاریزان',
    points: 'خاڵ',
    enterAdminPass: 'پەیڤا نهێنی بنڤیسە...',
    adminLogin: 'چوونەژوورێ ئەدمین',
    rank: 'پلە',
    noPlayersYet: 'هێشتا یاریزانێک نییە',
    totalPoints: 'کۆی خاڵ',
    welcomeBack: 'بەخێربێیتەوە',
    enterNameToStart: 'ناڤێ خۆ بنڤیسە تا دەستپێبکەی',
    quizSection: 'برسیاركرن',
    topSection: 'TOP ١٠٠',
    homeSection: 'HOME',
    quizEnded: 'کویز تەواو بوو',
    playAgain: 'دووبارە یاریبکە',
    timeRemaining: 'چرکە',
    category: 'جۆر',
    manageQuestions: 'بەڕێوەبردنا پرسیاران',
    manageCategories: 'بەڕێوەبردنا جۆران',
    logout: 'دەرچوو',
    questionNumber: 'پرسیاری ژمارە',
    option: 'هەڵبژارتن',
    correctOption: 'هەڵبژارتنا دروست',
    questionsTab: 'برسیاركرن',
    categoryNameBadini: 'ناڤێ جۆری بادینی',
    categoryNameSorani: 'ناڤێ جۆری سورانی',
    questionTextBadini: 'پرسیارا بادینی',
    questionTextSorani: 'پرسیارا سورانی',
    optionBadini: 'هەڵبژارتن بادینی',
    optionSorani: 'هەڵبژارتن سورانی',
    addNewQuestion: 'پرسیارێ نوو زێدەبکە',
    addNewCategory: 'جۆرێ نوو زێدەبکە',
    selectCategoryForQuestion: 'جۆرێ هەڵبژێرە بۆ پرسیارێ',
    successAdded: 'سەرکەوتنەوە زێدەکرا',
    errorAdded: 'خەلەتە! نەزێدەکرا',
    confirmDelete: 'دڵنیایت ژێدبڕیت؟',
  },
  sorani: {
    appName: '7S SQUAD PSYAR',
    welcome: 'بەخێربێیت',
    enterName: 'ناوت بنووسە...',
    uploadAvatar: 'وێنە یان لۆگۆ باربکە',
    startQuiz: 'دەستپێبکە',
    selectCategory: 'جۆرى پرسیار هەڵبژێرە',
    allCategories: 'تەواوى',
    nextQuestion: 'پرسیارى دواتر',
    viewResults: 'ئەنجامەکان ببینە',
    correct: 'وەڵامى ڕاستە!',
    wrong: 'ببورە وەڵام هەڵەیە',
    wrongCorrectIs: 'وەڵامى ڕاست ئەمەیە',
    timeUp: 'کات تەواو بوو!',
    timeUpCorrectIs: 'وەڵامى ڕاست ئەمەیە',
    seconds: 'چرکە',
    question: 'پرسیار',
    of: 'لە',
    score: 'خاڵ',
    correctAnswers: 'وەڵامى ڕاست',
    wrongAnswers: 'وەڵامى هەڵە',
    adminPanel: 'ADMIN PANEL',
    adminPassword: 'وشەى نهێنى ئەدمین',
    addCategory: 'جۆرى نوێ زیادبکە',
    addQuestion: 'پرسیارى نوێ زیادبکە',
    delete: 'سڕینەوە',
    save: 'پاشەکەوتکردن',
    noQuestions: 'پرسیارێک نییە',
    backToHome: 'گەڕانەوە سەرەتا',
    quizComplete: 'کویز تەواو بوو!',
    yourScore: 'خاڵى تۆ',
    questions: 'پرسیار',
    invalidPassword: 'وشەى نهێنى هەڵەیە!',
    badini: 'بادینی',
    sorani: 'سورانی',
    retryQuiz: 'دووبارە کویز',
    excellent: 'ئەلەم! سەرکەوتن!',
    good: 'باشە! بەردەوامبە!',
    tryAgain: 'هەوڵبدەرەوە!',
    availableQuestions: 'پرسیارە بەردەستەکان',
    chooseAndStart: 'جۆرێک هەڵبژێرە و دەستپێبکە',
    pointsPerQuestion: '١٠ خاڵ',
    topList: 'TOP',
    playerName: 'ناوى یاریزان',
    points: 'خاڵ',
    enterAdminPass: 'وشەى نهێنى بنووسە...',
    adminLogin: 'چوونەژوورەوە ئەدمین',
    rank: 'پلە',
    noPlayersYet: 'هێشتا یاریزانێک نییە',
    totalPoints: 'کۆى خاڵ',
    welcomeBack: 'بەخێربێیتەوە',
    enterNameToStart: 'ناوت بنووسە تا دەستپێبکەیت',
    quizSection: 'پرسیارکردن',
    topSection: 'TOP ١٠٠',
    homeSection: 'HOME',
    quizEnded: 'کویز تەواو بوو',
    playAgain: 'دووبارە یاریبکە',
    timeRemaining: 'چرکە',
    category: 'جۆر',
    manageQuestions: 'بەڕێوەبردنى پرسیارەکان',
    manageCategories: 'بەڕێوەبردنى جۆرەکان',
    logout: 'دەرچوون',
    questionNumber: 'پرسیارى ژمارە',
    option: 'هەڵبژاردن',
    correctOption: 'هەڵبژاردنى ڕاست',
    questionsTab: 'پرسیارکردن',
    categoryNameBadini: 'ناوى جۆر بادینی',
    categoryNameSorani: 'ناوى جۆر سورانی',
    questionTextBadini: 'پرسیار بادینی',
    questionTextSorani: 'پرسیار سورانی',
    optionBadini: 'هەڵبژاردن بادینی',
    optionSorani: 'هەڵبژاردن سورانی',
    addNewQuestion: 'پرسیارى نوێ زیادبکە',
    addNewCategory: 'جۆرى نوێ زیادبکە',
    selectCategoryForQuestion: 'جۆرێک هەڵبژێرە بۆ پرسیار',
    successAdded: 'سەرکەوتنەوە زیادکرا',
    errorAdded: 'هەڵە! نەزیادکرا',
    confirmDelete: 'دڵنیایت سڕینەوە؟',
  },
}

type TransKey = keyof typeof translations.badini

function t(lang: Lang, key: TransKey) {
  return translations[lang][key]
}

// ===================== ANIMATED BACKGROUND =====================
function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-red-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
    </div>
  )
}

// ===================== CIRCULAR TIMER =====================
function CircularTimer({ timeLeft, maxTime }: { timeLeft: number; maxTime: number }) {
  const lang = useAppStore(s => s.lang)
  const percentage = (timeLeft / maxTime) * 100
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference
  const isLow = timeLeft <= 30
  const isCritical = timeLeft <= 10

  return (
    <div className="relative w-20 h-20 mx-auto">
      <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth="6" fill="none" />
        <motion.circle
          cx="50" cy="50" r={radius}
          stroke={isCritical ? '#ef4444' : isLow ? '#f59e0b' : '#3b82f6'}
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: 'linear' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          key={timeLeft}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.15 }}
          className={`text-xl font-black font-mono ${isCritical ? 'text-red-400 animate-pulse' : isLow ? 'text-amber-400' : 'text-white'}`}
        >
          {timeLeft}
        </motion.span>
        <span className="text-white/30 text-[7px]">{t(lang, 'seconds')}</span>
      </div>
    </div>
  )
}

// ===================== DATA FETCHING HOOKS =====================
function useCategories() {
  const [categories, setCategories] = useState<DBCategory[]>([])
  const [loading, setLoading] = useState(true)
  const lang = useAppStore(s => s.lang)

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories')
      if (res.ok) {
        const data = await res.json()
        setCategories(data)
      }
    } catch (e) {
      console.error('Failed to fetch categories', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchCategories() }, [fetchCategories])

  return { categories, loading, refetch: fetchCategories }
}

function useQuestions(categoryId?: string) {
  const [questions, setQuestions] = useState<DBQuestion[]>([])
  const [loading, setLoading] = useState(true)

  const fetchQuestions = useCallback(async () => {
    try {
      const url = categoryId ? `/api/questions?categoryId=${categoryId}` : '/api/questions'
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setQuestions(data)
      }
    } catch (e) {
      console.error('Failed to fetch questions', e)
    } finally {
      setLoading(false)
    }
  }, [categoryId])

  useEffect(() => { fetchQuestions() }, [fetchQuestions])

  return { questions, loading, refetch: fetchQuestions }
}

function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<PlayerData[]>([])
  const [loading, setLoading] = useState(true)

  const fetchLeaderboard = useCallback(async () => {
    try {
      const res = await fetch('/api/leaderboard')
      if (res.ok) {
        const data = await res.json()
        setLeaderboard(data)
      }
    } catch (e) {
      console.error('Failed to fetch leaderboard', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchLeaderboard() }, [fetchLeaderboard])

  return { leaderboard, loading, refetch: fetchLeaderboard }
}

// ===================== MAIN APP =====================
export default function App() {
  const tab = useAppStore(s => s.tab)

  // Seed DB on first load
  useEffect(() => {
    fetch('/api/seed', { method: 'POST' }).catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#0d1442] to-[#1a0a2e] relative">
      <AnimatedBackground />
      <div className="relative z-10">
        <NavBar />
        <AnimatePresence mode="wait">
          {tab === 'home' && <HomeSection key="home" />}
          {tab === 'questions' && <QuestionsSection key="questions" />}
          {tab === 'top' && <TopSection key="top" />}
          {tab === 'quiz' && <QuizSection key="quiz" />}
          {tab === 'results' && <ResultsSection key="results" />}
          {tab === 'admin' && <AdminSection key="admin" />}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ===================== NAVBAR =====================
function NavBar() {
  const { tab, setTab, lang, setLang, isAdminAuth } = useAppStore()
  const [showAdminModal, setShowAdminModal] = useState(false)

  const tabs: { key: TabView; label: TransKey; icon: React.ReactNode }[] = [
    { key: 'home', label: 'homeSection', icon: <Gamepad2 className="w-3.5 h-3.5" /> },
    { key: 'questions', label: 'questionsTab', icon: <ListChecks className="w-3.5 h-3.5" /> },
    { key: 'top', label: 'topSection', icon: <Trophy className="w-3.5 h-3.5" /> },
  ]

  return (
    <>
      <div className="sticky top-0 z-50 flex items-center justify-between px-3 py-2.5 bg-black/40 backdrop-blur-xl border-b border-white/10">
        {/* Left - Language Toggle */}
        <Button
          variant="outline"
          size="sm"
          className="bg-white/5 border-white/10 text-white hover:bg-white/10 backdrop-blur-sm rounded-full px-3 h-8 text-xs font-medium"
          onClick={() => setLang(lang === 'badini' ? 'sorani' : 'badini')}
        >
          <Languages className="w-3.5 h-3.5 mr-1.5" />
          {lang === 'badini' ? 'سورانی' : 'بادینی'}
        </Button>

        {/* Center - Navigation Tabs */}
        <div className="flex items-center gap-1 bg-white/5 rounded-xl p-0.5">
          {tabs.map((item) => {
            const isActive = tab === item.key
            return (
              <button
                key={item.key}
                onClick={() => setTab(item.key)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/25'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                }`}
              >
                {item.icon}
                {t(lang, item.label)}
              </button>
            )
          })}
        </div>

        {/* Right - Admin Button */}
        <Button
          variant="outline"
          size="sm"
          className={`backdrop-blur-sm rounded-full px-3 h-8 text-[11px] font-bold ${
            isAdminAuth
              ? 'bg-green-600/20 border-green-500/30 text-green-300 hover:bg-green-600/30'
              : 'bg-gradient-to-r from-orange-600/20 to-red-600/20 border-orange-500/30 text-orange-300 hover:bg-orange-600/30'
          }`}
          onClick={() => {
            if (isAdminAuth) {
              setTab('admin')
            } else {
              setShowAdminModal(true)
            }
          }}
        >
          <Shield className="w-3.5 h-3.5 mr-1.5" />
          ADMIN
        </Button>
      </div>

      <AdminLoginModal open={showAdminModal} onClose={() => setShowAdminModal(false)} />
    </>
  )
}

// ===================== ADMIN LOGIN MODAL =====================
function AdminLoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lang, setIsAdminAuth, setTab } = useAppStore()
  const [adminPass, setAdminPass] = useState('')
  const [showPass, setShowPass] = useState(false)
  const { toast } = useToast()

  const handleAdminLogin = async () => {
    if (!adminPass.trim()) return
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPass }),
      })
      if (res.ok) {
        setIsAdminAuth(true)
        onClose()
        setAdminPass('')
        setTab('admin')
      } else {
        toast({ title: t(lang, 'invalidPassword'), variant: 'destructive' })
      }
    } catch {
      toast({ title: t(lang, 'invalidPassword'), variant: 'destructive' })
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm mx-4"
          >
            <Card className="bg-[#0d1442]/95 backdrop-blur-xl border-white/10 shadow-2xl overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500" />
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3 justify-center" dir="rtl">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white font-bold text-lg">{t(lang, 'adminPanel')}</span>
                </div>
                <div className="relative">
                  <Input
                    type={showPass ? 'text' : 'password'}
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-orange-400/50 rounded-xl h-12 text-sm pr-3 pl-10"
                    placeholder={t(lang, 'enterAdminPass')}
                    dir="ltr"
                    onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                    autoFocus
                  />
                  <button
                    onClick={() => setShowPass(!showPass)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                    type="button"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex gap-2">
                  <Button onClick={onClose} variant="outline" className="flex-1 bg-white/5 border-white/10 text-white/70 hover:bg-white/10 rounded-xl">
                    {t(lang, 'backToHome')}
                  </Button>
                  <Button
                    onClick={handleAdminLogin}
                    disabled={!adminPass.trim()}
                    className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold rounded-xl disabled:opacity-40"
                  >
                    <Shield className="w-3.5 h-3.5 mr-1.5" />
                    {t(lang, 'adminLogin')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ===================== HOME SECTION =====================
function HomeSection() {
  const { lang, setTab, playerName, setPlayerName, playerAvatar, setPlayerAvatar, setSelectedCategory, resetQuiz } = useAppStore()
  const { categories } = useCategories()
  const { leaderboard } = useLeaderboard()
  const [avatarPreview, setAvatarPreview] = useState<string | null>(playerAvatar)
  const { toast } = useToast()

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      setPlayerAvatar(result)
      setAvatarPreview(result)
    }
    reader.readAsDataURL(file)
  }

  const handleStartQuiz = (categoryId: string = '') => {
    if (!playerName.trim()) {
      toast({ title: t(lang, 'enterNameToStart'), variant: 'destructive' })
      return
    }
    setSelectedCategory(categoryId)
    resetQuiz()
    setTab('quiz')
  }

  const getCatName = (cat: DBCategory) => lang === 'badini' ? cat.nameBadini : cat.nameSorani

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-5xl mx-auto px-4 pt-6 pb-8 space-y-6"
    >
      {/* HERO */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="mx-auto mb-4 w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-red-500 flex items-center justify-center shadow-2xl shadow-purple-500/30"
        >
          <Gamepad2 className="w-10 h-10 text-white" />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-wider">
          7S SQUAD <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-red-400 bg-clip-text text-transparent">PSYAR</span>
        </h1>
        {playerName.trim() && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-300/70 mt-2 text-base" dir="rtl">
            {t(lang, 'welcomeBack')} {playerName.trim()}!
          </motion.p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* LEFT - Profile */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-4 space-y-4"
        >
          <Card className="bg-white/[0.04] backdrop-blur-xl border-white/10 shadow-xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500" />
            <CardContent className="p-5 space-y-4">
              {/* Avatar */}
              <div className="flex flex-col items-center gap-2">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-white/10 to-white/5 border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden group-hover:border-purple-400/50 transition-all">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <UserPlus className="w-8 h-8 text-white/30" />
                    )}
                  </div>
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-red-500 flex items-center justify-center shadow-md">
                    <Plus className="w-4 h-4 text-white" />
                  </div>
                </div>
                <Label className="text-white/40 text-xs" dir="rtl">{t(lang, 'uploadAvatar')}</Label>
              </div>

              {/* Name */}
              <div className="space-y-1">
                <Label className="text-white/50 text-xs" dir="rtl">{t(lang, 'enterName')}</Label>
                <div className="relative">
                  <Input
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className={`bg-white/5 border text-white placeholder:text-white/20 rounded-xl h-11 text-sm pr-3 pl-10 transition-all ${
                      playerName.trim() ? 'border-green-500/40 focus:border-green-400/60' : 'border-white/10 focus:border-purple-400/50'
                    }`}
                    placeholder={t(lang, 'enterName')}
                    dir="rtl"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    {playerName.trim() ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <UserPlus className="w-4 h-4 text-white/20" />}
                  </div>
                </div>
              </div>

              {/* Points Badge */}
              <div className="flex items-center justify-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl py-2.5 px-3" dir="rtl">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="text-yellow-300/80 text-sm font-bold">{t(lang, 'pointsPerQuestion')}</span>
              </div>

              {/* Start All Categories */}
              <Button
                onClick={() => handleStartQuiz('')}
                disabled={!playerName.trim()}
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 hover:from-blue-700 hover:via-purple-700 hover:to-red-700 text-white font-bold text-base py-5 rounded-xl shadow-lg shadow-purple-500/25 transition-all hover:shadow-xl hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100"
              >
                <Play className="w-5 h-5 mr-2" />
                {t(lang, 'startQuiz')}
              </Button>
            </CardContent>
          </Card>

          {/* Mini TOP 5 */}
          <Card className="bg-white/[0.04] backdrop-blur-xl border-white/10 shadow-xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500" />
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5" dir="rtl">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span className="text-white/80 text-sm font-bold">{t(lang, 'topList')}</span>
                </div>
                <button
                  onClick={() => setTab('top')}
                  className="text-blue-400/60 text-xs hover:text-blue-400 transition-colors"
                >
                  {t(lang, 'viewResults')} &rarr;
                </button>
              </div>
              {leaderboard.length === 0 ? (
                <div className="text-center py-4">
                  <Users className="w-6 h-6 text-white/15 mx-auto mb-1" />
                  <p className="text-white/25 text-xs" dir="rtl">{t(lang, 'noPlayersYet')}</p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {leaderboard.slice(0, 5).map((entry, i) => (
                    <div
                      key={entry.id}
                      className={`flex items-center gap-2 p-2 rounded-lg ${
                        i === 0 ? 'bg-yellow-500/10 border border-yellow-500/20' :
                        i === 1 ? 'bg-gray-400/10 border border-gray-400/10' :
                        i === 2 ? 'bg-amber-600/10 border border-amber-600/10' :
                        'bg-white/[0.02]'
                      }`}
                      dir="rtl"
                    >
                      <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                        {i === 0 ? <Crown className="w-4 h-4 text-yellow-400" /> :
                         i === 1 ? <Medal className="w-4 h-4 text-gray-300" /> :
                         i === 2 ? <Medal className="w-4 h-4 text-amber-600" /> :
                         <span className="text-white/40 text-xs font-bold">{i + 1}</span>}
                      </div>
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        {entry.avatar ? (
                          <img src={entry.avatar} alt="" className="w-5 h-5 rounded-full object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                            <UserPlus className="w-3 h-3 text-white/30" />
                          </div>
                        )}
                        <p className="text-white/80 text-xs font-bold truncate">{entry.name}</p>
                      </div>
                      <div className="flex items-center gap-0.5 flex-shrink-0">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-yellow-300 text-xs font-bold">{entry.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* RIGHT - Categories */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-8 space-y-4"
        >
          <div>
            <h3 className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-3 flex items-center gap-2" dir="rtl">
              <Target className="w-4 h-4" />
              {t(lang, 'selectCategory')}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* All Categories Card */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleStartQuiz('')}
                className="rounded-xl p-4 border-2 border-white/10 bg-white/[0.03] hover:border-purple-400/50 transition-all text-center"
              >
                <div className="mx-auto mb-2 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-red-500 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <p className="text-white text-xs font-bold" dir="rtl">{t(lang, 'allCategories')}</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-yellow-300/60 text-[10px]">{t(lang, 'pointsPerQuestion')}</span>
                </div>
              </motion.button>

              {/* Category Cards */}
              {categories.map((cat, i) => {
                const colors = ['from-blue-500 to-cyan-500', 'from-purple-500 to-pink-500', 'from-red-500 to-orange-500', 'from-green-500 to-emerald-500', 'from-amber-500 to-yellow-500', 'from-indigo-500 to-blue-500']
                const qCount = cat._count?.questions || 0
                return (
                  <motion.button
                    key={cat.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleStartQuiz(cat.id)}
                    className="rounded-xl p-4 border-2 border-white/10 bg-white/[0.03] hover:border-purple-400/50 transition-all text-center"
                  >
                    <div className={`mx-auto mb-2 w-10 h-10 rounded-lg bg-gradient-to-br ${colors[i % colors.length]} flex items-center justify-center`}>
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-white text-xs font-bold" dir="rtl">{getCatName(cat)}</p>
                    <p className="text-white/30 text-[10px] mt-0.5">{qCount} {t(lang, 'questions')}</p>
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Quick info */}
          <Card className="bg-white/[0.04] backdrop-blur-xl border-white/10 shadow-xl overflow-hidden">
            <CardContent className="p-4" dir="rtl">
              <div className="flex items-center gap-3 justify-center">
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-white/60 text-xs">{t(lang, 'pointsPerQuestion')}</span>
                </div>
                <div className="w-px h-4 bg-white/10" />
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span className="text-white/60 text-xs">{t(lang, 'chooseAndStart')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}

// ===================== QUESTIONS BROWSER SECTION =====================
// Category icon mapping with Lucide icons for visual distinction
const categoryStyles: Record<string, {
  icon: React.ReactNode
  gradient: string
  iconBg: string
  borderColor: string
  glow: string
}> = {
  'ئایینی': {
    icon: <Flame className="w-6 h-6 text-emerald-300" />,
    gradient: 'from-emerald-500 to-teal-500',
    iconBg: 'bg-emerald-500/20',
    borderColor: 'border-emerald-500/30',
    glow: 'shadow-emerald-500/20',
  },
  'زانستی': {
    icon: <Atom className="w-6 h-6 text-blue-300" />,
    gradient: 'from-blue-500 to-cyan-500',
    iconBg: 'bg-blue-500/20',
    borderColor: 'border-blue-500/30',
    glow: 'shadow-blue-500/20',
  },
  'مێژوویی': {
    icon: <Clock className="w-6 h-6 text-amber-300" />,
    gradient: 'from-amber-500 to-orange-500',
    iconBg: 'bg-amber-500/20',
    borderColor: 'border-amber-500/30',
    glow: 'shadow-amber-500/20',
  },
  'جوگرافی': {
    icon: <Globe2 className="w-6 h-6 text-green-300" />,
    gradient: 'from-green-500 to-emerald-500',
    iconBg: 'bg-green-500/20',
    borderColor: 'border-green-500/30',
    glow: 'shadow-green-500/20',
  },
  'وەرزشی': {
    icon: <Dumbbell className="w-6 h-6 text-red-300" />,
    gradient: 'from-red-500 to-rose-500',
    iconBg: 'bg-red-500/20',
    borderColor: 'border-red-500/30',
    glow: 'shadow-red-500/20',
  },
  'گشتی': {
    icon: <Lightbulb className="w-6 h-6 text-purple-300" />,
    gradient: 'from-purple-500 to-pink-500',
    iconBg: 'bg-purple-500/20',
    borderColor: 'border-purple-500/30',
    glow: 'shadow-purple-500/20',
  },
}

function getCatStyle(name: string) {
  return categoryStyles[name] || {
    icon: <BookOpen className="w-6 h-6 text-indigo-300" />,
    gradient: 'from-indigo-500 to-blue-500',
    iconBg: 'bg-indigo-500/20',
    borderColor: 'border-indigo-500/30',
    glow: 'shadow-indigo-500/20',
  }
}

function QuestionsSection() {
  const lang = useAppStore(s => s.lang)
  const { categories } = useCategories()
  const [selectedCat, setSelectedCat] = useState<string>('')
  const [viewMode, setViewMode] = useState<'categories' | 'list'>('categories')
  const [searchTerm, setSearchTerm] = useState('')
  const { questions, loading, refetch } = useQuestions(selectedCat || undefined)
  const { playerName, setTab, setSelectedCategory, resetQuiz } = useAppStore()
  const { toast } = useToast()

  const getCatName = (cat: DBCategory) => lang === 'badini' ? cat.nameBadini : cat.nameSorani
  const getQText = (q: DBQuestion) => lang === 'badini' ? q.textBadini : q.textSorani
  const getOption = (q: DBQuestion, idx: number) => {
    const key = `option${idx}${lang === 'badini' ? 'Badini' : 'Sorani'}` as keyof DBQuestion
    return q[key] as string
  }

  const handleStartFromCategory = (catId: string) => {
    if (!playerName.trim()) {
      toast({ title: t(lang, 'enterNameToStart'), variant: 'destructive' })
      return
    }
    setSelectedCategory(catId)
    resetQuiz()
    setTab('quiz')
  }

  const handleCategoryClick = (catId: string) => {
    setSelectedCat(catId)
    setViewMode('list')
    refetch()
  }

  const totalQuestions = categories.reduce((sum, c) => sum + (c._count?.questions || 0), 0)

  const filteredQuestions = searchTerm.trim()
    ? questions.filter(q => {
        const text = getQText(q).toLowerCase()
        return text.includes(searchTerm.toLowerCase())
      })
    : questions

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-5xl mx-auto px-4 pt-4 pb-8 space-y-5"
    >
      {/* Header with search */}
      <div className="space-y-3" dir="rtl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-xl shadow-purple-500/30">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white font-black text-xl">{t(lang, 'questionsTab')}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="flex items-center gap-1">
                  <ListChecks className="w-3 h-3 text-blue-400" />
                  <span className="text-blue-300/60 text-[10px] font-bold">{totalQuestions} {t(lang, 'questions')}</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-white/20" />
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-yellow-300/60 text-[10px] font-bold">{t(lang, 'pointsPerQuestion')}</span>
                </div>
              </div>
            </div>
          </div>
          {viewMode === 'list' && (
            <Button
              onClick={() => { setViewMode('categories'); setSelectedCat(''); setSearchTerm('') }}
              variant="outline"
              size="sm"
              className="bg-white/5 border-white/10 text-white/60 hover:bg-white/10 rounded-xl text-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              {t(lang, 'allCategories')}
            </Button>
          )}
        </div>

        {/* Search Bar */}
        {viewMode === 'list' && (
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/[0.04] border-white/10 text-white placeholder:text-white/20 focus:border-purple-400/50 rounded-2xl h-11 text-sm pr-10 pl-3"
              placeholder={t(lang, 'selectCategory')}
              dir="rtl"
            />
          </div>
        )}
      </div>

      {/* Categories Grid View */}
      {viewMode === 'categories' && (
        <div className="space-y-5">
          {/* Stats Cards Row */}
          <div className="grid grid-cols-3 gap-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl p-3 text-center"
            >
              <BookOpen className="w-5 h-5 text-blue-400 mx-auto mb-1" />
              <p className="text-white font-black text-lg">{totalQuestions}</p>
              <p className="text-blue-300/50 text-[9px] font-bold">{t(lang, 'questions')}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-2xl p-3 text-center"
            >
              <Target className="w-5 h-5 text-purple-400 mx-auto mb-1" />
              <p className="text-white font-black text-lg">{categories.length}</p>
              <p className="text-purple-300/50 text-[9px] font-bold">{t(lang, 'category')}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/20 rounded-2xl p-3 text-center"
            >
              <Zap className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
              <p className="text-white font-black text-lg">١٠</p>
              <p className="text-yellow-300/50 text-[9px] font-bold">{t(lang, 'points')}</p>
            </motion.div>
          </div>

          {/* Category Cards - Premium Design */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* All Categories Card */}
            <motion.button
              whileHover={{ scale: 1.04, y: -4 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => { setSelectedCat(''); setViewMode('list'); refetch() }}
              className="rounded-2xl p-4 border-2 border-purple-500/20 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-red-500/10 hover:border-purple-400/40 hover:from-purple-500/15 hover:via-blue-500/10 hover:to-red-500/15 transition-all text-center group relative overflow-hidden shadow-lg shadow-purple-500/10"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, type: 'spring' }}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500" />
              <div className="relative">
                <div className="mx-auto mb-3 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-red-500 flex items-center justify-center shadow-xl shadow-purple-500/30 group-hover:shadow-2xl group-hover:shadow-purple-500/40 transition-shadow">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <p className="text-white text-sm font-black mb-1" dir="rtl">{t(lang, 'allCategories')}</p>
                <div className="flex items-center justify-center gap-1.5">
                  <CircleDot className="w-2.5 h-2.5 text-purple-400" />
                  <span className="text-purple-300/60 text-[10px] font-bold">{totalQuestions} {t(lang, 'questions')}</span>
                </div>
              </div>
            </motion.button>

            {/* Individual Category Cards */}
            {categories.map((cat, i) => {
              const style = getCatStyle(cat.nameBadini)
              const qCount = cat._count?.questions || 0
              return (
                <motion.button
                  key={cat.id}
                  whileHover={{ scale: 1.04, y: -4 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`rounded-2xl p-4 border-2 ${style.borderColor} bg-white/[0.02] hover:bg-white/[0.05] transition-all text-center group relative overflow-hidden shadow-lg ${style.glow}`}
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.15 + i * 0.06, type: 'spring', stiffness: 300 }}
                >
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${style.gradient}`} />
                  <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300`} />
                  <div className="relative">
                    <div className={`mx-auto mb-3 w-16 h-16 rounded-2xl ${style.iconBg} border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      {style.icon}
                    </div>
                    <p className="text-white text-sm font-black mb-1" dir="rtl">{getCatName(cat)}</p>
                    <div className="flex items-center justify-center gap-1.5">
                      <CircleDot className={`w-2.5 h-2.5 bg-gradient-to-r ${style.gradient}`} />
                      <span className="text-white/40 text-[10px] font-bold">{qCount} {t(lang, 'questions')}</span>
                    </div>
                    <div className="mt-2.5 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Play className="w-3 h-3 text-green-400" />
                      <span className="text-green-400/80 text-[10px] font-black">{t(lang, 'startQuiz')}</span>
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </div>

          {/* Quick Start All Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              onClick={() => handleStartFromCategory('')}
              disabled={!playerName.trim()}
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 hover:from-blue-700 hover:via-purple-700 hover:to-red-700 text-white font-black text-base py-6 rounded-2xl shadow-xl shadow-purple-500/25 transition-all hover:shadow-2xl hover:scale-[1.01] disabled:opacity-40 disabled:hover:scale-100 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              <Play className="w-5 h-5 mr-2 relative" />
              <span className="relative">{t(lang, 'startQuiz')} - {t(lang, 'allCategories')}</span>
            </Button>
          </motion.div>
        </div>
      )}

      {/* Questions List View */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {/* Category Header + Start Button */}
          {selectedCat && (() => {
            const cat = categories.find(c => c.id === selectedCat)
            if (!cat) return null
            const style = getCatStyle(cat.nameBadini)
            return (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className={`bg-white/[0.04] backdrop-blur-xl border-white/10 shadow-xl overflow-hidden ${style.glow}`}>
                  <div className={`h-1.5 bg-gradient-to-r ${style.gradient}`} />
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between" dir="rtl">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl ${style.iconBg} border border-white/5 flex items-center justify-center shadow-lg ${style.glow}`}>
                          {style.icon}
                        </div>
                        <div>
                          <p className="text-white font-black text-base">{getCatName(cat)}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-white/30 text-[10px] font-bold">{questions.length} {t(lang, 'questions')}</span>
                            <div className="w-1 h-1 rounded-full bg-white/20" />
                            <span className="text-yellow-300/50 text-[10px] font-bold flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 fill-yellow-400/50 text-yellow-400/50" />
                              ١٠ {t(lang, 'points')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleStartFromCategory(selectedCat)}
                        disabled={!playerName.trim()}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-black rounded-2xl text-xs px-5 py-3 shadow-lg shadow-green-500/20 disabled:opacity-40 transition-all hover:scale-105"
                      >
                        <Play className="w-4 h-4 mr-1.5" />
                        {t(lang, 'startQuiz')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })()}

          {/* Questions List */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-10 h-10 border-3 border-blue-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-white/10 mx-auto mb-3" />
              <p className="text-white/30 text-sm font-bold" dir="rtl">{t(lang, 'noQuestions')}</p>
            </div>
          ) : (
            <ScrollArea className="max-h-[calc(100vh-350px)]">
              <div className="space-y-3">
                {filteredQuestions.map((q, idx) => {
                  const catName = lang === 'badini' ? q.category.nameBadini : q.category.nameSorani
                  const style = getCatStyle(catName)
                  const optionLabels = ['A', 'B', 'C', 'D']
                  return (
                    <motion.div
                      key={q.id}
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: idx * 0.04, type: 'spring', stiffness: 400 }}
                    >
                      <Card className="bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1] transition-all duration-300 overflow-hidden group">
                        <div className={`h-0.5 bg-gradient-to-r ${style.gradient} opacity-40 group-hover:opacity-70 transition-opacity`} />
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3" dir="rtl">
                            {/* Question Number Badge */}
                            <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${style.gradient} flex items-center justify-center shadow-lg ${style.glow}`}>
                              <span className="text-sm font-black text-white">{idx + 1}</span>
                            </div>
                            <div className="flex-1 min-w-0 space-y-3">
                              {/* Category + Points Tags */}
                              <div className="flex items-center gap-2">
                                <Badge className={`bg-gradient-to-r ${style.gradient} text-white border-0 text-[9px] px-2.5 py-0.5 font-black shadow-sm`}>
                                  {catName}
                                </Badge>
                                <span className="text-yellow-400/40 text-[9px] flex items-center gap-0.5 font-bold">
                                  <Star className="w-2.5 h-2.5 fill-yellow-400/40" /> ١٠ {t(lang, 'points')}
                                </span>
                              </div>
                              {/* Question Text */}
                              <p className="text-white/90 text-sm leading-relaxed font-bold">{getQText(q)}</p>
                              {/* Options */}
                              <div className="grid grid-cols-2 gap-2">
                                {[1, 2, 3, 4].map((optIdx) => {
                                  const isCorrect = optIdx === q.correctAnswer
                                  return (
                                    <div
                                      key={optIdx}
                                      className={`px-3 py-2.5 rounded-xl text-xs transition-all duration-200 flex items-center gap-2 ${
                                        isCorrect
                                          ? 'bg-green-500/15 border border-green-500/30 text-green-300 font-bold shadow-sm shadow-green-500/10'
                                          : 'bg-white/[0.03] border border-white/[0.06] text-white/50 hover:bg-white/[0.06]'
                                      }`}
                                    >
                                      <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black flex-shrink-0 ${
                                        isCorrect
                                          ? 'bg-green-500/20 text-green-400'
                                          : 'bg-white/5 text-white/20'
                                      }`}>
                                        {optionLabels[optIdx - 1]}
                                      </span>
                                      <span className="truncate">{getOption(q, optIdx)}</span>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </ScrollArea>
          )}

          {/* Start Quiz Button at Bottom */}
          {filteredQuestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Button
                onClick={() => handleStartFromCategory(selectedCat)}
                disabled={!playerName.trim()}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-black rounded-2xl py-5 shadow-xl shadow-green-500/20 disabled:opacity-40 transition-all hover:scale-[1.01] relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                <Play className="w-5 h-5 mr-2 relative" />
                <span className="relative">{t(lang, 'startQuiz')} ({filteredQuestions.length} {t(lang, 'questions')})</span>
              </Button>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  )
}

// ===================== TOP LEADERBOARD SECTION =====================
function TopSection() {
  const lang = useAppStore(s => s.lang)
  const { leaderboard, loading, refetch } = useLeaderboard()
  const [showAll, setShowAll] = useState(false)

  useEffect(() => { refetch() }, [refetch])

  const getRankIcon = (i: number) => {
    if (i === 0) return <Crown className="w-5 h-5 text-yellow-400" />
    if (i === 1) return <Medal className="w-5 h-5 text-gray-300" />
    if (i === 2) return <Medal className="w-5 h-5 text-amber-600" />
    return <span className="text-white/40 text-sm font-bold">{i + 1}</span>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-3xl mx-auto px-4 pt-4 pb-8 space-y-4"
    >
      {/* Header */}
      <div className="text-center" dir="rtl">
        <div className="mx-auto mb-3 w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500 via-amber-500 to-orange-500 flex items-center justify-center shadow-2xl shadow-yellow-500/30">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-black text-white">{t(lang, 'topSection')}</h2>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : leaderboard.length === 0 ? (
        <Card className="bg-white/[0.04] backdrop-blur-xl border-white/10 shadow-xl">
          <CardContent className="p-8 text-center">
            <Users className="w-12 h-12 text-white/15 mx-auto mb-3" />
            <p className="text-white/30 text-sm" dir="rtl">{t(lang, 'noPlayersYet')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {/* Top 3 Podium */}
          {leaderboard.length >= 3 && (
            <div className="grid grid-cols-3 gap-3 mb-4">
              {/* 2nd place */}
              <Card className="bg-white/[0.04] backdrop-blur-xl border-gray-400/20 shadow-xl overflow-hidden order-1">
                <CardContent className="p-3 text-center">
                  <Medal className="w-8 h-8 text-gray-300 mx-auto mb-1" />
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-1 overflow-hidden border-2 border-gray-400/30">
                    {leaderboard[1].avatar ? (
                      <img src={leaderboard[1].avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <UserPlus className="w-5 h-5 text-white/30" />
                    )}
                  </div>
                  <p className="text-white/80 text-xs font-bold truncate">{leaderboard[1].name}</p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-yellow-300 text-xs font-bold">{leaderboard[1].score}</span>
                  </div>
                </CardContent>
              </Card>

              {/* 1st place */}
              <Card className="bg-white/[0.04] backdrop-blur-xl border-yellow-500/30 shadow-2xl overflow-hidden order-0 sm:order-0">
                <div className="h-1 bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500" />
                <CardContent className="p-3 text-center">
                  <Crown className="w-10 h-10 text-yellow-400 mx-auto mb-1" />
                  <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-1 overflow-hidden border-2 border-yellow-400/50">
                    {leaderboard[0].avatar ? (
                      <img src={leaderboard[0].avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <UserPlus className="w-6 h-6 text-white/30" />
                    )}
                  </div>
                  <p className="text-white/90 text-sm font-bold truncate">{leaderboard[0].name}</p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-yellow-300 text-sm font-bold">{leaderboard[0].score}</span>
                  </div>
                </CardContent>
              </Card>

              {/* 3rd place */}
              <Card className="bg-white/[0.04] backdrop-blur-xl border-amber-600/20 shadow-xl overflow-hidden order-2">
                <CardContent className="p-3 text-center">
                  <Medal className="w-8 h-8 text-amber-600 mx-auto mb-1" />
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-1 overflow-hidden border-2 border-amber-600/30">
                    {leaderboard[2].avatar ? (
                      <img src={leaderboard[2].avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <UserPlus className="w-5 h-5 text-white/30" />
                    )}
                  </div>
                  <p className="text-white/80 text-xs font-bold truncate">{leaderboard[2].name}</p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-yellow-300 text-xs font-bold">{leaderboard[2].score}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Rest of leaderboard */}
          <Card className="bg-white/[0.04] backdrop-blur-xl border-white/10 shadow-xl overflow-hidden">
            <CardContent className="p-4">
              <ScrollArea className="max-h-[calc(100vh-380px)]">
                <div className="space-y-1.5">
                  {(showAll ? leaderboard : leaderboard.slice(0, 20)).map((entry, i) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className={`flex items-center gap-3 p-2.5 rounded-lg transition-all ${
                        i === 0 ? 'bg-yellow-500/10 border border-yellow-500/20' :
                        i === 1 ? 'bg-gray-400/10 border border-gray-400/10' :
                        i === 2 ? 'bg-amber-600/10 border border-amber-600/10' :
                        'bg-white/[0.02] border border-white/5'
                      }`}
                      dir="rtl"
                    >
                      <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                        {getRankIcon(i)}
                      </div>
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {entry.avatar ? (
                          <img src={entry.avatar} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-white/10" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                            <UserPlus className="w-4 h-4 text-white/30" />
                          </div>
                        )}
                        <div>
                          <p className="text-white/80 text-sm font-bold">{entry.name}</p>
                          <p className="text-white/30 text-[10px]">{entry.correctCount} {t(lang, 'correctAnswers')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-yellow-300 text-sm font-bold">{entry.score}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>

              {leaderboard.length > 20 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAll(!showAll)}
                  className="w-full text-white/40 hover:text-white/70 text-xs mt-3"
                >
                  {showAll ? <ChevronUp className="w-3 h-3 mr-1" /> : <ChevronDown className="w-3 h-3 mr-1" />}
                  {showAll ? 'کەمتر ببینە' : `${leaderboard.length - 20} زیاتر...`}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </motion.div>
  )
}

// ===================== QUIZ SECTION =====================
function QuizSection() {
  const {
    lang, playerName, playerAvatar, setTab,
    quizQuestions, setQuizQuestions,
    currentQuestionIndex, setCurrentQuestionIndex,
    selectedAnswer, setSelectedAnswer,
    isAnswered, setIsAnswered,
    correctCount, incrementCorrect, incrementWrong,
    score, addScore, timeLeft, setTimeLeft,
    selectedCategory, participantId, setParticipantId,
  } = useAppStore()

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()
  const [autoNextTimer, setAutoNextTimer] = useState<NodeJS.Timeout | null>(null)
  const [quizLoaded, setQuizLoaded] = useState(false)

  // Load quiz questions from DB
  useEffect(() => {
    if (quizQuestions.length === 0) {
      const fetchQuestions = async () => {
        try {
          const url = selectedCategory ? `/api/questions?categoryId=${selectedCategory}` : '/api/questions'
          const res = await fetch(url)
          if (res.ok) {
            const data: DBQuestion[] = await res.json()
            // Shuffle questions
            const shuffled = [...data].sort(() => Math.random() - 0.5)
            setQuizQuestions(shuffled)
          }
        } catch (e) {
          console.error('Failed to load quiz questions', e)
        } finally {
          setQuizLoaded(true)
        }
      }
      fetchQuestions()
    } else {
      setQuizLoaded(true)
    }
  }, [quizQuestions.length, selectedCategory, setQuizQuestions])

  // Create participant on first quiz load
  useEffect(() => {
    if (!participantId && playerName.trim()) {
      const createParticipant = async () => {
        try {
          const res = await fetch('/api/participants', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: playerName, avatar: playerAvatar }),
          })
          if (res.ok) {
            const data = await res.json()
            setParticipantId(data.id)
          }
        } catch (e) {
          console.error('Failed to create participant', e)
        }
      }
      createParticipant()
    }
  }, [participantId, playerName, playerAvatar, setParticipantId])

  // Timer
  useEffect(() => {
    if (isAnswered || !quizQuestions.length) return

    setTimeLeft(120)
    timerRef.current = setInterval(() => {
      const current = useAppStore.getState().timeLeft
      if (current <= 1) {
        clearInterval(timerRef.current!)
        setIsAnswered(true)
        incrementWrong()
        setSelectedAnswer(0)
      } else {
        setTimeLeft(current - 1)
      }
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [currentQuestionIndex, isAnswered, quizQuestions.length])

  // Cleanup
  useEffect(() => {
    return () => {
      if (autoNextTimer) clearTimeout(autoNextTimer)
    }
  }, [autoNextTimer])

  const currentQ = quizQuestions[currentQuestionIndex]

  if (!quizLoaded) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-3 border-blue-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!currentQ) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center">
        <Card className="bg-white/[0.04] backdrop-blur-xl border-white/10">
          <CardContent className="p-8">
            <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <p className="text-white/50 text-sm" dir="rtl">{t(lang, 'noQuestions')}</p>
            <Button onClick={() => setTab('home')} className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl">
              {t(lang, 'backToHome')}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getOptionText = (q: DBQuestion, idx: number) => {
    const key = `option${idx}${lang === 'badini' ? 'Badini' : 'Sorani'}` as keyof DBQuestion
    return q[key] as string
  }

  const handleAnswer = async (optionIndex: number) => {
    if (isAnswered) return

    if (timerRef.current) clearInterval(timerRef.current)

    setSelectedAnswer(optionIndex)
    setIsAnswered(true)

    const isCorrect = optionIndex === currentQ.correctAnswer
    if (isCorrect) {
      incrementCorrect()
      addScore(10)
    } else {
      incrementWrong()
    }

    // Save answer to DB
    if (participantId) {
      try {
        await fetch('/api/answers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            participantId,
            questionId: currentQ.id,
            selectedAnswer: optionIndex,
            correctAnswer: currentQ.correctAnswer,
          }),
        })
      } catch (e) {
        console.error('Failed to save answer', e)
      }
    }

    // Auto next after 2 seconds
    const timer = setTimeout(() => {
      handleNext()
    }, 2000)
    setAutoNextTimer(timer)
  }

  const handleNext = () => {
    if (autoNextTimer) clearTimeout(autoNextTimer)

    if (currentQuestionIndex + 1 >= quizQuestions.length) {
      // Quiz complete - save score and go to results
      const saveScore = async () => {
        const state = useAppStore.getState()
        const pid = state.participantId
        if (pid) {
          try {
            await fetch('/api/scores', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                participantId: pid,
                points: state.score,
                correctCount: state.correctCount,
                totalAnswered: state.correctCount + state.wrongCount,
                categoryId: selectedCategory || null,
              }),
            })
          } catch (e) {
            console.error('Failed to save score', e)
          }
        }
        setTab('results')
      }
      saveScore()
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
      setTimeLeft(120)
    }
  }

  const getOptionStyle = (optIndex: number) => {
    if (!isAnswered) {
      return 'border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/20 cursor-pointer'
    }
    if (optIndex === currentQ.correctAnswer) {
      return 'border-green-500/50 bg-green-500/10 shadow-lg shadow-green-500/10'
    }
    if (optIndex === selectedAnswer && optIndex !== currentQ.correctAnswer) {
      return 'border-red-500/50 bg-red-500/10 shadow-lg shadow-red-500/10'
    }
    return 'border-white/5 bg-white/[0.01] opacity-50'
  }

  const getOptionIcon = (optIndex: number) => {
    if (!isAnswered) return null
    if (optIndex === currentQ.correctAnswer) return <CheckCircle2 className="w-5 h-5 text-green-400" />
    if (optIndex === selectedAnswer && optIndex !== currentQ.correctAnswer) return <XCircle className="w-5 h-5 text-red-400" />
    return null
  }

  const catName = lang === 'badini' ? currentQ.category.nameBadini : currentQ.category.nameSorani

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto px-4 pt-4 pb-8"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setTab('home')}
          className="flex items-center gap-1.5 text-white/50 hover:text-white/80 text-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t(lang, 'backToHome')}
        </button>
        <div className="flex items-center gap-2">
          <Badge className="bg-purple-500/10 text-purple-300/70 border-purple-500/15 text-[10px]">
            {catName}
          </Badge>
          <Badge className="bg-yellow-500/10 text-yellow-300/70 border-yellow-500/15 text-[10px] flex items-center gap-1">
            <Star className="w-2.5 h-2.5 fill-yellow-400" />
            {score}
          </Badge>
        </div>
      </div>

      <Card className="bg-white/[0.04] backdrop-blur-xl border-white/10 shadow-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500" />
        <CardContent className="p-6 space-y-5">
          {/* Timer + Progress */}
          <div className="flex items-center justify-between">
            <CircularTimer timeLeft={timeLeft} maxTime={120} />
            <div className="text-center" dir="rtl">
              <span className="text-white/40 text-xs">{t(lang, 'question')}</span>
              <div className="text-white font-bold text-lg">
                {currentQuestionIndex + 1} {t(lang, 'of')} {quizQuestions.length}
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-white/5 rounded-full h-1.5">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Question */}
          <div className="text-center" dir="rtl">
            <motion.p
              key={currentQuestionIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white text-lg font-bold leading-relaxed"
            >
              {lang === 'badini' ? currentQ.textBadini : currentQ.textSorani}
            </motion.p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((optIdx) => (
              <motion.button
                key={optIdx}
                whileHover={!isAnswered ? { scale: 1.02 } : {}}
                whileTap={!isAnswered ? { scale: 0.98 } : {}}
                onClick={() => handleAnswer(optIdx)}
                disabled={isAnswered}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 ${getOptionStyle(optIdx)}`}
                dir="rtl"
              >
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                  isAnswered && optIdx === currentQ.correctAnswer ? 'bg-green-500/20 text-green-300' :
                  isAnswered && optIdx === selectedAnswer && optIdx !== currentQ.correctAnswer ? 'bg-red-500/20 text-red-300' :
                  'bg-white/5 text-white/50'
                }`}>
                  {optIdx}
                </span>
                <span className="text-white/90 text-sm flex-1 text-right">{getOptionText(currentQ, optIdx)}</span>
                {getOptionIcon(optIdx)}
              </motion.button>
            ))}
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`text-center p-3 rounded-xl ${
                  selectedAnswer === currentQ.correctAnswer
                    ? 'bg-green-500/10 border border-green-500/20'
                    : 'bg-red-500/10 border border-red-500/20'
                }`}
                dir="rtl"
              >
                {selectedAnswer === currentQ.correctAnswer ? (
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span className="text-green-300 font-bold text-sm">{t(lang, 'correct')}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <XCircle className="w-5 h-5 text-red-400" />
                    <span className="text-red-300 font-bold text-sm">{t(lang, 'wrong')}</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next button (manual) */}
          {isAnswered && (
            <Button
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl py-4"
            >
              {currentQuestionIndex + 1 >= quizQuestions.length ? t(lang, 'viewResults') : t(lang, 'nextQuestion')}
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ===================== RESULTS SECTION =====================
function ResultsSection() {
  const { lang, setTab, playerName, playerAvatar, score, correctCount, wrongCount, resetQuiz } = useAppStore()
  const total = correctCount + wrongCount
  const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0

  const getMessage = () => {
    if (percentage >= 80) return t(lang, 'excellent')
    if (percentage >= 50) return t(lang, 'good')
    return t(lang, 'tryAgain')
  }

  const getMessageColor = () => {
    if (percentage >= 80) return 'text-green-400'
    if (percentage >= 50) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-lg mx-auto px-4 py-8"
    >
      <Card className="bg-white/[0.04] backdrop-blur-xl border-white/10 shadow-2xl overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500" />
        <CardContent className="p-8 space-y-6 text-center">
          {/* Trophy */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center shadow-2xl shadow-yellow-500/30">
              <Trophy className="w-12 h-12 text-white" />
            </div>
          </motion.div>

          <h2 className="text-2xl font-black text-white" dir="rtl">{t(lang, 'quizComplete')}</h2>

          {/* Score Circle */}
          <div className="relative w-32 h-32 mx-auto">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.08)" strokeWidth="8" fill="none" />
              <motion.circle
                cx="50" cy="50" r="40"
                stroke={percentage >= 80 ? '#22c55e' : percentage >= 50 ? '#eab308' : '#ef4444'}
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 40}
                initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - percentage / 100) }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-white">{score}</span>
              <span className="text-white/40 text-xs">{t(lang, 'points')}</span>
            </div>
          </div>

          {/* Message */}
          <p className={`text-lg font-bold ${getMessageColor()}`} dir="rtl">{getMessage()}</p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3" dir="rtl">
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3">
              <CheckCircle2 className="w-5 h-5 text-green-400 mx-auto mb-1" />
              <p className="text-green-300 text-lg font-bold">{correctCount}</p>
              <p className="text-green-300/50 text-[10px]">{t(lang, 'correctAnswers')}</p>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
              <XCircle className="w-5 h-5 text-red-400 mx-auto mb-1" />
              <p className="text-red-300 text-lg font-bold">{wrongCount}</p>
              <p className="text-red-300/50 text-[10px]">{t(lang, 'wrongAnswers')}</p>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3">
              <Star className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
              <p className="text-yellow-300 text-lg font-bold">{percentage}%</p>
              <p className="text-yellow-300/50 text-[10px]">{t(lang, 'score')}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={() => { resetQuiz(); setTab('home') }}
              variant="outline"
              className="flex-1 bg-white/5 border-white/10 text-white/70 hover:bg-white/10 rounded-xl py-3"
            >
              <Gamepad2 className="w-4 h-4 mr-2" />
              {t(lang, 'backToHome')}
            </Button>
            <Button
              onClick={() => { resetQuiz(); setTab('quiz') }}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl py-3"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {t(lang, 'playAgain')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ===================== ADMIN SECTION =====================
function AdminSection() {
  const { lang, setIsAdminAuth, isAdminAuth, setTab } = useAppStore()
  const { categories, refetch: refetchCats } = useCategories()
  const [activeAdminTab, setActiveAdminTab] = useState<'categories' | 'questions'>('categories')
  const [selectedCatForQuestions, setSelectedCatForQuestions] = useState<string>('')
  const { questions, refetch: refetchQuestions } = useQuestions(selectedCatForQuestions || undefined)
  const { toast } = useToast()

  // New category form
  const [newCatBadini, setNewCatBadini] = useState('')
  const [newCatSorani, setNewCatSorani] = useState('')

  // New question form
  const [newQCatId, setNewQCatId] = useState('')
  const [newQTextBadini, setNewQTextBadini] = useState('')
  const [newQTextSorani, setNewQTextSorani] = useState('')
  const [newQOpt1Badini, setNewQOpt1Badini] = useState('')
  const [newQOpt1Sorani, setNewQOpt1Sorani] = useState('')
  const [newQOpt2Badini, setNewQOpt2Badini] = useState('')
  const [newQOpt2Sorani, setNewQOpt2Sorani] = useState('')
  const [newQOpt3Badini, setNewQOpt3Badini] = useState('')
  const [newQOpt3Sorani, setNewQOpt3Sorani] = useState('')
  const [newQOpt4Badini, setNewQOpt4Badini] = useState('')
  const [newQOpt4Sorani, setNewQOpt4Sorani] = useState('')
  const [newQCorrect, setNewQCorrect] = useState(1)

  if (!isAdminAuth) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center">
        <Card className="bg-white/[0.04] backdrop-blur-xl border-white/10">
          <CardContent className="p-8">
            <Shield className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <p className="text-white/50 text-sm" dir="rtl">{t(lang, 'adminPanel')}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleAddCategory = async () => {
    if (!newCatBadini.trim() || !newCatSorani.trim()) return
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nameBadini: newCatBadini, nameSorani: newCatSorani }),
      })
      if (res.ok) {
        toast({ title: t(lang, 'successAdded') })
        setNewCatBadini('')
        setNewCatSorani('')
        refetchCats()
      } else {
        toast({ title: t(lang, 'errorAdded'), variant: 'destructive' })
      }
    } catch {
      toast({ title: t(lang, 'errorAdded'), variant: 'destructive' })
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm(t(lang, 'confirmDelete'))) return
    try {
      const res = await fetch(`/api/categories?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        refetchCats()
        refetchQuestions()
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleAddQuestion = async () => {
    if (!newQTextBadini.trim() || !newQTextSorani.trim() || !newQCatId) return
    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          textBadini: newQTextBadini,
          textSorani: newQTextSorani,
          option1Badini: newQOpt1Badini, option1Sorani: newQOpt1Sorani,
          option2Badini: newQOpt2Badini, option2Sorani: newQOpt2Sorani,
          option3Badini: newQOpt3Badini, option3Sorani: newQOpt3Sorani,
          option4Badini: newQOpt4Badini, option4Sorani: newQOpt4Sorani,
          correctAnswer: newQCorrect,
          categoryId: newQCatId,
        }),
      })
      if (res.ok) {
        toast({ title: t(lang, 'successAdded') })
        setNewQTextBadini('')
        setNewQTextSorani('')
        setNewQOpt1Badini('')
        setNewQOpt1Sorani('')
        setNewQOpt2Badini('')
        setNewQOpt2Sorani('')
        setNewQOpt3Badini('')
        setNewQOpt3Sorani('')
        setNewQOpt4Badini('')
        setNewQOpt4Sorani('')
        setNewQCorrect(1)
        refetchQuestions()
        refetchCats()
      } else {
        toast({ title: t(lang, 'errorAdded'), variant: 'destructive' })
      }
    } catch {
      toast({ title: t(lang, 'errorAdded'), variant: 'destructive' })
    }
  }

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm(t(lang, 'confirmDelete'))) return
    try {
      const res = await fetch(`/api/questions?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        refetchQuestions()
        refetchCats()
      }
    } catch (e) {
      console.error(e)
    }
  }

  const inputClass = "w-full bg-white/5 border border-white/10 text-white placeholder:text-white/20 rounded-xl h-10 text-xs px-3 focus:border-purple-400/50 focus:outline-none"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto px-4 pt-4 pb-8 space-y-4"
    >
      {/* Admin Header */}
      <div className="flex items-center justify-between" dir="rtl">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-orange-400" />
          <h2 className="text-white font-bold text-lg">{t(lang, 'adminPanel')}</h2>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => { setIsAdminAuth(false); setTab('home') }}
            variant="outline"
            size="sm"
            className="bg-red-500/10 border-red-500/20 text-red-300 hover:bg-red-500/20 rounded-xl text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            {t(lang, 'logout')}
          </Button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex gap-2" dir="rtl">
        <button
          onClick={() => setActiveAdminTab('categories')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeAdminTab === 'categories'
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
              : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
          }`}
        >
          {t(lang, 'manageCategories')}
        </button>
        <button
          onClick={() => setActiveAdminTab('questions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeAdminTab === 'questions'
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
              : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
          }`}
        >
          {t(lang, 'manageQuestions')}
        </button>
      </div>

      {/* Categories Tab */}
      {activeAdminTab === 'categories' && (
        <div className="space-y-4">
          {/* Add Category Form */}
          <Card className="bg-white/[0.04] backdrop-blur-xl border-white/10 shadow-xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-500" />
            <CardContent className="p-4 space-y-3" dir="rtl">
              <h3 className="text-white/70 text-sm font-bold flex items-center gap-2">
                <Plus className="w-4 h-4" />
                {t(lang, 'addNewCategory')}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-white/40 text-[10px] mb-1 block">{t(lang, 'categoryNameBadini')}</Label>
                  <Input value={newCatBadini} onChange={(e) => setNewCatBadini(e.target.value)} className={inputClass} placeholder="ئایینی" dir="rtl" />
                </div>
                <div>
                  <Label className="text-white/40 text-[10px] mb-1 block">{t(lang, 'categoryNameSorani')}</Label>
                  <Input value={newCatSorani} onChange={(e) => setNewCatSorani(e.target.value)} className={inputClass} placeholder="ئایینی" dir="rtl" />
                </div>
              </div>
              <Button onClick={handleAddCategory} disabled={!newCatBadini.trim() || !newCatSorani.trim()} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl text-sm">
                <Plus className="w-4 h-4 mr-1.5" />
                {t(lang, 'addCategory')}
              </Button>
            </CardContent>
          </Card>

          {/* Category List */}
          <Card className="bg-white/[0.04] backdrop-blur-xl border-white/10 shadow-xl overflow-hidden">
            <CardContent className="p-4">
              <div className="space-y-2">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between p-3 bg-white/[0.03] border border-white/5 rounded-xl" dir="rtl">
                    <div>
                      <p className="text-white/80 text-sm font-bold">{cat.nameBadini}</p>
                      <p className="text-white/30 text-[10px]">{cat.nameSorani} - {cat._count?.questions || 0} {t(lang, 'questions')}</p>
                    </div>
                    <Button
                      onClick={() => handleDeleteCategory(cat.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-400/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg h-8 w-8 p-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Questions Tab */}
      {activeAdminTab === 'questions' && (
        <div className="space-y-4">
          {/* Add Question Form */}
          <Card className="bg-white/[0.04] backdrop-blur-xl border-white/10 shadow-xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
            <CardContent className="p-4 space-y-3" dir="rtl">
              <h3 className="text-white/70 text-sm font-bold flex items-center gap-2">
                <Plus className="w-4 h-4" />
                {t(lang, 'addNewQuestion')}
              </h3>

              {/* Category Select */}
              <div>
                <Label className="text-white/40 text-[10px] mb-1 block">{t(lang, 'selectCategoryForQuestion')}</Label>
                <select value={newQCatId} onChange={(e) => setNewQCatId(e.target.value)} className={inputClass + " appearance-none cursor-pointer"} dir="rtl">
                  <option value="" className="bg-[#0d1442]">-- {t(lang, 'selectCategoryForQuestion')} --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id} className="bg-[#0d1442]">{cat.nameBadini} / {cat.nameSorani}</option>
                  ))}
                </select>
              </div>

              {/* Question Text */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-white/40 text-[10px] mb-1 block">{t(lang, 'questionTextBadini')}</Label>
                  <Input value={newQTextBadini} onChange={(e) => setNewQTextBadini(e.target.value)} className={inputClass} placeholder="پرسیار..." dir="rtl" />
                </div>
                <div>
                  <Label className="text-white/40 text-[10px] mb-1 block">{t(lang, 'questionTextSorani')}</Label>
                  <Input value={newQTextSorani} onChange={(e) => setNewQTextSorani(e.target.value)} className={inputClass} placeholder="پرسیار..." dir="rtl" />
                </div>
              </div>

              {/* Options */}
              {[1, 2, 3, 4].map((idx) => (
                <div key={idx} className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-white/40 text-[10px] mb-1 block">{t(lang, 'optionBadini')} {idx}</Label>
                    <Input
                      value={idx === 1 ? newQOpt1Badini : idx === 2 ? newQOpt2Badini : idx === 3 ? newQOpt3Badini : newQOpt4Badini}
                      onChange={(e) => {
                        if (idx === 1) setNewQOpt1Badini(e.target.value)
                        else if (idx === 2) setNewQOpt2Badini(e.target.value)
                        else if (idx === 3) setNewQOpt3Badini(e.target.value)
                        else setNewQOpt4Badini(e.target.value)
                      }}
                      className={inputClass}
                      placeholder={`هەڵبژارتن ${idx}`}
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <Label className="text-white/40 text-[10px] mb-1 block">{t(lang, 'optionSorani')} {idx}</Label>
                    <Input
                      value={idx === 1 ? newQOpt1Sorani : idx === 2 ? newQOpt2Sorani : idx === 3 ? newQOpt3Sorani : newQOpt4Sorani}
                      onChange={(e) => {
                        if (idx === 1) setNewQOpt1Sorani(e.target.value)
                        else if (idx === 2) setNewQOpt2Sorani(e.target.value)
                        else if (idx === 3) setNewQOpt3Sorani(e.target.value)
                        else setNewQOpt4Sorani(e.target.value)
                      }}
                      className={inputClass}
                      placeholder={`هەڵبژاردن ${idx}`}
                      dir="rtl"
                    />
                  </div>
                </div>
              ))}

              {/* Correct Answer */}
              <div>
                <Label className="text-white/40 text-[10px] mb-1 block">{t(lang, 'correctOption')}</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((idx) => (
                    <button
                      key={idx}
                      onClick={() => setNewQCorrect(idx)}
                      className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                        newQCorrect === idx
                          ? 'bg-green-500/20 border-2 border-green-500/50 text-green-300'
                          : 'bg-white/5 border border-white/10 text-white/40 hover:bg-white/10'
                      }`}
                    >
                      {idx}
                    </button>
                  ))}
                </div>
              </div>

              <Button onClick={handleAddQuestion} disabled={!newQTextBadini.trim() || !newQCatId} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl text-sm">
                <Plus className="w-4 h-4 mr-1.5" />
                {t(lang, 'addQuestion')}
              </Button>
            </CardContent>
          </Card>

          {/* Questions List */}
          <Card className="bg-white/[0.04] backdrop-blur-xl border-white/10 shadow-xl overflow-hidden">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between" dir="rtl">
                <h3 className="text-white/70 text-sm font-bold">{t(lang, 'manageQuestions')}</h3>
                <select
                  value={selectedCatForQuestions}
                  onChange={(e) => { setSelectedCatForQuestions(e.target.value); refetchQuestions() }}
                  className="bg-white/5 border border-white/10 text-white/60 rounded-lg text-[10px] px-2 py-1 appearance-none cursor-pointer"
                >
                  <option value="" className="bg-[#0d1442]">{t(lang, 'allCategories')}</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id} className="bg-[#0d1442]">{cat.nameBadini}</option>
                  ))}
                </select>
              </div>

              <ScrollArea className="max-h-[400px]">
                <div className="space-y-2">
                  {questions.map((q, idx) => {
                    const catName = lang === 'badini' ? q.category.nameBadini : q.category.nameSorani
                    return (
                      <div key={q.id} className="flex items-start justify-between gap-2 p-3 bg-white/[0.03] border border-white/5 rounded-xl" dir="rtl">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1">
                            <Badge className="bg-purple-500/10 text-purple-300/60 border-purple-500/15 text-[8px] px-1 py-0">{catName}</Badge>
                            <span className="text-[8px] text-green-400/50">{t(lang, 'correctOption')}: {q.correctAnswer}</span>
                          </div>
                          <p className="text-white/70 text-xs line-clamp-2">{lang === 'badini' ? q.textBadini : q.textSorani}</p>
                        </div>
                        <Button
                          onClick={() => handleDeleteQuestion(q.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-400/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg h-7 w-7 p-0 flex-shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    )
                  })}
                  {questions.length === 0 && (
                    <div className="text-center py-6">
                      <BookOpen className="w-8 h-8 text-white/15 mx-auto mb-1" />
                      <p className="text-white/25 text-xs" dir="rtl">{t(lang, 'noQuestions')}</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}
    </motion.div>
  )
}
