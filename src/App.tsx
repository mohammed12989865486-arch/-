/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Scale, 
  BookOpen, 
  FileText, 
  Briefcase, 
  Clock, 
  MessageSquare, 
  Download, 
  Copy, 
  Check, 
  Search, 
  Bookmark, 
  Trash2, 
  Edit3, 
  ChevronRight, 
  AlertCircle, 
  Send, 
  Plus, 
  Printer, 
  Lock, 
  Info,
  ExternalLink,
  RotateCcw,
  MapPin,
  Landmark,
  Route,
  Calculator,
  Coins,
  FileCheck,
  Menu,
  ChevronDown,
  ChevronUp,
  List,
  Smartphone,
  Award,
  Handshake
} from 'lucide-react';
import { motion } from 'motion/react';
import LockScreen from './components/LockScreen';
import FeesCalculator from './components/FeesCalculator';
import AgreementsTab from './components/AgreementsTab';
import ContractsTab from './components/ContractsTab';
import PetitionsTab from './components/PetitionsTab';
import MobileSetupTab from './components/MobileSetupTab';
import AppLogo from './components/AppLogo';
import { 
  agencyTemplates, 
  jordanianLaws, 
  lawsuitTemplates, 
  jordanianDeadlines,
  courtJurisdictions
} from './data/jordanLaws';
import { caseRegistrationPathways } from './data/caseRegistration';
import { 
  AgencyTemplate, 
  LawsuitTemplate, 
  JordanianLaw, 
  LegalDuration, 
  ChatMessage, 
  SavedDraft,
  CourtJurisdiction,
  CaseRegistrationPathway,
  RegistrationStage
} from './types';

const auditPresets = [
  {
    title: "مستأجر ممتنع عن الدفع ومطالبة بفسخ العقد وإخلاء مأجور",
    description: "نزاع حول شقة سكنية مؤجرة في عمان، ممتنع المستأجر عن سداد الأجرة منذ 4 أشهر ويرفض مالك العقار الانتظار دون اتخاذ إجراء.",
    category: "civil",
    courtType: "محكمة صلح حقوق غرب عمان",
    defendants: "أحمد بن سعيد المري (المستأجر)",
    facts: "أبرم مؤجر في غرة شهر كانون الثاني من عام 2024 عقداً خطياً مع مستأجر ليسكن شقة مقابل أجرة شهرية 300 دينار تدفع مقدماً مطلع كل شهر. مطلع شهر شباط، توقف المستأجر عن الدفع واعتذر بالظروف المادية. والآن مضت 4 شهور دون سداد أي إيجار (بمجموع 1200 دينار). قام المالك بالاتصال بالمستأجر مراراً الذي أخبره أنه لن يخرج من الشقة ولن يدفع إلا بأمر المحكمة. المالك يطالب بفسخ عقد الإيجار فوراً وإخلائه من العقار والمطالبة بالأجور المترتبة.",
    evidences: "عقد الإيجار السكني الخطي الموقع بين الطرفين، كشف تحويلات بنكية فارغ يثبت عدم الدفع، شاهد حارس البناية على واقعة إشغال الشقة والرفض."
  },
  {
    title: "كمبيالة مالية موقعة من كفيل ومدين للمطالبة المالية",
    description: "مطالبة بقيمة كمبيالة لجهة تجارية بمبلغ 5000 دينار موقعة منذ 16 سنة وبقيت مخزنة لخلاف شخصي.",
    category: "civil",
    courtType: "محكمة بداية حقوق جنوب عمان",
    defendants: "سليمان الفخري (المدين الأصلي)، جاسم الرابي (كفيل متضامن)",
    facts: "تتضمن هذه القضية تسييل وسحب كمبيالة تجارية محررة لصالح المدعي وموقعة من المدين الأول بصفته محررها، وكفالة تضامنية موقعة بالخلف من الكفيل جاسم الرابي. القيمة الأصلية المحسوبة بالسند هي خمسة آلاف دينار أردني مستحقة الأداء والدفع في تاريخ 01-05-2010. لم يتم سداد أو دفع أي فلس من قيمتها نظراً لسفر المدعى عليه الأصلي طيلة هذه السنوات واختفائه. وبسبب عودته مؤخراً، يرغب المدعي في رفع دعوى مطالبة مالية وصرف السند ضدهم تضامناً وتكافلاً.",
    evidences: "سند كمبيالة خطي أصلي مؤرخ وموقع من محررها ومذيل بكفيل متضامن، رسالة خطية حديثة بالاعتراف بالالتزام عبر منصة الواتساب."
  },
  {
    title: "نزاع على إثبات ملكية عقار وتعدي الأقارب",
    description: "نزاع حول قطعة أرض زراعية في محافظة إربد، مغشاة بوضع يد بدون طابو مستنداً للاتفاق الشفهي.",
    category: "civil",
    courtType: "محكمة بداية حقوق إربد",
    defendants: "ورثة مفلح الصالح (أبناء العم)",
    facts: "آلت قطعة أرض زراعية بمساحة 4 دونمات في لواء الكورة / إربد للمدعي بالإرث غير المسجل من عائلته في السبعينات. ظل والد المدعي يزرع الأرض لثلاثين سنة. عام 2012، قام المدعى عليهم (وهم أبناء عمومة المالك) بوضع يد على القسم الجنوبي من الأرض بطول 40 متراً وضمها إلى حديقتهم مستندين إلى اتفاق قديم شفهي بين الآباء لم يدون بأي دائرة تسجيل عقاري أو طابو. يطالب المدعي بإثبات ملكيته الكاملة وإزالة تداخل الحدود واسترداد الأنفال المغتصبة.",
    evidences: "شهادات جيران وشهود عيان تؤكد زراعة والد المدعي للأرض طيلة ثلاثين سنة دون انقطاع، وثيقة إرث وشهادة حصر إرث شرعي، إقرار قديم بخط يد الجد ولكنه غير موثق بالدولة."
  }
];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Basic session-level verification (using sessionStorage for automatic lock on tab/window close)
    const saved = sessionStorage.getItem('adalaty_logged_in');
    return saved === 'true';
  });

  const [activeTab, setActiveTab ] = useState<'home' | 'agencies' | 'suits' | 'laws' | 'durations' | 'ai' | 'drafts' | 'jurisdictions' | 'registration' | 'calculator' | 'audit' | 'agreements' | 'contracts' | 'petitions' | 'mobile'>('home');
  const [isMenuExpanded, setIsMenuExpanded] = useState<boolean>(true);
  const [isServicesExpanded, setIsServicesExpanded] = useState<boolean>(true);

  // Auto-expand Services dropdown of sidebar if any non-home tab is active
  useEffect(() => {
    if (activeTab !== 'home') {
      setIsServicesExpanded(true);
    }
  }, [activeTab]);

  const handleTabChange = (tab: typeof activeTab, additionalActions?: () => void) => {
    setActiveTab(tab);
    if (additionalActions) {
      additionalActions();
    }
    
    // Automatically close the sidebar accordion menu
    setIsMenuExpanded(false);

    // Smooth scroll down to the content area
    setTimeout(() => {
      const mainContent = document.getElementById('main-content-scroll-target');
      if (mainContent) {
        // Scroll main content container itself to top
        mainContent.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        
        // Scroll the browser window so the content area is positioned nicely (essential on mobile)
        mainContent.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 50);
  };

  // Case Registration states
  const [selectedPathwayId, setSelectedPathwayId] = useState<'civil' | 'penal'>('civil');
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [registrationSearchQuery, setRegistrationSearchQuery] = useState<string>('');

  // Court Jurisdictions Filter state
  const [jurisdictionSearchQuery, setJurisdictionSearchQuery] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<'all' | 'central' | 'northern' | 'southern'>('all');
  const [selectedGovernorate, setSelectedGovernorate] = useState<string>('all');
  const [jurisdictionTabMode, setJurisdictionTabMode] = useState<'courts' | 'judges'>('courts');

  // Agency formulation state
  const [selectedAgency, setSelectedAgency] = useState<AgencyTemplate | null>(null);
  const [agencyData, setAgencyData] = useState<Record<string, string>>({});
  const [generatedAgencyText, setGeneratedAgencyText] = useState<string>('');

  // Lawsuit formulation state
  const [selectedSuit, setSelectedSuit] = useState<LawsuitTemplate | null>(null);
  const [suitData, setSuitData] = useState<Record<string, string>>({});
  const [generatedSuitText, setGeneratedSuitText] = useState<string>('');

  // Laws query state
  const [selectedLaw, setSelectedLaw] = useState<JordanianLaw | null>(null);
  const [lawSearchQuery, setLawSearchQuery] = useState<string>('');
  const [viewingArticle, setViewingArticle] = useState<string | null>(null);

  // Saved Drafts state
  const [drafts, setDrafts] = useState<SavedDraft[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // AI Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // AI Case Auditing states
  const [auditTitle, setAuditTitle] = useState<string>('');
  const [auditCategory, setAuditCategory] = useState<string>('civil');
  const [auditCourtType, setAuditCourtType] = useState<string>('محكمة صلح الحقوق');
  const [auditFacts, setAuditFacts] = useState<string>('');
  const [auditDefendants, setAuditDefendants] = useState<string>('');
  const [auditEvidences, setAuditEvidences] = useState<string>('');
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditError, setAuditError] = useState<string | null>(null);
  const [auditResult, setAuditResult] = useState<{
    suitability: string;
    vulnerabilities: string[];
    defenseStrategies: string[];
    evidencesNeeded: string[];
    roadmapSteps: string[];
  } | null>(null);

  // Initialize and load saved drafts
  useEffect(() => {
    const saved = localStorage.getItem('adalaty_drafts');
    if (saved) {
      try {
        setDrafts(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Sync drafts helper
  const saveDraftsToStorage = (newDrafts: SavedDraft[]) => {
    setDrafts(newDrafts);
    localStorage.setItem('adalaty_drafts', JSON.stringify(newDrafts));
  };

  const handleUnlock = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('adalaty_logged_in', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adalaty_logged_in');
    localStorage.removeItem('adalaty_logged_in'); // Clean up any legacy localStorage entry
  };

  // Helper to copy text to clipboard
  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Handle saving agency draft
  const handleSaveAgency = () => {
    if (!generatedAgencyText || !selectedAgency) return;
    const newDraft: SavedDraft = {
      id: `draft-agency-${Date.now()}`,
      title: `وكالة: ${selectedAgency.title} - ${agencyData.principalName || 'الموكل'}`,
      type: 'agency',
      content: generatedAgencyText,
      createdAt: new Date().toLocaleDateString('ar-JO')
    };
    const updated = [newDraft, ...drafts];
    saveDraftsToStorage(updated);
    alert('تم حفظ الوكالة بنجاح في قسم مسوداتك!');
  };

  // Handle saving lawsuit draft
  const handleSaveSuit = () => {
    if (!generatedSuitText || !selectedSuit) return;
    const newDraft: SavedDraft = {
      id: `draft-suit-${Date.now()}`,
      title: `لائحة: ${selectedSuit.title} - ${suitData.pName || 'المدعي'}`,
      type: 'suit',
      content: generatedSuitText,
      createdAt: new Date().toLocaleDateString('ar-JO')
    };
    const updated = [newDraft, ...drafts];
    saveDraftsToStorage(updated);
    alert('تم حفظ لائحة الدعوى بنجاح في مسوداتك!');
  };

  // Delete draft
  const handleDeleteDraft = (id: string) => {
    if (confirm('هل أنت متأكد من رغبتك في حذف هذه المسودة؟')) {
      const filtered = drafts.filter(d => d.id !== id);
      saveDraftsToStorage(filtered);
    }
  };

  // --- CASE AUDITING EVENT HANDLERS ---
  const handleStartAudit = async () => {
    if (!auditTitle.trim() || !auditFacts.trim()) {
      setAuditError('يرجى كتابة عنوان القضية والوقائع الرئيسية على الأقل لبدء عملية التدقيق.');
      return;
    }

    setIsAuditing(true);
    setAuditError(null);
    setAuditResult(null);

    try {
      const response = await fetch('/api/gemini/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: auditTitle,
          category: auditCategory,
          courtType: auditCourtType,
          facts: auditFacts,
          defendants: auditDefendants,
          evidences: auditEvidences,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'حدث خطأ في الاتصال بالمدقق الذكي.');
      }

      setAuditResult(data);
    } catch (err: any) {
      console.error(err);
      setAuditError(err.message || 'فشلت عملية تدقيق القضية. يرجى التحقق من إعدادات المفتاح وسرعة الاتصال.');
    } finally {
      setIsAuditing(false);
    }
  };

  const exportToWord = () => {
    if (!auditResult) return;
    const content = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <title>تقرير تدقيق قضية - برنامج عدالتي AI</title>
        <style>
          body { font-family: 'Arial', sans-serif; direction: rtl; text-align: right; line-height: 1.6; padding: 20px; }
          h1 { color: #854d0e; text-align: center; border-bottom: 2px solid #eab308; padding-bottom: 10px; }
          h2 { color: #1c1917; border-right: 4px solid #eab308; padding-right: 10px; margin-top: 30px; }
          ul, ol { padding-right: 20px; }
          li { margin-bottom: 5px; }
          .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .meta-table td { padding: 8px; border: 1px solid #ddd; }
          .card { background-color: #fcfbf7; border: 1px solid #ebd8a0; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
          .danger { background-color: #fef2f2; border: 1px solid #fee2e2; }
          .info { background-color: #eff6ff; border: 1px solid #dbeafe; }
          .footer { text-align: center; font-size: 11px; color: #888; margin-top: 50px; border-top: 1px solid #eee; padding-top: 10px; }
        </style>
      </head>
      <body>
        <h1>تقرير التدقيق القانوني الذكي للحقوق والدفوع</h1>
        <p style="text-align: center; font-size: 12px; color: #666;">صادر عن منصة عَدالتي للذكاء الاصطناعي للأستاذ المحامي • تاريخ الإصدار: ${new Date().toLocaleDateString('ar-JO')}</p>
        
        <table class="meta-table">
          <tr>
            <td><strong>موضوع ومسمى القضية:</strong></td>
            <td>${auditTitle || 'غير محدد'}</td>
          </tr>
          <tr>
            <td><strong>تصنيف أو قسم الدعوى:</strong></td>
            <td>${auditCategory === 'civil' ? 'حقوقية / مدنية' : 'جزائية / جنحية'}</td>
          </tr>
          <tr>
            <td><strong>المحكمة المختصة المقترحة:</strong></td>
            <td>${auditCourtType}</td>
          </tr>
          <tr>
            <td><strong>الخصم / المدعى عليه:</strong></td>
            <td>${auditDefendants || 'غير محدد'}</td>
          </tr>
        </table>

        <h2>1. ملاءمة الاختصاص والخصومة 🏛️</h2>
        <div class="card info">
          <p>${auditResult.suitability}</p>
        </div>

        <h2>2. الثغرات القانونية والمخاطر المكتشفة ⚠️</h2>
        <div class="card danger">
          <ul>
            ${auditResult.vulnerabilities.map(v => `<li>${v}</li>`).join('')}
          </ul>
        </div>

        <h2>3. النصائح الاستراتيجية ودفوع المدعى عليه 🎯</h2>
        <div class="card">
          <ul>
            ${auditResult.defenseStrategies.map(d => `<li>${d}</li>`).join('')}
          </ul>
        </div>

        <h2>4. البينات ومصادر الإثبات المطلوبة 📋</h2>
        <div class="card">
          <ul>
            ${auditResult.evidencesNeeded.map(e => `<li>${e}</li>`).join('')}
          </ul>
        </div>

        <h2>5. خريطة الطريق والخطوات الدقيقة اللاحقة 📍</h2>
        <div class="card" style="border-right: 4px solid #16a34a;">
          <ol>
            ${auditResult.roadmapSteps.map(r => `<li>${r}</li>`).join('')}
          </ol>
        </div>

        <div class="footer">
          <p>تنبيه مهم: هذا التقرير وليد حوكمة ذكاء اصطناعي مخصصة للمحاضر القانونية والمطالعة الذكية للزميل الممارس بالأردن.</p>
          <p>عدالتي لأتمتة أعمال وكلاء الدفاع الأردنيين</p>
        </div>
      </body>
      </html>
    `;
    const blob = new Blob(['\ufeff' + content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `تقرير_تدقيق_قضية_${auditTitle.replace(/\s+/g, '_') || 'عدالتي'}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToImage = () => {
    if (!auditResult) return;
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Classical Background
    ctx.fillStyle = '#1c1917'; // Rich dark stone background matching the app's aesthetic
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines for background pattern
    ctx.strokeStyle = '#292524';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // 2. Elegant Border
    ctx.strokeStyle = '#eab308'; // Amber border
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    ctx.strokeStyle = '#292524'; 
    ctx.lineWidth = 1;
    ctx.strokeRect(26, 26, canvas.width - 52, canvas.height - 52);

    // 3. Header Logo & Badges
    ctx.fillStyle = '#eab308';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⚖️ تقرير التدقيق القانوني الذكي - عدالتي AI', canvas.width / 2, 80);

    ctx.fillStyle = '#a8a29e';
    ctx.font = '13px sans-serif';
    ctx.fillText(`ثغرات المطالبة وحوكمة الخصوم • المحاكم الأردنية`, canvas.width / 2, 115);
    ctx.fillText(`تاريخ الاستخراج: ${new Date().toLocaleDateString('ar-JO')} (استخدام داخلي للمحاماة)`, canvas.width / 2, 140);

    // Divider
    ctx.strokeStyle = '#44403c';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, 160);
    ctx.lineTo(canvas.width - 50, 160);
    ctx.stroke();

    // 4. Case Metadata Table
    ctx.fillStyle = '#292524';
    ctx.fillRect(50, 180, canvas.width - 100, 120);
    ctx.strokeStyle = '#44403c';
    ctx.strokeRect(50, 180, canvas.width - 100, 120);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#eab308';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('• بيان تفاصيل القضية المدققة:', canvas.width - 70, 210);

    ctx.fillStyle = '#f5f5f4';
    ctx.font = '13px sans-serif';
    ctx.fillText(`عنوان وملخص النزاع: ${auditTitle || 'قضية حقوقية مجهولة'}`, canvas.width - 80, 240);
    ctx.fillText(`المحكمة المقترحة للتسجيل: ${auditCourtType}`, canvas.width - 80, 265);
    ctx.fillText(`الخصم الثاني / المدعى عليه: ${auditDefendants || 'قيد التدقيق والتحقق'}`, canvas.width - 80, 290);

    // 5. Section: Suitability
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(50, 320, canvas.width - 100, 100);
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 1;
    ctx.strokeRect(50, 320, canvas.width - 100, 100);

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('1. تكييف الاختصاص الجغرافي والنوعي 🏛️', canvas.width - 70, 350);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px sans-serif';
    wrapText(ctx, auditResult.suitability, canvas.width - 80, 380, canvas.width - 160, 20);

    // 6. Section: Top Vulnerabilities (Max 2 for fitting)
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(50, 440, canvas.width - 100, 160);
    ctx.strokeStyle = '#f87171';
    ctx.strokeRect(50, 440, canvas.width - 100, 160);

    ctx.fillStyle = '#f87171';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('2. أبرز الثغرات القانونية والمخاطر المكتشفة ⚠️', canvas.width - 70, 470);

    ctx.fillStyle = '#fca5a5';
    ctx.font = '12px sans-serif';
    let yIdx = 505;
    auditResult.vulnerabilities.slice(0, 3).forEach((vuln) => {
      wrapText(ctx, '⚡ ' + vuln, canvas.width - 80, yIdx, canvas.width - 160, 18);
      yIdx += 40;
    });

    // 7. Section: Recommendation Steps
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(50, 620, canvas.width - 100, 160);
    ctx.strokeStyle = '#34d399';
    ctx.strokeRect(50, 620, canvas.width - 100, 160);

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('3. التوصيات الاستراتيجية والإجراءات الدقيقة 🎯', canvas.width - 70, 650);

    ctx.fillStyle = '#a7f3d0';
    ctx.font = '12px sans-serif';
    let rIdx = 685;
    auditResult.roadmapSteps.slice(0, 3).forEach((step, index) => {
      wrapText(ctx, `${index + 1}. ${step}`, canvas.width - 80, rIdx, canvas.width - 160, 18);
      rIdx += 40;
    });

    // 8. Seal / Sign area
    ctx.font = 'italic bold 14px sans-serif';
    ctx.fillStyle = '#eab308';
    ctx.fillText('ختم الاعتماد الرقمي من عدالتي AI', canvas.width - 100, 840);
    
    // Draw simple circular stamp
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(canvas.width - 200, 880, 45, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('عدالتي AI', canvas.width - 200, 875);
    ctx.fillText('مُدَقَّقّ', canvas.width - 200, 895);

    // Official notice at bottom
    ctx.fillStyle = '#78716c';
    ctx.font = '11px sans-serif';
    ctx.fillText('إخلاء مسؤولية: هذا المستند تم تدقيقه بصرياً بمطالعة خوارزمية ذكية لمساندة المحامي الأردني في الاستكشاف والتدقيق.', canvas.width / 2, 950);
    ctx.fillText('برمجة وحقوق منصة عدالتي الإلكترونية بالأردن لعام 2026', canvas.width / 2, 970);

    // Download linkage
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `تقرير_تدقيق_قضية_صورة_${auditTitle.replace(/\s+/g, '_') || 'عدالتي'}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Helper text-wrapper for Canvas
  function wrapText(context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
      let testLine = line + words[n] + ' ';
      let metrics = context.measureText(testLine);
      let testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        context.fillText(line.trim(), x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    context.fillText(line.trim(), x, currentY);
  }

  // Handle AI Chat submissions
  const handleSendPrompt = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentPrompt.trim() || isAiLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: currentPrompt,
      timestamp: new Date().toLocaleTimeString('ar-JO', { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    const promptToSend = currentPrompt;
    setCurrentPrompt('');
    setIsAiLoading(true);
    setApiError(null);

    // Auto-scroll after user message
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: promptToSend,
          history: chatMessages
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'فشل الاتصال بخدمة الذكاء الاصطناعي');
      }

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: data.text,
        timestamp: new Date().toLocaleTimeString('ar-JO', { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      setApiError(err.message || 'حدث خطأ غير متوقع أثناء توليد الاستشارة.');
    } finally {
      setIsAiLoading(false);
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  // Filter laws based on search input
  const filteredLaws = jordanianLaws.map(law => {
    if (!lawSearchQuery) return law;
    const matchingSections = law.sections.map(sec => {
      const filteredArticles = sec.articles.filter(art => 
        art.text.includes(lawSearchQuery) || 
        art.number.includes(lawSearchQuery) ||
        (art.notes && art.notes.includes(lawSearchQuery))
      );
      return { ...sec, articles: filteredArticles };
    }).filter(sec => sec.articles.length > 0 || sec.title.includes(lawSearchQuery));

    return { ...law, sections: matchingSections };
  }).filter(law => 
    law.title.includes(lawSearchQuery) || 
    law.description.includes(lawSearchQuery) || 
    law.sections.length > 0
  );

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  if (!isAuthenticated) {
    return <LockScreen onUnlock={handleUnlock} />;
  }

  return (
    <div className="min-h-screen bg-black text-stone-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200" dir="rtl">
      
      {/* Prime Header Bar */}
      <header className="border-b border-stone-900 bg-stone-950/80 backdrop-blur-md sticky top-0 z-40 px-4 md:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <AppLogo size={44} showText={false} className="text-amber-400" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-l from-amber-200 via-amber-400 to-amber-200">عدالتي</h1>
              </div>
              <p className="text-[11px] text-stone-400 hidden sm:block">المظلة الذكية الشاملة للوكالات واللوائح والقوانين الأردنية</p>
            </div>
          </div>
        </div>

        {/* Action controls & navigation triggers */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              setActiveTab('ai');
              setChatMessages([{
                id: 'welcome',
                sender: 'assistant',
                text: 'أهلاً بك زميلي الأستاذ المحامي في منصة عدالتي. كيف يمكنني مساعدتك اليوم في صياغة لائحة قضائية، أو تحليل نص من القانون المدني، أو عقوبات الأردن؟ يرجى كتابة سؤالك وسأنظم لك الإجابة في قالب قانوني رصين.',
                timestamp: new Date().toLocaleTimeString('ar-JO', { hour: '2-digit', minute: '2-digit' })
              }]);
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 text-black hover:bg-amber-400 transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <MessageSquare size={14} />
            استشارة ذكية سريعة
          </button>

          <button 
            onClick={handleLogout}
            className="px-2.5 py-1.5 rounded-lg border border-stone-800 text-stone-400 hover:text-rose-400 hover:bg-rose-500/5 transition-all text-xs flex items-center gap-1 cursor-pointer"
          >
            <Lock size={12} />
            قفل المنصة
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Navigation Sidebar Panel */}
        <aside className="w-full md:w-64 bg-stone-950/50 border-b md:border-b-0 md:border-l border-stone-900 p-4 shrink-0 flex flex-col justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-widest px-3 mb-2">القائمة القانونية</p>
            
            {/* Collapsible Accordion "القائمة" */}
            <div className="border border-stone-900 rounded-xl overflow-hidden bg-stone-900/10 mb-2">
              <button 
                onClick={() => setIsMenuExpanded(!isMenuExpanded)}
                className="w-full flex items-center justify-between px-3 py-3 bg-stone-900/40 text-stone-300 hover:text-amber-400 transition-all text-right cursor-pointer"
                id="menu-accordion-toggle"
              >
                <div className="flex items-center gap-2.5">
                  <List size={18} className="text-amber-400" />
                  <span className="font-bold text-sm tracking-wide">القائمة</span>
                </div>
                {isMenuExpanded ? (
                  <ChevronDown size={16} className="text-stone-400" />
                ) : (
                  <ChevronRight size={16} className="text-stone-400" />
                )}
              </button>

              {isMenuExpanded && (
                <div className="p-1 px-1.5 pb-2 space-y-1 bg-stone-950/20 max-h-[70vh] overflow-y-auto">
                  <button 
                    onClick={() => handleTabChange('home', () => { setSelectedAgency(null); setSelectedSuit(null); })}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-right ${activeTab === 'home' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-stone-400 hover:text-white hover:bg-stone-900/40 border border-transparent'}`}
                  >
                    <Scale size={16} />
                    <span>الرئيسية والمؤشرات</span>
                  </button>

                  <button 
                    onClick={() => handleTabChange('agencies', () => { setSelectedAgency(null); })}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all text-right ${activeTab === 'agencies' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-stone-400 hover:text-white hover:bg-stone-900/40 border border-transparent'}`}
                  >
                    <Briefcase size={16} />
                    <span>الوكالات العدلية</span>
                    <span className="mr-auto text-[10px] bg-stone-850 text-amber-400 px-1.5 py-0.5 rounded-full border border-stone-800 font-bold">{agencyTemplates.length}</span>
                  </button>

                  <button 
                    onClick={() => handleTabChange('suits', () => { setSelectedSuit(null); })}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all text-right ${activeTab === 'suits' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-stone-400 hover:text-white hover:bg-stone-900/40 border border-transparent'}`}
                  >
                    <FileText size={16} />
                    <span>لوائح الدعاوى والشكاوى</span>
                    <span className="mr-auto text-[10px] bg-stone-850 text-amber-400 px-1.5 py-0.5 rounded-full border border-stone-800 font-bold">{lawsuitTemplates.length}</span>
                  </button>

                  <button 
                    onClick={() => handleTabChange('laws', () => { setSelectedLaw(null); })}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all text-right ${activeTab === 'laws' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-stone-400 hover:text-white hover:bg-stone-900/40 border border-transparent'}`}
                  >
                    <BookOpen size={16} />
                    <span>قوانين المملكة الأردنية</span>
                    <span className="mr-auto text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded-full border border-emerald-500/20">محدث</span>
                  </button>

                  <button 
                    onClick={() => handleTabChange('durations')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all text-right ${activeTab === 'durations' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-stone-400 hover:text-white hover:bg-stone-900/40 border border-transparent'}`}
                  >
                    <Clock size={16} />
                    <span>المدد والمهل القانونية</span>
                  </button>

                  <button 
                    onClick={() => handleTabChange('jurisdictions')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all text-right ${activeTab === 'jurisdictions' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-stone-400 hover:text-white hover:bg-stone-900/40 border border-transparent'}`}
                  >
                    <MapPin size={16} />
                    <span>اختصاص المحاكم حسب المناطق</span>
                  </button>

                  <button 
                    onClick={() => handleTabChange('registration')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all text-right ${activeTab === 'registration' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-stone-400 hover:text-white hover:bg-stone-900/40 border border-transparent'}`}
                  >
                    <Route size={16} />
                    <span>إجراءات ومسار تسجيل الدعاوى</span>
                  </button>

                  <button 
                    onClick={() => handleTabChange('calculator')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all text-right ${activeTab === 'calculator' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-stone-400 hover:text-white hover:bg-stone-900/40 border border-transparent'}`}
                  >
                    <Coins size={16} />
                    <span>حاسبة الرسوم والأتعاب القضائية</span>
                  </button>

                  <button 
                    onClick={() => handleTabChange('agreements')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all text-right ${activeTab === 'agreements' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-stone-400 hover:text-white hover:bg-stone-900/40 border border-transparent'}`}
                  >
                    <Edit3 size={16} />
                    <span>اتفاقيات أتعاب المحاماة</span>
                  </button>

                  <button 
                    onClick={() => handleTabChange('contracts')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all text-right ${activeTab === 'contracts' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-stone-400 hover:text-white hover:bg-stone-900/40 border border-transparent'}`}
                  >
                    <Handshake size={16} />
                    <span>صياغة العقود وقوالبها</span>
                  </button>

                  <button 
                    onClick={() => handleTabChange('petitions')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all text-right ${activeTab === 'petitions' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-stone-400 hover:text-white hover:bg-stone-900/40 border border-transparent'}`}
                  >
                    <FileText size={16} />
                    <span>نموذج استدعاء للدوائر الحكومية</span>
                  </button>

                  <button 
                    onClick={() => handleTabChange('audit')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all text-right ${activeTab === 'audit' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-stone-400 hover:text-white hover:bg-stone-900/40 border border-transparent'}`}
                  >
                    <FileCheck size={16} className={activeTab === 'audit' ? 'text-amber-400' : 'text-stone-400'} />
                    <span className="font-bold text-transparent bg-clip-text bg-gradient-to-l from-amber-200 to-amber-500">تدقيق واستشارة القضايا</span>
                  </button>

                  <button 
                    onClick={() => handleTabChange('ai')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all text-right ${activeTab === 'ai' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-stone-400 hover:text-white hover:bg-stone-900/40 border border-transparent'}`}
                  >
                    <MessageSquare size={16} className="text-amber-400 animate-pulse" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-l from-amber-200 to-amber-400 font-semibold font-bold">مستشار الذكاء الاصطناعي</span>
                  </button>

                  <button 
                    onClick={() => handleTabChange('mobile')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all text-right ${activeTab === 'mobile' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-stone-400 hover:text-white hover:bg-stone-900/40 border border-transparent'}`}
                  >
                    <Smartphone size={16} className="text-amber-405 text-amber-400" />
                    <span className="font-semibold text-stone-200 font-bold">تحميل منصة الهاتف للجوال</span>
                    <span className="mr-auto text-[9px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-full font-serif font-bold">جديد</span>
                  </button>

                  <button 
                    onClick={() => handleTabChange('drafts')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all text-right ${activeTab === 'drafts' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-stone-400 hover:text-white hover:bg-stone-900/40 border border-transparent'}`}
                  >
                    <Bookmark size={16} />
                    <span>مسوداتي المحفوظة</span>
                    {drafts.length > 0 && (
                      <span className="mr-auto text-[11px] bg-amber-500 text-black font-bold px-2 py-0.5 rounded-md">
                        {drafts.length}
                      </span>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 border-t border-stone-900 pt-4 space-y-2">
            <div className="bg-stone-900/50 p-3 rounded-lg border border-stone-800">
              <h4 className="text-xs font-bold text-amber-400 mb-1 flex items-center gap-1">
                <Info size={12} /> تلميحة قانونية مفيدة 
              </h4>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                قوانين الملكية العقارية الأردنية الجديدة تحد من مدة الوكالات غير القابلة للعزل لتصبح سنة واحدة فقط من تاريخ إصدارها كحد أقصى.
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-[10px] text-stone-600 font-mono">الإزارة الرقمية للمحاكم - الأردن</p>
            </div>
          </div>
        </aside>

        {/* Primary View Area */}
        <main id="main-content-scroll-target" className="flex-1 bg-black p-4 md:p-8 overflow-y-auto scroll-smooth">
          
          {/* TAB 1: HOME/DASHBOARD */}
          {activeTab === 'home' && (
            <div className="space-y-8">
              
              {/* Grand Banner */}
              <div className="relative bg-gradient-to-tr from-stone-950 via-stone-900 to-stone-950 rounded-2xl p-6 md:p-8 border border-amber-500/20 overflow-hidden shadow-2xl">
                <div className="absolute top-[-30%] left-[-20%] w-[50%] h-[120%] rounded-full bg-amber-500/5 blur-[100px] pointer-events-none" />
                
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="max-w-2xl">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20 select-none mb-3 inline-block">
                      الأردن • المساعد القضائي للمحامين والأساتذة
                    </span>
                    <h2 className="text-3xl font-extrabold text-white tracking-wide mb-2">
                      مرحباً بك زميلي الأستاذ في <span className="text-amber-400">منصة عدالتي</span>
                    </h2>
                    <p className="text-stone-400 text-sm leading-relaxed mb-4">
                      نظام رقمي مبتكر تم صياغته وهندسته خصيصاً لمساعدة المحامي الأردني في صياغة وتوليد الوكالات المدنية وتدقيق لوائح الدعاوى الحقوقية وإخلاء المأجور، مع تزويده بمرجع شامل للقوانين والمدد والمهل القانونية طبقاً لمحكمة التمييز لتشكل سلاحاً قوياً بيدك في قصر العدل.
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="px-2.5 py-1 rounded bg-stone-900 border border-stone-800 text-stone-300">✓ قانون الملكية العقارية الأردني</span>
                      <span className="px-2.5 py-1 rounded bg-stone-900 border border-stone-800 text-stone-300">✓ قانون أصول المحاكمات المدنية 2026</span>
                      <span className="px-2.5 py-1 rounded bg-stone-900 border border-stone-800 text-stone-300">✓ قانون العقوبات المعدل</span>
                    </div>
                  </div>

                  <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 w-full md:w-80 flex flex-col shadow-lg">
                    <div className="flex justify-center mb-4 pb-4 border-b border-stone-800/80">
                      <AppLogo size={100} showText={true} highlightText={true} className="text-amber-400" />
                    </div>
                    <span className="text-stone-400 text-xs mb-1">المحاضر والتوقيت الزمني</span>
                    <span className="text-amber-400 text-lg font-bold font-mono">الأردن (عمان GMT+3)</span>
                    <p className="text-stone-200 text-sm font-semibold mt-1">تاريخ اليوم: {new Date().toLocaleDateString('ar-JO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    
                    <div className="mt-4 pt-4 border-t border-stone-800 flex justify-between text-xs text-stone-400">
                      <div>
                        <span>الوكالات المخزنة:</span>
                        <span className="block text-white font-bold text-base mt-0.5">{agencyTemplates.length}</span>
                      </div>
                      <div>
                        <span>اللوائح المتاحة:</span>
                        <span className="block text-white font-bold text-base mt-0.5">{lawsuitTemplates.length}</span>
                      </div>
                      <div>
                        <span>المسودات النشطة:</span>
                        <span className="block text-amber-400 font-bold text-base mt-0.5">{drafts.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Founder Appreciation & Thank You Banner */}
              <div className="relative bg-gradient-to-tr from-stone-950 via-stone-900/60 to-stone-950 rounded-2xl p-6 md:p-8 border border-amber-500/30 overflow-hidden shadow-2xl">
                <div className="absolute top-[-40%] right-[-10%] w-[40%] h-[150%] rounded-full bg-amber-500/5 blur-[80px] pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 text-center md:text-right">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-amber-600 via-amber-400 to-amber-200 p-[2.5px] shadow-xl shrink-0 flex items-center justify-center">
                    <div className="w-full h-full rounded-full bg-stone-950 flex items-center justify-center text-amber-400">
                      <Award size={34} className="animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                      <span className="text-[10px] uppercase font-bold bg-amber-500/15 text-amber-300 px-3 py-1 rounded-full border border-amber-500/20">
                        مؤسس المنصة الرقمية لأثراء القانون
                      </span>
                      <span className="text-[10px] font-bold bg-stone-900 text-stone-300 px-3 py-1 rounded-full border border-stone-800">
                        لفتة شكر وتقدير ووفاء
                      </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-l from-amber-200 via-amber-400 to-amber-200">
                      شكر وتقدير لمؤسس المنصة: المستشار القانوني محمد موسى ابو حسين
                    </h3>
                    <p className="text-stone-300 text-xs md:text-sm leading-relaxed">
                      يتقدّم مجتمع فرسان الحق والمحامين والأساتذة بالمملكة الأردنية الهاشمية ببالغ الشكر وعظيم الامتنان والتقدير لـ <strong className="text-amber-400 font-bold">المستشار الأستاذ محمد موسى ابو حسين</strong>، المبتكر والمؤسس الأول لمنصة <strong className="text-stone-100">"عدالتي"</strong>. 
                      إن رؤيتكم الواعدة وجهدكم الريادي المميّز في تطويع التكنولوجيا المتطورة لخدمة المحاماة وتيسير صياغة العقود والوكالات القانونية، يشكّل ركيزة هامة في صَوْن الحقوق ودعم فرسان الحق بالمحافظات الأردنية كافة. دام عطاؤكم نِبراساً للعدالة والريادة الرقمية.
                    </p>
                    <div className="pt-1 flex flex-wrap gap-x-6 gap-y-2 text-stone-400 text-xs md:text-sm">
                      <span className="flex items-center gap-1.5 text-amber-400/90 font-medium">
                        ⚖️ مسيرة ريادية حافلة بالعطاء والوفاء
                      </span>
                      <span className="flex items-center gap-1.5 text-stone-300">
                        • عمان، المملكة الأردنية الهاشمية
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Feature 1: Agencies */}
                <div 
                  onClick={() => handleTabChange('agencies')}
                  className="bg-stone-950 p-6 rounded-xl border border-stone-900/90 hover:border-amber-500/20 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-105 transition-transform">
                      <Briefcase size={22} />
                    </div>
                    <h3 className="text-lg font-bold text-stone-100 group-hover:text-amber-400 transition-colors mb-2">تجهيز وكالات الكاتب العدل</h3>
                    <p className="text-stone-400 text-xs leading-relaxed">
                      صياغة كاملة للوكالات القضائية الخاصة بالمحامين، الوكالة العامة المطلقة، وكالات بيع الأراضي بمديريات التسجيل، والوكالات الشرعية بالأردن.
                    </p>
                  </div>
                  <span className="text-amber-500 text-xs font-semibold flex items-center gap-1 mt-4">
                    ابدأ الصياغة والتعبئة 
                    <ChevronRight size={14} className="group-hover:translate-x-[-4px] transition-transform" />
                  </span>
                </div>

                {/* Feature 2: Lawsuit generator */}
                <div 
                  onClick={() => handleTabChange('suits')}
                  className="bg-stone-950 p-6 rounded-xl border border-stone-900/90 hover:border-amber-500/20 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-105 transition-transform">
                      <FileText size={22} />
                    </div>
                    <h3 className="text-lg font-bold text-stone-100 group-hover:text-amber-400 transition-colors mb-2">صياغة اللوائح والشكاوى</h3>
                    <p className="text-stone-400 text-xs leading-relaxed">
                      هيكلة لافتة ونظامية للائحة دعوى المطالبة المالية وإخلاء المأجور لتخلف المستأجر عن السداد وغيرها لسهولة تكييفها وطباعتها بقصر العدل.
                    </p>
                  </div>
                  <span className="text-amber-500 text-xs font-semibold flex items-center gap-1 mt-4">
                    اكتب لائحتك الآن
                    <ChevronRight size={14} className="group-hover:translate-x-[-4px] transition-transform" />
                  </span>
                </div>

                {/* Feature 3: AI Legal Hub */}
                <div 
                  onClick={() => handleTabChange('ai')}
                  className="bg-stone-950 p-6 rounded-xl border border-stone-900/90 hover:border-amber-500/30 transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 bg-amber-500/15 text-amber-300 text-[9px] px-2 py-0.5 font-bold rounded-bl border-b border-l border-amber-500/10 font-sans">مستشار رقمي</div>
                  <div>
                    <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 mb-4 group-hover:scale-105 transition-transform animate-pulse">
                      <MessageSquare size={22} />
                    </div>
                    <h3 className="text-lg font-bold text-stone-100 group-hover:text-amber-400 transition-colors mb-2">المستشار القانوني الأردني AI</h3>
                    <p className="text-stone-400 text-xs leading-relaxed">
                      مساعد تفاعلي متزامن مع الذكاء الاصطناعي مستند لدستور وقانون الأردن وعقود المالكين والمستأجرين وأحكام محكمة التمييز لمساعدتك بالبحث.
                    </p>
                  </div>
                  <span className="text-amber-500 text-xs font-semibold flex items-center gap-1 mt-4">
                    اسأل المساعد الذكي
                    <ChevronRight size={14} className="group-hover:translate-x-[-4px] transition-transform" />
                  </span>
                </div>

                {/* Feature 4: Jurisdictions */}
                <div 
                  onClick={() => handleTabChange('jurisdictions')}
                  className="bg-stone-950 p-6 rounded-xl border border-stone-900/90 hover:border-amber-500/20 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-105 transition-transform">
                      <MapPin size={22} />
                    </div>
                    <h3 className="text-lg font-bold text-stone-100 group-hover:text-amber-400 transition-colors mb-2">اختصاص المحاكم وقصر العدل</h3>
                    <p className="text-stone-400 text-xs leading-relaxed">
                      دليل جغرافي وهيكلي تفصيلي لتوزيع المحاكم والقرى التابعة لها لمنع قيد الدعاوى والمطالبات أمام محكمة غير مختصة محلياً.
                    </p>
                  </div>
                  <span className="text-amber-500 text-xs font-semibold flex items-center gap-1 mt-4">
                    تصفح اختصاص المناطق والبلدات
                    <ChevronRight size={14} className="group-hover:translate-x-[-4px] transition-transform" />
                  </span>
                </div>

                {/* Feature 5: Registration Pathways */}
                <div 
                  onClick={() => handleTabChange('registration')}
                  className="bg-stone-950 p-6 rounded-xl border border-stone-900/90 hover:border-amber-500/20 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400 mb-4 group-hover:scale-105 transition-transform">
                      <Route size={22} />
                    </div>
                    <h3 className="text-lg font-bold text-stone-100 group-hover:text-amber-400 transition-colors mb-2">مسار قيد وتسجيل القضايا</h3>
                    <p className="text-stone-400 text-xs leading-relaxed">
                      دليل متدرج للمحامين والخلّاء يوضح أين وكيف ترفع دعواك الحقوقية أو شكواك الجزائية من الألف إلى الياء، شامل الأثمان والمستندات.
                    </p>
                  </div>
                  <span className="text-rose-400 text-xs font-semibold flex items-center gap-1 mt-4">
                    تصفح مسار تسجيل القضايا 
                    <ChevronRight size={14} className="group-hover:translate-x-[-4px] transition-transform" />
                  </span>
                </div>

                {/* Feature 6: Fees & Attorney Calculator */}
                <div 
                  onClick={() => handleTabChange('calculator')}
                  className="bg-stone-950 p-6 rounded-xl border border-stone-900/90 hover:border-amber-500/20 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 mb-4 group-hover:scale-105 transition-transform">
                      <Coins size={22} />
                    </div>
                    <h3 className="text-lg font-bold text-stone-100 group-hover:text-amber-400 transition-colors mb-2">حاسبة الرسوم والأتعاب القضائية</h3>
                    <p className="text-stone-400 text-xs leading-relaxed">
                      تقدير فوري دقيق لرسوم المحاكم الأردنية، دمغات نقابة المحامين، مذكرات التبليغ الرسمية، وأتعاب التقاضي المتعارف عليها بالسوق المحلي.
                    </p>
                  </div>
                  <span className="text-amber-500 text-xs font-semibold flex items-center gap-1 mt-4">
                    احسب وقدّر الرسوم والأتعاب القضائية
                    <ChevronRight size={14} className="group-hover:translate-x-[-4px] transition-transform" />
                  </span>
                </div>

              </div>

              {/* Quick Legal Deadlines Section */}
              <div className="bg-stone-950/40 p-6 rounded-2xl border border-stone-900">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Clock className="text-amber-500" size={18} />
                    مواعيد هامة تهم المحامي (أبرز المدد)
                  </h3>
                  <button onClick={() => handleTabChange('durations')} className="text-xs text-amber-400 hover:underline">عرض كافة المدد والمهل ⟵</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {jordanianDeadlines.slice(0, 3).map((dl) => (
                    <div key={dl.id} className="bg-stone-900/60 p-4 rounded-xl border border-stone-800">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs text-amber-400 font-bold font-mono">{dl.duration}</span>
                        <span className="text-[10px] bg-stone-850 text-stone-400 px-1.5 py-0.5 rounded">{dl.basis}</span>
                      </div>
                      <h4 className="text-stone-200 text-sm font-bold truncate mb-1">{dl.title}</h4>
                      <p className="text-stone-400 text-xs line-clamp-2">{dl.notes}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Promo Banner: Install Mobile App */}
              <div className="bg-gradient-to-l from-amber-500/10 via-stone-900/40 to-stone-950 p-5 rounded-2xl border border-amber-500/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-stone-100 flex items-center gap-1.5">
                    <Smartphone size={16} className="text-amber-400" />
                    هل ترغب في صياغة وكالاتك وتدقيق لوائحك من هاتفك المحمول مباشرة؟
                  </h4>
                  <p className="text-xs text-stone-400">
                    ثبّت منصة "عدالتي الأردني" على شاشة هاتفك (آيفون وأندرويد) بضغطة زر واحدة لتجربة سريعة كاملة الشاشة بدون تعقيدات وعزز أعمال موكليك أينما كنت.
                  </p>
                </div>
                <button 
                  onClick={() => handleTabChange('mobile')}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Download size={14} />
                  احصل على المنصة لهاتفك
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: POWER OF ATTORNEY FORMULATION (الوكالات) */}
          {activeTab === 'agencies' && (
            <div className="space-y-6">
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Briefcase className="text-amber-400" />
                    منشئ الوكالات العدلية الأردنية
                  </h2>
                  <p className="text-stone-400 text-xs">اختر نموذج الوكالة لتوليد النص القانوني والشرعي المعتمد بالكامل بعد ملء معلومات الموكل والقضايا.</p>
                </div>
                {selectedAgency && (
                  <button 
                    onClick={() => { setSelectedAgency(null); setGeneratedAgencyText(''); }}
                    className="flex items-center gap-1 text-xs text-amber-400 hover:underline border border-amber-500/10 px-3 py-1 rounded bg-stone-900"
                  >
                    ⟵ عودة لقائمة النماذج
                  </button>
                )}
              </div>

              {!selectedAgency ? (
                /* Agency Card List */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {agencyTemplates.map((tpl) => (
                    <div 
                      key={tpl.id}
                      className="bg-stone-950 p-6 rounded-xl border border-stone-900 hover:border-amber-500/20 hover:bg-stone-900/20 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded border ${
                            tpl.category === 'special' ? 'bg-amber-500/10 text-amber-300 border-amber-500/25' :
                            tpl.category === 'general' ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/25' :
                            tpl.category === 'lands' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25' :
                            'bg-violet-500/10 text-violet-300 border-violet-500/25'
                          }`}>
                            {tpl.category === 'special' && 'وكالة خاصة'}
                            {tpl.category === 'general' && 'وكالة عامة'}
                            {tpl.category === 'lands' && 'وكالة عقارية'}
                            {tpl.category === 'sharia' && 'وكالة شرعية أحوال'}
                          </span>
                          <span className="text-stone-500 text-xs">المنتسبي النقابة</span>
                        </div>
                        <h4 className="text-lg font-bold text-stone-200 mb-2">{tpl.title}</h4>
                        <p className="text-stone-400 text-xs leading-relaxed mb-4">{tpl.description}</p>
                      </div>

                      <button 
                        onClick={() => {
                          setSelectedAgency(tpl);
                          const initialData: Record<string, string> = {};
                          tpl.fields.forEach(f => initialData[f.id] = '');
                          setAgencyData(initialData);
                          setGeneratedAgencyText('');
                        }}
                        className="w-full py-2 bg-stone-900 hover:bg-amber-500/20 hover:text-amber-400 text-white rounded-lg border border-stone-800 text-xs font-semibold tracking-wide transition-all cursor-pointer"
                      >
                        اختيار النموذج وتعبئة البيانات 📝
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                /* Agency Formulation Screen */
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Fields form column */}
                  <div className="bg-stone-950 p-6 rounded-2xl border border-stone-900 space-y-4">
                    <h3 className="text-lg font-bold text-amber-400 border-b border-stone-800 pb-2">تعبئة بيانات الوكالة</h3>
                    <p className="text-xs text-stone-400 leading-relaxed font-semibold">تأكد من مطابقة الأسماء والأرقام الوطنية للبطاقة الذكية أو السند الرسمي لمنع الطعن ببطلان الوكالة.</p>
                    
                    <div className="space-y-4 pt-2">
                      {selectedAgency.fields.map((field) => (
                        <div key={field.id} className="space-y-1">
                          <label className="text-xs font-semibold text-stone-300 block">
                            {field.label} {field.required && <span className="text-rose-500">*</span>}
                          </label>
                          <input 
                            type={field.type} 
                            value={agencyData[field.id] || ''}
                            onChange={(e) => {
                              const update = { ...agencyData, [field.id]: e.target.value };
                              setAgencyData(update);
                              setGeneratedAgencyText(selectedAgency.generateText(update));
                            }}
                            placeholder={field.placeholder}
                            className="w-full bg-stone-900 border border-stone-800 focus:border-amber-500/55 rounded-lg px-3 py-2 text-sm text-stone-200 placeholder:text-stone-600 focus:outline-none transition-colors"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-stone-900 flex gap-2">
                      <button 
                        onClick={() => {
                          setGeneratedAgencyText(selectedAgency.generateText(agencyData));
                        }}
                        className="flex-1 py-2.5 bg-amber-500 text-black hover:bg-amber-400 font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <RotateCcw size={14} />
                      توليد الوكالة بالكامل
                      </button>
                      <button 
                        onClick={() => {
                          const reset: Record<string, string> = {};
                          selectedAgency.fields.forEach(f => reset[f.id] = '');
                          setAgencyData(reset);
                          setGeneratedAgencyText('');
                        }}
                        className="px-3 py-2.5 border border-stone-800 text-stone-400 hover:text-white rounded-lg text-xs transition-colors"
                      >
                        مسح
                      </button>
                    </div>
                  </div>

                  {/* Code/Draft output column */}
                  <div className="bg-stone-950 p-6 rounded-2xl border border-stone-900 flex flex-col justify-between h-full min-h-[500px]">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                        <span className="text-xs font-semibold text-amber-400 flex items-center gap-1">
                          <Scale size={14} /> النص القانوني المتولد
                        </span>
                        
                        {generatedAgencyText && (
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleCopyText(generatedAgencyText, 'agency-text')}
                              className="p-1.5 rounded bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-400 hover:text-white transition-all"
                              title="نسخ النص"
                            >
                              {copiedId === 'agency-text' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                            </button>
                            <button 
                              onClick={() => window.print()}
                              className="p-1.5 rounded bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-400 hover:text-white transition-all"
                              title="طباعة"
                            >
                              <Printer size={14} />
                            </button>
                          </div>
                        )}
                      </div>

                      {generatedAgencyText ? (
                        <textarea 
                          value={generatedAgencyText}
                          onChange={(e) => setGeneratedAgencyText(e.target.value)}
                          className="w-full h-96 bg-stone-900/65 font-mono text-xs border border-stone-800/80 rounded-xl p-4 text-stone-300 leading-relaxed focus:outline-none focus:border-amber-500/20 text-right resize-y"
                        />
                      ) : (
                        <div className="h-96 border border-stone-800/30 rounded-xl flex flex-col items-center justify-center p-8 text-center text-stone-600 bg-stone-950/20">
                          <Scale size={48} strokeWidth={1} className="text-stone-700 mb-3" />
                          <p className="text-stone-400 text-xs font-bold font-sans">بانتظار تعبئة بيانات الموكل</p>
                          <p className="text-stone-500 text-[11px] mt-1">عند تعبئة الخانات الجانبية سيظهر نموذج الوكالة القانوني هنا الصالح ومصاغ بالبنود الأردنية للمصادقة.</p>
                        </div>
                      )}
                    </div>

                    {generatedAgencyText && (
                      <div className="mt-4 pt-4 border-t border-stone-800 flex justify-end gap-3">
                        <button 
                          onClick={handleSaveAgency}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors shadow-md cursor-pointer"
                        >
                          <Bookmark size={12} />
                          حفظ في مسوداتي
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 3: LAWSUIT/COMPLAINT FORMULATION (اللوائح) */}
          {activeTab === 'suits' && (
            <div className="space-y-6">
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <FileText className="text-emerald-400" />
                    هيكلة وصياغة لوائح الدعاوى
                  </h2>
                  <p className="text-stone-400 text-xs">صياغة وتوليد لوائح دعاوى قيد الصلح والبداية بالمحاكم الأردنية بالوقائع المادية الكاملة.</p>
                </div>
                {selectedSuit && (
                  <button 
                    onClick={() => { setSelectedSuit(null); setGeneratedSuitText(''); }}
                    className="flex items-center gap-1 text-xs text-amber-400 hover:underline border border-amber-500/10 px-3 py-1 rounded bg-stone-900"
                  >
                    ⟵ عودة لقائمة اللوائح
                  </button>
                )}
              </div>

              {!selectedSuit ? (
                /* Suits Card Display */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {lawsuitTemplates.map((su) => (
                    <div 
                      key={su.id}
                      className="bg-stone-950 p-6 rounded-xl border border-stone-900 hover:border-emerald-500/20 hover:bg-stone-900/10 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded">
                            {su.courtType}
                          </span>
                          <span className="text-stone-500 text-xs font-mono">قانون المالكين والمستأجرين</span>
                        </div>
                        <h4 className="text-lg font-bold text-stone-200 mb-2">{su.title}</h4>
                        
                        <div className="space-y-1.5 my-3.5 text-xs text-stone-400 border-t border-b border-stone-900 py-3">
                          <div><span className="text-stone-500">الخصوم:</span> {su.plaintiffType} ⇌ {su.defendantType}</div>
                          <div><span className="text-stone-500">الموضوع:</span> {su.subject}</div>
                        </div>
                      </div>

                      <button 
                        onClick={() => {
                          setSelectedSuit(su);
                          const initial: Record<string, string> = {};
                          su.fields.forEach(f => initial[f.id] = '');
                          setSuitData(initial);
                          setGeneratedSuitText('');
                        }}
                        className="w-full py-2 bg-stone-900 hover:bg-emerald-500/10 hover:text-emerald-400 text-white rounded-lg border border-stone-800 text-xs font-bold transition-all cursor-pointer"
                      >
                        تجهيز لائحة المحاكمة ✍︎
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                /* Suiting interface */
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  
                  {/* Fields mapping for Suit */}
                  <div className="bg-stone-950 p-6 rounded-2xl border border-stone-900 space-y-4">
                    <h3 className="text-lg font-bold text-emerald-400 border-b border-stone-800 pb-2">بيانات لائحة الدعوى</h3>
                    
                    <div className="p-3.5 bg-stone-900/60 rounded-xl border border-stone-800 space-y-2">
                      <span className="text-xs font-bold text-amber-500 block">أسس الاستنباط ببلادنا:</span>
                      <ul className="list-disc list-inside text-[11px] text-stone-400 space-y-1">
                        <li>يقيد الخصوم بعناوينهم الدقيقة للتبلغ.</li>
                        <li>يطالب بفائدة المحكمة السنوية البالغة 9% من تاريخ الادعاء.</li>
                        <li>يكلف كاتب عدل المحكمة بإرسال المطالبات.</li>
                      </ul>
                    </div>

                    <div className="space-y-4 pt-2">
                      {selectedSuit.fields.map((f) => (
                        <div key={f.id} className="space-y-1">
                          <label className="text-xs font-semibold text-stone-300 block">{f.label} *</label>
                          <input 
                            type="text"
                            value={suitData[f.id] || ''}
                            onChange={(e) => {
                              const update = { ...suitData, [f.id]: e.target.value };
                              setSuitData(update);
                              setGeneratedSuitText(selectedSuit.generateDraft(update));
                            }}
                            placeholder={f.placeholder}
                            className="w-full bg-stone-900 border border-stone-800 focus:border-emerald-500/50 rounded-lg px-3 py-2 text-sm text-stone-200 placeholder:text-stone-600 focus:outline-none transition-all"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-stone-900">
                      <button 
                        onClick={() => setGeneratedSuitText(selectedSuit.generateDraft(suitData))}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        ✔ توليد نص اللائحة المكتمل
                      </button>
                    </div>
                  </div>

                  {/* Live Render Column for Suit */}
                  <div className="bg-stone-950 p-6 rounded-2xl border border-stone-900 flex flex-col justify-between h-full min-h-[500px]">
                    <div className="space-y-4">
                      
                      <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                        <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                          ⚖ لائحة الدعوى الجاهزة للمثول والطباعة
                        </span>

                        {generatedSuitText && (
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleCopyText(generatedSuitText, 'suit-text')}
                              className="p-1.5 rounded bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-400 hover:text-white transition-all"
                            >
                              {copiedId === 'suit-text' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                            </button>
                            <button 
                              onClick={() => window.print()}
                              className="p-1.5 rounded bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-400 hover:text-white transition-all"
                            >
                              <Printer size={14} />
                            </button>
                          </div>
                        )}
                      </div>

                      {generatedSuitText ? (
                        <textarea 
                          value={generatedSuitText}
                          onChange={(e) => setGeneratedSuitText(e.target.value)}
                          className="w-full h-96 bg-stone-900/65 font-mono text-xs border border-stone-800/80 rounded-xl p-4 text-stone-300 leading-relaxed focus:outline-none focus:border-emerald-500/20 text-right resize-y"
                        />
                      ) : (
                        <div className="h-96 border border-stone-800/20 rounded-xl flex flex-col items-center justify-center p-8 text-center text-stone-600 bg-stone-950/20">
                          <FileText size={48} strokeWidth={1} className="text-stone-700 mb-2" />
                          <p className="text-stone-400 text-xs font-bold">بانتظار المدخلات لتكوين وقائع الدعوى</p>
                          <p className="text-stone-500 text-[11px] mt-1">اكتب أسماء الخصوم وقيمة السند وسيتحول المتن إلى صياغة رسمية لدى المحكمة الأردنية الموقرة.</p>
                        </div>
                      )}
                    </div>

                    {generatedSuitText && (
                      <div className="mt-4 pt-4 border-t border-stone-800 flex justify-end">
                        <button 
                          onClick={handleSaveSuit}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-all shadow-md cursor-pointer"
                        >
                          <Bookmark size={12} />
                          حفظ هذه الشكوى بمسوداتي
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              )}

            </div>
          )}

          {/* TAB 4: LAW REFERENCE (القوانين) */}
          {activeTab === 'laws' && (
            <div className="space-y-6">
              
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <BookOpen className="text-amber-400" />
                  المكتبة والوكالات واللوائح ومراجع القانون الأردني
                </h2>
                <p className="text-stone-400 text-xs">تصفح النصوص النظامية المباشرة والمواد القانونية المعدلة لقانون نقابة المحامين وأصول المحاكمات بالأردن.</p>
              </div>

              {/* Advanced Search inside reference */}
              <div className="relative">
                <Search className="absolute right-3.5 top-3 text-stone-500" size={18} />
                <input 
                  type="text"
                  value={lawSearchQuery}
                  onChange={(e) => setLawSearchQuery(e.target.value)}
                  placeholder="ابحث بكلمات مفتاحية في نصوص ومواد القوانين الأردنية... (مثال: 'مكتب'، 'نقابة'، 'تمييز'، 'أحكام')"
                  className="w-full bg-stone-950 border border-stone-900 rounded-xl pr-11 pl-4 py-3 text-sm text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-amber-500/40 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left side checklist of laws */}
                <div className="lg:col-span-1 space-y-4">
                  <span className="text-xs font-bold text-stone-500 block uppercase tracking-wide">الكتب القانونية المفتوحة</span>

                  <div className="space-y-2">
                    {filteredLaws.map((law) => (
                      <div 
                        key={law.id}
                        onClick={() => setSelectedLaw(law)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer ${
                          selectedLaw?.id === law.id 
                            ? 'bg-gradient-to-l from-amber-500/10 to-stone-950 text-amber-300 border-amber-500/30 shadow-md' 
                            : 'bg-stone-950 text-stone-400 border-stone-900 hover:border-stone-800 hover:text-stone-200'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1.5">
                          <span className="text-[10px] bg-stone-900 text-amber-500 px-2 py-0.5 rounded font-bold">{law.year} م</span>
                          <span className="text-[10px] text-stone-500 font-mono">قانون أردني</span>
                        </div>
                        <h4 className="text-sm font-bold text-stone-100">{law.title}</h4>
                        <p className="text-stone-500 text-[11px] mt-1 line-clamp-2 leading-relaxed">{law.description}</p>
                      </div>
                    ))}

                    {filteredLaws.length === 0 && (
                      <div className="text-center py-8 text-stone-500 text-xs">
                        لم يتم العثور على أي نصوص قانونية مطابقة للبحث.
                      </div>
                    )}
                  </div>
                </div>

                {/* Right side details layout */}
                <div className="lg:col-span-2">
                  {selectedLaw ? (
                    <div className="bg-stone-950 p-6 rounded-2xl border border-stone-900 space-y-6">
                      <div className="border-b border-stone-800 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                          <span className="text-xs text-amber-500 font-bold">المحكمة الاتحادية والتشريعات الأردنية</span>
                          <h3 className="text-xl font-extrabold text-white">{selectedLaw.title}</h3>
                        </div>
                        <span className="text-xs bg-amber-500/10 text-amber-300 border border-amber-500/20 px-3 py-1 rounded-full">
                          إصدار عام {selectedLaw.year}
                        </span>
                      </div>

                      <div className="space-y-6">
                        {selectedLaw.sections.map((section) => (
                          <div key={section.id} className="space-y-3">
                            <h4 className="text-sm font-bold text-amber-400 bg-stone-900/60 px-3 py-1.5 rounded-lg border-r-2 border-amber-500">
                              {section.title}
                            </h4>
                            {section.subtitle && <p className="text-xs text-stone-400 px-3">{section.subtitle}</p>}

                            <div className="space-y-3 px-3">
                              {section.articles.map((art, idx) => (
                                <div key={idx} className="bg-stone-900/40 p-4 rounded-xl border border-stone-900 space-y-2">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-extrabold text-stone-200">{art.number}</span>
                                    <button 
                                      onClick={() => handleCopyText(`${art.number}: ${art.text}`, `${section.id}-${idx}`)}
                                      className="text-stone-500 hover:text-amber-400 p-1 rounded hover:bg-stone-900 text-[11px] flex items-center gap-1 transition-all"
                                    >
                                      {copiedId === `${section.id}-${idx}` ? 'تم النسخ!' : 'نسخ المادة 📄'}
                                    </button>
                                  </div>
                                  <p className="text-stone-300 text-xs leading-relaxed text-right">{art.text}</p>
                                  {art.notes && (
                                    <div className="mt-2 text-[11px] text-amber-500/80 bg-amber-500/5 px-2.5 py-1.5 rounded border border-amber-500/10 leading-relaxed">
                                      {art.notes}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  ) : (
                    <div className="bg-stone-950 border border-stone-900/40 rounded-2xl p-12 text-center text-stone-500 flex flex-col items-center justify-center min-h-[400px]">
                      <BookOpen size={64} strokeWidth={1} className="text-stone-700 mb-3" />
                      <h4 className="text-stone-300 font-bold text-sm">بانتظار تحديد الكتاب القانوني</h4>
                      <p className="text-stone-500 text-xs max-w-sm mt-1.5">
                        الرجاء تحديد أحد القوانين الأردنية المعروضة في القائمة الجانبية لتصفح البنود واللوائح وتفصيل المواد وتعديلاتها.
                      </p>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* TAB 5: LEGAL DEADLINES GUIDE (المدد) */}
          {activeTab === 'durations' && (
            <div className="space-y-6">
              
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Clock className="text-amber-400" />
                  حاسبة ودليل المدد والمهل القانونية بالأردن
                </h2>
                <p className="text-stone-400 text-xs">احذر سقوط الحق بمضي المدة! تقويم موقد بالمواد القضائية لآجال الطعن بالاستئناف والتمييز والاعتراض الجزائي والإنذارات.</p>
              </div>

              {/* Deadlines Timeline / Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {jordanianDeadlines.map((dl) => (
                  <div key={dl.id} className="bg-stone-950 p-6 rounded-xl border border-stone-900 flex flex-col justify-between hover:border-amber-500/20 transition-all">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center bg-stone-900/70 p-2.5 rounded-lg border border-stone-800">
                        <span className="text-xs text-stone-400">سند القانون:</span>
                        <span className="text-xs text-emerald-400 font-semibold">{dl.basis}</span>
                      </div>
                      
                      <div className="flex justify-between items-start gap-4">
                        <h4 className="text-base font-bold text-stone-200 leading-snug">{dl.title}</h4>
                        <div className="bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded px-3 py-1.5 text-center shrink-0">
                          <span className="block text-[10px] text-stone-500 uppercase tracking-widest leading-none">المهلة</span>
                          <span className="text-base font-extrabold font-sans leading-none block mt-1">{dl.duration}</span>
                        </div>
                      </div>

                      <p className="text-stone-400 text-xs leading-relaxed">{dl.notes}</p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-stone-900 flex justify-between items-center text-[11px] text-stone-500">
                      <span>✓ متوافق مع نظام أصول المحاكمات المدنية</span>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(`المهلة القانونية لـ ${dl.title}: ${dl.duration} حسب ${dl.basis}`);
                          alert('تم نسخ تفاصيل المدة القانونية!');
                        }}
                        className="text-amber-400 hover:underline"
                      >
                        نسخ التفاصيل 📋
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Info Disclaimer Alert */}
              <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="text-amber-400 shrink-0 mt-0.5" size={16} />
                <div className="space-y-1">
                  <span className="text-xs font-bold text-amber-400">تنويه إداري بالغ الأهمية:</span>
                  <p className="text-[11px] text-stone-400 leading-relaxed">
                    تبدأ مدد الطعون والمهل القانونية عملاً بقرار التمييز الأردني من اليوم التالي لتاريخ تبلغ الخصم أو تبلغ ممثله القانوني رسمياً، ولا يحسب يوم التبليغ من ضمن المدة المقررة للطعن. في حال صادف اليوم الأخير للمهلة عطلة رسمية (كأيام الجمعة والسبت)، تمتد المهلة تلقائياً لأول يوم دوام رسمي بعد العطلة.
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* TAB: COURT JURISDICTIONS (اختصاص المحاكم) */}
          {activeTab === 'jurisdictions' && (
            <div className="space-y-6 animate-fade-in">
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <MapPin className="text-amber-400" />
                    دليل اختصاص المحاكم وتوزيعها الجغرافي بالأردن
                  </h2>
                  <p className="text-stone-400 text-xs mt-1">
                    دليل ذكي ومفصل لتمكين الأساتذة المحامين من معرفة المحكمة المختصة محلياً وقيمياً حسب المناطق والأحياء والقرى في سائر محافظات المملكة لضمان سلامة قيد الدعاوى.
                  </p>
                </div>
              </div>

              {/* Sub-tab selection: Courts Directory vs Judges Directory */}
              <div className="flex border-b border-stone-800/80 gap-6">
                <button
                  onClick={() => setJurisdictionTabMode('courts')}
                  className={`pb-3 text-xs md:text-sm font-bold flex items-center gap-2.5 border-b-2 transition-all cursor-pointer ${
                    jurisdictionTabMode === 'courts'
                      ? 'border-amber-400 text-amber-400'
                      : 'border-transparent text-stone-500 hover:text-stone-300'
                  }`}
                >
                  <Landmark size={15} />
                  <span>دليل المحاكم الجغرافي والأحياء المشمولة</span>
                </button>
                <button
                  onClick={() => setJurisdictionTabMode('judges')}
                  className={`pb-3 text-xs md:text-sm font-bold flex items-center gap-2.5 border-b-2 transition-all cursor-pointer ${
                    jurisdictionTabMode === 'judges'
                      ? 'border-amber-400 text-amber-400'
                      : 'border-transparent text-stone-500 hover:text-stone-300'
                  }`}
                >
                  <Scale size={15} />
                  <span>سجلّ السادة القضاة والغرف القضائية</span>
                </button>
              </div>

              {/* Filters Panel */}
              <div className="bg-stone-950 p-6 rounded-2xl border border-stone-900/80 space-y-4">
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                  {/* Search Bar */}
                  <div className="relative w-full lg:max-w-md">
                    <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-500" size={16} />
                    <input 
                      type="text"
                      placeholder={
                        jurisdictionTabMode === 'courts'
                          ? "ابحث باسم المحكمة، أو بلدة، أو حي (مثال: صويلح، وادي السير، الكرك)..."
                          : "البحث باسم القاضي، دور القضاء، اختصاصه، أو اسم المحكمة (مثال: الرفاعي، صلح جزاء, تثبيت ملكية)..."
                      }
                      value={jurisdictionSearchQuery}
                      onChange={(e) => setJurisdictionSearchQuery(e.target.value)}
                      className="w-full bg-stone-900/80 border border-stone-800 text-stone-200 placeholder-stone-500 text-xs rounded-xl py-3 pr-10 pl-4 focus:outline-none focus:border-amber-500/30 transition-all text-right"
                    />
                    {jurisdictionSearchQuery && (
                      <button 
                        onClick={() => setJurisdictionSearchQuery('')}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-stone-500 hover:text-stone-300"
                      >
                        مسح
                      </button>
                    )}
                  </div>

                  {/* Region Selectors */}
                  <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                    <button 
                      onClick={() => setSelectedRegion('all')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${selectedRegion === 'all' ? 'bg-amber-500 text-black' : 'bg-stone-900 text-stone-400 hover:text-stone-200'}`}
                    >
                      كافة الأقاليم
                    </button>
                    <button 
                      onClick={() => setSelectedRegion('central')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${selectedRegion === 'central' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' : 'bg-stone-900 text-stone-400 hover:text-stone-200'}`}
                    >
                      إقليم الوسط
                    </button>
                    <button 
                      onClick={() => setSelectedRegion('northern')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${selectedRegion === 'northern' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' : 'bg-stone-900 text-stone-400 hover:text-stone-200'}`}
                    >
                      إقليم الشمال
                    </button>
                    <button 
                      onClick={() => setSelectedRegion('southern')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${selectedRegion === 'southern' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' : 'bg-stone-900 text-stone-400 hover:text-stone-200'}`}
                    >
                      إقليم الجنوب
                    </button>
                  </div>

                  {/* Governorate Select */}
                  <div className="w-full lg:w-64 flex items-center gap-2">
                    <span className="text-xs text-stone-400 shrink-0">المحافظة:</span>
                    <select
                      value={selectedGovernorate}
                      onChange={(e) => setSelectedGovernorate(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 text-stone-200 text-xs rounded-xl py-2 px-3 focus:outline-none focus:border-amber-500/30 transition-all text-right cursor-pointer"
                    >
                      <option value="all">كافة المحافظات أجمع</option>
                      {Array.from(new Set(courtJurisdictions.map(c => c.governorate))).map(gov => (
                        <option key={gov} value={gov}>{gov}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Grid content */}
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                
                {/* Courts list - 3 columns on wide screens */}
                <div className="xl:col-span-3 space-y-4">
                  
                  {jurisdictionTabMode === 'judges' ? (
                    // -------------------------------------------------------------
                    // JUDGES & SPECIALIZATIONS DIRECTORY
                    // -------------------------------------------------------------
                    (() => {
                      const allJudges: any[] = [];
                      courtJurisdictions.forEach(court => {
                        (court.divisions || []).forEach(div => {
                          (div.judges || []).forEach(judge => {
                            allJudges.push({
                              ...judge,
                              courtId: court.id,
                              courtName: court.courtName,
                              governorate: court.governorate,
                              region: court.region,
                              divisionName: div.name,
                              divisionSpecialization: div.specialization
                            });
                          });
                        });
                      });

                      const filteredJudges = allJudges.filter(judge => {
                        if (selectedRegion !== 'all' && judge.region !== selectedRegion) return false;
                        if (selectedGovernorate !== 'all' && judge.governorate !== selectedGovernorate) return false;
                        if (jurisdictionSearchQuery) {
                          const q = jurisdictionSearchQuery.toLowerCase();
                          const matchName = judge.name.toLowerCase().includes(q);
                          const matchRole = judge.role.toLowerCase().includes(q);
                          const matchSpec = judge.specialization.toLowerCase().includes(q);
                          const matchCourt = judge.courtName.toLowerCase().includes(q);
                          const matchDiv = judge.divisionName.toLowerCase().includes(q);
                          return matchName || matchRole || matchSpec || matchCourt || matchDiv;
                        }
                        return true;
                      });

                      if (filteredJudges.length === 0) {
                        return (
                          <div className="bg-stone-950 border border-stone-900/50 rounded-2xl p-12 text-center text-stone-600 flex flex-col items-center justify-center min-h-[300px]">
                            <Scale size={48} className="text-stone-800 mb-2 animate-pulse" />
                            <h4 className="text-stone-400 font-bold font-sans">لا يوجد قضاة مطابقين لبحثك</h4>
                            <p className="text-stone-500 text-xs max-w-sm mt-1 mb-4 leading-relaxed">
                              يرجى مراجعة مسمى البحث، اسم القاضي، رتبته، أو الاختصاص أو تغيير الإقليم والمحافظة لتحديث قائمة البحث.
                            </p>
                          </div>
                        );
                      }

                      return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {filteredJudges.map((judge, idx) => (
                            <div 
                              key={`${judge.courtId}-${judge.name}-${idx}`}
                              className="bg-stone-950 p-5 rounded-xl border border-stone-900/90 hover:border-amber-500/20 transition-all flex flex-col justify-between"
                            >
                              <div className="space-y-4">
                                <div className="flex justify-between items-start gap-2">
                                  <span className="text-[10px] font-bold bg-amber-500/10 text-amber-300 px-2.5 py-0.5 rounded border border-amber-500/20">
                                    ⚖️ {judge.role}
                                  </span>
                                  <span className="text-[10px] text-stone-500 font-semibold">{judge.governorate}</span>
                                </div>

                                <h3 className="text-base font-bold text-stone-100 flex items-center gap-1.5">
                                  <span>⚖️</span>
                                  <span className="text-stone-200">القاضي {judge.name}</span>
                                </h3>

                                <div className="space-y-2.5 text-xs text-stone-400">
                                  <div className="bg-stone-900/40 p-2.5 rounded-lg border border-stone-900/50 space-y-1.5">
                                    <div className="flex items-start gap-1 text-stone-300">
                                      <span className="text-amber-500 font-semibold shrink-0">🏛️ المحكمة:</span>
                                      <span className="font-sans text-stone-200 text-[11px]">{judge.courtName}</span>
                                    </div>
                                    <div className="flex items-start gap-1 text-stone-400">
                                      <span className="text-stone-500 shrink-0">🏢 الغرفة القضائية:</span>
                                      <span className="text-stone-300">{judge.divisionName}</span>
                                    </div>
                                  </div>

                                  <div className="flex flex-col gap-1 pt-0.5">
                                    <span className="text-stone-500 text-[10px] font-bold">🎯 الاختصاص القضائي والممارسة:</span>
                                    <div className="text-amber-400 font-semibold bg-amber-400/5 px-2.5 py-2 rounded border border-amber-500/15 text-[11px] leading-relaxed">
                                      {judge.specialization}
                                    </div>
                                  </div>

                                  <div className="text-[10px] text-stone-500/90 bg-stone-900/20 p-2 rounded border border-stone-900/40">
                                    <strong>الاختصاص التدريبي للغرفة:</strong> {judge.divisionSpecialization}
                                  </div>
                                </div>
                              </div>

                              <div className="mt-5 pt-3 border-t border-stone-900/80 flex justify-between items-center text-[10px]">
                                <span className="text-stone-600 font-mono">ID: {judge.courtId}</span>
                                <button 
                                  onClick={() => {
                                    navigator.clipboard.writeText(`فضيلة القاضي: ${judge.name} - ${judge.role}\nالمحكمة: ${judge.courtName}\nالغرفة القضائية: ${judge.divisionName}\nالاختصاص والممارسة: ${judge.specialization}`);
                                    alert(`تم نسخ بيانات سيادة القاضي لملف الدعوى بنجاح:\nالقاضي ${judge.name}`);
                                  }}
                                  className="text-amber-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                                >
                                  نسخ بيانات القاضي 📋
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()
                  ) : (
                    // -------------------------------------------------------------
                    // COURTS & GEOGRAPHICAL REGIONS DIRECTORY (Existing template expanded with auto-open)
                    // -------------------------------------------------------------
                    (() => {
                      const filteredCourts = courtJurisdictions.filter(court => {
                        if (selectedRegion !== 'all' && court.region !== selectedRegion) return false;
                        if (selectedGovernorate !== 'all' && court.governorate !== selectedGovernorate) return false;
                        if (jurisdictionSearchQuery) {
                          const q = jurisdictionSearchQuery.toLowerCase();
                          const matchName = court.courtName.toLowerCase().includes(q);
                          const matchLocation = court.mainLocation.toLowerCase().includes(q);
                          const matchGov = court.governorate.toLowerCase().includes(q);
                          const matchSub = court.subRegions.some(sr => sr.toLowerCase().includes(q));
                          const matchDivisions = court.divisions?.some(div => 
                            div.name.toLowerCase().includes(q) || 
                            div.specialization.toLowerCase().includes(q) ||
                            div.judges?.some(judge => 
                              judge.name.toLowerCase().includes(q) ||
                              judge.role.toLowerCase().includes(q) ||
                              judge.specialization.toLowerCase().includes(q)
                            )
                          );
                          return matchName || matchLocation || matchGov || matchSub || matchDivisions;
                        }
                        return true;
                      });

                      if (filteredCourts.length === 0) {
                        return (
                          <div className="bg-stone-950 border border-stone-900/50 rounded-2xl p-12 text-center text-stone-600 flex flex-col items-center justify-center min-h-[300px]">
                            <MapPin size={48} className="text-stone-800 mb-2" />
                            <h4 className="text-stone-400 font-bold font-sans">لا توجد محكمة مطابقة لبحثك</h4>
                            <p className="text-stone-500 text-xs max-w-sm mt-1 mb-4 leading-relaxed">
                              يرجى مراجعة مسمى البحث، أو اسم القاضي، أو تغيير خيارات التصفية للأقاليم والمحافظات للعثور على المحكمة المطلوبة.
                            </p>
                          </div>
                        );
                      }

                      return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {filteredCourts.map((court) => (
                            <div 
                              key={court.id}
                              className="bg-stone-950 p-5 rounded-xl border border-stone-900/90 hover:border-amber-500/20 transition-all flex flex-col justify-between"
                            >
                              <div className="space-y-4">
                                {/* Header badges and title */}
                                <div className="space-y-1.5">
                                  <div className="flex flex-wrap gap-1.5">
                                    <span className="text-[10px] font-bold bg-amber-500/10 text-amber-300 px-2.5 py-0.5 rounded border border-amber-500/20">
                                      {court.region === 'central' ? 'إقليم الوسط' : court.region === 'northern' ? 'إقليم الشمال' : 'إقليم الجنوب'}
                                    </span>
                                    <span className="text-[10px] font-bold bg-stone-900 text-stone-300 px-2.5 py-0.5 rounded border border-stone-800">
                                      محافظة {court.governorate}
                                    </span>
                                  </div>
                                  <h3 className="text-base font-bold text-white flex items-center gap-2 pt-1">
                                    <Landmark size={15} className="text-amber-400 shrink-0" />
                                    {court.courtName}
                                  </h3>
                                </div>

                                {/* Location & Details */}
                                <div className="space-y-2 text-xs text-stone-400">
                                  <div className="flex items-start gap-2">
                                    <MapPin size={13} className="text-stone-500 shrink-0 mt-0.5" />
                                    <span><strong>الموقع الرئيسي:</strong> {court.mainLocation}</span>
                                  </div>
                                  
                                  {court.contactInfo && (
                                    <div className="flex items-center gap-2">
                                      <span className="text-stone-500">📞 الاتصال:</span>
                                      <span className="font-mono text-[11px] font-semibold text-stone-300">{court.contactInfo}</span>
                                    </div>
                                  )}

                                  {court.workingHours && (
                                    <div className="flex items-center gap-2">
                                      <span className="text-stone-500 font-sans">⏱ الدوام:</span>
                                      <span>{court.workingHours}</span>
                                    </div>
                                  )}
                                </div>

                                {/* Serviced Subregions */}
                                <div className="pt-2.5 border-t border-stone-900/60">
                                  <span className="text-[11px] font-bold text-stone-400 block mb-1.5">المناطق المشمولة بالاختصاص المحلي:</span>
                                  <div className="flex flex-wrap gap-1">
                                    {court.subRegions.map((sub, idx) => (
                                      <span 
                                        key={idx} 
                                        className="text-[10px] bg-stone-900/60 text-stone-400 px-2 py-0.5 rounded border border-stone-900 font-sans"
                                      >
                                        {sub}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                {/* Divisions & Judges section */}
                                {court.divisions && court.divisions.length > 0 && (
                                  <div className="pt-2.5 border-t border-stone-900/60 mt-2.5">
                                    <details className="group" open={!!jurisdictionSearchQuery}>
                                      <summary className="text-[11px] font-bold text-amber-400 hover:text-amber-300 cursor-pointer flex items-center justify-between select-none list-none">
                                        <span className="flex items-center gap-1">👥 الغرف القضائية والقضاة ({court.divisions.length}) {!!jurisdictionSearchQuery && '🔍'}</span>
                                        <span className="transition-transform duration-200 group-open:rotate-180 text-[9px] text-stone-500">▼</span>
                                      </summary>
                                      <div className="mt-2 space-y-2 max-h-[220px] overflow-y-auto scrollbar-thin scrollbar-thumb-stone-800 pr-0.5 text-right">
                                        {court.divisions.map((div, divIdx) => (
                                          <div key={divIdx} className="bg-stone-900/30 p-2 rounded-lg border border-stone-900/60 space-y-2">
                                            <div className="flex flex-col gap-0.5">
                                              <span className="text-[11px] font-bold text-stone-200">{div.name}</span>
                                              <span className="text-[10px] text-stone-500">الاختصاص التدريبي: {div.specialization}</span>
                                            </div>
                                            {div.judges && div.judges.length > 0 && (
                                              <div className="space-y-1.5 pt-1.5 border-t border-stone-900/40">
                                                {div.judges.map((judge, jIdx) => (
                                                  <div key={jIdx} className="flex justify-between items-start text-[10px] bg-stone-950/60 px-2 py-1 rounded">
                                                    <div className="flex flex-col">
                                                      <span className="font-bold text-stone-300">⚖️ {judge.name}</span>
                                                      <span className="text-stone-500 text-[9px]">{judge.role}</span>
                                                    </div>
                                                    <span className="bg-amber-500/10 text-amber-400 text-[8px] px-1.5 py-0.5 rounded border border-amber-500/10">
                                                      {judge.specialization}
                                                    </span>
                                                  </div>
                                                ))}
                                              </div>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    </details>
                                  </div>
                                )}
                              </div>

                              {/* Action footer */}
                              <div className="mt-5 pt-3 border-t border-stone-900/80 flex justify-between items-center text-[11px]">
                                <span className="text-stone-600 font-mono">ID: {court.id}</span>
                                <button 
                                  onClick={() => {
                                    navigator.clipboard.writeText(`${court.courtName} - ${court.mainLocation}`);
                                    alert(`تم نسخ مسمى المحكمة وعنوانها للمطالبة القضائية:\n${court.courtName}`);
                                  }}
                                  className="text-amber-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                                >
                                  نسخ بيانات المحكمة 📋
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()
                  )}

                </div>

                {/* Information sidebar for the jurisdictions guide */}
                <div className="xl:col-span-1 space-y-6">
                  <div className="bg-stone-950 p-5 rounded-xl border border-stone-900 space-y-4">
                    <h3 className="text-sm font-bold text-amber-400 border-b border-stone-900 pb-2 flex items-center gap-2">
                      <Scale size={14} />
                      توجيهات الاختصاص للمحامين ⚖️
                    </h3>
                    
                    <ul className="space-y-4 text-xs text-stone-400 leading-relaxed text-right">
                      <li className="space-y-1">
                        <strong className="text-stone-200 block">1. الاختصاص المحلي العقاري:</strong>
                        <p>تقام الدعاوى العينية العقارية حصراً أمام المحكمة التي يقع في دائرتها العقار أو جزء منه (المادة 30 من قانون أصول المحاكمات المدنية).</p>
                      </li>
                      <li className="space-y-1">
                        <strong className="text-stone-200 block">2. موطن المدعى عليه:</strong>
                        <p>في دعاوى الحق الشخصي أو المنقول، يكون الاختصاص للمحكمة التي يقع في دائرتها موطن المدعى عليه (المادة 36 أصول مدنية)، إلا إذا اتفق الخصوم على موطن مختار خطياً.</p>
                      </li>
                      <li className="space-y-1">
                        <strong className="text-stone-200 block">3. الاختصاص القيمي للأردن:</strong>
                        <p>محاكم صلح الحقوق تختص في الدعاوى التي لا تتجاوز قيمتها 10,000 دينار أردني، في حين تختص محاكم البداية بما يجاوز ذلك (10,001 دينار فما فوق) باعتبارها صاحبة الولاية العامة.</p>
                      </li>
                      <li className="space-y-1">
                        <strong className="text-stone-200 block">4. الدفع بعدم الاختصاص:</strong>
                        <p>الدفع بعدم الاختصاص المكاني ليس من النظام العام، وبالتالي يجب إثارته من قبل المدعى عليه في اللائحة الجوابية أو قبل التعرض لموضوع الدعوة، وإلا سقط الحق في إثارته.</p>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-amber-500/5 border border-amber-500/10 p-5 rounded-xl text-xs space-y-2">
                    <span className="font-bold text-amber-400 flex items-center gap-1.5 font-sans">
                      <Info size={13} />
                      نظام الخدمات الموحد للمحامين
                    </span>
                    <p className="text-stone-400 leading-relaxed text-[11px]">
                      يوفر هذا الدليل معلومات الاتصال الدقيقة لكافة المجمعات وقصور العدل في المملكة الأردنية الهاشمية لتيسير المعاملات وإيداع المحاضر والوكالات العدلية لدى الكاتب العدل بشكل سلس وموثوق.
                    </p>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB: CASE REGISTRATION PATHWAYS (طرق تسجيل القضايا) */}
          {activeTab === 'registration' && (
            <div className="space-y-6">
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Route className="text-rose-400" />
                    دليل ومسار قيد وتسجيل القضايا بالأردن ⚖️
                  </h2>
                  <p className="text-stone-400 text-xs mt-1 leading-relaxed">
                    دليل وإجراءات المحاكم الممنهجة لتسجيل وعرض سليم للدعاوى المدنية والشكاوى الجزائية من الوهلة الأولى طي القلم وحتى تسييل المطالبة ونهايتها.
                  </p>
                </div>
              </div>

              {/* Selector & Search Panel */}
              <div className="bg-stone-950 p-6 rounded-2xl border border-stone-900/80 space-y-4">
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                  {/* Tabs: Civil or Criminal */}
                  <div className="flex bg-stone-900/60 p-1.5 rounded-xl border border-stone-800 w-full lg:w-auto">
                    <button 
                      onClick={() => { setSelectedPathwayId('civil'); setActiveStageIndex(0); }}
                      className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${selectedPathwayId === 'civil' ? 'bg-amber-500 text-black shadow-md font-bold' : 'text-stone-400 hover:text-white'}`}
                    >
                      <Scale size={15} />
                      الدعاوى المدنية والمالية (حقوق)
                    </button>
                    <button 
                      onClick={() => { setSelectedPathwayId('penal'); setActiveStageIndex(0); }}
                      className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${selectedPathwayId === 'penal' ? 'bg-amber-500 text-black shadow-md font-bold' : 'text-stone-400 hover:text-white'}`}
                    >
                      <AlertCircle size={15} />
                      الشكاوى والدعاوى الجزائية (جرم)
                    </button>
                  </div>

                  {/* Search bar inside the steps */}
                  <div className="relative w-full lg:max-w-md">
                    <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-500" size={16} />
                    <input 
                      type="text"
                      placeholder="ابحث بداخل الإجراءات والمستندات (مثال: رسوم، كاتب عدل، طعن، توقيف)..."
                      value={registrationSearchQuery}
                      onChange={(e) => setRegistrationSearchQuery(e.target.value)}
                      className="w-full bg-stone-900/80 border border-stone-800 text-stone-200 placeholder-stone-500 text-xs rounded-xl py-3 pr-10 pl-4 focus:outline-none focus:border-amber-500/30 transition-all text-right font-sans"
                    />
                    {registrationSearchQuery && (
                      <button 
                        onClick={() => setRegistrationSearchQuery('')}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-stone-500 hover:text-stone-300 font-sans font-semibold"
                      >
                        مسح
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Layout: Selected Pathway info & Stepper layout */}
              {(() => {
                const pathway = caseRegistrationPathways.find(p => p.id === selectedPathwayId)!;
                
                // If there's a search, we want to filter the stages
                const filteredStages = pathway.stages.filter(stage => {
                  if (!registrationSearchQuery) return true;
                  const q = registrationSearchQuery.toLowerCase();
                  return (
                    stage.title.toLowerCase().includes(q) ||
                    stage.location.toLowerCase().includes(q) ||
                    stage.fees.toLowerCase().includes(q) ||
                    stage.professionalTip.toLowerCase().includes(q) ||
                    stage.procedures.some(p => p.toLowerCase().includes(q)) ||
                    stage.documents.some(d => d.toLowerCase().includes(q))
                  );
                });

                // Get current active stage safe index
                const currentStage = filteredStages[activeStageIndex] || filteredStages[0];

                return (
                  <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                    
                    {/* Stepper (Steps List) - Left Column in Arabic RTL (rendered on right in flex-row for screen) */}
                    <div className="xl:col-span-1 space-y-3">
                      <div className="bg-stone-950 p-4 rounded-xl border border-stone-900">
                        <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block mb-1 font-sans">المسير الإجرائي المكتمل</span>
                        <h3 className="text-white text-sm font-bold border-b border-stone-900 pb-2 mb-3">مخطط مراحل القضية الموصى بها</h3>
                        
                        <div className="bg-stone-900/40 p-3 rounded-lg border border-stone-800/80 mb-4 text-xs text-stone-400 leading-relaxed text-right">
                          <span className="font-bold text-amber-400 block mb-1">المحاكم ذات الاختصاص الولائي السليم:</span>
                          {pathway.generalJurisdiction}
                        </div>

                        {filteredStages.length === 0 ? (
                          <p className="text-stone-600 text-xs py-4 text-center font-sans">لا توجد مرحلة تطابق معيار البحث.</p>
                        ) : (
                          <div className="space-y-4 relative pb-2 justify-start pr-1">
                            {/* Visual vertical connector line */}
                            <div className="absolute right-5 top-4 bottom-4 w-[2px] bg-stone-900/80 -z-0" />

                            {filteredStages.map((stage, sidx) => {
                              const isSelected = currentStage && currentStage.id === stage.id;
                              return (
                                <button
                                  key={stage.id}
                                  onClick={() => {
                                    const realIdx = filteredStages.findIndex(s => s.id === stage.id);
                                    if (realIdx !== -1) setActiveStageIndex(realIdx);
                                  }}
                                  className={`w-full flex items-start gap-3 p-3 rounded-xl border text-right transition-all relative z-10 ${isSelected ? 'bg-amber-500/10 border-amber-500/25 text-amber-300 pointer-events-none' : 'bg-stone-900/10 border-transparent hover:border-stone-900 text-stone-400 hover:text-stone-200 hover:bg-stone-900/30'}`}
                                >
                                  {/* Bullet point step badge */}
                                  <div className={`w-5 fill-current h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 font-mono ${isSelected ? 'bg-amber-500 text-black' : 'bg-stone-800 text-stone-400'}`}>
                                    {stage.stageNo}
                                  </div>
                                  <div className="space-y-0.5">
                                    <h4 className="text-xs font-bold font-sans">المرحلة {stage.stageNo}: {stage.title}</h4>
                                    <p className="text-[10px] text-stone-500 line-clamp-1 truncate">{stage.location}</p>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Detailed Content of Active Stage - 3 Columns */}
                    <div className="xl:col-span-3 space-y-4">
                      {currentStage ? (
                        <div className="bg-stone-950 p-6 rounded-2xl border border-stone-900/95 space-y-6">
                          
                          {/* Header of Active Step */}
                          <div className="border-b border-stone-900/65 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold bg-amber-500/10 text-amber-300 px-2.5 py-0.5 rounded border border-amber-500/20 font-sans">
                                المرحلة رقم {currentStage.stageNo} من {pathway.stages.length}
                              </span>
                              <h3 className="text-xl font-bold text-white leading-snug pt-1">{currentStage.title}</h3>
                            </div>
                            
                            {/* Copy details block */}
                            <div className="flex gap-2 w-full md:w-auto shrink-0">
                              <button
                                onClick={() => {
                                  let formatted = `مسار تسجيل القضية: ${pathway.title}\n`;
                                  formatted += `المرحلة ${currentStage.stageNo}: ${currentStage.title}\n`;
                                  formatted += `مكان الإجراء: ${currentStage.location}\n`;
                                  formatted += `الرسوم والتكاليف: ${currentStage.fees}\n\n`;
                                  formatted += `الإجراءات والخطوات المتبعة:\n`;
                                  currentStage.procedures.forEach((p, i) => formatted += `  ${i+1}. ${p}\n`);
                                  formatted += `\nالأوراق والوثائق المطلوبة:\n`;
                                  currentStage.documents.forEach((d, i) => formatted += `  - ${d}\n`);
                                  formatted += `\nنصائح الأستاذ وتوجيهات سلامة الخصومة:\n  ${currentStage.professionalTip}`;
                                  
                                  navigator.clipboard.writeText(formatted);
                                  alert(`تم نسخ إجراءات ومستندات المرحلة ${currentStage.stageNo} بالكامل للحافظة بنجاح!`);
                                }}
                                className="w-full md:w-auto bg-stone-900 hover:bg-stone-850 text-amber-400 text-xs font-semibold px-4 py-2.5 rounded-lg border border-stone-805 flex items-center justify-center gap-2 transition-all hover:border-amber-500/20"
                              >
                                📋 نسخ بيانات هذه المرحلة
                              </button>
                            </div>
                          </div>

                          {/* Location Detail */}
                          <div className="bg-stone-900/30 p-4 rounded-xl border border-stone-900 flex items-start gap-3">
                            <div className="w-9 h-9 rounded-lg bg-stone-850 flex items-center justify-center text-stone-400 shrink-0 border border-stone-800">
                              <MapPin size={16} className="text-rose-400" />
                            </div>
                            <div>
                              <span className="text-[10px] text-stone-500 font-bold block">أين ومكان إجراء المعاملة والقسم المختص:</span>
                              <p className="text-stone-200 text-xs font-bold mt-0.5">{currentStage.location}</p>
                            </div>
                          </div>

                          {/* Procedures / Steps */}
                          <div className="space-y-3">
                            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 border-b border-stone-900 pb-1.5">
                              ⚖️ الخطوات والإجراءات المتبعة بالتسلسل:
                            </span>
                            <ol className="space-y-3.5 pr-1">
                              {currentStage.procedures.map((proc, pIdx) => (
                                <li key={pIdx} className="flex gap-3 text-xs text-stone-300 leading-relaxed text-right items-start">
                                  <span className="w-5 h-5 rounded bg-stone-900 border border-stone-850 flex items-center justify-center text-[10px] font-bold text-amber-400 font-mono shrink-0 mt-0.5">{pIdx + 1}</span>
                                  <span className="pt-0.5">{proc}</span>
                                </li>
                              ))}
                            </ol>
                          </div>

                          {/* Documents grid & Fees */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            
                            {/* Required Documents Card */}
                            <div className="bg-stone-900/30 p-5 rounded-xl border border-stone-900 flex flex-col justify-between">
                              <div>
                                <span className="text-xs font-bold text-stone-200 block mb-3 border-b border-stone-900/60 pb-1.5">📄 الوثائق والأوراق والطلبات المطلوبة:</span>
                                <ul className="space-y-2.5 text-xs text-stone-400">
                                  {currentStage.documents.map((doc, dIdx) => (
                                    <li key={dIdx} className="flex gap-2 items-start text-right">
                                      <span className="text-amber-500 shrink-0 font-bold">✓</span>
                                      <span>{doc}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            {/* Fees & Expenses Card */}
                            <div className="bg-stone-900/30 p-5 rounded-xl border border-stone-900 flex flex-col justify-between">
                              <div>
                                <span className="text-xs font-bold text-stone-200 block mb-2 border-b border-stone-900/60 pb-1.5">💰 الرسوم والأثمان المالية المتوقعة للمرحلة:</span>
                                <p className="text-stone-300 text-xs leading-relaxed font-sans mt-3 font-semibold bg-stone-950 p-3 rounded-lg border border-stone-900 text-amber-400">
                                  {currentStage.fees}
                                </p>
                              </div>
                            </div>

                          </div>

                          {/* Professional lawyer tip */}
                          <div className="bg-amber-500/5 border border-amber-500/10 p-5 rounded-2xl space-y-2">
                            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold font-sans">
                              <Info size={14} />
                              نصيحة الأستاذ المحامي وملاحظات عملية بالغة الأهمية:
                            </div>
                            <p className="text-stone-300 text-xs leading-relaxed">
                              {currentStage.professionalTip}
                            </p>
                          </div>

                          {/* Copy entire pathway button */}
                          <div className="pt-3 border-t border-stone-900 flex justify-end text-[11px] text-stone-500">
                            <button
                              onClick={() => {
                                let formattedDocs = `مسار تسجيل القضية بالكامل: ${pathway.title}\n======================\n`;
                                pathway.stages.forEach(s => {
                                  formattedDocs += `\nالمرحلة ${s.stageNo}: ${s.title}\n`;
                                  formattedDocs += `مكان الإجراء: ${s.location}\n`;
                                  formattedDocs += `الرسوم والتكاليف: ${s.fees}\n`;
                                  formattedDocs += `خطوات الإجراء:\n`;
                                  s.procedures.forEach((pr, idx) => formattedDocs += `  ${idx+1}. ${pr}\n`);
                                  formattedDocs += `الوثائق الثبوتية المطلوبة:\n`;
                                  s.documents.forEach(doc => formattedDocs += `  - ${doc}\n`);
                                  formattedDocs += `نصيحة المحترف: ${s.professionalTip}\n`;
                                  formattedDocs += `--------------------------------------------------\n`;
                                });
                                navigator.clipboard.writeText(formattedDocs);
                                alert(`تم نسخ كافة مراحل ${pathway.title} (${pathway.stages.length} مراحل بالكامل) للحافظة لتبادلها وعرضها!`);
                              }}
                              className="text-stone-400 hover:text-amber-400 hover:underline flex items-center gap-1 font-semibold transition-all"
                            >
                              📋 نسخ الـ {pathway.stages.length} مراحل للمسار المختار بالكامل للأرشيف
                            </button>
                          </div>

                        </div>
                      ) : (
                        <div className="bg-stone-950 rounded-2xl border border-stone-900 p-12 text-center text-stone-500 min-h-[400px] flex items-center justify-center">
                          <p className="font-sans text-xs">يرجى تحديد مرحلة لعرض إجراءاتها بالتفصيل.</p>
                        </div>
                      )}
                    </div>

                  </div>
                );
              })()}

            </div>
          )}

          {/* TAB: FEES & ATTORNEY CALCULATOR (حاسبة الرسوم والأتعاب القضائية) */}
          {activeTab === 'calculator' && (
            <FeesCalculator />
          )}

          {/* TAB 6: AI CO-COUNSELOR (المساعد الذكي لوزارة العدل) */}
          {activeTab === 'ai' && (
            <div className="space-y-4 h-[calc(100vh-140px)] flex flex-col">
              
              {/* Header inside screen */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-stone-900 pb-3 shrink-0 gap-2">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <MessageSquare className="text-amber-400 animate-pulse" />
                    المستشار الرقمي الفوري لقوانين الأردن (Gemini-AI)
                  </h2>
                  <p className="text-stone-400 text-xs">مستشار قانوني محكم معالج للصياغات ومستند لنصوص الجريدة الرسمية بمحكمة التمييز الأردنية.</p>
                </div>
                
                <button 
                  onClick={() => {
                    if (confirm('هل ترغب في مسح تاريخ المحادثات القانونية والبدء من جديد؟')) {
                      setChatMessages([{
                        id: 'welcome',
                        sender: 'assistant',
                        text: 'أهلاً بك زميلي الأستاذ المحامي في منصة عدالتي. كيف يمكنني مساعدتك اليوم في صياغة لائحة قضائية، أو تحليل نص من القانون المدني، أو عقوبات الأردن؟ يرجى كتابة سؤالك وسأنظم لك الإجابة في قالب قانوني رصين.',
                        timestamp: new Date().toLocaleTimeString('ar-JO', { hour: '2-digit', minute: '2-digit' })
                      }]);
                    }
                  }}
                  className="text-xs text-stone-500 hover:text-rose-400 underline"
                >
                  مسح السجل القانوني ↺
                </button>
              </div>

              {/* Chat Thread Workspace */}
              <div className="flex-1 bg-stone-950/60 rounded-2xl border border-stone-900/80 p-4 overflow-y-auto flex flex-col space-y-4">
                
                {chatMessages.length === 0 && (
                  <div className="my-auto text-center max-w-md mx-auto space-y-4 py-8">
                    <Scale size={48} className="text-amber-500/20 mx-auto" />
                    <h4 className="text-stone-300 font-bold">بوابة الاستشارة الرقمية الفورية لمستشاري المنصة</h4>
                    <p className="text-stone-500 text-xs leading-relaxed">
                      الدردشة مشفرة للغاية ومحمية بالكامل. اسأل عن بنود قانون العمل، نظام الاستئناف، أو صِغ وقائع لدعاوى البداية والصلح وسيتولى المساعد الذكي هيكلتها.
                    </p>
                  </div>
                )}

                {chatMessages.map((msg) => (
                  <div 
                    key={msg.id}
                    className={`flex flex-col max-w-[85%] sm:max-w-[70%] ${
                      msg.sender === 'user' ? 'mr-auto items-start' : 'ml-auto items-end'
                    }`}
                  >
                    <span className="text-[10px] text-stone-500 font-mono mb-1 px-1">
                      {msg.sender === 'user' ? 'المحامي' : 'مستشار عدالتي الذكي'} • {msg.timestamp}
                    </span>
                    
                    <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-amber-500 text-black font-semibold rounded-tl-none shadow' 
                        : 'bg-stone-900 text-stone-200 border border-stone-800 rounded-tr-none shadow-md'
                    }`}>
                      <p className="whitespace-pre-line text-right">{msg.text}</p>
                      
                      {msg.sender === 'assistant' && msg.id !== 'welcome' && (
                        <div className="mt-3 pt-2.5 border-t border-stone-800/80 flex justify-between items-center text-[10px] text-stone-500">
                          <span>نظام الأردن النظامي</span>
                          <button 
                            onClick={() => handleCopyText(msg.text, msg.id)}
                            className="hover:text-amber-400 underline font-semibold flex items-center gap-1"
                          >
                            {copiedId === msg.id ? 'تم نسخ الاستشارة!' : 'نسخ الاستشارة الكاملة 📋'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isAiLoading && (
                  <div className="ml-auto flex items-center gap-2 text-xs text-amber-400 bg-stone-900 border border-stone-800 px-4 py-3 rounded-2xl rounded-tr-none animate-pulse">
                    <span>يتم فحص نصوص القانون الأردني وصياغة الاستعانة واللوائح...</span>
                  </div>
                )}

                {apiError && (
                  <div className="p-4 bg-rose-950/20 border border-rose-500/20 rounded-xl max-w-lg mx-auto text-center space-y-2">
                    <p className="text-xs text-rose-300 font-semibold">{apiError}</p>
                    <p className="text-[10px] text-stone-500">
                      يرجى التأكد من تهيئة مفتاح جيميناي (GEMINI_API_KEY) بشكل صحيح عبر التبويب المتاح ثم إعادة إطلاق المحاولة.
                    </p>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Chat Input Area */}
              <form onSubmit={handleSendPrompt} className="flex gap-2 shrink-0">
                <input 
                  type="text"
                  value={currentPrompt}
                  onChange={(e) => setCurrentPrompt(e.target.value)}
                  placeholder="اسأل عن قانون، اطلب صياغة إنذار عدلي، أو استشِر بالحقوق والعقوبات في الأردن..."
                  disabled={isAiLoading}
                  className="flex-1 bg-stone-950 border border-stone-900 focus:border-amber-500/50 rounded-xl px-4 py-3 text-xs text-stone-200 placeholder:text-stone-600 focus:outline-none transition-all disabled:opacity-50"
                />
                <button 
                  type="submit"
                  disabled={isAiLoading || !currentPrompt.trim()}
                  className="bg-amber-500 text-black hover:bg-amber-400 px-5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:hover:bg-amber-500 active:scale-95 cursor-pointer shrink-0"
                >
                  <Send size={14} />
                  <span>استفسار</span>
                </button>
              </form>

              {/* Quick Prompt suggestions for Jordan Lawyers */}
              <div className="flex flex-wrap gap-2 shrink-0 overflow-x-auto py-1">
                <button 
                  type="button"
                  onClick={() => setCurrentPrompt('ما هي شروط وإجراءات إخلاء عمارة تجارية في عمان وفق قانون المالكين والمستأجرين؟')}
                  className="px-3 py-1 rounded bg-stone-900 border border-stone-800 hover:border-amber-500/30 text-[11px] text-stone-400 hover:text-stone-200 transition-all cursor-pointer whitespace-nowrap"
                >
                  إخلاء مأجور تجاري
                </button>
                <button 
                  type="button"
                  onClick={() => setCurrentPrompt('أريد صياغة إنذار عدلي للمطالبة بسند دين قيمته خمسة آلاف دينار أردني لأوجهه عبر كاتب العدل.')}
                  className="px-3 py-1 rounded bg-stone-900 border border-stone-800 hover:border-amber-500/30 text-[11px] text-stone-400 hover:text-stone-200 transition-all cursor-pointer whitespace-nowrap"
                >
                  صياغة إنذار عدلي مالي
                </button>
                <button 
                  type="button"
                  onClick={() => setCurrentPrompt('ما هي قرارات محكمة التمييز الأردنية بخصوص إثبات المعاملات التجارية التي تتجاوز مائة دينار؟')}
                  className="px-3 py-1 rounded bg-stone-900 border border-stone-800 hover:border-amber-500/30 text-[11px] text-stone-400 hover:text-stone-200 transition-all cursor-pointer whitespace-nowrap"
                >
                  قرارات تمييز إثبات ومستندات
                </button>
              </div>

            </div>
          )}

          {/* TAB: AGREEMENTS CONTRACT CO-DRAFTING (اتفاقيات المحامين والموكلين) */}
          {activeTab === 'agreements' && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="space-y-6"
            >
              <AgreementsTab 
                drafts={drafts}
                onSaveDraft={(title, content) => {
                  const newDraft: SavedDraft = {
                    id: `draft-agreement-${Date.now()}`,
                    title: title,
                    type: 'custom',
                    content: content,
                    createdAt: new Date().toLocaleDateString('ar-JO')
                  };
                  const updated = [newDraft, ...drafts];
                  saveDraftsToStorage(updated);
                }}
              />
            </motion.div>
          )}

          {/* TAB: CONTRACTS AND TEMPLATES (صياغة العقود وقوالبها) */}
          {activeTab === 'contracts' && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="space-y-6"
            >
              <ContractsTab 
                drafts={drafts}
                onSaveDraft={(title, content) => {
                  const newDraft: SavedDraft = {
                    id: `draft-contract-${Date.now()}`,
                    title: title,
                    type: 'contract',
                    content: content,
                    createdAt: new Date().toLocaleDateString('ar-JO')
                  };
                  const updated = [newDraft, ...drafts];
                  saveDraftsToStorage(updated);
                }}
              />
            </motion.div>
          )}

          {/* TAB: PETITIONS GOVERNMENT SYSTEMS (استدعاءات لجميع الدوائر الحكومية) */}
          {activeTab === 'petitions' && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="space-y-6"
            >
              <PetitionsTab 
                drafts={drafts}
                onSaveDraft={(title, content) => {
                  const newDraft: SavedDraft = {
                    id: `draft-petition-${Date.now()}`,
                    title: title,
                    type: 'petition',
                    content: content,
                    createdAt: new Date().toLocaleDateString('ar-JO')
                  };
                  const updated = [newDraft, ...drafts];
                  saveDraftsToStorage(updated);
                }}
              />
            </motion.div>
          )}

          {/* TAB: MOBILE APP SETUP (تحميل وتثبيت الجوال) */}
          {activeTab === 'mobile' && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="space-y-6"
            >
              <MobileSetupTab />
            </motion.div>
          )}

          {/* TAB 7: SAVED DRAFTS (مسوداتي المحفوظة) */}
          {activeTab === 'drafts' && (
            <div className="space-y-6">
              
              <div className="flex justify-between items-center border-b border-stone-900 pb-3">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Bookmark className="text-amber-400" />
                    مسوداتي وبحوثي القانونية المحفوظة
                  </h2>
                  <p className="text-stone-400 text-xs">سجل محلي آمن بمسودات الوكالات واللوائح التي قمت بصياغتها لمراجعتها بنهاية الجلسة.</p>
                </div>
                
                {drafts.length > 0 && (
                  <button 
                    onClick={() => {
                      if (confirm('هل أنت متأكد من رغبتك في حذف جميع المسودات وصفر السجل؟')) {
                        saveDraftsToStorage([]);
                      }
                    }}
                    className="text-xs text-rose-400 hover:underline"
                  >
                    حذف كافة المسودات ⚠️
                  </button>
                )}
              </div>

              {drafts.length === 0 ? (
                <div className="bg-stone-950 border border-stone-900/50 rounded-2xl p-12 text-center text-stone-600 flex flex-col items-center justify-center min-h-[350px]">
                  <Scale size={64} strokeWidth={1} className="text-stone-800 mb-3" />
                  <h4 className="text-stone-400 font-bold">لا يوجد مسودات مصاغة حالياً</h4>
                  <p className="text-stone-500 text-xs max-w-sm mt-1">
                    عندما تكمل صياغة وكالة عدلية أو لائحة شكوى، اضغط على زر "حفظ في مسوداتي" وستظهر جميعها كخزان آمن وقابل للتحرير فورا هنا.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {drafts.map((dr) => (
                    <div key={dr.id} className="bg-stone-950 p-6 rounded-2xl border border-stone-900 flex flex-col justify-between hover:border-amber-500/20 transition-colors">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] uppercase font-bold bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/25">
                            {dr.type === 'agency' ? 'سند وكالة' : dr.type === 'suit' ? 'لائحة قضائية' : dr.type === 'petition' ? 'استدعاء رسمي' : dr.type === 'contract' ? 'عقد قانوني' : 'اتفاقية أتعاب'}
                          </span>
                          <span className="text-stone-500 text-xs font-mono">{dr.createdAt}</span>
                        </div>
                        <h4 className="text-base font-bold text-stone-100">{dr.title}</h4>
                        
                        <textarea 
                          value={dr.content}
                          onChange={(e) => {
                            const updated = drafts.map(d => d.id === dr.id ? { ...d, content: e.target.value } : d);
                            saveDraftsToStorage(updated);
                          }}
                          className="w-full h-44 bg-stone-900/40 text-xs font-mono border border-stone-900 rounded-lg p-3 text-stone-300 leading-relaxed focus:outline-none focus:border-amber-500/20 text-right resize-y"
                        />
                      </div>

                      <div className="mt-4 pt-4 border-t border-stone-900 flex justify-between items-center">
                        <button 
                          onClick={() => handleDeleteDraft(dr.id)}
                          className="text-stone-500 hover:text-rose-400 text-xs flex items-center gap-1 transition-colors"
                        >
                          <Trash2 size={13} />
                          إزالة المسودة
                        </button>

                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleCopyText(dr.content, dr.id)}
                            className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-200 hover:text-white rounded text-xs transition-all flex items-center gap-1"
                          >
                            {copiedId === dr.id ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                            <span>نسخ النص</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* TAB: CASE AUDITING (تدقيق القضايا) */}
          {activeTab === 'audit' && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="space-y-6 animate-fade-in"
            >
              <style>{`
                @media print {
                  body * {
                    visibility: hidden;
                  }
                  #printable-audit-area, #printable-audit-area * {
                    visibility: visible;
                  }
                  #printable-audit-area {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    direction: rtl !important;
                    color: black !important;
                    background: white !important;
                  }
                  /* styling overrides for printer */
                  .bg-rose-500\\/5 { background: #fef2f2 !important; border: 1px solid #fee2e2 !important; }
                  .text-rose-300 { color: #991b1b !important; }
                  .bg-amber-500\\/5 { background: #fffbeb !important; border: 1px solid #fef3c7 !important; }
                  .text-stone-200 { color: #1c1917 !important; }
                  .bg-emerald-500\\/5 { background: #f0fdf4 !important; border: 1px solid #dcfce7 !important; }
                  .bg-stone-900\\/50 { background: #fcfbf7 !important; border: 1px solid #e7e5e4 !important; }
                }
              `}</style>

              {/* Page Title & Concept */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2.5 font-sans">
                    <FileCheck className="text-amber-400" />
                    مركز تدقيق القضايا وكشف الثغرات القانونية الذكي
                  </h2>
                  <p className="text-stone-400 text-xs mt-1">
                    أداة حوكمة متطورة للمحامي الأردني الممارس لتشخيص وقائع النزاع، ملاءمة الصفات، تحديد الاختصاص القضائي بدقة، والكشف المبكر عن الثغرات الإجرائية.
                  </p>
                </div>
              </div>

              {/* Form/Report Dashboard Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                
                {/* Right Column: Case Intake Form & Presets (Takes 5 columns) */}
                <div className="xl:col-span-5 space-y-6">
                  
                  {/* Load Preset Test Cases */}
                  <div className="bg-stone-950 p-5 rounded-2xl border border-stone-900/80 space-y-3.5">
                    <h3 className="text-xs font-bold text-amber-400 tracking-wider flex items-center gap-2">
                      🚀 تجربة اختبار سريعة بقضايا أردنية نموذجية
                    </h3>
                    <p className="text-stone-400 text-[11px] leading-relaxed">
                      اضغط على أي قضية نموذجية أدناه لملء البيانات فوراً وتجربة نظام التدقيق الذكي وكشف الثغرات الإجرائية:
                    </p>
                    <div className="space-y-2 pt-1.5">
                      {auditPresets.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setAuditTitle(preset.title);
                            setAuditCategory(preset.category);
                            setAuditCourtType(preset.courtType);
                            setAuditDefendants(preset.defendants);
                            setAuditFacts(preset.facts);
                            setAuditEvidences(preset.evidences);
                            setAuditError(null);
                            setAuditResult(null);
                          }}
                          className="w-full text-right p-3 rounded-xl bg-stone-900 border border-stone-800/80 hover:border-amber-400/30 hover:bg-stone-900/80 transition-all cursor-pointer flex flex-col gap-1 text-[11px]"
                        >
                          <div className="flex justify-between items-center w-full">
                            <span className="font-bold text-stone-200">⚖️ {preset.title}</span>
                            <span className="text-[9px] bg-amber-500/10 text-amber-300 border border-amber-500/15 px-1.5 py-0.5 rounded font-sans">
                              {preset.category === 'civil' ? 'عقد وحقوق' : 'منازعة'}
                            </span>
                          </div>
                          <p className="text-stone-400 text-[10px] leading-relaxed font-sans">{preset.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input Form Box */}
                  <div className="bg-stone-950 p-6 rounded-2xl border border-stone-900/80 space-y-4">
                    <h3 className="text-sm font-bold text-stone-100 flex items-center gap-2 border-b border-stone-900 pb-3 font-sans">
                      📋 ملخص ملف النزاع والوقائع
                    </h3>

                    <div className="space-y-3.5">
                      {/* Title */}
                      <div>
                        <label className="block text-xs text-stone-400 font-bold mb-1.5">عنوان ومسمى القضية (موضوع الدعوى) *</label>
                        <input
                          type="text"
                          placeholder="مثال: دعوى مطالبة بأجور مأجور / بطلان عقد إيجار / بطلان شيك"
                          value={auditTitle}
                          onChange={(e) => setAuditTitle(e.target.value)}
                          className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-3 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500/40 text-right"
                        />
                      </div>

                      {/* Grid for parameters */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-stone-400 font-bold mb-1.5">النوع القضائي *</label>
                          <select
                            value={auditCategory}
                            onChange={(e) => setAuditCategory(e.target.value)}
                            className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500/40 cursor-pointer text-right"
                          >
                            <option value="civil">حقوقية / مدنية</option>
                            <option value="penal">جزائية / شكوى جرمية</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-stone-400 font-bold mb-1.5">المحكمة المعروض عليها الدعوى *</label>
                          <select
                            value={auditCourtType}
                            onChange={(e) => setAuditCourtType(e.target.value)}
                            className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500/40 cursor-pointer text-right"
                          >
                            <option value="محكمة صلح الحقوق">صلح حقوق (أقل من 10 آلاف)</option>
                            <option value="محكمة بداية الحقوق">بداية حقوق (أكثر من 10 آلاف)</option>
                            <option value="محكمة صلح الجزاء">صلح الجزاء / جنحي</option>
                            <option value="محكمة بداية الجزاء">بداية الجزاء / جنائي</option>
                            <option value="المحكمة الشرعية">المحكمة الشرعية</option>
                            <option value="محكمة التسجيل الطابو والعقارات">أراضي وعقارات</option>
                          </select>
                        </div>
                      </div>

                      {/* Defendant info */}
                      <div>
                        <label className="block text-xs text-stone-400 font-bold mb-1.5">الخصوم والمدعى عليهم وصفتهم القانونية</label>
                        <input
                          type="text"
                          placeholder="مثال: الشركة الأردنية للاستثمارات (مدين أول)، الكفيل سليمان"
                          value={auditDefendants}
                          onChange={(e) => setAuditDefendants(e.target.value)}
                          className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-3 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500/40 text-right"
                        />
                      </div>

                      {/* Facts and Details */}
                      <div>
                        <label className="block text-xs text-stone-400 font-bold mb-1.5">تفاصيل ووقائع الدعوى التاريخية بالتفصيل *</label>
                        <textarea
                          rows={5}
                          placeholder="اكتب القصة بالتفصيل، حدد التواريخ الهامة (مثلا: تاريخ وقوع العقد، تاريخ التوقف عن السداد، إرسال خطابات، أي إخلال شكلي، أو أي تفاصيل أخرى لمراجعة المهل القانونية)"
                          value={auditFacts}
                          onChange={(e) => setAuditFacts(e.target.value)}
                          className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-3 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500/40 text-right resize-none font-sans leading-relaxed"
                        />
                      </div>

                      {/* Evidences */}
                      <div>
                        <label className="block text-xs text-stone-400 font-bold mb-1.5">البينات السندية والشهود والقرائن كمعطيات للاستدلال</label>
                        <input
                          type="text"
                          placeholder="مثال: عقد الإيجار الموقع بالشهود، إيصال القبض، مكالمة هاتفية"
                          value={auditEvidences}
                          onChange={(e) => setAuditEvidences(e.target.value)}
                          className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-3 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500/40 text-right"
                        />
                      </div>

                      {/* Error messaging */}
                      {auditError && (
                        <div className="bg-rose-500/10 border border-rose-500/25 p-3 rounded-xl text-rose-300 text-xs flex items-start gap-2 select-none">
                          <AlertCircle size={15} className="shrink-0 mt-0.5" />
                          <p className="leading-relaxed font-sans">{auditError}</p>
                        </div>
                      )}

                      {/* Audit Trigger Button */}
                      <button
                        onClick={handleStartAudit}
                        disabled={isAuditing}
                        className={`w-full py-4 text-xs font-bold rounded-xl flex items-center justify-center gap-2 bg-gradient-to-l from-amber-500 to-amber-600 text-black hover:opacity-95 active:scale-98 transition-all cursor-pointer ${
                          isAuditing ? 'opacity-60 cursor-not-allowed' : ''
                        }`}
                      >
                        <FileCheck size={16} />
                        <span>{isAuditing ? 'برجاء الانتظار، حوكمة وتدقيق ملف الخصومة مستمر...' : 'ابدأ تدقيق القضية وبحث الثغرات الآن ✨'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Left Column: Resulting Comprehensive Audit Report (Takes 7 columns) */}
                <div className="xl:col-span-7 space-y-6">
                  
                  {/* Loading State Placeholder */}
                  {isAuditing && (
                    <div className="bg-stone-950 border border-stone-900 rounded-2xl p-12 min-h-[600px] flex flex-col items-center justify-center select-none space-y-6">
                      <div className="relative w-16 h-16 flex items-center justify-center">
                        <span className="absolute inset-0 rounded-full border-4 border-amber-500/10 border-t-amber-400 animate-spin" />
                        <Scale size={24} className="text-amber-400" />
                      </div>
                      <div className="space-y-2 text-center">
                        <h4 className="text-stone-200 text-xs font-bold font-sans">يقوم وكيل النيابة والتدقيق الرقمي بدراسة القضية...</h4>
                        <p className="text-stone-500 text-[11px] max-w-sm leading-relaxed font-sans">
                          نقوم بالربط الفوري واستئصال المدد والمهل الزمنية وقانون البينات الأردني وتكييف الواقعة لتحديد ثغرات الخصومة ونقاط الرد المناسبة.
                        </p>
                      </div>
                      {/* Sequential progress ticks */}
                      <div className="w-full max-w-md bg-stone-900/60 p-4 rounded-xl border border-stone-900 text-[10px] space-y-2.5 text-stone-500">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500/80 animate-ping" />
                          <span className="text-stone-300 font-sans">تكييف الاختصاص القضائي والمكاني وعتبة الرسوم...</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-500/60" />
                          <span className="font-sans">مراجعة قانون أصول المحاكمات الأردني وشكلية الخصومة...</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-stone-700" />
                          <span className="font-sans">تحديد دفوع الدفاع المتوقعة ومصادر البينات...</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Un-audited empty placeholder */}
                  {!isAuditing && !auditResult && (
                    <div className="bg-stone-950 border border-stone-900/50 rounded-2xl p-12 min-h-[640px] flex flex-col items-center justify-center text-center">
                      <div className="bg-stone-900 p-4 rounded-full border border-stone-800 mb-4 text-stone-400/80">
                        <FileCheck size={48} className="text-stone-500" />
                      </div>
                      <h4 className="text-stone-400 font-bold text-sm font-sans">بانتظار وقائع قضيتك وبدء التدقيق</h4>
                      <p className="text-stone-500 text-xs max-w-md mt-1.5 leading-relaxed font-sans">
                        قم بكتابة مسمى القضية ووقائعها بالنافذة الجانبية أو حمّل إحدى القضايا التدريبية النموذجية، وسيبدأ النظام فوراً بتحليل الاختصاص، الكشف عن الثغرات القانونية، وإرشادك لكيفية التصرف بشكل دقيق لتأمين الدعوى.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl mt-8 pt-8 border-t border-stone-900/80">
                        <div className="p-4 bg-stone-900/30 rounded-xl border border-stone-900 flex flex-col items-center text-center">
                          <span className="text-xl">⚠️</span>
                          <span className="text-[11px] font-bold text-stone-300 mt-2 font-sans">كشف ثغرات الإجراء والمدد</span>
                          <span className="text-[10px] text-stone-500 mt-1 font-sans">مدد التقادم، غفوات الإنذارات وسقوط الميعاد</span>
                        </div>
                        <div className="p-4 bg-stone-900/30 rounded-xl border border-stone-900 flex flex-col items-center text-center">
                          <span className="text-xl">🏛️</span>
                          <span className="text-[11px] font-bold text-stone-300 mt-2 font-sans">ضبط الاختصاص والخصم</span>
                          <span className="text-[10px] text-stone-500 mt-1 font-sans">تحديد المحكمة والمدعى عليه ذو الصفة بدقة</span>
                        </div>
                        <div className="p-4 bg-stone-900/30 rounded-xl border border-stone-900 flex flex-col items-center text-center">
                          <span className="text-xl">📋</span>
                          <span className="text-[11px] font-bold text-stone-300 mt-2 font-sans">تنظيم خريطة البينات</span>
                          <span className="text-[10px] text-stone-500 mt-1 font-sans">تجهيز المستندات والأدلة القانونية الحاسمة</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Render Completed Audit Results with Export & Print utilities */}
                  {!isAuditing && auditResult && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.98 }} 
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-stone-950 rounded-2xl border border-stone-900/80 p-6 space-y-6"
                    >
                      {/* Header / Meta */}
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-stone-900 pb-4 gap-3">
                        <div>
                          <span className="text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/15 px-2 py-0.5 rounded font-bold font-sans">
                            تقرير استشاري ذكي وموثق ⚖️
                          </span>
                          <h3 className="text-base font-bold text-stone-100 mt-1.5 leading-snug font-sans">
                            مطالعة وتدقيق: {auditTitle}
                          </h3>
                          <p className="text-[10px] text-stone-500 font-mono mt-0.5">الملف: ADLT-AUDIT-ID-{Math.floor(Math.random() * 9000) + 1000}</p>
                        </div>

                        {/* EXPORTS & UTILITIES BOX (User Goal) */}
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={exportToWord}
                            className="px-3 py-2 bg-stone-900 hover:bg-stone-800 border border-stone-800 hover:border-blue-500/20 text-stone-300 hover:text-white rounded-xl text-[11px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                            title="تصدير بصيغة Word Doc"
                          >
                            <FileText size={13} className="text-blue-400" />
                            <span className="font-sans">تصدير Word (DOC)</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => window.print()}
                            className="px-3 py-2 bg-stone-900 hover:bg-stone-800 border border-stone-800 hover:border-amber-500/20 text-stone-300 hover:text-white rounded-xl text-[11px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                            title="طباعة التقرير كـ PDF"
                          >
                            <Printer size={13} className="text-amber-400" />
                            <span className="font-sans">تصدير PDF / طباعة</span>
                          </button>
                          <button
                            type="button"
                            onClick={exportToImage}
                            className="px-3 py-2 bg-stone-900 hover:bg-stone-800 border border-stone-800 hover:border-emerald-500/20 text-stone-300 hover:text-white rounded-xl text-[11px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                            title="حفظ خلاصة التقرير كصورة"
                          >
                            <Download size={13} className="text-emerald-400" />
                            <span className="font-sans">تصدير كصورة (PNG)</span>
                          </button>
                        </div>
                      </div>

                      {/* Comprehensive Report content */}
                      <div id="printable-audit-area" className="space-y-5 text-right font-sans">
                        
                        {/* 1. SUITABILITY BLOCK */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-stone-400 flex items-center gap-1.5 font-sans">
                            <span className="text-stone-500 text-sm">🏛️</span>
                            ملاءمة الاختصاص القضائي والمكاني والخصومة
                          </h4>
                          <div className="bg-amber-500/5 p-4 rounded-xl border border-amber-500/10 text-stone-200 text-xs leading-relaxed font-sans shadow-sm">
                            {auditResult.suitability}
                          </div>
                        </div>

                        {/* 2. POTENTIAL VULNERABILITIES (THAGHARAT) */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-stone-400 flex items-center gap-1.5 font-sans">
                            <span className="text-rose-400 text-sm">⚠️</span>
                            أبرز الثغرات القانونية والمخاطر الإجرائية المكتشفة
                          </h4>
                          <div className="grid grid-cols-1 gap-2.5">
                            {auditResult.vulnerabilities.map((v, idx) => (
                              <div key={idx} className="bg-rose-500/5 p-3.5 rounded-xl border border-rose-500/10 text-xs text-rose-300 leading-relaxed font-sans flex gap-2.5 items-start">
                                <span className="text-rose-500 mt-0.5 shrink-0 text-sm">⚡</span>
                                <p className="font-sans">{v}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 3. DEFENSE STRATEGY & RESPONSE */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-stone-400 flex items-center gap-1.5 font-sans">
                            <span className="text-amber-400 text-sm">🎯</span>
                            توجيه المحامي وكيفية التصرف والرد على دفوع الخصم
                          </h4>
                          <div className="grid grid-cols-1 gap-2.5">
                            {auditResult.defenseStrategies.map((d, idx) => (
                              <div key={idx} className="bg-stone-900/50 p-3.5 rounded-xl border border-stone-800 text-stone-200 text-xs leading-relaxed font-sans flex gap-2.5 items-start">
                                <span className="text-amber-400 shrink-0 text-sm">📌</span>
                                <p className="font-sans">{d}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 4. REQUISITE EVIDENCE */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-stone-400 flex items-center gap-1.5 font-sans">
                            <span className="text-cyan-400 text-sm">📋</span>
                            البينات المطلوبة لتعزيز الدعوة وتجنب ردهـا موضوعاً
                          </h4>
                          <div className="grid grid-cols-1 gap-2.5">
                            {auditResult.evidencesNeeded.map((e, idx) => (
                              <div key={idx} className="bg-stone-900/50 p-3.5 rounded-xl border border-stone-800 text-stone-200 text-xs leading-relaxed font-sans flex gap-2.5 items-start">
                                <span className="text-cyan-400 shrink-0 text-sm">🔍</span>
                                <p className="font-sans">{e}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 5. ROADMAP ACTION STEPS */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-stone-400 flex items-center gap-1.5 font-sans">
                            <span className="text-emerald-400 text-sm">📍</span>
                            خريطة الطريق والإجراء القانوني الدقيق خطوة بخطوة
                          </h4>
                          <div className="bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/10 space-y-3">
                            {auditResult.roadmapSteps.map((step, idx) => (
                              <div key={idx} className="flex gap-2 text-xs text-stone-300 font-sans leading-relaxed items-start">
                                <span className="font-mono font-bold text-[10px] bg-emerald-500/10 text-emerald-300 w-5 h-5 rounded border border-emerald-500/20 shrink-0 flex items-center justify-center mt-0.5">
                                  {idx + 1}
                                </span>
                                <p className="font-sans">{step}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>

                      {/* End of report certificate stamp */}
                      <div className="mt-8 pt-4 border-t border-stone-900 flex flex-col sm:flex-row justify-between items-center text-[10px] text-stone-500 gap-4">
                        <span className="text-right font-sans">تحذير مهني: هذا التقرير هو رأي استشاري مستقرأ رقمياً، ولا يعفي الوكيل المؤتمن من دراسة تفاصيل ملفات الدعوى شخصياً.</span>
                        <div className="flex gap-1 bg-stone-900 px-3 py-1.5 rounded-lg border border-stone-800 select-none items-center font-bold text-[9px] text-stone-400">
                          <span className="font-sans">توقيع التدقيق الرقمي:</span>
                          <span className="text-amber-500 font-serif">عدالتي AI</span>
                        </div>
                      </div>

                    </motion.div>
                  )}

                </div>

              </div>
            </motion.div>
          )}

        </main>
      </div>

      {/* Humble Elegant Footer bar */}
      <footer className="border-t border-stone-900 bg-stone-950 px-4 md:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
        <div>
          <span>منصة عدالتي الأردنية • حماية ومساعدة للمحامين المرخصين بالمملكة</span>
        </div>
        <div className="flex gap-4">
          <span>سند نقابة المحامين رقم (11) لعام 1972</span>
          <span>•</span>
          <span>وزارة العدل الأردنية</span>
        </div>
      </footer>

    </div>
  );
}
