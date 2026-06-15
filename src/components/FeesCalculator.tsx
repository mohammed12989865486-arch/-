import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  Coins, 
  HelpCircle, 
  Bookmark, 
  Check, 
  ChevronRight, 
  Info, 
  Printer, 
  RotateCcw,
  AlertCircle,
  FileText,
  UserCheck
} from 'lucide-react';
import { lawsuitTemplates } from '../data/jordanLaws';

interface CalculationResult {
  courtFree: boolean;
  courtFee: number;
  fixedStamps: number;
  notificationFee: number;
  notaryWarningFee: number;
  expectedExpertFee: number;
  executionFee: number;
  attorneyMarketMin: number;
  attorneyMarketMax: number;
  courtAwardedFee: number;
  totalOfficialFees: number;
  totalOverallMin: number;
  totalOverallMax: number;
  isLaborExempt: boolean;
  courtTypeLabel: string;
}

export default function FeesCalculator() {
  const [selectedSuitId, setSelectedSuitId] = useState<string>('custom');
  const [customSuitName, setCustomSuitName] = useState<string>('');
  const [suitCategory, setSuitCategory] = useState<'civil' | 'penal'>('civil');
  const [isFinancial, setIsFinancial] = useState<boolean>(true);
  const [claimValue, setClaimValue] = useState<number>(5000);
  const [isLaborCase, setIsLaborCase] = useState<boolean>(false);
  const [isLaborWorker, setIsLaborWorker] = useState<boolean>(true);
  const [hasCivilPartInPenal, setHasCivilPartInPenal] = useState<boolean>(false);
  const [civilPartAmount, setCivilPartAmount] = useState<number>(2000);
  const [defendantsCount, setDefendantsCount] = useState<number>(1);
  const [includeNotaryWarning, setIncludeNotaryWarning] = useState<boolean>(false);
  const [includeExpert, setIncludeExpert] = useState<boolean>(false);
  const [isEvictionCase, setIsEvictionCase] = useState<boolean>(false);
  const [annualRent, setAnnualRent] = useState<number>(2400);
  const [customLawsuitNotes, setCustomLawsuitNotes] = useState<string>('');

  // Auto-populate inputs based on selected template
  useEffect(() => {
    if (selectedSuitId !== 'custom') {
      const template = lawsuitTemplates.find(t => t.id === selectedSuitId);
      if (template) {
        setCustomSuitName(template.title);
        const cat = template.category || 'civil';
        setSuitCategory(cat);
        
        // Auto-configure checkboxes based on common lawsuit characteristics
        if (template.id === 'suit-money-demand') {
          setIsFinancial(true);
          setIsEvictionCase(false);
          setIsLaborCase(false);
          setClaimValue(5000);
        } else if (template.id === 'suit-tenant-eviction') {
          setIsFinancial(false);
          setIsEvictionCase(true);
          setIsLaborCase(false);
        } else if (template.id === 'suit-labor-rights') {
          setIsFinancial(true);
          setIsEvictionCase(false);
          setIsLaborCase(true);
          setIsLaborWorker(true);
          setClaimValue(3000);
        } else if (template.id.includes('penal') || template.id.includes('bribe') || template.id.includes('libel') || template.id.includes('theft')) {
          setIsFinancial(false);
          setIsEvictionCase(false);
          setIsLaborCase(false);
          setHasCivilPartInPenal(false);
        } else if (template.id === 'suit-damages-compensation') {
          setIsFinancial(true);
          setIsEvictionCase(false);
          setIsLaborCase(false);
          setClaimValue(8000);
        }
      }
    } else {
      setCustomSuitName('');
    }
  }, [selectedSuitId]);

  // Perform Jordanian-specific legal cost calculations
  const calculateFees = (): CalculationResult => {
    let courtFee = 0;
    let courtFree = false;
    let isLaborExempt = false;
    let courtTypeLabel = 'صلح حقوق';

    // 1. Court Type logic based on claim size in Jordan:
    // Conciliation Court of Rights (صلح حقوق) deals with claims <= 10,000 JOD
    // First Instance Court (بداية حقوق) deals with claims > 10,000 JOD
    if (suitCategory === 'civil') {
      const valueToCheck = isEvictionCase ? annualRent : claimValue;
      if (valueToCheck <= 10000) {
        courtTypeLabel = 'محكمة صلح الحقوق';
      } else {
        courtTypeLabel = 'محكمة بداية الحقوق';
      }
    } else {
      courtTypeLabel = 'النيابة العامة ومحكمة صلح/بداية الجزاء';
    }

    // 2. Court Fees Calculation (الرسوم القضائية الأساسية)
    if (suitCategory === 'civil') {
      if (isLaborCase && isLaborWorker) {
        // Labor Lawsuit filed by employee is exempt from all fees (Article 137)
        courtFee = 0;
        courtFree = true;
        isLaborExempt = true;
      } else if (isEvictionCase) {
        // Innkeeper / Eviction (إخلاء مأجور): court fee is 3% of the annual rent, minimum 30 JOD
        courtFee = Math.max(30, Number((annualRent * 0.03).toFixed(2)));
      } else if (isFinancial) {
        // Civil claim (دعوى مقدرة القيمة):
        // 3% of the claim value. Minimum 10 JOD, Maximum 3000 JOD
        courtFee = Number((claimValue * 0.03).toFixed(2));
        if (courtFee < 10) courtFee = 10;
        if (courtFee > 3000) courtFee = 3000;
      } else {
        // Non-financial claim (غير مقدرة القيمة): Flat fee of 30 JOD
        courtFee = 30;
      }
    } else {
      // Penal/Criminal complaints filing fee in Jordan is usually small or free (about 5 JOD for public prosecution office)
      courtFee = 5;
      
      // If the plaintiff has civil personal claims inside the criminal case (الادعاء بالحق الشخصي)
      if (hasCivilPartInPenal) {
        let personalClaimFee = Number((civilPartAmount * 0.03).toFixed(2));
        if (personalClaimFee < 10) personalClaimFee = 10;
        if (personalClaimFee > 3000) personalClaimFee = 3000;
        courtFee += personalClaimFee;
      }
    }

    // 3. Stamps & Fixed expenses (الأتعاب والدمغات القضائية الإضافية)
    // Jordan Bar stamps (طابع نقابة المحامين + صندوق التعاون + طابع مرافعة + طابع وكالة)
    let fixedStamps = 0;
    if (isLaborCase && isLaborWorker) {
      fixedStamps = 0; // Labor workers are exempt from stamps too
    } else {
      // Standard stamps breakdown:
      const proxyStamp = (suitCategory === 'civil' && (isEvictionCase ? annualRent : claimValue) > 10000) ? 10 : 5; // 10 JOD for First Instance / 5 JOD for Conciliation
      const barStamp = 3; // طابع النقابة
      const welfareStamp = 3;  // صندوق التقاعد/التعاون
      const pleadingStamp = 2; // طابع مرافعة
      const stateStamp = 2; // طابع الخزينة والواردات
      
      fixedStamps = proxyStamp + barStamp + welfareStamp + pleadingStamp + stateStamp;
    }

    // 4. Notification fee (رسوم التبليغ القضائي)
    // In Jordan, standard notification costs 5 JOD per defendant, 10 JOD if outside the city or via courier
    const notificationFee = isLaborCase && isLaborWorker ? 0 : defendantsCount * 5;

    // 5. Notary warning (الإنذار العدلي)
    const notaryWarningFee = includeNotaryWarning ? 20 : 0;

    // 6. Expected Court expert fees if needed (أجور خبراء كشف وتقدير)
    const expectedExpertFee = includeExpert ? 150 : 0;

    // 7. Execution department fee (رسوم التنفيذ القضائي اللاحقة)
    // Execution costs 4% of the awarded amount, minimum 10 JOD, maximum 500 JOD (under Jordan execution rules)
    let executionFee = 0;
    if (suitCategory === 'civil' && isFinancial) {
      executionFee = Number((claimValue * 0.04).toFixed(2));
      if (executionFee < 10) executionFee = 10;
      if (executionFee > 500) executionFee = 500;
    } else if (suitCategory === 'civil' && isEvictionCase) {
      // Eviction execution is flat, generally around 30 JOD
      executionFee = 30;
    }

    // 8. Contractual Attorney Fees (أتعاب المحاماة الاتفاقية - السوق التجاري)
    // These are market prices for standard representations in Jordan
    let attorneyMarketMin = 0;
    let attorneyMarketMax = 0;

    if (suitCategory === 'civil') {
      const baseValue = isEvictionCase ? annualRent : (isFinancial ? claimValue : 2000);
      
      if (baseValue <= 5000) {
        attorneyMarketMin = 300;
        attorneyMarketMax = 700;
      } else if (baseValue <= 10000) {
        attorneyMarketMin = 500;
        attorneyMarketMax = 1200;
      } else if (baseValue <= 30000) {
        attorneyMarketMin = 1000;
        attorneyMarketMax = 2500;
      } else {
        // Usually 5% to 10% of the claim value
        attorneyMarketMin = Math.round(baseValue * 0.05);
        attorneyMarketMax = Math.round(baseValue * 0.10);
      }
    } else {
      // Penal charges contractual fees depend on crime severity (Misdemeanor 'جنحة' or Felony 'جناية')
      // Let's estimate based on whether it is custom or standard
      if (customSuitName.includes('جنحة') || customSuitName.includes('شيك') || customSuitName.includes('تشهير')) {
        attorneyMarketMin = 350;
        attorneyMarketMax = 800;
      } else if (customSuitName.includes('جناية') || customSuitName.includes('سرقة موصوفة')) {
        attorneyMarketMin = 1500;
         attorneyMarketMax = 4000;
      } else {
        // generic criminal
        attorneyMarketMin = 400;
        attorneyMarketMax = 1200;
      }
    }

    // 9. Court Awarded Attorney Fees (أتعاب المحاماة المحكوم بها للطرف الفائز)
    // Under Jordan Bar Association Law, Article (46):
    // Court awards the winning lawyer 5% of the claimed/awarded amount,
    // with a minimum of 50 JOD and a maximum of 1,000 JOD in Conciliation (صلح),
    // and up to 1,500 JOD in first instance (بداية).
    let courtAwardedFee = 0;
    if (suitCategory === 'civil') {
      const baseValueForAward = isEvictionCase ? annualRent : (isFinancial ? claimValue : 1000);
      courtAwardedFee = Number((baseValueForAward * 0.05).toFixed(2));
      const limitsMin = 50;
      const limitsMax = baseValueForAward <= 10000 ? 1000 : 1500;
      
      if (courtAwardedFee < limitsMin) courtAwardedFee = limitsMin;
      if (courtAwardedFee > limitsMax) courtAwardedFee = limitsMax;
    } else {
      // In penal verdicts, if civil claim exists
      if (hasCivilPartInPenal) {
        courtAwardedFee = Number((civilPartAmount * 0.05).toFixed(2));
        if (courtAwardedFee < 50) courtAwardedFee = 50;
        if (courtAwardedFee > 1000) courtAwardedFee = 1000;
      } else {
        // Flat small criminal defense awarded fee
        courtAwardedFee = 50;
      }
    }

    const totalOfficialFees = courtFee + fixedStamps + notificationFee + notaryWarningFee + expectedExpertFee;
    const totalOverallMin = totalOfficialFees + attorneyMarketMin;
    const totalOverallMax = totalOfficialFees + attorneyMarketMax;

    return {
      courtFree,
      courtFee,
      fixedStamps,
      notificationFee,
      notaryWarningFee,
      expectedExpertFee,
      executionFee,
      attorneyMarketMin,
      attorneyMarketMax,
      courtAwardedFee,
      totalOfficialFees,
      totalOverallMin,
      totalOverallMax,
      isLaborExempt,
      courtTypeLabel
    };
  };

  const results = calculateFees();

  return (
    <div className="space-y-6">
      
      {/* Header and intro */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Coins className="text-amber-500" />
            حاسبة الرسوم القضائية وتقدير أتعاب المحاماة بالأردن ⚖️
          </h2>
          <p className="text-stone-400 text-xs mt-1 leading-relaxed animate-fade-in">
            احسب الرسوم الحكومية، دمغات نقابة المحامين، مذكرات التبليغ، مصاريف الخبراء، والتقدير التجاري لأتعاب المحامين (الاتفاقية والمحكوم بها) بالتوافق مع القوانين الأردنية السارية.
          </p>
        </div>
      </div>

      {/* Main Grid: Input Form (Left) & Results Bento (Right) in RTL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Card: Input configuration (5 columns) */}
        <div className="lg:col-span-5 bg-stone-950 p-5 rounded-2xl border border-stone-900/80 space-y-6">
          <div className="border-b border-stone-900 pb-3">
            <h3 className="text-sm font-bold text-stone-100 flex items-center gap-2">
              <Scale size={16} className="text-amber-400" />
              توصيف وتسمية القضية المطروحة
            </h3>
            <p className="text-[10px] text-stone-500 mt-1">تسمية القضية أو اختيار نموذج لتعبئة المعايير تلقائياً.</p>
          </div>

          <div className="space-y-4">
            
            {/* Lawsuit Template Selector */}
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-2 text-right">أقرب نموذج للقضية (تسمية القضية):</label>
              <select
                value={selectedSuitId}
                onChange={(e) => setSelectedSuitId(e.target.value)}
                className="w-full bg-stone-900/80 border border-stone-800 text-stone-200 text-xs rounded-xl p-3 pr-3 focus:outline-none focus:border-amber-500/30 font-sans text-right"
              >
                <option value="custom">✍️ قضية مخصصة (اكتب اسم القضية بالأسفل)</option>
                {lawsuitTemplates.map(t => (
                  <option key={t.id} value={t.id}>{t.title} ({t.category === 'civil' ? 'مدني/حقوق' : 'جزائي/جرم'})</option>
                ))}
              </select>
            </div>

            {/* Custom Case Name input */}
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-2 text-right">عنوان القضية التفصيلي:</label>
              <input
                type="text"
                value={customSuitName}
                onChange={(e) => setCustomSuitName(e.target.value)}
                placeholder="مثال: دعوى مطالبة بقيمة شيك، أو شكوى جرم النصب والاحتيال..."
                className="w-full bg-stone-900/80 border border-stone-800 text-stone-200 text-xs rounded-xl p-3 text-right focus:outline-none focus:border-amber-500/30"
              />
            </div>

            {/* Case Category Toggles (Civil / Penal) */}
            <div className="bg-stone-900/40 p-1 rounded-xl border border-stone-900 flex">
              <button
                type="button"
                onClick={() => { setSuitCategory('civil'); setIsFinancial(true); }}
                className={`flex-1 text-center py-2 text-xs font-semibold rounded-lg transition-all ${suitCategory === 'civil' ? 'bg-amber-500 text-black font-bold' : 'text-stone-400 hover:text-stone-250'}`}
              >
                مدنية / حقوقية (حقوق)
              </button>
              <button
                type="button"
                onClick={() => { setSuitCategory('penal'); setIsFinancial(false); }}
                className={`flex-1 text-center py-2 text-xs font-semibold rounded-lg transition-all ${suitCategory === 'penal' ? 'bg-amber-500 text-black font-bold' : 'text-stone-400 hover:text-stone-250'}`}
              >
                جزائية / شكوى (جرمية)
              </button>
            </div>

            {/* CONDITIONAL CONTROLS: Civil Options */}
            {suitCategory === 'civil' && (
              <div className="space-y-4 pt-2 border-t border-stone-900">
                
                {/* Is Labor lawsuit checkbox */}
                <div className="bg-stone-900/50 p-3 rounded-xl border border-stone-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserCheck size={16} className="text-emerald-400" />
                    <div>
                      <span className="text-xs font-semibold text-stone-300 block">هل هي دعوى حقوق عمالية؟</span>
                      <span className="text-[9px] text-stone-500 block">تنازعات الفصل التعسفي والأجور</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isLaborCase}
                    onChange={(e) => {
                      setIsLaborCase(e.target.checked);
                      if (e.target.checked) {
                        setIsEvictionCase(false);
                      }
                    }}
                    className="accent-amber-500 w-4 h-4 cursor-pointer"
                  />
                </div>

                {isLaborCase && (
                  <div className="bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-xl space-y-2 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-emerald-400">المدعي هو العامل نفسه:</span>
                      <input
                        type="checkbox"
                        checked={isLaborWorker}
                        onChange={(e) => setIsLaborWorker(e.target.checked)}
                        className="accent-emerald-500 w-3.5 h-3.5 cursor-pointer"
                      />
                    </div>
                    {isLaborWorker ? (
                      <p className="text-[9px] text-stone-400 leading-relaxed">
                        ✓ بموجب المادة (137/أ) من قانون العمل الأردني، تُعفى الدعاوى العمالية التي يقيمها العمال من الرسوم القضائية والدمغات والتبليغات في جميع مراحل التقاضي.
                      </p>
                    ) : (
                      <p className="text-[9px] text-stone-400 leading-relaxed">
                        ⚠️ إذا كان رافع الدعوى هو صاحب العمل (مثال: مطالبة العامل ببدل إنذار بالانقطاع)، فلا يشملها الإعفاء وتخضع للرسوم العادية.
                      </p>
                    )}
                  </div>
                )}

                {/* Eviction (إخلاء مأجور) checkbox - not labor */}
                {!isLaborCase && (
                  <div className="bg-stone-900/50 p-3 rounded-xl border border-stone-900 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-blue-400" />
                      <div>
                        <span className="text-xs font-semibold text-stone-300 block">دعوى إخلاء مأجور وعقود إيجار؟</span>
                        <span className="text-[9px] text-stone-500 block">الرسوم تُحتسب بناءً على قيمة الإيجار السنوي</span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={isEvictionCase}
                      onChange={(e) => {
                        setIsEvictionCase(e.target.checked);
                        if (e.target.checked) {
                          setIsFinancial(false);
                        }
                      }}
                      className="accent-amber-500 w-4 h-4 cursor-pointer"
                    />
                  </div>
                )}

                {/* Eviction Annual Rent slider */}
                {isEvictionCase && (
                  <div className="bg-stone-900/40 p-4 rounded-xl border border-stone-900 space-y-2 animate-fade-in">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-stone-300">قيمة الأجرة السنوية الإجمالية للعقار:</span>
                      <span className="text-amber-400 font-bold font-sans">{annualRent.toLocaleString()} د.أ</span>
                    </div>
                    <input
                      type="range"
                      min={600}
                      max={40000}
                      step={100}
                      value={annualRent}
                      onChange={(e) => setAnnualRent(Number(e.target.value))}
                      className="w-full accent-amber-500 h-1.5 bg-stone-800 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] text-stone-500 font-sans">
                      <span>600 د.أ</span>
                      <span>15,000 د.أ</span>
                      <span>40,000 د.أ</span>
                    </div>
                  </div>
                )}

                {/* Standard financial claim toggle/input - not eviction */}
                {!isEvictionCase && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-stone-900/50 p-3 rounded-xl border border-stone-900">
                      <span className="text-xs font-semibold text-stone-300">هل هي دعوى مقدرة القيمة (مطالبة بمبلغ مالي)؟</span>
                      <input
                        type="checkbox"
                        checked={isFinancial}
                        onChange={(e) => setIsFinancial(e.target.checked)}
                        className="accent-amber-500 w-4 h-4 cursor-pointer"
                      />
                    </div>

                    {isFinancial && (
                      <div className="bg-stone-900/40 p-4 rounded-xl border border-stone-900 space-y-3 animate-fade-in">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-stone-300">قيمة المطالبة الاجمالية بالدينار الأردني (JOD):</span>
                          <span className="text-amber-400 font-bold font-sans">{claimValue.toLocaleString()} د.أ</span>
                        </div>
                        <input
                          type="range"
                          min={100}
                          max={150000}
                          step={500}
                          value={claimValue}
                          onChange={(e) => setClaimValue(Number(e.target.value))}
                          className="w-full accent-amber-500 h-1.5 bg-stone-800 rounded-lg cursor-pointer"
                        />
                        <div className="flex justify-between text-[9px] text-stone-500 font-sans">
                          <span>100 د.أ</span>
                          <span>20,000 د.أ</span>
                          <span>150,000 د.أ +</span>
                        </div>
                        
                        {/* Direct manual input field */}
                        <div className="pt-2">
                          <input
                            type="number"
                            value={claimValue}
                            onChange={(e) => setClaimValue(Math.max(1, Number(e.target.value)))}
                            className="w-full bg-stone-950 border border-stone-850 text-amber-400 font-bold font-mono text-center text-xs rounded-lg py-2 focus:outline-none focus:border-amber-500/30"
                            placeholder="أدخل القيمة يدوياً بالدنانير..."
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>
            )}

            {/* CONDITIONAL CONTROLS: Penal Options */}
            {suitCategory === 'penal' && (
              <div className="space-y-4 pt-2 border-t border-stone-900">
                <div className="bg-stone-900/50 p-4 rounded-xl border border-stone-900 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-stone-300 block">هل يوجد ادعاء بالحق الشخصي المدني؟</span>
                      <span className="text-[9px] text-stone-500 block">لطلب تعويضات مالية مرافقة للشكوى الجزائية</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={hasCivilPartInPenal}
                      onChange={(e) => setHasCivilPartInPenal(e.target.checked)}
                      className="accent-amber-500 w-4 h-4 cursor-pointer"
                    />
                  </div>

                  {hasCivilPartInPenal && (
                    <div className="pt-3 border-t border-stone-850 space-y-3 animate-fade-in">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-stone-400">قيمة مبلغ الادعاء المدني الشخصي المطلوب:</span>
                        <span className="text-amber-400 font-bold font-sans">{civilPartAmount.toLocaleString()} د.أ</span>
                      </div>
                      <input
                        type="range"
                        min={100}
                        max={50000}
                        step={500}
                        value={civilPartAmount}
                        onChange={(e) => setCivilPartAmount(Number(e.target.value))}
                        className="w-full accent-amber-500 h-1 bg-stone-850 rounded-lg cursor-pointer"
                      />
                      <input
                        type="number"
                        value={civilPartAmount}
                        onChange={(e) => setCivilPartAmount(Math.max(1, Number(e.target.value)))}
                        className="w-full bg-stone-950 border border-stone-850 text-amber-400 font-bold font-mono text-center text-xs rounded-lg py-1.5 focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Defendants count */}
            <div className="pt-2 border-t border-stone-900">
              <label className="block text-xs font-semibold text-stone-300 mb-2 text-right">عدد المدعى عليهم / المشتكى عليهم في القضية:</label>
              <div className="flex gap-2 items-center justify-between">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setDefendantsCount(num)}
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all ${defendantsCount === num ? 'bg-amber-500/10 border-amber-500/40 text-amber-400' : 'bg-stone-900/10 border-stone-900 text-stone-400 hover:text-stone-200'}`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional extra expenses tags */}
            <div className="space-y-3 pt-3 border-t border-stone-900">
              <span className="block text-xs font-semibold text-stone-300 text-right">مصاريف وإجراءات إضافية مرغوبة:</span>
              
              {/* Notary Warning Toggle */}
              <div className="flex items-center justify-between bg-stone-900/30 p-2.5 rounded-xl border border-stone-900/60 text-xs">
                <span className="text-stone-400">توجيه إنذار عدلي مسبق (بواسطة الكاتب العدل)</span>
                <input
                  type="checkbox"
                  checked={includeNotaryWarning}
                  onChange={(e) => setIncludeNotaryWarning(e.target.checked)}
                  className="accent-amber-500 w-3.5 h-3.5 cursor-pointer"
                />
              </div>

              {/* Expert Witness Toggle */}
              <div className="flex items-center justify-between bg-stone-900/30 p-2.5 rounded-xl border border-stone-900/60 text-xs text-right">
                <div>
                  <span className="text-stone-404 block">طلب تعيين خبير كشف فني متوقع</span>
                  <span className="text-[9px] text-stone-500 block">لتقدير قيمة أضرار أو تدقيق قيود محاسبية</span>
                </div>
                <input
                  type="checkbox"
                  checked={includeExpert}
                  onChange={(e) => setIncludeExpert(e.target.checked)}
                  className="accent-amber-500 w-3.5 h-3.5 cursor-pointer"
                />
              </div>
            </div>

            {/* Note addition */}
            <div className="pt-2">
              <label className="block text-[10px] text-stone-500 font-semibold mb-1">ملاحظات مخصصة تظهر في التقرير الاستشاري:</label>
              <textarea
                value={customLawsuitNotes}
                onChange={(e) => setCustomLawsuitNotes(e.target.value)}
                placeholder="اكتب اسم العميل، رقم الوثيقة أو تفاصيل المديونية لإدراجها بالتقرير النهائي المطبوع..."
                rows={2}
                className="w-full bg-stone-900 border border-stone-850 rounded-xl p-2.5 text-xs text-stone-300 focus:outline-none focus:border-amber-500/20 text-right"
              />
            </div>

          </div>
        </div>

        {/* Right Card: Calculation Results Bento layout (7 columns) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Bento Block 1: Executive Summary */}
          <div className="bg-stone-950 p-6 rounded-2xl border border-stone-900/80 space-y-4">
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block font-sans">نتائج الاحتساب والتقدير القانوني</span>
            
            <div className="flex justify-between items-start border-b border-stone-900/80 pb-3">
              <div>
                <h4 className="text-lg font-bold text-stone-100">{customSuitName || 'قضية حقوقية غير مسماة'}</h4>
                <div className="flex gap-2 items-center text-xs text-stone-400 mt-1">
                  <span className="bg-stone-900 px-2 py-0.5 rounded border border-stone-850">{results.courtTypeLabel}</span>
                  <span>•</span>
                  <span>المدعى عليهم: {defendantsCount}</span>
                </div>
              </div>
              <div className="text-left">
                <span className="text-[10px] text-stone-500 font-semibold block">إجمالي نفقات الخصومة والوكلاء التقريبي</span>
                <span className="text-xl font-bold font-sans text-amber-400">
                  {results.totalOverallMin.toLocaleString()} - {results.totalOverallMax.toLocaleString()} <span className="text-xs">د.أ</span>
                </span>
                <span className="text-[9px] text-stone-500 block">تشمل الرسوم وأتعاب الوكيل والدمغات</span>
              </div>
            </div>

            {/* Brief warning banner if labor case workers */}
            {results.isLaborExempt && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl flex items-start gap-2 text-emerald-400 text-xs">
                <Check size={16} className="shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">إعفاء عمالي معتمد بالأردن:</span>
                  <p className="text-[10px] text-stone-300 leading-relaxed mt-0.5">
                    الرسوم القضائية والدمغات وبطاقات التبليغ تساوي صفر دينار بمقتضى المادة 137 من قانون العمل الأردني للتخفيف على العامل.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Bento Block 2: Detailed Items Table */}
          <div className="bg-stone-950 p-6 rounded-2xl border border-stone-900/80 space-y-5">
            <div className="border-b border-stone-900/60 pb-2">
              <h4 className="text-xs font-bold text-stone-300 flex items-center justify-between">
                <span>1. الرسوم والنفقات المحكمية الرسمية (تدفع لصندوق المحكمة)</span>
                <span className="text-amber-500 font-sans font-semibold text-xs">{results.totalOfficialFees.toLocaleString()} د.أ</span>
              </h4>
            </div>

            <div className="space-y-3.5 text-xs">
              
              {/* court fee detail */}
              <div className="flex justify-between items-center text-stone-400">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>الرسم القضائي الأساسي لصندوق قصر العدل:</span>
                  <HelpCircle size={11} className="text-stone-600 hover:text-stone-400 cursor-pointer" title="تُحسب كـ 3% من قيمة المطالبة أو الأجرة السنوية" />
                </div>
                <span className="text-stone-200 font-sans font-bold">
                  {results.courtFree ? 'معفى (0 د.أ)' : `${results.courtFee} د.أ`}
                </span>
              </div>

              {/* standard bar stamps and welfare */}
              <div className="flex justify-between items-center text-stone-400">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-stone-700" />
                  <span>طابع الوكالة العدلية ودمغات نقابة المحامين والتعاون:</span>
                </div>
                <span className="text-stone-200 font-sans font-bold">{results.fixedStamps} د.أ</span>
              </div>

              {/* notifications */}
              <div className="flex justify-between items-center text-stone-400">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-stone-700" />
                  <span>أجور تبليغ الخصوم وورقة التبليغ القضائي:</span>
                </div>
                <span className="text-stone-200 font-sans font-bold">{results.notificationFee} د.أ</span>
              </div>

              {/* notary warning if included */}
              {includeNotaryWarning && (
                <div className="flex justify-between items-center text-stone-400 animate-fade-in">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-stone-700" />
                    <span>رسوم تسجيل وإنذار عدلي مالي مسبق للكاتب العدل:</span>
                  </div>
                  <span className="text-stone-200 font-sans font-bold">{results.notaryWarningFee} د.أ</span>
                </div>
              )}

              {/* Expert fee if included */}
              {includeExpert && (
                <div className="flex justify-between items-center text-stone-400 animate-fade-in">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-stone-700" />
                    <span>أجور ومصاريف الخبير الفني ومقدر الأضرار المعين:</span>
                  </div>
                  <span className="text-stone-200 font-sans font-bold">{results.expectedExpertFee} د.أ</span>
                </div>
              )}

              {/* Execution Fee hint */}
              {suitCategory === 'civil' && (
                <div className="bg-stone-900/30 p-3 rounded-lg border border-stone-900 text-[11px] text-stone-500 mt-2">
                  <span className="font-bold text-stone-400 block mb-1">💡 رسوم دائرة التنفيذ اللاحقة (تُدفع عند بدء تسييل الحكم القطعي):</span>
                  تُحتسب بقيمة <span className="text-amber-500 font-bold">4%</span> من المبلغ المحكوم به بحد أقصى مالي يبلغ <span className="text-stone-300">500 دينار أردني</span>، والمقدرة لهذه القضية بقيمة <span className="text-amber-400 font-bold font-sans">{results.executionFee} د.أ</span> (غير مضافة لإجمالي التسجيل الأولي الأعلى).
                </div>
              )}

            </div>
          </div>

          {/* Bento Block 3: Attorney Market Estimation */}
          <div className="bg-stone-950 p-6 rounded-2xl border border-stone-900/80 space-y-4">
            <div className="border-b border-stone-900/60 pb-2">
              <h4 className="text-xs font-bold text-stone-300">
                2. تقدير أتعاب المحاماة بالأردن (أتعاب الوكالة) 💼
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Box A: Contractual Lawyer Market rate */}
              <div className="bg-stone-900/30 p-4 rounded-xl border border-stone-900 space-y-1.5">
                <span className="text-[10px] text-stone-500 font-bold uppercase block">قيمة الأتعاب الاتفاقية (المتوسط التجاري):</span>
                <span className="text-base font-bold text-amber-400 font-sans block">
                  {results.attorneyMarketMin.toLocaleString()} - {results.attorneyMarketMax.toLocaleString()} د.أ
                </span>
                <p className="text-[9px] text-stone-400 leading-relaxed pt-1">
                  هذه هي الأتعاب التجارية المتعارف عليها لدى نقابة المحامين وسوق المحاماة الأردني للدفاع والتمثيل المتكامل لهذه الفئة من القضايا.
                </p>
              </div>

              {/* Box B: Court Awarded Attorney Fee */}
              <div className="bg-stone-900/30 p-4 rounded-xl border border-stone-900 space-y-1.5">
                <span className="text-[10px] text-stone-500 font-bold uppercase block">الأتعاب المحكوم بها للطرف الفائز (القانونية):</span>
                <span className="text-base font-bold text-emerald-400 font-sans block">
                  {results.courtAwardedFee.toLocaleString()} د.أ
                </span>
                <p className="text-[9px] text-stone-400 leading-relaxed pt-1">
                  بموجب المادة 46 من قانون النقابة الأردنية، يحكم القاضي بمبلغ يعادل <span className="text-emerald-500 font-bold">5%</span> من القيمة للطرف المحكوم له بحدود قانونية مقررة.
                </p>
              </div>

            </div>

            {/* Note about Minimum Legal Rates of Bar association */}
            <div className="bg-amber-500/5 border border-amber-500/10 p-3 rounded-xl text-[10px] text-stone-400 leading-relaxed">
              ⚠️ <span className="font-bold text-amber-500">ملاحظة تنظيمية:</span> لا تشمل الأتعاب الاتفاقية الرسوم القضائية والمصاريف الحكومية، ويجب تنظيم "عقد أتعاب محاماة" خطي يوضح أقساط الدفع ونسبة التحصيل عند كسب الدعوى لضمان سلامة التعامل بين الموكل والمحامي.
            </div>

          </div>

          {/* Action buttons (Print and Copy) */}
          <div className="flex gap-4">
            <button
              onClick={() => {
                let report = `⚖️ تقرير تقدير الرسوم وأتعاب المحاماة بالأردن\n`;
                report += `==========================================\n`;
                report += `تاريخ الطلب: ${new Date().toISOString().split('T')[0]}\n`;
                report += `نوع القضية: ${customSuitName || 'قضية حقوقية مخصصة'}\n`;
                report += `التصنيف القضائي: ${suitCategory === 'civil' ? 'مدني / حقوقية' : 'جزائي / شكوى'}\n`;
                report += `المحكمة ذات الاختصاص: ${results.courtTypeLabel}\n`;
                if (suitCategory === 'civil') {
                  report += `قيمة المطالبة / الأجرة السنوية: ${isEvictionCase ? annualRent : claimValue} دينار أردني\n`;
                }
                report += `مدعى عليهم: ${defendantsCount} شخص\n`;
                report += `------------------------------------------\n`;
                report += `1. الرسوم والنفقات المحكمية الإجمالية: ${results.totalOfficialFees} د.أ\n`;
                report += `   - الرسم القضائي الأساسي: ${results.courtFree ? '0 (معفى عمالياً)' : results.courtFee + ' د.أ'}\n`;
                report += `   - طابع الوكالة والدمغات والنقابة: ${results.fixedStamps} د.أ\n`;
                report += `   - رسوم تبليغ الخصوم الرسمية: ${results.notificationFee} د.أ\n`;
                if (includeNotaryWarning) report += `   - رسوم الإنذار العدلي للكاتب العدل: ${results.notaryWarningFee} د.أ\n`;
                if (includeExpert) report += `   - ميزانية الخبير الكشاف المقدرة: ${results.expectedExpertFee} د.أ\n`;
                report += `\n2. تقدير أتعاب المحاماة (الاتفاقية في السوق): ${results.attorneyMarketMin} إلى ${results.attorneyMarketMax} د.أ\n`;
                report += `   - الأتعاب المحكوم بها قانوناً للطرف الرابح: ${results.courtAwardedFee} د.أ\n`;
                if (suitCategory === 'civil') {
                  report += `   - رسوم دائرة التنفيذ المتوقعة لاحقاً: ${results.executionFee} د.أ\n`;
                }
                if (customLawsuitNotes) {
                  report += `\nملاحظات وتفاصيل القضية الملحقة:\n${customLawsuitNotes}\n`;
                }
                report += `==========================================\n`;
                report += `تم استخلاص هذا التقرير من المساعد القانوني لوزارة العدل بالأردن.`;

                navigator.clipboard.writeText(report);
                alert('تم نسخ تقرير تقدير الرسوم والأتعاب بالكامل للحافظة بنجاح!');
              }}
              className="flex-1 bg-stone-900 hover:bg-stone-850 text-amber-400 py-3 rounded-xl border border-stone-855 flex items-center justify-center gap-2 text-xs font-semibold font-sans transition-all hover:border-amber-500/20"
            >
              📋 نسخ تقرير الرسوم والأتعاب للحافظة
            </button>
            <button
              onClick={() => {
                window.print();
              }}
              className="bg-stone-900 hover:bg-stone-850 text-stone-300 p-3 rounded-xl border border-stone-850 flex items-center justify-center transition-all hover:border-stone-800"
              title="طباعة التقرير"
            >
              <Printer size={16} />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
