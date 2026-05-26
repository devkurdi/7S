'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useAppStore, Lang, QuizQuestion, QuizCategory, LeaderboardEntry } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  UserPlus, Shield, Plus, Trash2, LogOut, Trophy, CheckCircle2,
  XCircle, RotateCcw, BookOpen, Languages, Home as HomeIcon,
  Star, Zap, Timer, PartyPopper, ThumbsUp, Sparkles, Eye, EyeOff,
  ListChecks, Gamepad2, Crown, Target, CircleDot, Medal,
  Users, Search,
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
    timeRemaining: 'چرکە',
    question: 'پرسیار',
    of: 'ژ',
    score: 'خاڵ',
    correctAnswers: 'بەرسڤێن دروست',
    wrongAnswers: 'بەرسڤێن خەلەت',
    unanswered: 'بەرسڤ نەدان',
    adminPanel: 'ADMIN PANEL',
    adminPassword: 'پەیڤا نهێنی ئەدمین',
    login: 'چوونەژوورێ',
    addCategory: 'جۆرێ نوو زێدەبکە',
    categoryNameBadini: 'ناڤێ جۆرێ ب بادینی',
    categoryNameSorani: 'ناڤێ جۆرێ ب سورانی',
    addQuestion: 'پرسیارێ نوو زێدەبکە',
    questionTextBadini: 'دەقێ پرسیارێ ب بادینی',
    questionTextSorani: 'دەقێ پرسیارێ ب سورانی',
    option: 'هەڵبژارتن',
    correctOption: 'هەڵبژارتنا دروست',
    category: 'جۆر',
    delete: 'ژێببە',
    save: 'پاشەکەوتبکە',
    noQuestions: 'پرسیارێ نین',
    backToHome: 'گەڕانەوە دەستپێک',
    quizComplete: 'کویز تەواو بوو!',
    yourScore: 'خاڵێ تە',
    questions: 'پرسیار',
    manageCategories: 'بەڕێوەبردنا جۆران',
    manageQuestions: 'بەڕێوەبردنا پرسیاران',
    invalidPassword: 'پەیڤا نهێنی خەلەتە!',
    selectLanguage: 'زاراوێک هەڵبژێرە',
    badini: 'بادینی',
    sorani: 'سورانی',
    logout: 'دەرچوو',
    retryQuiz: 'دووبارە کویز',
    answered: 'بەرسڤ دراوە',
    notAnswered: 'بەرسڤ نەدراوە',
    excellent: 'ئەلەم! سەرکەوتن!',
    good: 'باشە! بەردەوامبە!',
    tryAgain: 'هەوڵبدەرەوە!',
    ready: 'ئامادەیت؟',
    availableQuestions: 'پرسیارێن بەردەست',
    chooseAndStart: 'جۆرێ هەڵبژێرە و دەستپێبکە',
    seconds: 'چرکە',
    pointsPerQuestion: '١٠ خاڵ',
    topList: 'TOP',
    playerName: 'ناوی یاریزان',
    points: 'خاڵ',
    enterAdminPass: 'پەیڤا نهێنی بنڤیسە...',
    adminLogin: 'چوونەژوورێ ئەدمین',
    questionNumber: 'پرسیاری ژمارە',
    homeTab: 'HOME',
    quizTab: 'کویز',
    topTab: 'TOP',
    rank: 'پلە',
    searchPlayer: 'ناوی یاریزان بگەڕێ...',
    noPlayersYet: 'هێشتا یاریزانێک نییە',
    totalPoints: 'کۆی خاڵ',
    welcomeBack: 'بەخێربێیتەوە',
    profileSection: 'پرۆفایل',
    enterNameToStart: 'ناڤێ خۆ بنڤیسە تا دەستپێبکەی',
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
    timeRemaining: 'چرکە',
    question: 'پرسیار',
    of: 'لە',
    score: 'خاڵ',
    correctAnswers: 'وەڵامى ڕاست',
    wrongAnswers: 'وەڵامى هەڵە',
    unanswered: 'وەڵام نەدراوە',
    adminPanel: 'ADMIN PANEL',
    adminPassword: 'وشەى نهێنى ئەدمین',
    login: 'چوونەژوورەوە',
    addCategory: 'جۆرى نوێ زیادبکە',
    categoryNameBadini: 'ناوێ جۆر ب بادینی',
    categoryNameSorani: 'ناوێ جۆر ب سورانی',
    addQuestion: 'پرسیارى نوێ زیادبکە',
    questionTextBadini: 'دەقى پرسیار ب بادینی',
    questionTextSorani: 'دەقى پرسیار ب سورانی',
    option: 'هەڵبژاردن',
    correctOption: 'هەڵبژاردنى ڕاست',
    category: 'جۆر',
    delete: 'سڕینەوە',
    save: 'پاشەکەوتکردن',
    noQuestions: 'پرسیارێک نییە',
    backToHome: 'گەڕانەوە سەرەتا',
    quizComplete: 'کویز تەواو بوو!',
    yourScore: 'خاڵى تۆ',
    questions: 'پرسیار',
    manageCategories: 'بەڕێوەبردنى جۆرەکان',
    manageQuestions: 'بەڕێوەبردنى پرسیارەکان',
    invalidPassword: 'وشەى نهێنى هەڵەیە!',
    selectLanguage: 'زارییەک هەڵبژێرە',
    badini: 'بادینی',
    sorani: 'سورانی',
    logout: 'دەرچوون',
    retryQuiz: 'دووبارە کویز',
    answered: 'وەڵام دراوە',
    notAnswered: 'وەڵام نەدراوە',
    excellent: 'ئەلەم! سەرکەوتن!',
    good: 'باشە! بەردەوامبە!',
    tryAgain: 'هەوڵبدەرەوە!',
    ready: 'ئامادەیت؟',
    availableQuestions: 'پرسیارە بەردەستەکان',
    chooseAndStart: 'جۆرێک هەڵبژێرە و دەستپێبکە',
    seconds: 'چرکە',
    pointsPerQuestion: '١٠ خاڵ',
    topList: 'TOP',
    playerName: 'ناوى یاریزان',
    points: 'خاڵ',
    enterAdminPass: 'وشەى نهێنى بنووسە...',
    adminLogin: 'چوونەژوورەوە ئەدمین',
    questionNumber: 'پرسیارى ژمارە',
    homeTab: 'HOME',
    quizTab: 'کویز',
    topTab: 'TOP',
    rank: 'پلە',
    searchPlayer: 'ناوى یاریزان بگەڕێ...',
    noPlayersYet: 'هێشتا یاریزانێک نییە',
    totalPoints: 'کۆى خاڵ',
    welcomeBack: 'بەخێربێیتەوە',
    profileSection: 'پرۆفایل',
    enterNameToStart: 'ناوت بنووسە تا دەستپێبکەیت',
  },
}

function t(lang: Lang, key: keyof typeof translations.badini) {
  return translations[lang][key]
}

// ===================== ANIMATED BACKGROUND =====================
function AnimatedBackground() {
  return (
    <>
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-red-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 4 + 1,
              height: Math.random() * 4 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 3 === 0 ? 'rgba(59,130,246,0.3)' : i % 3 === 1 ? 'rgba(239,68,68,0.3)' : 'rgba(168,85,247,0.3)',
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.1, 0.5, 0.1],
            }}
            transition={{
              duration: Math.random() * 5 + 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>
    </>
  )
}

// ===================== CIRCULAR TIMER =====================
function CircularTimer({ timeLeft, maxTime }: { timeLeft: number; maxTime: number }) {
  const percentage = (timeLeft / maxTime) * 100
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference
  const isLow = timeLeft <= 30
  const isCritical = timeLeft <= 10

  return (
    <div className="relative w-24 h-24 mx-auto">
      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth="5" fill="none" />
        <motion.circle
          cx="50" cy="50" r={radius}
          stroke={isCritical ? '#ef4444' : isLow ? '#f59e0b' : '#3b82f6'}
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: 'linear' }}
          style={{ filter: isLow ? `drop-shadow(0 0 8px ${isCritical ? '#ef4444' : '#f59e0b'})` : 'none' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          key={timeLeft}
          initial={{ scale: 1.1, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.15 }}
          className={`text-2xl font-black font-mono tracking-tight ${isCritical ? 'text-red-400 animate-pulse' : isLow ? 'text-amber-400' : 'text-white'}`}
        >
          {timeLeft}
        </motion.span>
        <span className="text-white/30 text-[8px] font-medium mt-0.5">
          {t(useAppStore.getState().lang, 'seconds')}
        </span>
      </div>
    </div>
  )
}

// ===================== NAVBAR =====================
function NavBar() {
  const { view, setView, lang, setLang } = useAppStore()
  const [adminPass, setAdminPass] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showAdminModal, setShowAdminModal] = useState(false)
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
        useAppStore.getState().setIsAdminAuth(true)
        setShowAdminModal(false)
        setAdminPass('')
        setView('admin')
      } else {
        toast({ title: t(lang, 'invalidPassword'), variant: 'destructive' })
      }
    } catch {
      toast({ title: t(lang, 'invalidPassword'), variant: 'destructive' })
    }
  }

  return (
    <>
      <div className="relative z-50 flex items-center justify-between px-4 py-3 bg-black/30 backdrop-blur-xl border-b border-white/10">
        {/* Left - Language Toggle */}
        <Button
          variant="outline"
          size="sm"
          className="bg-white/5 border-white/10 text-white hover:bg-white/10 backdrop-blur-sm rounded-full px-4 h-9 text-sm font-medium"
          onClick={() => setLang(lang === 'badini' ? 'sorani' : 'badini')}
        >
          <Languages className="w-4 h-4 mr-2" />
          {lang === 'badini' ? 'سورانی' : 'بادینی'}
        </Button>

        {/* Center - Navigation Tabs */}
        <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1">
          {(['home', 'quiz', 'top'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setView(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${
                view === tab
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/25'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              }`}
            >
              {t(lang, `${tab}Tab` as keyof typeof translations.badini)}
            </button>
          ))}
        </div>

        {/* Right - Admin Panel Button */}
        <Button
          variant="outline"
          size="sm"
          className="bg-gradient-to-r from-orange-600/20 to-red-600/20 border-orange-500/30 text-orange-300 hover:bg-orange-600/30 backdrop-blur-sm rounded-full px-4 h-9 text-sm font-bold"
          onClick={() => setShowAdminModal(true)}
        >
          <Shield className="w-4 h-4 mr-2" />
          {t(lang, 'adminPanel')}
        </Button>
      </div>

      {/* Admin Login Modal */}
      <AnimatePresence>
        {showAdminModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowAdminModal(false)}
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
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-orange-400/50 focus:ring-orange-400/10 rounded-xl h-12 text-sm pr-3 pl-10"
                      placeholder={t(lang, 'enterAdminPass')}
                      dir="ltr"
                      onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                      autoFocus
                    />
                    <button
                      onClick={() => setShowPass(!showPass)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                      type="button"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => setShowAdminModal(false)}
                      variant="outline"
                      className="flex-1 bg-white/5 border-white/10 text-white/70 hover:bg-white/10 rounded-xl"
                    >
                      {t(lang, 'backToHome')}
                    </Button>
                    <Button
                      onClick={handleAdminLogin}
                      disabled={!adminPass.trim()}
                      className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold rounded-xl transition-all duration-300 disabled:opacity-40"
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
    </>
  )
}

// ===================== HOME PAGE =====================
function HomePage() {
  const { setView, setParticipant, lang, setSelectedCategoryId, resetQuiz, setLeaderboard } = useAppStore()
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState<string | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [categories, setCategories] = useState<QuizCategory[]>([])
  const [selectedCat, setSelectedCat] = useState<string>('all')
  const [questionsList, setQuestionsList] = useState<QuizQuestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [leaderboard, setLocalLeaderboard] = useState<LeaderboardEntry[]>([])
  const { toast } = useToast()

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      setCategories(data)
    } catch { /* ignore */ }
  }, [])

  const fetchQuestions = useCallback(async () => {
    try {
      const url = selectedCat && selectedCat !== 'all' ? `/api/questions?categoryId=${selectedCat}` : '/api/questions'
      const res = await fetch(url)
      const data = await res.json()
      setQuestionsList(data)
    } catch { /* ignore */ }
  }, [selectedCat])

  const fetchLeaderboard = useCallback(async () => {
    try {
      const res = await fetch('/api/leaderboard')
      const data = await res.json()
      setLocalLeaderboard(data)
      setLeaderboard(data)
    } catch { /* ignore */ }
  }, [setLeaderboard])

  useEffect(() => {
    fetchCategories()
    fetchQuestions()
    fetchLeaderboard()
    fetch('/api/seed', { method: 'POST' }).catch(() => {})
  }, [fetchCategories, fetchQuestions, fetchLeaderboard])

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      setAvatar(result)
      setAvatarPreview(result)
    }
    reader.readAsDataURL(file)
  }

  const handleStart = async () => {
    if (!name.trim()) {
      toast({ title: t(lang, 'enterNameToStart'), variant: 'destructive' })
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch('/api/participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), avatar }),
      })
      const participant = await res.json()
      setParticipant(participant)
      setSelectedCategoryId(selectedCat === 'all' ? null : selectedCat)
      resetQuiz()
      setView('quiz')
    } catch {
      toast({ title: 'Error', variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  const getCategoryColor = (index: number) => {
    const colors = [
      'from-blue-500 to-cyan-500',
      'from-purple-500 to-pink-500',
      'from-red-500 to-orange-500',
      'from-green-500 to-emerald-500',
      'from-amber-500 to-yellow-500',
    ]
    return colors[index % colors.length]
  }

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="w-5 h-5 text-yellow-400" />
    if (index === 1) return <Medal className="w-5 h-5 text-gray-300" />
    if (index === 2) return <Medal className="w-5 h-5 text-amber-600" />
    return <span className="text-white/40 text-sm font-bold">{index + 1}</span>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#0d1442] to-[#1a0a2e] relative overflow-hidden">
      <AnimatedBackground />
      <NavBar />

      {/* Hero Section */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-8 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="mx-auto mb-5 w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-red-500 flex items-center justify-center shadow-2xl shadow-purple-500/30"
          >
            <Gamepad2 className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-wider">
            7S SQUAD <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-red-400 bg-clip-text text-transparent">PSYAR</span>
          </h1>
          <p className="text-blue-200/50 mt-2 text-sm" dir="rtl">{t(lang, 'chooseAndStart')}</p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* Left - Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-4 space-y-4"
          >
            {/* Profile Card */}
            <Card className="bg-white/[0.04] backdrop-blur-xl border-white/10 shadow-2xl overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500" />
              <CardHeader className="text-center pb-1 pt-5">
                <CardTitle className="text-lg font-bold text-white/90 flex items-center justify-center gap-2" dir="rtl">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  {t(lang, 'profileSection')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pb-6">
                {/* Avatar */}
                <div className="flex flex-col items-center gap-2">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-white/10 to-white/5 border-3 border-dashed border-white/20 flex items-center justify-center overflow-hidden group-hover:border-purple-400/50 transition-all duration-300">
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <UserPlus className="w-8 h-8 text-white/30 group-hover:text-white/50 transition-colors" />
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-red-500 flex items-center justify-center shadow-md">
                      <Plus className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <Label className="text-white/40 text-xs">{t(lang, 'uploadAvatar')}</Label>
                </div>

                {/* Name Input with visual feedback */}
                <div className="space-y-1.5">
                  <Label className="text-white/60 text-xs font-medium" dir="rtl">{t(lang, 'enterName')}</Label>
                  <div className="relative">
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`bg-white/5 border-2 text-white placeholder:text-white/20 rounded-xl h-12 text-sm pr-4 pl-10 transition-all duration-300 ${
                        name.trim()
                          ? 'border-green-500/40 focus:border-green-400/60 shadow-lg shadow-green-500/10'
                          : 'border-white/10 focus:border-purple-400/50'
                      }`}
                      placeholder={t(lang, 'enterName')}
                      dir="rtl"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      {name.trim() ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      ) : (
                        <UserPlus className="w-5 h-5 text-white/20" />
                      )}
                    </div>
                  </div>
                  {name.trim() && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-green-400/70 text-[10px] font-medium" dir="rtl"
                    >
                      {t(lang, 'welcomeBack')} {name.trim()}!
                    </motion.p>
                  )}
                </div>

                {/* Category Select */}
                <div className="space-y-1.5">
                  <Label className="text-white/60 text-xs font-medium" dir="rtl">{t(lang, 'selectCategory')}</Label>
                  <Select value={selectedCat} onValueChange={setSelectedCat}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl h-12 text-sm" dir="rtl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t(lang, 'allCategories')}</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {lang === 'badini' ? cat.nameBadini : cat.nameSorani}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Points Badge */}
                <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-xl py-2.5 px-4" dir="rtl">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-yellow-300/80 text-sm font-bold">{t(lang, 'pointsPerQuestion')}</span>
                </div>

                {/* Start Button */}
                <Button
                  onClick={handleStart}
                  disabled={isLoading || !name.trim()}
                  className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 hover:from-blue-700 hover:via-purple-700 hover:to-red-700 text-white font-bold text-sm py-5 rounded-xl shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/35 hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      {t(lang, 'startQuiz')}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Top 5 Mini Leaderboard */}
            <Card className="bg-white/[0.04] backdrop-blur-xl border-white/10 shadow-xl overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500" />
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2" dir="rtl">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    <span className="text-white/70 text-xs font-bold">{t(lang, 'topList')}</span>
                  </div>
                  <button
                    onClick={() => setView('top')}
                    className="text-blue-400/60 text-[10px] hover:text-blue-400 transition-colors"
                  >
                    {t(lang, 'viewResults')} →
                  </button>
                </div>
                {leaderboard.length === 0 ? (
                  <div className="text-center py-4">
                    <Users className="w-6 h-6 text-white/15 mx-auto mb-1" />
                    <p className="text-white/20 text-[10px]" dir="rtl">{t(lang, 'noPlayersYet')}</p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {leaderboard.slice(0, 5).map((entry, i) => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
                          i === 0 ? 'bg-yellow-500/10 border border-yellow-500/20' :
                          i === 1 ? 'bg-gray-400/10 border border-gray-400/10' :
                          i === 2 ? 'bg-amber-600/10 border border-amber-600/10' :
                          'bg-white/[0.02] border border-white/5'
                        }`}
                        dir="rtl"
                      >
                        <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                          {getRankIcon(i)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            {entry.avatar && (
                              <img src={entry.avatar} alt="" className="w-4 h-4 rounded-full object-cover" />
                            )}
                            <p className="text-white/80 text-xs font-bold truncate">{entry.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-yellow-300 text-xs font-bold">{entry.score}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Right - Categories & Questions */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="md:col-span-8 space-y-4"
          >
            {/* Categories Grid */}
            <div>
              <h3 className="text-white/40 text-[11px] font-semibold uppercase tracking-widest mb-3 flex items-center gap-2" dir="rtl">
                <Target className="w-3.5 h-3.5" />
                {t(lang, 'selectCategory')}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedCat('all')}
                  className={`relative overflow-hidden rounded-xl p-4 border-2 transition-all duration-300 text-center ${
                    selectedCat === 'all'
                      ? 'border-purple-400/60 bg-purple-500/10 shadow-lg shadow-purple-500/10'
                      : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="mx-auto mb-2 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-red-500 flex items-center justify-center">
                    <ListChecks className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-white text-xs font-bold" dir="rtl">{t(lang, 'allCategories')}</p>
                  <p className="text-white/25 text-[10px] mt-0.5">{questionsList.length} {t(lang, 'questions')}</p>
                </motion.button>
                {categories.map((cat, i) => {
                  const catQCount = questionsList.filter(q => q.categoryId === cat.id).length
                  return (
                    <motion.button
                      key={cat.id}
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedCat(cat.id)}
                      className={`relative overflow-hidden rounded-xl p-4 border-2 transition-all duration-300 text-center ${
                        selectedCat === cat.id
                          ? 'border-purple-400/60 bg-purple-500/10 shadow-lg shadow-purple-500/10'
                          : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'
                      }`}
                    >
                      <div className={`mx-auto mb-2 w-10 h-10 rounded-lg bg-gradient-to-br ${getCategoryColor(i)} flex items-center justify-center`}>
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-white text-xs font-bold" dir="rtl">{lang === 'badini' ? cat.nameBadini : cat.nameSorani}</p>
                      <p className="text-white/25 text-[10px] mt-0.5">{catQCount} {t(lang, 'questions')}</p>
                    </motion.button>
                  )
                })}
              </div>
            </div>

            {/* Questions Preview */}
            <div>
              <h3 className="text-white/40 text-[11px] font-semibold uppercase tracking-widest mb-3 flex items-center gap-2" dir="rtl">
                <CircleDot className="w-3.5 h-3.5" />
                {t(lang, 'availableQuestions')} ({questionsList.length})
              </h3>
              <ScrollArea className="max-h-[500px]">
                <div className="space-y-2 pr-1">
                  {questionsList.map((q, idx) => {
                    const getOptionText = (index: number) => {
                      const key = `option${index}${lang === 'badini' ? 'Badini' : 'Sorani'}` as keyof QuizQuestion
                      return q[key] as string
                    }
                    return (
                      <motion.div
                        key={q.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.02 }}
                        className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-3 hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-200"
                      >
                        <div className="flex items-start gap-2.5" dir="rtl">
                          <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/20 flex items-center justify-center text-[10px] font-bold text-blue-300">
                            {idx + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className="bg-blue-500/10 text-blue-300/70 border-blue-500/15 text-[8px] px-1.5 py-0">
                                {lang === 'badini' ? q.category.nameBadini : q.category.nameSorani}
                              </Badge>
                              <span className="text-yellow-400/40 text-[8px] flex items-center gap-0.5">
                                <Star className="w-2.5 h-2.5 fill-yellow-400/40" /> ١٠
                              </span>
                            </div>
                            <p className="text-white/80 text-xs leading-relaxed line-clamp-2">
                              {lang === 'badini' ? q.textBadini : q.textSorani}
                            </p>
                            <div className="grid grid-cols-2 gap-1 mt-1.5">
                              {[1, 2, 3, 4].map((optIdx) => (
                                <div
                                  key={optIdx}
                                  className={`text-[10px] px-1.5 py-0.5 rounded-md truncate ${
                                    q.correctAnswer === optIdx
                                      ? 'bg-green-500/10 text-green-300/70 border border-green-500/15'
                                      : 'bg-white/[0.02] text-white/25 border border-white/5'
                                  }`}
                                >
                                  <span className="font-bold ml-0.5">{optIdx}.</span>
                                  {getOptionText(optIdx)}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                  {questionsList.length === 0 && (
                    <div className="text-center py-8">
                      <BookOpen className="w-10 h-10 text-white/15 mx-auto mb-2" />
                      <p className="text-white/25 text-xs" dir="rtl">{t(lang, 'noQuestions')}</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// ===================== TOP PAGE (LEADERBOARD) =====================
function TopPage() {
  const { lang, setView, leaderboard, setLeaderboard } = useAppStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [localLeaderboard, setLocalLeaderboard] = useState<LeaderboardEntry[]>([])

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(data => {
        setLocalLeaderboard(data)
        setLeaderboard(data)
      })
      .catch(() => {})
  }, [setLeaderboard])

  const filteredLeaderboard = searchQuery.trim()
    ? localLeaderboard.filter(entry => entry.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : localLeaderboard

  const getRankStyle = (index: number) => {
    if (index === 0) return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/10 border-yellow-500/30 shadow-lg shadow-yellow-500/10'
    if (index === 1) return 'bg-gradient-to-r from-gray-400/15 to-gray-500/5 border-gray-400/20'
    if (index === 2) return 'bg-gradient-to-r from-amber-600/15 to-orange-500/5 border-amber-600/20'
    return 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05]'
  }

  const getRankBadge = (index: number) => {
    if (index === 0) return (
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-yellow-500/30">
        <Crown className="w-5 h-5 text-white" />
      </div>
    )
    if (index === 1) return (
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center shadow-lg shadow-gray-400/30">
        <Medal className="w-5 h-5 text-white" />
      </div>
    )
    if (index === 2) return (
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
        <Medal className="w-5 h-5 text-white" />
      </div>
    )
    return (
      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
        <span className="text-white/50 font-bold text-sm">{index + 1}</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#0d1442] to-[#1a0a2e] relative overflow-hidden">
      <AnimatedBackground />
      <NavBar />

      <div className="relative z-10 max-w-3xl mx-auto px-4 pt-6 pb-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="mx-auto mb-3 w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500 via-amber-500 to-orange-500 flex items-center justify-center shadow-2xl shadow-yellow-500/30">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-black text-white">
            {t(lang, 'topList')} <span className="text-yellow-400">100</span>
          </h2>
          <p className="text-white/30 text-sm mt-1" dir="rtl">
            {t(lang, 'playerName')} & {t(lang, 'points')}
          </p>
        </motion.div>

        {/* Search */}
        <div className="relative mb-4">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-yellow-400/50 focus:ring-yellow-400/10 rounded-xl h-12 text-sm pr-4 pl-10"
            placeholder={t(lang, 'searchPlayer')}
            dir="rtl"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        </div>

        {/* Leaderboard List */}
        {filteredLeaderboard.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-white/10 mx-auto mb-3" />
            <p className="text-white/25 text-sm" dir="rtl">{t(lang, 'noPlayersYet')}</p>
          </div>
        ) : (
          <ScrollArea className="max-h-[calc(100vh-250px)]">
            <div className="space-y-2 pr-1">
              {filteredLeaderboard.slice(0, 100).map((entry, i) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${getRankStyle(i)}`}
                  dir="rtl"
                >
                  {getRankBadge(i)}
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {entry.avatar ? (
                      <img src={entry.avatar} alt="" className="w-8 h-8 rounded-full object-cover border-2 border-white/10" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                        <Users className="w-4 h-4 text-white/30" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-white/90 text-sm font-bold truncate">{entry.name}</p>
                      <p className="text-white/30 text-[10px]">
                        {entry.correctCount} {t(lang, 'correctAnswers')} / {entry.totalAnswered} {t(lang, 'questions')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-1.5">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-yellow-300 text-sm font-bold">{entry.score}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  )
}

// ===================== QUIZ PAGE =====================
function QuizPage() {
  const {
    lang, participant, selectedCategoryId, questions, setQuestions,
    currentQuestionIndex, setCurrentQuestionIndex,
    addAnsweredQuestionId, correctCount, incrementCorrect,
    wrongCount, incrementWrong, setView, answeredQuestionIds,
  } = useAppStore()

  const [timeLeft, setTimeLeft] = useState(120)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [isAnswered, setIsAnswered] = useState(false)
  const [resultType, setResultType] = useState<'correct' | 'wrong' | 'timeout' | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const autoNextRef = useRef<NodeJS.Timeout | null>(null)

  const fetchQuestions = useCallback(async () => {
    try {
      const url = selectedCategoryId
        ? `/api/questions?categoryId=${selectedCategoryId}`
        : '/api/questions'
      const res = await fetch(url)
      const data = await res.json()
      const unanswered = data.filter(
        (q: QuizQuestion) => !answeredQuestionIds.includes(q.id)
      )
      setQuestions(unanswered)
    } catch { /* ignore */ }
  }, [selectedCategoryId, answeredQuestionIds, setQuestions])

  useEffect(() => {
    fetchQuestions()
  }, [fetchQuestions])

  const currentQuestion = questions[currentQuestionIndex]

  // Timer
  useEffect(() => {
    if (!currentQuestion || isAnswered) return
    setTimeLeft(120)
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [currentQuestionIndex, currentQuestion?.id, isAnswered, currentQuestion])

  // Handle timeout
  const isTimedOut = timeLeft === 0 && !isAnswered && !!currentQuestion
  useEffect(() => {
    if (!isTimedOut || !participant || !currentQuestion) return
    setIsAnswered(true)
    setResultType('timeout')
    setShowResult(true)
    incrementWrong()
    fetch('/api/answers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        participantId: participant.id,
        questionId: currentQuestion.id,
        selectedAnswer: null,
        correctAnswer: currentQuestion.correctAnswer,
      }),
    }).then(() => {
      addAnsweredQuestionId(currentQuestion.id)
    }).catch(() => {})
  }, [isTimedOut, participant, currentQuestion, incrementWrong, addAnsweredQuestionId])

  // Auto advance
  useEffect(() => {
    if (!isAnswered || !showResult) return
    autoNextRef.current = setTimeout(() => {
      handleNext()
    }, 2500)
    return () => {
      if (autoNextRef.current) clearTimeout(autoNextRef.current)
    }
  }, [isAnswered, showResult])

  const handleAnswer = async (answerIndex: number) => {
    if (isAnswered || isTimedOut || !currentQuestion) return
    if (timerRef.current) clearInterval(timerRef.current)

    setIsAnswered(true)
    setSelectedAnswer(answerIndex)

    const isCorrect = answerIndex === currentQuestion.correctAnswer
    if (isCorrect) {
      setResultType('correct')
      incrementCorrect()
    } else {
      setResultType('wrong')
      incrementWrong()
    }
    setShowResult(true)

    if (participant) {
      try {
        await fetch('/api/answers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            participantId: participant.id,
            questionId: currentQuestion.id,
            selectedAnswer: answerIndex,
            correctAnswer: currentQuestion.correctAnswer,
          }),
        })
        addAnsweredQuestionId(currentQuestion.id)
      } catch { /* ignore */ }
    }
  }

  const handleNext = () => {
    if (autoNextRef.current) clearTimeout(autoNextRef.current)
    if (currentQuestionIndex + 1 >= questions.length) {
      setView('results')
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setShowResult(false)
      setIsAnswered(false)
      setResultType(null)
      setTimeLeft(120)
    }
  }

  const getOptionText = (q: QuizQuestion, index: number) => {
    const key = `option${index}${lang === 'badini' ? 'Badini' : 'Sorani'}` as keyof QuizQuestion
    return q[key] as string
  }
  const getQuestionText = (q: QuizQuestion) => lang === 'badini' ? q.textBadini : q.textSorani
  const getCategoryName = (q: QuizQuestion) => lang === 'badini' ? q.category.nameBadini : q.category.nameSorani
  const getCorrectOptionText = (q: QuizQuestion) => getOptionText(q, q.correctAnswer)

  const effectiveResultType = isTimedOut ? 'timeout' : resultType
  const effectiveShowResult = showResult || isTimedOut
  const effectiveIsAnswered = isAnswered || isTimedOut

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#0d1442] to-[#1a0a2e] relative overflow-hidden">
        <AnimatedBackground />
        <NavBar />
        <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-60px)]">
          <Card className="bg-white/[0.04] backdrop-blur-xl border-white/10 p-8 text-center">
            <CardContent className="space-y-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <BookOpen className="w-14 h-14 text-white/30 mx-auto" />
              </motion.div>
              <p className="text-white text-lg" dir="rtl">{t(lang, 'noQuestions')}</p>
              <Button
                onClick={() => setView('home')}
                className="bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-xl"
              >
                <HomeIcon className="w-4 h-4 mr-2" />
                {t(lang, 'backToHome')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const questionProgress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#0d1442] to-[#1a0a2e] relative overflow-hidden">
      <AnimatedBackground />
      <NavBar />

      <div className="relative z-10 max-w-3xl mx-auto px-4 pt-6 pb-8">
        {/* Quiz Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2" dir="rtl">
            <Badge className="bg-blue-500/10 text-blue-300 border-blue-500/20 px-2.5 py-1 text-xs">
              {getCategoryName(currentQuestion)}
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 rounded-lg px-2.5 py-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
              <span className="text-green-300 text-xs font-bold">{correctCount}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 rounded-lg px-2.5 py-1">
              <XCircle className="w-3.5 h-3.5 text-red-400" />
              <span className="text-red-300 text-xs font-bold">{wrongCount}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-white/40 mb-1.5">
            <span dir="rtl">{t(lang, 'questionNumber')} {currentQuestionIndex + 1} {t(lang, 'of')} {questions.length}</span>
            <span className="text-yellow-400/60 font-bold">{correctCount * 10} {t(lang, 'points')}</span>
          </div>
          <Progress value={questionProgress} className="h-1.5 bg-white/5" />
        </div>

        {/* Timer */}
        <div className="flex justify-center mb-5">
          <CircularTimer timeLeft={timeLeft} maxTime={120} />
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-white/[0.04] backdrop-blur-xl border-white/10 shadow-2xl overflow-hidden mb-4">
              <div className={`h-1.5 transition-all duration-500 ${
                effectiveShowResult
                  ? effectiveResultType === 'correct'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                    : effectiveResultType === 'timeout'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                    : 'bg-gradient-to-r from-red-500 to-orange-500'
                  : 'bg-gradient-to-r from-blue-500 via-purple-500 to-red-500'
              }`} />
              <CardContent className="p-6">
                <h3 className="text-white text-lg font-bold text-center leading-relaxed mb-6" dir="rtl">
                  {getQuestionText(currentQuestion)}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map((optIdx) => {
                    const isCorrectOption = optIdx === currentQuestion.correctAnswer
                    const isSelectedAnswer = optIdx === selectedAnswer
                    const isWrongSelection = effectiveShowResult && isSelectedAnswer && !isCorrectOption
                    const showCorrectHighlight = effectiveShowResult && isCorrectOption

                    return (
                      <motion.button
                        key={optIdx}
                        whileHover={!effectiveIsAnswered ? { scale: 1.02 } : {}}
                        whileTap={!effectiveIsAnswered ? { scale: 0.98 } : {}}
                        onClick={() => handleAnswer(optIdx)}
                        disabled={effectiveIsAnswered}
                        className={`relative p-4 rounded-xl border-2 text-right transition-all duration-300 ${
                          showCorrectHighlight
                            ? 'bg-green-500/15 border-green-400/60 shadow-lg shadow-green-500/20'
                            : isWrongSelection
                            ? 'bg-red-500/15 border-red-400/60 shadow-lg shadow-red-500/20'
                            : effectiveIsAnswered
                            ? 'bg-white/[0.02] border-white/5 opacity-50'
                            : 'bg-white/[0.04] border-white/10 hover:border-purple-400/40 hover:bg-white/[0.08]'
                        }`}
                        dir="rtl"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold ${
                            showCorrectHighlight
                              ? 'bg-green-500/30 text-green-300'
                              : isWrongSelection
                              ? 'bg-red-500/30 text-red-300'
                              : 'bg-white/5 text-white/40'
                          }`}>
                            {showCorrectHighlight ? <CheckCircle2 className="w-5 h-5" /> : isWrongSelection ? <XCircle className="w-5 h-5" /> : optIdx}
                          </div>
                          <span className={`text-sm font-medium ${
                            showCorrectHighlight ? 'text-green-300' : isWrongSelection ? 'text-red-300' : 'text-white/80'
                          }`}>
                            {getOptionText(currentQuestion, optIdx)}
                          </span>
                        </div>
                      </motion.button>
                    )
                  })}
                </div>

                {/* Result Message */}
                <AnimatePresence>
                  {effectiveShowResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-5"
                    >
                      {effectiveResultType === 'correct' ? (
                        <div className="text-center p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                          <CheckCircle2 className="w-8 h-8 text-green-400 mx-auto mb-2" />
                          <p className="text-green-300 font-bold text-lg" dir="rtl">{t(lang, 'correct')}</p>
                          <p className="text-green-400/60 text-sm mt-1" dir="rtl">+10 {t(lang, 'points')}</p>
                        </div>
                      ) : effectiveResultType === 'timeout' ? (
                        <div className="text-center p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                          <Timer className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                          <p className="text-amber-300 font-bold text-lg" dir="rtl">{t(lang, 'timeUp')}</p>
                          <p className="text-amber-400/60 text-sm mt-1" dir="rtl">{t(lang, 'timeUpCorrectIs')}: {getCorrectOptionText(currentQuestion)}</p>
                        </div>
                      ) : (
                        <div className="text-center p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                          <XCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                          <p className="text-red-300 font-bold text-lg" dir="rtl">{t(lang, 'wrong')}</p>
                          <p className="text-red-400/60 text-sm mt-1" dir="rtl">{t(lang, 'wrongCorrectIs')}: {getCorrectOptionText(currentQuestion)}</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

// ===================== RESULTS PAGE =====================
function ResultsPage() {
  const { lang, participant, correctCount, wrongCount, questions, setView, resetQuiz } = useAppStore()
  const totalQuestions = questions.length
  const score = correctCount * 10
  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0

  let message = t(lang, 'tryAgain')
  let messageColor = 'text-red-400'
  let messageIcon = <XCircle className="w-12 h-12" />
  if (percentage >= 80) {
    message = t(lang, 'excellent')
    messageColor = 'text-green-400'
    messageIcon = <PartyPopper className="w-12 h-12" />
  } else if (percentage >= 50) {
    message = t(lang, 'good')
    messageColor = 'text-amber-400'
    messageIcon = <ThumbsUp className="w-12 h-12" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#0d1442] to-[#1a0a2e] relative overflow-hidden">
      <AnimatedBackground />
      <NavBar />

      <div className="relative z-10 max-w-lg mx-auto px-4 pt-8 pb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <Card className="bg-white/[0.04] backdrop-blur-xl border-white/10 shadow-2xl overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500" />
            <CardContent className="p-8 text-center space-y-6">
              {/* Player Info */}
              <div className="flex items-center justify-center gap-3">
                {participant?.avatar ? (
                  <img src={participant.avatar} alt="" className="w-12 h-12 rounded-full object-cover border-2 border-white/20" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <Users className="w-6 h-6 text-white/30" />
                  </div>
                )}
                <div>
                  <p className="text-white font-bold text-lg" dir="rtl">{participant?.name}</p>
                  <p className="text-white/30 text-xs">{t(lang, 'quizComplete')}</p>
                </div>
              </div>

              {/* Score Circle */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.3 }}
                className="mx-auto w-32 h-32 rounded-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-red-500/20 border-2 border-purple-400/30 flex flex-col items-center justify-center"
              >
                <span className="text-4xl font-black text-white">{score}</span>
                <span className="text-white/40 text-xs">{t(lang, 'points')}</span>
              </motion.div>

              {/* Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className={`${messageColor}`}
              >
                <div className="flex justify-center mb-2">{messageIcon}</div>
                <p className="text-xl font-bold" dir="rtl">{message}</p>
              </motion.div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mx-auto mb-1" />
                  <p className="text-green-300 font-bold text-lg">{correctCount}</p>
                  <p className="text-green-400/50 text-[10px]" dir="rtl">{t(lang, 'correctAnswers')}</p>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                  <XCircle className="w-5 h-5 text-red-400 mx-auto mb-1" />
                  <p className="text-red-300 font-bold text-lg">{wrongCount}</p>
                  <p className="text-red-400/50 text-[10px]" dir="rtl">{t(lang, 'wrongAnswers')}</p>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3">
                  <Star className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                  <p className="text-yellow-300 font-bold text-lg">{percentage}%</p>
                  <p className="text-yellow-400/50 text-[10px]" dir="rtl">{t(lang, 'score')}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <Progress value={percentage} className="h-3 bg-white/5" />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    resetQuiz()
                    setView('home')
                  }}
                  className="flex-1 bg-white/5 border border-white/10 text-white hover:bg-white/10 rounded-xl py-3"
                >
                  <HomeIcon className="w-4 h-4 mr-2" />
                  {t(lang, 'backToHome')}
                </Button>
                <Button
                  onClick={() => {
                    resetQuiz()
                    setView('quiz')
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 hover:from-blue-700 hover:via-purple-700 hover:to-red-700 text-white font-bold rounded-xl py-3"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {t(lang, 'retryQuiz')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

// ===================== ADMIN PAGE =====================
function AdminPage() {
  const { lang, setView, isAdminAuth, setIsAdminAuth } = useAppStore()
  const [categories, setCategories] = useState<QuizCategory[]>([])
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [newCatBadini, setNewCatBadini] = useState('')
  const [newCatSorani, setNewCatSorani] = useState('')
  const [newQ, setNewQ] = useState({
    textBadini: '', textSorani: '',
    option1Badini: '', option1Sorani: '',
    option2Badini: '', option2Sorani: '',
    option3Badini: '', option3Sorani: '',
    option4Badini: '', option4Sorani: '',
    correctAnswer: 1, categoryId: '',
  })
  const { toast } = useToast()

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories')
      setCategories(await res.json())
    } catch { /* ignore */ }
  }, [])

  const fetchQuestions = useCallback(async () => {
    try {
      const res = await fetch('/api/questions')
      setQuestions(await res.json())
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    fetchCategories()
    fetchQuestions()
  }, [fetchCategories, fetchQuestions])

  const handleAddCategory = async () => {
    if (!newCatBadini.trim() || !newCatSorani.trim()) return
    try {
      await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nameBadini: newCatBadini.trim(), nameSorani: newCatSorani.trim() }),
      })
      setNewCatBadini('')
      setNewCatSorani('')
      fetchCategories()
      toast({ title: 'OK' })
    } catch {
      toast({ title: 'Error', variant: 'destructive' })
    }
  }

  const handleAddQuestion = async () => {
    if (!newQ.textBadini.trim() || !newQ.textSorani.trim() || !newQ.categoryId) return
    try {
      await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newQ),
      })
      setNewQ({
        textBadini: '', textSorani: '',
        option1Badini: '', option1Sorani: '',
        option2Badini: '', option2Sorani: '',
        option3Badini: '', option3Sorani: '',
        option4Badini: '', option4Sorani: '',
        correctAnswer: 1, categoryId: '',
      })
      fetchQuestions()
      toast({ title: 'OK' })
    } catch {
      toast({ title: 'Error', variant: 'destructive' })
    }
  }

  const handleDeleteCategory = async (id: string) => {
    try {
      await fetch('/api/categories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      fetchCategories()
      fetchQuestions()
    } catch { /* ignore */ }
  }

  const handleDeleteQuestion = async (id: string) => {
    try {
      await fetch('/api/questions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      fetchQuestions()
    } catch { /* ignore */ }
  }

  if (!isAdminAuth) {
    setView('home')
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#0d1442] to-[#1a0a2e] relative overflow-hidden">
      <AnimatedBackground />
      <NavBar />

      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-6 pb-8">
        {/* Admin Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-white font-bold text-lg">{t(lang, 'adminPanel')}</h2>
          </div>
          <Button
            onClick={() => {
              setIsAdminAuth(false)
              setView('home')
            }}
            variant="outline"
            className="bg-white/5 border-white/10 text-white/60 hover:bg-white/10 rounded-xl"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {t(lang, 'logout')}
          </Button>
        </div>

        <Tabs defaultValue="categories" className="space-y-4">
          <TabsList className="bg-white/5 border border-white/10 rounded-xl p-1">
            <TabsTrigger value="categories" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-white/50">
              {t(lang, 'manageCategories')}
            </TabsTrigger>
            <TabsTrigger value="questions" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-white/50">
              {t(lang, 'manageQuestions')}
            </TabsTrigger>
          </TabsList>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-4">
            <Card className="bg-white/[0.04] backdrop-blur-xl border-white/10">
              <CardContent className="p-5 space-y-3">
                <h3 className="text-white font-bold text-sm" dir="rtl">{t(lang, 'addCategory')}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-white/50 text-xs" dir="rtl">{t(lang, 'categoryNameBadini')}</Label>
                    <Input value={newCatBadini} onChange={(e) => setNewCatBadini(e.target.value)} className="bg-white/5 border-white/10 text-white rounded-xl h-10" dir="rtl" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-white/50 text-xs" dir="rtl">{t(lang, 'categoryNameSorani')}</Label>
                    <Input value={newCatSorani} onChange={(e) => setNewCatSorani(e.target.value)} className="bg-white/5 border-white/10 text-white rounded-xl h-10" dir="rtl" />
                  </div>
                </div>
                <Button onClick={handleAddCategory} disabled={!newCatBadini.trim() || !newCatSorani.trim()} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl">
                  <Plus className="w-4 h-4 mr-2" />
                  {t(lang, 'addCategory')}
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-2">
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between bg-white/[0.03] border border-white/[0.08] rounded-xl p-3">
                  <div className="flex items-center gap-3" dir="rtl">
                    <BookOpen className="w-4 h-4 text-blue-400" />
                    <span className="text-white/80 text-sm font-bold">{cat.nameBadini}</span>
                    <span className="text-white/30 text-xs">/ {cat.nameSorani}</span>
                  </div>
                  <Button onClick={() => handleDeleteCategory(cat.id)} variant="outline" size="sm" className="bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-lg h-8 w-8 p-0">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Questions Tab */}
          <TabsContent value="questions" className="space-y-4">
            <Card className="bg-white/[0.04] backdrop-blur-xl border-white/10">
              <CardContent className="p-5 space-y-3">
                <h3 className="text-white font-bold text-sm" dir="rtl">{t(lang, 'addQuestion')}</h3>

                <div className="space-y-1">
                  <Label className="text-white/50 text-xs" dir="rtl">{t(lang, 'category')}</Label>
                  <Select value={newQ.categoryId} onValueChange={(v) => setNewQ({ ...newQ, categoryId: v })}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl h-10" dir="rtl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {lang === 'badini' ? cat.nameBadini : cat.nameSorani}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-white/50 text-xs" dir="rtl">{t(lang, 'questionTextBadini')}</Label>
                    <Input value={newQ.textBadini} onChange={(e) => setNewQ({ ...newQ, textBadini: e.target.value })} className="bg-white/5 border-white/10 text-white rounded-xl h-10" dir="rtl" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-white/50 text-xs" dir="rtl">{t(lang, 'questionTextSorani')}</Label>
                    <Input value={newQ.textSorani} onChange={(e) => setNewQ({ ...newQ, textSorani: e.target.value })} className="bg-white/5 border-white/10 text-white rounded-xl h-10" dir="rtl" />
                  </div>
                </div>

                {[1, 2, 3, 4].map((optIdx) => (
                  <div key={optIdx} className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-end">
                    <div className="space-y-1">
                      <Label className="text-white/50 text-xs" dir="rtl">{t(lang, 'option')} {optIdx} ({t(lang, 'badini')})</Label>
                      <Input
                        value={(newQ as Record<string, string>)[`option${optIdx}Badini`]}
                        onChange={(e) => setNewQ({ ...newQ, [`option${optIdx}Badini`]: e.target.value })}
                        className="bg-white/5 border-white/10 text-white rounded-xl h-9 text-xs"
                        dir="rtl"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-white/50 text-xs" dir="rtl">{t(lang, 'option')} {optIdx} ({t(lang, 'sorani')})</Label>
                      <Input
                        value={(newQ as Record<string, string>)[`option${optIdx}Sorani`]}
                        onChange={(e) => setNewQ({ ...newQ, [`option${optIdx}Sorani`]: e.target.value })}
                        className="bg-white/5 border-white/10 text-white rounded-xl h-9 text-xs"
                        dir="rtl"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-white/50 text-xs" dir="rtl">{t(lang, 'correctOption')}</Label>
                      <Button
                        type="button"
                        onClick={() => setNewQ({ ...newQ, correctAnswer: optIdx })}
                        className={`w-full rounded-xl h-9 text-xs font-bold ${
                          newQ.correctAnswer === optIdx
                            ? 'bg-green-500/20 border border-green-500/30 text-green-300'
                            : 'bg-white/5 border border-white/10 text-white/40'
                        }`}
                      >
                        {newQ.correctAnswer === optIdx ? <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> : null}
                        {optIdx}
                      </Button>
                    </div>
                  </div>
                ))}

                <Button onClick={handleAddQuestion} disabled={!newQ.textBadini.trim() || !newQ.categoryId} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl">
                  <Plus className="w-4 h-4 mr-2" />
                  {t(lang, 'addQuestion')}
                </Button>
              </CardContent>
            </Card>

            {/* Questions List */}
            <ScrollArea className="max-h-[400px]">
              <div className="space-y-2 pr-1">
                {questions.map((q, idx) => {
                  const getOptionText = (index: number) => {
                    const key = `option${index}${lang === 'badini' ? 'Badini' : 'Sorani'}` as keyof QuizQuestion
                    return q[key] as string
                  }
                  return (
                    <div key={q.id} className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-3">
                      <div className="flex items-start gap-2.5" dir="rtl">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className="bg-blue-500/10 text-blue-300/70 border-blue-500/15 text-[8px] px-1.5 py-0">
                              {lang === 'badini' ? q.category.nameBadini : q.category.nameSorani}
                            </Badge>
                          </div>
                          <p className="text-white/80 text-xs leading-relaxed">
                            {lang === 'badini' ? q.textBadini : q.textSorani}
                          </p>
                        </div>
                        <Button onClick={() => handleDeleteQuestion(q.id)} variant="outline" size="sm" className="bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-lg h-7 w-7 p-0 flex-shrink-0">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// ===================== MAIN APP =====================
export default function App() {
  const { view } = useAppStore()

  return (
    <AnimatePresence mode="wait">
      {view === 'home' && <HomePage key="home" />}
      {view === 'quiz' && <QuizPage key="quiz" />}
      {view === 'top' && <TopPage key="top" />}
      {view === 'admin' && <AdminPage key="admin" />}
      {view === 'results' && <ResultsPage key="results" />}
    </AnimatePresence>
  )
}
