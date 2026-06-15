import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  Info, 
  Smartphone, 
  Share2, 
  Lock, 
  RefreshCw,
  Award
} from 'lucide-react';

export default function MobileSetupTab() {
  const [appUrl, setAppUrl] = useState<string>('https://adalaty-jo.web.app');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [activeInstructionTab, setActiveInstructionTab] = useState<'android' | 'ios'>('android');

  // Dynamically extract the current live URL of the application to generate custom 100% working QR codes for the user's specific environment
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin || window.location.href;
      setAppUrl(origin);
    }
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&color=245-158-11&bgcolor=12-10-9&data=${encodeURIComponent(appUrl)}`;

  return (
    <div className="space-y-6 text-right" id="mobile-setup-tab-container">
      {/* Intro Header banner */}
      <div className="bg-gradient-to-l from-amber-500/15 via-stone-900/60 to-stone-950 p-6 rounded-2xl border border-amber-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-amber-400 mb-1.5 flex items-center gap-2">
              <Smartphone size={22} className="text-amber-400" />
              منصة عدالتي للهواتف المحمولة والأجهزة الذكية
            </h3>
            <p className="text-stone-405 text-xs text-stone-400 leading-relaxed max-w-4xl">
              يدعم نظام <strong>عدالتي الأردني</strong> تقنية تطبيقات الويب التقدمية (PWA) المتطورة. يمكنك تثبيته على هاتفك الشخصي (Android و iPhone) ليعمل كمنصة كاملة الشاشة مستقلة تماماً فائقة الأمان والسرعة ودون الحاجة لملفات تثبيت APK معقدة أو عمليات قرصنة للحماية.
            </p>
          </div>
          <div className="bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[11px] font-bold px-3 py-1.5 rounded-xl font-sans shrink-0">
            صـيـغـة الـجـوال الذكي
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* RIGHT COLUMN: Interactive Installation Guide and Instructions Selector */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-stone-950/40 border border-stone-900 p-6 rounded-2xl space-y-6">
            
            {/* Quick Switch Button */}
            <div className="flex bg-stone-900/50 p-1.5 rounded-xl border border-stone-850">
              <button
                onClick={() => setActiveInstructionTab('android')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex justify-center items-center gap-2 ${
                  activeInstructionTab === 'android'
                    ? 'bg-amber-500 text-stone-950 shadow-md'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <span>🤖 تثبيت على أجهزة أندرويد (Android)</span>
              </button>
              <button
                onClick={() => setActiveInstructionTab('ios')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex justify-center items-center gap-2 ${
                  activeInstructionTab === 'ios'
                    ? 'bg-amber-500 text-stone-950 shadow-md'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <span>🍎 تثبيت على أجهزة أبل آيفون (iPhone / iPad)</span>
              </button>
            </div>

            {/* Instruction Contents */}
            {activeInstructionTab === 'android' ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-amber-400 text-sm font-bold border-b border-stone-900 pb-2">
                  <span>خطوات التثبيت السريع لأجهزة Android:</span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex gap-4 items-start bg-stone-900/30 p-3 rounded-xl border border-stone-900">
                    <span className="w-6 h-6 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">١</span>
                    <div className="text-xs space-y-1">
                      <p className="font-bold text-stone-200">افتح متصفح Google Chrome</p>
                      <p className="text-stone-405 text-stone-400 leading-relaxed">قم بفتح متصفح كروم على هاتفك واكتب رابط المنصة أو امسح رمز الاستجابة السريعة (QR) الذكي الجانبي بالهاتف.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start bg-stone-900/30 p-3 rounded-xl border border-stone-900">
                    <span className="w-6 h-6 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">٢</span>
                    <div className="text-xs space-y-1">
                      <p className="font-bold text-stone-200">افتح خيارات القائمة الجانبية للتصفح</p>
                      <p className="text-stone-405 text-stone-400 leading-relaxed">اضغط على زر الخيارات أو النقاط الثلاث الرأسية <strong className="text-amber-400 font-bold">(⋮)</strong> المتواجدة في الزاوية العليا للمتصفح باليمين أو اليسار.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start bg-stone-900/30 p-3 rounded-xl border border-stone-900">
                    <span className="w-6 h-6 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">٣</span>
                    <div className="text-xs space-y-1">
                      <p className="font-bold text-stone-200">اختر "إضافة إلى الشاشة الرئيسية" أو "تثبيت المنصة"</p>
                      <p className="text-stone-405 text-stone-400 leading-relaxed">اضغط على خيار <strong className="text-stone-200">"إضافة إلى الشاشة الرئيسية (Add to Home screen)"</strong> أو <strong className="text-stone-200">"تثبيت المنصة (Install App)"</strong> من القائمة المنسدلة.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start bg-stone-900/30 p-3 rounded-xl border border-stone-905 border-amber-500/10">
                    <span className="w-6 h-6 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">٤</span>
                    <div className="text-xs space-y-1">
                      <p className="font-bold text-amber-400">تأكيد التثبيت وتشغيل المنصة الفوري</p>
                      <p className="text-stone-405 text-stone-400 leading-relaxed">ستظهر لك نافذة منبثقة بسيطة تطلب التأكيد، اضغط على زر "إضافة". ستجد أيقونة المنصة بشعارها الذهبي الأنيق قد أضيفت لسطح مكتب هاتفك، وتفتح بشاشة كاملة مستقلة خالية من أشرطة التصفح تماماً وتدعم الحفظ المحلي!</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-amber-300 text-sm font-bold border-b border-stone-900 pb-2">
                  <span>خطوات التثبيت المتجانس لأجهزة iPhone / iPad (Safari):</span>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-4 items-start bg-stone-900/30 p-3 rounded-xl border border-stone-900">
                    <span className="w-6 h-6 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">١</span>
                    <div className="text-xs space-y-1">
                      <p className="font-bold text-stone-200">افتح متصفح سفاري الرسمي (Safari)</p>
                      <p className="text-stone-405 text-stone-400 leading-relaxed">تأكد من فتح رابط المنصة عبر متصفح Safari الافتراضي للأجهزة الذكية العاملة بنظام iOS.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start bg-stone-900/30 p-3 rounded-xl border border-stone-900">
                    <span className="w-6 h-6 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">٢</span>
                    <div className="text-xs space-y-1">
                      <p className="font-bold text-stone-200">اضغط على أيقونة المشاركة (Share)</p>
                      <p className="text-stone-405 text-stone-400 leading-relaxed">اضغط على زر المشاركة الموجود في الشريط السفلي للمتصفح، الممثل برمز مربع يخرج منه سهم للأعلى <strong className="text-amber-400">(📤)</strong>.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start bg-stone-900/30 p-3 rounded-xl border border-stone-900">
                    <span className="w-6 h-6 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">٣</span>
                    <div className="text-xs space-y-1">
                      <p className="font-bold text-stone-200">اختر "إضافة إلى الشاشة الرئيسية"</p>
                      <p className="text-stone-405 text-stone-400 leading-relaxed">قم بالتمرير للأسفل في الخيارات المتاحة واضغط على خيار <strong className="text-stone-200">"إضافة إلى الشاشة الرئيسية (Add to Home Screen)"</strong>.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start bg-stone-900/30 p-3 rounded-xl border border-amber-500/10">
                    <span className="w-6 h-6 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">٤</span>
                    <div className="text-xs space-y-1">
                      <p className="font-bold text-amber-400">تأكيد التثبيت وتشغيل منصة آي فون</p>
                      <p className="text-stone-405 text-stone-400 leading-relaxed">ستظهر واجهة لتسمية المنصة، اضغط "إضافة" (Add) في الزاوية اليمنى العليا. ستتحول المنظومة مباشرة لأيقونة فاخرة على شاشة هاتفك، جاهزة للفتح والاستعمال القانوني الفوري.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Why PWA / Link is better than APK section */}
            <div className="bg-stone-900/25 p-5 rounded-2xl border border-stone-900 space-y-3">
              <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Info size={14} /> لماذا هذه الطريقة الذكية أفضل بكثير من ملفات الـ APK التقليدية؟
              </h4>
              <ul className="text-[11px] text-stone-400 space-y-2 leading-relaxed list-disc pr-4">
                <li>
                  <strong className="text-stone-200">الحماية والخصوصية المطلقة للقضايا:</strong> ملفات الـ APK مجهولة المصدر قد تحتوي على فيروسات تجسس تسرق خصوصية مراسلاتك وسجلات موكليك. هذه الطريقة تعمل ضمن بيئة حماية الأندرويد والآيفون الرسمية (Sandbox) الآمنة بنسبة 100%.
                </li>
                <li>
                  <li>
                    <strong className="text-stone-200">التحديث التلقائي اللحظي:</strong> إذا طرأ أي تغيير جديد على رسوم المحاكم أو جداول المدد بالأردن، سيتم تحديث المنصة على هاتفك تلقائياً فوراً وبدون الحاجة لإعادة تحميل أو تثبيت ملف APK جديد يدوياً كالعادة!
                  </li>
                </li>
                <li>
                  <strong className="text-stone-200">مجاني وخفيف للغاية:</strong> لا يتطلب سوى مساحة لا تذكر (أقل من 1 ميجابايت)، بينما طبقات الـ APK العادية تستهلك مئات الميجابايتات وتثقل كاهل معالج الهاتف والبطارية.
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* LEFT COLUMN: Large High Quality QR Code Generator Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-stone-950/45 border border-stone-900 p-6 rounded-2xl text-center flex flex-col items-center justify-center space-y-6">
            
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-stone-100 flex items-center justify-center gap-2">
                <Award size={16} className="text-amber-400" />
                امسح الرمز بكاميرا الهاتف
              </h4>
              <p className="text-stone-500 text-[11px]">وجه كاميرا هاتفك المحمول نحو الرمز لفتح المنصة وتثبيتها مباشرة</p>
            </div>

            {/* Actual dynamic official generated QR code card */}
            <div className="bg-stone-900/90 p-4 rounded-3xl border border-stone-850 shadow-2xl relative group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 to-transparent pointer-events-none" />
              <img 
                src={qrCodeUrl} 
                alt="QR Code to Install Adalaty Mobile App" 
                referrerPolicy="no-referrer"
                className="w-48 h-48 md:w-56 md:h-56 mx-auto rounded-2xl border-4 border-stone-950 shadow-inner select-none transition-all group-hover:scale-[1.02]"
              />
              <div className="mt-2 text-[10px] text-amber-500/80 font-mono tracking-widest font-bold">SCAN ME TO DOWNLOAD</div>
            </div>

            {/* Direct URL Share link section */}
            <div className="w-full space-y-3">
              <label className="block text-stone-400 text-xs text-right font-semibold">رابط التحميل المباشر للجوال:</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3 py-2 bg-stone-900 hover:bg-stone-850 border border-stone-800 text-stone-300 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {isCopied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  {isCopied ? 'تم النسخ!' : 'نسخ الرابط'}
                </button>
                <input
                  type="text"
                  readOnly
                  value={appUrl}
                  onClick={(e) => { (e.target as HTMLInputElement).select(); }}
                  className="flex-1 bg-stone-900/70 border border-stone-850 rounded-xl py-2 px-3 text-stone-300 text-xs font-mono select-all text-left focus:outline-none focus:border-amber-500/50"
                />
              </div>
              <p className="text-[10px] text-stone-500 text-right leading-relaxed">
                يمكنك نسخ هذا الرابط وإرساله لنفسك عبر الواتساب (WhatsApp) أو التيليجرام على هاتفك لفتحه وتثبيته مباشرة بأي وقت وعزز أداءك القانوني بامتياز.
              </p>
            </div>

            {/* Safety indicators footer of the card */}
            <div className="w-full pt-4 border-t border-stone-900 flex justify-between items-center text-[10px] text-stone-500 font-mono">
              <span className="flex items-center gap-1">
                <Lock size={10} className="text-emerald-600" /> Secure Connection
              </span>
              <span className="flex items-center gap-1">
                <RefreshCw size={10} className="text-amber-600" /> Version v2.6.8 (Auto Updates)
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
