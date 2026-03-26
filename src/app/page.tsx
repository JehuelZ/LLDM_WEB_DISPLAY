
'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, BookOpen, User, Bell, ClipboardCheck, Camera, Mail, Phone, Save, Edit2, X, Settings, CheckCircle2, TrendingUp, Star, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { Input } from '@/components/ui/input';
import { MOCK_SCHEDULE, MOCK_THEME, MOCK_ANNOUNCEMENTS, MOCK_MEMBERS } from '@/lib/constants';
import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { useEffect } from 'react';
import { CountdownCard } from '@/components/CountdownCard';
import { LoginScreen } from '@/components/auth/LoginScreen';

const StatDoughnut = ({
  percent,
  label,
  value,
  total,
  color = "primary",
  size = 120
}: {
  percent: number;
  label: string;
  value: number | string;
  total?: number | string;
  color?: 'primary' | 'secondary' | 'accent' | 'emerald' | 'amber' | 'cyan';
  size?: number;
}) => {
  const radius = 40;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  // Kinetic Observatory Multi-Stop Gradients
  const gradientIds = {
    primary: "grad-blue",
    secondary: "grad-purple",
    accent: "grad-pink",
    emerald: "grad-green",
    amber: "grad-orange",
    cyan: "grad-cyan"
  };

  const glowColors = {
    primary: "rgba(59, 130, 246, 0.5)",
    secondary: "rgba(168, 85, 247, 0.5)",
    accent: "rgba(236, 72, 153, 0.5)",
    emerald: "rgba(16, 185, 129, 0.5)",
    amber: "rgba(245, 158, 11, 0.5)",
    cyan: "rgba(6, 182, 212, 0.5)"
  };

  return (
    <div className="flex flex-col items-center gap-3 group">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="grad-blue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
            <linearGradient id="grad-purple" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#7e22ce" />
            </linearGradient>
            <linearGradient id="grad-pink" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#be185d" />
            </linearGradient>
            <linearGradient id="grad-green" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <linearGradient id="grad-orange" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
            <linearGradient id="grad-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#0e7490" />
            </linearGradient>
            
            <filter id="glow">
               <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
               <feMerge>
                   <feMergeNode in="coloredBlur"/>
                   <feMergeNode in="SourceGraphic"/>
               </feMerge>
            </filter>
          </defs>

          {/* Background Track Circle - Uses a dim color to create a depth feel */}
          <circle 
            cx="50" cy="50" r={radius} 
            fill="transparent" 
            stroke="currentColor" 
            strokeWidth={strokeWidth - 2} 
            className="text-foreground/25" 
          />
          
          {/* 
            The 20px Visual Gap: 
            Achieved by using a slightly larger radius for the progress segment 
            than the track, or keeping the track thinner. 
          */}
          <motion.circle 
            cx="50" cy="50" r={radius} 
            fill="transparent" 
            stroke={`url(#${gradientIds[color]})`} 
            strokeWidth={strokeWidth} 
            strokeDasharray={circumference} 
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "circOut" }}
            strokeLinecap="round" 
            filter="url(#glow)"
            className="transition-all duration-1000 ease-out" 
            style={{ 
               filter: `drop-shadow(0 0 6px ${glowColors[color]})`
            }}
          />
        </svg>
        
        {/* Center Labeling */}
        <div className="absolute inset-0 flex flex-col items-center justify-center -rotate-0">
          <span 
            className="text-2xl font-light text-foreground"
            style={{ fontFamily: 'Manrope, sans-serif' }}
          >
            {percent}
            <span className="text-xs opacity-50 ml-0.5">%</span>
          </span>
        </div>
      </div>
      
      {/* Label with Kinetic Observatory Precision */}
      {label && (
        <div className="flex flex-col items-center gap-0.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary transition-colors duration-300">
                {label}
            </span>
            <div className="w-4 h-[1px] bg-foreground/10 group-hover:w-8 group-hover:bg-primary transition-all duration-500" />
        </div>
      )}
    </div>
  );
};


export default function Home() {
  const {
    currentUser, setCurrentUser,
    authSession, isLoading,
    announcements, theme, settings,
    monthlySchedule, currentDate, members,
    loadAnnouncementsFromCloud,
    loadDayScheduleFromCloud,
    loadThemeFromCloud,
    loadMembersFromCloud,
    updateProfileInCloud,
    uploadAvatar,
    showNotification
  } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [msgRecipient, setMsgRecipient] = useState<'Administrador' | 'Responsable de Asistencia' | 'Ministro a Cargo'>('Administrador');
  const [msgContent, setMsgContent] = useState('');
  const [isSendingMsg, setIsSendingMsg] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    sendCloudMessage,
    messages,
    markMessageAsRead,
    subscribeToMessages,
    loadCloudMessages,
    loadMonthlyAttendanceStats
  } = useAppStore();

  const [personalStats, setPersonalStats] = useState<any>(null);

  useEffect(() => {
    // Suscribirse a mensajes en tiempo real
    const unsubscribe = subscribeToMessages();
    loadCloudMessages();

    // Cargar estadísticas personales
    if (currentUser?.id) {
      loadMonthlyAttendanceStats(currentUser.id).then((stats: any) => {
        setPersonalStats(stats);
      });
    }

    return () => unsubscribe();
  }, [subscribeToMessages, loadCloudMessages, currentUser?.id, loadMonthlyAttendanceStats]);

  useEffect(() => {
    // Cargar datos reales de la nube al iniciar
    loadAnnouncementsFromCloud();
    loadDayScheduleFromCloud(currentDate);
    loadThemeFromCloud();
    loadMembersFromCloud();
  }, [currentDate, loadAnnouncementsFromCloud, loadDayScheduleFromCloud, loadThemeFromCloud, loadMembersFromCloud]);

  const getMemberName = (id: any) => {
    if (!id) return '';
    const cleanId = String(id).trim();
    if (!cleanId) return '';

    // First try real members from cloud
    const member = members && members.find(m => String(m.id).trim() === cleanId);
    if (member) return member.name;

    // Then try mock members as fallback
    const mockMember = MOCK_MEMBERS.find(m => String(m.id).trim() === cleanId);
    if (mockMember) return mockMember.name;

    return id; // Fallback to original ID
  };

  const getMemberAvatar = (id: any) => {
    if (!id) return null;
    const cleanId = String(id).trim();
    if (!cleanId) return null;

    // First try real members from cloud
    const member = members && members.find(m => String(m.id).trim() === cleanId);
    if (member && member.avatar) return member.avatar;

    // Then try mock members as fallback
    const mockMember = MOCK_MEMBERS.find(m => String(m.id).trim() === cleanId);
    if (mockMember && mockMember.avatar) return mockMember.avatar;

    return null;
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && currentUser) {
      setIsSaving(true);
      const publicUrl = await uploadAvatar(currentUser.id, file);
      if (publicUrl) {
        const updatedUser = { ...currentUser, avatar: publicUrl };
        const success = await updateProfileInCloud(currentUser.id, updatedUser);
        if (success) {
          setCurrentUser(updatedUser);
        }
      }
      setIsSaving(false);
    }
  };

  const handleSendMessage = async () => {
    if (!msgContent.trim() || !currentUser) return;
    setIsSendingMsg(true);
    await sendCloudMessage({
      senderId: currentUser.id,
      targetRole: msgRecipient,
      content: msgContent,
      subject: `Nuevo mensaje de ${currentUser.name}`
    });
    setMsgContent('');
    setIsSendingMsg(false);
    showNotification('Mensaje enviado correctamente', 'success');
  };

  const handleSave = async () => {
    if (!currentUser) return;
    setIsSaving(true);
    const success = await updateProfileInCloud(currentUser.id, currentUser);
    if (success) {
      setIsEditing(false);
    }
    setIsSaving(false);
  };

  // 🔒 Login Guard: Only show dashboard if authenticated
  if (!authSession && !isLoading) {
    return <LoginScreen />;
  }

  // ⏳ Sync Guard: Wait for profile load if authenticated
  if (authSession && !currentUser) {
    return (
      <div className="min-h-screen bg-[#02040a] flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03)_0%,transparent_70%)]" />
        <div className="relative z-10 text-center space-y-6">
            <div className="relative flex justify-center">
                <div className="w-24 h-24 border-2 border-white/5 rounded-full animate-ping absolute" />
                <div className="w-24 h-24 border-t-2 border-amber-500 rounded-full animate-spin relative z-10" />
            </div>
            <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white italic">Sincronizando</p>
                <p className="text-[8px] font-bold uppercase tracking-widest text-slate-500">Verificando credenciales oficiales de LLDM Rodeo...</p>
            </div>
        </div>
      </div>
    );
  }

  // ⏳ Approval Guard: Show waiting screen while status is 'Pendiente'
  if (currentUser && currentUser.status === 'Pendiente') {
    return (
      <div className="min-h-screen bg-[#02040a] flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)]" />
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 max-w-md w-full text-center space-y-8"
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-amber-500/20 blur-3xl rounded-full scale-150 animate-pulse" />
            <div className="relative w-32 h-32 mx-auto bg-slate-900/80 rounded-[2.5rem] border border-amber-500/20 flex items-center justify-center p-6 shadow-2xl">
              <img 
                src={settings?.churchLogoUrl || "/flama-oficial.svg"} 
                className="w-full h-full object-contain" 
                style={{ filter: 'brightness(0) saturate(100%) invert(84%) sepia(18%) saturate(3040%) hue-rotate(330deg) brightness(103%) contrast(100%)' }}
                alt="LLDM" 
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-amber-500 rounded-2xl flex items-center justify-center border-4 border-[#02040a]">
                <Clock className="w-5 h-5 text-black animate-spin" />
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-black italic uppercase text-foreground tracking-tighter leading-tight">
              Registro <span className="text-amber-500">Pendiente</span>
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed px-4">
              Hola <span className="text-foreground font-bold">{currentUser.name}</span>, tu cuenta está en revisión.
            </p>
            <button
              onClick={() => useAppStore.getState().signOut()}
              className="mt-6 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ⛔ Restricted Guard: Show message if user is 'Inactivo'
  if (currentUser && currentUser.status === 'Inactivo') {
    return (
      <div className="min-h-screen bg-[#02040a] flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.05)_0%,transparent_70%)]" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 max-w-md w-full text-center space-y-8"
        >
          <div className="w-24 h-24 mx-auto bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
            <X className="w-12 h-12 text-red-500" />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-black uppercase text-foreground italic tracking-tighter">Acceso <span className="text-red-500">Denegado</span></h2>
            <p className="text-slate-400 text-sm italic">Tu cuenta ha sido desactivada.</p>
            <button
              onClick={() => useAppStore.getState().signOut()}
              className="mt-4 px-8 py-3 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl border border-white/10"
            >
              Cerrar Sesión
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // 🚫 Unauthorized Guard: Show screen if currentUser is null (Not in profiles table)
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-black to-black flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-30 pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-md w-full bg-black/40 border border-white/5 backdrop-blur-3xl p-10 rounded-[3rem] text-center space-y-8 shadow-[0_50px_100px_rgba(0,0,0,0.8)]"
        >
          <div className="relative inline-block">
             <div className="absolute inset-0 bg-rose-500/20 blur-[80px] rounded-full" />
             <div className="relative w-24 h-24 mx-auto bg-slate-950 rounded-[2rem] border border-rose-500/20 flex items-center justify-center">
                <Lock className="w-10 h-10 text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]" />
             </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-black uppercase text-foreground tracking-tighter italic">Acceso <span className="text-rose-500">Restringido</span></h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Lo sentimos, tu cuenta no figura en la <span className="text-white font-bold">lista oficial de miembros</span> autorizados de LLDM Rodeo.
            </p>
            <div className="bg-rose-500/5 border border-rose-500/10 p-5 rounded-3xl">
              <p className="text-[10px] text-rose-400 font-black uppercase tracking-[0.2em]">Causa: Usuario no registrado o eliminado</p>
            </div>
            <p className="text-[11px] text-slate-500 italic leading-relaxed">
              Si crees que esto es un error o has sido eliminado accidentalmente, por favor contacta al administrador de la iglesia para ser re-registrado.
            </p>
          </div>

          <div className="flex flex-col gap-3">
             <Button 
                variant="primitivo"
                className="w-full h-14"
                onClick={async () => {
                   await useAppStore.getState().signOut();
                   window.location.href = '/';
                }}
             >
                SALIR DEL SISTEMA
             </Button>
             <p className="text-[9px] uppercase font-black tracking-widest text-slate-700">Protected by Rodeo Security Architecture</p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Loading state (optional, or just return null while checking session)
  if (isLoading && !authSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-foreground transition-colors duration-500">
      <Header />
      <main className="container mx-auto p-4 md:p-8 space-y-6 md:space-y-8 pb-32 md:pb-8 animate-in fade-in duration-700">
        {/* Upgraded Welcome Header */}
        <div className="flex flex-col lg:flex-row gap-8 items-center justify-between mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 space-y-4 w-full text-center lg:text-left"
          >
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full mb-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Portal Cristiano v3.0</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter text-foreground uppercase italic leading-none">
              Bienvenido, <span className="text-primary lg:not-italic">{currentUser.name.split(' ')[0]}</span>
            </h1>
            <p className="text-slate-400 font-bold tracking-[0.2em] uppercase text-xs md:text-sm opacity-80">
              PANEL DE CONTROL ESPIRITUAL <span className="mx-2 text-primary">/</span> LLDM RODEO
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full lg:w-auto"
          >
            <div className="flex items-center gap-6 bg-black/40 p-5 rounded-[2.5rem] border border-white/5 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-primary/20 transition-all pointer-events-none" />
              <div
                className="relative group cursor-pointer"
                onClick={handlePhotoClick}
              >
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-[1.8rem] overflow-hidden border-2 border-primary/30 shadow-[0_0_20px_rgba(59,130,246,0.3)] bg-white/5 flex items-center justify-center">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt="Profile" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <span className="text-2xl font-black text-primary uppercase italic">
                      {currentUser.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-[1.8rem] backdrop-blur-sm">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xl font-black text-foreground italic tracking-tighter leading-none">{currentUser.name}</p>
                <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded-lg bg-primary text-black text-[9px] font-black uppercase tracking-widest shadow-lg">
                        {currentUser.category === 'Niño' ? 'PEQUEÑO GIGANTE' : 'MIEMBRO ACTIVO'}
                    </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "rounded-2xl hover:bg-white/10 h-12 w-12 border border-white/5 shadow-xl ml-4",
                  isEditing && "bg-primary text-black hover:bg-primary/80"
                )}
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
                disabled={isSaving}
              >
                {isSaving ? (
                  <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : isEditing ? (
                  <Save className="w-5 h-5" />
                ) : (
                  <Edit2 className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                )}
              </Button>
            </div>
          </motion.div>
        </div>

        <CountdownCard />

        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="z-50 relative"
          >
            <Card className="glass-card bg-primary/5 border-primary/20 overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-black uppercase text-primary italic">Actualizar ficha de contacto</CardTitle>
                  <CardDescription>Mantén tu información actualizada para la iglesia</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}><X className="w-4 h-4" /></Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Nombre Completo</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <Input
                        value={currentUser.name}
                        onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                        className="pl-10 bg-foreground/5 border-border/40"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Correo Electrónico</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <Input
                        value={currentUser.email}
                        onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                        className="pl-10 bg-foreground/5 border-border/40"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Teléfono / WhatsApp</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <Input
                        value={currentUser.phone}
                        onChange={(e) => setCurrentUser({ ...currentUser, phone: e.target.value })}
                        className="pl-10 bg-foreground/5 border-border/40"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancelar</Button>
                  <Button 
                    variant="primitivo"
                    className="px-8 gap-2" 
                    onClick={handleSave}
                  >
                    <Save className="w-4 h-4" /> Guardar Cambios
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          {/* Main Spiritual Stats */}
          <Card className="glass-card border-none bg-black/40 lg:col-span-8 overflow-hidden relative group rounded-[2.5rem] shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none group-hover:bg-primary/10 transition-all duration-700" />
            <CardHeader className="pb-6 p-8 border-b border-white/5">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-2xl font-black uppercase text-foreground italic flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
                        <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                    Mi Desempeño Espiritual
                </CardTitle>
                <CardDescription className="text-[10px] uppercase font-black tracking-[0.25em] text-muted-foreground mt-2">Resumen de fidelidad y puntualidad • Periodo Vigente</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-12 py-6 text-center">
                <StatDoughnut
                  percent={personalStats ? Math.round((personalStats.attended / (personalStats.total || 1)) * 100) : 0}
                  label="Asistencia"
                  value={personalStats?.attended || 0}
                  total={personalStats?.total || 30}
                  color="emerald"
                  size={140}
                />
                <StatDoughnut
                  percent={personalStats ? Math.round((personalStats.bySession?.['5am'] / (personalStats.total / 3 || 10)) * 100) : 0}
                  label="Oración 5am"
                  value={personalStats?.bySession?.['5am'] || 0}
                  total={10}
                  color="cyan"
                  size={140}
                />
                <div className="hidden md:block">
                    <StatDoughnut
                    percent={currentUser.stats?.punctuality || 95}
                    label="Puntualidad"
                    value={currentUser.stats?.punctuality || 95}
                    total={100}
                    color="amber"
                    size={140}
                    />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Journey Chart (Area Chart) */}
          <Card className="glass-card border-none bg-black/40 lg:col-span-4 overflow-hidden group rounded-[2.5rem] shadow-2xl relative">
             <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.05),transparent)] pointer-events-none" />
            <CardHeader className="pb-4 p-8">
                <CardTitle className="text-[11px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-3">
                    <Star className="w-4 h-4 animate-pulse" />
                    Mi Progreso
                </CardTitle>
            </CardHeader>
            <CardContent className="h-[180px] flex items-end px-4 pb-8">
                <div className="w-full h-full relative">
                    <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="personalGradMain" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <motion.path 
                            d="M 0 40 Q 10 35 20 20 Q 30 5 40 15 Q 50 30 60 10 Q 70 5 80 25 Q 90 35 100 15 V 40 H 0"
                            fill="url(#personalGradMain)"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 2.5, ease: "circOut" }}
                        />
                        <motion.path 
                            d="M 0 40 Q 10 35 20 20 Q 30 5 40 15 Q 50 30 60 10 Q 70 5 80 25 Q 90 35 100 15"
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="3"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 2.5, ease: "circOut" }}
                            className="drop-shadow-[0_0_12px_rgba(59,130,246,0.8)]"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-4xl font-black text-foreground italic tracking-tighter transition-transform group-hover:scale-110 duration-500">+12%</span>
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mt-1">Mejora Semanal</span>
                    </div>
                </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* My Responsibilities (Updated with Luna Aesthetic) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 }}
          >
            <Card className="glass-card border-none h-full bg-surface-container/10 backdrop-blur-xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-500 to-emerald-900 group-hover:w-2 transition-all duration-500" />
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg font-black text-emerald-500 uppercase italic">
                  <Settings className="mr-2 h-5 w-5" />
                  Mis Responsabilidades
                </CardTitle>
                <CardDescription className="text-[9px] uppercase font-black tracking-widest text-muted-foreground mt-1 px-4">Historial de asistencia personal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentUser.responsibilities && currentUser.responsibilities.length > 0 ? (
                    currentUser.responsibilities.map((resp: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-foreground/5 border border-border/10 group/item hover:bg-foreground/10 transition-colors">
                        <div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase">{resp.date}</p>
                          <p className="text-sm font-bold text-foreground">{resp.type}</p>
                        </div>
                        <div className={cn(
                          "flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter",
                          resp.status === 'completed' ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse"
                        )}>
                          {resp.status === 'completed' ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                          {resp.label}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center bg-black/5 rounded-2xl border border-dashed border-border/40">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Sin responsabilidades pendientes</p>
                    </div>
                  )}
                  <p className="text-[9px] text-slate-500 italic mt-4 text-center">
                    * Validado oficialmente por el Responsable de Asistencia
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Today's Schedule (Updated with Luna Aesthetic) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-card border-none h-full bg-surface-container/10 backdrop-blur-xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-primary-container group-hover:w-2 transition-all duration-500" />
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg font-black text-primary uppercase italic">
                  <Clock className="mr-2 h-5 w-5" />
                  Horario de Hoy
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-border/20 pb-2">
                    <span className="text-muted-foreground">5:00 AM</span>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm text-foreground uppercase tracking-tight">
                        {getMemberName(monthlySchedule[currentDate]?.slots['5am'].leaderId) || 'Sin asignar'}
                      </span>
                      {getMemberAvatar(monthlySchedule[currentDate]?.slots['5am'].leaderId) ? (
                        <img src={getMemberAvatar(monthlySchedule[currentDate]?.slots['5am'].leaderId)} className="w-8 h-8 rounded-full border border-primary/20 object-cover shadow-lg" alt="" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-foreground/5 border border-border/20 flex items-center justify-center">
                          <User className="w-4 h-4 text-slate-500" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-b border-border/20 pb-2">
                    <span className="text-muted-foreground">9:00 AM</span>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm font-black text-foreground uppercase tracking-tighter">
                          {getMemberName(monthlySchedule[currentDate]?.slots['9am'].consecrationLeaderId) || 'Por asignar'}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-bold uppercase italic">
                          {getMemberName(monthlySchedule[currentDate]?.slots['9am'].doctrineLeaderId) || 'Doctrina'}
                        </div>
                      </div>
                      <div className="flex -space-x-2">
                        {[
                          monthlySchedule[currentDate]?.slots['9am'].consecrationLeaderId,
                          monthlySchedule[currentDate]?.slots['9am'].doctrineLeaderId
                        ].map((id, idx) => {
                          const avatar = getMemberAvatar(id);
                          return avatar ? (
                            <img key={idx} src={avatar} className="w-8 h-8 rounded-full border-2 border-background object-cover shadow-lg" alt="" />
                          ) : (
                            <div key={idx} className="w-8 h-8 rounded-full bg-foreground/5 border-2 border-background flex items-center justify-center shadow-lg">
                              <User className="w-4 h-4 text-slate-500" />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-accent font-black text-glow text-lg uppercase italic">
                      {monthlySchedule[currentDate]?.slots['evening'].time || '7:00 PM'}
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="block font-black text-foreground uppercase tracking-tighter text-sm italic">
                          {monthlySchedule[currentDate]?.slots['evening'].type.toUpperCase()}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-bold">
                          {monthlySchedule[currentDate]?.slots['evening'].leaderIds.map(id => getMemberName(id)).join(', ') || 'Varios hermanos'}
                        </span>
                      </div>
                      <div className="flex -space-x-3">
                        {monthlySchedule[currentDate]?.slots['evening'].leaderIds.slice(0, 3).map((id, idx) => {
                          const avatar = getMemberAvatar(id);
                          return avatar ? (
                            <img key={idx} src={avatar} className="w-8 h-8 rounded-full border-2 border-background object-cover shadow-lg" alt="" />
                          ) : (
                            <div key={idx} className="w-8 h-8 rounded-full bg-foreground/5 border-2 border-background flex items-center justify-center shadow-lg">
                              <User className="w-4 h-4 text-slate-500" />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Weekly Theme */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-card border-l-4 border-l-secondary h-full">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg font-medium text-secondary">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Tema Semanal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-foreground leading-tight">
                    "{theme.title}"
                  </h3>
                  <div className="inline-block px-2 py-1 rounded bg-secondary/20 text-secondary text-xs uppercase font-bold tracking-wider">
                    {theme.type.replace('_', ' ')}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {theme.description}
                  </p>
                  <Button variant="primitivo" size="sm" className="w-full mt-2">
                    Ver Documento PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Announcements */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="md:col-span-2 lg:col-span-1"
          >
            <Card className="glass-card border-l-4 border-l-accent h-full">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg font-medium text-accent">
                  <Bell className="mr-2 h-5 w-5" />
                  Anuncios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {announcements.map((ann) => (
                    <li
                      key={ann.id}
                      className="bg-foreground/5 rounded-lg p-3 hover:bg-foreground/10 transition-colors"
                    >
                      <h4 className="font-semibold text-foreground text-sm">
                        {ann.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {ann.content}
                      </p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Communication Center */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card className="glass-card border-none bg-gradient-to-br from-primary/5 via-blue-600/5 to-transparent overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Mail className="h-32 w-32" />
            </div>
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-black uppercase italic tracking-tighter">
                <Mail className="mr-3 h-6 w-6 text-primary" />
                Centro de Comunicaciones
              </CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Envía un mensaje directo a los responsables de la congregación
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1">¿A quién va dirigido?</label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { id: 'Administrador', icon: Settings, label: 'Administrador' },
                      { id: 'Responsable de Asistencia', icon: ClipboardCheck, label: 'Responsable de Asistencia' },
                      { id: 'Ministro a Cargo', icon: Star, label: 'Ministro a Cargo' }
                    ].map((role) => (
                      <button
                        key={role.id}
                        onClick={() => setMsgRecipient(role.id as any)}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-2xl border transition-all duration-300 text-left",
                          msgRecipient === role.id
                            ? "bg-primary text-black border-primary font-bold shadow-lg shadow-primary/20"
                            : "bg-foreground/5 border-white/5 text-slate-400 hover:bg-foreground/10"
                        )}
                      >
                        <role.icon className={cn("h-4 w-4", msgRecipient === role.id ? "text-black" : "text-primary")} />
                        <span className="text-xs uppercase font-black tracking-wider">{role.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2 space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Mensaje o Petición</label>
                    <textarea
                      value={msgContent}
                      onChange={(e) => setMsgContent(e.target.value)}
                      placeholder="Escribe aquí tu mensaje..."
                      className="w-full h-32 bg-foreground/5 border border-white/5 rounded-2xl p-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                    />
                  </div>
                  <Button
                    variant="primitivo"
                    className="w-full h-12 rounded-2xl"
                    onClick={handleSendMessage}
                    disabled={isSendingMsg || !msgContent.trim()}
                  >
                    {isSendingMsg ? "Enviando..." : "Enviar Mensaje Directo"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* My Messages / Inbox */}
        {messages.filter(m => m.receiverId === currentUser.id).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase italic tracking-tighter text-foreground">Mis Mensajes y Respuestas</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Bandeja de entrada personal</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {messages
                .filter(m => m.receiverId === currentUser.id)
                .map((msg) => (
                  <Card
                    key={msg.id}
                    className={cn(
                      "glass-card border-none overflow-hidden transition-all duration-300",
                      !msg.isRead ? "bg-primary/5 border border-primary/20 ring-1 ring-primary/20" : "opacity-60"
                    )}
                    onClick={() => !msg.isRead && markMessageAsRead(msg.id)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <Settings className="h-3 w-3 text-primary" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary">Respuesta de {msg.senderName}</span>
                        </div>
                        {!msg.isRead && <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-300 leading-relaxed italic">"{msg.content}"</p>
                      <p className="text-[8px] font-bold uppercase tracking-widest text-slate-500 mt-4">
                        {new Date(msg.createdAt).toLocaleDateString()} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <Link href="/calendar" className="block w-full group">
            <Button variant="primitivo" className="h-32 w-full flex flex-col gap-3 rounded-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Calendar className="h-20 w-20" />
              </div>
              <Calendar className="h-8 w-8 text-primary group-hover:text-black transition-colors" />
              <div className="text-left w-full px-2">
                <p className="text-xl font-black uppercase italic tracking-tighter">Ver Calendario</p>
                <p className="text-[10px] opacity-60 font-bold uppercase tracking-widest">Programación y Eventos</p>
              </div>
            </Button>
          </Link>

          <Link href="/directory" className="block w-full group">
            <Button variant="primitivo" className="h-32 w-full flex flex-col gap-3 rounded-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <User className="h-20 w-20" />
              </div>
              <User className="h-8 w-8 text-emerald-500 group-hover:text-black transition-colors" />
              <div className="text-left w-full px-2">
                <p className="text-xl font-black uppercase italic tracking-tighter">Directorio</p>
                <p className="text-[10px] opacity-60 font-bold uppercase tracking-widest">Contactar Hermanos</p>
              </div>
            </Button>
          </Link>
        </motion.div>

        {/* Attendance Integrity Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center gap-4 backdrop-blur-xl"
        >
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <ClipboardCheck className="h-5 w-5 text-emerald-500" />
          </div>
          <p className="text-xs text-muted-foreground uppercase font-black tracking-[0.2em] max-w-md text-center">
            La asistencia es gestionada exclusivamente por los <span className="text-emerald-500 font-bold">Responsables de Asistencia</span> para garantizar la integridad de los datos
          </p>
        </motion.div>
      </main>
    </div>
  );
}
