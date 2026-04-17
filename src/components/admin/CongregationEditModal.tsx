import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Upload, User, MapPin, Phone, Text, Search, Check } from 'lucide-react';
import { CongregationInfo, UserProfile } from '@/lib/store';
import { cn } from '@/lib/utils';
import { TactileGlassCard, TactileInput } from './TactileUI';

interface Props {
    congregation: CongregationInfo;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updated: CongregationInfo) => void;
    members: UserProfile[];
    uploadAvatar: (path: string, file: File) => Promise<string | null>;
}

export const CongregationEditModal: React.FC<Props> = ({
    congregation,
    isOpen,
    onClose,
    onSave,
    members,
    uploadAvatar
}) => {
    const [formData, setFormData] = useState<CongregationInfo>({ ...congregation });
    const [isSaving, setIsSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showMemberPicker, setShowMemberPicker] = useState(false);

    const filteredMembers = useMemo(() => {
        if (!searchTerm.trim()) return members.slice(0, 10);
        return members
            .filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .slice(0, 5);
    }, [members, searchTerm]);

    const handleSave = async () => {
        setIsSaving(true);
        await onSave(formData);
        setIsSaving(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    onClick={onClose}
                />
                
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-4xl max-h-[90vh] bg-[var(--tactile-bg)] border border-[var(--tactile-border-strong)] rounded-xl shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="flex justify-between items-center p-8 border-b border-[var(--tactile-border)] bg-[var(--tactile-inner-bg-alt)]">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/20 rounded-md flex items-center justify-center border border-primary/30">
                                <MapPin className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black uppercase tracking-tighter text-foreground">Gestionar <span className="text-primary">Iglesia / Obra</span></h3>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] mt-1">Configuración detallada de obras y sede principal</p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose}
                            className="w-12 h-12 rounded-full hover:bg-[var(--tactile-item-hover)] flex items-center justify-center transition-colors text-muted-foreground hover:text-white"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                            
                            {/* Image Selection */}
                            <div className="lg:col-span-4 space-y-6">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">IMAGEN DEL LUGAR / IGLESIA</label>
                                <div 
                                    className="relative group aspect-[4/3] rounded-md border-2 border-dashed border-[var(--tactile-border-strong)] bg-[var(--tactile-inner-bg-alt)] overflow-hidden cursor-pointer"
                                    onClick={() => document.getElementById('cong-image-upload')?.click()}
                                >
                                    {formData.imageUrl ? (
                                        <img src={formData.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Church" />
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                                <Upload className="w-8 h-8 text-muted-foreground" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">SUBIR FOTO</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center flex-col gap-2">
                                        <Upload className="w-8 h-8 text-white" />
                                        <span className="text-[10px] font-black uppercase text-white tracking-widest">Cambiar Imagen</span>
                                    </div>
                                </div>
                                <input 
                                    type="file" 
                                    id="cong-image-upload" 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const url = await uploadAvatar(`church-${Date.now()}`, file);
                                            if (url) setFormData({ ...formData, imageUrl: url });
                                        }
                                    }}
                                />
                                <p className="text-[9px] text-muted-foreground leading-relaxed italic">
                                    * Se recomienda una imagen de alta resolución que muestre el frente del lugar o el logotipo oficial.
                                </p>
                            </div>

                            {/* Form Details */}
                            <div className="lg:col-span-8 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <TactileInput 
                                        label="NOMBRE OFICIAL" 
                                        value={formData.name} 
                                        onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
                                        icon={MapPin}
                                        placeholder="Ej: Rodeo CA"
                                    />
                                    <TactileInput 
                                        label="TELÉFONO DE CONTACTO" 
                                        value={formData.phone || ''} 
                                        onChange={(e: any) => setFormData({ ...formData, phone: e.target.value })}
                                        icon={Phone}
                                        placeholder="+1 (xxx) xxx-xxxx"
                                    />
                                </div>

                                <TactileInput 
                                    label="DIRECCIÓN FÍSICA" 
                                    value={formData.address || ''} 
                                    onChange={(e: any) => setFormData({ ...formData, address: e.target.value })}
                                    icon={MapPin}
                                    placeholder="Calle, número, ciudad, estado..."
                                />

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">DESCRIPCIÓN / RESEÑA</label>
                                    <div className="relative group">
                                        <div className="absolute top-4 left-4 text-muted-foreground">
                                            <Text className="w-5 h-5 opacity-30" />
                                        </div>
                                        <textarea 
                                            value={formData.description || ''}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            rows={3}
                                            className="w-full bg-[var(--tactile-inner-bg)] border border-[var(--tactile-border)] rounded-md p-4 pl-12 text-sm font-medium focus:border-primary/50 transition-all outline-none resize-none"
                                            placeholder="Breve historia o descripción de esta obra..."
                                        />
                                    </div>
                                </div>

                                {/* Responsible Person Picker */}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">RESPONSABLE DEL LUGAR</label>
                                    <div className="relative">
                                        <div className="flex gap-2">
                                            <div className="flex-1 h-14 bg-[var(--tactile-inner-bg)] border border-[var(--tactile-border)] rounded-md flex items-center px-4 relative group">
                                                <User className="w-5 h-5 text-muted-foreground mr-3" />
                                                <div className="flex-1 overflow-hidden">
                                                    {formData.responsibleName ? (
                                                        <span className="text-sm font-bold text-foreground">{formData.responsibleName}</span>
                                                    ) : (
                                                        <span className="text-sm font-bold text-muted-foreground italic">Sin asignar responsable...</span>
                                                    )}
                                                </div>
                                                <button 
                                                    onClick={() => setShowMemberPicker(!showMemberPicker)}
                                                    className="w-10 h-10 rounded-md bg-[var(--tactile-item-hover)] flex items-center justify-center hover:bg-primary/20 transition-colors"
                                                >
                                                    <Search className="w-4 h-4" />
                                                </button>
                                            </div>
                                            {formData.responsibleId && (
                                                <button 
                                                    onClick={() => setFormData({ ...formData, responsibleId: undefined, responsibleName: undefined })}
                                                    className="w-14 h-14 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-md flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>

                                        {showMemberPicker && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="absolute bottom-full left-0 right-0 mb-2 bg-[var(--tactile-panel-bg)] border border-[var(--tactile-border-strong)] rounded-lg shadow-2xl z-50 p-2 space-y-2"
                                            >
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                    <input 
                                                        autoFocus
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                        placeholder="Buscar por nombre..."
                                                        className="w-full h-11 bg-[var(--tactile-inner-bg)] border border-[var(--tactile-border)] rounded-md pl-10 pr-4 text-xs font-bold uppercase transition-all outline-none focus:border-primary"
                                                    />
                                                </div>
                                                <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                                                    {filteredMembers.map(m => (
                                                        <button 
                                                            key={m.id}
                                                            onClick={() => {
                                                                setFormData({ ...formData, responsibleId: m.id, responsibleName: m.name });
                                                                setShowMemberPicker(false);
                                                                setSearchTerm('');
                                                            }}
                                                            className="w-full p-3 rounded-md flex items-center justify-between hover:bg-white/5 transition-colors group"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10">
                                                                    <img src={m.avatar || `https://ui-avatars.com/api/?name=${m.name}`} className="w-full h-full object-cover" alt="" />
                                                                </div>
                                                                <div className="text-left">
                                                                    <p className="text-[11px] font-black uppercase text-foreground">{m.name}</p>
                                                                    <p className="text-[9px] font-bold uppercase text-muted-foreground opacity-60">{m.role}</p>
                                                                </div>
                                                            </div>
                                                            <Check className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        </button>
                                                    ))}
                                                    {filteredMembers.length === 0 && (
                                                        <div className="p-8 text-center text-[10px] uppercase font-bold text-muted-foreground">No se encontraron miembros</div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-8 border-t border-[var(--tactile-border)] bg-[var(--tactile-inner-bg-alt)] flex justify-end gap-4">
                        <button 
                            onClick={onClose}
                            className="px-8 h-14 rounded-md font-black uppercase tracking-widest text-xs text-muted-foreground hover:bg-white/5 transition-all"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={handleSave}
                            disabled={isSaving || !formData.name}
                            className="px-12 h-14 bg-primary text-foreground rounded-md shadow-[0_10px_30px_rgba(var(--primary-rgb),0.3)] font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:translate-y-[-2px] transition-all active:translate-y-0 disabled:opacity-50 disabled:translate-y-0"
                        >
                            <Save className="w-5 h-5" /> 
                            {isSaving ? 'GUARDANDO...' : 'GUARDAR CONFIGURACIÓN'}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
