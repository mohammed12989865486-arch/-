import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  Printer, 
  Copy, 
  Bookmark, 
  Check, 
  Info, 
  User, 
  Building2, 
  FileCheck, 
  Search, 
  Plus, 
  Trash2, 
  ChevronDown, 
  AlertCircle
} from 'lucide-react';
import { SavedDraft } from '../types';

interface PetitionsTabProps {
  onSaveDraft: (title: string, content: string) => void;
  drafts: SavedDraft[];
}

interface PetitionField {
  id: string;
  label: string;
  placeholder: string;
  type: 'text' | 'number' | 'date';
  defaultValue?: string;
}

interface PetitionTemplate {
  id: string;
  title: string;
  managerTitle: string; // المخاطب الرئيسي في الدائرة (مثال: مدير دائرة أراضي شمال عمان الأكرم)
  description: string;
  fields: PetitionField[];
  generateText: (data: Record<string, string>) => string;
}

interface Department {
  id: string;
  name: string;
  icon: string;
  templates: PetitionTemplate[];
}

export default function PetitionsTab({ onSaveDraft, drafts }: PetitionsTabProps) {
  // Define departments and their corresponding petition templates
  const departments: Department[] = [
    {
      id: 'lands',
      name: 'دائرة الأراضي والمساحة',
      icon: '🏘️',
      templates: [
        {
          id: 'release-mortgage',
          title: 'استدعاء فك رهن عقاري',
          managerTitle: 'عطوفة مدير تسجيل أراضي الموقر',
          description: 'طلب رسمي موجه لمديرية التسجيل لفك الرهن التأميني الموضوع على العقار بعد سداد كامل الدين للدائن المرتهن.',
          fields: [
            { id: 'ownerName', label: 'اسم مالك العقار (المستدعي)', placeholder: 'الاسم الرباعي الكامل للمالك', type: 'text' },
            { id: 'ownerId', label: 'الرقم الوطني للمالك', placeholder: 'مثال: 9980145263', type: 'text' },
            { id: 'bankName', label: 'الجهة الدائنة المرتهنة (البنك / الشخص)', placeholder: 'مثال: البنك العربي ش.م.أ', type: 'text' },
            { id: 'governorate', label: 'المحافظة / المديرية', placeholder: 'مثال: مديرية تسجيل أراضي شمال عمان', type: 'text' },
            { id: 'village', label: 'اسم القرية / المنطقة', placeholder: 'مثال: الجبيهة / عمان', type: 'text' },
            { id: 'basin', label: 'رقم الحوض واسمه', placeholder: 'مثال: حوض 4 أبو عوف', type: 'text' },
            { id: 'plotNo', label: 'رقم قطعة الأرض', placeholder: 'مثال: 1205', type: 'text' },
            { id: 'mortgageNo', label: 'رقم معاملة الرهن وتاريخها', placeholder: 'مثال: رهن رقم 142/2024 تاريخ 12/03/2024', type: 'text' }
          ],
          generateText: (data) => `الموضوع: طلب فك رهن عقاري تأميني

حرر بتاريخ: ${new Date().toLocaleDateString('ar-JO')}

حضر لي وموجه إلى:
${data.managerTitle || 'عطوفة مدير تسجيل أراضي الموقر'}

المستدعي (مالك العقار): ${data.ownerName || '___'}
الرقم الوطني: ${data.ownerId || '___'}
عنوان التبليغ والاستلام: الأردن

تحية طيبة واحتراماً وبعد،،

أعرض لعطوفتكم بأنني أنا المستدعي المذكور أعلاه، مالك لقطعة الأرض رقم (${data.plotNo || '___'}) من حوض (${data.basin || '___'}) في قرية (${data.village || '___'}) التابعة لمديريتكم الموقرة وجدولها الأساسي. 

وحيث أن قطعة الأرض الموصوفة أعلاه كانت مرهونة تأميناً للدين لصالح (الجهة المرتهنة الدائنة): [${data.bankName || '___'}] بموجب معاملة الرهن المسجلة لديكم تحت الرقم [${data.mortgageNo || '___'}].

وحيث أنني قمت بوفاء وسداد كامل قيمة الوفاء المالي والالتزامات المترتبة علي وتخليص ذمة العقار موضوع الرهن، وبما أن الجهة الدائنة قد وافقت على تحرير العقار بموجب كتاب زوال الرقبة التأمينية والفك المرفق طيه صورة عنه؛

لذلك، فإنني ألتمس من عطوفتكم التكرم بالموافقة على إجراء معاملة فك الرهن المالي المرقوم أعلاه، وتسطير كتاب رسمي بهذا الخصوص لتحرير الصحيفة العقارية وسجل الأملاك لقطعة الأرض لتصبح خالية من أي وازنة رهن مالي تأميني، مع وافر التقدير والاحترام والممنونية لعطوفتكم.

وتقبلوا بقبول فائق الاحترام والتقدير،،

مقدم الاستدعاء (المستدعي):
الاسم: ${data.ownerName || '___'} 
التوقيع: _______________`
        },
        {
          id: 'property-statement',
          title: 'طلب كشف أملاك ومثقفات عقارية',
          managerTitle: 'عطوفة مدير دائرة الأراضي والمساحة الأكرم',
          description: 'استدعاء لغايات الحصول على شهادة رسمية بالمنتجات العقارية والأراضي المسجلة باسم المستدعي في المملكة.',
          fields: [
            { id: 'requesterName', label: 'اسم مقدم الطلب الرباعي', placeholder: 'الاسم الكامل للمستعلم', type: 'text' },
            { id: 'requesterId', label: 'الرقم الوطني للأردني / رقم الجواز لغير الأردني', placeholder: 'مثال: 9941020405', type: 'text' },
            { id: 'purpose', label: 'الغرض المقصد من الكشف والشهادة', placeholder: 'مثال: لتقديمه للمحكمة المختصة / لأمور شخصية', type: 'text' }
          ],
          generateText: (data) => `الموضوع: طلب الحصول على كشف بيان ملكية عقاري شامل (الأردن)

التاريخ: ${new Date().toLocaleDateString('ar-JO')}

المرسل إليه:
${data.managerTitle || 'عطوفة مدير دائرة الأراضي والمساحة الأكرم'}

المستدعي: الاسم: ${data.requesterName || '___'}
الرقم الوطني: ${data.requesterId || '___'}
رقم الهاتف الخلوي: _______________

التحية والسلام والتحيات الموقرة لجهودكم وبعد،،

ألتمس من عطوفتكم التفضل بالموافقة والتوجيه للقسم المعني وتسهيل مهمتهم الفنية في تزويدنا بشهادة ببيان الملكية العقارية وكشف أملاك شامل ومحدث (سواء أراضي أو شقق أو أبنية) المسجلة باسمي أنا المستدعي باسمه الصريح والكامل والرقم الوطني المثبتين أعلاه في جميع مكاتب تسجيل الأراضي بالمملكة الأردنية الهاشمية.

وذلك لغايات استخدامها في: [${data.purpose || '___'}].

مرفقاً لعطوفتكم صورة عن الهوية الشخصية الذكية سارية المفعول بالإضافة للرسوم المقررة قانوناً للتسجيل والاستخراج الفوري.

ودمتم سنداً وبناة للوطن تحت ظل الراية الهاشمية المفداة.

واقبلوا فائق الاحترام والامتنان،،

المستدعي:
الاسم: ${data.requesterName || '___'}
التوقيع: _______________`
        }
      ]
    },
    {
      id: 'traffic',
      name: 'إدارة ترخيص السواقين والمركبات',
      icon: '🚗',
      templates: [
        {
          id: 'vehicle-exception-test',
          title: 'طلب فحص فني استثنائي لمركبة',
          managerTitle: 'عطوفة رئيس قسم ترخيص سواقين ومركبات الأكرم',
          description: 'استدعاء لإجراء كشف فحص فني استثنائي للمركبة لتغيير لون، محرك، مواصفات أو إزالة عيب.',
          fields: [
            { id: 'ownerName', label: 'اسم مالك المركبة الكامل', placeholder: 'المستدعي', type: 'text' },
            { id: 'ownerId', label: 'الرقم الوطني للمالك', placeholder: '99...', type: 'text' },
            { id: 'carPlate', label: 'رقم لوحة الترميز والتسجيل للمركبة', placeholder: 'مثال: 12-45896 ترميز 21', type: 'text' },
            { id: 'carMake', label: 'نوع المركبة وطراز تصنيعها', placeholder: 'مثال: تويوتا بريوس لعام 2018', type: 'text' },
            { id: 'requiredChg', label: 'التعديل الفني أو الفحص المطلوب', placeholder: 'مثال: تغيير المحرك الأصلي بمحرك هجين جديد رقم (...) أو تعديل اللون الخارجي للمركبة إلى الرمادي النيزكي', type: 'text' }
          ],
          generateText: (data) => `الموضوع: طلب إجراء فحص فني استثنائي وتثبيت تعديل لمركبة

التاريخ: ${new Date().toLocaleDateString('ar-JO')}

حضر لي ومقدم لـ:
${data.managerTitle || 'عطوفة رئيس قسم ترخيص السواقين والمركبات الأكرم'}

المستدعي (المالك للمركبة): ${data.ownerName || '___'}
الرقم الوطني: ${data.ownerId || '___'}
الهاتف للمتابعة: _______________

تحية طيبة وبعد،،

يرجى إحاطة عطوفتكم علماً بأنني أملك المركبة الأردنية الخصوصية ذات البيان التالي:
• رقم اللوحة والترميز: ${data.carPlate || '___'}
• نوع المركبة وموديلها: ${data.carMake || '___'}
• رقم الشاصي (إن وجد): _____________________

وحيث أنني تشرعت وقمت بإجراء التعديل التقني التالي على هيكل أو خواص المركبة:
[ ${data.requiredChg || '___'} ].

لذا، يرجى التكرم واللطف بالموافقة على تحويلي ومركبتي الموصوفة أعلاه للجنة الفحص الفني والمهندس المختص بالقسم للتأكد من شروط السلامة العامة والمتانة الفنية وتثبيت هذا التعديل أصولاً على قيود وإلكترونيات المركبة ورخصة الاقتناء المعتمدة لتجهيز أوراق تجديد الترخيص.

مرفقاً طيه مستندات شراء المحرك / القطع ورخصة سير المركبة المعتمدة.

شاكراً لعطوفتكم عالي حسن التعاون والخدمة الطيبة،،

مقدم الطلب:
الاسم: ${data.ownerName || '___'}
التوقيع: _______________`
        }
      ]
    },
    {
      id: 'ministry-trade',
      name: 'وزارة الصناعة والتجارة',
      icon: '🏢',
      templates: [
        {
          id: 'register-tradename',
          title: 'طلب حجز اسم تجاري / علامة تجارية',
          managerTitle: 'سعادة مراقب عام الشركات / مسجل الأسماء التجارية المحترم',
          description: 'نموذج طلب حجز اسم تجاري مقترح لمنشأة فردية أو شركة ناشئة وتدقيقه في نظام السجلات الحكومية الأردنية.',
          fields: [
            { id: 'applicantName', label: 'اسم مقدم الطلب (المفوض)', placeholder: 'الاسم الكامل للتاجر أو الوكيل', type: 'text' },
            { id: 'applicantId', label: 'الرقم الوطني لغايات تفعيل الحظر', placeholder: 'مثال: 9941258752', type: 'text' },
            { id: 'proposedNames', label: 'الأسماء التجارية المقترحة بالتسلسل (اسم أول، ثانٍ)', placeholder: 'مثال: 1. شركة الركائز للمقاولات 2. شركة سكنى للإعمار والتشييد', type: 'text' },
            { id: 'activityType', label: 'نوع النشاط الاقتصادي والمحاور', placeholder: 'مثال: تجارة المواد الإنشائية وإعداد التعهدات العامة المقررة', type: 'text' }
          ],
          generateText: (data) => `الموضوع: استدعاء طلب حجز اسم تجاري / علامة تجارية مستعجل

التاريخ: ${new Date().toLocaleDateString('ar-JO')}

الجهة المخاطبة:
${data.managerTitle || 'سعادة مسجل الأسماء التجارية / مراقب الشركات الأكرم'}

المستدعي (التاجر): ${data.applicantName || '___'}
الرقم الوطني: ${data.applicantId || '___'}
العنوان المقترح للمؤسسة: الأردن

تحية طيبة وبعد،،

ألتمس من سعادتكم التكرم بالموافقة على تدقيق وحجز الاسم التجاري المقترح لأعمال مؤسستي الكائنة في المملكة الأردنية الهاشمية والتي ستمارس أعمالها في قطاع ونشاط:
[ ${data.activityType || '___'} ].

وحيث أرغب بتدقيق وحجز أحد الأسماء التجارية التالية بالتسلسل لعدم التعارض مع أسماء تجارية مسجلة مسبقاً لدى وزارتكم الموقرة:
1. الاسم التجاري الأول المقترح: [ ${data.proposedNames || '___'} ]

لذلك، يرجى إجراء الفحص المعياري والتأكد من خلوه من أي موانع تسجيل أو تشابه قد يربك المستهلك، والموافقة على حجز الاسم لصالحي واستصدار شهادة تسجيل ترخيص رسمية بالاسم الموثق بعد استيفاء الرسوم المالية والتأمينات المطلوبة.

واقبلوا فائق التقدير لخدمة الاقتصاد الوطني الحثيث،،

مقدم الاستدعاء:
الاسم: ${data.applicantName || '___'}
الهاتف: _______________
التوقيع: _______________`
        }
      ]
    },
    {
      id: 'security-interior',
      name: 'الأمن العام والحكام الإداريين والمحافظين',
      icon: '👮',
      templates: [
        {
          id: 'stay-warrant',
          title: 'استدعاء كف طلب أمني لتسوية قضية',
          managerTitle: 'عطوفة مدير شرطة الأردني الأكرم / رئيس مركز أمني المحترم',
          description: 'طلب كف طلب ملاحقة أمنية بسبب وجود مصالحة، قضية قضاء، أو تسوية حقوقية مالية سابقة.',
          fields: [
            { id: 'defendantName', label: 'اسم الشخص المطلوب ذي الشأن', placeholder: 'الاسم الرباعي الكامل للمطلوب', type: 'text' },
            { id: 'nationalId', label: 'الرقم الوطني للموقوف أو المطلوب', placeholder: 'مثال: 9901452631', type: 'text' },
            { id: 'caseReference', label: 'رقم القضية أو رقم التنفيذ الأساسي', placeholder: 'مثال: القضية التنفيذية رقم 1447/2023 لدى محكمة تنفيذ عمان', type: 'text' },
            { id: 'reason', label: 'السبب المؤيد لكف الطلب (التسجيل أو المصالحة)', placeholder: 'مثال: سداد قيمة القضية بالكامل وصدور قرار بوقف التنفيذ من قاضي التنفيذ الموقر بموجب قرار الحرية والحفظ المرفق', type: 'text' }
          ],
          generateText: (data) => `الموضوع: طلب إجراء كف طلب وملاحقة أمنية فورية

التاريخ الإجرائي للأردن: ${new Date().toLocaleDateString('ar-JO')}

حضر لي ومقدم إلى:
${data.managerTitle || 'عطوفة رئيس المركز الأمني وعطوفة مدير مديرية الشرطة المحترم'}

المستدعي (صاحب العلاقة أو وكيله القانوني بموجب توكيل رسمي):
الاسم: ${data.defendantName || '___'}
الرقم الوطني: ${data.nationalId || '___'}

تحية طيبة وبعد،،

نعرض لتفضلكم الكريم بأنني أنا المستدعي المذكور، مدرج تحت طلب التعميم الأمني أو الملاحقة القضائية بموجب قيودكم وقواعد التحرير الأمني على خلفية القضية / الموضوع ذو الرقم والتوصيف:
[ ${data.caseReference || '___'} ]

ونحيط كريم اهتمام عطوفتكم بأن القضية موضوع التعميم قد تم حلها وتسويتها بالكامل زوالاً للالتزامات المترتبة، للأسباب والبيان التالي:
[ ${data.reason || '___'} ].

وحيث يرفق المستدعي لعطوفتكم بالملف صورة مصدقة عن قرار زوال ملاحقة / إسقاط دعوى / وقف تنفيذ فوري صادر رسمياً عن القضاء ونقابة المحامين وأجهزة التبليغ القضائي الأردنية.

لذا، فإنني ألتمس من تفضلكم وسعة صدركم التوجيه لمن يلزم في قسم التنفيذ القضائي وأقسام تكنولوجيا المعلومات والاتصالات وإلقاء القبض، بإجراء كف الطلب ورفع هذا التعميم الأمني نهائياً عن اسمي وسجلي المدني والأمني الحساس بما يضمن حقي الدستوري بالتنقل الطبيعي والحر بلا مضايقات.

مرفقاً لعطوفتكم صورة القرار المستعجل والصفحة الشخصية للمستدعي.

ودمتم برعاية المولى وحفظ الوطن آمناً مطمئناً،،

المستدعي للحل والكف الأمني:
الاسم: ${data.defendantName || '___'}
الهاتف للتواصل: _______________
التوقيع: _______________`
        },
        {
          id: 'admin-governor-bail',
          title: 'طلب تكفيل وإخلاء سبيل لدى الحاكم الإداري',
          managerTitle: 'عطوفة محافظ البلقاء الأكرم / عطوفة متصرف المحترم',
          description: 'استدعاء لتقديم كفالة عدلية أو شخصية وإخلاء سبيل موقوف إدارياً بموجب قانون منع الجرائم الأردني.',
          fields: [
            { id: 'arresteeName', label: 'اسم الموقوف إدارياً الكامل', placeholder: 'اسم الشخص المطلوب إخلاء سبيله', type: 'text' },
            { id: 'sponsorName', label: 'اسم الكفيل الضامن الكامل', placeholder: 'الاسم الرباعي للكفيل الملتزم', type: 'text' },
            { id: 'governorate', label: 'اسم المحافظة أو المتصرفية المختصة', placeholder: 'مثال: عطوفة محافظ العاصمة عمان الأكرم', type: 'text' },
            { id: 'bailType', label: 'نوع الكفالة المقترحة ومقدارها', placeholder: 'مثال: كفالة عدلية بنكية أو عقارية بقيمة 5000 دينار تفيد بالتزامه بحسن السلوك وعدم زعزعة الأمن', type: 'text' }
          ],
          generateText: (data) => `الموضوع: طلب كفالة مكرر للموافقة على إخلاء سبيل موقوف إدارياً 

التاريخ لغايات المراجعة: ${new Date().toLocaleDateString('ar-JO')}

حضر لي وموجه إلى:
${data.managerTitle || 'عطوفة محافظ العاصمة الأكرم / عطوفة المتصرف المحترم'}

المستدعي (الكفيل الضام أو المستدعي): ${data.sponsorName || '___'}
رقم تواصل الكفيل: _______________
الأردني لملاحقة السجلات

بيانات الموقوف المراد تكفيله:
الاسم: ${data.arresteeName || '___'}
الموقوف حالياً إدارياً بموجب الصلاحيات والتحقيقات الإدارية في سجن / مركز التوقيف المؤقت.

التحية والاحترام والتقدير لخدمتك الأهلية وبعد،،

ألتمس من عطوفتكم التكرم بلطف وعناية الأبوة الإدارية والرحمة الواسعة بالموافقة على إخلاء سبيل الموقوف أعلاه بكفالة عدلية أو كفالة شخصية ضامنة يلتزم فيها بالانصياع التام وضمان حسن سلوكه وإبقائه رهن إشارتكم القضائية والإدارية في أي وقت وحال.

وأنا بصفتي كفيلاً وضامناً له، وهو الكفيل: [ ${data.sponsorName || '___'} ]، أتعهد طوعاً للمحافظة والمتصرفية بتقديم:
[ ${data.bailType || '___'} ] 
والتوقيع على صك الالتزام والضمان المادي والعدلي الفوري وسداد المعاملات الضريبية للتكفيل.

إن الموقوف يتعهد أمامكم بمواصلة الالتزام بالقواعد والقانون وعدم الاخلال بالنظام العام بالأردن مستقبلاً.

لذا ألتمس بطلب مستعجل التكرم بالأمر واللطف لإخلاء سبيله المباشر طوع كفالتنا والتوقيع والافراج عنه.

ولكم منا وافر الاحترام والامتنان وعظيم التبجيل،،

المستدعي الكفيل الملتزم:
الاسم: ${data.sponsorName || '___'}
التوقيع: _______________`
        }
      ]
    },
    {
      id: 'tax-dept',
      name: 'دائرة ضريبة الدخل والمبيعات',
      icon: '💵',
      templates: [
        {
          id: 'tax-clearance',
          title: 'طلب براءة ذمة ضريبية مستعجلة',
          managerTitle: 'سعادة مدير عام دائرة ضريبة الدخل والمبيعات الأكرم',
          description: 'استدعاء للحصول على براءة ذمة مالية ضريبية لغايات تجديد بطاقة مستورد، بيع أموال غير منقولة، أو السفر.',
          fields: [
            { id: 'taxpayerName', label: 'اسم المكلف (فرد أو شركة)', placeholder: 'مثال: شركة الرائد البرمجية أو اسم المواطن الرباعي', type: 'text' },
            { id: 'taxId', label: 'الرقم الضريبي أو الرقم الوطني للمكلف', placeholder: 'الرقم الوطني للمكلف / الرقم الجمركي', type: 'text' },
            { id: 'clearanceReason', label: 'الغرض التفصيلي لطلب براءة الذمة', placeholder: 'مثال: لغايات استكمال إجراءات تصفية ونقل ملكية شركة أو لغايات التصدير الخارجي والجمارك بالبلاد', type: 'text' }
          ],
          generateText: (data) => `الموضوع: طلب استصدار شهادة براءة ذمة ضريبية مستعجلة (الأردن)

التاريخ الضريبي الفوري: ${new Date().toLocaleDateString('ar-JO')}

الجهة المستقبلة للطلب:
${data.managerTitle || 'سعادة مدير عام دائرة ضريبة الدخل والمبيعات الأكرم'}

المكلف المستدعي: ${data.taxpayerName || '___'}
الرقم الضريبي / الوطني الشامل: ${data.taxId || '___'}
عنوان النشاط أو السكن: الأردن

تحية طيبة واعتزازاً بجهودكم الموقرة وبعد،،

بموجب أحكام قانون ضريبة الدخل وقانون ضريبة العامة على المبيعات بوزارة المالية الأردنية وتعديلاتهما، ألتمس من سعادتكم التكرم بالموافقة الفورية على تزويدي بشهادة براءة ذمة ضريبية نهائية ومبرأة عن السنة المالية السابقة والسنوات المنصرمة، وتسطير ذلك على النظام والملف الفردي التابع لشركتنا أو لشخصي أنا المكلف: [${data.taxpayerName || '___'}] وله ملف ضريبي مسجل تحت القيود المذكورة.

حيث أن هذه الشهادة وبراءة الذمة مطلوبة بشكل ضروري وحاسم لتقديمه إلى الكاتب العدل أو دائرة الأراضي أو الهيئات الجمركية لغايات أساسية هي:
[ ${data.clearanceReason || '___'} ].

وحيث قمنا بتقديم كافة الإقرارات الضريبية الدورية بالوقت القانوني وقيد السداد بالملفات الإلكترونية للوزارة ولا يوجد أي متأخرات قانونية عالقة أو تستلزم غرامات تأخر.

لذلك، ألتمس التوجيه الكريم للمدقق المالي للملف لاستكمال المعاملة الفنية وشطب المديونية الإدارية إن وجدت لطباعة الشهادة الرسمية الفورية.

وتفضلوا بقبول عالي التقدير والاحترام وبوركت جهودكم الطبية،،

المكلف المستدعي للذمة:
الاسم: ${data.taxpayerName || '___'}
التوقيع: _______________`
        }
      ]
    },
    {
      id: 'municipalities',
      name: 'أمانة عمان الكبرى والبلديات',
      icon: '🏛️',
      templates: [
        {
          id: 'traffic-fine-object',
          title: 'الاعتراض على مخالفات السير أو البلديات',
          managerTitle: 'سعادة قاضي محكمة بلدية/أمانة عمان الموقر',
          description: 'استدعاء لغايات تخفيض أو الاعتراض على مخالفات السير المتراكمة أو مخالفات الأبنية والصحة العامة.',
          fields: [
            { id: 'driverName', label: 'اسم معترض المركبة (المستدعي)', placeholder: 'الاسم الرباعي الكامل لسائق أو مالك السيارة', type: 'text' },
            { id: 'driverId', label: 'الرقم الوطني للمشتكي', placeholder: 'مثال: 9951234567', type: 'text' },
            { id: 'carPlate', label: 'رقم لوحة السيارة ونوعها وتفاصيلها', placeholder: 'مثال: 10-67540 هونداي أفانتي', type: 'text' },
            { id: 'objectionReason', label: 'سبب الاعتراض والملتمسات التبريرية', placeholder: 'مثال: تراكم المخالفات الغيابية والوقوف الممنوع بدون تبلغه بها مسبقاً، ولظروف مادية صعبة وقاهرة تمنع السداد المرتفع', type: 'text' }
          ],
          generateText: (data) => `الموضوع: طلب تدقيق واعتراض لتخفيض مخالفات السير الكثيفة بمدينة عمان والبلدية

التاريخ المحدد: ${new Date().toLocaleDateString('ar-JO')}

حضر لي وعرض أمام:
${data.managerTitle || 'سعادة قاضي محكمة أمانة عمان / محكمة البلدية الموقر'}

امستدعي الاعتراض: الاسم: ${data.driverName || '___'}
الرقم الوطني: ${data.driverId || '___'}
المالك للمركبة رقم: ${data.carPlate || '___'}

السلام عليكم ورحمة الله وبركاته وبعد،،

أتشرف بعرض هذا الاستدعاء والاعتراض الإنساني أمام عدالتكم الموقرة وصدر محكمتكم الرحب، حيث أنني ترتبت علي مبالغ وغرامات مالية باهظة جداً جراء تراكم مخالفات كاميرات السير ومخالفات الوقوف الغيابية المقررة على سيارتي ذات الرقم المرقوم ورخصتها المعتمدة.

وحيث أن تراكم هذه المخالفات قد تم بغيابي ودون إرادة صريحة للخرق العمد، وبما أن الظروف المادية والقدرات الاقتصادية والمعيشية التي يمر بها المستدعي ومسؤوليته العائلية تشكل عبئاً قاهراً يستوجب طلب الرأفة القضائية والإدارية المعهودة بصرح عدالتكم:
[ ${data.objectionReason || '___'} ].

لذا، فإنني ألتمس من الهيئة الموقرة والمجلس والبلدي التكرم بالنظر بعناية اللين والموافقة على تدقيق كشف المخالفات المرفق طيه وإعفائي وتنزيل وتخفيض هذه الغرامات المرقومة للحد الأدنى الممكن والرحيم قانوناً ليتسنى لي سدادها والتمكن من ترخيص وتجديد صلاحية المركبة أصولاً بالمرور.

مرفقاً لعطوفتكم كشف تفصيلي بمخالفات السير وصورة عن هوية المالك.

ودمتم في رعاية الباري وحفظه ركائز صلبة للعدالة الأردنية،،

المعترض المستدعي:
الاسم: ${data.driverName || '___'}
التوقيع: _______________`
        }
      ]
    },
    {
      id: 'sharia',
      name: 'المحاكم الشرعية ومستشاري الأسرة',
      icon: '🕌',
      templates: [
        {
          id: 'limitation-heirship',
          title: 'طلب حصر ورثة واستصدار حجة إرث',
          managerTitle: 'فضيلة قاضي صلح محكمة عمان الشرعية الموقر',
          description: 'استدعاء رسمي شرعي لغايات حصر إرث متوفى واستخراج حجة الإرث الشرعية للورثة بالتنسيق مع الكاتب العدل الشرعي.',
          fields: [
            { id: 'requesterName', label: 'اسم مقدم الطلب (أحد الورثة)', placeholder: 'الاسم الكامل للابن أو البنت أو الزوجة', type: 'text' },
            { id: 'requesterId', label: 'الرقم الوطني للمستدعي الوريث', placeholder: 'مثال: 9912045610', type: 'text' },
            { id: 'deceasedName', label: 'اسم المتوفى (المورث) الكامل', placeholder: 'الاسم الرباعي للشخص المتوفى', type: 'text' },
            { id: 'deathDate', label: 'تاريخ الوفاة الموثق في شهادة الأحوال', placeholder: 'مثال: 15/11/2025', type: 'text' },
            { id: 'heirsDetails', label: 'بيانات الورثة ومكانهما الشرعي', placeholder: 'مثال: زوجته حصة، وأبناؤه البالغين محمد وسعيد، وبناته هدى الكبار، مع الإقرار بعدم وجود حمل مستكن', type: 'text' }
          ],
          generateText: (data) => `الموضوع: استدعاء طلب حصر تركة وإصدار حجة إرث شرعية

التاريخ الشرعي: ${new Date().toLocaleDateString('ar-JO')}

حضر لي ويقدم لـ:
${data.managerTitle || 'فضيلة قاضي محكمة عمان الشرعية للمنطقة الموقر'}

المستدعي (طالب حجة الإرث): ${data.requesterName || '___'}
الرقم الوطني: ${data.requesterId || '___'}
القرابة للمتوفى: _____________________

السلام عليكم ورحمة الله وبركاته، وفضيلتكم بدوام الصحة والعافية وبعد،،

أعرض لفضيلتكم الموقرة بأنه قد توفي إلى رحمة الله وعفوه تعالى المورث المرحوم:
[ ${data.deceasedName || '___'} ] 
والذي وافته المنية وانتقل لجوار ربه بتاريخ وفاة رسمي هو: [ ${data.deathDate || '___'} ].

وحيث انحصر إرثه الشرعي بكامل ورثته الشرعيين، وهم طبقاً لمعلوماتنا وخبر مستشفيات الأحوال المدنية بالأردن:
[ ${data.heirsDetails || '___'} ] 
ولا شريك بالتركة ولا حاجب معهم غير المذكورين، ولا يوجد حمل مستكن في رحم زوجته حتى تاريخه.

وحيث يتطلب إجراء معاملات البنوك، وصحيفة الأراضي والمستندات ونقل ملكية المركبات والرواتب التقاعدية وجود حجة إرث رسمية صادرة بالتصنيف الشرعي العادل لمنع تفاقم الخلافات بين الورثة.

لذلك، ألتمس من فضيلتكم التكرم بلطف وعناية قضاء المحكم الشرعي بطلب إحالة استدعائنا لقسم الكاتب العدل والشهود لاستماع الأقوال الشرعية المعتمدة لورود الحق والعدل، وتثبيت وتدوير وصياغة حجة حصر الإرث أصولاً بعد سداد واستيفاء الرسوم المالية الواجب صياغتها.

ودمتم في خدمة الشريعة الغراء والقضاء الإسلامي العادل،،

المستدعي:
الاسم: ${data.requesterName || '___'}
التوقيع: _______________`
        }
      ]
    }
  ];

  // UI Active states
  const [selectedDeptId, setSelectedDeptId] = useState<string>('lands');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('release-mortgage');
  const [fieldsData, setFieldsData] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Document interaction text
  const [generatedText, setGeneratedText] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isEditingManually, setIsEditingManually] = useState<boolean>(false);
  const [manualText, setManualText] = useState<string>('');

  // Get active configurations
  const currentDept = departments.find(d => d.id === selectedDeptId) || departments[0];
  const currentTemplate = currentDept.templates.find(t => t.id === selectedTemplateId) || currentDept.templates[0] || departments[0].templates[0];

  // Filter templates on query
  const filteredDepartments = departments.map(dept => {
    const matchedTemplates = dept.templates.filter(t => 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...dept, templates: matchedTemplates };
  }).filter(dept => dept.templates.length > 0);

  // Default initial fields when template changes
  useEffect(() => {
    if (currentTemplate) {
      const initial: Record<string, string> = {};
      currentTemplate.fields.forEach(f => {
        initial[f.id] = f.defaultValue || '';
      });
      // also set managerTitle
      initial['managerTitle'] = currentTemplate.managerTitle;
      setFieldsData(initial);
      setIsEditingManually(false);
    }
  }, [selectedDeptId, selectedTemplateId]);

  // Handle dynamic document generation
  useEffect(() => {
    if (currentTemplate && !isEditingManually) {
      const text = currentTemplate.generateText(fieldsData);
      setGeneratedText(text);
    }
  }, [fieldsData, currentTemplate, isEditingManually]);

  const handleFieldChange = (fieldId: string, value: string) => {
    setFieldsData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleCopy = () => {
    const textToCopy = isEditingManually ? manualText : generatedText;
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handlePrint = () => {
    const textToPrint = isEditingManually ? manualText : generatedText;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('يرجى السماح بالنوافذ المنبثقة لفتح نموذج طباعة الاستدعاء.');
      return;
    }
    printWindow.document.write(`
      <html>
        <head>
          <title>نموذج استدعاء رسمي - الأردن</title>
          <style>
            body {
              font-family: 'Times New Roman', Times, serif, Arial;
              direction: rtl;
              padding: 50px;
              line-height: 1.8;
              font-size: 16px;
              color: #111;
            }
            .header {
              text-align: center;
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 30px;
              border-bottom: 2px solid #555;
              padding-bottom: 12px;
            }
            pre {
              white-space: pre-wrap;
              word-wrap: break-word;
              text-align: justify;
              font-family: 'Times New Roman', Times, serif;
              font-size: 15px;
            }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div class="header">المملكة الأردنية الهاشمية<br>طلب واستدعاء رسمي موجه للدوائر الحكومية</div>
          <pre>${textToPrint}</pre>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleSave = () => {
    const finalContent = isEditingManually ? manualText : generatedText;
    const title = `استدعاء: ${currentTemplate.title} - ${fieldsData['ownerName'] || fieldsData['requesterName'] || fieldsData['applicantName'] || fieldsData['driverName'] || 'مقدم الطلب'}`;
    onSaveDraft(title, finalContent);
    alert('تم حفظ نموذج الاستدعاء المجهز بنجاح في مسوداتك المتاحة بالقائمة!');
  };

  const startManualEdit = () => {
    setManualText(generatedText);
    setIsEditingManually(true);
  };

  const stopManualEdit = () => {
    if (confirm('تنبيه: سيتسبب العودة للصياغة التلقائية بفقدان التعديلات اليدوية المباشرة التي قمت بكتابتها. هل ترغب بالاستمرار؟')) {
      setIsEditingManually(false);
    }
  };

  return (
    <div className="space-y-6 text-right" id="petitions-tab-container">
      
      {/* Dynamic Header Badge Layout */}
      <div className="bg-gradient-to-l from-amber-500/10 via-stone-900/45 to-stone-950 p-6 rounded-2xl border border-amber-500/15">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-amber-400 mb-1.5 flex items-center gap-2">
              <Building2 size={22} className="text-amber-400" />
              نماذج الاستدعاءات الرسمية لجميع الدوائر الحكومية الأردنية
            </h3>
            <p className="text-stone-400 text-xs leading-relaxed max-w-4xl">
              منظومة إعداد وتوليد نماذج الاستدعاءات والاستعلام وتنسيق المعاملات لدى الدوائر الرسمية كالترخيص، والأراضي، والبلديات، والأمن العام، وضريبة الدخل والمحاكم الشرعية صياغة قانونية سليمة وموافقة للمراسيم الملكية السائدة.
            </p>
          </div>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-amber-500 text-stone-950 text-xs font-bold rounded-xl hover:bg-amber-400 transition-all flex items-center gap-2 cursor-pointer shrink-0 self-start md:self-auto"
          >
            <Bookmark size={15} />
            حفظ الاستدعاء كمسودة
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* RIGHT COLUMN: Search + Select + Specific Fields */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* 1. Quick Search and Select Chamber */}
          <div className="bg-stone-950/40 border border-stone-900 p-5 rounded-2xl space-y-4">
            <h4 className="text-sm font-bold text-stone-200 flex items-center gap-2">
              <Building2 size={16} className="text-amber-400" />
              اختر الدائرة الحكومية والنموذج
            </h4>
            
            {/* Search Input Box */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن دائرة أو نموذج استدعاء..."
                className="w-full bg-stone-900 text-stone-200 border border-stone-800 rounded-xl py-2 px-3 pr-9 text-xs focus:outline-none focus:border-amber-500"
              />
              <Search size={14} className="absolute right-3 top-3 text-stone-500" />
            </div>

            {/* Department List Boxes */}
            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
              {(searchQuery ? filteredDepartments : departments).map((dept) => {
                const isSelected = selectedDeptId === dept.id;
                return (
                  <button
                    key={dept.id}
                    onClick={() => {
                      setSelectedDeptId(dept.id);
                      if (dept.templates.length > 0) {
                        setSelectedTemplateId(dept.templates[0].id);
                      }
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-right text-xs transition-all border ${
                      isSelected 
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 font-bold' 
                        : 'bg-stone-900/30 text-stone-400 border-transparent hover:bg-stone-900/60 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{dept.icon}</span>
                      <span>{dept.name}</span>
                    </div>
                    <span className="text-[10px] bg-stone-800 text-stone-500 px-2 py-0.5 rounded-full border border-stone-800 font-bold">
                      {dept.templates.length} سياق
                    </span>
                  </button>
                );
              })}
              {filteredDepartments.length === 0 && (
                <div className="text-xs text-stone-500 text-center py-4">لا توجد نتائج بحث متوافقة!</div>
              )}
            </div>

            {/* Selected department templates */}
            {currentDept && currentDept.templates.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-stone-900">
                <label className="block text-stone-400 text-[11px] mb-1 font-semibold">نماذج ومقاصد الاستدعاءات المتوفرة:</label>
                <div className="grid grid-cols-1 gap-1.5">
                  {currentDept.templates.map((tpl) => {
                    const isSelected = selectedTemplateId === tpl.id;
                    return (
                      <button
                        key={tpl.id}
                        onClick={() => setSelectedTemplateId(tpl.id)}
                        className={`w-full p-2.5 rounded-xl text-right text-xs transition-all border ${
                          isSelected
                            ? 'bg-stone-900 text-amber-400 border-amber-500/25 font-bold shadow-md'
                            : 'bg-stone-950/50 text-stone-400 border-stone-900 hover:bg-stone-900/35 hover:text-stone-200'
                        }`}
                      >
                        <div className="font-semibold mb-0.5 flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-amber-400' : 'bg-stone-600'}`} />
                          {tpl.title}
                        </div>
                        <p className="text-[10px] text-stone-500 font-normal truncate">{tpl.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 2. Intelligent Dynamic Input Form Section */}
          {currentTemplate && (
            <div className="bg-stone-950/40 border border-stone-900 p-5 rounded-2xl space-y-4">
              <h4 className="text-sm font-bold text-amber-400 border-b border-stone-900 pb-2 flex items-center justify-between">
                <span>البيانات المراد ملؤها بالاستدعاء</span>
                <span className="text-[10px] bg-stone-900 text-stone-400 px-2 py-0.5 rounded-full font-normal">نموذج ذكي</span>
              </h4>

              <div className="space-y-3.5 text-xs">
                {/* Always customizable: Official manager or recipient */}
                <div>
                  <label className="block text-stone-400 mb-1 font-semibold">الجهة / الموجه إليه الاستدعاء (إخلاء المسؤولية الرسمي)</label>
                  <input
                    type="text"
                    value={fieldsData['managerTitle'] || ''}
                    onChange={(e) => handleFieldChange('managerTitle', e.target.value)}
                    className="w-full bg-stone-900 text-white border border-stone-800 rounded-xl py-2 px-3 focus:outline-none focus:border-amber-500 font-bold text-xs"
                    placeholder="عطوفة مدير..."
                  />
                </div>

                {/* Dynamically Map Template Fields */}
                {currentTemplate.fields.map((f) => (
                  <div key={f.id}>
                    <label className="block text-stone-300 mb-1">{f.label}</label>
                    <input
                      type={f.type}
                      value={fieldsData[f.id] || ''}
                      onChange={(e) => handleFieldChange(f.id, e.target.value)}
                      className="w-full bg-stone-900 text-white border border-stone-800 rounded-xl py-2 px-3 focus:outline-none focus:border-amber-500 text-xs"
                      placeholder={f.placeholder}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Special Official Warning Guidelines */}
          <div className="bg-stone-900/30 border border-stone-850 p-4 rounded-xl flex items-start gap-2.5">
            <AlertCircle size={16} className="text-amber-500/80 shrink-0 mt-0.5" />
            <div className="text-[10px] text-stone-400 leading-relaxed">
              <strong>هام لمعاملات الدوائر الرسمية:</strong> يتوجب دائماً إلصاق طوابع واردات وطوابع نقابة محامين نظاميين وطوابع مجهود حربي (في حال التقديم للمحاكم أو البلديات) بموجب قانون رسوم طوابع الواردات الأردني لعام 1952، وتأكد من اصطحاب وثيقة الأحوال المدنية الذكية وهوية تبليغ إلكتروني سند.
            </div>
          </div>

        </div>

        {/* LEFT COLUMN: Smart Template Sheet Preview with vintage design */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Action Toolbar buttons */}
          <div className="bg-stone-950/45 border border-stone-900 p-3 rounded-xl flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-xs text-stone-300 font-bold">صيغة الاستدعاء المعتمدة</span>
            </div>

            <div className="flex items-center gap-2">
              {isEditingManually ? (
                <button
                  onClick={stopManualEdit}
                  className="px-3 py-1 bg-stone-850 border border-stone-700 text-stone-300 hover:text-white rounded-lg text-xs font-bold cursor-pointer transition-all"
                >
                  الرجوع للصياغة الآلية
                </button>
              ) : (
                <button
                  onClick={startManualEdit}
                  className="px-3 py-1 bg-stone-900 border border-stone-800 text-amber-400 hover:bg-amber-500/10 rounded-lg text-xs font-bold cursor-pointer transition-all"
                >
                  عدل العقد يدوياً
                </button>
              )}

              <button
                onClick={handleCopy}
                className="px-3 py-1 bg-stone-900 hover:bg-stone-850 border border-stone-800 text-stone-300 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              >
                {isCopied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                {isCopied ? 'تم النسخ' : 'نسخ الاستدعاء'}
              </button>

              <button
                onClick={handlePrint}
                className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-stone-950 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              >
                <Printer size={12} />
                طباعة أوتوماتيكية
              </button>
            </div>
          </div>

          {/* Actual Government petition Paper representation */}
          <div className="relative bg-white text-stone-900 border border-stone-200 shadow-2xl rounded-2xl p-6 md:p-10 font-sans leading-relaxed text-right min-h-[640px] flex flex-col justify-between selection:bg-amber-100 selection:text-amber-900 select-text" style={{ direction: 'rtl' }}>
            
            {/* Elegant official watermarks borders */}
            <div className="absolute top-3 left-3 right-3 bottom-3 border border-stone-200 pointer-events-none rounded-xl" />
            <div className="absolute top-5 left-5 right-5 bottom-5 border-2 border-double border-stone-100 pointer-events-none rounded-lg" />
            
            {/* Main content z-index wrapper */}
            <div className="relative z-10">
              
              {/* Jordanian Top Banner styled text */}
              <div className="text-center pb-5 mb-5 border-b border-stone-200/80">
                <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">جامعة الدول العربية • ديوان المظالم والمعاملات الحكومية</p>
                <h3 className="text-base font-extrabold text-stone-900 tracking-wide mt-1">المملكة الأردنية الهاشمية</h3>
                <div className="text-[9px] text-stone-500 mt-0.5">طلب رسمي موجه لدوائر الاختصاص والخدمة العامة</div>
              </div>

              {/* Dynamic generated input text area or text container */}
              {isEditingManually ? (
                <div className="relative mt-2">
                  <span className="absolute left-2.5 top-2.5 bg-red-100 text-red-800 font-bold text-[9px] px-1.5 py-0.5 rounded border border-red-200 uppercase">محرر التخصيص اليدوي</span>
                  <textarea
                    value={manualText}
                    onChange={(e) => setManualText(e.target.value)}
                    rows={22}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-4 font-mono text-xs md:text-sm text-stone-855 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    placeholder="تعديل محتوى نموذج المذكرة الحكومية هنا..."
                  />
                </div>
              ) : (
                <pre className="font-sans text-xs md:text-sm text-stone-800 whitespace-pre-wrap text-justify leading-relaxed tracking-wide select-text mt-4">
                  {generatedText}
                </pre>
              )}

            </div>

            {/* Official Footer of the document */}
            <div className="relative z-10 border-t border-stone-200 mt-8 pt-4 flex flex-col md:flex-row justify-between text-[10px] text-stone-400 gap-2">
              <span className="flex items-center gap-1 font-mono">
                كود المطابقة الوطني: ADN-7485-JOR-PET
              </span>
              <span>وزارة الاقتصاد الرقمي والريادة - عدالتي © 2026</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
