'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useAppStore, Lang, PlayerData } from '@/lib/store'
import { questions as allQuestions, HardcodedQuestion, getCategories, shuffleQuestions } from '@/lib/questions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  UserPlus, Shield, Plus, Trash2, Trophy, CheckCircle2,
  XCircle, BookOpen, Languages,
  Star, Zap, Sparkles, Eye, EyeOff,
  Gamepad2, Crown, Target, CircleDot, Medal,
  Users, Search, ChevronDown, ChevronUp, ArrowRight, Play, Home as HomeIcon, RotateCcw,
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
    profileSection: 'پرۆفایل',
    enterNameToStart: 'ناڤێ خۆ بنڤیسە تا دەستپێبکەی',
    quizSection: 'پرسیارکرن',
    topSection: 'TOP ١٠٠',
    goToQuiz: 'بچۆ کویز',
    goToTop: 'بچۆ TOP',
    goToHome: 'HOME',
    quizEnded: 'کویز تەواو بوو',
    playAgain: 'دووبارە یاریبکە',
    homeSection: 'HOME',
    timeRemaining: 'چرکە',
    category: 'جۆر',
    manageQuestions: 'بەڕێوەبردنا پرسیاران',
    manageCategories: 'بەڕێوەبردنا جۆران',
    logout: 'دەرچوو',
    questionNumber: 'پرسیاری ژمارە',
    option: 'هەڵبژارتن',
    correctOption: 'هەڵبژارتنا دروست',
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
    profileSection: 'پرۆفایل',
    enterNameToStart: 'ناوت بنووسە تا دەستپێبکەیت',
    quizSection: 'پرسیارکردن',
    topSection: 'TOP ١٠٠',
    goToQuiz: 'بچۆ کویز',
    goToTop: 'بچۆ TOP',
    goToHome: 'HOME',
    quizEnded: 'کویز تەواو بوو',
    playAgain: 'دووبارە یاریبکە',
    homeSection: 'HOME',
    timeRemaining: 'چرکە',
    category: 'جۆر',
    manageQuestions: 'بەڕێوەبردنى پرسیارەکان',
    manageCategories: 'بەڕێوەبردنى جۆرەکان',
    logout: 'دەرچوون',
    questionNumber: 'پرسیارى ژمارە',
    option: 'هەڵبژاردن',
    correctOption: 'هەڵبژاردنى ڕاست',
  },
}

function t(lang: Lang, key: keyof typeof translations.badini) {
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

// ===================== MAIN APP =====================
export default function App() {
  const { section, leaderboard, setLeaderboard } = useAppStore()

  // Load leaderboard from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('7s_squad_leaderboard')
      if (stored) {
        try {
          const data = JSON.parse(stored)
          setLeaderboard(data)
        } catch { /* ignore */ }
      }
    }
  }, [setLeaderboard])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#0d1442] to-[#1a0a2e] relative">
      <AnimatedBackground />
      <div className="relative z-10">
        <NavBar />
        {section === 'home' && <HomeSection />}
        {section === 'quiz' && <QuizSection />}
        {section === 'results' && <ResultsSection />}
      </div>
    </div>
  )
}

// ===================== NAVBAR =====================
function NavBar() {
  const { section, setSection, lang, setLang } = useAppStore()
  const [showAdminModal, setShowAdminModal] = useState(false)

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

        {/* Center - Navigation */}
        <div className="flex items-center gap-1 bg-white/5 rounded-xl p-0.5">
          {(['home', 'quiz', 'top'] as const).map((tab) => {
            const isActive = section === tab || (section === 'results' && tab === 'quiz')
            const labelKey = tab === 'home' ? 'homeSection' : tab === 'quiz' ? 'quizSection' : 'topSection'
            return (
              <button
                key={tab}
                onClick={() => {
                  if (tab === 'top') {
                    // Scroll to TOP section on home
                    setSection('home')
                    setTimeout(() => {
                      document.getElementById('top-section')?.scrollIntoView({ behavior: 'smooth' })
                    }, 100)
                  } else {
                    setSection(tab as 'home' | 'quiz')
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/25'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                }`}
              >
                {t(lang, labelKey)}
              </button>
            )
          })}
        </div>

        {/* Right - Admin Panel Button */}
        <Button
          variant="outline"
          size="sm"
          className="bg-gradient-to-r from-orange-600/20 to-red-600/20 border-orange-500/30 text-orange-300 hover:bg-orange-600/30 backdrop-blur-sm rounded-full px-3 h-8 text-[11px] font-bold"
          onClick={() => setShowAdminModal(true)}
        >
          <Shield className="w-3.5 h-3.5 mr-1.5" />
          ADMIN
        </Button>
      </div>

      {/* Admin Login Modal */}
      <AdminLoginModal open={showAdminModal} onClose={() => setShowAdminModal(false)} />
    </>
  )
}

// ===================== ADMIN LOGIN MODAL =====================
function AdminLoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lang, setIsAdminAuth, setSection } = useAppStore()
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
        setSection('home')
        // Open admin section
        setTimeout(() => {
          document.getElementById('admin-section')?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
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

// ===================== HOME SECTION (ALL-IN-ONE) =====================
function HomeSection() {
  const { lang, setSection, playerName, setPlayerName, playerAvatar, setPlayerAvatar, setSelectedCategory, selectedCategory, resetQuiz, leaderboard } = useAppStore()
  const [avatarPreview, setAvatarPreview] = useState<string | null>(playerAvatar)
  const [showAllTop, setShowAllTop] = useState(false)
  const { toast } = useToast()

  const categories = getCategories(lang)
  const filteredQuestions = selectedCategory
    ? allQuestions.filter(q => (lang === 'badini' ? q.categoryBadini : q.categorySorani) === selectedCategory)
    : allQuestions

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

  const handleStartQuiz = () => {
    if (!playerName.trim()) {
      toast({ title: t(lang, 'enterNameToStart'), variant: 'destructive' })
      return
    }
    setSelectedCategory(selectedCategory)
    resetQuiz()
    setSection('quiz')
  }

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="w-4 h-4 text-yellow-400" />
    if (index === 1) return <Medal className="w-4 h-4 text-gray-300" />
    if (index === 2) return <Medal className="w-4 h-4 text-amber-600" />
    return <span className="text-white/40 text-[10px] font-bold">{index + 1}</span>
  }

  return (
    <div className="max-w-5xl mx-auto px-4 pt-4 pb-8 space-y-6">

      {/* ====== HERO / WELCOME ====== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-red-500 flex items-center justify-center shadow-2xl shadow-purple-500/30"
        >
          <Gamepad2 className="w-8 h-8 text-white" />
        </motion.div>
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-wider">
          7S SQUAD <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-red-400 bg-clip-text text-transparent">PSYAR</span>
        </h1>
        {playerName.trim() && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-green-300/70 mt-1 text-sm" dir="rtl"
          >
            {t(lang, 'welcomeBack')} {playerName.trim()}!
          </motion.p>
        )}
      </motion.div>

      {/* ====== MAIN GRID ====== */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

        {/* LEFT - Profile + Start */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-4 space-y-4"
        >
          {/* Profile Card */}
          <Card className="bg-white/[0.04] backdrop-blur-xl border-white/10 shadow-xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500" />
            <CardContent className="p-4 space-y-3">
              {/* Avatar */}
              <div className="flex flex-col items-center gap-1.5">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-white/10 to-white/5 border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden group-hover:border-purple-400/50 transition-all">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <UserPlus className="w-7 h-7 text-white/30" />
                    )}
                  </div>
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-red-500 flex items-center justify-center shadow-md">
                    <Plus className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
                <Label className="text-white/40 text-[10px]">{t(lang, 'uploadAvatar')}</Label>
              </div>

              {/* Name Input */}
              <div className="space-y-1">
                <Label className="text-white/50 text-[10px]" dir="rtl">{t(lang, 'enterName')}</Label>
                <div className="relative">
                  <Input
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className={`bg-white/5 border text-white placeholder:text-white/20 rounded-xl h-10 text-xs pr-3 pl-8 transition-all ${
                      playerName.trim() ? 'border-green-500/40 focus:border-green-400/60' : 'border-white/10 focus:border-purple-400/50'
                    }`}
                    placeholder={t(lang, 'enterName')}
                    dir="rtl"
                  />
                  <div className="absolute left-2.5 top-1/2 -translate-y-1/2">
                    {playerName.trim() ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <UserPlus className="w-4 h-4 text-white/20" />}
                  </div>
                </div>
              </div>

              {/* Category Select */}
              <div className="space-y-1">
                <Label className="text-white/50 text-[10px]" dir="rtl">{t(lang, 'selectCategory')}</Label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl h-10 text-xs px-3 appearance-none cursor-pointer focus:border-purple-400/50 focus:outline-none"
                  dir="rtl"
                >
                  <option value="" className="bg-[#0d1442]">{t(lang, 'allCategories')}</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name} className="bg-[#0d1442]">{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Points Badge */}
              <div className="flex items-center justify-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl py-2 px-3" dir="rtl">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-yellow-300/80 text-xs font-bold">{t(lang, 'pointsPerQuestion')}</span>
              </div>

              {/* Start Button */}
              <Button
                onClick={handleStartQuiz}
                disabled={!playerName.trim()}
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 hover:from-blue-700 hover:via-purple-700 hover:to-red-700 text-white font-bold text-sm py-4 rounded-xl shadow-lg shadow-purple-500/25 transition-all hover:shadow-xl hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100"
              >
                <Play className="w-4 h-4 mr-2" />
                {t(lang, 'startQuiz')}
              </Button>
            </CardContent>
          </Card>

          {/* Mini TOP 5 */}
          <Card className="bg-white/[0.04] backdrop-blur-xl border-white/10 shadow-xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500" />
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5" dir="rtl">
                  <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                  <span className="text-white/70 text-[11px] font-bold">{t(lang, 'topList')}</span>
                </div>
                <button
                  onClick={() => document.getElementById('top-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-blue-400/60 text-[9px] hover:text-blue-400 transition-colors"
                >
                  {t(lang, 'viewResults')} →
                </button>
              </div>
              {leaderboard.length === 0 ? (
                <div className="text-center py-3">
                  <Users className="w-5 h-5 text-white/15 mx-auto mb-1" />
                  <p className="text-white/20 text-[9px]" dir="rtl">{t(lang, 'noPlayersYet')}</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {leaderboard.slice(0, 5).map((entry, i) => (
                    <div
                      key={entry.id}
                      className={`flex items-center gap-1.5 p-1.5 rounded-lg ${
                        i === 0 ? 'bg-yellow-500/10 border border-yellow-500/20' :
                        i === 1 ? 'bg-gray-400/10 border border-gray-400/10' :
                        i === 2 ? 'bg-amber-600/10 border border-amber-600/10' :
                        'bg-white/[0.02]'
                      }`}
                      dir="rtl"
                    >
                      <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">{getRankIcon(i)}</div>
                      <div className="flex items-center gap-1 flex-1 min-w-0">
                        {entry.avatar && <img src={entry.avatar} alt="" className="w-4 h-4 rounded-full object-cover flex-shrink-0" />}
                        <p className="text-white/80 text-[10px] font-bold truncate">{entry.name}</p>
                      </div>
                      <div className="flex items-center gap-0.5 flex-shrink-0">
                        <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                        <span className="text-yellow-300 text-[10px] font-bold">{entry.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* RIGHT - Categories + Questions List + TOP */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-8 space-y-4"
        >
          {/* Categories Grid */}
          <div>
            <h3 className="text-white/40 text-[10px] font-semibold uppercase tracking-widest mb-2 flex items-center gap-1.5" dir="rtl">
              <Target className="w-3 h-3" />
              {t(lang, 'selectCategory')}
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedCategory('')}
                className={`rounded-xl p-3 border-2 transition-all text-center ${
                  !selectedCategory
                    ? 'border-purple-400/60 bg-purple-500/10 shadow-lg shadow-purple-500/10'
                    : 'border-white/10 bg-white/[0.03] hover:border-white/20'
                }`}
              >
                <div className="mx-auto mb-1.5 w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-red-500 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <p className="text-white text-[10px] font-bold" dir="rtl">{t(lang, 'allCategories')}</p>
                <p className="text-white/25 text-[9px]">{allQuestions.length}</p>
              </motion.button>
              {categories.map((cat, i) => {
                const count = allQuestions.filter(q => (lang === 'badini' ? q.categoryBadini : q.categorySorani) === cat.name).length
                const colors = ['from-blue-500 to-cyan-500', 'from-purple-500 to-pink-500', 'from-red-500 to-orange-500', 'from-green-500 to-emerald-500', 'from-amber-500 to-yellow-500', 'from-indigo-500 to-blue-500', 'from-rose-500 to-pink-500']
                return (
                  <motion.button
                    key={cat.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`rounded-xl p-3 border-2 transition-all text-center ${
                      selectedCategory === cat.name
                        ? 'border-purple-400/60 bg-purple-500/10 shadow-lg shadow-purple-500/10'
                        : 'border-white/10 bg-white/[0.03] hover:border-white/20'
                    }`}
                  >
                    <div className={`mx-auto mb-1.5 w-8 h-8 rounded-lg bg-gradient-to-br ${colors[i % colors.length]} flex items-center justify-center`}>
                      <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-white text-[10px] font-bold" dir="rtl">{cat.name}</p>
                    <p className="text-white/25 text-[9px]">{count}</p>
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Questions Preview */}
          <div>
            <h3 className="text-white/40 text-[10px] font-semibold uppercase tracking-widest mb-2 flex items-center gap-1.5" dir="rtl">
              <CircleDot className="w-3 h-3" />
              {t(lang, 'availableQuestions')} ({filteredQuestions.length})
            </h3>
            <ScrollArea className="max-h-[350px]">
              <div className="space-y-1.5 pr-1">
                {filteredQuestions.map((q, idx) => (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-2.5 hover:bg-white/[0.06] transition-all"
                  >
                    <div className="flex items-start gap-2" dir="rtl">
                      <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-blue-500/15 border border-blue-500/15 flex items-center justify-center text-[9px] font-bold text-blue-300">
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <Badge className="bg-blue-500/10 text-blue-300/60 border-blue-500/15 text-[7px] px-1 py-0">
                            {lang === 'badini' ? q.categoryBadini : q.categorySorani}
                          </Badge>
                          <span className="text-yellow-400/40 text-[7px] flex items-center gap-0.5">
                            <Star className="w-2 h-2 fill-yellow-400/40" /> ١٠
                          </span>
                        </div>
                        <p className="text-white/80 text-[11px] leading-relaxed line-clamp-2">
                          {lang === 'badini' ? q.textBadini : q.textSorani}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {filteredQuestions.length === 0 && (
                  <div className="text-center py-6">
                    <BookOpen className="w-8 h-8 text-white/15 mx-auto mb-1" />
                    <p className="text-white/25 text-[10px]" dir="rtl">{t(lang, 'noQuestions')}</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* ====== TOP 100 LEADERBOARD (inside HOME) ====== */}
          <div id="top-section">
            <Card className="bg-white/[0.04] backdrop-blur-xl border-white/10 shadow-xl overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500" />
              <CardContent className="p-4">
                <div className="flex items-center justify-center gap-2 mb-4" dir="rtl">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <span className="text-white font-bold text-sm">{t(lang, 'topSection')}</span>
                </div>

                {leaderboard.length === 0 ? (
                  <div className="text-center py-6">
                    <Users className="w-10 h-10 text-white/15 mx-auto mb-2" />
                    <p className="text-white/25 text-xs" dir="rtl">{t(lang, 'noPlayersYet')}</p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {(showAllTop ? leaderboard : leaderboard.slice(0, 10)).map((entry, i) => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
                          i === 0 ? 'bg-yellow-500/10 border border-yellow-500/20' :
                          i === 1 ? 'bg-gray-400/10 border border-gray-400/10' :
                          i === 2 ? 'bg-amber-600/10 border border-amber-600/10' :
                          'bg-white/[0.02] border border-white/5'
                        }`}
                        dir="rtl"
                      >
                        <div className="w-7 h-7 flex items-center justify-center flex-shrink-0">
                          {i === 0 ? <Crown className="w-4 h-4 text-yellow-400" /> :
                           i === 1 ? <Medal className="w-4 h-4 text-gray-300" /> :
                           i === 2 ? <Medal className="w-4 h-4 text-amber-600" /> :
                           <span className="text-white/40 text-[10px] font-bold">{i + 1}</span>}
                        </div>
                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                          {entry.avatar ? (
                            <img src={entry.avatar} alt="" className="w-6 h-6 rounded-full object-cover flex-shrink-0 border border-white/10" />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                              <UserPlus className="w-3 h-3 text-white/30" />
                            </div>
                          )}
                          <p className="text-white/80 text-xs font-bold truncate">{entry.name}</p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-yellow-300 text-xs font-bold">{entry.score}</span>
                        </div>
                      </motion.div>
                    ))}
                    {leaderboard.length > 10 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAllTop(!showAllTop)}
                        className="w-full text-white/40 hover:text-white/70 text-[10px] mt-1"
                      >
                        {showAllTop ? <ChevronUp className="w-3 h-3 mr-1" /> : <ChevronDown className="w-3 h-3 mr-1" />}
                        {showAllTop ? 'کەمتر ببینە' : `${leaderboard.length - 10} زیاتر...`}
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* ====== ADMIN SECTION ====== */}
          <div id="admin-section">
            <AdminPanel />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// ===================== QUIZ SECTION =====================
function QuizSection() {
  const {
    lang, playerName, playerAvatar, setSection,
    quizQuestions, setQuizQuestions,
    currentQuestionIndex, setCurrentQuestionIndex,
    selectedAnswer, setSelectedAnswer,
    isAnswered, setIsAnswered,
    correctCount, incrementCorrect, incrementWrong,
    score, addScore, timeLeft, setTimeLeft,
    selectedCategory, addPlayerToLeaderboard,
  } = useAppStore()

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()
  const [autoNextTimer, setAutoNextTimer] = useState<NodeJS.Timeout | null>(null)

  // Initialize quiz questions
  useEffect(() => {
    if (quizQuestions.length === 0) {
      const filtered = selectedCategory
        ? allQuestions.filter(q => (lang === 'badini' ? q.categoryBadini : q.categorySorani) === selectedCategory)
        : allQuestions
      setQuizQuestions(shuffleQuestions(filtered))
    }
  }, [quizQuestions.length, selectedCategory, lang, setQuizQuestions])

  // Timer
  useEffect(() => {
    if (isAnswered || !quizQuestions.length) return

    setTimeLeft(120)
    timerRef.current = setInterval(() => {
      const current = useAppStore.getState().timeLeft
      if (current <= 1) {
        clearInterval(timerRef.current!)
        // Time's up - auto mark as wrong
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

  // Cleanup auto-next timer
  useEffect(() => {
    return () => {
      if (autoNextTimer) clearTimeout(autoNextTimer)
    }
  }, [autoNextTimer])

  const currentQ = quizQuestions[currentQuestionIndex]
  if (!currentQ) {
    // No questions available
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center">
        <Card className="bg-white/[0.04] backdrop-blur-xl border-white/10">
          <CardContent className="p-8">
            <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <p className="text-white/50 text-sm" dir="rtl">{t(lang, 'noQuestions')}</p>
            <Button onClick={() => setSection('home')} className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl">
              {t(lang, 'backToHome')}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getOptionText = (index: number) => {
    const key = `option${index}${lang === 'badini' ? 'Badini' : 'Sorani'}` as keyof HardcodedQuestion
    return currentQ[key] as string
  }

  const handleAnswer = (optionIndex: number) => {
    if (isAnswered) return

    // Stop timer
    if (timerRef.current) clearInterval(timerRef.current)

    setSelectedAnswer(optionIndex)
    setIsAnswered(true)

    if (optionIndex === currentQ.correctAnswer) {
      incrementCorrect()
      addScore(10)
    } else {
      incrementWrong()
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
      // Quiz complete - save to leaderboard and go to results
      const state = useAppStore.getState()
      addPlayerToLeaderboard({
        id: `player_${Date.now()}`,
        name: state.playerName,
        avatar: state.playerAvatar,
        score: state.score,
        correctCount: state.correctCount,
        totalAnswered: state.correctCount + state.wrongCount,
        createdAt: Date.now(),
      })
      setSection('results')
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
      setTimeLeft(120)
    }
  }

  const getOptionStyle = (optIndex: number) => {
    if (!isAnswered) {
      return 'border-white/10 bg-white/[0.03] hover:border-purple-400/40 hover:bg-white/[0.06] cursor-pointer'
    }
    if (optIndex === currentQ.correctAnswer) {
      return 'border-green-500/60 bg-green-500/15 shadow-lg shadow-green-500/10'
    }
    if (optIndex === selectedAnswer && optIndex !== currentQ.correctAnswer) {
      return 'border-red-500/60 bg-red-500/15 shadow-lg shadow-red-500/10'
    }
    return 'border-white/5 bg-white/[0.01] opacity-50'
  }

  const questionText = lang === 'badini' ? currentQ.textBadini : currentQ.textSorani
  const categoryName = lang === 'badini' ? currentQ.categoryBadini : currentQ.categorySorani

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
      {/* Quiz Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2" dir="rtl">
          {playerAvatar ? (
            <img src={playerAvatar} alt="" className="w-8 h-8 rounded-full object-cover border border-white/10" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <UserPlus className="w-4 h-4 text-white/30" />
            </div>
          )}
          <span className="text-white/70 text-xs font-bold">{playerName}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-yellow-300 text-sm font-bold">{score}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSection('home')}
            className="text-white/40 hover:text-white/70 text-xs"
          >
            <HomeIcon className="w-4 h-4 mr-1" />
            HOME
          </Button>
        </div>
      </div>

      {/* Timer + Progress */}
      <div className="flex items-center gap-3">
        <CircularTimer timeLeft={timeLeft} maxTime={120} />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-white/50 text-[10px]">
              {t(lang, 'question')} {currentQuestionIndex + 1} {t(lang, 'of')} {quizQuestions.length}
            </span>
            <Badge className="bg-blue-500/10 text-blue-300/60 border-blue-500/15 text-[8px] px-1.5">
              {categoryName}
            </Badge>
          </div>
          {/* Progress bar */}
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 rounded-full"
              animate={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Answer Feedback */}
      <AnimatePresence>
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            className={`text-center py-2 px-4 rounded-xl text-sm font-bold ${
              selectedAnswer === currentQ.correctAnswer
                ? 'bg-green-500/15 border border-green-500/30 text-green-300'
                : timeLeft <= 0
                ? 'bg-amber-500/15 border border-amber-500/30 text-amber-300'
                : 'bg-red-500/15 border border-red-500/30 text-red-300'
            }`}
            dir="rtl"
          >
            {selectedAnswer === currentQ.correctAnswer ? (
              <span className="flex items-center justify-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> {t(lang, 'correct')}</span>
            ) : timeLeft <= 0 ? (
              <span className="flex items-center justify-center gap-1.5"><XCircle className="w-4 h-4" /> {t(lang, 'timeUp')}</span>
            ) : (
              <span className="flex items-center justify-center gap-1.5"><XCircle className="w-4 h-4" /> {t(lang, 'wrong')}</span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Question Card */}
      <Card className="bg-white/[0.04] backdrop-blur-xl border-white/10 shadow-xl overflow-hidden">
        <CardContent className="p-5">
          <h2 className="text-white text-base font-bold leading-relaxed mb-4" dir="rtl">
            {questionText}
          </h2>

          {/* Options */}
          <div className="space-y-2">
            {[1, 2, 3, 4].map((optIdx) => (
              <motion.button
                key={optIdx}
                whileHover={!isAnswered ? { scale: 1.01 } : {}}
                whileTap={!isAnswered ? { scale: 0.99 } : {}}
                onClick={() => handleAnswer(optIdx)}
                disabled={isAnswered}
                className={`w-full p-3 rounded-xl border-2 transition-all duration-300 text-right ${getOptionStyle(optIdx)}`}
                dir="rtl"
              >
                <div className="flex items-center gap-2">
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    isAnswered && optIdx === currentQ.correctAnswer
                      ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                      : isAnswered && optIdx === selectedAnswer && optIdx !== currentQ.correctAnswer
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : 'bg-white/5 text-white/50 border border-white/10'
                  }`}>
                    {isAnswered && optIdx === currentQ.correctAnswer ? <CheckCircle2 className="w-3.5 h-3.5" /> :
                     isAnswered && optIdx === selectedAnswer && optIdx !== currentQ.correctAnswer ? <XCircle className="w-3.5 h-3.5" /> :
                     optIdx}
                  </span>
                  <span className="text-white/80 text-sm">{getOptionText(optIdx)}</span>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Manual Next Button */}
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4"
            >
              <Button
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 text-white font-bold rounded-xl py-3"
              >
                {currentQuestionIndex + 1 >= quizQuestions.length ? t(lang, 'viewResults') : t(lang, 'nextQuestion')}
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// ===================== RESULTS SECTION =====================
function ResultsSection() {
  const { lang, playerName, playerAvatar, correctCount, wrongCount, score, setSection, resetQuiz, leaderboard } = useAppStore()
  const totalQuestions = correctCount + wrongCount
  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0
  const playerRank = leaderboard.findIndex(p => p.name === playerName) + 1

  const getMessage = () => {
    if (percentage >= 80) return t(lang, 'excellent')
    if (percentage >= 50) return t(lang, 'good')
    return t(lang, 'tryAgain')
  }

  const getMessageColor = () => {
    if (percentage >= 80) return 'text-green-400'
    if (percentage >= 50) return 'text-amber-400'
    return 'text-red-400'
  }

  const handlePlayAgain = () => {
    resetQuiz()
    setSection('quiz')
  }

  const handleHome = () => {
    resetQuiz()
    setSection('home')
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
      {/* Result Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <Card className="bg-white/[0.04] backdrop-blur-xl border-white/10 shadow-2xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500" />
          <CardContent className="p-6 text-center space-y-4">
            {/* Player Info */}
            <div className="flex flex-col items-center gap-2">
              {playerAvatar ? (
                <img src={playerAvatar} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-white/20" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                  <UserPlus className="w-8 h-8 text-white/30" />
                </div>
              )}
              <h2 className="text-white font-bold text-lg" dir="rtl">{playerName}</h2>
            </div>

            {/* Score Circle */}
            <div className="relative w-32 h-32 mx-auto">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.08)" strokeWidth="6" fill="none" />
                <circle
                  cx="50" cy="50" r="42"
                  stroke={percentage >= 80 ? '#22c55e' : percentage >= 50 ? '#f59e0b' : '#ef4444'}
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - percentage / 100)}`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-white">{score}</span>
                <span className="text-white/40 text-[9px]">{t(lang, 'points')}</span>
              </div>
            </div>

            {/* Message */}
            <p className={`text-lg font-bold ${getMessageColor()}`} dir="rtl">{getMessage()}</p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-2">
                <p className="text-green-400 text-xl font-bold">{correctCount}</p>
                <p className="text-green-300/50 text-[9px]" dir="rtl">{t(lang, 'correctAnswers')}</p>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-2">
                <p className="text-red-400 text-xl font-bold">{wrongCount}</p>
                <p className="text-red-300/50 text-[9px]" dir="rtl">{t(lang, 'wrongAnswers')}</p>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-2">
                <p className="text-yellow-400 text-xl font-bold">#{playerRank || '-'}</p>
                <p className="text-yellow-300/50 text-[9px]" dir="rtl">{t(lang, 'rank')}</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                onClick={handlePlayAgain}
                className="flex-1 bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 text-white font-bold rounded-xl py-3"
              >
                <RotateCcw className="w-4 h-4 mr-1.5" />
                {t(lang, 'playAgain')}
              </Button>
              <Button
                onClick={handleHome}
                variant="outline"
                className="flex-1 bg-white/5 border-white/10 text-white/70 hover:bg-white/10 rounded-xl py-3"
              >
                <HomeIcon className="w-4 h-4 mr-1.5" />
                HOME
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

// ===================== ADMIN PANEL (inline) =====================
function AdminPanel() {
  const { lang, isAdminAuth, setIsAdminAuth } = useAppStore()
  const [adminTab, setAdminTab] = useState<'questions' | 'manage'>('questions')
  const { toast } = useToast()

  if (!isAdminAuth) return null

  // Simple state for adding questions
  const [newQ, setNewQ] = useState({
    categoryBadini: '',
    categorySorani: '',
    textBadini: '',
    textSorani: '',
    option1Badini: '', option1Sorani: '',
    option2Badini: '', option2Sorani: '',
    option3Badini: '', option3Sorani: '',
    option4Badini: '', option4Sorani: '',
    correctAnswer: 1,
  })

  const handleAddQuestion = () => {
    // Add to the hardcoded questions array at runtime
    const q: HardcodedQuestion = {
      id: `q_custom_${Date.now()}`,
      ...newQ,
    }
    allQuestions.push(q)
    toast({ title: 'پرسیار زیاد بوو!', description: 'Question added at runtime (add to src/lib/questions.ts for persistence)' })
    setNewQ({
      categoryBadini: '', categorySorani: '',
      textBadini: '', textSorani: '',
      option1Badini: '', option1Sorani: '',
      option2Badini: '', option2Sorani: '',
      option3Badini: '', option3Sorani: '',
      option4Badini: '', option4Sorani: '',
      correctAnswer: 1,
    })
  }

  return (
    <Card className="bg-white/[0.04] backdrop-blur-xl border-orange-500/20 shadow-xl overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500" />
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2" dir="rtl">
            <Shield className="w-4 h-4 text-orange-400" />
            <span className="text-white font-bold text-sm">{t(lang, 'adminPanel')}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAdminAuth(false)}
            className="text-red-400/60 hover:text-red-400 text-[10px]"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            {t(lang, 'logout')}
          </Button>
        </div>

        {/* Add Question Form */}
        <div className="space-y-2">
          <h4 className="text-white/60 text-[10px] font-semibold" dir="rtl">{t(lang, 'addQuestion')}</h4>

          <div className="grid grid-cols-2 gap-2">
            <Input
              value={newQ.categoryBadini}
              onChange={e => setNewQ({ ...newQ, categoryBadini: e.target.value })}
              placeholder="جۆر ب بادینی"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-lg h-8 text-[10px]"
              dir="rtl"
            />
            <Input
              value={newQ.categorySorani}
              onChange={e => setNewQ({ ...newQ, categorySorani: e.target.value })}
              placeholder="جۆر ب سورانی"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-lg h-8 text-[10px]"
              dir="rtl"
            />
          </div>

          <Input
            value={newQ.textBadini}
            onChange={e => setNewQ({ ...newQ, textBadini: e.target.value })}
            placeholder="پرسیار ب بادینی"
            className="bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-lg h-8 text-[10px]"
            dir="rtl"
          />
          <Input
            value={newQ.textSorani}
            onChange={e => setNewQ({ ...newQ, textSorani: e.target.value })}
            placeholder="پرسیار ب سورانی"
            className="bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-lg h-8 text-[10px]"
            dir="rtl"
          />

          {[1, 2, 3, 4].map(i => (
            <div key={i} className="grid grid-cols-2 gap-1.5 items-center">
              <div className="flex items-center gap-1">
                <input
                  type="radio"
                  name="correctAnswer"
                  checked={newQ.correctAnswer === i}
                  onChange={() => setNewQ({ ...newQ, correctAnswer: i })}
                  className="accent-green-500"
                />
                <Input
                  value={newQ[`option${i}Badini` as keyof typeof newQ]}
                  onChange={e => setNewQ({ ...newQ, [`option${i}Badini`]: e.target.value })}
                  placeholder={`هەڵبژارتن ${i} بادینی`}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-lg h-7 text-[9px]"
                  dir="rtl"
                />
              </div>
              <Input
                value={newQ[`option${i}Sorani` as keyof typeof newQ]}
                onChange={e => setNewQ({ ...newQ, [`option${i}Sorani`]: e.target.value })}
                placeholder={`هەڵبژارتن ${i} سورانی`}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-lg h-7 text-[9px]"
                dir="rtl"
              />
            </div>
          ))}

          <Button
            onClick={handleAddQuestion}
            disabled={!newQ.textBadini.trim() || !newQ.textSorani.trim()}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded-xl text-xs py-2 disabled:opacity-40"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            {t(lang, 'addQuestion')}
          </Button>

          <p className="text-white/20 text-[8px] text-center" dir="rtl">
            بۆ هەمیشە پرسیار زیادبکە: فایلی src/lib/questions.ts بگۆڕە
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
