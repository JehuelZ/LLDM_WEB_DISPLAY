'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Mail,
    Phone,
    Camera,
    Save,
    ArrowLeft,
    CheckCircle2,
    TrendingUp,
    Shield,
    Activity,
    Calendar,
    Star,
    LayoutDashboard,
    ClipboardCheck,
    Music,
    Settings,
    Edit2,
    Users
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ImageEditor } from '@/components/ImageEditor';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
    const { currentUser, updateProfileInCloud, uploadAvatar, setCurrentUser } = useAppStore();
    const router = useRouter();

    const [name, setName] = useState(currentUser.name);
    const [phone, setPhone] = useState(currentUser.phone);
    const [category, setCategory] = useState(currentUser.category);
    const [gender, setGender] = useState(currentUser.gender);
    const [memberGroup, setMemberGroup] = useState(currentUser.member_group);
    const [isSaving, setIsSaving] = useState(false);
    const [imageToEdit, setImageToEdit] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const roleActions = useMemo(() => {
        const actions = [];
        if (currentUser.role === 'Administrador' || currentUser.role === 'Responsable de Asistencia' || currentUser.privileges?.includes('monitor') || currentUser.privileges?.includes('admin')) {
            actions.push({
                title: 'Pasar Asistencia',
                description: 'Control de ingreso oficial y conteo de miembros.',
                icon: ClipboardCheck,
                href: '/dashboard/monitor',
                color: 'text-emerald-500',
                bgColor: 'bg-emerald-500/10',
                borderColor: 'border-emerald-500/20'
            });
        }
        if (currentUser.role === 'Administrador' || currentUser.role === 'Dirigente Coro Adultos' || currentUser.privileges?.includes('choir') || currentUser.privileges?.includes('admin')) {
            actions.push({
                title: 'Gestionar Coro',
                description: 'Programación de ensayos, uniformes y anuncios de coro.',
                icon: Music,
                href: '/dashboard/coro',
                color: 'text-secondary',
                bgColor: 'bg-secondary/10',
                borderColor: 'border-secondary/20'
            });
        }
        if (currentUser.role === 'Administrador' || currentUser.role === 'Ministro a Cargo' || currentUser.privileges?.includes('admin')) {
            actions.push({
                title: 'Panel de Ministro',
                description: 'Visión general de estadísticas y programación semanal.',
                icon: Shield,
                href: '/dashboard/ministro',
                color: 'text-primary',
                bgColor: 'bg-primary/10',
                borderColor: 'border-primary/20'
            });
        }
        if (currentUser.role === 'Administrador' || currentUser.role === 'Encargado de Jóvenes' || currentUser.privileges?.includes('youth_leader') || currentUser.privileges?.includes('admin')) {
            actions.push({
                title: 'Gestión de Jóvenes',
                description: 'Supervisión de actividades y participación juvenil.',
                icon: Users,
                href: '/dashboard/youth',
                color: 'text-indigo-400',
                bgColor: 'bg-indigo-400/10',
                borderColor: 'border-indigo-400/20'
            });
        }
        return actions;
    }, [currentUser.role, currentUser.privileges]);

    useEffect(() => {
        setName(currentUser.name);
        setPhone(currentUser.phone);
        setCategory(currentUser.category);
        setGender(currentUser.gender);
        setMemberGroup(currentUser.member_group);
    }, [currentUser]);

    const handleAvatarClick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImageToEdit(reader.result as string);
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    };

    const dataURLtoFile = (dataurl: string, filename: string) => {
        let arr = dataurl.split(','),
            match = arr[0].match(/:(.*?);/),
            mime = match ? match[1] : 'image/jpeg',
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    };

    const handleSaveImage = async (croppedImage: string) => {
        setIsSaving(true);
        try {
            const file = dataURLtoFile(croppedImage, `avatar-${currentUser.id}.jpg`);
            const publicUrl = await uploadAvatar(currentUser.id, file);
            if (publicUrl) {
                const success = await updateProfileInCloud(currentUser.id, { avatar: publicUrl });
                if (success) {
                    setCurrentUser({ ...currentUser, avatar: publicUrl });
                    setImageToEdit(null);
                    setShowSuccess(true);
                    setTimeout(() => setShowSuccess(false), 3000);
                }
            }
        } catch (error) {
            console.error('Error uploading avatar:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveChanges = async () => {
        setIsSaving(true);
        try {
            const success = await updateProfileInCloud(currentUser.id, {
                name,
                phone,
                category: category as any,
                gender: gender as any,
                member_group: memberGroup as any
            });
            if (success) {
                setCurrentUser({
                    ...currentUser,
                    name,
                    phone,
                    category: category as any,
                    gender: gender as any,
                    member_group: memberGroup as any
                });
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            }
        } catch (error) {
            console.error('Error saving profile:', error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground transition-all duration-500">
            <Header />

            <main className="container mx-auto p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Back Button & Title */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.back()}
                            className="rounded-full hover:bg-foreground/5 h-12 w-12"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </Button>
                        <div>
                            <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-foreground uppercase italic flex items-center gap-4">
                                <span>Mi <span className="text-primary italic">Perfil</span></span>
                            </h1>
                            <p className="text-slate-500 font-medium tracking-tight mt-1">Personaliza tu información y revisa tus estadísticas.</p>
                        </div>
                    </div>

                    <AnimatePresence>
                        {showSuccess && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="bg-emerald-500/10 border border-emerald-500/20 px-6 py-3 rounded-2xl flex items-center gap-3 text-emerald-500 shadow-lg shadow-emerald-500/5"
                            >
                                <CheckCircle2 className="w-5 h-5" />
                                <span className="text-xs font-black uppercase tracking-widest italic">¡Cambios guardados con éxito!</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sidebar / Profile Info */}
                    <div className="space-y-6">
                        {/* Digital ID Card */}
                        <motion.div
                            initial={{ rotateY: 15, opacity: 0 }}
                            animate={{ rotateY: 0, opacity: 1 }}
                            className="relative aspect-[1.6/1] w-full bg-gradient-to-br from-[#1a1c1e] to-[#0a0a0a] rounded-[2rem] p-6 shadow-2xl border border-white/5 overflow-hidden group perspective-[1000px]"
                        >
                            {/* Decorative background flare */}
                            <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/20 rounded-full blur-[80px] group-hover:bg-primary/30 transition-colors" />
                            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-secondary/10 rounded-full blur-[80px]" />

                            {/* ID Content */}
                            <div className="relative h-full flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-black uppercase tracking-[0.3em] text-primary">Credential Digital</p>
                                        <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">LLDM <span className="text-primary italic">RODEO</span></h3>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md">
                                        <Shield className="w-5 h-5 text-primary" />
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div
                                        className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-primary/30 shadow-lg shadow-black/50 cursor-pointer group/avatar"
                                        onClick={handleAvatarClick}
                                    >
                                        <img src={currentUser.avatar} className="w-full h-full object-cover transition-transform group-hover/avatar:scale-110" alt="" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                                            <Camera className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-lg font-black text-white leading-tight uppercase truncate">{currentUser.name}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{currentUser.role}</p>
                                    </div>
                                </div>

                                <div className="flex justify-between items-end">
                                    <div className="space-y-1">
                                        <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Estado de Membresía</p>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                            <span className="text-[9px] font-black text-emerald-500 uppercase italic">Activo 2026</span>
                                        </div>
                                    </div>
                                    <div className="p-1.5 bg-white rounded-lg opacity-80 group-hover:opacity-100 transition-opacity">
                                        {/* Simple Mock QR */}
                                        <div className="grid grid-cols-4 gap-0.5">
                                            {[...Array(16)].map((_, i) => (
                                                <div key={i} className={`w-1 h-1 ${Math.random() > 0.5 ? 'bg-black' : 'bg-transparent'}`} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                        <Card className="glass-card overflow-hidden border-none bg-foreground/5 backdrop-blur-xl">
                            <CardHeader className="p-6 border-b border-white/5">
                                <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400 italic">Detalles de la Cuenta</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-foreground/5 border border-border/10">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                            <Mail className="w-5 h-5 text-primary" />
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Correo Electrónico</p>
                                            <p className="text-sm font-bold truncate text-foreground">{currentUser.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-foreground/5 border border-border/10">
                                        <div className="w-10 h-10 rounded-xl bg-orange-400/10 flex items-center justify-center">
                                            <Shield className="w-5 h-5 text-orange-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Privilegios</p>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {currentUser.privileges?.length > 0 ? currentUser.privileges.map((p, i) => (
                                                    <span key={i} className="text-[8px] font-black uppercase text-orange-400/70 border border-orange-400/20 px-1.5 py-0.5 rounded italic">
                                                        {p}
                                                    </span>
                                                )) : <span className="text-[10px] text-slate-500 italic">Ninguno asignado</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Activity Mini-Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="glass-card p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl">
                                <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest leading-none">Puntualidad</p>
                                <h4 className="text-2xl font-black text-foreground italic mt-2">{currentUser.stats?.punctuality || 0}%</h4>
                            </div>
                            <div className="glass-card p-4 bg-primary/5 border border-primary/10 rounded-3xl">
                                <p className="text-[9px] font-black text-primary uppercase tracking-widest leading-none">Asistencia</p>
                                <h4 className="text-2xl font-black text-foreground italic mt-2">{currentUser.stats?.attendance ? Math.round((currentUser.stats.attendance.attended / currentUser.stats.attendance.total) * 100) : 0}%</h4>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Information Section */}
                        <Card className="glass-card border-none bg-foreground/5 backdrop-blur-xl p-8 md:p-12">
                            <h2 className="text-2xl font-black tracking-tighter text-foreground uppercase italic flex items-center gap-4 mb-10">
                                <User className="w-8 h-8 text-primary" />
                                <span>Información <span className="text-primary italic">General</span></span>
                            </h2>

                            <div className="grid gap-8 md:grid-cols-2">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Nombre Completo</label>
                                    <Input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="h-14 bg-foreground/5 border-border/20 rounded-2xl focus:ring-primary/40 font-bold px-6"
                                        placeholder="Tu nombre completo"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Teléfono / WhatsApp</label>
                                    <Input
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="h-14 bg-foreground/5 border-border/20 rounded-2xl focus:ring-primary/40 font-bold px-6"
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Categoría</label>
                                    <select
                                        className="w-full h-14 px-6 rounded-2xl bg-foreground/5 border border-border/20 text-sm font-bold focus:ring-primary/40 text-foreground outline-none"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value as any)}
                                    >
                                        <option value="Varon">Adulto / Joven</option>
                                        <option value="Niño">Niño / Infantil</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Género</label>
                                    <select
                                        className="w-full h-14 px-6 rounded-2xl bg-foreground/5 border border-border/20 text-sm font-bold focus:ring-primary/40 text-foreground outline-none"
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value as any)}
                                    >
                                        <option value="Varon">Varon</option>
                                        <option value="Hermana">Hermana</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Grupo al que Pertenece</label>
                                    <select
                                        className="w-full h-14 px-6 rounded-2xl bg-foreground/5 border border-border/20 text-sm font-bold focus:ring-primary/40 text-foreground outline-none"
                                        value={memberGroup || ''}
                                        onChange={(e) => setMemberGroup(e.target.value as any)}
                                    >
                                        <option value="">Ninguno / General</option>
                                        <option value="Casados">Casados</option>
                                        <option value="Casadas">Casadas</option>
                                        <option value="Solos y Solas">Solos y Solas</option>
                                        <option value="Jovenes">Jóvenes</option>
                                        <option value="Niños">Niños</option>
                                        <option value="Niñas">Niñas</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mt-12 pt-10 border-t border-border/10 flex justify-end">
                                <Button
                                    onClick={handleSaveChanges}
                                    disabled={isSaving}
                                    className="px-12 h-16 rounded-2xl bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-widest gap-4 shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <Save className="w-6 h-6" />
                                    {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                                </Button>
                            </div>
                        </Card>

                        {/* Privilege Quick Actions Section */}
                        {roleActions.length > 0 && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-black tracking-tighter text-foreground uppercase italic flex items-center gap-4">
                                    <LayoutDashboard className="w-8 h-8 text-orange-400" />
                                    <span>Panel de <span className="text-orange-400 italic">Privilegios</span></span>
                                </h2>
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {roleActions.map((action, idx) => (
                                        <Card
                                            key={idx}
                                            onClick={() => router.push(action.href)}
                                            className={cn(
                                                "glass-card border-none cursor-pointer group transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] relative overflow-hidden",
                                                action.bgColor
                                            )}
                                        >
                                            <div className={cn("absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity", action.color)}>
                                                <action.icon className="w-24 h-24" />
                                            </div>
                                            <CardContent className="p-6">
                                                <div className="flex flex-col gap-4">
                                                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border transition-all group-hover:bg-white/10", action.borderColor)}>
                                                        <action.icon className={cn("w-6 h-6", action.color)} />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-black uppercase italic tracking-tight text-foreground">{action.title}</h3>
                                                        <p className="text-[10px] text-muted-foreground font-bold mt-1 leading-tight uppercase tracking-wider">{action.description}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <span className={cn("text-[8px] font-black uppercase tracking-widest", action.color)}>Acceder Ahora</span>
                                                        <ArrowLeft className={cn("w-3 h-3 rotate-180 transition-transform group-hover:translate-x-1", action.color)} />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Stats Detail Section */}
                        <div className="grid gap-6 md:grid-cols-3">
                            <Card className="glass-card bg-primary/5 border-primary/20 p-8 flex flex-col items-center justify-center text-center group">
                                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20 group-hover:scale-110 transition-transform">
                                    <Calendar className="w-8 h-8 text-primary" />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary/80 mb-2">Asistencia Total</p>
                                <h3 className="text-4xl font-black text-foreground italic">{currentUser.stats?.attendance?.attended || 0}</h3>
                                <p className="text-[9px] text-muted-foreground mt-4 font-bold uppercase tracking-tight">Servicios presentados</p>
                            </Card>

                            <Card className="glass-card bg-secondary/5 border-secondary/20 p-8 flex flex-col items-center justify-center text-center group">
                                <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6 border border-secondary/20 group-hover:scale-110 transition-transform">
                                    <Star className="w-8 h-8 text-secondary" />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-secondary/80 mb-2">Participaciones</p>
                                <h3 className="text-4xl font-black text-foreground italic">{currentUser.stats?.participation?.led || 0}</h3>
                                <p className="text-[9px] text-muted-foreground mt-4 font-bold uppercase tracking-tight">Como responsable / orador</p>
                            </Card>

                            <Card className="glass-card bg-orange-400/5 border-orange-400/20 p-8 flex flex-col items-center justify-center text-center group">
                                <div className="w-16 h-16 rounded-2xl bg-orange-400/10 flex items-center justify-center mb-6 border border-orange-400/20 group-hover:scale-110 transition-transform">
                                    <TrendingUp className="w-8 h-8 text-orange-400" />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-orange-400/80 mb-2">Medallas</p>
                                <h3 className="text-4xl font-black text-foreground italic">{currentUser.medals || 0}</h3>
                                <p className="text-[9px] text-muted-foreground mt-4 font-bold uppercase tracking-tight">Insignias de reconocimiento</p>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>

            {/* Profile Picture Modal */}
            <AnimatePresence>
                {imageToEdit && (
                    <ImageEditor
                        image={imageToEdit}
                        onSave={handleSaveImage}
                        onCancel={() => setImageToEdit(null)}
                        loading={isSaving}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
