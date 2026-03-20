
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
    Users, 
    Calendar, 
    TrendingUp, 
    ChevronLeft, 
    ChevronRight, 
    ChevronDown,
    Activity,
    Search,
    UserPlus,
    Layout,
    BarChart3,
    Settings as SettingsIcon,
    Bell,
    Monitor,
    Shield,
    Database,
    Clock,
    LogOut,
    CheckCircle2,
    XCircle,
    MoreHorizontal,
    Eye,
    Terminal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import Link from 'next/link';

// Componente Donut Premium al estilo Luna
// Componente Donut Premium al estilo Luna (Refinado según imagen)
const LunaDonut = ({ value, color, colorEnd, label }: { value: number; color?: string; colorEnd?: string; label: string }) => {
    const radius = 42;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;
    
    return (
        <div className="relative flex flex-col items-center justify-between h-full py-4 group font-[family-name:var(--font-saira)]">
            {/* Title from Reference (Top) */}
            <h4 className="text-[13px] font-[200] text-white tracking-wider mb-8 ">{label}</h4>

            <div className="relative flex items-center justify-center">
                <svg className="w-48 h-48 transform -rotate-90 scale-100 transition-transform duration-700 overflow-visible">
                    <defs>
                        <linearGradient id={`grad-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={color || '#cc9900'} />
                            <stop offset="100%" stopColor={colorEnd || '#b45309'} />
                        </linearGradient>
                        <filter id={`glow-${label}`} x="-60%" y="-60%" width="220%" height="220%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>
                    
                    {/* Track */}
                    <circle cx="96" cy="96" r={radius} stroke="#525469" strokeWidth="6" fill="transparent" />
                    
                    {/* Background definition border */}
                    <circle
                        cx="96" cy="96" r={radius} stroke="rgba(0,0,0,0.4)" strokeWidth="10"
                        strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" fill="transparent"
                    />

                    {/* Active Progress */}
                    <circle
                        cx="96" cy="96" r={radius} stroke={`url(#grad-${label})`} strokeWidth="6"
                        strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
                        fill="transparent" filter={`url(#glow-${label})`} className="transition-all duration-[1s] ease-in-out"
                    />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-4xl font-[200] tracking-tighter text-white">{value}%</span>
                </div>
            </div>

            {/* Legend from Reference (Bottom) */}
            <div className="flex items-center justify-center gap-12 w-full mt-10">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-1.5 rounded-full" style={{ background: color || '#cc9900' }} />
                    <span className="text-[11px] font-[100] text-white">{value.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-5 h-1.5 rounded-full bg-[#525469]" />
                    <span className="text-[11px] font-[100] text-white">{((100-value)/100 * 1500).toFixed(0)}</span>
                </div>
            </div>
        </div>
    );
};

const LunaAdmin = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [hoveredMonth, setHoveredMonth] = useState<number | null>(7);
    const [stats, setStats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    const { 
        members, 
        settings, 
        setSettings, 
        saveSettingsToCloud, 
        signOut, 
        loadDetailedWeeklyStats,
        currentDate,
        attendanceRecords
    } = useAppStore();

    // Cargar estadísticas de la semana actual
    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            const days = Array.from({ length: 7 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - (6 - i));
                return date.toISOString().split('T')[0];
            });
            
            try {
                const data = await loadDetailedWeeklyStats(days);
                setStats(data || []);
            } catch (err) {
                console.error("Error cargando stats:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [loadDetailedWeeklyStats]);

    // Métricas calculadas en tiempo real
    const totalMembersCount = members.length;
    const activeMembersCount = members.filter(m => m.status === 'Activo').length;
    const todayRecords = attendanceRecords?.[currentDate] || [];
    const presentTodayCount = todayRecords.filter(r => r.present).length;
    const attendancePercentage = activeMembersCount > 0 
        ? Math.round((presentTodayCount / activeMembersCount) * 100) 
        : 0;

    // Rango de semana para el encabezado
    const weekRange = (() => {
        if (!stats.length) return "...";
        try {
            const start = new Date(stats[0].date);
            const end = new Date(stats[stats.length - 1].date);
            return `semana del ${format(start, 'd MMM', { locale: es })} al ${format(end, 'd MMM', { locale: es })}`.toLowerCase();
        } catch (e) {
            return "semana actual";
        }
    })();
    
    // Datos simulados para la tendencia neón (0-100%)
    const trendData = [
        { label: 'ENE', value: 45 },
        { label: 'FEB', value: 38 },
        { label: 'MAR', value: 55 },
        { label: 'ABR', value: 48 },
        { label: 'MAY', value: 65 },
        { label: 'JUN', value: 72 },
        { label: 'JUL', value: 88 },
        { label: 'AGO', value: 80 }
    ];

    // Calcula la posición Y en la gráfica (invirtiendo la escala de 0-100 a 100-0)
    const getY = (val: number) => 100 - (val * 0.85 + 10);
    // Calcula la posición X basada en el índice (20 a 380)
    const getX = (i: number) => 20 + (i * 360 / (trendData.length - 1));

    const pathData = `M 20,${getY(trendData[0].value)} ` + 
        trendData.map((d, i) => {
            if (i === 0) return '';
            const prevX = getX(i - 1);
            const prevY = getY(trendData[i - 1].value);
            const currX = getX(i);
            const currY = getY(d.value);
            return `C ${prevX + 40},${prevY} ${currX - 40},${currY} ${currX},${currY}`;
        }).join(' ');

    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        const svg = e.currentTarget;
        const rect = svg.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;
        
        // Mapear el clic al índice más cercano
        const normalizedX = (x / width) * 440 - 20; // Ajuste por el viewBox expandido si lo hubiera, o escala 400
        const index = Math.min(Math.max(Math.round(((normalizedX - 20) / 360) * (trendData.length - 1)), 0), trendData.length - 1);
        setHoveredMonth(index);
    };

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: Layout },
        { id: 'miembros', label: 'Miembros', icon: Users },
        { id: 'reportes', label: 'Reportes', icon: BarChart3 },
        { id: 'configuracion', label: 'Configuración', icon: SettingsIcon },
    ];

    return (
        <div className="flex h-screen text-white overflow-hidden font-[family-name:var(--font-saira)] font-[100] selection:bg-primary/30"
             style={{ background: 'linear-gradient(225deg, #626c87 0%, #2b3043 100%)' }}>
            {/* Minimalist Industrial Sidebar */}
            <aside 
                className="w-80 border-r border-white/5 flex flex-col relative z-20"
                style={{ background: 'linear-gradient(225deg, #2b2e41 0%, #1b1d2c 100%)' }}
            >
                <div className="p-12 mb-10">
                    <div className="flex items-center gap-6 group cursor-pointer">
                        <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl group-hover:border-white transition-all rounded-none">
                            <Terminal className="text-white w-6 h-6 group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-2xl font-[200] tracking-tighter leading-none text-white">luna <span className="text-white">edition</span></h1>
                            <p className="text-[9px] font-[100] text-white tracking-[0.5em] mt-2">observatorio v3.0</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-8 space-y-4 overflow-y-auto no-scrollbar">
                    {[
                        { id: 'dashboard', label: 'dashboard', icon: Layout },
                        { id: 'miembros', label: 'registry', icon: Users },
                        { id: 'reportes', label: 'intelligence', icon: BarChart3 },
                        { id: 'cloud', label: 'cloud access', icon: Database },
                        { id: 'configuracion', label: 'configuration', icon: SettingsIcon },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as any)}
                            className={cn(
                                "w-full flex items-center gap-6 px-4 py-4 transition-all duration-500 group relative rounded-none",
                                activeTab === item.id ? "bg-white/5 text-white" : "text-white hover:text-white"
                            )}
                        >
                            {activeTab === item.id && <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white shadow-[0_0_15px_white]" />}
                            <item.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110 text-white")} />
                            <span className={cn("text-[11px] font-[100] tracking-[0.4em] transition-all text-white", activeTab === item.id ? "font-[200]" : "")}>{item.label}</span>
                        </button>
                    ))}
                    
                    <div className="pt-16 pb-6">
                        <div className="h-[1px] w-full bg-white/5" />
                    </div>

                    <p className="px-4 text-[9px] font-[100] text-white tracking-[0.4em] mb-6">execution roles</p>
                    {['minister', 'coro', 'monitor'].map((role) => (
                        <button key={role} className="w-full flex items-center gap-6 px-4 py-3 text-white hover:text-white transition-all group rounded-none">
                            <Eye className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] font-[100] tracking-[0.3em] font-[100] text-white">{role}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-12 border-t border-white/5">
                    <button onClick={() => signOut()} className="w-full flex items-center gap-6 px-6 py-5 bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all group relative overflow-hidden rounded-none">
                        <LogOut className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                        <span className="text-[11px] font-[200] tracking-[0.3em] text-white">system exit</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto bg-transparent custom-scrollbar p-12 lg:p-20 relative">
                <div className="max-w-7xl mx-auto space-y-20">
                    <header className="flex justify-between items-start mb-24 gap-12">
                        <div className="space-y-6">
                            <h2 className="text-[11px] font-[100] text-white  tracking-[0.8em]">Operational Intelligence</h2>
                            <h3 className="text-7xl font-[200] tracking-tighter text-white leading-none ">LUNA <span className="text-white font-[200] italic ml-2">DASHBOARD</span></h3>
                        </div>
                        <div 
                            className="flex items-center gap-6 px-10 py-6 shadow-[0_32px_64px_rgba(0,0,0,0.6)] relative overflow-hidden group rounded-none border-none"
                            style={{ background: 'linear-gradient(225deg, #2b2e41 0%, #1b1d2c 100%)' }}
                        >
                            <div className="absolute inset-0 bg-emerald-500/5  group-hover:scale-110 transition-opacity" />
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_#10b981]" />
                            <span className="text-[11px] font-[100] tracking-[0.5em] text-white ">SYSTEM STATUS: OPTIMIZED</span>
                        </div>
                    </header>

                    {activeTab === 'dashboard' && (
                        <div className="space-y-12">
                            {/* ROW 1: Distribution & Trend */}
                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                                {/* Weekly Distribution: Segmented Reference Style */}
                                <div 
                                    className="lg:col-span-2 p-12 shadow-[0_32px_64px_rgba(0,0,0,0.6)] relative overflow-hidden group rounded-none border-none"
                                    style={{ background: 'linear-gradient(225deg, #2b2e41 0%, #1b1d2c 100%)' }}
                                >
                                    <div className="flex justify-between items-center mb-16 relative z-10">
                                        {/* Left Side: Categories Only */}
                                        <div className="flex gap-8">
                                            {[
                                                { label: 'morning', color: '#10b981' },
                                                { label: 'intermediate', color: '#6366f1' },
                                                { label: 'evening', color: '#f59e0b' }
                                            ].map((seg, idx) => (
                                                <div key={idx} className="flex items-center gap-3">
                                                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: seg.color }} />
                                                    <span className="text-[10px] font-[100] text-white tracking-[0.3em] lowercase">{seg.label}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Right Side: Week Selector & Action */}
                                        <div className="flex items-center gap-10">
                                            <button 
                                                onClick={() => {
                                                    if(confirm('¿poblar semana actual?')) {
                                                        // logic for seeding
                                                    }
                                                }}
                                                className="text-[9px] font-[200] text-white border border-white/20 px-4 py-1.5 hover:bg-white/5 transition-colors tracking-widest lowercase"
                                            >
                                                poblar semana
                                            </button>
                                            <div className="flex items-center gap-4 text-white">
                                                <ChevronLeft className="w-4 h-4 cursor-pointer hover:text-white/50" />
                                                <span className="text-[11px] font-[100] tracking-widest lowercase">13 mar - 19 mar</span>
                                                <ChevronRight className="w-4 h-4 cursor-pointer hover:text-white/50" />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="h-64 flex items-end justify-between gap-4 relative z-10 px-2 mt-8">
                                        {stats.map((day, i) => {
                                            const total = (day.morning || 0) + (day.intermediate || 0) + (day.evening || 0) || 1;
                                            return (
                                                <div key={i} className="flex-1 flex flex-col items-center gap-3 h-full group/bar">
                                                    <div className="flex-1 w-3 mx-auto bg-white/[0.02] relative overflow-hidden flex flex-col justify-end gap-1.5 rounded-full">
                                                        {/* Segmented Bars: Slim & Rounded Style */}
                                                        <div 
                                                            className="w-full bg-[#f59e0b] shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-all duration-1000 rounded-full" 
                                                            style={{ height: `${(day.evening / total) * day.percentage}%` }} 
                                                        />
                                                        <div 
                                                            className="w-full bg-[#6366f1] shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all duration-1000 rounded-full" 
                                                            style={{ height: `${(day.intermediate / total) * day.percentage}%` }} 
                                                        />
                                                        <div 
                                                            className="w-full bg-[#10b981] shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all duration-1000 rounded-full" 
                                                            style={{ height: `${(day.morning / total) * day.percentage}%` }} 
                                                        />
                                                    </div>
                                                    <span className="text-[10px] font-[100] text-white tracking-widest group-hover/bar:text-white transition-colors">{['lun','ma','mi','ju','ve','sa','do'][i]}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Membership Trend: Neon & Interactive */}
                                <div 
                                    className="lg:col-span-3 p-12 shadow-[0_32px_64px_rgba(0,0,0,0.8)] relative overflow-hidden rounded-none border-none"
                                    style={{ background: 'linear-gradient(225deg, #2b2e41 0%, #1b1d2c 100%)' }}
                                >
                                    <div className="flex justify-between items-start mb-8 relative z-10">
                                        <div className="space-y-4">
                                            <h3 className="text-[13px] font-[200] tracking-wider text-white ">growth projections</h3>
                                            <div className="flex items-center gap-6">
                                                <span className="text-5xl font-[200] tracking-tighter text-white">+28.4%</span>
                                                <span className="text-[10px] font-[200] text-white border border-white/30 bg-white/5 px-3 py-1 tracking-widest">target met</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* SVG Line Chart (Reference Style) */}
                                    <div className="h-64 relative mt-12">
                                        <svg viewBox="0 0 400 100" className="w-full h-full overflow-visible">
                                            <defs>
                                                <filter id="neonPathGlow" x="-20%" y="-20%" width="140%" height="140%">
                                                    <feGaussianBlur stdDeviation="5" result="blur" />
                                                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                                </filter>
                                                <linearGradient id="neon-grad-line" x1="0%" y1="0%" x2="100%" y2="0%">
                                                    <stop offset="0%" stopColor="#f59e0b" />
                                                    <stop offset="100%" stopColor="#b45309" />
                                                </linearGradient>
                                            </defs>
                                            
                                            {/* Minimal Horizontal Grid */}
                                            {[0, 1, 2, 3].map(i => (
                                                <line key={i} x1="0" y1={i * 33} x2="400" y2={i * 33} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                                            ))}

                                            {/* Glowing Smooth Curve */}
                                            <path 
                                                d="M 0,80 C 50,70 100,100 150,60 C 200,20 250,90 300,50 C 350,10 400,60 450,40"
                                                fill="none"
                                                stroke="url(#neon-grad-line)"
                                                strokeWidth="4"
                                                strokeLinecap="round"
                                                filter="url(#neonPathGlow)"
                                                style={{ vectorEffect: 'non-scaling-stroke' }}
                                            />
                                            
                                            {/* Reference Highlight Point */}
                                            <circle cx="280" cy="55" r="6" fill="white" />
                                            <circle cx="280" cy="55" r="10" stroke="#f59e0b" strokeWidth="2" fill="none" filter="url(#neonPathGlow)" />
                                        </svg>
                                        
                                        {/* X-Axis from Reference */}
                                        <div className="flex justify-between w-full mt-12 px-2">
                                            {['lu', 'ma', 'mi', 'ju', 'vi', 'sa', 'do'].map(day => (
                                                <span key={day} className="text-[10px] font-[100] text-white tracking-widest">{day}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ROW 2: Membership, Attendance, Performance */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                                {/* Card: Members */}
                                <div 
                                    className="p-12 shadow-[0_32px_64px_rgba(0,0,0,0.6)] flex flex-col justify-between min-h-[450px] group transition-all duration-700 rounded-none border-none"
                                    style={{ background: 'linear-gradient(225deg, #2b2e41 0%, #1b1d2c 100%)' }}
                                >
                                    <div className="space-y-8">
                                        <h4 className="text-[11px] font-[200] tracking-[0.8em] text-white">node registry</h4>
                                        <div className="text-[140px] font-[100] tracking-tighter text-white leading-none -ml-4">{activeMembersCount}</div>
                                    </div>
                                    <div className="flex items-center gap-6 text-[12px] font-[100] tracking-[0.5em] text-emerald-400">
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_15px_#10b981] animate-pulse" />
                                        <span className="text-white">Identity: Verified</span>
                                    </div>
                                                             {/* Card: Attendance */}
                                <div 
                                    className="p-12 shadow-[0_32px_64px_rgba(0,0,0,0.6)] flex flex-col justify-between min-h-[450px] rounded-none border-none"
                                    style={{ background: 'linear-gradient(225deg, #2b2e41 0%, #1b1d2c 100%)' }}
                                >
                                    <h4 className="text-[11px] font-[200] tracking-[0.8em] text-white">active density</h4>
                                    <div className="flex items-center justify-center scale-125 my-8">
                                        <LunaDonut value={attendancePercentage} color="#cc9900" colorEnd="#ffff00" label="current" />
                                    </div>
                                    <div className="flex justify-between items-end pt-8 text-[12px] font-[100] tracking-widest text-white">
                                        <span className="text-white">registered</span>
                                        <span className="text-3xl font-[200] text-white">{presentTodayCount}</span>
                                    </div>
                                </div>

                                {/* Card: Performance */}
                                <div 
                                    className="p-12 shadow-[0_32px_64px_rgba(0,0,0,0.6)] flex flex-col justify-between min-h-[450px] rounded-none border-none"
                                    style={{ background: 'linear-gradient(225deg, #2b2e41 0%, #1b1d2c 100%)' }}
                                >
                                    <h4 className="text-[11px] font-[200] tracking-[0.8em] text-white">core utilization</h4>
                                    <div className="flex items-center justify-center scale-125 my-8">
                                        <LunaDonut value={82} label="load" />
                                    </div>
                                </div>
                            </div>
    </div>

                            {/* ROW 3: TV Status and Logs */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pb-32">
                                <div 
                                    className="p-12 shadow-[0_32px_64px_rgba(0,0,0,0.6)] rounded-none border-none"
                                    style={{ background: 'linear-gradient(225deg, #2b2e41 0%, #1b1d2c 100%)' }}
                                >
                                    <h3 className="text-[11px] font-[200]  tracking-[0.8em] text-white mb-20 text-left">output nodes</h3>
                                    <div className="h-64 flex items-end justify-around gap-10">
                                        {[
                                            { label: 'TV-01', value: 94, color: '#3b82f6' },
                                            { label: 'TV-02', value: 32, color: '#f59e0b' },
                                            { label: 'TV-03', value: 88, color: '#10b981' },
                                            { label: 'TV-04', value: 12, color: '#ef4444' }
                                        ].map((tv, i) => (
                                            <div key={i} className="flex-1 flex flex-col items-center gap-8 h-full group">
                                                <div className="flex-1 w-full bg-white/[0.01] relative overflow-hidden flex flex-col justify-end">
                                                    <div 
                                                        className="w-full transition-all duration-[2s] shadow-[0_-4px_15px_rgba(255,255,255,0.05)]"
                                                        style={{ height: `${tv.value}%`, background: tv.color, boxShadow: `0 0 30px ${tv.color}40` }}
                                                    />
                                                </div>
                                                <span className="text-[11px] font-[100]  tracking-[0.3em] text-white group-hover:text-white transition-all">{tv.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div 
                                    className="lg:col-span-2 p-12 shadow-[0_32px_64px_rgba(0,0,0,0.6)] rounded-none border-none"
                                    style={{ background: 'linear-gradient(225deg, #2b2e41 0%, #1b1d2c 100%)' }}
                                >
                                    <h3 className="text-[11px] font-[200]  tracking-[0.8em] text-white mb-20">intelligence stream</h3>
                                    <div className="space-y-12">
                                        {[
                                            { time: '14:20:05', text: 'Quantum synchronization success: A. Sanchez verified' },
                                            { time: '12:05:12', text: 'Autonomous data backup completed on primary sector' },
                                            { time: '11:45:00', text: 'Luna Protocol: Display initialization sequence: 100%' }
                                        ].map((log, i) => (
                                            <div key={i} className="flex items-start gap-16 group border-b border-white/5 pb-12 last:border-0 hover:bg-white/[0.01] transition-all">
                                                <span className="text-[12px] font-[200] text-primary italic  tracking-[0.4em] w-32 pt-1">{log.time}</span>
                                                <p className="flex-1 text-[14px] font-[100] tracking-[0.4em] text-white group-hover:text-white transition-all duration-500 ">
                                                    {log.text}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'configuracion' && (
                        <div className="max-w-4xl py-12 space-y-20">
                            <div className="space-y-4">
                                <h3 className="text-7xl font-[200] italic tracking-tighter leading-none text-white">system <span className="text-white font-[200]">preferences</span></h3>
                                <p className="text-[11px] font-[100] text-white tracking-[0.8em]">core architecture control</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-12 p-12 bg-[#161821] border border-white/[0.03] shadow-2xl">
                                    <div className="flex items-center gap-6">
                                        <Monitor className="text-white w-6 h-6" />
                                        <h4 className="text-[12px] font-[100]  tracking-[0.4em]">visual interface</h4>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-white/5 pb-8">
                                        <span className="text-[11px] font-[100]  tracking-[0.2em] text-white">global font weight</span>
                                        <select 
                                            value={settings.fontWeight || 'font-thin'}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setSettings({ fontWeight: val });
                                                saveSettingsToCloud({ fontWeight: val });
                                            }}
                                            className="bg-black/50 border border-white/10 text-[11px] font-[100] px-6 py-3  outline-none focus:border-primary transition-all text-white cursor-pointer"
                                        >
                                            <option value="font-thin">EXTRA LIGHT [LUNA]</option>
                                            <option value="font-[100]">LIGHT</option>
                                            <option value="font-normal">REGULAR</option>
                                            <option value="font-[100]">BOLD</option>
                                        </select>
                                    </div>
                                    <p className="text-[10px] text-white italic tracking-widest leading-relaxed">
                                        Adjusting the font weight affects the clarity of data visualization on high-resolution displays. Luna Premium is optimized for Extra Light.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    </div>
                </main>
            </div>
    );
};

export default LunaAdmin;
