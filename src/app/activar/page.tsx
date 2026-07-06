'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { ChurchIcon, KeyRound, ShieldCheck, UserCheck, AlertCircle, Loader2, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';

type Step = 'verificar' | 'crear_cuenta' | 'exito';

interface MemberFound {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  portal_habilitado: boolean;
  auth_user_id: string | null;
  portal_invite_token?: string | null;
  portal_invite_expires?: string | null;
}

function ActivarContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [step, setStep] = useState<Step>('verificar');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Paso 1 — verificar identidad
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');

  // Paso 2 — crear cuenta
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [memberFound, setMemberFound] = useState<MemberFound | null>(null);

  // Si viene con token, verificar automáticamente
  useEffect(() => {
    if (token) {
      verificarToken(token);
    }
  }, [token]);

  const verificarToken = async (inviteToken: string) => {
    setIsLoading(true);
    setError('');
    try {
      const { data, error: dbError } = await supabase
        .rpc('verify_invite_token', { p_token: inviteToken });

      if (dbError || !data || data.length === 0) {
        setError('Este link de invitación no es válido, ha expirado o ya fue usado.');
        return;
      }

      const member = data[0];
      setMemberFound({
        id: member.id,
        name: member.name,
        email: member.email,
        phone: '',
        portal_habilitado: member.portal_habilitado,
        auth_user_id: null
      });
      if (member.email) setEmail(member.email);
      setStep('crear_cuenta');
    } catch {
      setError('Ocurrió un error al verificar el link. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const verificarIdentidad = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !telefono.trim()) {
      setError('Ingresa tu nombre y teléfono tal como están registrados.');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      // Buscar miembro por nombre parcial + teléfono exacto usando RPC segura
      const { data, error: dbError } = await supabase
        .rpc('verify_member_for_activation', { p_name: nombre.trim(), p_phone: telefono.trim() });

      if (dbError) throw dbError;

      if (!data || data.length === 0) {
        setError('No encontramos tu registro. Verifica tu nombre y teléfono, o habla con un líder.');
        return;
      }

      const member = data[0];

      if (!member.portal_habilitado) {
        setError('Tu acceso al portal aún no ha sido habilitado. Habla con un líder para activarlo.');
        return;
      }

      setMemberFound({
        id: member.id,
        name: member.name,
        phone: member.phone,
        email: member.email,
        portal_habilitado: member.portal_habilitado,
        auth_user_id: null
      });
      if (member.email) setEmail(member.email);
      setStep('crear_cuenta');
    } catch {
      setError('Error al verificar tu información. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const crearCuenta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberFound) return;

    if (!email.trim()) { setError('El email es requerido.'); return; }
    if (password.length < 8) { setError('La contraseña debe tener al menos 8 caracteres.'); return; }
    if (password !== confirmPassword) { setError('Las contraseñas no coinciden.'); return; }

    setIsLoading(true);
    setError('');

    try {
      // 1. Reclamar el portal (asociar correo vía RPC de forma segura antes de sign up)
      const { data: claimSuccess, error: claimError } = await supabase
        .rpc('claim_member_portal', { p_profile_id: memberFound.id, p_email: email.trim() });

      if (claimError || !claimSuccess) {
        setError('No se pudo verificar el reclamo de la cuenta. Asegúrate de que tu acceso esté habilitado.');
        return;
      }

      // 2. Crear cuenta en Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { name: memberFound.name }
        }
      });

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          setError('Este email ya tiene una cuenta. ¿Ya te registraste? Ve a /login.');
        } else {
          setError(`Error al crear cuenta: ${signUpError.message}`);
        }
        return;
      }

      if (!authData.user) { setError('No se pudo crear la cuenta. Intenta de nuevo.'); return; }

      // Nota: Al iniciar sesión por primera vez, syncUserWithCloud de Zustand
      // se encargará de vincular auth_user_id en el perfil automáticamente.
      setStep('exito');
    } catch {
      setError('Ocurrió un error inesperado. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-400/3 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 mb-4">
            <ChurchIcon className="w-8 h-8 text-orange-400" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">LLDM Rodeo</h1>
          <p className="text-sm text-white/40 mt-1">Portal del Miembro</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* ── PASO 1: VERIFICAR IDENTIDAD ── */}
          {step === 'verificar' && (
            <motion.div
              key="verificar"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              className="bg-white/[0.04] border border-white/10 rounded-2xl p-8 backdrop-blur-xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-orange-500/15 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-orange-400" />
                </div>
                <div>
                  <h2 className="text-white font-semibold text-lg">Verifica tu identidad</h2>
                  <p className="text-white/40 text-xs">Solo miembros registrados pueden activar una cuenta</p>
                </div>
              </div>

              <form onSubmit={verificarIdentidad} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={e => { setNombre(e.target.value); setError(''); }}
                    placeholder="Como está en tu registro de miembro"
                    className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/25 focus:outline-none focus:border-orange-500/50 focus:bg-white/[0.08] transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">
                    Teléfono registrado
                  </label>
                  <input
                    type="tel"
                    value={telefono}
                    onChange={e => { setTelefono(e.target.value); setError(''); }}
                    placeholder="Número exacto en el sistema"
                    className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/25 focus:outline-none focus:border-orange-500/50 focus:bg-white/[0.08] transition-all text-sm"
                  />
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
                  >
                    <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                    <p className="text-red-300 text-sm">{error}</p>
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-orange-500 hover:bg-orange-400 disabled:bg-orange-500/40 text-white font-semibold rounded-xl px-4 py-3 flex items-center justify-center gap-2 transition-all duration-200 text-sm"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Verificar mi registro
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-xs text-white/25 mt-6">
                ¿Ya tienes cuenta?{' '}
                <button onClick={() => router.push('/login')} className="text-orange-400/70 hover:text-orange-400 transition-colors">
                  Inicia sesión aquí
                </button>
              </p>
            </motion.div>
          )}

          {/* ── PASO 2: CREAR CUENTA ── */}
          {step === 'crear_cuenta' && memberFound && (
            <motion.div
              key="crear"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              className="bg-white/[0.04] border border-white/10 rounded-2xl p-8 backdrop-blur-xl"
            >
              {/* Miembro encontrado */}
              <div className="flex items-center gap-3 mb-6 p-4 bg-green-500/8 border border-green-500/20 rounded-xl">
                <UserCheck className="w-5 h-5 text-green-400 shrink-0" />
                <div>
                  <p className="text-green-300 font-semibold text-sm">✅ Registro encontrado</p>
                  <p className="text-white/50 text-xs">{memberFound.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-orange-500/15 flex items-center justify-center">
                  <KeyRound className="w-4 h-4 text-orange-400" />
                </div>
                <div>
                  <h2 className="text-white font-semibold text-lg">Crea tu acceso</h2>
                  <p className="text-white/40 text-xs">Elige el email y contraseña para tu portal</p>
                </div>
              </div>

              <form onSubmit={crearCuenta} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">
                    Email de acceso
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(''); }}
                    placeholder="tu@email.com"
                    className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/25 focus:outline-none focus:border-orange-500/50 focus:bg-white/[0.08] transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => { setPassword(e.target.value); setError(''); }}
                      placeholder="Mínimo 8 caracteres"
                      className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder:text-white/25 focus:outline-none focus:border-orange-500/50 focus:bg-white/[0.08] transition-all text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">
                    Confirmar contraseña
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => { setConfirmPassword(e.target.value); setError(''); }}
                    placeholder="Repite la contraseña"
                    className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/25 focus:outline-none focus:border-orange-500/50 focus:bg-white/[0.08] transition-all text-sm"
                  />
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
                  >
                    <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                    <p className="text-red-300 text-sm">{error}</p>
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-orange-500 hover:bg-orange-400 disabled:bg-orange-500/40 text-white font-semibold rounded-xl px-4 py-3 flex items-center justify-center gap-2 transition-all duration-200 text-sm"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Activar mi cuenta
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {/* ── PASO 3: ÉXITO ── */}
          {step === 'exito' && (
            <motion.div
              key="exito"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/[0.04] border border-white/10 rounded-2xl p-8 backdrop-blur-xl text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 mb-6"
              >
                <CheckCircle2 className="w-10 h-10 text-green-400" />
              </motion.div>

              <h2 className="text-white font-bold text-2xl mb-2">¡Cuenta activada!</h2>
              <p className="text-white/50 text-sm mb-2">
                Bienvenido al Portal de Miembro de LLDM Rodeo.
              </p>
              {memberFound && (
                <p className="text-orange-400 font-semibold text-sm mb-8">{memberFound.name}</p>
              )}

              <div className="space-y-3">
                <button
                  onClick={() => router.push('/login')}
                  className="w-full bg-orange-500 hover:bg-orange-400 text-white font-semibold rounded-xl px-4 py-3 flex items-center justify-center gap-2 transition-all duration-200 text-sm"
                >
                  Ir a mi portal
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-white/25 text-xs">
                  Revisa tu email para confirmar tu cuenta si es necesario.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <p className="text-center text-xs text-white/15 mt-8">
          La Luz del Mundo — Congregación Rodeo
        </p>
      </div>
    </div>
  );
}

export default function ActivarPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-orange-400 animate-spin" />
      </div>
    }>
      <ActivarContent />
    </Suspense>
  );
}
