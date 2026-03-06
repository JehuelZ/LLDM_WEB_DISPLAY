'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
    Star
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
    const [isSaving, setIsSaving] = useState(false);
    const [imageToEdit, setImageToEdit] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        setName(currentUser.name);
        setPhone(currentUser.phone);
        setCategory(currentUser.category);
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
                category: category as any
            });
            if (success) {
                setCurrentUser({
                    ...currentUser,
                    name,
                    phone,
                    category: category as any
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
                        <Card className="glass-card overflow-hidden border-none bg-foreground/5 backdrop-blur-xl">
                            <CardHeader className="p-8 text-center bg-gradient-to-br from-primary/10 via-transparent to-secondary/10">
                                <div className="relative mx-auto w-32 h-32 md:w-40 md:h-40 group cursor-pointer" onClick={handleAvatarClick}>
                                    <div className="w-full h-full rounded-[2.5rem] overflow-hidden border-2 border-primary/30 shadow-[0_20px_50px_rgba(59,130,246,0.3)] transition-transform group-hover:scale-[1.02] active:scale-[0.98]">
                                        <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="absolute inset-0 bg-black/60 rounded-[2.5rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="w-10 h-10 text-white" />
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary rounded-2xl flex items-center justify-center border-4 border-background shadow-lg shadow-primary/20">
                                        <Edit2 className="w-4 h-4 text-black" />
                                    </div>
                                </div>
                                <div className="mt-8 space-y-2">
                                    <h3 className="text-2xl font-black uppercase italic tracking-tight">{currentUser.name}</h3>
                                    <div className="flex items-center justify-center gap-2">
                                        <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase rounded-full">
                                            {currentUser.role}
                                        </span>
                                    </div>
                                </div>
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
                                        className="w-full h-14 px-6 rounded-2xl bg-foreground/5 border border-border/20 text-sm font-bold focus:ring-primary/40 text-foreground"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value as any)}
                                    >
                                        <option value="Varon">Varon</option>
                                        <option value="Hermana">Hermana</option>
                                        <option value="Niño">Niño</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Género</label>
                                    <div className="h-14 px-6 flex items-center bg-foreground/[0.02] border border-border/10 rounded-2xl select-none opacity-60">
                                        <span className="text-sm font-bold italic uppercase tracking-widest">{currentUser.gender}</span>
                                    </div>
                                    <p className="text-[9px] text-slate-600 ml-1 italic">* Bloqueado administrativamente</p>
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
