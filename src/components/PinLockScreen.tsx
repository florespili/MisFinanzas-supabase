import React, { useState, useEffect } from 'react';
import { FinanceService } from '../services/supabase.ts';
import { Lock, ShieldCheck, Database, KeyRound, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

interface PinLockScreenProps {
  onUnlock: () => void;
  onOpenSupabaseConfig: () => void;
}

export const PinLockScreen: React.FC<PinLockScreenProps> = ({ onUnlock, onOpenSupabaseConfig }) => {
  const [pin, setPin] = useState<string>('');
  const [confirmPin, setConfirmPin] = useState<string>('');
  const [isSetupMode, setIsSetupMode] = useState<boolean>(false);
  const [setupStep, setSetupStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [storageMode, setStorageMode] = useState<'supabase' | 'local'>('local');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isShaking, setIsShaking] = useState<boolean>(false);

  const finance = FinanceService.getInstance();

  useEffect(() => {
    checkPinStatus();
  }, []);

  const checkPinStatus = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const { configured, mode } = await finance.isPinConfigured();
      setStorageMode(mode);
      setIsSetupMode(!configured);
    } catch (e) {
      console.error(e);
      setIsSetupMode(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      setErrorMessage('');

      if (newPin.length === 4) {
        if (isSetupMode) {
          if (setupStep === 1) {
            setTimeout(() => {
              setConfirmPin(newPin);
              setPin('');
              setSetupStep(2);
            }, 250);
          } else {
            // Confirm pin
            handleCompleteSetup(confirmPin, newPin);
          }
        } else {
          // Unlock attempt
          handleVerify(newPin);
        }
      }
    }
  };

  const handleClear = () => {
    setPin('');
    setErrorMessage('');
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setErrorMessage('');
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const handleVerify = async (enteredPin: string) => {
    setIsLoading(true);
    const valid = await finance.verifyPin(enteredPin);
    setIsLoading(false);
    if (valid) {
      onUnlock();
    } else {
      triggerShake();
      setErrorMessage('PIN incorrecto. Intenta nuevamente.');
      setPin('');
    }
  };

  const handleCompleteSetup = async (firstPin: string, secondPin: string) => {
    if (firstPin !== secondPin) {
      triggerShake();
      setErrorMessage('Los PINs no coinciden. Comienza de nuevo.');
      setPin('');
      setConfirmPin('');
      setSetupStep(1);
      return;
    }

    setIsLoading(true);
    const res = await finance.setupInitialPin(firstPin);
    setIsLoading(false);

    if (res.success) {
      onUnlock();
    } else {
      triggerShake();
      setErrorMessage(res.error || 'Error al guardar el PIN');
      setPin('');
      setConfirmPin('');
      setSetupStep(1);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-between items-center p-6 sm:p-8 select-none">
      {/* Top bar with security status and DB config shortcut */}
      <div className="w-full max-w-sm flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#9678B6]" />
          <span className="text-xs font-medium text-slate-500">
            {storageMode === 'supabase' ? 'Supabase Conectado' : 'Modo Demo / Local'}
          </span>
        </div>
        <button
          onClick={onOpenSupabaseConfig}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white/80 border border-[#ECE7DF] px-3 py-1.5 rounded-full shadow-2xs hover:shadow-xs transition-all active:scale-95"
          title="Configurar Supabase y Ver SQL"
        >
          <Database className="w-3.5 h-3.5 text-[#9678B6]" />
          <span>Configurar BD</span>
        </button>
      </div>

      {/* Main PIN card */}
      <div className="w-full max-w-sm flex flex-col items-center my-auto">
        {/* Brand Icon & Welcome */}
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#F4EDFA] via-[#EFE7F6] to-[#FAF8F5] flex items-center justify-center border border-white shadow-sm">
            {isSetupMode ? (
              <KeyRound className="w-9 h-9 text-[#9678B6]" />
            ) : (
              <Lock className="w-9 h-9 text-[#9678B6]" />
            )}
          </div>
          <div className="absolute -top-1 -right-1 bg-white p-1 rounded-full shadow-2xs">
            <Sparkles className="w-4 h-4 text-[#BCA3D4]" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-slate-800 tracking-tight text-center mb-1.5">
          {isSetupMode
            ? setupStep === 1
              ? 'Crea tu PIN de Acceso'
              : 'Confirma tu PIN'
            : 'Finanzas Personales'}
        </h1>

        <p className="text-sm text-slate-500 text-center max-w-xs mb-8">
          {isSetupMode
            ? setupStep === 1
              ? 'Define un PIN de 4 dígitos para proteger tus registros en Supabase.'
              : 'Ingresa nuevamente los 4 dígitos para verificar.'
            : 'Ingresa tu PIN de 4 dígitos para ver tus finanzas.'}
        </p>

        {/* PIN Circles Display */}
        <div
          className={`flex items-center justify-center gap-4 mb-6 transition-transform ${
            isShaking ? 'translate-x-[-8px] duration-75' : ''
          }`}
        >
          {[0, 1, 2, 3].map((index) => {
            const isFilled = pin.length > index;
            return (
              <div
                key={index}
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                  isFilled
                    ? 'bg-[#9678B6] scale-110 shadow-xs'
                    : 'bg-[#E3DFD7] border border-[#D5D0C6]'
                }`}
              />
            );
          })}
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-xl mb-4 animate-fade-in">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Keypad */}
        <div className="w-full grid grid-cols-3 gap-3.5 sm:gap-4 max-w-[280px]">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              onClick={() => handleKeyPress(digit)}
              disabled={isLoading || pin.length >= 4}
              className="h-15 rounded-2xl bg-white border border-[#EDE8DF] text-slate-800 text-xl font-semibold shadow-2xs hover:bg-[#FAF8F5] active:bg-[#F0EDE6] active:scale-95 transition-all flex items-center justify-center cursor-pointer disabled:opacity-50"
            >
              {digit}
            </button>
          ))}

          <button
            onClick={handleClear}
            disabled={isLoading || pin.length === 0}
            className="h-15 rounded-2xl bg-transparent text-slate-400 text-xs font-medium hover:text-slate-700 active:scale-95 transition-all flex items-center justify-center cursor-pointer disabled:opacity-30"
          >
            BORRAR
          </button>

          <button
            onClick={() => handleKeyPress('0')}
            disabled={isLoading || pin.length >= 4}
            className="h-15 rounded-2xl bg-white border border-[#EDE8DF] text-slate-800 text-xl font-semibold shadow-2xs hover:bg-[#FAF8F5] active:bg-[#F0EDE6] active:scale-95 transition-all flex items-center justify-center cursor-pointer disabled:opacity-50"
          >
            0
          </button>

          <button
            onClick={handleDelete}
            disabled={isLoading || pin.length === 0}
            className="h-15 rounded-2xl bg-transparent text-slate-500 text-base font-semibold hover:text-slate-800 active:scale-95 transition-all flex items-center justify-center cursor-pointer disabled:opacity-30"
          >
            ⌫
          </button>
        </div>

        {isSetupMode && setupStep === 2 && (
          <button
            onClick={() => {
              setSetupStep(1);
              setPin('');
              setConfirmPin('');
              setErrorMessage('');
            }}
            className="mt-6 text-xs text-slate-500 hover:text-slate-800 underline transition-colors"
          >
            ← Volver al paso anterior
          </button>
        )}
      </div>

      {/* Footer Security Note */}
      <div className="w-full max-w-sm text-center pt-4">
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-[#9678B6]" />
          <span>Acceso privado protegido con hash SHA-256</span>
        </div>
      </div>
    </div>
  );
};
