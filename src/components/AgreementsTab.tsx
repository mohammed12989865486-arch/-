import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  Printer, 
  Copy, 
  Bookmark, 
  Check, 
  Info, 
  Coins, 
  User, 
  Scale, 
  Plus, 
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { SavedDraft } from '../types';

interface AgreementsTabProps {
  onSaveDraft: (title: string, content: string) => void;
  drafts: SavedDraft[];
}

interface Installment {
  id: string;
  amount: string;
  dueDateOrEvent: string;
}

export default function AgreementsTab({ onSaveDraft, drafts }: AgreementsTabProps) {
  // Lawyer details (First Party)
  const [lawyerName, setLawyerName] = useState<string>('الأستاذ أحمد فوزي الخلايلة');
  const [lawyerId, setLawyerId] = useState<string>('9854');
  const [lawyerPhone, setLawyerPhone] = useState<string>('0791234567');
  const [lawyerAddress, setLawyerAddress] = useState<string>('عمان، الشميساني، مجمع المحاكم، الطابق الثالث مكتب 304');

  // Client details (Second Party)
  const [clientName, setClientName] = useState<string>('');
  const [clientNationalId, setClientNationalId] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientAddress, setClientAddress] = useState<string>('');

  // Case details
  const [opponentName, setOpponentName] = useState<string>('');
  const [caseSubject, setCaseSubject] = useState<string>('');
  const [courtName, setCourtName] = useState<string>('محكمة بداية حقوق عمان');
  const [targetCaseRole, setTargetCaseRole] = useState<'plaintiff' | 'defendant'>('plaintiff'); // الموكل مدعي أم مدعى عليه

  // Fees details
  const [totalFees, setTotalFees] = useState<string>('');
  const [advancePayment, setAdvancePayment] = useState<string>('');
  const [successPercentage, setSuccessPercentage] = useState<string>('');
  const [hasInstallments, setHasInstallments] = useState<boolean>(false);
  const [installments, setInstallments] = useState<Installment[]>([
    { id: '1', amount: '', dueDateOrEvent: 'عند تقديم البينات للمحكمة' }
  ]);

  // Special terms
  const [additionalTerms, setAdditionalTerms] = useState<string>('');

  // Generated Text State
  const [generatedText, setGeneratedText] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isEditingManually, setIsEditingManually] = useState<boolean>(false);
  const [manualText, setManualText] = useState<string>('');

  // Generate Agreement text dynamically
  const generateAgreementText = () => {
    const roleText = targetCaseRole === 'plaintiff' ? 'بصفته (مدعي)' : 'بصفته (مدعى عليه)';
    const successPercentageText = successPercentage 
      ? `بالإضافة إلى نسبة نجاح مئوية قدرها (${successPercentage}%) من القيمة الإجمالية للمحكوم به أو المصلحة المستردة.` 
      : '';
    
    let installmentsText = '';
    if (hasInstallments && installments.length > 0) {
      installmentsText = '\nعلى أن يتم سداد المبلغ المتبقي على النحو التالي (أقساط دفوعات):\n' + 
        installments.map((inst, index) => {
          return `${index + 1}. مبلغ قدره (${inst.amount || '___'}) دينار أردني مستحق الأداء عند (${inst.dueDateOrEvent || '___'}).`;
        }).join('\n');
    } else {
      installmentsText = `\nعلى أن يتم سداد الرصيد المتبقي وقدره (${Number(totalFees || 0) - Number(advancePayment || 0)} د.أ) عند حجز القضية للقرار أو باتفاق ودي لاحق.`;
    }

    return `اتفاقية عقد أتعاب محاماة وتنظيم تمثيل قضائي

بموجب أحكام قانون نقابة المحامين النظاميين الأردنيين رقم (11) لسنة 1972 وتعديلاته، تم إبرام وتحرير هذه الاتفاقية في الأردن بتاريخ ${new Date().toLocaleDateString('ar-JO')}، بين كل من:

الطرف الأول (المحامي الوكيل):
الاسم: ${lawyerName || '___'}
الرقم النقابي: ${lawyerId || '___'} | الهاتف الخلوي: ${lawyerPhone || '___'}
العنوان المختار للتبليغ: ${lawyerAddress || '___'}

الطرف الثاني (الموكل):
الاسم الكامل: ${clientName || '___'}
الرقم الوطني / رقم جواز السفر: ${clientNationalId || '___'} | الهاتف: ${clientPhone || '___'}
العنوان المختار لغايات التبليغ والاستلام: ${clientAddress || '___'}

وقد تم التفاهم والاتفاق بين الطرفين على البنود والشروط التالية كعقد ملزم لا تراجع عنه:

أولاً: مقدمة وصياغة النطاق:
تعتبر مقدمة هذه الاتفاقية جزءاً لا يتجزأ منها وتُقرأ معها ككل واحد. يفوض الطرف الثاني الطرف الأول بتمثيله قانونياً والتوكل عنه والقيام بجميع الإجراءات والاستشارات والطلبات القانونية اللازمة للدفاع عن حقوقه أو المطالبة بها.

ثانياً: موضوع وموضوع القضية:
1. يلتزم الطرف الأول بإقامة ومتابعة أو التوكل في القضية المتعلقة بـ (الموضوع):
[ ${caseSubject || 'يرجى تحديد موضوع ومطالبات القضية هنا بالتفصيل'} ]
2. المقامة من أو ضد (الخصم): ${opponentName || '___'}
3. لدى (المحكمة المختصة): ${courtName || '___'} أو أي جهة قضائية أو تحقيقية أخرى يستوجبها العمل.
4. يمثل الموكل في هذه القضية دور: ${roleText}.

ثالثاً: أتعاب المحاماة وآلية الاستحقاق السداد:
1. اتفق الطرفان برضاهما التام ودون إكراه على أن إجمالي أتعاب المحاماة المتفق عليها عن هذه الدعوى بجميع مراحلها والدرجات الابتدائية المحددة هي مبلغ وقدره (${totalFees || '0'} د.أ) (فقط مائة دينار أردني لا غير أو طبقاً للرقم أعلاه) يدفع منها دفعة أولى مقدمة غير مستردة عند التوقيع قدرها (${advancePayment || '0'} د.أ).
2. ${successPercentageText || 'لا يوجد نسبة نجاح مئوية إضافية مقررة، والأتعاب مقتصرة على المبلغ الثابت الموضح أعلاه.'}
${installmentsText}

رابعاً: المصاريف والرسوم والتكاليف الأخرى:
1. من المتفق عليه صراحةً أن رسوم المحاكم، أثمان الطوابع، أجور الخبراء، والرساميل الرسمية، وكافة المصاريف النثرية والتنفيذية وأجور الانتقال والتحري تقع بالكامل على عاتق الطرف الثاني (الموكل)، ويلتزم بدفعها فور طلب الطرف الأول وتقديم إيصال رسمي أو تقديري لها، ولا تعتبر جزءاً من أتعاب المحاماة المتفق عليها بأي حال.
2. كافة أتعاب المحاماة التي تحكم بها المحاكم الأردنية أو تقضي بها الدوائر القضائية لصالح الموكل تعتبر حَقاً خالصاً ومنفرداً للطرف الأول (المحامي) ولا يحق للموكل المطالبة بها أو خصمها من قيمة الاتفاقية.

خامساً: شروط الإلغاء، العزل، والاستحقاق:
1. إذا قام الطرف الثاني بعزل الطرف الأول أو إنهاء توكيله أو ثنيه عن مواصلة القضية بمحض رغبته وبدون إرادة المحامي، أو تسبب في إسقاط الدعوى أو إجراء مصالحة انفرادية مع الخصم دون علم وموافقة خطية من الطرف الأول، فإن كامل قيمة أتعاب المحاماة المتفق عليها تصبح مستحقة الأداء فوراً وبصورة كاملة دون الحاجة لإنذار أو إخطار.
2. يتعهد الطرف الثاني بتقديم كافة المستندات والوثائق والبيانات الخطية والشهود فور طلبها من الطرف الأول لتسهيل صياغة الدفوع واللوائح، ويتحمل الموكل وحده المسؤولية القانونية كاملة عن صحة وصناعة المستندات المسلَّمة للمحامي لتقديمها للمحكمة.

سادساً: أحكام عامة وجهة النزاع والقانون المطبق:
1. تخضع هذه الاتفاقية وتفسر بأكملها طبقاً لأحكام التشريعات الأردنية السارية وخاصة قانون نقابة المحامين النظاميين رقم 11 لسنة 1972 وتعديلاته.
2. في حال نشوء أي خلاف عنائي أو نزاع حول تفسير أو تطبيق هذه الاتفاقية أو قيمة الأتعاب، ينعقد الاختصاص الحصري لمجلس نقابة المحامين الأردنيين أو لجنة تقدير الأتعاب المنبثقة عنها أو محاكم عمان النظامية للاختصاص.
${additionalTerms ? `3. شروط إضافية خاصة بالطرفين المتفقين:\n[ ${additionalTerms} ]\n` : ''}
وعلى هذا التوقيع، حُررت هذه الاتفاقية على نسختين أصليتين بيد كل طرف نسخة للعمل والوفاء بموجبها وبثقة تامة.

الطرف الأول (المحامي الوكيل): _______________            الطرف الثاني (الموكل): _______________`;
  };

  // Sync state text
  useEffect(() => {
    if (!isEditingManually) {
      setGeneratedText(generateAgreementText());
    }
  }, [
    lawyerName, lawyerId, lawyerPhone, lawyerAddress,
    clientName, clientNationalId, clientPhone, clientAddress,
    opponentName, caseSubject, courtName, targetCaseRole,
    totalFees, advancePayment, successPercentage, hasInstallments, installments,
    additionalTerms, isEditingManually
  ]);

  const handleCopy = () => {
    navigator.clipboard.writeText(isEditingManually ? manualText : generatedText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handlePrint = () => {
    const textToPrint = isEditingManually ? manualText : generatedText;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('يرجى السماح بالنوافذ المنبثقة للتمكن من طباعة الاتفاقية المجهزة.');
      return;
    }
    printWindow.document.write(`
      <html>
        <head>
          <title>اتفاقية أتعاب محاماة</title>
          <style>
            body {
              font-family: 'Courier New', Courier, monospace, Arial;
              direction: rtl;
              padding: 40px;
              line-height: 1.8;
              font-size: 14px;
              color: #262626;
            }
            .title {
              text-align: center;
              font-size: 20px;
              font-weight: bold;
              margin-bottom: 30px;
              border-bottom: 2px double #000;
              padding-bottom: 10px;
            }
            pre {
              white-space: pre-wrap;
              word-wrap: break-word;
              text-align: justify;
            }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div class="title">المملكة الأردنية الهاشمية<br>اتفاقية تنظيم أتعاب محاماة وتوكيل للقضايا</div>
          <pre>${textToPrint}</pre>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleSave = () => {
    const finalContent = isEditingManually ? manualText : generatedText;
    if (!clientName.trim() && !caseSubject.trim()) {
      alert('يرجى توفير اسم الموكل وموضوع القضية حتى تتمكن من حفظ الاتفاقية بشكل مناسب.');
      return;
    }
    const title = `اتفاقية أتعاب: ${clientName || 'موكل'} - ${caseSubject || 'قضية حقوقية'}`;
    onSaveDraft(title, finalContent);
    alert('تم حفظ الاتفاقية بنجاح داخل مسوداتك المحفوظة بقائمة الملاحة!');
  };

  const handleAddInstallment = () => {
    setInstallments([
      ...installments,
      { id: Date.now().toString(), amount: '', dueDateOrEvent: '' }
    ]);
  };

  const handleRemoveInstallment = (id: string) => {
    setInstallments(installments.filter(inst => inst.id !== id));
  };

  const handleInstallmentChange = (id: string, field: 'amount' | 'dueDateOrEvent', value: string) => {
    setInstallments(installments.map(inst => {
      if (inst.id === id) {
        return { ...inst, [field]: value };
      }
      return inst;
    }));
  };

  const startManualEdit = () => {
    setManualText(generatedText);
    setIsEditingManually(true);
  };

  const stopManualEdit = () => {
    if (confirm('تنبيه: التراجع عن التعديل اليدوي سيعيد إنشاء النص تلقائياً بناءً على الخانات الجانبية وتفقد تعديلاتك اليدوية المباشرة. هل تود المتابعة؟')) {
      setIsEditingManually(false);
    }
  };

  return (
    <div className="space-y-6 text-right" id="agreements-tab-container">
      {/* Intro Header banner */}
      <div className="bg-gradient-to-l from-amber-500/10 via-stone-900/50 to-stone-950 p-6 rounded-2xl border border-amber-500/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-amber-400 mb-1 flex items-center gap-2">
              <Scale size={20} className="text-amber-400" />
              صائغ اتفاقيات أتعاب المحاماة المحترف (الأردن)
            </h3>
            <p className="text-stone-400 text-xs leading-relaxed max-w-3xl">
              قم بصياغة وتنظيم عقد تمثيل قضائي متكامل واتفاقية أتعاب محاماة للموكلين بالقضايا الحقوقية، العمالية، الجزائية، والشرعية وفقاً للنظام النقابي الأردني رقم 11 لسنة 1972، بما يضمن حقوقك وحقوق الموكل بنصوص رصينة من محكمة التمييز.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={handleSave}
              className="px-3.5 py-1.5 bg-amber-500 text-stone-950 text-xs font-bold rounded-lg hover:bg-amber-400 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Bookmark size={14} />
              حفظ الاتفاقية كمسودة
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* RIGHT COLUMN: Interactive Form Input Fields */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Section 1: Lawyer details (First Party) */}
          <div className="bg-stone-950/40 border border-stone-900 p-5 rounded-xl space-y-4">
            <h4 className="text-sm font-bold text-amber-405 border-b border-stone-900 pb-2 text-amber-400 flex items-center gap-2">
              <span className="w-5 h-5 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center text-xs">١</span>
              بيانات ومكتب الأستاذ المحامي (الطرف الأول)
            </h4>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-400 mb-1">اسم المحامي أو مكتب المحاماة</label>
                <input
                  type="text"
                  value={lawyerName}
                  onChange={(e) => setLawyerName(e.target.value)}
                  className="w-full bg-stone-900/70 border border-stone-800 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-amber-500"
                  placeholder="الأستاذ..."
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1">الرقم النقابي لنقابة المحامين</label>
                  <input
                    type="text"
                    value={lawyerId}
                    onChange={(e) => setLawyerId(e.target.value)}
                    className="w-full bg-stone-900/70 border border-stone-800 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-amber-500"
                    placeholder="مثال: 9854"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">رقم الهاتف الخلوي</label>
                  <input
                    type="text"
                    value={lawyerPhone}
                    onChange={(e) => setLawyerPhone(e.target.value)}
                    className="w-full bg-stone-900/70 border border-stone-800 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-amber-500"
                    placeholder="مثال: 0791234567"
                  />
                </div>
              </div>
              <div>
                <label className="block text-stone-400 mb-1">عنوان المكتب المختار للتبليغ</label>
                <input
                  type="text"
                  value={lawyerAddress}
                  onChange={(e) => setLawyerAddress(e.target.value)}
                  className="w-full bg-stone-900/70 border border-stone-800 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-amber-500"
                  placeholder="..."
                />
              </div>
            </div>
          </div>

          {/* Section 2: Client details (Second Party) */}
          <div className="bg-stone-950/40 border border-stone-900 p-5 rounded-xl space-y-4">
            <h4 className="text-sm font-bold text-amber-405 border-b border-stone-900 pb-2 text-amber-400 flex items-center gap-2">
              <span className="w-5 h-5 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center text-xs">٢</span>
              بيانات الموكل (الطرف الثاني)
            </h4>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-400 mb-1">الاسم الكامل للموكل</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-stone-900/70 border border-stone-800 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-amber-500"
                  placeholder="الاسم الثلاثي أو الرباعي للموكل"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1">الرقم الوطني / جواز السفر</label>
                  <input
                    type="text"
                    value={clientNationalId}
                    onChange={(e) => setClientNationalId(e.target.value)}
                    className="w-full bg-stone-900/70 border border-stone-800 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-amber-500"
                    placeholder="..."
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">رقم تواصل الموكل</label>
                  <input
                    type="text"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full bg-stone-900/70 border border-stone-800 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-amber-500"
                    placeholder="..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-stone-400 mb-1">العنوان السكني والمختار للتبليغ بالأردن</label>
                <input
                  type="text"
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  className="w-full bg-stone-900/70 border border-stone-800 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-amber-500"
                  placeholder="مثال: عمان، ماركا الجنوبية، قرب شارع الثورة"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Case details */}
          <div className="bg-stone-950/40 border border-stone-900 p-5 rounded-xl space-y-4">
            <h4 className="text-sm font-bold text-amber-405 border-b border-stone-900 pb-2 text-amber-400 flex items-center gap-2">
              <span className="w-5 h-5 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center text-xs">٣</span>
              موضوع الدعوى والمحكمة المختصة
            </h4>
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1">صفة الموكل في القضية</label>
                  <select
                    value={targetCaseRole}
                    onChange={(e) => setTargetCaseRole(e.target.value as 'plaintiff' | 'defendant')}
                    className="w-full bg-stone-900/70 border border-stone-800 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="plaintiff">مدعي (صاحب الحق المطالب)</option>
                    <option value="defendant">مدعى عليه (مدافع ومستهدف)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">اسم الخصم (الطرف الآخر)</label>
                  <input
                    type="text"
                    value={opponentName}
                    onChange={(e) => setOpponentName(e.target.value)}
                    className="w-full bg-stone-900/70 border border-stone-800 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-amber-500"
                    placeholder="اسم الخصم المدعى عليه"
                  />
                </div>
              </div>
              <div>
                <label className="block text-stone-400 mb-1">اسم المحكمة المختصة بنظر النزاع</label>
                <input
                  type="text"
                  value={courtName}
                  onChange={(e) => setCourtName(e.target.value)}
                  className="w-full bg-stone-900/70 border border-stone-800 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-amber-500"
                  placeholder="مثال: محكمة بداية حقوق اربد، محكمة صلح شمال عمان"
                />
              </div>
              <div>
                <label className="block text-stone-400 mb-1">موضوع القضية ونطاق المطالبات بدقة</label>
                <textarea
                  value={caseSubject}
                  onChange={(e) => setCaseSubject(e.target.value)}
                  rows={2}
                  className="w-full bg-stone-900/70 border border-stone-800 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-amber-500 resize-none"
                  placeholder="مثال: المطالبة بأجور مأجور مترتبة عن شقة سكنية وإخلاء المأجور لعدم دفع الأجرة، وقيمة الأجور المستحقة قدرها 3000 دينار."
                />
              </div>
            </div>
          </div>

          {/* Section 4: Fees details */}
          <div className="bg-stone-950/40 border border-stone-900 p-5 rounded-xl space-y-4">
            <h4 className="text-sm font-bold text-amber-405 border-b border-stone-900 pb-2 text-amber-400 flex items-center gap-2">
              <span className="w-5 h-5 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center text-xs">٤</span>
              الأتعاب والآلية المتفق عليها للسداد
            </h4>
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1">إجمالي الأتعاب المقررة (د.أ)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={totalFees}
                      onChange={(e) => setTotalFees(e.target.value)}
                      className="w-full bg-stone-900/70 border border-stone-800 rounded-lg py-2 pl-8 pr-3 text-white focus:outline-none focus:border-amber-500 font-bold"
                      placeholder="الأتعاب الكلية"
                    />
                    <Coins size={14} className="absolute left-3 top-3 text-stone-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">الدفعة المقدمة (غير مستردة)</label>
                  <input
                    type="number"
                    value={advancePayment}
                    onChange={(e) => setAdvancePayment(e.target.value)}
                    className="w-full bg-stone-900/70 border border-stone-800 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-amber-500"
                    placeholder="مقدم الأتعاب"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-400 mb-1">نسبة نجاح مئوية إضافية من تحصيل المحكوم به (إن وجدت • %)</label>
                <input
                  type="text"
                  value={successPercentage}
                  onChange={(e) => setSuccessPercentage(e.target.value)}
                  className="w-full bg-stone-900/70 border border-stone-800 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-amber-500"
                  placeholder="مثال: 10 أو 5 أو اتركها فارغة"
                />
              </div>

              {/* Installment Switcher */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-stone-300">
                  <input
                    type="checkbox"
                    checked={hasInstallments}
                    onChange={(e) => setHasInstallments(e.target.checked)}
                    className="rounded border-stone-800 text-amber-500 focus:ring-0 bg-stone-900"
                  />
                  <span>تقسيط المبلغ المتبقي على دفعات أو مراحل قضائية؟</span>
                </label>
              </div>

              {hasInstallments && (
                <div className="space-y-2 pt-2 border-t border-stone-900">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400 font-semibold">توزيع الدفعات المتبقية:</span>
                    <button
                      type="button"
                      onClick={handleAddInstallment}
                      className="text-[11px] text-amber-500 hover:text-amber-400 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={12} /> أضف قسطاً جديداً
                    </button>
                  </div>

                  {installments.map((inst, index) => (
                    <div key={inst.id} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-5">
                        <input
                          type="number"
                          value={inst.amount}
                          onChange={(e) => handleInstallmentChange(inst.id, 'amount', e.target.value)}
                          placeholder="القدر بالدينار"
                          className="w-full bg-stone-900/80 border border-stone-800 rounded-lg py-1.5 px-2 text-white text-xs focus:outline-none"
                        />
                      </div>
                      <div className="col-span-6">
                        <input
                          type="text"
                          value={inst.dueDateOrEvent}
                          onChange={(e) => handleInstallmentChange(inst.id, 'dueDateOrEvent', e.target.value)}
                          placeholder="مثل: بعد تقديم البينة الشخصية"
                          className="w-full bg-stone-900/80 border border-stone-800 rounded-lg py-1.5 px-2 text-white text-xs focus:outline-none"
                        />
                      </div>
                      <div className="col-span-1 text-center">
                        {installments.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveInstallment(inst.id)}
                            className="text-stone-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section 5: Additional terms and conditions */}
          <div className="bg-stone-950/40 border border-stone-900 p-5 rounded-xl space-y-4">
            <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
              شروط وأحكام خاصة إضافية (اختياري)
            </h4>
            <textarea
              value={additionalTerms}
              onChange={(e) => setAdditionalTerms(e.target.value)}
              rows={3}
              placeholder="مثال: يلتزم الطرف الأول بشمول هذه الاتفاقية لمرحلة الاستئناف أيضاً، أو غير ذلك من اتفاقات خاصة بنقليات السفر والشهود..."
              className="w-full bg-stone-900/70 border border-stone-800 rounded-lg py-2 px-3 text-white text-xs focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

        </div>

        {/* LEFT COLUMN: Smart Agreement Live Preview (Paper Style) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Action Toolbar */}
          <div className="bg-stone-950/40 border border-stone-900 p-3 rounded-xl flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-stone-300">عرض معاينة صك الاتفاقية الفوري</span>
            </div>
            
            <div className="flex items-center gap-2">
              {isEditingManually ? (
                <button
                  onClick={stopManualEdit}
                  className="px-3 py-1 bg-stone-800 border border-stone-700 text-stone-300 hover:text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  التبديل إلى الصياغة التلقائية
                </button>
              ) : (
                <button
                  onClick={startManualEdit}
                  className="px-3 py-1 bg-amber-505 bg-stone-900 border border-stone-800 text-amber-400 hover:bg-amber-500/10 rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  عدل العقد يدوياً
                </button>
              )}

              <button
                onClick={handleCopy}
                className="px-3 py-1 bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              >
                {isCopied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                {isCopied ? 'تم نسخ الاتفاقية' : 'نسخ النص'}
              </button>

              <button
                onClick={handlePrint}
                className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-stone-950 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              >
                <Printer size={12} />
                طباعة وتصدير
              </button>
            </div>
          </div>

          {/* Legal Document Sheet (Paper Style) */}
          <div className="relative bg-orange-50/1 text-stone-900 bg-white border border-stone-200 shadow-2xl rounded-2xl p-6 md:p-10 font-sans leading-relaxed text-right min-h-[700px] flex flex-col justify-between select-text" style={{ direction: 'rtl' }}>
            
            {/* Elegant Jordanian Official Border Pattern */}
            <div className="absolute top-3 left-3 right-3 bottom-3 border border-amber-900/10 pointer-events-none rounded-xl" />
            <div className="absolute top-5 left-5 right-5 bottom-5 border-2 border-double border-amber-950/20 pointer-events-none rounded-lg" />
            
            {/* Header Title */}
            <div className="relative z-10">
              <div className="text-center space-y-1 pb-6 mb-6 border-b border-stone-200">
                <p className="text-xs tracking-wider text-stone-500 font-bold">اتفاقية أتعاب محاماة وتوكيل خاصة بالقضايا والمطالبات</p>
                <h2 className="text-lg md:text-xl font-extrabold text-stone-900">المملكة الأردنية الهاشمية</h2>
                <div className="flex justify-center gap-1.5 text-[10px] text-stone-400 font-mono">
                  <span>صيغت رقمياً بموجب أنظمة نقابة المحامين</span>
                </div>
              </div>

              {/* Editable or Dynamic Text Container */}
              {isEditingManually ? (
                <div className="relative">
                  <span className="absolute left-2 top-2 bg-amber-500/20 text-amber-900 border border-amber-500/30 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">وضع التحرير اليدوي المستمر</span>
                  <textarea
                    value={manualText}
                    onChange={(e) => setManualText(e.target.value)}
                    rows={28}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg p-4 font-mono text-xs md:text-sm text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    placeholder="اكتب أو عدل محتوى الاتفاقية هنا..."
                  />
                </div>
              ) : (
                <pre className="font-sans text-xs md:text-sm text-stone-800 whitespace-pre-wrap text-justify leading-relaxed tracking-wide select-text">
                  {generatedText}
                </pre>
              )}
            </div>

            {/* Warning notes or terms at bottom of paper */}
            <div className="relative z-10 border-t border-stone-200 mt-8 pt-4 flex flex-col md:flex-row justify-between text-[11px] text-stone-500 gap-4">
              <span className="flex items-center gap-1">
                <Info size={12} className="text-amber-600" />
                تخضع الاتفاقية للقانون الأردني وأحكام الهيئة التقديرية لنقابة المحامين.
              </span>
              <span>عدالتي © المنظومة الوطنية للمحامين</span>
            </div>
          </div>

          {/* Quick Jordanian Legal Advice Banner */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex gap-3 text-right">
            <AlertTriangle className="text-amber-500 shrink-0" size={18} />
            <p className="text-stone-300 text-[11px] leading-relaxed">
              <strong>قاعدة قانونية أردنية هامة:</strong> بموجب المادة 46 من قانون نقابة المحامين، لا يجوز بأي حال أن تزيد الأتعاب المتفق عليها عن نسبة (25%) من القيمة المادية الحقيقية لموضوع الدعوى أو المحكوم به، وإلا اعتبر الاتفاق باطلاً فيما زاد عن هذه النسبة كحد أقصى.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
