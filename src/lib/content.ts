export type Lang = "ar" | "en";
export const locales: Lang[] = ["ar", "en"];
export function isLang(v: string): v is Lang { return v === "ar" || v === "en"; }
export const team = [
 {name:"Omar Reda Elshaer",id:"24100592",image:"/team/Omar.png",roleAr:"تطوير الموقع وتجربة المستخدم",roleEn:"Website development & UX",linkedin:"https://www.linkedin.com/in/omar-r-shaer/",lead:true},
 {name:"Dareen Ayman Hamza",id:"24100816",image:null,roleAr:"البحث وإعداد المحتوى",roleEn:"Research & content",linkedin:"https://www.linkedin.com/in/dareen-ayman-6aa351448/",lead:false},
 {name:"Sarah Ibrahim Al Sobary",id:"24100855",image:null,roleAr:"البحث والمصادر العلمية",roleEn:"Research & references",linkedin:"https://www.linkedin.com/in/sarah-ibrahim-a390a9448/",lead:false},
 {name:"Fayrouz Ahmed Mohamed",id:"24100952",image:null,roleAr:"المحتوى والتوعية",roleEn:"Content & awareness",linkedin:"https://www.linkedin.com/in/fayrouz-hassouna-5765b1365",lead:false},
 {name:"Huda Mahmoud Salem",id:"24101128",image:null,roleAr:"مراجعة وتنظيم المحتوى",roleEn:"Content review & organization",linkedin:null,lead:false}
] as const;
export const references = [
 ["Brick et al. (2023)","Behavioural nudges for water conservation in unequal settings: Experimental evidence from Cape Town","10.1016/j.jeem.2023.102852"],
 ["Clò et al. (2024)","Consumption feedback and water saving: A field intervention evaluation in the metropolitan area of Milan","10.1007/s10640-024-00884-9"],
 ["Cominola et al. (2021)","Long-term water conservation is fostered by smart meter-based feedback and digital user engagement","10.1038/s41545-021-00119-0"],
 ["Goette et al. (2019)","Motivating household water conservation: A field experiment in Singapore","10.1371/journal.pone.0211891"],
 ["Ibrahim et al. (2025)","Linking knowledge, attitudes, and practices to sustainable solid waste, water, and energy use in Egyptian households","10.1038/s41598-025-29799-1"],
 ["Lopez-Rivas (2024)","Spreading the word! Effects of a randomized normative informational campaign on residential water conservation","10.1016/j.reseneeco.2024.101463"],
 ["Mohamed et al. (2024)","Egyptians awareness towards domestic water conservation and reuse","10.1016/j.dwt.2024.100422"],
 ["Nicolaidou et al. (2026)","A serious game for learning about water conservation in a science museum setting: An evaluation study","10.3390/mti10100107"],
 ["Ramli & Laffan (2022)","Double trouble: Concurrently targeting water and electricity using normative messages in the Middle East","10.1016/j.erss.2022.102496"],
 ["Rupiper et al. (2024)","AMI water meters deliver end-use water and financial savings in leaky households: Experimental evidence from California","10.1088/1748-9326/ad7bce"],
] as const;
export const t = {
 ar:{
  brand:"ووتر وايز مصر",tagline:"من الوعي إلى الفعل",nav:{home:"الرئيسية",tools:"حاسبة المياه",learn:"تعلّم واختبر",challenges:"التحديات",dashboard:"حسابي",research:"الأبحاث",team:"حول المشروع",login:"حسابي"},
  pill:"مشروع جامعي قائم على الأبحاث • SDG 6",hero1:"كل نقطة مياه",hero2:"تفرق.",heroBody:"حوّل معرفتك بترشيد المياه إلى خطوات يومية واضحة، من غير أرقام وهمية أو وعود بتوفير غير مُقاس.",
  start:"احسب استخدامك",how:"اكتشف التحديات",note:"تقديرات توضيحية • مش قراءات عدادات",stat1:"أبحاث محكّمة",stat2:"لغات",stat3:"هدف رئيسي",
  featTitle:"أدوات بسيطة. أثر قابل للتقييم.",featBody:"نقيس التعلّم والتفاعل بوضوح، ونفصل التقدير عن الاستهلاك المقاس.",
  c1:"حاسبة استخدام المياه",c1d:"قدّر بعض أنشطتك اليومية بافتراضات معلنة.",c2:"فحص التسريبات",c2d:"قائمة خطوات يمكنك تنفيذها في المنزل.",c3:"اختبر معلوماتك",c3d:"أسئلة قبلية وبعدية لتقييم التعلّم.",c4:"تحديات شخصية",c4d:"اختَر عادة قابلة للتنفيذ وسجّل التزامك.",
  cardKicker:"اعرف أكثر",ctaTitle:"جاهز تبدأ بخطوة صغيرة؟",ctaBody:"ابدأ بتقدير بعض أنشطتك اليومية، ثم جرّب عادة ترشيد واحدة لمدة أسبوع.",ctaButton:"ابدأ الآن",
  footer:"مشروع طلابي | Alamein International University",disclaimer:"جميع تقديرات الاستخدام تعليمية وليست قياسات مؤكدة من عداد مياه.",soon:"قريبًا",english:"English",
  common:{intro:"أنشطتك بتساعدك تشوف تقدّمك يومًا بعد يوم.",back:"العودة للرئيسية",learnMore:"استكشف",source:"المصدر"}
 },
 en:{
  brand:"WaterWise Egypt",tagline:"From Awareness to Action",nav:{home:"Home",tools:"Water calculator",learn:"Learn & Quiz",challenges:"Challenges",dashboard:"My account",research:"Research",team:"About",login:"My account"},
  pill:"Research-led university project • SDG 6",hero1:"Every drop",hero2:"makes a difference.",heroBody:"Turn water-conservation knowledge into practical daily actions, without fabricated numbers or promises of unmeasured savings.",
  start:"Estimate your use",how:"Explore challenges",note:"Illustrative estimates • Not meter readings",stat1:"Peer-reviewed papers",stat2:"Languages",stat3:"Primary SDG",
  featTitle:"Simple tools. Meaningful evaluation.",featBody:"We track learning and engagement honestly, distinguishing estimates from measured consumption.",
  c1:"Water-use calculator",c1d:"Estimate selected daily activities with disclosed assumptions.",c2:"Leak checklist",c2d:"Practical steps you can complete at home.",c3:"Test your knowledge",c3d:"Pre- and post-quizzes to evaluate learning.",c4:"Personal challenges",c4d:"Choose an actionable habit and log your commitment.",
  cardKicker:"Explore",ctaTitle:"Ready for one small change?",ctaBody:"Estimate your everyday activities, then try one water-friendly habit for a week.",ctaButton:"Get started",
  footer:"Student project | Alamein International University",disclaimer:"All usage estimates are educational, not verified water-meter measurements.",soon:"Coming soon",english:"العربية",
  common:{intro:"Keep track of your everyday progress.",back:"Back home",learnMore:"Explore",source:"Source"}
 }
} as const;
