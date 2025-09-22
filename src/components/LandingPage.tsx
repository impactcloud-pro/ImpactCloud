import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Logo } from './Logo';
import { DemoModal } from './DemoModal';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { toast } from 'sonner';
import {
  BarChart3,
  Users,
  Target,
  Shield,
  Zap,
  CheckCircle,
  Star,
  ArrowRight,
  Globe,
  Award,
  Heart,
  PieChart,
  FileText,
  Phone,
  Mail,
  MessageCircle,
  ChevronUp,
  Play,
  Sparkles,
  Pause,
  Volume2,
  Maximize,
  SkipBack,
  SkipForward,
  Home,
  Settings,
  HelpCircle,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  TrendingUp,
  Activity
} from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
  onRegisterOrganization: () => void;
}

export function LandingPage({ onLogin, onRegisterOrganization }: LandingPageProps) {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [showDemoSection, setShowDemoSection] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(300); // 5 minutes placeholder
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    organization: '',
    message: ''
  });
  const [animatedStats, setAnimatedStats] = useState({
    organizations: 0,
    beneficiaries: 0,
    responses: 0,
    satisfaction: 0
  });

  // Handle scroll to show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 6);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Scroll to section function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Navigate to home function (for logo click)
  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Animate stats when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateStats();
          }
        });
      },
      { threshold: 0.5 }
    );

    const statsSection = document.getElementById('stats-section');
    if (statsSection) {
      observer.observe(statsSection);
    }

    return () => observer.disconnect();
  }, []);

  const animateStats = () => {
    const targets = {
      organizations: 500,
      beneficiaries: 100000,
      responses: 1000000,
      satisfaction: 98
    };

    Object.keys(targets).forEach((key) => {
      const target = targets[key as keyof typeof targets];
      let current = 0;
      const increment = target / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setAnimatedStats(prev => ({
          ...prev,
          [key]: Math.floor(current)
        }));
      }, 3);
    });
  };

  // Video control effects
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isVideoPlaying) {
      timer = setInterval(() => {
        setVideoCurrentTime(prev => {
          if (prev >= videoDuration) {
            setIsVideoPlaying(false);
            return videoDuration;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isVideoPlaying, videoDuration]);

  // Handle fullscreen escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const handleDemoClick = () => {
    if (!showDemoSection) {
      setShowDemoSection(true);
      // Scroll to demo section
      setTimeout(() => {
        document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStartDemo = () => {
    setIsDemoModalOpen(false);
    onLogin(); // يمكن تخصيص هذا للذهاب لعرض توضيحي خاص
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('تم إرسال طلبك بنجاح! سنتواصل معكم قريباً');
    setIsContactModalOpen(false);
    setContactForm({
      name: '',
      email: '',
      organization: '',
      message: ''
    });
  };

  const handlePlayPause = () => {
    setIsVideoPlaying(!isVideoPlaying);
  };

  const handleSeek = (time: number) => {
    setVideoCurrentTime(time);
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
  };

  // Handle external links
  const handleExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const features = [
    { 
      icon: BarChart3, 
      title: 'تحليلات ذكية', 
      description: 'تحليلات متقدمة مدعومة بالذكاء الاصطناعي لفهم أعمق للأثر الاجتماعي',
      color: '#183259'
    },
    { 
      icon: Users, 
      title: 'إدارة المستفيدين', 
      description: 'نظام شامل لإدارة وتتبع المستفيدين والتفاعل معهم بفعالية',
      color: '#2a4a7a'
    },
    { 
      icon: FileText, 
      title: 'استبيانات ذكية', 
      description: 'أدوات إنشاء الاستبيانات بالذكاء الاصطناعي مع تخصيص كامل',
      color: '#4a6ba3'
    },
    { 
      icon: Target, 
      title: 'قياس الأثر', 
      description: 'مؤشرات دقيقة لقياس الأثر الاجتماعي والاقتصادي والبيئي',
      color: '#6b85cc'
    },
    { 
      icon: PieChart, 
      title: 'تقارير تفاعلية', 
      description: 'تقارير مرئية تفاعلية لعرض النتائج بوضوح ومشاركتها بسهولة',
      color: '#8da4c7'
    },
    { 
      icon: Shield, 
      title: 'أمان وحماية', 
      description: 'أعلى مستويات الأمان لحماية بيانات المستفيدين والمنظمات',
      color: '#183259'
    }
  ];

  // Mini Dashboard Component
  const MiniDashboard = () => {
    return (
      <motion.div
        className="absolute top-8 right-8 z-30"
        initial={{ opacity: 0, scale: 0.8, x: 50 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
      >
        <motion.div
          className="relative bg-gradient-to-br from-white/90 via-blue-50/80 to-[#18325a]/20 backdrop-blur-lg border border-white/40 rounded-3xl p-6 shadow-2xl shadow-[#18325a]/20 max-w-xs"
          style={{
            background: `
              radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.9) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(147, 197, 253, 0.6) 0%, transparent 50%),
              linear-gradient(135deg, rgba(24, 50, 90, 0.1) 0%, rgba(147, 197, 253, 0.2) 50%, rgba(255, 255, 255, 0.8) 100%)
            `
          }}
        >
          {/* Curved decorative element */}
          <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-blue-200/60 to-[#18325a]/30 rounded-full blur-lg"></div>
          <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-gradient-to-tr from-white/80 to-blue-100/60 rounded-full blur-md"></div>
          
          {/* Curved top border accent */}
          <div className="absolute top-0 left-4 right-4 h-1 bg-gradient-to-r from-transparent via-[#18325a]/40 to-transparent rounded-full"></div>
          
          {/* Dashboard Header */}
          <div className="flex items-center justify-center gap-2 mb-4 relative z-10">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="p-1.5 bg-gradient-to-br from-[#18325a] to-blue-600 rounded-full shadow-lg"
            >
              <Activity className="w-4 h-4 text-white" />
            </motion.div>
            <span className="text-sm text-[#18325a] font-bold bg-white/60 px-2 py-1 rounded-full backdrop-blur-sm">
              لوحة تحليل البيانات
            </span>
          </div>

          {/* Charts Container with curved layout */}
          <div className="grid grid-cols-3 gap-3 mb-4 relative z-10">
            {/* Mini Pie Chart */}
            <div className="flex items-center justify-center">
              <motion.div
                className="relative w-10 h-10 p-1 bg-white/60 rounded-full shadow-inner"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
              >
                <svg viewBox="0 0 32 32" className="w-full h-full">
                  <circle
                    cx="16"
                    cy="16"
                    r="12"
                    fill="none"
                    stroke="rgba(24, 50, 90, 0.2)"
                    strokeWidth="2"
                  />
                  <motion.circle
                    cx="16"
                    cy="16"
                    r="12"
                    fill="none"
                    stroke="url(#pieGradient)"
                    strokeWidth="2"
                    strokeDasharray="28 47"
                    strokeDashoffset="0"
                    animate={{ strokeDashoffset: [0, 75] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <defs>
                    <linearGradient id="pieGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#18325a" />
                      <stop offset="50%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#93c5fd" />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>
            </div>

            {/* Mini Bar Chart with curve */}
            <div className="flex items-end justify-center gap-1 h-10 bg-white/40 rounded-xl p-1">
              {[65, 85, 45, 95].map((height, index) => (
                <motion.div
                  key={index}
                  className="w-1.5 rounded-full shadow-sm"
                  style={{
                    background: `linear-gradient(to top, 
                      ${index % 2 === 0 ? '#18325a' : '#3b82f6'} 0%, 
                      ${index % 2 === 0 ? '#3b82f6' : '#93c5fd'} 100%)`
                  }}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ 
                    delay: index * 0.4,
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>

            {/* Mini Line Chart with curved path */}
            <div className="flex items-center justify-center bg-white/40 rounded-xl p-1">
              <svg viewBox="0 0 28 20" className="w-7 h-5">
                <motion.path
                  d="M 2 16 Q 8 6, 14 12 T 26 4"
                  fill="none"
                  stroke="url(#lineGradient)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ 
                    duration: 6,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                />
                {/* Glowing data points */}
                {[{x: 2, y: 16}, {x: 14, y: 12}, {x: 26, y: 4}].map((point, index) => (
                  <motion.circle
                    key={index}
                    cx={point.x}
                    cy={point.y}
                    r="1.5"
                    fill="white"
                    stroke="url(#lineGradient)"
                    strokeWidth="1"
                    animate={{ 
                      scale: [1, 1.4, 1],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{ 
                      delay: index * 0.8,
                      duration: 4,
                      repeat: Infinity
                    }}
                  />
                ))}
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#18325a" />
                    <stop offset="50%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#93c5fd" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Dashboard Stats with curved containers */}
          <div className="grid grid-cols-2 gap-3 text-xs relative z-10">
            <motion.div 
              className="text-center p-2 bg-gradient-to-br from-white/80 to-blue-50/60 rounded-2xl shadow-sm border border-white/40"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 6, repeat: Infinity, delay: 1 }}
            >
              <div className="text-[#18325a]/70 text-xs">المنظمات</div>
              <motion.div 
                className="text-[#18325a] font-bold text-sm bg-gradient-to-r from-[#18325a] to-blue-600 bg-clip-text text-transparent"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                500+
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="text-center p-2 bg-gradient-to-br from-blue-50/60 to-white/80 rounded-2xl shadow-sm border border-blue-200/40"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 6, repeat: Infinity, delay: 3 }}
            >
              <div className="text-blue-600/70 text-xs">التحليلات</div>
              <motion.div 
                className="text-blue-600 font-bold text-sm bg-gradient-to-r from-blue-600 to-[#18325a] bg-clip-text text-transparent"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              >
                100K+
              </motion.div>
            </motion.div>
          </div>

          {/* Floating decorative particles */}
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-blue-200 to-white rounded-full opacity-80"
            animate={{ 
              scale: [0, 1.2, 0],
              x: [0, 15, 0],
              y: [0, -8, 0],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute -bottom-1 -left-1 w-2 h-2 bg-gradient-to-tr from-[#18325a]/60 to-blue-300 rounded-full opacity-70"
            animate={{ 
              scale: [0, 1, 0],
              x: [0, -12, 0],
              y: [0, 8, 0],
              rotate: [0, -180, -360]
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4
            }}
          />
          
          {/* Additional curved accent */}
          <motion.div
            className="absolute top-2 right-2 w-8 h-8 border-2 border-white/30 rounded-full"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 arabic-text" dir="rtl">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50 bg-[rgba(255,255,255,0.95)]">
        <div className="container mx-auto px-6 py-1 bg-[rgba(255,255,255,0)]">
          <div className="flex items-center justify-between">
            {/* Logo - Clickable */}
            <Logo 
              onClick={handleLogoClick}
              size="lg"
              showText={true}
              variant="dark"
            />

            {/* Navigation Menu */}
            <nav className="hidden md:flex items-center gap-6 text-gray-700">
              <button 
                onClick={() => scrollToSection('features')}
                className="hover:text-[#18325a] transition-colors"
              >
                المميزات
              </button>
              <button 
                onClick={() => scrollToSection('stats-section')}
                className="hover:text-[#18325a] transition-colors"
              >
                إحصائياتنا
              </button>
              <button 
                onClick={() => setIsContactModalOpen(true)}
                className="text-gray-700 hover:text-[#18325a] transition-colors"
              >
                تواصل معنا
              </button>
            </nav>

            {/* Login and Register Buttons */}
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={onRegisterOrganization} 
                className="border-[#18325a] text-[#18325a] hover:bg-[#18325a] hover:text-white transition-colors"
              >
                تسجيل منظمة
              </Button>
              <Button variant="ghost" onClick={onLogin} className="hover:text-[#18325a]">
                تسجيل الدخول
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - RTL Fixed */}
      <motion.section 
        className="pt-20 pb-16 bg-gradient-to-br from-[#18325a] via-[#18325a] to-[#2a4a7a] relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 180, 360] 
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-16 h-16 bg-blue-200/20 rounded-full"
          animate={{ 
            y: [0, 20, 0],
            x: [0, 10, 0] 
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        />
        
        <div className="container mx-auto px-6 py-16 text-center relative z-10">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-center"
          >
            <div className="mb-6">
              <MiniDashboard />
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-5xl font-bold text-white mb-6 leading-tight text-center"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            قس أثرك الاجتماعي
            <br />
            <motion.span 
              className="text-blue-200"
              animate={{ 
                textShadow: [
                  "0 0 0px rgba(59, 130, 246, 0.5)",
                  "0 0 20px rgba(59, 130, 246, 0.8)",
                  "0 0 0px rgba(59, 130, 246, 0.5)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              بطريقة ذكية ومبتكرة
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed text-center"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            نظام سحابي لإدارة وقياس الأثر يربط مصادر البيانات بلوحة مؤشرات الأثر التفاعلية
          </motion.p>
          
          <motion.div 
            className="flex items-center justify-center gap-4 mb-12"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg" 
                onClick={onLogin}
                className="bg-white text-[#18325a] hover:bg-gray-100 text-lg px-8 py-3 relative overflow-hidden group"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity"
                  animate={{ x: [-100, 100] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span>ابدأ مجاناً الآن</span>
                <motion.div
                  animate={{ x: [0, -5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="inline-flex mr-2"
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="outline" 
                size="lg"
                onClick={handleDemoClick}
                className="border-white text-white hover:bg-white hover:text-[#18325a] text-lg px-8 py-3 bg-white/10 backdrop-blur-sm border-2 group"
              >
                <motion.div
                  className="flex items-center gap-2"
                  whileHover={{ x: -5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <span>مشاهدة العرض التوضيحي</span>
                  <Play className="w-5 h-5" />
                </motion.div>
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="flex items-center justify-center gap-8 text-white/80"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            {[
              { icon: CheckCircle, text: "مجاني لمدة 30 يوم" },
              { icon: Shield, text: "آمن ومعتمد" },
              { icon: Zap, text: "إعداد في دقائق" }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="flex flex-col items-center gap-2 text-center"
                whileHover={{ scale: 1.1, y: -2 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 360] 
                  }}
                  transition={{ 
                    duration: 3 + index,
                    repeat: Infinity,
                    ease: "linear" 
                  }}
                  className="inline-flex"
                >
                  <item.icon className="w-5 h-5" />
                </motion.div>
                <span className="text-sm">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <section id="stats-section" className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-12"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">
              أرقام تتحدث عن نفسها
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto text-center">
              منصة أثرنا تخدم مئات المنظمات حول العالم وتساعد في قياس الأثر لملايين المستفيدين
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                number: formatNumber(animatedStats.organizations),
                label: "منظمة تستخدم المنصة",
                suffix: "+",
                icon: Home,
                color: "text-[#18325a]"
              },
              {
                number: formatNumber(animatedStats.beneficiaries),
                label: "مستفيد تم قياس أثرهم",
                suffix: "+",
                icon: Users,
                color: "text-[#18325a]"
              },
              {
                number: formatNumber(animatedStats.responses),
                label: "استجابة تم جمعها",
                suffix: "+",
                icon: FileText,
                color: "text-[#18325a]"
              },
              {
                number: animatedStats.satisfaction,
                label: "معدل رضا العملاء",
                suffix: "%",
                icon: Heart,
                color: "text-[#18325a]"
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center justify-center text-center"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
              >
                <div className={`w-16 h-16 bg-[#18325a]/10 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <stat.icon className={`h-8 w-8 ${stat.color} mx-auto`} />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2 text-center">
                  {stat.number}{stat.suffix}
                </div>
                <div className="text-gray-600 text-center">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">
              مميزات تجعلنا الخيار الأول
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto text-center">
              اكتشف كيف تساعد أثرنا المنظمات في تحقيق أهدافها وقياس أثرها الاجتماعي بطريقة علمية ومبتكرة
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 text-center ${
                  activeFeature === index 
                    ? 'border-[#18325a] bg-gradient-to-br from-[#18325a]/5 to-[#2a4a7a]/5 shadow-lg scale-105' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                whileHover={{ y: -5 }}
                onClick={() => setActiveFeature(index)}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto ${
                  activeFeature === index ? 'bg-[#18325a]' : 'bg-gray-100'
                } transition-colors`}>
                  <feature.icon className={`h-6 w-6 ${
                    activeFeature === index ? 'text-white' : 'text-gray-600'
                  }`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-center">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <AnimatePresence>
        {showDemoSection && (
          <motion.section 
            id="demo-section"
            className="py-20 bg-gray-50 border-t"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <div className="container mx-auto px-6">
              <motion.div 
                className="text-center mb-12"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">
                  شاهد أثرنا في العمل
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto text-center">
                  جولة تفاعلية شاملة لاكتشاف كيف تساعد منصة أثرنا في قياس وتحليل الأثر الاجتماعي
                </p>
              </motion.div>

              <motion.div 
                className={`max-w-5xl mx-auto bg-gray-900 rounded-2xl overflow-hidden shadow-2xl ${
                  isFullscreen ? 'fixed inset-4 z-50 max-w-none' : ''
                }`}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                {/* Video Player */}
                <div className="relative aspect-video bg-gradient-to-br from-[#18325a] to-[#2a4a7a] flex items-center justify-center">
                  {/* Video Placeholder */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#18325a]/90 to-[#2a4a7a]/90 flex flex-col items-center justify-center text-white">
                    <motion.div
                      className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6 cursor-pointer hover:bg-white/30 transition-colors"
                      onClick={handlePlayPause}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      animate={isVideoPlaying ? { rotate: [0, 360] } : {}}
                      transition={{ duration: 2, repeat: isVideoPlaying ? Infinity : 0 }}
                    >
                      {isVideoPlaying ? (
                        <Pause className="w-8 h-8" />
                      ) : (
                        <Play className="w-8 h-8 mr-1" />
                      )}
                    </motion.div>

                    <h3 className="text-2xl font-bold mb-2 text-center">عرض توضيحي تفاعلي</h3>
                    <p className="text-blue-200 text-center max-w-md">
                      اكتشف كيف تعمل منصة أثرنا من خلال هذا العرض التوضيحي التفاعلي
                    </p>

                    {/* Animated Demo Elements */}
                    {isVideoPlaying && (
                      <motion.div 
                        className="absolute inset-0 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                      >
                        {/* Dashboard Preview */}
                        <motion.div 
                          className="absolute top-8 left-8 w-64 h-40 bg-white/10 backdrop-blur-sm rounded-lg p-4"
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 3, repeat: Infinity }}
                        >
                          <div className="flex items-center gap-2 mb-3 text-right">
                            <span className="text-sm">لوحة التحكم</span>
                            <BarChart3 className="w-4 h-4" />
                          </div>
                          <div className="space-y-2">
                            <div className="h-2 bg-white/30 rounded w-full"></div>
                            <div className="h-2 bg-white/30 rounded w-3/4"></div>
                            <div className="h-2 bg-white/30 rounded w-1/2"></div>
                          </div>
                        </motion.div>

                        {/* Survey Builder */}
                        <motion.div 
                          className="absolute top-8 right-8 w-64 h-40 bg-white/10 backdrop-blur-sm rounded-lg p-4"
                          animate={{ y: [0, 10, 0] }}
                          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                        >
                          <div className="flex items-center gap-2 mb-3 text-right">
                            <span className="text-sm">منشئ الاستبيانات</span>
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="space-y-2">
                            <div className="h-2 bg-white/30 rounded w-full"></div>
                            <div className="h-2 bg-white/30 rounded w-2/3"></div>
                            <div className="h-2 bg-white/30 rounded w-4/5"></div>
                          </div>
                        </motion.div>

                        {/* Analytics */}
                        <motion.div 
                          className="absolute bottom-8 left-8 w-64 h-40 bg-white/10 backdrop-blur-sm rounded-lg p-4"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 4, repeat: Infinity, delay: 2 }}
                        >
                          <div className="flex items-center gap-2 mb-3 text-right">
                            <span className="text-sm">التحليلات الذكية</span>
                            <PieChart className="w-4 h-4" />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="h-8 bg-white/30 rounded"></div>
                            <div className="h-8 bg-white/30 rounded"></div>
                            <div className="h-8 bg-white/30 rounded col-span-2"></div>
                          </div>
                        </motion.div>

                        {/* Reports */}
                        <motion.div 
                          className="absolute bottom-8 right-8 w-64 h-40 bg-white/10 backdrop-blur-sm rounded-lg p-4"
                          animate={{ rotate: [0, 2, -2, 0] }}
                          transition={{ duration: 5, repeat: Infinity, delay: 3 }}
                        >
                          <div className="flex items-center gap-2 mb-3 text-right">
                            <span className="text-sm">التقارير التفاعلية</span>
                            <Target className="w-4 h-4" />
                          </div>
                          <div className="space-y-2">
                            <div className="h-3 bg-white/30 rounded w-full"></div>
                            <div className="h-3 bg-white/30 rounded w-5/6"></div>
                            <div className="h-3 bg-white/30 rounded w-3/4"></div>
                            <div className="h-3 bg-white/30 rounded w-2/3"></div>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </div>

                  {/* Fullscreen Button */}
                  <button
                    onClick={handleFullscreen}
                    className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-lg flex items-center justify-center text-white transition-colors z-10"
                  >
                    <Maximize className="w-5 h-5" />
                  </button>
                </div>

                {/* Video Controls */}
                <div className="bg-gray-800 p-4">
                  <div className="flex items-center gap-4">
                    {/* Play/Pause Button */}
                    <button
                      onClick={handlePlayPause}
                      className="w-10 h-10 bg-[#18325a] hover:bg-[#2a4a7a] rounded-lg flex items-center justify-center text-white transition-colors"
                    >
                      {isVideoPlaying ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5" />
                      )}
                    </button>

                    {/* Skip Buttons */}
                    <button
                      onClick={() => handleSeek(Math.max(0, videoCurrentTime - 10))}
                      className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center text-white transition-colors"
                    >
                      <SkipBack className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleSeek(Math.min(videoDuration, videoCurrentTime + 10))}
                      className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center text-white transition-colors"
                    >
                      <SkipForward className="w-4 h-4" />
                    </button>

                    {/* Progress Bar */}
                    <div className="flex-1 bg-gray-700 rounded-full h-2 relative">
                      <div 
                        className="bg-[#18325a] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(videoCurrentTime / videoDuration) * 100}%` }}
                      />
                      <input
                        type="range"
                        min="0"
                        max={videoDuration}
                        value={videoCurrentTime}
                        onChange={(e) => handleSeek(parseInt(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>

                    {/* Time Display */}
                    <div className="text-white text-sm">
                      {formatTime(videoCurrentTime)} / {formatTime(videoDuration)}
                    </div>

                    {/* Volume and Fullscreen */}
                    <button className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center text-white transition-colors">
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Call to Action */}
              <motion.div
                className="text-center mt-8"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <Button 
                  onClick={onLogin}
                  className="bg-[#18325a] hover:bg-[#2a4a7a] text-lg px-8 py-3"
                >
                  ابدأ الآن مجاناً
                  <ArrowRight className="w-5 h-5 mr-2" />
                </Button>
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-[#18325a] to-[#2a4a7a] text-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">
              ابدأ رحلتك في قياس الأثر الاجتماعي اليوم
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              انضم إلى مئات المنظمات التي تقيس أثرها وتحسن خدماتها باستخدام أثرنا
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg"
                  onClick={onLogin}
                  className="bg-white text-[#18325a] hover:bg-gray-100 text-lg px-8 py-3"
                >
                  <span>ابدأ مجاناً الآن</span>
                  <ArrowRight className="w-5 h-5 mr-2" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={() => setIsContactModalOpen(true)}
                  className="border-white text-white hover:bg-white hover:text-[#18325a] text-lg px-8 py-3 bg-transparent"
                >
                  <span>تواصل معنا</span>
                  <MessageCircle className="w-5 h-5 mr-2" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer - Centered Design */}
      <footer className="bg-[#18325a] text-white py-16">
        <div className="container mx-auto px-6">
          <div className="text-center">
            {/* Logo */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <Logo 
                onClick={handleLogoClick}
                size="lg"
                showText={true}
                variant="light"
                className="mx-auto"
              />
              <p className="text-blue-200 max-w-2xl mx-auto mt-4 leading-relaxed text-center">
                نساعد المنظمات في قياس وتحليل أثرها الاجتماعي باستخدام أحدث التقنيات والذكاء الاصطناعي
              </p>
            </motion.div>

            {/* Navigation Links Grid */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-8 mb-12 text-right"
            >
              {/* Navigation */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4 text-right">التنقل</h4>
                <ul className="space-y-2">
                  <li>
                    <button 
                      onClick={() => scrollToSection('features')}
                      className="hover:text-blue-200 transition-colors"
                    >
                      المميزات
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => scrollToSection('stats-section')}
                      className="hover:text-blue-200 transition-colors"
                    >
                      إحصائياتنا
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={handleDemoClick}
                      className="hover:text-blue-200 transition-colors"
                    >
                      العرض التوضيحي
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={onLogin}
                      className="hover:text-blue-200 transition-colors"
                    >
                      تسجيل الدخول
                    </button>
                  </li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4 text-right">الدعم</h4>
                <ul className="space-y-2 text-right">
                  <li>
                    <button 
                      onClick={() => setIsContactModalOpen(true)}
                      className="hover:text-blue-200 transition-colors"
                    >
                      تواصل معنا
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => handleExternalLink('https://help.atharonaa.com')}
                      className="hover:text-blue-200 transition-colors"
                    >
                      مركز المساعدة
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => handleExternalLink('https://docs.atharonaa.com')}
                      className="hover:text-blue-200 transition-colors"
                    >
                      الوثائق
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => handleExternalLink('https://status.atharonaa.com')}
                      className="hover:text-blue-200 transition-colors"
                    >
                      حالة النظام
                    </button>
                  </li>
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4 text-right">معلومات التواصل</h4>
                <ul className="space-y-3 text-right">
                  <li className="flex items-center gap-3 justify-start">
                    <Mail className="w-4 h-4" />
                    <span>support@atharonaa.com</span>
                  </li>
                  <li className="flex items-center gap-3 justify-start">
                    <Phone className="w-4 h-4" />
                    <span>+966 11 234 5678</span>
                  </li>
                  <li className="flex items-center gap-3 justify-start">
                    <Globe className="w-4 h-4" />
                    <span>الرياض، المملكة العربية السعودية</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Social Media and Bottom Links */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="border-t border-white/20 pt-8"
            >
              {/* Social Media Links */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <button 
                  onClick={() => handleExternalLink('https://facebook.com/atharonaa')}
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleExternalLink('https://twitter.com/atharonaa')}
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleExternalLink('https://linkedin.com/company/atharonaa')}
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleExternalLink('https://instagram.com/atharonaa')}
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </button>
              </div>

              {/* Legal Links and Copyright */}
              <div className="flex flex-col items-center gap-4 text-sm text-blue-200">
                <div className="flex items-center justify-center gap-6">
                  <button 
                    onClick={() => handleExternalLink('https://atharonaa.com/privacy')}
                    className="hover:text-white transition-colors"
                  >
                    سياسة الخصوصية
                  </button>
                  <button 
                    onClick={() => handleExternalLink('https://atharonaa.com/terms')}
                    className="hover:text-white transition-colors"
                  >
                    شروط الاستخدام
                  </button>
                </div>
                <div className="text-center space-y-2">
                  <div>© 2024 أثرنا. جميع الحقوق محفوظة.</div>
                  <div>
                    هذه المنصة مدعومة من أثرنا
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollToTop && (
          <motion.button
            className="fixed bottom-8 left-8 w-12 h-12 bg-[#18325a] hover:bg-[#2a4a7a] text-white rounded-full flex items-center justify-center shadow-lg z-50"
            onClick={scrollToTop}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Demo Modal */}
      <DemoModal 
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onStartDemo={handleStartDemo}
      />

      {/* Contact Modal */}
      <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-right">تواصل معنا</DialogTitle>
            <DialogDescription className="text-right">
              نحن هنا لمساعدتك. أرسل لنا رسالة وسنتواصل معك قريباً
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-right block">الاسم</Label>
              <Input
                id="name"
                value={contactForm.name}
                onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="أدخل اسمك"
                required
                className="text-right"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-right block">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="أدخل بريدك الإلكتروني"
                required
                className="text-right"
              />
            </div>
            <div>
              <Label htmlFor="organization" className="text-right block">المنظمة</Label>
              <Input
                id="organization"
                value={contactForm.organization}
                onChange={(e) => setContactForm(prev => ({ ...prev, organization: e.target.value }))}
                placeholder="اسم المنظمة (اختياري)"
                className="text-right"
              />
            </div>
            <div>
              <Label htmlFor="message" className="text-right block">الرسالة</Label>
              <Textarea
                id="message"
                value={contactForm.message}
                onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                placeholder="اكتب رسالتك هنا..."
                rows={4}
                required
                className="text-right"
              />
            </div>
            <div className="flex gap-3">
              <Button type="submit" className="flex-1 bg-[#18325a] hover:bg-[#2a4a7a]">
                إرسال الرسالة
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsContactModalOpen(false)}
              >
                إلغاء
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}