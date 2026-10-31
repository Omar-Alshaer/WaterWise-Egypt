# تثبيت WaterWise على Linux وتشخيص البطء

## البداية السريعة

من جوّه مجلد المشروع، وقف أي `npm install` شغّال بـ Ctrl+C الأول، ووقف سيرفر التطوير قبل إعادة التثبيت. بعد تحديث نسختك بالتعديل ده:

```bash
# لو nvm متثبت عندك:
nvm install
nvm use
node --version
npm --version
# لو npm مش 10.9.9، مع Node المثبت عن طريق nvm:
npm install --global npm@10.9.9 --no-audit --no-fund

npm ci --include=dev --no-audit
npm run dev
```

من غير nvm، استخدم مدير Node عندك لتثبيت Node 22 وnpm 10.9.9. متستخدمش `sudo npm install` جوّه المشروع. افتح http://localhost:3000/ar. مش محتاج مفاتيح Firebase علشان تثبّت الحزم أو تبني الموقع بالإعدادات الافتراضية.

`npm ci` بياخد الإصدارات من `package-lock.json` وبيحذف `node_modules` القديم تلقائيًا؛ متحذفش الـlockfile. لو فيه اختلاف بينه وبين `package.json`، الأمر هيفشل بدل ما يغيّر الإصدارات من نفسه. متشغّلش تثبيتين مع بعض. بعد التثبيت، مش محتاج تعيده مع كل تشغيل للموقع أو تعديل في الصفحات.

`--include=dev` ضروري لأن TypeScript وتعريفات الأنواع مطلوبة للبناء. `--no-audit` بيأجل طلب فحص الثغرات فقط، مش بيغيّر التحقق من سلامة الحزم أو HTTPS. شغّل الفحص منفصلًا؛ الـCI بيشغّله كمان:

```bash
npm audit --audit-level=high
npm run typecheck
npm run build
```

## إيه اللي كان غلط في المستودع؟

عند مراجعة commit `576f14c`:

- مفيش أي lockfile، والإصدارات في `package.json` نطاقات مفتوحة (`^`). كل تثبيت جديد محتاج يحل شجرة الاعتماديات، والنتيجة ممكن تختلف بين الأجهزة والأيام.
- دليل التشغيل والـCI كانوا بيستخدموا `npm install`، والـCI مفيهوش npm cache. دلوقتي فيه lockfile و`npm ci` وكاش مربوط بالـlockfile.
- الـCI كان Node 22، وإعداد Vercel كان Node 26. دلوقتي `.nvmrc` و`engines.node` بيحددوا Node 22، وملف `vercel.json` بيحدد أمر التثبيت. `packageManager` يوثّق npm 10.9.9؛ مش كل أداة بتفرضه تلقائيًا، فراجع إصدار npm في سجل البناء.
- مفيش root `preinstall` أو `postinstall` أو `prepare` بيشغّل بناء أو تحميل Emulator أثناء التثبيت العادي.
- `firebase-tools` أصلًا مش dependency للموقع. تم تثبيت رقم إصدار أمر الاختبارات فقط بدل `npx` غير المحدد؛ أول `npm run test:rules` هيحمّل CLI وFirestore Emulator وده تنزيل منفصل وكبير.
- Next.js وFirebase وFirebase Admin مستخدمين فعلًا. `firebase-admin` مطلوب للتحقق من صلاحيات الإدارة والحذف على السيرفر. أدوات TypeScript مطلوبة للبناء. حذفهم أو استخدام `--omit=dev` للبناء مش حل.

سجل Vercel السابق لنفس commit سجّل 244 حزمة في 31 ثانية مع تخطي build cache. دي قرينة إن البطء الشديد مش حتمي في التطبيق، لكن مش قياس لسرعة جهازك. أول تنزيل لحزم Next/SWC وFirebase ممكن يفضل بطيء حسب الشبكة؛ الكاش مش هيسرّع حزم لسه متنزلتش.

احتفظنا بـnpm لتجنب تغيير مدير الحزم ونشر الموقع في نفس الوقت. الانتقال لـpnpm محتاج قياس مستقل واختبار البناء وFirebase؛ مش علاج مضمون لمشكلة DNS أو قرص بطيء.

## 1. فرّق مشكلة الشبكة عن مشكلة الجهاز

السكريبت ده بيشتغل حتى قبل تثبيت الحزم، ومش بيقرأ `.env` أو مفاتيح Firebase أو يطبع إعدادات npm كاملة:

```bash
npm run diagnose:install -- --network
```

هيعرض إصدارات Node/npm، وجود وتوافق الـlockfile المباشر، نوع نظام الملفات والمساحة، وقياس registry مع مهلة محدودة. اختبار curl بيقيس الـregistry الرسمي؛ `npm ping` بيقيس الـregistry المضبوط عندك. السكريبت تشخيصي، ونتائجه مش بديل لتحقق `npm ci` الكامل.

| اللي بيظهر | معناه والخطوة التالية |
| --- | --- |
| `EAI_AGAIN` أو `ENOTFOUND` أو DNS بطيء | مشكلة DNS/اتصال محتملة. جرّب شبكة تانية وقارن نفس التقرير؛ راجع إعداد DNS من مدير الشبكة. |
| `ETIMEDOUT` / `ECONNRESET` أو TLS بطيء | اتصال أو proxy/VPN/firewall محتمل. قارن شبكة تانية وراجع إعدادات البروكسي محليًا؛ متطبعش tokens. |
| خطأ شهادة HTTPS | راجع ساعة الجهاز وشهادة الشبكة/البروكسي الموثوق. متستخدمش `strict-ssl=false` أو registry بـHTTP. |
| ping سريع لكن تنزيل ملفات `.tgz` بطيء | latency بسيطة مش معناها bandwidth كويسة. بص على توقيت تنزيل الحزم في الخطوة التالية. |
| `EACCES` أو `EROFS` | صلاحيات أو قرص للقراءة فقط في المشروع/كاش npm. استخدم مجلد يملكه حسابك؛ متلجأش لـsudo npm أو تغيير صلاحيات واسع. |
| `ENOSPC` أو مساحة قليلة | فضّي مساحة وافحص `df -h .` و`df -i .`؛ ممكن الـinodes تخلص قبل مساحة القرص. |
| المشروع على `ntfs` / `exfat` / `fuseblk` أو شبكة | كتابة آلاف الملفات ممكن تبقى أبطأ أو symlinks تتعطل. جرّب clone جديد في `~/Projects` على قرص Linux محلي وقارن. |

لو المسار عندك `/media/moraa/Web/WaterWise_Egypt`، وجوده تحت `/media` لوحده مش إثبات إن القرص بطيء؛ التقرير بيبيّن نوعه. متحذفش نسختك القديمة أو تعديلاتك المحلية عند المقارنة.

لو الـregistry اتغيّر بالغلط، قارن مرة واحدة بالأمر ده من غير تعديل إعدادات الجهاز الدائمة:

```bash
npm ping --registry=https://registry.npmjs.org/ --fetch-retries=0 --fetch-timeout=15000
```

## 2. اعرف npm واقف فين

من Bash، بعد إيقاف سيرفر التطوير:

```bash
set -o pipefail
time npm ci --include=dev --no-audit --timing --loglevel=http --foreground-scripts 2>&1 | tee install-diagnostic.log
```

- طلبات `http fetch` اللي بتاخد ثواني كتير أو بتتكرر: شبكة/registry، مش كود الموقع.
- وقت طويل في حل الشجرة (`idealTree`): اتأكد إنك على الفرع الصحيح وفيه lockfile وإنك بتستخدم `npm ci`.
- وقت طويل في فك/كتابة الحزم (`reify`) بعد انتهاء التنزيل: قرص/مساحة/CPU أو ملفات native. افحص نظام الملفات والمساحة؛ `top` يساعد يوضح استهلاك الجهاز.
- وقت طويل تحت اسم `postinstall`: الـ`--foreground-scripts` بيظهر اسم السكريبت. متعطلش السكريبتات كلها كحل دائم.

للمقارنة بعد نجاح التثبيت الأول، أعد نفس `npm ci` بالكاش الموجود لو محتاج قياس فقط. `.npmrc` بيستخدم `prefer-offline=true`: بيستفيد من الكاش ولسه بيحمّل الناقص. متعملش `npm cache clean --force` بشكل روتيني؛ ده بيفرض التنزيل من جديد. لو فيه خطأ integrity متكرر استخدم `npm cache verify` أولًا. متستخدمش `--force` أو `--legacy-peer-deps` لإخفاء مشكلة إصدارات.

سجلات التشخيص متجاهلة في Git. قبل مشاركة أي سجل راجعه وشيل أي tokens أو روابط فيها بيانات دخول؛ متشاركش `.env` أو ملف service account أو ناتج `npm config list`.

## اختبارات الأمان والنشر وتحديث الحزم

```bash
java -version  # Java 21
npm run test:rules
```

الأمر بيختبر مشروع emulator اسمه `demo-waterwise`؛ مش محتاج تسجيل دخول Firebase أو مفاتيح إنتاج. الـCLI مثبت الإصدار لكنه منزل عند الطلب، واعتمادياته غير موجودة في lockfile التطبيق. أدوات Firebase CLI/Java/Emulator مش مطلوبة لتشغيل الموقع العادي أو منح admin بالسكريبت الموجود بعد تثبيت اعتماديات الموقع.

Vercel بيقرأ `vercel.json` و`engines.node` من الفرع المنشور. احتفظ بكاش البناء مفعّل؛ متختارش نشر بدون كاش كل مرة. الـCI بيشتغل على PRs إلى `main` وعلى pushes لـ`main`، ويستخدم npm cache مع `npm ci`، ثم فحص الثغرات والأنواع واختبارات قواعد Firestore والبناء.

لتغيير dependency عمدًا، استخدم `npm install <package>@<version>` باستخدام Node/npm المحددين، وراجع فرق `package.json` و`package-lock.json`، ثم شغّل الاختبارات وارفع الملفين مع بعض. متعملش `npm audit fix --force` تلقائيًا.

ملفات Firebase السرية تفضل خارج المستودع. تجاهل أنماط ملفات المفاتيح في `.gitignore` حماية إضافية فقط، مش ضمان لكل اسم. التعديل ده لا يغيّر قواعد Firestore أو تحقق admin على السيرفر أو أعلام تفعيل الحسابات.

مراجع: [npm ci](https://docs.npmjs.com/cli/v10/commands/npm-ci)، [npm cache/config](https://docs.npmjs.com/cli/v10/using-npm/config)، [Node على Vercel](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions).

## ملاحظة فحص الاعتماديات

الـlockfile الأول كشف نسخة gRPC قديمة مقيدة بواسطة Firestore (`~1.9.0`). أضفنا override محددًا لـ`@grpc/grpc-js@1.14.7` من نفس major لإزالة التنبيه العالي وتوحيد النسخ. النسخ المصححة موثقة في [تنبيه gRPC الرسمي](https://github.com/grpc/grpc-node/security/advisories/GHSA-m9gg-hp2v-232j). راجع الاحتياج للـoverride عند تحديث Firebase، وشغّل اختبارات القواعد والبناء قبل إزالته.

فحص الشجرة بعد التعديل: لا توجد تنبيهات high/critical؛ بقيت 8 نتائج moderate مرتبطة باعتمادية `uuid` القديمة في Firebase Admin/Google Cloud. دي نتائج سلسلة اعتماديات، مش 8 ثغرات مستقلة مؤكدة في الموقع. لم نفرض ترقية Firebase Admin الرئيسية أو تغيير `uuid` عبر major ضمن إصلاح التثبيت؛ تحتاج متابعة منفصلة. `npm audit --audit-level=high` يعرضها لكنه لا يفشل إلا عند high/critical.
