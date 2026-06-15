/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AgencyField {
  id: string;
  label: string;
  placeholder: string;
  type: 'text' | 'number' | 'date';
  required?: boolean;
}

export interface AgencyTemplate {
  id: string;
  title: string;
  description: string;
  category: 'general' | 'special' | 'lands' | 'sharia';
  fields: AgencyField[];
  generateText: (fieldsData: Record<string, string>) => string;
}

export interface LawSection {
  id: string;
  title: string;
  subtitle?: string;
  articles: {
    number: string;
    text: string;
    notes?: string;
  }[];
}

export interface JordanianLaw {
  id: string;
  title: string;
  category: 'civil' | 'penal' | 'procedure' | 'bar' | 'sharia' | 'corporate';
  description: string;
  year: string;
  sections: LawSection[];
}

export interface LawsuitTemplate {
  id: string;
  title: string;
  category?: 'civil' | 'penal'; // مدني أو جزائي
  courtType: string; // صلح حقوق، بداية حقوق، محكمة أمن الدولة، إلخ
  plaintiffType: string; // المدعي
  defendantType: string; // المدعى عليه
  subject: string; // موضوع الدعوى
  facts: string[]; // وقائع الدعوى الأساسية
  requests: string[]; // الطلبات النهائية
  fields: { id: string; label: string; placeholder: string }[];
  generateDraft: (fieldsData: Record<string, string>) => string;
}

export interface CourtJudge {
  name: string;
  role: string; // مثل رئيس المحكمة، عضو هيئة استئنافية، قاضي صلح
  specialization: string; // مثل مدني، جزائي، تنفيذ، مستعجل
}

export interface CourtDivision {
  name: string; // مثل محكمة صلح الحقوق، محكمة بداية الجزاء، دائرة التنفيذ
  specialization: string; // مدني، جزائي، تنفيذي، إيجارات
  judges: CourtJudge[];
}

export interface CourtJurisdiction {
  id: string;
  courtName: string;
  region: 'central' | 'northern' | 'southern'; // إقليم الوسط، الشمال، الجنوب
  governorate: string; // المحافظة
  mainLocation: string; // موقع المحكمة
  subRegions: string[]; // المناطق والأحياء التابعة لها
  contactInfo?: string;
  workingHours?: string;
  divisions?: CourtDivision[];
}

export interface LegalDuration {
  id: string;
  title: string;
  duration: string;
  basis: string; // السند القانوني
  notes: string;
}

export interface RegistrationStage {
  id: string;
  stageNo: number;
  title: string;
  location: string;
  procedures: string[];
  documents: string[];
  fees: string;
  professionalTip: string;
}

export interface CaseRegistrationPathway {
  id: 'civil' | 'penal';
  title: string;
  description: string;
  generalJurisdiction: string;
  stages: RegistrationStage[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface SavedDraft {
  id: string;
  title: string;
  type: 'agency' | 'suit' | 'custom' | 'petition' | 'contract';
  content: string;
  createdAt: string;
}
