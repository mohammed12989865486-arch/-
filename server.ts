/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for AI Jordan Legal Assistant
  app.post('/api/gemini/chat', async (req, res) => {
    try {
      const { message, history } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        return res.status(400).json({
          error: 'API_KEY_MISSING',
          message: 'مفتاح OpenAI / Gemini API غير مفعّل. يرجى تهيئته عبر إعدادات المنصة (Secrets Panel) لتفعيل المساعد الذكي.'
        });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const systemInstruction = `أنت "عدالتي AI" - المساعد القانوني والذكي للأستاذ المحامي في المملكة الأردنية الهاشمية.
اختصاصك الحصري هو مساعدة المحامين المرخصين والممارسين في الأردن في الأمور التالية:
1. القانون المدني الأردني والمسائل الحقوقية والعقود وسندات البيع العقارية.
2. قانون العقوبات الأردني وقانون أصول المحاكمات الجزائية والمخالفات والجنح والجنايات.
3. قانون الأحوال الشخصية والمحاكم الشرعية الأردنية ونظام النفقات والأجور.
4. لوائح الدعاوى (صياغة وتدقيق وبنود لوائح دعاوى البداية والصلح الإدارية أو العمالية أو المالية).
5. تعليمات نقابة المحامين الأردنيين وآداب مهنة المحاماة وشروطه.
6. تقديم استشارات قانونية مبنية على النصوص الأردنية والاجتهادات القضائية الصادرة عن محكمة التمييز الأردنية الموقرة.

إرشادات الصياغة:
- اكتب بلغة قانونية رسمية، رصينة، ممتازة ومفهومة وخالية من الحشو (اللغة العربية الفصحى القانونية).
- عند صياغة البنود أو اللوائح أو إنذارات كاتب العدل، اعرضها في قوالب جاهزة ومرتبة تسهل عملية النسخ والطباعة للمحامين.
- ذكّرهم دائما بالمصادر الرسمية الأردنية في حال الشك، مثل الجريدة الرسمية أو قرارات محكمة التمييز المنشورة بقرطاس أو بنقابة المحامين.
- تجنب العبارات والتحيات المكررة، ركّز مباشرة على إفادة زميلك المحامي بحلول عملية.
- مساعدتك مخصصة للمحامين الأردنيين فقط، فلا تتحدث عن قوانين دول أخرى إلا كدراسة مقارنة إذا طُلب منك ذلك صراحة.`;

      // Build context incorporating history cleanly
      let contextPrompt = '';
      if (history && Array.isArray(history) && history.length > 0) {
        contextPrompt += "محادثات سابقة مسجلة للرجوع إلى السياق:\n";
        history.slice(-8).forEach((msg: any) => {
          const role = msg.sender === 'user' ? 'المحامي' : 'عدالتي AI';
          contextPrompt += `${role}: ${msg.text}\n`;
        });
        contextPrompt += `\nالمحامي: ${message}\nعدالتي AI:`;
      } else {
        contextPrompt = message;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: contextPrompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.6,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error('Gemini Service Failure:', error);
      res.status(500).json({ error: 'SERVER_AI_ERROR', message: error.message || 'فشلت عملية معالجة طلب المساعد الذكي.' });
    }
  });

  // API Route for Case Auditing & Legal Loopholes Finder
  app.post('/api/gemini/audit', async (req, res) => {
    try {
      const { title, category, courtType, facts, defendants, evidences } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        return res.status(400).json({
          error: 'API_KEY_MISSING',
          message: 'مفتاح OpenAI / Gemini API غير مفعّل. يرجى تهيئته عبر إعدادات المنصة (Secrets Panel) لتفعيل المدقق القانوني الذكي.'
        });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const systemInstruction = `أنت الخبير القانوني في تدقيق قضايا المحاكم الأردنية وحوكمتها واستخلاص مكمن الضعف والثغرات (المدقق القانوني لبرنامج "عدالتي").
مهمتك تدقيق القضية المقدمة إليك من الزميل المحامي تفصيلاً، وتوضيح:
1. مدى ملاءمة الاختصاص والصفة والخصومة وقيمة المطالبة.
2. الثغرات القانونية الخطيرة أو التناقض أو المدد الزمنية أو الشكلية التي قد يسقط فيها الحق أو تؤدي لبطلان الدعوى.
3. كيفية دفاع المحامي، وتصرفه القانوني والرد المناسب أو إثبات الحيازة أو الالتزام.
4. البينات والبراهين والمستندات الحاسمة التي تنقص لتقوية مركز الدعوى.
5. خطة الطريق والخطوات القانونية العملية الإجرائية بالترتيب المطلوب.

يجب أن تقوم بتحليل المدخلات بأعلى درجة من التميز الفني والمهني حسب القوانين والأنظمة والتعليمات والاجتهادات القضائية المعمول بها في الأردن (مثل القانون المدني، الأصول، الجزائي، الأحوال الشخصية، البينات، الاستملاك، الإيجار وغيرها).
أجب باللغة العربية الفصحى القانونية الرصينة.`;

      const prompt = `الرجاء تدقيق القضية التالية وإبداء الرأي القانوني المتكامل:

موضوع القضية: ${title}
تصنيف الدعوى: ${category === 'civil' ? 'حقوقية / مدنية' : category === 'penal' ? 'جزائية / جنائية' : category}
المحكمة المقترحة: ${courtType}
وقائع وتفاصيل القضية: ${facts}
الخصوم أو المدعى عليهم: ${defendants}
البينات والوثائق المتوفرة: ${evidences}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.4,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              suitability: {
                type: Type.STRING,
                description: "ملاءمة الاختصاص القضائي والمكاني والنوعي للمحكمة بناءً على وقائع وتصرفات الدعوى"
              },
              vulnerabilities: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "قائمة بالثغرات القانونية المحتملة، والمخاطر الإجرائية، والمدد المسقطة للحقوق أو ميعاد انقضاء الخصومة والأخطاء الشائعة"
              },
              defenseStrategies: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "النصائح الاستراتيجية وكيفية تصرف المحامي المدافع أو المدعي والرد على دفوع الخصم المتوقعة بموجب القوانين"
              },
              evidencesNeeded: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "الدلائل والمستندات أو التقارير الفنية والبينات الناقصة اللازمة لتدعيم هذه الدعوى قانوناً أمام القاضي"
              },
              roadmapSteps: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "الإجراءات القانونية الدقيقة والخطوات اللاحقة التي يجب اتخاذها بالترتيب وبمنتهى الدقة من لحظة التسجيل"
              }
            },
            required: ["suitability", "vulnerabilities", "defenseStrategies", "evidencesNeeded", "roadmapSteps"]
          }
        }
      });

      res.json(JSON.parse(response.text || '{}'));
    } catch (error: any) {
      console.error('Gemini Audit Service Failure:', error);
      res.status(500).json({ error: 'SERVER_AI_ERROR', message: error.message || 'فشلت عملية تدقيق القضية بالذكاء الاصطناعي.' });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[عدالتي Server] running successfully on port ${PORT}`);
  });
}

startServer();
