
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, Database, AlertTriangle, CheckCircle, 
    RefreshCw, User, Mail, ShieldAlert,
    ChevronRight, Loader2, ArrowRight,
    SearchX, Trash2
} from 'lucide-react';
import { useAppStore, UserProfile } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export const DatabaseDiagnostic: React.FC = () => {
    const { 
        members, 
        findProfileRaw, 
        repairProfileStatus, 
        loadMembersFromCloud,
        updateProfileInCloud,
        settings,
        showNotification
    } = useAppStore();

    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [rawResults, setRawResults] = useState<UserProfile[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [isRepairing, setIsRepairing] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        setIsSearching(true);
        setHasSearched(true);
        try {
            const results = await findProfileRaw(searchTerm);
            setRawResults(results);
        } catch (error) {
            console.error(error);
            showNotification('Error en la búsqueda de diagnóstico', 'error');
        } finally {
            setIsSearching(false);
        }
    };

    const handleRepair = async (userId: string, targetStatus: string) => {
        setIsRepairing(userId);
        try {
            const success = await repairProfileStatus(userId, targetStatus);
            if (success) {
                showNotification(`Estado '${targetStatus}' aplicado correctamente.`, 'success');
                // Refresh local search results
                setRawResults(prev => prev.map(u => u.id === userId ? { ...u, status: targetStatus as any } : u));
            } else {
                showNotification('Error al actualizar el estado', 'error');
            }
        } finally {
            setIsRepairing(null);
        }
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        setIsRepairing(userId);
        try {
            const currentPrivileges = rawResults.find(u => u.id === userId)?.privileges || [];
            let newPrivileges = [...currentPrivileges];
            
            // Auto-mapear privilegios al cambiar de rol manual
            if (newRole === 'Administrador' && !newPrivileges.includes('admin')) newPrivileges.push('admin', 'monitor');
            if (newRole === 'Responsable de Asistencia' && !newPrivileges.includes('monitor')) newPrivileges.push('monitor');
            if (newRole === 'Dirigente Coro Adultos' && !newPrivileges.includes('choir')) newPrivileges.push('choir');
            if (newRole === 'Encargado de Jóvenes' && !newPrivileges.includes('youth_leader')) newPrivileges.push('youth_leader');

            const success = await updateProfileInCloud(userId, { 
                role: newRole as any, 
                privileges: [...new Set(newPrivileges)] as any 
            });

            if (success) {
                showNotification(`Rol '${newRole}' asignado exitosamente.`, 'success');
                setRawResults(prev => prev.map(u => u.id === userId ? { ...u, role: newRole as any, privileges: [...new Set(newPrivileges)] as any } : u));
                loadMembersFromCloud(); // Sincronizar dashboard
            } else {
                showNotification('Error al asignar el rol', 'error');
            }
        } finally {
            setIsRepairing(null);
        }
    };

    const pendingCount = members.filter(m => (m.status as string) === 'Pendiente' || (m.status as string) === 'pendiente').length;
    const adminTheme = settings.adminTheme;

    return (
        <div className="space-y-10 py-4">
            {/* Header / Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className={cn(
                    "relative overflow-hidden group transition-all duration-500",
                    adminTheme === 'primitivo' ? "bg-[#101420] border-white/5" : "glass-card border-white/10"
                )}>
                    <div className="absolute top-0 right-0 p-6 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                        <Database className="w-24 h-24 text-primary" />
                    </div>
                    <CardHeader className="pb-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Registros en Memoria</p>
                    </CardHeader>
                    <CardContent>
                        <h3 className="text-4xl font-black text-foreground">{members.length}</h3>
                        <p className="text-[9px] font-bold text-slate-500 uppercase mt-2">Sincronizados con el Dashboard</p>
                    </CardContent>
                </Card>

                <Card className={cn(
                    "relative overflow-hidden group transition-all duration-500",
                    pendingCount > 0 ? "border-emerald-500/30" : "border-emerald-500/30",
                    adminTheme === 'primitivo' ? "bg-[#101420]" : "glass-card"
                )}>
                    <div className="absolute top-0 right-0 p-6 opacity-10 rotate-12">
                        <ShieldAlert className={cn("w-24 h-24", pendingCount > 0 ? "text-emerald-500" : "text-emerald-500")} />
                    </div>
                    <CardHeader className="pb-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Estados Pendientes</p>
                    </CardHeader>
                    <CardContent>
                        <h3 className={cn("text-4xl font-black", pendingCount > 0 ? "text-emerald-500" : "text-emerald-500")}>
                            {pendingCount}
                        </h3>
                        <p className="text-[9px] font-bold text-slate-500 uppercase mt-2">Requieren Auditoría Manual</p>
                    </CardContent>
                </Card>

                <div className="flex flex-col gap-4 justify-center">
                    <Button 
                        onClick={() => loadMembersFromCloud()}
                        className={cn(
                            "h-14 font-black uppercase tracking-widest gap-3 rounded-md group transition-all",
                            adminTheme === 'primitivo' ? "bg-emerald-600 hover:bg-emerald-500" : "bg-emerald-600 hover:bg-emerald-500"
                        )}
                    >
                        <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                        Forzar Recarga Completa
                    </Button>
                    <p className="text-[8px] text-center font-black text-slate-500 uppercase tracking-widest px-4">
                        * Limpia caché local y consulta la base de datos maestra
                    </p>
                </div>
            </div>

            {/* Powerful Search Tool */}
            <Card className={cn(
                "rounded-md overflow-hidden border-2",
                adminTheme === 'primitivo' ? "bg-[#0a0a0a] border-white/5" : "glass-card border-white/10"
            )}>
                <CardHeader className="p-10 border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-primary/20 rounded-md border border-primary/30">
                            <Search className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-3xl font-black uppercase tracking-tighter">Buscador Forense de Perfiles</CardTitle>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">
                                Consulta directa a la tabla Profiles • Omite filtros de interfaz
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-10 space-y-10">
                    <form onSubmit={handleSearch} className="relative group">
                        <div className={cn(
                            "absolute -inset-1 rounded-md blur-xl opacity-0 group-focus-within:opacity-20 transition-opacity duration-500",
                            adminTheme === 'primitivo' ? "bg-emerald-500" : "bg-primary"
                        )} />
                        
                        <div className="relative flex gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500" />
                                <Input 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="INGRESAR CORREO GMAIL COMPLETO O NOMBRE..."
                                    className="h-20 bg-white/5 border-white/10 pl-16 rounded-md text-lg font-black uppercase tracking-tight focus:border-primary/50 transition-all"
                                />
                            </div>
                            <Button 
                                type="submit" 
                                disabled={isSearching || !searchTerm}
                                className={cn(
                                    "h-20 px-10 rounded-md font-black uppercase tracking-widest text-lg gap-3",
                                    adminTheme === 'primitivo' ? "bg-primary text-black" : "bg-primary text-primary-foreground"
                                )}
                            >
                                {isSearching ? <Loader2 className="w-6 h-6 animate-spin" /> : <ArrowRight className="w-6 h-6" />}
                                BUSCAR
                            </Button>
                        </div>
                    </form>

                    <div className="space-y-6">
                        <AnimatePresence mode="wait">
                            {rawResults.length > 0 ? (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                >
                                    {rawResults.map((p) => (
                                        <div 
                                            key={p.id}
                                            className={cn(
                                                "p-6 rounded-md border transition-all duration-300 group/item relative overflow-hidden",
                                                adminTheme === 'primitivo' ? "bg-white/[0.02] border-white/5" : "bg-slate-900/40 border-white/10"
                                            )}
                                        >
                                            <div className="flex items-center gap-5 relative z-10">
                                                <div className="w-16 h-16 rounded-md overflow-hidden bg-slate-800 border-2 border-white/10">
                                                    {p.avatar ? (
                                                        <img src={p.avatar} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <User className="w-full h-full p-4 text-slate-600" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-xl font-black text-white uppercase tracking-tighter truncate">{p.name}</h4>
                                                    <p className="text-[10px] font-bold text-slate-400 truncate flex items-center gap-2">
                                                        <Mail className="w-3 h-3" /> {p.email}
                                                    </p>
                                                    
                                                    <div className="flex items-center gap-3 mt-3">
                                                        <span className={cn(
                                                            "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                                                            p.status === 'Activo' ? "bg-emerald-500/10 text-emerald-400" :
                                                            (p.status === 'Pendiente' || (p.status as string) === 'pendiente') ? "bg-emerald-500/10 text-emerald-500" :
                                                            "bg-slate-800 text-slate-400"
                                                        )}>
                                                            {p.status}
                                                        </span>
                                                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                                                            ID: {p.id.substring(0, 8)}...
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex flex-col gap-2 min-w-[140px]">
                                                    <div className="text-[8px] font-black text-slate-500 uppercase mb-1 ml-1">Estado</div>
                                                    <div className="flex gap-1">
                                                        {((p.status as any) === 'Pendiente' || (p.status as any) === 'pendiente') && (
                                                            <Button 
                                                                size="sm"
                                                                disabled={isRepairing === p.id}
                                                                onClick={() => handleRepair(p.id, 'Activo')}
                                                                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[9px] h-8 px-3 rounded-md"
                                                            >
                                                                APROBAR
                                                            </Button>
                                                        )}
                                                        {p.status === 'Activo' && (
                                                            <Button 
                                                                size="sm"
                                                                variant="outline"
                                                                disabled={isRepairing === p.id}
                                                                onClick={() => handleRepair(p.id, 'Pendiente')}
                                                                className="flex-1 border-emerald-500/30 text-emerald-500 font-black text-[9px] h-8 px-3 rounded-md hover:bg-emerald-500/10"
                                                            >
                                                                SUSPENDER
                                                            </Button>
                                                        )}
                                                    </div>

                                                    <div className="text-[8px] font-black text-slate-500 uppercase mt-2 mb-1 ml-1">Asignar Rol</div>
                                                    <select 
                                                        className="h-8 bg-slate-800 border border-white/5 rounded-md text-[10px] font-black text-white px-2 outline-none focus:border-primary/50"
                                                        value={p.role || 'Miembro'}
                                                        onChange={(e) => handleRoleChange(p.id, e.target.value)}
                                                        disabled={isRepairing === p.id}
                                                    >
                                                        <option value="Miembro">MIEMBRO</option>
                                                        <option value="Administrador">ADMINISTRADOR</option>
                                                        <option value="Responsable de Asistencia">REP. ASISTENCIA</option>
                                                        <option value="Dirigente Coro Adultos">DIR. CORO</option>
                                                        <option value="Encargado de Jóvenes">ENC. JÓVENES</option>
                                                        <option value="Ministro a Cargo">MINISTRO</option>
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Inconsistency Detection */}
                                            {(p.status as string) === 'pendiente' && (
                                                <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-md flex items-center gap-3">
                                                    <AlertTriangle className="w-4 h-4 text-emerald-500 shrink-0" />
                                                    <p className="text-[9px] font-black text-emerald-500 uppercase leading-tight">
                                                        Inconsistencia Detectada: Estado en minúsculas. Esto puede ocultar al usuario de la lista principal.
                                                    </p>
                                                    <Button 
                                                        size="sm"
                                                        onClick={() => handleRepair(p.id, 'Pendiente')}
                                                        className="ml-auto bg-emerald-500 text-black font-black text-[8px] h-7 px-3 rounded-md"
                                                    >
                                                        CORREGIR
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </motion.div>
                            ) : hasSearched && !isSearching ? (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col items-center justify-center p-20 text-center space-y-4"
                                >
                                    <div className="p-8 bg-slate-900 rounded-full border border-white/5">
                                        <SearchX className="w-16 h-16 text-slate-700" />
                                    </div>
                                    <h5 className="text-2xl font-black text-slate-400 uppercase tracking-tight">No se encontró el registro</h5>
                                    <p className="text-sm text-slate-500 max-w-md font-bold uppercase tracking-widest leading-loose">
                                        El usuario no existe en la base de datos de perfiles con este correo o nombre. Verifique que se registró correctamente.
                                    </p>
                                </motion.div>
                            ) : (
                                <div className="p-20 flex flex-col items-center justify-center text-center opacity-30">
                                    <Database className="w-16 h-16 text-slate-500 mb-6" />
                                    <p className="text-sm font-black uppercase tracking-[0.3em] text-slate-500">Esperando términos de búsqueda...</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Repair Section */}
            <Card className={cn(
                "rounded-md overflow-hidden group",
                adminTheme === 'primitivo' ? "bg-rose-500/[0.02] border-rose-500/10" : "bg-slate-900/40 border-white/10"
            )}>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-rose-500" />
                        <CardTitle className="text-xl font-black uppercase tracking-tighter text-rose-500">Mantenimiento Masivo</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                        Herramientas críticas para corregir la integridad de los datos. Use con precaución.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button 
                            variant="outline" 
                            className="h-16 rounded-md border-rose-500/30 text-rose-500 font-extrabold uppercase text-xs tracking-widest hover:bg-rose-500/5"
                            onClick={() => {
                                if(confirm('¿Buscar y arreglar automáticamente todos los estados en minúsculas?')) {
                                    const suspicious = members.filter(m => (m.status as string) === 'pendiente');
                                    if (suspicious.length === 0) {
                                        showNotification('No se encontraron estados inconsistentes automáticos.', 'info');
                                    } else {
                                        // Repair them
                                        Promise.all(suspicious.map(m => repairProfileStatus(m.id, 'Pendiente')));
                                        showNotification(`Se corrigieron ${suspicious.length} registros.`, 'success');
                                    }
                                }
                            }}
                        >
                            CORREGIR ESTADOS "pendiente" (MINÚSCULAS)
                        </Button>
                        <Button 
                            variant="outline" 
                            className="h-16 rounded-md border-white/10 text-slate-400 font-extrabold uppercase text-xs tracking-widest hover:bg-white/5"
                            onClick={() => {
                                showNotification('Herramientas avanzadas desactivadas en esta versión.', 'warning');
                            }}
                        >
                            REASIGNAR ROLES HUÉRFANOS
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
