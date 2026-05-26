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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  UserPlus,
  Shield,
  Plus,
  Trash2,
  LogOut,
  Trophy,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Brain,
  BookOpen,
  Languages,
  Home as HomeIcon,
  Star,
  Zap,
  Timer,
  PartyPopper,
  ThumbsUp,
  Sparkles,
  Eye,
  EyeOff,
  ListChecks,
  Hash,
  Gamepad2,
  Crown,
  Target,
  Flame,
  CircleDot,
  Medal,
  Users,
  ChevronLeft,
  PointX,
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
    adminPanel: 'پەنەلا ئەدمین',
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
    topList: 'لیستا TOP',
    playerName: 'ناوی یاریزان',
    points: 'خاڵ',
    enterAdminPass: 'پەیڤا نهێنی بنڤیسە...',
    adminLogin: 'چوونەژوورێ ئەدمین',
    questionNumber: 'پرسیاری ژمارە',
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
    adminPanel: 'پانێلى ئەدمین',
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
    topList: 'لیستا TOP',
    playerName: 'ناوى یاریزان',
    points: 'خاڵ',
    enterAdminPass: 'وشەى نهێنى بنووسە...',
    adminLogin: 'چوونەژوورەوە ئەدمین',
    questionNumber: 'پرسیارى ژمارە',
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

// ===================== CIRCULAR TIMER (SECONDS ONLY) =====================
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
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle cx="50" cy="50" r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth="5" fill="none" />
        <circle cx="50" cy="50" r={radius} stroke="rgba(255,255,255,0.03)" strokeWidth="5" fill="none" />
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

// ===================== WELCOME PAGE (HOME) =====================
function WelcomePage() {
  const { setView, setParticipant, lang, setLang, setSelectedCategoryId, resetQuiz, setLeaderboard } = useAppStore()
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState<string | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [categories, setCategories] = useState<QuizCategory[]>([])
  const [selectedCat, setSelectedCat] = useState<string>('all')
  const [questionsList, setQuestionsList] = useState<QuizQuestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [adminPass, setAdminPass] = useState('')
  const [showPass, setShowPass] = useState(false)
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
      toast({ title: t(lang, 'enterName'), variant: 'destructive' })
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
        setView('admin')
      } else {
        toast({ title: t(lang, 'invalidPassword'), variant: 'destructive' })
      }
    } catch {
      toast({ title: t(lang, 'invalidPassword'), variant: 'destructive' })
    }
  }

  const getOptionText = (q: QuizQuestion, index: number) => {
    const key = `option${index}${lang === 'badini' ? 'Badini' : 'Sorani'}` as keyof QuizQuestion
    return q[key] as string
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

      {/* Top Navigation */}
      <div className="relative z-10 flex items-center justify-between p-4 max-w-6xl mx-auto">
        <Button
          variant="outline"
          size="sm"
          className="bg-white/5 border-white/10 text-white hover:bg-white/10 backdrop-blur-sm rounded-full px-4 h-9 text-sm font-medium"
          onClick={() => setLang(lang === 'badini' ? 'sorani' : 'badini')}
        >
          <Languages className="w-4 h-4 mr-2" />
          {lang === 'badini' ? 'سورانی' : 'بادینی'}
        </Button>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="flex items-center gap-2"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-red-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Gamepad2 className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-white/90 font-black text-sm tracking-widest leading-none">7S SQUAD</span>
            <span className="text-[10px] font-bold bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent tracking-wider">PSYAR</span>
          </div>
        </motion.div>

        <Button
          variant="outline"
          size="sm"
          className="bg-white/5 border-white/10 text-white hover:bg-white/10 backdrop-blur-sm rounded-full px-4 h-9 text-sm font-medium"
          onClick={() => setView('admin')}
        >
          <Shield className="w-4 h-4 mr-2" />
          {t(lang, 'adminPanel')}
        </Button>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-4 pb-2">
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
            className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-red-500 flex items-center justify-center shadow-2xl shadow-purple-500/30"
          >
            <Gamepad2 className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-wider">
            7S SQUAD <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-red-400 bg-clip-text text-transparent">PSYAR</span>
          </h1>
          <p className="text-blue-200/50 mt-2 text-sm" dir="rtl">{t(lang, 'chooseAndStart')}</p>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

          {/* Left Column - Profile & Admin & Top */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-3 space-y-4"
          >
            {/* Profile Card */}
            <Card className="bg-white/[0.04] backdrop-blur-xl border-white/10 shadow-2xl overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500" />
              <CardHeader className="text-center pb-1 pt-4">
                <CardTitle className="text-base font-bold text-white/90 flex items-center justify-center gap-2" dir="rtl">
                  <Crown className="w-4 h-4 text-yellow-400" />
                  {t(lang, 'ready')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pb-5">
                {/* Avatar */}
                <div className="flex flex-col items-center gap-1">
                  <div className="relative group">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-white/10 to-white/5 border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden group-hover:border-purple-400/50 transition-all duration-300">
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <UserPlus className="w-6 h-6 text-white/30 group-hover:text-white/50 transition-colors" />
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-red-500 flex items-center justify-center shadow-md">
                      <Plus className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <Label className="text-white/30 text-[9px]">{t(lang, 'uploadAvatar')}</Label>
                </div>

                {/* Name */}
                <div className="space-y-1">
                  <Label className="text-white/50 text-[11px]" dir="rtl">{t(lang, 'enterName')}</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-purple-400/50 focus:ring-purple-400/10 rounded-xl h-10 text-sm"
                    placeholder={t(lang, 'enterName')}
                    dir="rtl"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <Label className="text-white/50 text-[11px]" dir="rtl">{t(lang, 'selectCategory')}</Label>
                  <Select value={selectedCat} onValueChange={setSelectedCat}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl h-10 text-sm" dir="rtl">
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
                <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-xl py-2 px-3" dir="rtl">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-yellow-300/80 text-xs font-bold">{t(lang, 'pointsPerQuestion')}</span>
                </div>

                {/* Start */}
                <Button
                  onClick={handleStart}
                  disabled={isLoading || !name.trim()}
                  className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 hover:from-blue-700 hover:via-purple-700 hover:to-red-700 text-white font-bold text-sm py-4 rounded-xl shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/35 hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      {t(lang, 'startQuiz')}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Admin Pass Card */}
            <Card className="bg-white/[0.04] backdrop-blur-xl border-white/10 shadow-xl overflow-hidden">
              <div className="h-0.5 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500" />
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2" dir="rtl">
                  <Shield className="w-4 h-4 text-orange-400" />
                  <span className="text-white/70 text-xs font-bold">{t(lang, 'adminPassword')}</span>
                </div>
                <div className="relative">
                  <Input
                    type={showPass ? 'text' : 'password'}
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-orange-400/50 focus:ring-orange-400/10 rounded-xl h-10 text-sm pr-3 pl-10"
                    placeholder={t(lang, 'enterAdminPass')}
                    dir="ltr"
                    onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                  />
                  <button
                    onClick={() => setShowPass(!showPass)}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                    type="button"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <Button
                  onClick={handleAdminLogin}
                  disabled={!adminPass.trim()}
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all duration-300 disabled:opacity-40"
                >
                  <Shield className="w-3.5 h-3.5 mr-1.5" />
                  {t(lang, 'adminLogin')}
                </Button>
              </CardContent>
            </Card>

            {/* Top List */}
            <Card className="bg-white/[0.04] backdrop-blur-xl border-white/10 shadow-xl overflow-hidden">
              <div className="h-0.5 bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500" />
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3" dir="rtl">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span className="text-white/70 text-xs font-bold">{t(lang, 'topList')}</span>
                </div>
                {leaderboard.length === 0 ? (
                  <div className="text-center py-4">
                    <Users className="w-6 h-6 text-white/15 mx-auto mb-1" />
                    <p className="text-white/20 text-[10px]" dir="rtl">هیچ یاریزانی نییە</p>
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
                          <p className="text-white/80 text-xs font-bold truncate">{entry.name}</p>
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

          {/* Right Column - Categories & Questions */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-9 space-y-4"
          >
            {/* Categories Grid */}
            <div>
              <h3 className="text-white/40 text-[10px] font-semibold uppercase tracking-widest mb-2 flex items-center gap-2" dir="rtl">
                <Target className="w-3 h-3" />
                {t(lang, 'selectCategory')}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedCat('all')}
                  className={`relative overflow-hidden rounded-xl p-3 border-2 transition-all duration-300 text-center ${
                    selectedCat === 'all'
                      ? 'border-purple-400/60 bg-purple-500/10 shadow-lg shadow-purple-500/10'
                      : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'
                  }`}
                >
                  <div className={`mx-auto mb-1.5 w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-red-500 flex items-center justify-center`}>
                    <ListChecks className="w-4 h-4 text-white" />
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
                      className={`relative overflow-hidden rounded-xl p-3 border-2 transition-all duration-300 text-center ${
                        selectedCat === cat.id
                          ? 'border-purple-400/60 bg-purple-500/10 shadow-lg shadow-purple-500/10'
                          : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'
                      }`}
                    >
                      <div className={`mx-auto mb-1.5 w-9 h-9 rounded-lg bg-gradient-to-br ${getCategoryColor(i)} flex items-center justify-center`}>
                        <BookOpen className="w-4 h-4 text-white" />
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
              <h3 className="text-white/40 text-[10px] font-semibold uppercase tracking-widest mb-2 flex items-center gap-2" dir="rtl">
                <CircleDot className="w-3 h-3" />
                {t(lang, 'availableQuestions')} ({questionsList.length})
              </h3>
              <ScrollArea className="max-h-[500px]">
                <div className="space-y-2 pr-1">
                  {questionsList.map((q, idx) => (
                    <motion.div
                      key={q.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-3 hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-200 group"
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
                                {getOptionText(q, optIdx)}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
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
  const { toast } = useToast()

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

  // Auto advance after answer
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0e27] via-[#0d1442] to-[#1a0a2e] relative overflow-hidden">
        <AnimatedBackground />
        <Card className="bg-white/[0.04] backdrop-blur-xl border-white/10 p-8 text-center relative z-10">
          <CardContent className="space-y-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <BookOpen className="w-14 h-14 text-white/30 mx-auto" />
            </motion.div>
            <p className="text-white text-lg" dir="rtl">{t(lang, 'noQuestions')}</p>
            <Button
              onClick={() => setView('welcome')}
              className="bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-xl"
            >
              <HomeIcon className="w-4 h-4 mr-2" />
              {t(lang, 'backToHome')}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const questionProgress = ((currentQuestionIndex + 1) / questions.length) * 100
  const optionLabels = ['A', 'B', 'C', 'D']
  const totalScore = correctCount * 10

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-3 bg-gradient-to-br from-[#0a0e27] via-[#0d1442] to-[#1a0a2e] relative overflow-hidden">
      <AnimatedBackground />

      {/* Top Bar */}
      <div className="w-full max-w-2xl flex items-center justify-between mb-2 relative z-10">
        <Button
          variant="ghost"
          size="sm"
          className="text-white/40 hover:text-white hover:bg-white/5 rounded-full"
          onClick={() => setView('welcome')}
        >
          <HomeIcon className="w-4 h-4" />
        </Button>

        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-gradient-to-br from-blue-500 to-red-500 flex items-center justify-center">
            <Brain className="w-3 h-3 text-white" />
          </div>
          <span className="text-xs font-bold text-white/50 tracking-wider">7S SQUAD PSYAR</span>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 bg-green-500/10 border border-green-500/20 rounded-full px-2 py-0.5">
            <CheckCircle2 className="w-2.5 h-2.5 text-green-400" />
            <span className="text-green-300 text-[10px] font-bold">{correctCount}</span>
          </div>
          <div className="flex items-center gap-1 bg-red-500/10 border border-red-500/20 rounded-full px-2 py-0.5">
            <XCircle className="w-2.5 h-2.5 text-red-400" />
            <span className="text-red-300 text-[10px] font-bold">{wrongCount}</span>
          </div>
          <div className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-2 py-0.5">
            <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
            <span className="text-yellow-300 text-[10px] font-bold">{totalScore}</span>
          </div>
        </div>
      </div>

      {/* Player Name Bar */}
      {participant && (
        <div className="w-full max-w-2xl mb-2 relative z-10">
          <div className="flex items-center justify-center gap-2 bg-white/[0.03] border border-white/[0.06] rounded-full py-1.5 px-4" dir="rtl">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center overflow-hidden">
              {participant.avatar ? (
                <img src={participant.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-[10px] font-bold">{participant.name[0]}</span>
              )}
            </div>
            <span className="text-white/60 text-xs font-medium">{participant.name}</span>
            <span className="text-white/20 text-[10px]">|</span>
            <span className="text-yellow-400/60 text-[10px] font-bold flex items-center gap-0.5">
              <Star className="w-2.5 h-2.5 fill-yellow-400/60" />
              {totalScore} {t(lang, 'score')}
            </span>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="w-full max-w-2xl mb-3 relative z-10">
        <div className="flex items-center justify-between mb-1">
          <Badge className="bg-blue-500/10 text-blue-300/70 border-blue-500/15 rounded-full px-2 text-[9px]">
            {getCategoryName(currentQuestion)}
          </Badge>
          <span className="text-white/30 text-[10px] font-mono" dir="rtl">
            {t(lang, 'questionNumber')} {currentQuestionIndex + 1} / {questions.length}
          </span>
        </div>
        <Progress value={questionProgress} className="h-0.5 [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:via-purple-500 [&>div]:to-red-500" />
      </div>

      <motion.div
        key={currentQuestion.id}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-2xl relative z-10"
      >
        <Card className="bg-white/[0.04] backdrop-blur-xl border-white/10 shadow-2xl overflow-hidden">
          <div className="h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500" />

          <CardHeader className="pb-1 pt-4">
            {/* Timer */}
            <CircularTimer timeLeft={timeLeft} maxTime={120} />
          </CardHeader>

          <CardContent className="space-y-4 pb-5">
            {/* Question */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] rounded-xl p-4 border border-white/[0.08]"
            >
              <p className="text-white text-base leading-relaxed text-center font-medium" dir="rtl">
                {getQuestionText(currentQuestion)}
              </p>
            </motion.div>

            {/* Options */}
            <div className="space-y-2.5" dir="rtl">
              {[1, 2, 3, 4].map((index) => {
                const isSelected = selectedAnswer === index
                const isCorrectOption = currentQuestion.correctAnswer === index

                let optionClass = 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.08] hover:border-purple-400/30 hover:shadow-md hover:shadow-purple-500/5 text-white/90'
                let labelClass = 'bg-white/10 text-white/60'

                if (effectiveShowResult) {
                  if (isCorrectOption) {
                    optionClass = 'bg-green-500/15 border-green-400/50 text-green-200 shadow-lg shadow-green-500/5'
                    labelClass = 'bg-green-500/30 text-green-300'
                  } else if (isSelected && !isCorrectOption) {
                    optionClass = 'bg-red-500/15 border-red-400/50 text-red-200 shadow-lg shadow-red-500/5'
                    labelClass = 'bg-red-500/30 text-red-300'
                  } else {
                    optionClass = 'bg-white/[0.01] border-white/[0.04] text-white/20'
                    labelClass = 'bg-white/5 text-white/20'
                  }
                }

                return (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={effectiveIsAnswered}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 * index }}
                    whileHover={!effectiveIsAnswered ? { scale: 1.015, y: -2 } : undefined}
                    whileTap={!effectiveIsAnswered ? { scale: 0.98 } : undefined}
                    className={`w-full p-3.5 rounded-xl border-2 transition-all duration-300 text-right ${optionClass} ${effectiveIsAnswered ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors ${labelClass}`}>
                        {effectiveShowResult && isCorrectOption ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : effectiveShowResult && isSelected && !isCorrectOption ? (
                          <XCircle className="w-5 h-5" />
                        ) : (
                          optionLabels[index - 1]
                        )}
                      </span>
                      <span className="text-sm flex-1 leading-relaxed">{getOptionText(currentQuestion, index)}</span>
                      {effectiveShowResult && isCorrectOption && (
                        <span className="text-yellow-400 text-xs font-bold flex items-center gap-0.5 flex-shrink-0">
                          <Star className="w-3.5 h-3.5 fill-yellow-400" /> +١٠
                        </span>
                      )}
                    </div>
                  </motion.button>
                )
              })}
            </div>

            {/* Result Message */}
            <AnimatePresence>
              {effectiveShowResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  dir="rtl"
                >
                  {effectiveResultType === 'correct' && (
                    <div className="bg-gradient-to-br from-green-500/15 to-emerald-500/5 border border-green-400/30 rounded-xl p-4 text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400, delay: 0.1 }}
                        className="flex justify-center gap-2"
                      >
                        <PartyPopper className="w-8 h-8 text-green-400" />
                      </motion.div>
                      <p className="text-green-300 text-lg font-bold mt-1">{t(lang, 'correct')}</p>
                      <div className="flex justify-center gap-1 mt-1">
                        {[1,2,3].map((s) => (
                          <motion.div key={s} initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.15 + s * 0.08 }}>
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          </motion.div>
                        ))}
                      </div>
                      <p className="text-yellow-400/80 text-sm font-bold mt-1">+١٠ {t(lang, 'score')}</p>
                    </div>
                  )}
                  {effectiveResultType === 'wrong' && (
                    <div className="bg-gradient-to-br from-red-500/15 to-rose-500/5 border border-red-400/30 rounded-xl p-4 text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400 }}
                      >
                        <XCircle className="w-8 h-8 text-red-400 mx-auto" />
                      </motion.div>
                      <p className="text-red-300 text-lg font-bold mt-1">{t(lang, 'wrong')}</p>
                      <p className="text-white/50 text-xs mt-1">
                        {t(lang, 'wrongCorrectIs')}: <span className="text-green-300 font-bold">{getCorrectOptionText(currentQuestion)}</span>
                      </p>
                    </div>
                  )}
                  {effectiveResultType === 'timeout' && (
                    <div className="bg-gradient-to-br from-amber-500/15 to-orange-500/5 border border-amber-400/30 rounded-xl p-4 text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400 }}
                      >
                        <Timer className="w-8 h-8 text-amber-400 mx-auto" />
                      </motion.div>
                      <p className="text-amber-300 text-lg font-bold mt-1">{t(lang, 'timeUp')}</p>
                      <p className="text-white/50 text-xs mt-1">
                        {t(lang, 'timeUpCorrectIs')}: <span className="text-green-300 font-bold">{getCorrectOptionText(currentQuestion)}</span>
                      </p>
                    </div>
                  )}
                  <div className="flex justify-center mt-2">
                    <div className="flex items-center gap-1 text-white/20 text-[10px]">
                      <ArrowRight className="w-3 h-3" />
                      <span dir="rtl">
                        {currentQuestionIndex + 1 < questions.length
                          ? t(lang, 'nextQuestion') + '...'
                          : t(lang, 'viewResults') + '...'
                        }
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

// ===================== RESULTS PAGE =====================
function ResultsPage() {
  const { lang, participant, correctCount, wrongCount, questions, setView, resetQuiz, setLeaderboard } = useAppStore()
  const [leaderboard, setLocalLeaderboard] = useState<LeaderboardEntry[]>([])
  const totalQuestions = questions.length
  const unanswered = totalQuestions - correctCount - wrongCount
  const score = correctCount * 10
  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0

  useEffect(() => {
    const fetchLB = async () => {
      try {
        const res = await fetch('/api/leaderboard')
        const data = await res.json()
        setLocalLeaderboard(data)
        setLeaderboard(data)
      } catch { /* ignore */ }
    }
    fetchLB()
  }, [setLeaderboard])

  const getMessage = () => {
    if (percentage >= 80) return { text: t(lang, 'excellent'), icon: <PartyPopper className="w-10 h-10 text-yellow-400" />, color: 'text-yellow-300' }
    if (percentage >= 50) return { text: t(lang, 'good'), icon: <ThumbsUp className="w-10 h-10 text-blue-400" />, color: 'text-blue-300' }
    return { text: t(lang, 'tryAgain'), icon: <RotateCcw className="w-10 h-10 text-red-400" />, color: 'text-red-300' }
  }
  const message = getMessage()

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="w-5 h-5 text-yellow-400" />
    if (index === 1) return <Medal className="w-5 h-5 text-gray-300" />
    if (index === 2) return <Medal className="w-5 h-5 text-amber-600" />
    return <span className="text-white/40 text-sm font-bold">{index + 1}</span>
  }

  const handleRetry = () => {
    resetQuiz()
    setView('welcome')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0a0e27] via-[#0d1442] to-[#1a0a2e] relative overflow-hidden">
      <AnimatedBackground />

      <div className="w-full max-w-3xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-white/[0.04] backdrop-blur-xl border-white/10 shadow-2xl overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500" />

            <CardContent className="p-6 space-y-5">
              {/* Header */}
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
                >
                  {message.icon}
                </motion.div>
                <h2 className={`text-2xl font-black mt-2 ${message.color}`} dir="rtl">{t(lang, 'quizComplete')}</h2>
                <p className={`${message.color} text-lg font-bold mt-1`} dir="rtl">{message.text}</p>
              </div>

              {/* Player Info */}
              {participant && (
                <div className="flex items-center justify-center gap-3 bg-white/[0.04] border border-white/[0.08] rounded-xl py-3 px-4" dir="rtl">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center overflow-hidden">
                    {participant.avatar ? (
                      <img src={participant.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white font-bold">{participant.name[0]}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{participant.name}</p>
                    <p className="text-yellow-400/70 text-xs flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400/70" />
                      {score} {t(lang, 'score')}
                    </p>
                  </div>
                </div>
              )}

              {/* Score Grid */}
              <div className="grid grid-cols-3 gap-3" dir="rtl">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-center"
                >
                  <CheckCircle2 className="w-6 h-6 text-green-400 mx-auto mb-1" />
                  <p className="text-green-300 text-2xl font-black">{correctCount}</p>
                  <p className="text-green-300/60 text-[10px]">{t(lang, 'correctAnswers')}</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center"
                >
                  <XCircle className="w-6 h-6 text-red-400 mx-auto mb-1" />
                  <p className="text-red-300 text-2xl font-black">{wrongCount}</p>
                  <p className="text-red-300/60 text-[10px]">{t(lang, 'wrongAnswers')}</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 text-center"
                >
                  <Star className="w-6 h-6 text-yellow-400 fill-yellow-400 mx-auto mb-1" />
                  <p className="text-yellow-300 text-2xl font-black">{score}</p>
                  <p className="text-yellow-300/60 text-[10px]">{t(lang, 'score')}</p>
                </motion.div>
              </div>

              {/* Score Bar */}
              <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-3" dir="rtl">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-white/50 text-xs">{percentage}%</span>
                  <span className="text-white/30 text-[10px]">{correctCount} / {totalQuestions}</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 rounded-full"
                  />
                </div>
              </div>

              {/* TOP Leaderboard */}
              <div>
                <div className="flex items-center gap-2 mb-2" dir="rtl">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span className="text-white/70 text-sm font-bold">{t(lang, 'topList')}</span>
                </div>
                <div className="space-y-1.5">
                  {leaderboard.slice(0, 10).map((entry, i) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.05 }}
                      className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                        participant && entry.id === participant.id
                          ? 'bg-purple-500/15 border border-purple-400/30 shadow-md shadow-purple-500/10'
                          : i === 0
                            ? 'bg-yellow-500/10 border border-yellow-500/20'
                            : i === 1
                              ? 'bg-gray-400/10 border border-gray-400/10'
                              : i === 2
                                ? 'bg-amber-600/10 border border-amber-600/10'
                                : 'bg-white/[0.02] border border-white/5'
                      }`}
                      dir="rtl"
                    >
                      <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                        {getRankIcon(i)}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {entry.avatar ? (
                          <img src={entry.avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-white/60 text-xs font-bold">{entry.name[0]}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-bold truncate ${
                          participant && entry.id === participant.id ? 'text-purple-300' : 'text-white/80'
                        }`}>
                          {entry.name}
                          {participant && entry.id === participant.id && (
                            <span className="text-purple-400/60 text-[9px] mr-1">({t(lang, 'playerName')})</span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-green-400/60" />
                          <span className="text-green-300/60 text-[10px]">{entry.correctCount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-yellow-300 text-xs font-bold">{entry.score}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3" dir="rtl">
                <Button
                  onClick={handleRetry}
                  className="flex-1 bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 hover:from-blue-700 hover:via-purple-700 hover:to-red-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-purple-500/20 transition-all duration-300 hover:scale-[1.02]"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {t(lang, 'retryQuiz')}
                </Button>
                <Button
                  onClick={() => setView('welcome')}
                  variant="outline"
                  className="flex-1 bg-white/5 border-white/10 text-white hover:bg-white/10 py-3 rounded-xl"
                >
                  <HomeIcon className="w-4 h-4 mr-2" />
                  {t(lang, 'backToHome')}
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
  const { lang, isAdminAuth, setIsAdminAuth, setView } = useAppStore()
  const [adminPass, setAdminPass] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [isAuth, setIsAuth] = useState(isAdminAuth)
  const [categories, setCategories] = useState<QuizCategory[]>([])
  const [questions, setQuestions] = useState<QuizQuestion[]>([])

  // Category form
  const [catNameBadini, setCatNameBadini] = useState('')
  const [catNameSorani, setCatNameSorani] = useState('')

  // Question form
  const [qTextBadini, setQTextBadini] = useState('')
  const [qTextSorani, setQTextSorani] = useState('')
  const [qOpt1Badini, setQOpt1Badini] = useState('')
  const [qOpt1Sorani, setQOpt1Sorani] = useState('')
  const [qOpt2Badini, setQOpt2Badini] = useState('')
  const [qOpt2Sorani, setQOpt2Sorani] = useState('')
  const [qOpt3Badini, setQOpt3Badini] = useState('')
  const [qOpt3Sorani, setQOpt3Sorani] = useState('')
  const [qOpt4Badini, setQOpt4Badini] = useState('')
  const [qOpt4Sorani, setQOpt4Sorani] = useState('')
  const [qCorrect, setQCorrect] = useState(1)
  const [qCategory, setQCategory] = useState('')

  const { toast } = useToast()

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      setCategories(data)
      if (data.length > 0 && !qCategory) setQCategory(data[0].id)
    } catch { /* ignore */ }
  }, [qCategory])

  const fetchQuestions = useCallback(async () => {
    try {
      const res = await fetch('/api/questions')
      const data = await res.json()
      setQuestions(data)
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    if (isAuth) {
      fetchCategories()
      fetchQuestions()
    }
  }, [isAuth, fetchCategories, fetchQuestions])

  const handleLogin = async () => {
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPass }),
      })
      if (res.ok) {
        setIsAuth(true)
        setIsAdminAuth(true)
      } else {
        toast({ title: t(lang, 'invalidPassword'), variant: 'destructive' })
      }
    } catch {
      toast({ title: t(lang, 'invalidPassword'), variant: 'destructive' })
    }
  }

  const handleAddCategory = async () => {
    if (!catNameBadini || !catNameSorani) return
    try {
      await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nameBadini: catNameBadini, nameSorani: catNameSorani }),
      })
      setCatNameBadini('')
      setCatNameSorani('')
      fetchCategories()
      toast({ title: '✓' })
    } catch {
      toast({ title: 'Error', variant: 'destructive' })
    }
  }

  const handleDeleteCategory = async (id: string) => {
    try {
      await fetch(`/api/categories?id=${id}`, { method: 'DELETE' })
      fetchCategories()
      fetchQuestions()
    } catch { /* ignore */ }
  }

  const handleAddQuestion = async () => {
    if (!qTextBadini || !qTextSorani || !qCategory) return
    try {
      await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          textBadini: qTextBadini, textSorani: qTextSorani,
          option1Badini: qOpt1Badini, option1Sorani: qOpt1Sorani,
          option2Badini: qOpt2Badini, option2Sorani: qOpt2Sorani,
          option3Badini: qOpt3Badini, option3Sorani: qOpt3Sorani,
          option4Badini: qOpt4Badini, option4Sorani: qOpt4Sorani,
          correctAnswer: qCorrect, categoryId: qCategory,
        }),
      })
      setQTextBadini(''); setQTextSorani('')
      setQOpt1Badini(''); setQOpt1Sorani('')
      setQOpt2Badini(''); setQOpt2Sorani('')
      setQOpt3Badini(''); setQOpt3Sorani('')
      setQOpt4Badini(''); setQOpt4Sorani('')
      setQCorrect(1)
      fetchQuestions()
      toast({ title: '✓' })
    } catch {
      toast({ title: 'Error', variant: 'destructive' })
    }
  }

  const handleDeleteQuestion = async (id: string) => {
    try {
      await fetch(`/api/questions?id=${id}`, { method: 'DELETE' })
      fetchQuestions()
    } catch { /* ignore */ }
  }

  const getOptionText = (q: QuizQuestion, index: number) => {
    const key = `option${index}${lang === 'badini' ? 'Badini' : 'Sorani'}` as keyof QuizQuestion
    return q[key] as string
  }

  // Login form
  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0a0e27] via-[#0d1442] to-[#1a0a2e] relative overflow-hidden">
        <AnimatedBackground />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md relative z-10"
        >
          <Card className="bg-white/[0.04] backdrop-blur-xl border-white/10 shadow-2xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-orange-500 to-red-500" />
            <CardContent className="p-6 space-y-4">
              <div className="text-center">
                <Shield className="w-12 h-12 text-orange-400 mx-auto mb-2" />
                <h2 className="text-white text-xl font-bold" dir="rtl">{t(lang, 'adminPanel')}</h2>
              </div>
              <div className="space-y-2">
                <Label className="text-white/60 text-sm" dir="rtl">{t(lang, 'adminPassword')}</Label>
                <div className="relative">
                  <Input
                    type={showPass ? 'text' : 'password'}
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-orange-400/50 rounded-xl h-11 pr-3 pl-10"
                    placeholder={t(lang, 'enterAdminPass')}
                    dir="ltr"
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  />
                  <button
                    onClick={() => setShowPass(!showPass)}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                    type="button"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleLogin}
                  className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold rounded-xl"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  {t(lang, 'login')}
                </Button>
                <Button
                  onClick={() => setView('welcome')}
                  variant="outline"
                  className="bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-xl"
                >
                  <HomeIcon className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  // Admin panel
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#0d1442] to-[#1a0a2e] relative overflow-hidden">
      <AnimatedBackground />

      {/* Top Bar */}
      <div className="relative z-10 flex items-center justify-between p-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-2" dir="rtl">
          <Shield className="w-5 h-5 text-orange-400" />
          <span className="text-white/80 font-bold text-sm">{t(lang, 'adminPanel')}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => { setIsAuth(false); setIsAdminAuth(false) }}
            variant="outline"
            size="sm"
            className="bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-full px-3 h-8 text-xs"
          >
            <LogOut className="w-3 h-3 mr-1" />
            {t(lang, 'logout')}
          </Button>
          <Button
            onClick={() => setView('welcome')}
            variant="outline"
            size="sm"
            className="bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-full px-3 h-8 text-xs"
          >
            <HomeIcon className="w-3 h-3 mr-1" />
            {t(lang, 'backToHome')}
          </Button>
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 pb-8">
        <Tabs defaultValue="categories" className="w-full">
          <TabsList className="bg-white/5 border border-white/10 w-full grid grid-cols-2 rounded-xl h-10">
            <TabsTrigger value="categories" className="text-white/60 data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-lg text-xs" dir="rtl">
              {t(lang, 'manageCategories')}
            </TabsTrigger>
            <TabsTrigger value="questions" className="text-white/60 data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-lg text-xs" dir="rtl">
              {t(lang, 'manageQuestions')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="categories" className="mt-4 space-y-4">
            {/* Add Category */}
            <Card className="bg-white/[0.04] backdrop-blur-xl border-white/10">
              <CardContent className="p-4 space-y-3">
                <h3 className="text-white/80 text-sm font-bold" dir="rtl">{t(lang, 'addCategory')}</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-white/50 text-[11px]">{t(lang, 'categoryNameBadini')}</Label>
                    <Input value={catNameBadini} onChange={(e) => setCatNameBadini(e.target.value)} className="bg-white/5 border-white/10 text-white rounded-xl h-9 text-sm" dir="rtl" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-white/50 text-[11px]">{t(lang, 'categoryNameSorani')}</Label>
                    <Input value={catNameSorani} onChange={(e) => setCatNameSorani(e.target.value)} className="bg-white/5 border-white/10 text-white rounded-xl h-9 text-sm" dir="rtl" />
                  </div>
                </div>
                <Button onClick={handleAddCategory} disabled={!catNameBadini || !catNameSorani} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-xs py-2 disabled:opacity-40">
                  <Plus className="w-3 h-3 mr-1" />
                  {t(lang, 'addCategory')}
                </Button>
              </CardContent>
            </Card>

            {/* Categories List */}
            <div className="space-y-2">
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between bg-white/[0.03] border border-white/[0.08] rounded-xl p-3" dir="rtl">
                  <div>
                    <p className="text-white/80 text-sm font-bold">{cat.nameBadini}</p>
                    <p className="text-white/40 text-xs">{cat.nameSorani}</p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-red-400/60 hover:text-red-400 hover:bg-red-500/10 h-7 w-7 p-0">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-[#1a1a3e] border-white/10">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white" dir="rtl">دڵنیای؟</AlertDialogTitle>
                        <AlertDialogDescription className="text-white/50" dir="rtl">ئەم جۆرە و تەڤایەتی پرسیارێن وی ژێدچن</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-white/5 border-white/10 text-white">نەخێر</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteCategory(cat.id)} className="bg-red-600 text-white">بەلێ</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="questions" className="mt-4 space-y-4">
            {/* Add Question */}
            <Card className="bg-white/[0.04] backdrop-blur-xl border-white/10">
              <CardContent className="p-4 space-y-3">
                <h3 className="text-white/80 text-sm font-bold" dir="rtl">{t(lang, 'addQuestion')}</h3>

                <div className="space-y-1">
                  <Label className="text-white/50 text-[11px]">{t(lang, 'category')}</Label>
                  <Select value={qCategory} onValueChange={setQCategory}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl h-9 text-sm" dir="rtl">
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

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-white/50 text-[11px]">{t(lang, 'questionTextBadini')}</Label>
                    <Input value={qTextBadini} onChange={(e) => setQTextBadini(e.target.value)} className="bg-white/5 border-white/10 text-white rounded-xl h-9 text-sm" dir="rtl" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-white/50 text-[11px]">{t(lang, 'questionTextSorani')}</Label>
                    <Input value={qTextSorani} onChange={(e) => setQTextSorani(e.target.value)} className="bg-white/5 border-white/10 text-white rounded-xl h-9 text-sm" dir="rtl" />
                  </div>
                </div>

                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="grid grid-cols-3 gap-2 items-end">
                    <div className="col-span-1 space-y-1">
                      <Label className="text-white/50 text-[10px]">{t(lang, 'option')} {i} (بادینی)</Label>
                      <Input
                        value={i === 1 ? qOpt1Badini : i === 2 ? qOpt2Badini : i === 3 ? qOpt3Badini : qOpt4Badini}
                        onChange={(e) => {
                          if (i === 1) setQOpt1Badini(e.target.value)
                          else if (i === 2) setQOpt2Badini(e.target.value)
                          else if (i === 3) setQOpt3Badini(e.target.value)
                          else setQOpt4Badini(e.target.value)
                        }}
                        className="bg-white/5 border-white/10 text-white rounded-xl h-9 text-sm"
                        dir="rtl"
                      />
                    </div>
                    <div className="col-span-1 space-y-1">
                      <Label className="text-white/50 text-[10px]">{t(lang, 'option')} {i} (سورانی)</Label>
                      <Input
                        value={i === 1 ? qOpt1Sorani : i === 2 ? qOpt2Sorani : i === 3 ? qOpt3Sorani : qOpt4Sorani}
                        onChange={(e) => {
                          if (i === 1) setQOpt1Sorani(e.target.value)
                          else if (i === 2) setQOpt2Sorani(e.target.value)
                          else if (i === 3) setQOpt3Sorani(e.target.value)
                          else setQOpt4Sorani(e.target.value)
                        }}
                        className="bg-white/5 border-white/10 text-white rounded-xl h-9 text-sm"
                        dir="rtl"
                      />
                    </div>
                    <div className="flex items-center justify-center">
                      <label className="flex items-center gap-1.5 cursor-pointer" dir="rtl">
                        <input
                          type="radio"
                          name="correctAnswer"
                          checked={qCorrect === i}
                          onChange={() => setQCorrect(i)}
                          className="accent-green-500 w-3.5 h-3.5"
                        />
                        <span className="text-white/40 text-[10px]">{t(lang, 'correctOption')}</span>
                      </label>
                    </div>
                  </div>
                ))}

                <Button onClick={handleAddQuestion} disabled={!qTextBadini || !qTextSorani || !qCategory} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-xs py-2 disabled:opacity-40">
                  <Plus className="w-3 h-3 mr-1" />
                  {t(lang, 'addQuestion')}
                </Button>
              </CardContent>
            </Card>

            {/* Questions List */}
            <div className="space-y-2">
              {questions.map((q, idx) => (
                <div key={q.id} className="flex items-start gap-3 bg-white/[0.03] border border-white/[0.08] rounded-xl p-3" dir="rtl">
                  <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-300">{idx + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-blue-500/10 text-blue-300/70 border-blue-500/15 text-[8px] px-1.5 py-0">
                        {lang === 'badini' ? q.category.nameBadini : q.category.nameSorani}
                      </Badge>
                    </div>
                    <p className="text-white/70 text-xs">{lang === 'badini' ? q.textBadini : q.textSorani}</p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-red-400/60 hover:text-red-400 hover:bg-red-500/10 h-7 w-7 p-0 flex-shrink-0">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-[#1a1a3e] border-white/10">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white" dir="rtl">دڵنیای؟</AlertDialogTitle>
                        <AlertDialogDescription className="text-white/50" dir="rtl">ئەم پرسیارە ژێدچت</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-white/5 border-white/10 text-white">نەخێر</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteQuestion(q.id)} className="bg-red-600 text-white">بەلێ</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// ===================== MAIN APP =====================
export default function App() {
  const view = useAppStore((s) => s.view)

  return (
    <AnimatePresence mode="wait">
      {view === 'welcome' && <WelcomePage key="welcome" />}
      {view === 'quiz' && <QuizPage key="quiz" />}
      {view === 'results' && <ResultsPage key="results" />}
      {view === 'admin' && <AdminPage key="admin" />}
    </AnimatePresence>
  )
}
