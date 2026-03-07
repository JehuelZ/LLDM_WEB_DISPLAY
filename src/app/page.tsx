
'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, BookOpen, User, Bell, ClipboardCheck, Camera, Mail, Phone, Save, Edit2, X, Shield, CheckCircle2, TrendingUp, Star } from 'lucide-react';
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
  total: number | string;
  color?: 'primary' | 'secondary' | 'accent' | 'emerald' | 'amber' | 'cyan';
  size?: number;
}) => {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  const colorMap = {
    primary: "stroke-blue-500",
    secondary: "stroke-purple-500",
    accent: "stroke-pink-500",
    emerald: "stroke-emerald-500",
    amber: "stroke-amber-500",
    cyan: "stroke-cyan-500"
  };

  const glowMap = {
    primary: "drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]",
    secondary: "drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]",
    accent: "drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]",
    emerald: "drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]",
    amber: "drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]",
    cyan: "drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]"
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="transparent" stroke="currentColor" strokeWidth="6" className="text-foreground/5" />
          <circle cx="50" cy="50" r={radius} fill="transparent" stroke="currentColor" strokeWidth="6" strokeDasharray={circumference} style={{ strokeDashoffset }} strokeLinecap="round" className={cn("transition-all duration-1000 ease-out", colorMap[color], glowMap[color])} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center -rotate-0">
          <span className="text-lg font-black text-foreground">{percent}%</span>
        </div>
      </div>
      {label && <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</span>}
    </div>
  );
};

export default function Home() {
  const {
    currentUser, setCurrentUser,
    authSession, isLoading,
    announcements, theme,
    monthlySchedule, currentDate, members,
    loadAnnouncementsFromCloud,
    loadDayScheduleFromCloud,
    loadThemeFromCloud,
    loadMembersFromCloud,
    updateProfileInCloud,
    uploadAvatar
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
    loadCloudMessages
  } = useAppStore();

  useEffect(() => {
    // Suscribirse a mensajes en tiempo real
    const unsubscribe = subscribeToMessages();
    loadCloudMessages();
    return () => unsubscribe();
  }, [subscribeToMessages, loadCloudMessages]);

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

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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
    if (!msgContent.trim()) return;
    setIsSendingMsg(true);
    await sendCloudMessage({
      senderId: currentUser.id,
      targetRole: msgRecipient,
      content: msgContent,
      subject: `Nuevo mensaje de ${currentUser.name}`
    });
    setMsgContent('');
    setIsSendingMsg(false);
    alert('Mensaje enviado correctamente');
  };

  const handleSave = async () => {
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

  // Loading state (optional, or just return null while checking session)
  if (isLoading && !authSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <Header />
      <main className="container mx-auto p-4 md:p-8 space-y-6 md:space-y-8 animate-in fade-in duration-700">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-start">
          {/* Welcome and Basic Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 space-y-2 w-full text-center md:text-left"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter text-foreground uppercase italic px-2">
              Bienvenido, <span className="text-primary">{currentUser.name.split(' ')[0]}</span>
            </h1>
            <p className="text-muted-foreground font-medium tracking-widest uppercase text-[10px] md:text-xs">
              Panel de Control Digital - LLDM RODEO
            </p>
          </motion.div>

          {/* Profile Quick Card / Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-auto flex justify-center md:justify-end"
          >
            <div className="flex items-center gap-3 md:gap-4 bg-foreground/5 p-3 md:p-4 rounded-3xl border border-border/40 backdrop-blur-xl w-full max-w-sm md:max-w-none">
              <div
                className="relative group cursor-pointer"
                onClick={handlePhotoClick}
              >
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl overflow-hidden border-2 border-primary/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                  <img src={currentUser.avatar} alt="Profile" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="absolute inset-0 bg-background/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                  <Camera className="w-4 h-4 md:w-5 md:h-5 text-foreground" />
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-black text-foreground truncate max-w-[120px] md:max-w-none">{currentUser.name}</p>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">
                  {currentUser.category === 'Niño' ? 'Pequeño Gigante' : 'Miembro Activo'}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "rounded-xl hover:bg-foreground/10 h-10 w-10 md:h-12 md:w-12",
                  isEditing && "bg-primary/20 text-primary hover:bg-primary/30"
                )}
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
                disabled={isSaving}
              >
                {isSaving ? (
                  <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : isEditing ? (
                  <Save className="w-4 h-4" />
                ) : (
                  <Edit2 className="w-4 h-4 text-slate-500" />
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
                  <Button className="bg-primary text-black hover:bg-primary/80 font-bold px-8 gap-2" onClick={handleSave}>
                    <Save className="w-4 h-4" /> Guardar Cambios
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Personal Stats Section (Donas) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card border-none bg-foreground/5">
            <CardHeader>
              <CardTitle className="text-xl font-black uppercase text-foreground italic flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-primary" />
                Mi Desempeño Espiritual
              </CardTitle>
              <CardDescription>Resumen de fidelidad y puntualidad este mes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-4">
                <StatDoughnut
                  percent={85}
                  label="Asistencia General"
                  value={17}
                  total={20}
                  color="cyan"
                />
                <StatDoughnut
                  percent={100}
                  label="Responsabilidades"
                  value={4}
                  total={4}
                  color="secondary"
                />
                <StatDoughnut
                  percent={92}
                  label="Puntualidad"
                  value={92}
                  total={100}
                  color="amber"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* My Responsibilities (New) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 }}
          >
            <Card className="glass-card border-l-4 border-l-emerald-500 h-full bg-emerald-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg font-black text-emerald-500 uppercase italic">
                  <Shield className="mr-2 h-5 w-5" />
                  Mis Responsabilidades
                </CardTitle>
                <CardDescription className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Privilegios Asignados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { date: 'Hoy, 19 Feb', type: 'Oración 9:00 AM', status: 'pending', label: 'Pendiente' },
                    { date: 'Martes, 17 Feb', type: 'Servicio 7:00 PM', status: 'completed', label: 'Cumplido' },
                    { date: 'Domingo, 15 Feb', type: 'Oración 5:00 AM', status: 'completed', label: 'Cumplido' },
                  ].map((resp, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-foreground/5 border border-border/20 group hover:bg-foreground/10 transition-colors">
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
                  ))}
                  <p className="text-[9px] text-slate-500 italic mt-4 text-center">
                    * Validado oficialmente por el Responsable de Asistencia
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Today's Schedule */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-card border-l-4 border-l-primary h-full">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg font-medium text-primary">
                  <Clock className="mr-2 h-5 w-5" />
                  Horario de Hoy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-border/20 pb-2">
                    <span className="text-muted-foreground">5:00 AM</span>
                    <span className="font-medium flex items-center">
                      <User className="mr-2 h-3 w-3 text-secondary" />
                      {getMemberName(monthlySchedule[currentDate]?.slots['5am'].leaderId) || 'Sin asignar'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-border/20 pb-2">
                    <span className="text-muted-foreground">9:00 AM</span>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {getMemberName(monthlySchedule[currentDate]?.slots['9am'].consecrationLeaderId) || 'Por asignar'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {getMemberName(monthlySchedule[currentDate]?.slots['9am'].doctrineLeaderId) || 'Doctrina'}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-accent font-bold text-glow">
                      {monthlySchedule[currentDate]?.slots['evening'].time || '7:00 PM'}
                    </span>
                    <div className="text-right">
                      <span className="block font-bold text-foreground lowercase">
                        {monthlySchedule[currentDate]?.slots['evening'].type.toUpperCase()}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {monthlySchedule[currentDate]?.slots['evening'].leaderIds.map(id => getMemberName(id)).join(', ') || 'Varios hermanos'}
                      </span>
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
                  <Button variant="outline" size="sm" className="w-full mt-2">
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
                      { id: 'Administrador', icon: Shield, label: 'Administrador' },
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
                    className="w-full h-12 rounded-2xl bg-primary text-black font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
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
                          <Shield className="h-3 w-3 text-primary" />
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
            <Button variant="outline" className="h-32 w-full flex flex-col gap-3 rounded-3xl border-border/40 bg-foreground/5 hover:bg-primary hover:text-black hover:border-primary transition-all duration-500 overflow-hidden relative">
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
            <Button variant="outline" className="h-32 w-full flex flex-col gap-3 rounded-3xl border-border/40 bg-foreground/5 hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition-all duration-500 overflow-hidden relative">
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
