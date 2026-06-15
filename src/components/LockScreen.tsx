/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Lock, RefreshCw, AlertTriangle, Fingerprint, LogIn, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import AppLogo from './AppLogo';

interface LockScreenProps {
  onUnlock: () => void;
}

export default function LockScreen({ onUnlock }: LockScreenProps) {
  const [showWelcome, setShowWelcome] = useState<boolean>(true);
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLockedOut, setIsLockedOut] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<number>(0);

  const handleNumberClick = (num: number) => {
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      setError('');
      if (nextPin.length === 4) {
        verifyPin(nextPin);
      }
    }
  };

  const handleClear = () => {
    setPin('');
    setError('');
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
    setError('');
  };

  const verifyPin = (enteredPin: string) => {
    if (enteredPin === '1717') {
      onUnlock();
    } else {
      const remainingAttempts = 4 - attempts;
      setAttempts(prev => prev + 1);
      setError(`الرمز السري غير صحيح. المتبقي: ${remainingAttempts} محاولات`);
      setPin('');
      
      if (attempts >= 4) {
        setIsLockedOut(true);
        setError('تم تجميد الدخول مؤقتاً لتجاوز عدد المحاولات. الرجاء إعادة المحاولة لاحقاً.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white px-4 relative overflow-hidden" dir="rtl">
      {/* Decorative subtle ambient lights */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />

      {showWelcome ? (
        /* Screen 1: Welcome Splash Screen with Logo and login triggers */
        <motion.div 
          key="welcome-splash"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-stone-900/60 border border-amber-500/20 rounded-2xl p-8 backdrop-blur-xl flex flex-col items-center text-center shadow-2xl relative z-10"
        >
          {/* Supreme Emblem and Logo */}
          <div className="relative mb-8 pt-4">
            <div className="absolute inset-0 bg-amber-500/5 rounded-full blur-3xl scale-150 pointer-events-none" />
            <AppLogo size={180} showText={true} highlightText={true} className="text-amber-400" />
          </div>

          <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-l from-amber-200 via-amber-400 to-amber-200 mb-3">
            مرحباً بكم في منصة عدالتي
          </h2>
          
          <p className="text-stone-300 text-xs md:text-sm mb-8 max-w-xs leading-relaxed">
            المساعد القانوني واللوائحي المهني لفرسان الحق والعدالة الرقمية بالمملكة الأردنية الهاشمية
          </p>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20 mb-8 select-none">
            🛡️ بوابة مغلقة وآمنة لأعضاء المرفق القضائي ونقابة المحامين
          </span>

          {/* Interactive Login Action Button (تسجيل الدخول يذهب لصفحة إدخال الرمز) */}
          <button
            type="button"
            onClick={() => setShowWelcome(false)}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-l from-amber-600 via-amber-500 to-amber-400 hover:from-amber-500 hover:to-amber-300 text-stone-950 font-black text-sm shadow-[0_0_20px_rgba(245,158,11,0.25)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer group"
          >
            <LogIn size={18} className="transition-transform group-hover:translate-x-1" />
            <span>تسجيل الدخول للمنصة</span>
          </button>

          <div className="mt-8 text-stone-500 text-[10px] border-t border-stone-800/60 pt-4 w-full">
            تطويع التكنولوجيا المتطورة لصون الحقوق ودعم ريادة الأعمال القانونية
          </div>
        </motion.div>
      ) : (
        /* Screen 2: Interactive PIN Entry Pad with easy return path */
        <motion.div 
          key="pin-code-keyboard"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-stone-900/60 border border-amber-500/20 rounded-2xl p-8 backdrop-blur-xl flex flex-col items-center text-center shadow-2xl relative z-10"
        >
          {/* Symmetrical Top header bar with absolute Back navigation */}
          <div className="w-full flex justify-between items-center mb-6 pb-2 border-b border-stone-800/40">
            <span className="text-xs text-stone-400 font-medium font-sans">بوابة التحقق</span>
            <button 
              type="button" 
              onClick={() => {
                setShowWelcome(true);
                setPin('');
                setError('');
              }}
              className="text-amber-500 hover:text-amber-400 text-xs font-bold flex items-center gap-1 hover:underline transition-all cursor-pointer"
            >
              <span>رجوع للرئيسية</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="relative mb-6">
            <AppLogo size={110} showText={false} className="text-amber-400" />
          </div>

          <h3 className="text-lg font-bold text-stone-100 mb-1">رمز المرور للمنصة</h3>
          <p className="text-stone-400 text-xs mb-6 max-w-xs">
            الرجاء إدخال الرمز المكون من 4 خانات للولوج الفوري
          </p>

          {/* PIN Entry Display dots */}
          <div className="w-full mb-8">
            <div className="flex justify-center gap-4 mb-4">
              {[0, 1, 2, 3].map((index) => (
                <div 
                  key={index}
                  className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                    pin.length > index 
                      ? 'bg-amber-400 border-amber-400 scale-110 shadow-[0_0_10px_rgba(245,158,11,0.5)]' 
                      : 'border-stone-600 bg-transparent'
                  }`}
                />
              ))}
            </div>

            <div className="h-6">
              {error ? (
                <p className="text-rose-400 text-xs flex items-center justify-center gap-1">
                  <AlertTriangle size={14} />
                  {error}
                </p>
              ) : (
                <p className="text-stone-500 text-xs flex items-center justify-center gap-1">
                  <Lock size={12} />
                  أدخل رمز المرور المكون من 4 أرقام
                </p>
              )}
            </div>
          </div>

          {/* Security Alert Block & Keypad */}
          {isLockedOut ? (
            <div className="w-full py-6 px-4 bg-rose-950/20 rounded-xl border border-rose-500/20 flex flex-col items-center">
              <Fingerprint className="text-rose-500 animate-pulse mb-2 animate-bounce" size={40} />
              <p className="text-stone-300 text-xs text-center mb-3 leading-relaxed">
                تم تجميد الدخول مؤقتاً لتجاوز محاولات تسجيل الدخول الخاطئة.
              </p>
              <button 
                onClick={() => {
                  setIsLockedOut(false);
                  setAttempts(0);
                  setError('');
                }}
                className="mt-2 text-xs text-amber-400 underline hover:text-amber-300 transition-all flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw size={12} />
                إعادة تهيئة المحاولات (للإصلاح سريعاً)
              </button>
            </div>
          ) : (
            /* Numeric Keypad Grid */
            <div className="grid grid-cols-3 gap-4 w-full px-4 mb-4" dir="ltr">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleNumberClick(num)}
                  className="h-14 rounded-xl bg-stone-900 border border-stone-800 text-xl font-bold hover:bg-stone-800 hover:border-amber-500/30 active:scale-95 transition-all text-white flex items-center justify-center cursor-pointer"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={handleClear}
                className="h-14 rounded-xl text-stone-400 hover:text-white transition-colors flex items-center justify-center text-xs font-semibold cursor-pointer"
              >
                مسح الكل
              </button>
              <button
                type="button"
                onClick={() => handleNumberClick(0)}
                className="h-14 rounded-xl bg-stone-900 border border-stone-800 text-xl font-bold hover:bg-stone-800 hover:border-amber-500/30 active:scale-95 transition-all text-white flex items-center justify-center cursor-pointer"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleBackspace}
                className="h-14 rounded-xl text-stone-400 hover:text-white transition-colors flex items-center justify-center text-xs font-semibold cursor-pointer"
              >
                حذف ⌫
              </button>
            </div>
          )}

          <div className="mt-6 text-stone-500 text-[11px] border-t border-stone-800/60 pt-4 w-full">
            المملكة الأردنية الهاشمية • الرمز الافتراضي المعتمد للدخول: <span className="text-amber-400 font-mono font-bold select-all">1717</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
