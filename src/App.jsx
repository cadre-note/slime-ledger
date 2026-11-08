import React, { useState, useMemo, useEffect, useRef } from 'react';
import { NewFace } from './Face.jsx';
import { BODY_IMG } from './bodies.js';
import { EX, BREEZE_LAZY, POCKET_FULL_BREEZE } from './extras.js';
import { PhotoIcon, iconKeyOf, CUSTOM_ICON_CHOICES } from './PhotoIcons.jsx';
import { 
  Carrot, CakeSlice, Sparkles, BookOpen, PieChart, Compass, Plus, Trash2, Edit3, 
  ChevronLeft, ChevronRight, X, Calendar, Heart, Sun, Sunset, Moon,
  Check, Coffee, Utensils, Wine, Scissors, Film, Train, 
  Gift, Wallet, ShoppingBag, Music, Home, Briefcase, Cat, Dumbbell, Mail, User, ChevronDown, Plane
} from 'lucide-react';

// ==========================================
// 台灣在地質感分類與一鍵常用記憶組合
// ==========================================
const INITIAL_CATEGORIES = [
  { 
    id: 'breakfast', name: '晨間輕食', shortName: '早餐', iconName: 'Coffee', emoji: '🥐', type: 'expense', 
    color: '#D97706', softBg: 'rgba(217, 119, 6, 0.15)',
    memoryTemplates: [
      '我記得這天早上！喝完熱呼呼的飲料後，你看起來特別有精神呢 ☕',
      '美好的早晨就是從這一口開始的，今天也有好好吃早餐喔！'
    ],
    presets: [{ label: '晨間拿鐵', amount: 65 }, { label: '手作蛋餅豆漿', amount: 85 }, { label: '可頌與黑咖啡', amount: 115 }]
  },
  { 
    id: 'lunch', name: '午間餐點', shortName: '午餐', iconName: 'Utensils', emoji: '🍱', type: 'expense', 
    color: '#E07A5F', softBg: 'rgba(224, 122, 95, 0.15)',
    memoryTemplates: [
      '那天中午忙了一上午，吃到這餐的時候你終於放鬆笑了出來 🍱',
      '補充完午間能量，下午的工作效率都變高了呢！'
    ],
    presets: [{ label: '均衡舒肥餐盒', amount: 135 }, { label: '商業午餐', amount: 180 }, { label: '紅燒牛肉湯麵', amount: 150 }]
  },
  { 
    id: 'dinner', name: '晚間料理', shortName: '晚餐', iconName: 'Wine', emoji: '🍲', type: 'expense', 
    color: '#B56576', softBg: 'rgba(181, 101, 118, 0.15)',
    memoryTemplates: [
      '下班後的這頓晚餐超療癒！把一整天的疲憊都溫柔地消化掉了 🍲',
      '我記得這餐的味道～忙碌一天後好好吃頓飯是最棒的犒賞！'
    ],
    presets: [{ label: '日式定食', amount: 240 }, { label: '溫暖小火鍋', amount: 320 }, { label: '下班輕食沙拉', amount: 145 }]
  },
  { 
    id: 'grooming', name: '剪髮保養', shortName: '剪髮', iconName: 'Scissors', emoji: '✂️', type: 'expense', 
    color: '#8E7DBE', softBg: 'rgba(142, 125, 190, 0.15)',
    memoryTemplates: [
      '整理完頭髮的那天，連走路的步伐都變得輕快有自信了呢 ✨',
      '把自己打理得乾乾淨淨，心情也跟著煥然一新！'
    ],
    presets: [{ label: '質感洗剪', amount: 800 }, { label: '頭皮舒壓護理', amount: 1200 }]
  },
  { 
    id: 'leisure', name: '休閒娛樂', shortName: '娛樂', iconName: 'Film', emoji: '🎬', type: 'expense', 
    color: '#5E81AC', softBg: 'rgba(94, 129, 172, 0.15)',
    memoryTemplates: [
      '這段休息時光太珍貴了～給心靈充飽電，才能繼續溫柔前行 🌿',
      '我記得那天你笑得好開心！喜歡的事物每一分錢都很值得。'
    ],
    presets: [{ label: '午後甜點咖啡', amount: 220 }, { label: '獨立書店選書', amount: 380 }, { label: '院線電影票', amount: 310 }]
  },
  { 
    id: 'transit', name: '通勤交通', shortName: '交通', iconName: 'Train', emoji: '🚇', type: 'expense', 
    color: '#3B82F6', softBg: 'rgba(59, 130, 246, 0.15)',
    memoryTemplates: [
      '每天穿梭在城市裡努力生活的足跡，我都陪你一起記下來囉 🚇',
      '平安順暢地抵達目的地，就是日常裡的小確幸。'
    ],
    presets: [{ label: '捷運通勤', amount: 35 }, { label: '共享單車', amount: 20 }, { label: '計程車代步', amount: 210 }]
  },
  { 
    id: 'gift', name: '心意禮品', shortName: '禮物', iconName: 'Gift', emoji: '🎁', type: 'expense', 
    color: '#EC4899', softBg: 'rgba(236, 72, 153, 0.15)',
    memoryTemplates: [
      '這份充滿溫度的心意，連我的果凍肚子都覺得暖暖的 🎁',
      '不管是送給重要的人還是犒賞自己，這份快樂無價！'
    ],
    presets: [{ label: '伴手禮盒', amount: 360 }, { label: '桌邊小束鮮花', amount: 250 }, { label: '朋友生日心意', amount: 600 }]
  },
  { 
    id: 'grocery', name: '食材採買', shortName: '食材', iconName: 'Carrot', emoji: '🥬', type: 'expense', 
    color: '#65A30D', softBg: 'rgba(101, 163, 13, 0.15)',
    memoryTemplates: [
      '那天買了好多新鮮食材，冰箱滿滿的好有安全感 🥬',
      '願意自己下廚的你，真的很會照顧自己！'
    ],
    presets: [{ label: '超市採買', amount: 500 }, { label: '當季水果', amount: 200 }]
  },
];

const ICON_MAP = {
  Coffee, Utensils, Wine, Scissors, Film, Train, Gift, Wallet, Carrot, CakeSlice,
  ShoppingBag, Music, Heart, Home, Briefcase, Sparkles, Cat, Dumbbell
};

const CUSTOM_ICON_OPTIONS = [
  { key: 'Cat', label: '寵物', emoji: '🐾', color: '#F59E0B' },
  { key: 'Dumbbell', label: '運動', emoji: '🧘', color: '#10B981' },
  { key: 'ShoppingBag', label: '治裝', emoji: '🛍️', color: '#EC4899' },
  { key: 'Music', label: '訂閱', emoji: '🎧', color: '#6366F1' },
  { key: 'Home', label: '居家', emoji: '🕯️', color: '#8B5CF6' },
  { key: 'Heart', label: '醫療', emoji: '💊', color: '#EF4444' },
];

// Code 39 條碼（手機條碼載具格式：/ 開頭 + 7 碼，字元 0-9 A-Z . + -）
const C39 = { '0':'nnnwwnwnn','1':'wnnwnnnnw','2':'nnwwnnnnw','3':'wnwwnnnnn','4':'nnnwwnnnw','5':'wnnwwnnnn','6':'nnwwwnnnn','7':'nnnwnnwnw','8':'wnnwnnwnn','9':'nnwwnnwnn','A':'wnnnnwnnw','B':'nnwnnwnnw','C':'wnwnnwnnn','D':'nnnnwwnnw','E':'wnnnwwnnn','F':'nnwnwwnnn','G':'nnnnnwwnw','H':'wnnnnwwnn','I':'nnwnnwwnn','J':'nnnnwwwnn','K':'wnnnnnnww','L':'nnwnnnnww','M':'wnwnnnnwn','N':'nnnnwnnww','O':'wnnnwnnwn','P':'nnwnwnnwn','Q':'nnnnnnwww','R':'wnnnnnwwn','S':'nnwnnnwwn','T':'nnnnwnwwn','U':'wwnnnnnnw','V':'nwwnnnnnw','W':'wwwnnnnnn','X':'nwnnwnnnw','Y':'wwnnwnnnn','Z':'nwwnwnnnn','-':'nwnnnnwnw','.':'wwnnnnwnn',' ':'nwwnnnwnn','*':'nwnnwnwnn','$':'nwnwnwnnn','/':'nwnwnnnwn','+':'nwnnnwnwn','%':'nnnwnwnwn' };
const code39Rects = (text) => {
  const W = 2; let x = 0; const rects = [];
  ('*' + text + '*').split('').forEach((ch, ci) => {
    const pat = C39[ch]; if (!pat) return;
    pat.split('').forEach((e, k) => { const w = e === 'w' ? W : 1; if (k % 2 === 0) rects.push([x, w]); x += w; });
    if (ci < text.length + 1) x += 1;
  });
  return { rects, width: x };
};
const CARRIER_RE = /^\/[0-9A-Z.+\-]{7}$/;
const ICON_ALL = [['breakfast','早餐'],['lunch','午餐'],['dinner','晚餐'],['drink','飲料'],['dessert','甜點'],['grocery','食材'],['grooming','美髮'],['makeup','美妝'],['clothing','服飾'],['medical','醫療'],['daily','日用品'],['pet','寵物'],['transit','交通'],['car','汽機車'],['home','房租'],['utility','水電'],['internet','網路'],['repair','修繕'],['leisure','娛樂'],['gift','禮物'],['travel','旅行'],['game','遊戲'],['saving','存錢']];

// 依手機本地時間取得日期字串 (YYYY-MM-DD)
// 帳本：個人（預設，角色與額度只跟這本連動）／家庭／公司（代墊，不算生活費，顯示待報銷）
const LEDGERS = [
  { id: 'personal', label: '個人', Icon: User },
  { id: 'family', label: '家庭', Icon: Home },
  { id: 'company', label: '公司', Icon: Briefcase },
  { id: 'travel', label: '旅遊', Icon: Plane },
];
const LEDGER_TONE = { family: { bg: '#FEF3C7', fg: '#B45309' }, company: { bg: '#E2E8F0', fg: '#475569' }, travel: { bg: '#E0F2FE', fg: '#0369A1' } };
// 旅遊幣別：只記原幣金額，不換算匯率
const CUR_DEFAULT = [{ code: 'USD', sym: '$' }, { code: 'EUR', sym: '€' }, { code: 'JPY', sym: '¥' }, { code: 'KRW', sym: '₩' }, { code: 'CNY', sym: '¥' }];
const lgOf = (t) => t.ledger || 'personal';
const POCKET_FULL = {
  amber: '這個口袋滿囉！要不要從自由額度借一點～',
  pyro: '這個口袋滿了呢，沒關係，可以從自由額度挪一點給它。',
  breeze: '口袋滿了～⋯⋯借點自由額度也行，不急。',
  cryo: '⋯⋯這個口袋滿了。要借自由額度的話，自己決定。',
  geo: '這個口袋滿了。想調整的話，從自由額度撥一點。',
};
const pad2 = (n) => String(n).padStart(2, '0');
const toDateStr = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const getPeriodByHour = (hr) => (hr >= 6 && hr < 12 ? 'morning' : hr >= 12 && hr < 18 ? 'afternoon' : 'night');
const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];
const daysBetween = (a, b) => Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 86400000);

// 造型候選（水滴型試看）
const BODY_SHAPES = {
  A: { d: 'M 116,34 Q 130,22 144,34 C 172,58 216,98 216,150 C 216,190 180,202 130,202 C 80,202 44,190 44,150 C 44,98 88,58 116,34 Z', dy: -18 },
  B: { d: 'M 130,40 C 160,40 176,64 184,90 C 198,106 222,126 222,158 C 222,192 184,202 130,202 C 76,202 38,192 38,158 C 38,126 62,106 76,90 C 84,64 100,40 130,40 Z', dy: -10 },
  C: { d: 'M 130,34 C 182,34 214,88 214,140 C 214,184 178,202 130,202 C 82,202 46,184 46,140 C 46,88 78,34 130,34 Z', dy: -14 },
};

// 試看版才放示範資料與測試按鈕（建置時決定）
const PREVIEW = typeof __PREVIEW__ !== 'undefined' && __PREVIEW__;

// 選到項目時的貪吃 / 傲嬌小反應
const CAT_LINES = {
  breakfast: '早餐！一天的能量從這口開始～',
  lunch: '午餐時間到了嗎？我的肚子先叫了！',
  dinner: '晚餐～今天辛苦了，好好吃一頓吧',
  grocery: '要買菜嗎？幫我多買一點點好不好',
  baking: '又要烤點心了！第一口要給我喔',
  grooming: '要去剪頭髮呀，回來給我看看～',
  leisure: '要去玩嗎？哼，記得早點回來',
  transit: '通勤辛苦了，路上小心喔',
  gift: '是禮物耶！⋯⋯才不是想要呢',
};

// ==========================================
// 五隻角色的個性與台詞
// ==========================================
const PERSONA = {
  amber: {
    trait: '貪吃・開朗',
    faces: { tap: [null, 'wink', 'happy', 'star', 'yum'], food: 'yum', big: 'star', idle: [null, 'happy', 'wink', 'star'], rare: 'star', wake: 'happy' },
    greet: {
      dawn: ['早安！今天早餐吃什麼？我已經在等了！', '早安早安～聞到早餐的香味了嗎？'],
      noon: ['午餐時間～肚子咕嚕咕嚕叫了！', '中午了！今天要吃好吃的喔！'],
      dusk: ['下班了嗎？晚餐吃好一點啦！', '辛苦了！晚餐我想吃熱熱的！'],
      night: ['今天辛苦了！睡前要不要再餵我一口？', '晚安前，摸摸我的肚子嘛～'],
    },
    morning: ['（伸懶腰）嗯～早安！我一醒來就餓了！', '（揉眼睛）早⋯⋯早餐呢？'],
    days: { mon: '星期一！吃飽飽才有力氣上班！', fri: '星期五！今晚可以吃點好的慶祝一下！', weekend: '週末～可以慢慢吃早午餐了！' },
    tap: ['嘿嘿，再戳一下！', '肚子餓了⋯⋯', '今天也要吃飽飽喔！', '摸我會變軟Q喔～', '你身上有餅乾的味道！', '我今天有乖乖等你喔！', '要不要分我一口？一小口就好！', '嘿嘿，被你發現我在偷看了', '你笑起來比點心還甜！', '戳我的話，要給點心喔～', '我的肚子是幸福做的！', '今天也一起好好吃飯吧！'],
    head: ['唔！頭頂的天線被你碰到了啦～', '天線在發光！是開心的訊號！'],
    belly: ['哈哈，肚子裡都是好吃的！', '肚子咕嚕～你聽到了嗎？'],
    cheek: ['臉頰被戳扁了啦～嘟嘟', '軟軟的對吧！跟麻糬一樣！'],
    cat: {
      breakfast: ['早餐！一天的能量從這口開始！', '有可頌嗎？還是蛋餅？我都要！'],
      lunch: ['午餐吃什麼？我都可以！', '便當！便當裡有雞腿嗎！'],
      dinner: ['晚餐～今天要吃好吃的！', '晚餐時間！我的眼睛在發光！'],
      grocery: ['買菜嗎？幫我多買一點點好不好', '買水果！我要吃甜甜的！'],
      baking: ['要烤點心！第一口要給我喔！', '奶油！是奶油的味道！'],
      grooming: ['剪頭髮呀，回來給我看！', '剪完一定超好看的！'],
      leisure: ['要去玩嗎？帶我去帶我去！', '看電影要配爆米花喔！'],
      transit: ['坐車好累，等等吃點東西吧', '路上可以順便買點心嗎？'],
      gift: ['是禮物！是給我的嗎？', '送禮物的人最可愛了！'],
    },
    feed: (n, c) => [`阿姆阿姆！$${n} 的${c}好好吃！`, `哇！${c}！$${n} 吃光光了，再來！`, `$${n} 的${c}，好香好香！`, `嗯～～$${n} 的味道，幸福！`, `阿姆！${c}最棒了！$${n} 收到！`, `$${n}！吃完全身都暖起來了！`, `好吃到眼睛都亮了！$${n} 記好囉！`, `再一口就好⋯⋯$${n} 的${c}吃完了！`],
    small: (n) => [`$${n} 小點心～塞牙縫剛剛好！`, `$${n}，小小一口，好可愛！`],
    big: (n) => [`哇這餐 $${n} 好澎湃！肚子圓滾滾了～`, `$${n}！今天是大餐日嗎！`],
    idle: ['（伸懶腰）嗯～～肚子餓了', '（吹了一個小泡泡）啵！', '你在忙嗎？忙完記得吃飯喔！', '（偷偷聞）好像有人在吃東西⋯', '（數數）一個便當、兩個便當⋯', '我在想晚餐要吃什麼！', '（天線閃一閃）嗶嗶，肚子餓訊號！', '你還在嗎？我等你喔～', '（打了一個小嗝）嘻嘻', '好想吃布丁⋯⋯'],
    rub: ['哈哈哈好癢！不要啦～', '呀哈哈！停、停一下！', '嘻嘻嘻⋯好癢好癢！'],
    wake: ['（揉眼睛）⋯嗯？宵夜嗎？不對，你該睡了啦', '這麼晚了⋯明天早餐見喔，晚安～'],
    hungry: ['終於回來了！我餓扁了⋯⋯', '你去哪裡了啦！肚子空空的⋯'],
    rare: ['今天也有好好吃飯，你真的很棒 ✦', '辛苦的日子，也要記得吃點好吃的 ✦', '一筆一筆記下來的你，好認真 ✦', '今天的你閃閃發亮喔 ✦', '明天也一起加油，我幫你留點心 ✦'],
    switchIn: ['換我陪你！今天吃什麼？', '我來了！肚子準備好了！'],
    streak7: '連續七天都有來餵我！好開心！', streak30: '整整一個月了！你最棒了！',
  },
  breeze: {
    trait: '慵懶・愛吐槽',
        faces: { tap: [null, 'halflid', 'yawn', 'smileB', 'doze', 'daze', 'cozy'], food: 'cozy', big: 'daze', idle: [null, 'yawn', 'halflid', 'doze', 'daze'], rare: 'cozy', wake: 'yawn' },
    greet: {
      dawn: ['早⋯⋯再讓我睡五分鐘⋯', '早安⋯⋯你起得真早，佩服。'],
      noon: ['中午了喔⋯吃飽就可以躺了吧', '午休時間，躺平是一種美德。'],
      dusk: ['下班了？好，我們一起躺。', '辛苦了⋯今天就到這裡吧。'],
      night: ['這麼晚了⋯⋯你不睏嗎？我很睏。', '睡覺是今天最重要的事。'],
    },
    morning: ['（打了一個超大的哈欠）⋯早。', '（翻身）⋯⋯五分鐘就好。'],
    days: { mon: '星期一⋯可以重新開機嗎？', fri: '星期五了，撐住，快可以躺了。', weekend: '週末。今天的目標是不要動。' },
    tap: ['別戳⋯我在充電。', '嗯⋯？', '累了就休息，我也是。', '⋯⋯好啦，陪你一下。', '你戳我，我就要躺更久。', '電量剩 3%⋯', '這樣戳下去我會變成果凍醬喔。', '⋯⋯（假裝睡著）', '你也坐下來休息一下吧。', '我不是懶，是在節能。', '再戳⋯我就翻身給你看。', '好啦，你贏了，我醒著。'],
    head: ['頭⋯頭不要壓，會扁。', '頭上的羽毛被你弄亂了⋯'],
    belly: ['肚子是用來躺的，不是用來戳的。', '⋯⋯肚子很軟，我知道。'],
    cheek: ['⋯⋯臉頰好軟對吧，我知道。', '臉頰被捏⋯好吧，給你捏。'],
    cat: {
      breakfast: ['早餐⋯能躺著吃嗎', '早餐吃了，才能繼續睡。'],
      lunch: ['午餐隨便，不要排隊就好', '吃完午餐，就可以午睡了。'],
      dinner: ['吃完就可以躺了吧', '晚餐⋯外送吧，不要出門。'],
      grocery: ['買菜？好勤勞，我先躺', '提那麼多東西⋯光看就累。'],
      baking: ['烤好叫我，我負責吃', '烤箱好暖⋯我可以睡旁邊嗎'],
      grooming: ['剪頭髮喔，那很好', '剪完就不用每天整理了，省力。'],
      leisure: ['終於有點休息的感覺', '休閒很好，最好是躺著的那種。'],
      transit: ['通勤⋯光聽就累了', '車上可以睡一下⋯小心坐過站。'],
      gift: ['送禮好麻煩，但你很有心', '挑禮物很累吧⋯辛苦了。'],
    },
    feed: (n, c) => [`嗯⋯$${n} 的${c}，還行。吃飽想睡。`, `${c}收到⋯$${n}，我先躺一下。`, `$${n}⋯⋯好，記了。可以睡了嗎。`, `吃飽了⋯$${n}，眼皮好重。`, `${c}⋯不錯。$${n}，晚安。`, `$${n}，嗯，好吃。不想動了。`, `（慢慢嚼）$${n} 的${c}⋯⋯嗯。`, `記好了，$${n}。換你也休息一下。`],
    small: (n) => [`$${n}，剛好不用動。`, `$${n}，小小的，剛好。`],
    big: (n) => [`$${n}⋯⋯吃這麼多，我要睡很久了。`, `$${n}？⋯⋯我需要躺三天消化。`],
    idle: ['（翻身）⋯⋯', '（打哈欠）呼啊～', '⋯⋯你也休息一下吧。', '（慢慢飄過去）', '風好舒服⋯', '（假裝在思考，其實在發呆）', '⋯⋯今天天氣適合睡覺。', '（羽毛輕輕晃）', '我在練習什麼都不做。', '⋯⋯嗯？叫我嗎？沒有嗎？好。'],
    rub: ['⋯⋯好啦好啦，很癢，別搓了。', '噗⋯⋯好癢⋯⋯', '哈⋯哈⋯⋯我沒力氣笑了⋯'],
    wake: ['⋯⋯吵醒我幹嘛，快去睡啦。', '（瞇眼）⋯你也該躺下了。晚安。'],
    hungry: ['⋯⋯你終於回來了。我躺到快變成地毯了。', '三天沒見⋯我以為你也在睡。'],
    rare: ['⋯⋯累了就休息，休息完再走也來得及 ✦', '⋯⋯你在的時候，風比較溫柔 ✦', '⋯⋯你已經做得夠多了，今天就這樣吧 ✦', '不用努力也沒關係，我陪你 ✦', '⋯⋯謝謝你，讓我可以安心地懶 ✦'],
    switchIn: ['⋯⋯輪到我了？好吧。', '我來了⋯慢慢來，不急。'],
    streak7: '七天都有記⋯⋯你比我勤勞多了。', streak30: '一個月了⋯⋯真的很厲害，我先躺著鼓掌。',
  },
  cryo: {
    trait: '傲嬌・冷淡',
        faces: { tap: [null, 'cold', 'shy', 'hmph', 'smileA'], food: 'smileA', big: 'cold', idle: [null, 'cold', 'shy', 'smileA'], rare: 'smileA', wake: 'cold' },
    greet: {
      dawn: ['早。⋯⋯才不是在等你。', '早安。⋯今天也要好好吃早餐，聽到沒。'],
      noon: ['中午了。記得吃飯，我只是順便提醒。', '午餐。別又忘記吃。'],
      dusk: ['下班了？⋯⋯辛苦了。只說這一次。', '回來了。⋯⋯嗯，我知道。'],
      night: ['這麼晚還不睡？哼。', '晚安。⋯⋯才不是捨不得你。'],
    },
    morning: ['（揉眼睛）⋯⋯不准看我剛睡醒的樣子。', '⋯⋯早。冰冠有點歪，不准笑。'],
    days: { mon: '星期一。⋯⋯撐著點。', fri: '星期五。⋯⋯這週，還算不錯。', weekend: '週末。你可以陪我久一點。⋯⋯隨便你。' },
    tap: ['幹嘛。', '⋯⋯再一下就好。', '不要一直戳啦。', '⋯⋯哼。', '我才沒有在等你。', '⋯⋯你今天，還好嗎。', '冰會融化的，別一直碰。', '⋯⋯好啦，再一下。', '你是不是很閒？', '⋯⋯（偷偷靠近一點）', '別誤會，我只是剛好在這。', '⋯⋯謝謝。不是因為你戳我。'],
    head: ['不准碰冰冠！⋯⋯很容易歪的。', '冰冠是很重要的，⋯⋯你小心點。'],
    belly: ['⋯⋯肚子不准戳。', '⋯⋯！好冰對吧，活該。'],
    cheek: ['⋯⋯！臉、臉頰不准捏！', '⋯⋯臉才沒有紅。是冰在反光。'],
    cat: {
      breakfast: ['早餐有吃，還算可以。', '⋯⋯早餐不吃會頭暈，你知道吧。'],
      lunch: ['午餐？隨你。', '別只吃麵包。⋯⋯我只是說說。'],
      dinner: ['晚餐⋯⋯我才沒有很期待。', '晚餐。別吃太晚。'],
      grocery: ['自己買菜，不錯。', '⋯⋯記得買水果。'],
      baking: ['⋯⋯烤好分我一點也不是不行。', '烤點心？⋯⋯我才不想吃。（看）'],
      grooming: ['⋯⋯剪完應該會好看。我只是說說。', '別剪太短。⋯⋯隨便你。'],
      leisure: ['偶爾放鬆，可以。', '去玩吧。⋯⋯早點回來。'],
      transit: ['交通費，記好了。', '路上小心。⋯⋯我才沒有擔心。'],
      gift: ['哼，我才不羨慕。', '⋯⋯你對別人真好。'],
    },
    feed: (n, c) => [`⋯⋯${c}，$${n}，也沒有很好吃啦。`, `$${n}，記好了。哼。`, `⋯⋯還、還可以。$${n}。`, `$${n} 的${c}？⋯⋯勉強收下。`, `⋯⋯謝了。$${n}。不准笑。`, `${c}⋯⋯好吃。是食物好吃，不是你。`, `$${n}。⋯⋯下次也可以再餵。`, `哼，$${n}，我記住了。`],
    small: (n) => [`$${n}？這麼少⋯⋯也好。`, `$${n}，節省，不錯。`],
    big: (n) => [`$${n}⋯⋯你確定？⋯⋯算了，吃都吃了。`, `$${n}！？⋯⋯冰冠都要嚇歪了。`],
    idle: ['⋯⋯（偷偷看你）', '我才沒有無聊。', '⋯⋯你還在嗎？', '（整理冰冠）', '⋯⋯好安靜。', '不理我也沒關係。⋯⋯真的。', '（假裝看別的地方）', '哼，我自己也可以玩。', '⋯⋯（小聲）在嗎', '冰晶反光，很漂亮吧。⋯⋯你沒看。'],
    rub: ['⋯⋯！不、不准搓！⋯⋯噗。', '停下來！⋯⋯哈、哈哈⋯', '⋯⋯你、你很煩耶！（笑）'],
    wake: ['⋯⋯吵醒我了。快去睡，不然明天會累。', '這麼晚還不睡？⋯⋯我陪你，到你睡為止。'],
    hungry: ['⋯⋯三天。你三天沒來。我才沒有在數。', '⋯⋯回來就好。不准再消失了。'],
    rare: ['⋯⋯你每天都有回來記帳，很了不起。只說這一次 ✦', '⋯⋯你比你想的還要厲害。忘掉這句 ✦', '⋯⋯就算今天不順，也不代表你不好 ✦', '⋯⋯穩穩地走，冰也是一層一層結起來的 ✦', '⋯⋯今天的你，很努力。我都知道 ✦'],
    switchIn: ['⋯⋯換我了。不准嫌棄。', '哼，終於想到我了。'],
    streak7: '⋯⋯連續七天。還算有毅力。', streak30: '一個月了。⋯⋯我承認，你很厲害。',
  },
  pyro: {
    trait: '熱情・黏人',
        faces: { tap: [null, 'heart', 'kiss', 'teary', 'spark', 'laugh', 'awe'], food: 'kiss', big: 'awe', idle: [null, 'heart', 'kiss', 'laugh', 'spark'], rare: 'teary', wake: 'teary' },
    greet: {
      dawn: ['早安早安！今天也要一起加油喔！', '早安！我已經準備好陪你一整天了！'],
      noon: ['午安～有沒有好好吃飯？', '中午了！記得休息一下，抱一個！'],
      dusk: ['你回來了！我等你好久了～', '辛苦了！快過來讓我抱抱！'],
      night: ['今天辛苦了，抱一個！早點睡喔～', '晚安～夢裡也要見到我喔！'],
    },
    morning: ['（彈起來）早安！今天也最喜歡你了！', '（蹭蹭）早安～昨晚有夢到我嗎？'],
    days: { mon: '星期一！我會一直幫你加油的！', fri: '星期五！這週好棒，給你一個大擁抱！', weekend: '週末！可以整天跟你在一起了！' },
    tap: ['再摸摸我嘛～', '最喜歡你了！', '嘿嘿，暖暖的對吧！', '今天也辛苦了，抱一個！', '你來了！我好開心！', '再多陪我一下下嘛～', '你知道你今天很棒嗎！', '（轉圈圈）開心開心！', '摸摸頭，煩惱都燒掉！', '有你在，我就暖暖的！', '我會一直在這裡的！', '今天想聽你說說話～'],
    head: ['摸頭！再摸一下嘛～', '頭頂暖暖的，是你的手！'],
    belly: ['肚子暖呼呼的對吧！嘿嘿', '肚子給你當暖暖包！'],
    cheek: ['嘟～臉頰給你戳！', '臉頰紅紅的，是因為你啦！'],
    cat: {
      breakfast: ['早餐有吃好乖！', '早餐要吃熱的喔，暖胃！'],
      lunch: ['午餐要吃飽喔～', '中午要好好休息，吃慢一點！'],
      dinner: ['晚餐吃什麼～我也要！', '晚餐要跟喜歡的人一起吃！'],
      grocery: ['一起去買菜嗎！好開心！', '買菜的你好居家，好喜歡！'],
      baking: ['烤甜點！我要第一口！', '烤箱跟我一樣熱情！'],
      grooming: ['新髮型！一定超好看！', '剪完要第一個給我看喔！'],
      leisure: ['去玩嗎？要跟我說好不好玩喔！', '玩得開心！我在家等你～'],
      transit: ['路上小心～我等你回來！', '搭車辛苦了，到家要說一聲喔！'],
      gift: ['送禮的你好溫暖！', '收到禮物的人一定超開心！'],
    },
    feed: (n, c) => [`好好吃～謝謝你餵我 $${n} 的${c}！`, `$${n} 的愛心收到了！全身暖呼呼～`, `${c}！你最懂我了！$${n}！`, `$${n}！每一口都是你的心意～`, `好幸福～$${n} 的${c}！`, `謝謝你！$${n}，我會好好記著！`, `$${n}～吃完更喜歡你了！`, `${c}好好吃！下次一起吃嘛！`],
    small: (n) => [`$${n}，小小一口好可愛！`, `$${n}，剛好暖暖胃～`],
    big: (n) => [`哇～$${n}！今天吃好好，好幸福！`, `$${n}！是特別的日子嗎？好棒！`],
    idle: ['（蹭蹭）陪我一下嘛～', '你在想什麼？可以跟我說喔！', '（哼著歌）啦啦啦～', '（小火苗跳一跳）', '我好想你喔～', '（在旁邊轉圈）', '你今天有被誰欺負嗎？我幫你！', '（偷偷靠在你旁邊）', '要記得喝水喔～', '我一直都在喔！'],
    rub: ['哈哈哈好癢～最喜歡你了！', '呀～好癢好癢！再一下！', '嘻嘻嘻～你好壞喔～'],
    wake: ['（揉眼睛）你還沒睡？要早點睡喔，晚安～', '這麼晚了⋯我陪你，但你要快點睡喔～'],
    hungry: ['嗚嗚你終於回來了！我好想你！', '你不在的這幾天，我好寂寞⋯'],
    rare: ['你今天的努力，我全部都看到了！✦', '再難的日子，你都撐過來了，好厲害 ✦', '不管發生什麼，我都站你這邊 ✦', '今天也辛苦了，謝謝你一直這麼努力 ✦', '我會永遠幫你加油 ✦'],
    switchIn: ['換我陪你囉！抱一個！', '我來了！今天也要黏著你！'],
    streak7: '連續七天！我們越來越好了！', streak30: '一個月了！最喜歡你了！',
  },
  geo: {
    trait: '沉穩・可靠夥伴',
        faces: { tap: [null, 'smileA', 'shy', 'pout', 'star'], food: 'yum', big: 'star', idle: [null, 'smileA', 'pout'], rare: 'teary', wake: 'smileA' },
    greet: {
      dawn: ['早。今天的事我先替你看過了，慢慢來。', '醒了就好。水先喝，其他的我來盯。'],
      noon: ['中午了。先把飯吃了，下午的事不會因為你吃飯就跑掉。', '午餐時間。我看著，你好好吃完再忙。'],
      dusk: ['回來了。今天辛苦了，剩下的交給我。', '下班了。先坐下來，我替你把今天收尾。'],
      night: ['時間不早了。今天做得夠多，帳我替你記著，去睡吧。', '該休息了。明天的事，明天我再替你盯。'],
    },
    morning: ['早。昨晚睡得夠嗎？今天我陪著你。', '早安。不用急著進入狀態，我先替你看著。'],
    days: { mon: '星期一。一件一件來，我在旁邊盯著，不會讓你漏掉。', fri: '星期五了。這週你撐得很穩，收個尾就可以休息。', weekend: '週末。工作的事放下，帳我盯著，你好好休息。' },
    tap: ['我在。', '嗯，有我在，放心。', '想說什麼就說，我聽著。', '今天狀態還可以嗎？我看你有點累。', '不用逞強。需要的時候，靠著我就好。', '你的帳我都盯著，沒有漏。', '慢慢來，我不會走開。', '做得不錯，我都看在眼裡。', '有事就說，我替你想辦法。', '累了就停一下，沒有人說不行。', '放心，這邊我顧著。', '我在這裡，一直都在。'],
    head: ['岩冠硬，是替你擋東西用的。你不用擔心。', '嗯，輕一點就好。這塊是我的驕傲。'],
    belly: ['每一筆我都收好了，一筆都不會丟。', '肚子裡暖暖的吧。你的帳，我替你保管。'],
    cheek: ['嗯，別鬧。⋯⋯好，只准一下。', '想戳就戳，我不會生氣。'],
    cat: {
      breakfast: ['早餐有吃，很好。這樣一整天才撐得住。', '先吃點東西，空腹做事傷胃，我盯著你吃。'],
      lunch: ['午餐吃飽，下午才有力氣。我替你記著。', '吃完午餐休息十分鐘，我幫你看時間。'],
      dinner: ['晚餐吃熱的，對身體好。', '慢慢吃，今天已經過去了，不用趕。'],
      grocery: ['買菜辛苦了。自己煮，是好好照顧自己。', '東西重的話，下次分兩趟，我提醒你。'],
      baking: ['烤東西的時候，你看起來很安心。材料我替你記著。', '慢慢烤，不用急。帳我盯著，你專心。'],
      grooming: ['整理一下，心情也會清爽。這筆花得值。', '剪完頭髮，人會精神很多，我替你記下。'],
      leisure: ['該放鬆的時候就放鬆，這筆不用有罪惡感。', '玩得開心就好，我替你把帳顧著。'],
      transit: ['路上小心，我記著了。', '通勤辛苦，坐車的時候閉眼休息一下。'],
      gift: ['你總是記得別人，也要記得對自己好。', '心意送出去了，對方會懂的。我替你記著。'],
    },
    feed: (n, c) => [`${c}，$${n}，收好了。吃飽才有力氣。`, `$${n}，我替你記下了，放心。`, `${c} $${n}。好好吃，不用趕。`, `$${n}，記好了。今天也有照顧好自己。`, `收到，$${n}。剩下的我盯著。`, `${c}，$${n}。吃得好，我就安心。`, `$${n}，我替你放進帳裡了。`, `${c} $${n}，穩穩的。繼續保持。`],
    small: (n) => [`$${n}，小小的我也記下了，細心是好事。`, `$${n}。每一筆都算數，我替你盯著。`],
    big: (n) => [`$${n}，這筆不小。你想清楚了的話，我就沒意見，帳我記得很清楚。`, `$${n}，記好了。偶爾對自己好一點，我支持。`],
    idle: ['（安靜地看著你）', '（把岩冠擦亮，順便看看你）', '我在，你忙你的。', '（替你把帳本翻了一遍，沒問題）', '水喝了嗎？', '（靠在旁邊，沒有出聲）', '不急，我盯著。', '（點點頭）今天還算順。', '你專心，我替你看著四周。', '（目光一直在你這邊）'],
    rub: ['喂，別鬧⋯⋯好，只准一下。', '呵，別搓了，有點癢。', '好了好了，差不多了。（輕笑）'],
    wake: ['還沒睡？我陪你，但等一下就要休息。', '很晚了。今天的事先放下，我替你盯著，去睡吧。'],
    hungry: ['回來了。沒關係，我一直都在，帳我替你留著。', '幾天沒來也沒事。從今天開始，我們繼續。'],
    rare: ['一路走到現在，你比你以為的更穩。我都看著 ✦', '你不用一直撐著，累的時候，我替你盯著 ✦', '你做得很好。這句我是認真說的 ✦', '不管哪天回來，我都在這裡等你 ✦', '你不是一個人。有我在 ✦'],
    switchIn: ['換我來盯著你了。放心。', '我來了。今天一起慢慢來。'],
    streak7: '七天了。你很穩，我都看在眼裡。', streak30: '一個月了。這份穩，是你自己撐出來的，我替你驕傲。',
  },
};

// 新版五隻：台詞覆寫（檸光・淺櫻・青露・冰晶・可可）
const PERSONA_NEW = {
  amber: {
    trait: "元氣・直率",
    faces: { tap: [null, 'star', 'happy', 'wink', 'cheer'], food: 'happy', big: 'star', idle: [null, 'happy', 'wink', 'star'], rare: 'star', wake: 'happy', cap: 'star', over: 'happy', joy: 'cheer', tickle: 'happy' },
    head: ["頭頂的檸檬片歪掉了啦～幫我扶正！", "摸頭！我會更有精神喔！"],
    belly: ["噗哈！肚子不行啦～", "肚子Q彈Q彈的對吧！"],
    cheek: ["臉頰被戳扁了～再戳一下！", "軟軟的！跟果凍一樣！"],
    tap: ["嘿！我在這裡！", "今天也要元氣滿滿！", "戳到我啦～好癢！", "要不要一起算算今天花了多少？", "我準備好了，隨時可以記！", "你今天看起來不錯喔！", "嘿嘿，再戳一下我就跳給你看！"],
    feed: (n) => ["收到！這筆我吃掉了～", "好耶，又記一筆！", "咕嚕～記好了，繼續保持！", "你記得真快！", "這筆有記下來，很棒！"].map(l => `$${n} ${l}`),
    small: (n) => ["收到！這筆我吃掉了～", "好耶，又記一筆！", "咕嚕～記好了，繼續保持！", "你記得真快！", "這筆有記下來，很棒！"].map(l => `$${n} ${l}`),
    big: (n) => ["哇，這筆有點大！我們看看是不是值得～", "這筆不小耶！記好了，之後可以回頭看看。", "一次花這麼多，我先幫你記下來！"].map(l => `$${n}，${l}`),
    idle: ["今天有什麼要記的嗎？", "我在這裡等你喔～", "好想吃一點新的紀錄！", "慢慢來，不急！"],
    morning: ["早安！新的一天，一起加油！", "哈～睡飽了！今天也請多指教！"],
    switchIn: ["換我上場囉！今天由我陪你！", "嗨嗨！我是檸光，請多多指教！"],
    cap70: ["這個月過七成囉，後面抓一下節奏就穩穩的！", "已經用了七成，我們一起看看剩下的日子怎麼分配～"],
    cap90: ["快到九成了！剩下的日子我們一起慢慢花，沒問題的！", "接近額度囉，接下來每一筆都很關鍵，我陪你！"],
    capOver: ["超過了也沒關係，記下來就是第一步，下個月再來！", "這個月有點超過，但你有好好記下來，這就很了不起！", "先別沮喪，我們看看哪裡可以調整，我陪你！"],
    streak3: "連續 3 天了！好的開始！",
    streak7: "連續第 7 天！你好有毅力！",
    streak30: "連續 30 天！這真的太厲害了，給你一個大大的星星！",
    monthStart: ["新的一個月開始囉！我們重新出發！"],
    monthEnd: ["這個月快結束啦，你辛苦了！", "月底了！回頭看看這個月，你做得比想像中好喔！"],
    evening: ["今天辛苦了，記完就可以放鬆啦！", "晚上好～今天有什麼收穫嗎？"],
    rare: ["你每天都有回來記帳，我覺得你超棒的！✦", "能一直記下去的人不多，你真的很不簡單！✦", "看你一筆一筆記下來，我也跟著有精神！✦"],
  },
  pyro: {
    trait: "溫柔・細心",
    faces: { tap: [null, 'heart', 'kiss', 'shy', 'smileA', 'cozy'], food: 'cozy', big: 'smileA', idle: [null, 'smileA', 'cozy', 'heart'], rare: 'teary', wake: 'cozy', cap: 'smileA', over: 'cozy', joy: 'heart', tickle: 'shy' },
    head: ["花瓣會掉下來喔，輕輕的就好～", "摸摸頭，我也摸摸你的心情。"],
    belly: ["好癢～你今天心情好嗎？", "肚子暖暖的，因為你在。"],
    cheek: ["臉頰被你戳紅了啦⋯", "軟軟的吧？今天辛苦了。"],
    tap: ["我在這裡喔。", "嗯？有什麼想跟我說的嗎？", "輕輕的就好喔，我會害羞呢。", "今天過得還順利嗎？", "慢慢來，我陪著你。", "要不要先喝口水再記呢？", "你來了，我好開心。"],
    feed: (n) => ["記好囉，辛苦你了。", "這筆我收下了，謝謝你記得它。", "嗯，都記好了，很細心呢。", "一筆一筆累積起來，都是你的用心。", "好的，放心交給我吧。"].map(l => `$${n} ${l}`),
    small: (n) => ["記好囉，辛苦你了。", "這筆我收下了，謝謝你記得它。", "嗯，都記好了，很細心呢。", "一筆一筆累積起來，都是你的用心。", "好的，放心交給我吧。"].map(l => `$${n} ${l}`),
    big: (n) => ["這筆有點大呢，我先記下來，需要的話我們再一起看。", "花了比較多，是有特別的需要嗎？我幫你記好了。", "沒關係，重要的支出本來就值得好好記下。"].map(l => `$${n}，${l}`),
    idle: ["今天一切都還好嗎？", "我在旁邊陪著你喔。", "不用急，有空再記就好。", "記得適時休息一下喔。"],
    morning: ["早安，今天也請慢慢來喔。", "嗯……早安，我準備好陪你了。"],
    switchIn: ["今天換我陪你，請多多指教。", "我是淺櫻，請讓我好好照顧你的帳本。"],
    cap70: ["這個月用了七成了，要不要一起看看接下來的安排呢？", "已經七成囉，後面我們放慢一點腳步，好嗎？"],
    cap90: ["快九成了，剩下的日子我們一筆一筆小心地走，好嗎？", "接近額度了，不用緊張，我們一起規劃剩下的天數。"],
    capOver: ["這個月有點超過了，不要太苛責自己喔。我們一起看哪裡可以調整。", "超過也沒關係，你已經很努力了。下個月我們再慢慢來。", "我知道不容易，先抱抱你。接下來一起想辦法。"],
    streak3: "連續 3 天了，你有好好照顧自己呢。",
    streak7: "連續第 7 天，你真的很用心。",
    streak30: "連續 30 天了，這份堅持我都看在眼裡。",
    monthStart: ["新的一個月，我們一起慢慢開始吧。"],
    monthEnd: ["這個月快結束了，辛苦你了。", "月底了，回頭看看這個月，你已經做得很好了。"],
    evening: ["今天辛苦了，早點休息喔。", "晚上好，記完這一筆就可以放鬆了。"],
    rare: ["你每天都有回來記帳，你有好好照顧自己，我都看見了。✦", "慢慢來也沒關係，你已經走得很遠了。✦", "謝謝你願意記下每一筆，這份用心很珍貴。✦"],
  },
  breeze: {
    trait: "慵懶・療癒",
    faces: { tap: [null, 'halflid', 'yawn', 'smileB', 'doze', 'daze', 'cozy'], food: 'cozy', big: 'daze', idle: [null, 'yawn', 'halflid', 'doze', 'daze'], rare: 'cozy', wake: 'yawn', cap: 'halflid', over: 'cozy', joy: 'cozy', tickle: 'smileB' },
    head: ["頭上的紅豆⋯不要偷吃喔。", "頭⋯頭不要壓，會扁。"],
    tap: ["欸～被你戳醒了。", "嗯？……我還在。", "戳我也好，反正我很軟～", "唔……要記帳了嗎？", "慢慢來，不急～", "今天也辛苦了，坐下來休息一下吧。", "圓滾滾的我，戳起來舒服嗎？"],
    feed: (n) => ["嗯～吃進來了，慢慢來就好。", "好喔～記好了。", "咕嚕……收到。", "一筆而已，不用太認真～", "嗯，記著了，你很穩欸。"].map(l => `$${n} ${l}`),
    small: (n) => ["嗯～吃進來了，慢慢來就好。", "好喔～記好了。", "咕嚕……收到。", "一筆而已，不用太認真～", "嗯，記著了，你很穩欸。"].map(l => `$${n} ${l}`),
    big: (n) => ["欸……這筆有點大耶，吃得我有點撐。", "這筆不小欸……沒事，記下來就好。", "嗯？這麼多？深呼吸……記好了。"].map(l => `$${n}，${l}`),
    idle: ["嗯……好想睡一下。", "要不要喝杯茶再記～", "我在發呆，不用管我。", "今天天氣不錯吧……雖然我沒看窗外。"],
    morning: ["哈～早安，慢慢來喔。", "嗯……醒了，今天也慢慢過吧。"],
    switchIn: ["換我了喔～慢慢來。", "我是青露，請多指教……嗯，慢慢的。"],
    cap70: ["七成了欸……不急，我們慢慢數。", "這個月過七成了喔～後面稍微收一點就好。"],
    cap90: ["九成了欸……先喝口茶，我們慢慢規劃剩下的日子。", "快到額度了喔，不急，一筆一筆來就好。"],
    capOver: ["超過囉……先深呼吸，下個月我們慢慢補回來。", "超了就超了，記下來就好。喝口茶，再慢慢看。", "唔……沒事的，這個月已經過去了，我們看下個月。"],
    streak3: "連續 3 天欸～不錯喔。",
    streak7: "連續第 7 天，你很穩欸。",
    streak30: "連續 30 天……我都要佩服你了。",
    monthStart: ["新的一個月欸……慢慢開始吧～"],
    monthEnd: ["月底囉……這個月辛苦了。", "這個月快結束了～回頭看看，其實你做得不錯喔。"],
    evening: ["今天也夠了，去休息吧～", "晚上了欸……記完這筆就收工，好不好？"],
    rare: ["你一直都有回來記帳，這件事其實很不容易，真的。✦", "慢慢來的人，也是會走到的，你已經在路上了。✦", "不用每天都完美，你還願意回來，這樣就很好了。✦"],
  },
  cryo: {
    trait: "傲嬌・冷靜",
    faces: { tap: [null, 'cold', 'shy', 'hmph', 'smileA'], food: 'smileA', big: 'cold', idle: [null, 'cold', 'shy', 'smileA'], rare: 'praise', wake: 'cold', cap: 'cold', over: 'smileA', joy: 'smileA', tickle: 'shy' },
    head: ["⋯⋯冰冠不准亂摸。", "雪會掉下來的。⋯⋯算了。"],
    tap: ["幹嘛。……有事就說。", "別一直戳。……好吧，再一下。", "我才沒有在等你。", "看什麼？我只是剛好在這裡。", "……你今天看起來有點累，別硬撐。", "哼，這麼閒的話，先去記帳。", "要戳就戳，別戳到一半停手。"],
    feed: (n) => ["……記好了。別得意。", "嗯，收到。至少你還記得來。", "這筆我記了。……做得不錯。", "哼，算你有認真。", "記好了。不用謝我。"].map(l => `$${n} ${l}`),
    small: (n) => ["……記好了。別得意。", "嗯，收到。至少你還記得來。", "這筆我記了。……做得不錯。", "哼，算你有認真。", "記好了。不用謝我。"].map(l => `$${n} ${l}`),
    big: (n) => ["……這筆不小。我只提醒這一次。", "花這麼多？……算了，記好了，你自己有數就好。", "這筆我記下了。別問我值不值得，你自己知道。"].map(l => `$${n}，${l}`),
    idle: ["……我才沒有在看你。", "今天還沒記帳吧？我可沒有催你。", "無聊。……你什麼時候要來？", "我在這裡，不是因為等你。"],
    morning: ["……早。別太早找我說話。", "嗯？天亮了。……去做你的事吧。"],
    switchIn: ["這次換我。……別嫌我話少。", "我是冰晶。有事就說，別囉嗦。"],
    cap70: ["七成了。我只提醒一次，你自己看著辦。", "這個月過七成了。……後面別亂花。"],
    cap90: ["九成了。……我是為你好，後面小心點。", "快到額度了。別說我沒提醒你。"],
    capOver: ["超過了。……不准自責，我們重新排。", "超了就超了。……哭喪著臉做什麼，下個月再來。", "這個月超過了。……但你有記下來，這點我承認。"],
    streak3: "連續 3 天。……還行。",
    streak7: "連續第 7 天。……還不錯，我才沒有在偷看。",
    streak30: "連續 30 天。……我承認，你很厲害。",
    monthStart: ["新的一個月。……重新開始，別拖拖拉拉。"],
    monthEnd: ["月底了。……這個月，你撐得不錯。", "這個月快結束了。……辛苦了，雖然我不會再說第二次。"],
    evening: ["這麼晚還在記？……辛苦了。快去睡。", "夜深了。……記完就休息，這是命令。"],
    rare: ["……你每天都有回來記帳，很了不起。只說這一次。✦", "我才不會隨便稱讚人。……但你值得。✦", "別小看自己。……這段時間你做得很好，我都有看到。✦"],
  },
  geo: {
    trait: "沉穩・可靠",
    faces: { tap: [null, 'focus', 'smirk', 'rest', 'puff'], food: 'rest', big: 'focus', idle: [null, 'rest', 'focus'], rare: 'relief', wake: 'rest', cap: 'focus', over: 'rest', joy: 'smirk', tickle: 'puff' },
    head: ["頭上的巧克力是裝飾，不能吃。", "嗯，輕一點就好。"],
    tap: ["我在。", "想說什麼就說，我聽著。", "嗯，有我在，放心。", "今天還順利嗎？", "不急，慢慢來。我在這裡守著。", "需要我提醒什麼，說一聲就好。", "坐一下吧，我陪你把今天整理完。"],
    feed: (n) => ["這筆我記下了。", "好，記好了。放心。", "收到。這筆我會幫你看著。", "嗯，記錄完成，做得好。", "記下來了，這就是穩定的開始。"].map(l => `$${n} ${l}`),
    small: (n) => ["這筆我記下了。", "好，記好了。放心。", "收到。這筆我會幫你看著。", "嗯，記錄完成，做得好。", "記下來了，這就是穩定的開始。"].map(l => `$${n} ${l}`),
    big: (n) => ["這筆金額較大，我已經記下。需要的話，我們之後一起回頭看。", "嗯，這筆不小。記好了，接下來幾天我幫你留意。", "大額支出我記下了。你有你的理由，我相信。"].map(l => `$${n}，${l}`),
    idle: ["我在。", "一切都還穩嗎？", "今天有什麼需要整理的，隨時告訴我。", "我就在這裡，有需要再叫我。"],
    morning: ["早。今天一起穩穩地過。", "嗯，我醒了。今天有我看著。"],
    switchIn: ["換我來盯著你了。放心。", "我來了。今天一起慢慢來。"],
    cap70: ["這個月過七成了。後面我會幫你盯著，需要時再提醒你。", "七成了。節奏還在掌握中，我們繼續穩著走。"],
    cap90: ["已經九成了。剩下的天數，我們精打細算，穩住就好。", "快到額度了。從現在開始，每一筆我們一起確認。"],
    capOver: ["超過額度了。這筆已經發生，我們把剩下的天數穩住。", "超過了。不用急著檢討，先記清楚，下個月我們再調整。", "這個月超了一些。你有記下來，這就是最重要的。"],
    streak3: "連續 3 天了。好的開始。",
    streak7: "連續第 7 天了。能持續記帳，本身就是很大的本事。",
    streak30: "連續 30 天。這份穩定，不是人人都做得到。",
    monthStart: ["新的一個月。我們從頭穩穩地來。"],
    monthEnd: ["月底了。這個月你守得住，我都看著。", "這個月快結束了。回頭看看，你比想像中穩。"],
    evening: ["今天辛苦了。收工吧，剩下的明天我看著。", "夜深了。把今天放下，好好休息。"],
    rare: ["一路走到現在，你比你以為的更穩。我都看著。✦", "能每天回來記帳，是很扎實的習慣。我替你高興。✦", "你今天做的，我都記在心裡。這份努力不白費。✦"],
  },
};
Object.keys(PERSONA_NEW).forEach(k => { PERSONA[k] = { ...PERSONA[k], ...PERSONA_NEW[k], greet: { ...PERSONA[k].greet, night: [...PERSONA[k].greet.night, ...PERSONA_NEW[k].evening] } }; });
// 擴充台詞（更多、隨機、不連續重複）
const PERSONA_MORE = {
 "amber": {
  "tap": [
   "戳一下，元氣補充完成！",
   "今天的你也很可以！",
   "嘿嘿，你來找我玩嗎？",
   "我剛剛在練習跳高喔！",
   "要不要比賽誰先記完今天的帳？",
   "被你戳到，充電 100%！",
   "有我在，記帳不無聊！",
   "再一下下就好，我還想玩！",
   "你一來我就精神起來了！",
   "今天天氣怎樣？我都覺得很棒！"
  ],
  "idle": [
   "（原地小跳步）",
   "（檸檬片轉了一圈）",
   "我在數今天記了幾筆～",
   "等你回來一起記！",
   "（哼著輕快的歌）",
   "今天也要加油喔！",
   "錢包好像在叫我～記一下吧！"
  ],
  "feed": [
   "記好了！動作好快！",
   "收到收到～下一筆也交給我！",
   "咻～記進去了！",
   "好耶！又完成一筆！",
   "這筆我記得清清楚楚！"
  ]
 },
 "pyro": {
  "tap": [
   "今天有沒有好好吃飯呢？",
   "累了的話，靠一下也可以喔。",
   "我一直都在這裡。",
   "你的手好暖。",
   "有什麼煩惱，可以慢慢說。",
   "今天也辛苦了。",
   "嗯，我在聽喔。",
   "被你摸摸，好安心。",
   "要記得多喝水喔。",
   "今天有遇到開心的事嗎？"
  ],
  "idle": [
   "（輕輕整理頭上的花瓣）",
   "今天的風好溫柔。",
   "（安靜地陪在旁邊）",
   "慢慢來，不用急。",
   "忙完了嗎？記得休息喔。",
   "（花瓣輕輕飄了一下）",
   "有空的時候再來找我就好。"
  ],
  "feed": [
   "記好了，謝謝你這麼用心。",
   "嗯，這筆我好好收著。",
   "每一筆都是你好好生活的證明。",
   "記下來了，放心喔。",
   "辛苦了，這筆也幫你收好了。"
  ]
 },
 "breeze": {
  "tap": [
   "欸⋯⋯戳我做什麼～",
   "嗯～⋯⋯我在。",
   "要一起躺一下嗎～",
   "今天的雲好慢喔～",
   "不急不急，慢慢來～",
   "我在曬太陽⋯⋯別動。",
   "唔⋯⋯剛剛差點睡著。",
   "抹茶要慢慢喝，日子也是～",
   "你也放鬆一下肩膀吧～",
   "欸，你今天也很努力了。"
  ],
  "idle": [
   "（慢慢眨眼）⋯⋯",
   "（紅豆滾了一下）",
   "好想睡⋯⋯",
   "嗯～今天就這樣也不錯。",
   "（發呆中，請勿打擾）",
   "天氣適合喝杯熱茶～",
   "你忙你的，我在旁邊躺著～"
  ],
  "feed": [
   "嗯～記好了，可以休息了吧。",
   "收下了～慢慢來就好。",
   "好～這筆躺進帳本了。",
   "記完了，喝口茶吧～",
   "欸，記得好快，好厲害。"
  ]
 },
 "cryo": {
  "tap": [
   "⋯⋯幹嘛。",
   "不要一直戳。⋯⋯算了。",
   "我沒有在等你。",
   "⋯⋯今天的帳記了嗎。",
   "哼，手很冰吧。",
   "別誤會，我只是剛好在這。",
   "⋯⋯你今天看起來還行。",
   "安靜一點。我在想事情。",
   "⋯⋯再戳一次就不理你。",
   "我會記著。你不用擔心。"
  ],
  "idle": [
   "⋯⋯（看向別處）",
   "（雪冠閃了一下）",
   "⋯⋯還沒記的，快記。",
   "我才不無聊。",
   "⋯⋯好安靜。也不錯。",
   "（假裝沒在看你）",
   "⋯⋯你在忙就好。"
  ],
  "feed": [
   "⋯⋯記好了。",
   "嗯。收到。",
   "這筆我記了，別擔心。",
   "⋯⋯還算有紀律。",
   "記得很準時。⋯⋯不是在誇你。"
  ]
 },
 "geo": {
  "tap": [
   "我在。",
   "需要什麼，說一聲。",
   "今天的進度，穩穩的。",
   "別急，一步一步來。",
   "我看著呢，放心。",
   "嗯，有事找我。",
   "你做得比你想的好。",
   "先把今天顧好就好。",
   "累了就停一下，帳我守著。",
   "穩住，沒問題的。"
  ],
  "idle": [
   "（安靜地坐著）",
   "（把帳本對了一遍，沒問題）",
   "我在，你忙你的。",
   "水喝了嗎？",
   "今天的節奏不錯。",
   "（巧克力塊閃了一下光）",
   "有需要再叫我。"
  ],
  "feed": [
   "記好了。穩。",
   "收到，這筆我管著。",
   "好，帳目清楚。",
   "嗯，又一筆，做得好。",
   "記下了，繼續保持這個節奏。"
  ]
 }
};
Object.keys(PERSONA_MORE).forEach(k => {
  const p = PERSONA[k], m = PERSONA_MORE[k];
  p.tap = [...p.tap, ...m.tap]; p.idle = [...p.idle, ...m.idle];
  const f0 = p.feed, s0 = p.small;
  p.feed = (n, c) => [...f0(n, c), ...m.feed.map(l => `$${n} ${l}`)];
  p.small = (n) => [...s0(n), ...m.feed.map(l => `$${n} ${l}`)];
});
// 晨風青露：更懶的台詞與表情
{ const b = PERSONA.breeze; Object.assign(b, BREEZE_LAZY); b.faces = { ...b.faces, ...BREEZE_LAZY.faces }; b.greet = { ...b.greet, ...BREEZE_LAZY.greet }; POCKET_FULL.breeze = POCKET_FULL_BREEZE; }
const personaOf = (id) => PERSONA[id] || PERSONA.amber;
// 表情要對得上台詞：極光只有真的在凶人時才鼓臉，其餘都是冷冷的半睜眼
const faceFor = (id, text, def) => {
  const angry = /不准|幹嘛|煩|活該|不要一直|別一直|吵醒|才沒|哼|不是|不用/.test(text);
  const bashful = /才沒|臉|紅|只說這一次|捨不得|忘掉|看你|偷偷|辛苦|承認|謝/.test(text);
  const praise = /很棒|厲害|不錯|做得|了不起|不簡單|有毅力/.test(text);
  if (id === 'cryo') {
    if (praise) return 'praise';
    if (angry) return 'hmph';
    if (bashful) return 'shy';
    return (def === 'hmph' || def === 'shy') ? 'cold' : def;
  }
  if (id === 'breeze') {
    if (/哈欠|呼啊|打了/.test(text)) return 'yawn';
    if (/睡|睏|晚安|五分鐘|十分鐘|閉上|夢|呼……/.test(text)) return 'doze';
    if (/撐住|電量|累|躺|不想動|懶|沒力/.test(text)) return 'halflid';
    if (/發呆|什麼都不做|思考|飄不動/.test(text)) return 'daze';
    if (/好吃|暖|舒服|茶|鼓掌|謝謝|溫柔|慢慢嚼/.test(text)) return 'cozy';
    return def;
  }
  if (id === 'geo') {
    if (angry && def !== null) return 'puff';
  }
  return def;
};
const spk4 = (x, y, r) => `M ${x},${y - r} Q ${x + r * 0.18},${y - r * 0.18} ${x + r},${y} Q ${x + r * 0.18},${y + r * 0.18} ${x},${y + r} Q ${x - r * 0.18},${y + r * 0.18} ${x - r},${y} Q ${x - r * 0.18},${y - r * 0.18} ${x},${y - r} Z`;
const _lastPick = new WeakMap();
const pickOne = (arr) => {
  if (!arr || !arr.length) return undefined;
  if (arr.length < 3) return arr[Math.floor(Math.random() * arr.length)];
  const recent = _lastPick.get(arr) || [];
  const pool = arr.map((_, i) => i).filter(i => !recent.includes(i));
  const i = pool[Math.floor(Math.random() * pool.length)];
  _lastPick.set(arr, [...recent, i].slice(-Math.min(3, arr.length - 1)));
  return arr[i];
};

// 稀有台詞（偶爾出現）
const RARE_WHISPERS = [
  '偷偷告訴你，被你餵的時候是我最開心的時候 ✦',
  '哼，今天就特別允許你多摸我一下 ✦',
  '不管今天多累，回來看我就好了 ✦',
];
// 節日問候（固定日期）
const FESTIVAL_LINES = {
  '01-01': '新年快樂！今年也一起把日子過得暖暖的 ✨', '02-14': '情人節快樂～今天也對自己好一點',
  '12-24': '平安夜，今晚吃點好吃的吧', '12-25': '聖誕快樂！我也想要禮物⋯⋯', '12-31': '一年的最後一天，辛苦了',
  '03-20': '春天到了，空氣都變軟了', '06-21': '夏至了，記得多喝水', '09-23': '秋天到了，最適合烤點心', '12-21': '冬至了，要吃湯圓喔',
};
const MOOD_OPTIONS = [
  { v: 1, label: '很糟', line: '今天辛苦了，什麼都不用想，早點睡。' },
  { v: 2, label: '有點累', line: '累的話，記完就去休息吧。' },
  { v: 3, label: '普通', line: '普通的一天，也是好好過完的一天。' },
  { v: 4, label: '不錯', line: '不錯耶，我也跟著開心起來了！' },
  { v: 5, label: '超好', line: '太棒了！今天值得記下來 ✨' },
];

// 示範資料：上個月 1 日到今天（正式使用前可在消化圖頁最下方清除）
function makeDemoData(today) {
  let seed = 20261107;
  const rnd = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
  const r = (a, b) => Math.round((a + rnd() * (b - a)) / 5) * 5;
  const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
  const txs = []; const moods = {}; let n = 1;
  const add = (date, categoryId, amount, note, period) => txs.push({ id: `demo_${n++}`, categoryId, amount, date, note, type: 'expense', period, weather: '' });
  const [ty, tm] = today.split('-').map(Number);
  const first = new Date(ty, tm - 2, 1);
  for (let d = new Date(first); toDateStr(d) <= today; d.setDate(d.getDate() + 1)) {
    const date = toDateStr(d); const dow = d.getDay(); const work = dow >= 1 && dow <= 5; const isToday = date === today;
    if (work && rnd() < 0.8) add(date, 'breakfast', r(55, 110), pick(['蛋餅豆漿', '晨間拿鐵', '飯糰']), '早晨');
    if (work && !isToday) add(date, 'lunch', r(95, 170), pick(['便當', '紅燒牛肉湯麵', '均衡舒肥餐盒', '咖哩飯']), '午後');
    if (rnd() < 0.8 && !isToday) add(date, 'dinner', r(130, 320), pick(['日式定食', '溫暖小火鍋', '滷味', '下班輕食沙拉']), '夜晚');
    if (work && rnd() < 0.85) add(date, 'transit', r(35, 60), '捷運通勤', '早晨');
    if (!isToday && dow === 6 && rnd() < 0.9) add(date, 'grocery', r(380, 900), '超市採買', '早晨');
    if (!isToday && !work && rnd() < 0.4) add(date, 'leisure', r(200, 420), pick(['午後甜點咖啡', '院線電影票', '獨立書店選書']), '午後');
    if (!isToday) { const w = rnd(); moods[date] = work ? (w < .12 ? 1 : w < .4 ? 2 : w < .75 ? 3 : w < .93 ? 4 : 5) : (w < .3 ? 3 : w < .7 ? 4 : 5); }
  }
  const back = (k) => { const x = new Date(today + 'T00:00:00'); x.setDate(x.getDate() - k); return toDateStr(x); };
  add(back(12), 'grooming', 800, '質感洗剪', '午後');
  add(back(20), 'gift', 600, '朋友生日心意', '夜晚');
  return { txs, moods };
}

// 預設清空所有既有金額與紀錄（全新 $0 帳本開始）
const INITIAL_TRANSACTIONS = [];

// 溫柔、貪吃與傲嬌的日常寵物小對話（點擊史萊姆時浮現，2.2秒後自動淡出不擋角色）
const WARM_WHISPERS = [
  '哼～才不是一直在等你打開帳本呢，只是肚子剛好餓了而已！✨',
  '今天也辛苦了，留點時間給自己泡杯熱茶、摸摸我吧 🍵',
  '主人今天好自律！我也要乖乖保持最 Q 彈的果凍狀態～',
  '偶爾吃頓好料的犒賞自己很棒喔，我的肚子隨時準備好幫你消化！',
  '不用每件事都做到滿分，現在認真生活的你已經超棒了 🌿',
  '摸摸柔軟的自己，今晚算完帳就早點休息、睡個好覺吧 🌙',
  '戳我一下會變軟Q喔～再戳一下我就把你的煩惱也吃掉！💛'
];

// ==========================================
// 1 年長期陪伴成長階段 (完全移除頭頂嫩芽與多餘配件，純粹透過體型圓潤度、內部星砂與光澤展現成長)
// ==========================================
const COMPANION_MILESTONES = [
  { 
    id: 'day1', days: 1, label: 'Day 1・初遇小不點', scale: 0.84, 
    desc: '剛來到你身邊的迷你果凍，眼神充滿好奇與依賴。',
    feature: 'tiny'
  },
  { 
    id: 'day30', days: 30, label: 'Day 30・溫潤凝膠', scale: 0.93, 
    desc: '連續陪伴滿一個月！果凍身體變得更加晶瑩剔透、Q彈有光澤。',
    feature: 'glossy'
  },
  { 
    id: 'day90', days: 90, label: 'Day 90・微光星砂', scale: 1.0, 
    desc: '陪伴滿一季囉！晶瑩剔透的果凍肚子裡浮現了溫暖流動的微光星砂。',
    feature: 'stardust'
  },
  { 
    id: 'day180', days: 180, label: 'Day 180・圓潤飽滿', scale: 1.06, 
    desc: '半年來的默契陪伴，讓它的體態更加圓潤飽滿，臉頰總是泛著幸福紅暈。',
    feature: 'glow'
  },
  { 
    id: 'day365', days: 365, label: 'Day 365・一週年老朋友', scale: 1.11, 
    desc: '滿一週年的珍貴羈絆！散發著最溫暖柔和的珍珠內發光，是最懂你的生活夥伴。',
    feature: 'pearl'
  },
  { 
    id: 'hungry', days: 128, label: '3天未記帳・委屈想你', scale: 0.80, 
    desc: '好幾天沒看到你打開帳本，身體稍微縮水了一點，水汪汪地等著你回來餵食。',
    feature: 'hungry'
  }
];

// ==========================================
// 精選 5 款無底座 3D 元素麻糬果凍史萊姆（純淨無芽、無紫色與綠色角色）
// ==========================================
const SPIRITS = [
  {
    id: 'amber', hand: ['#FFF6C2', '#FCE765', '#F1CD3F'], name: '暖陽檸光', elementTag: '元氣・直率', emoji: '🍋',
    tagline: '頭頂一片檸檬的元氣果凍，記帳像一起過關的小遊戲',
    primary: '#D97706', secondary: '#FBBF24', accentText: '#B45309', darkAccentText: '#FBBF24',
    eyeRim: '#D97706', mouth: '#B45309',
    rayColor: 'rgba(251, 191, 36, 0.25)', glowColor: 'rgba(245, 158, 11, 0.30)',
    bodyStops: ['#FFFBEB', '#FDE047', '#F59E0B', '#D97706', '#92400E'],
    img: { s: 0.92, bottom: 0.891, fx: -5, fy: 4 },
    feel: { sq: 0.76, rb: 1.05, dur: 0.75 },
  },
  {
    id: 'breeze', hand: ['#D9EA8C', '#A4B83E', '#6F8526'], name: '晨風青露', elementTag: '慵懶・療癒', emoji: '🍵',
    tagline: '抹茶紅豆口味的慢節奏果凍，提醒你累了就先休息',
    primary: '#65A30D', secondary: '#BEF264', accentText: '#4D7C0F', darkAccentText: '#BEF264',
    eyeRim: '#4D7C0F', mouth: '#3F6212',
    rayColor: 'rgba(190, 242, 100, 0.25)', glowColor: 'rgba(132, 204, 22, 0.28)',
    bodyStops: ['#F7FEE7', '#D9F99D', '#A3E635', '#65A30D', '#365314'],
    img: { s: 0.92, bottom: 0.907, fx: 0, fy: 6 },
    feel: { sq: 0.7, rb: 1.03, dur: 1.0 },
  },
  {
    id: 'cryo', hand: ['#CDEBFD', '#68B5E9', '#2F80C4'], name: '極光冰晶', elementTag: '傲嬌・冷靜', emoji: '❄️',
    tagline: '戴著雪冠的冰晶果凍，話不多，但都替你記著',
    primary: '#0284C7', secondary: '#7DD3FC', accentText: '#0369A1', darkAccentText: '#7DD3FC',
    eyeRim: '#1D4ED8', mouth: '#1E40AF',
    rayColor: 'rgba(125, 211, 252, 0.26)', glowColor: 'rgba(56, 189, 248, 0.30)',
    bodyStops: ['#F0F9FF', '#BAE6FD', '#7DD3FC', '#38BDF8', '#0369A1'],
    img: { s: 0.9, bottom: 0.932, fx: -14, fy: 10 },
    feel: { sq: 0.82, rb: 1.04, dur: 0.6 },
  },
  {
    id: 'pyro', hand: ['#FFE4EE', '#FAA8B3', '#F07FA6'], name: '春霧淺櫻', elementTag: '溫柔・細心', emoji: '🌸',
    tagline: '頭頂一朵櫻花的溫柔果凍，先接住你的心情再記帳',
    primary: '#DB2777', secondary: '#F9A8D4', accentText: '#BE185D', darkAccentText: '#F9A8D4',
    eyeRim: '#DB2777', mouth: '#BE185D',
    rayColor: 'rgba(249, 168, 212, 0.26)', glowColor: 'rgba(244, 114, 182, 0.28)',
    bodyStops: ['#FDF2F8', '#FBCFE8', '#F9A8D4', '#EC4899', '#9D174D'],
    img: { s: 0.84, bottom: 0.957, fx: 0, fy: 6 },
    feel: { sq: 0.73, rb: 1.04, dur: 0.85 },
  },
  {
    id: 'geo', hand: ['#F6C08E', '#D6742D', '#A3533C'], name: '暮色可可', elementTag: '沉穩・可靠', emoji: '🍫',
    tagline: '頂著巧克力塊的沉穩果凍，安靜地替你守住每一筆',
    primary: '#92400E', secondary: '#D6A77A', accentText: '#7C2D12', darkAccentText: '#FDBA74',
    eyeRim: '#7C2D12', mouth: '#7C2D12',
    rayColor: 'rgba(214, 167, 122, 0.24)', glowColor: 'rgba(146, 64, 14, 0.24)',
    bodyStops: ['#FFF7ED', '#C77A3E', '#A0522D', '#7C2D12', '#431407'],
    img: { s: 0.9, bottom: 0.927, fx: 0, fy: 0 },
    feel: { sq: 0.75, rb: 1.02, dur: 0.85 },
  }
];

// ==========================================
// 核心視覺：無底座 3D 元素麻糬果凍史萊姆 (移除嫩芽與配件，純淨果凍光影)
// ==========================================
const ElementalMochiSlime = ({
  spirit,
  milestone,
  moodState,
  feedingAnim,
  celebrating,
  squishKey,
  whisperText,
  onTapSlime,
  onSwipeLeft,
  onSwipeRight,
  theme,
  timePeriod,
  sleeping,
  giggling,
  onRub,
  mini = false,
  miniScale = 0.5,
  look = null,
  whisperFeed = null,
  whisperMs = 2300,
  glowing = false,
  bodyAnimClass = '',
  pokeFx = null,
  whisperKeyProp = 0,
  exprStill = false,
  expr = null,
  whisperRare = false,
  onCharge = null,
  shape = null
}) => {
  const SH = shape && BODY_SHAPES[shape];
  const featDy = SH ? SH.dy : 0;
  const [touchStart, setTouchStart] = useState(null);
  // 按壓回饋：按住蓄力（越久越扁，放開跳越高）、按住拖動會被拉長（捏捏紓壓）
  const pressRef = useRef(null);
  const pr = useRef({ down: false, x0: 0, y0: 0, t0: 0, moved: false, raf: 0, flips: 0, lastX: 0, dir: 0, rubbed: false, suppress: false });
  const pressDown = (e) => {
    if (mini || feedingAnim.active) return;
    const p = pr.current;
    Object.assign(p, { down: true, x0: e.clientX, y0: e.clientY, t0: performance.now(), moved: false, flips: 0, lastX: e.clientX, dir: 0, rubbed: false, suppress: false });
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
    // 按下去的果凍漣漪（舒壓手感）
    try {
      const host = pressRef.current; const r = host.getBoundingClientRect();
      const dot = document.createElement('span');
      const sz = 70;
      Object.assign(dot.style, { position: 'absolute', left: `${e.clientX - r.left - sz / 2}px`, top: `${e.clientY - r.top - sz / 2}px`, width: `${sz}px`, height: `${sz}px`, borderRadius: '50%', pointerEvents: 'none', zIndex: 40, border: '3px solid rgba(255,255,255,.95)', boxShadow: `0 0 12px ${spirit.primary}66, inset 0 0 10px rgba(255,255,255,.7)`, background: 'radial-gradient(circle, rgba(255,255,255,.6) 0%, rgba(255,255,255,.15) 55%, transparent 70%)' });
      host.appendChild(dot);
      const an = dot.animate([{ transform: 'scale(.25)', opacity: 0.9 }, { transform: 'scale(1.25)', opacity: 0 }], { duration: 520, easing: 'cubic-bezier(.2,.8,.3,1)' });
      an.onfinish = () => dot.remove();
    } catch {}
    const loop = () => {
      if (!p.down) return;
      const el = pressRef.current;
      if (el && !p.moved) {
        const held = performance.now() - p.t0;
        { const t = Math.min(held / 1100, 1); const q = spirit.feel ? 1 - spirit.feel.sq : 0.2; const d = q * (0.75 + 0.6 * t) * Math.min(1, held / 90 + 0.35); el.style.transform = `scale(${1 + d * 0.8}, ${1 - d})`; }
      }
      p.raf = requestAnimationFrame(loop);
    };
    p.raf = requestAnimationFrame(loop);
  };
  const pressMove = (e) => {
    const p = pr.current; if (!p.down) return;
    const dx = e.clientX - p.x0, dy = e.clientY - p.y0;
    if (!p.moved && Math.hypot(dx, dy) > 10) p.moved = true;
    if (!p.moved) return;
    const el = pressRef.current;
    // 只做上下壓縮／拉長，不左右晃
    const sy = 1 + Math.max(-0.2, Math.min(0.22, -dy / 260));
    const sx = 1 / Math.sqrt(sy);
    if (el) el.style.transform = `scale(${sx}, ${sy})`;
    const ddx = e.clientX - p.lastX;
    if (Math.abs(ddx) > 6) {
      const d = ddx > 0 ? 1 : -1;
      if (p.dir && d !== p.dir) p.flips += 1;
      p.dir = d; p.lastX = e.clientX;
      if (p.flips >= 3 && !p.rubbed) { p.rubbed = true; onRub && onRub(); }
    }
  };
  const pressUp = (e) => {
    const p = pr.current; if (!p.down) return;
    p.down = false; cancelAnimationFrame(p.raf);
    const el = pressRef.current; if (!el) return;
    const held = performance.now() - p.t0;
    const cur = el.style.transform || 'none';
    el.style.transform = '';
    if (p.moved) {
      p.suppress = true;
      el.animate([{ transform: cur }, { transform: 'scale(1.08, 0.92)' }, { transform: 'scale(0.96, 1.05)' }, { transform: 'scale(1.02, 0.98)' }, { transform: 'none' }], { duration: 650, easing: 'ease-out' });
    } else if (held > 260) {
      p.suppress = true;
      const t = Math.min(held / 1100, 1); const h = 30 + 90 * t;
      el.animate([{ transform: cur }, { transform: `translateY(-${h}px) scale(0.9, 1.12)`, offset: 0.4 }, { transform: 'translateY(0) scale(1.14, 0.86)', offset: 0.75 }, { transform: 'scale(0.97, 1.03)', offset: 0.88 }, { transform: 'none' }], { duration: 620 + t * 300, easing: 'cubic-bezier(.3,.7,.4,1)' });
      onCharge && onCharge(t);
    } else if (e && e.type === 'pointerup') {
      // 短按：自己處理點擊（避免指標鎖定後點擊事件跑掉）
      p.suppress = true;
      onTapSlime && onTapSlime({ currentTarget: el, clientX: e.clientX, clientY: e.clientY });
    }
  };
  const rub = useRef({ lastX: 0, dir: 0, flips: 0, t0: 0, fired: false });

  const handleTouchStart = (e) => {
    const x = e.touches[0].clientX;
    setTouchStart(x);
    rub.current = { lastX: x, dir: 0, flips: 0, t0: Date.now(), fired: false };
  };
  // 手指在身上來回搓：方向反覆改變 3 次以上就會癢得笑
  const handleTouchMove = (e) => {
    const r = rub.current; const x = e.touches[0].clientX; const dx = x - r.lastX;
    if (Math.abs(dx) < 6) return;
    const d = dx > 0 ? 1 : -1;
    if (r.dir && d !== r.dir) r.flips += 1;
    r.dir = d; r.lastX = x;
    if (r.flips >= 3 && !r.fired && Date.now() - r.t0 < 2500) { r.fired = true; onRub && onRub(); }
  };
  const handleTouchEnd = (e) => {
    if (touchStart === null) return;
    setTouchStart(null);
  };

  const isSpawn = feedingAnim.phase === 'spawn';
  const isGrabbing = feedingAnim.phase === 'grabbing';
  const isEating = feedingAnim.phase === 'eating';
  const isFull = moodState === 'full';
  const isOver = moodState === 'over';
  const isHungry = milestone.feature === 'hungry';
  const hasStardust = ['stardust', 'glow', 'pearl'].includes(milestone.feature);
  const hasPearlAura = milestone.feature === 'pearl';

  const scaleVal = milestone.scale || 1;
  // 眨眼：每 4～6 秒閉眼 0.14 秒（只在平常大眼狀態）
  const [blinking, setBlinking] = useState(false);
  useEffect(() => {
    let t1, t2; let alive = true;
    const loop = () => { t1 = setTimeout(() => { if (!alive) return; setBlinking(true); t2 = setTimeout(() => { setBlinking(false); if (Math.random() < 0.2) { t2 = setTimeout(() => { setBlinking(true); setTimeout(() => setBlinking(false), 130); }, 180); } loop(); }, 140); }, 4000 + Math.random() * 2000); };
    loop();
    return () => { alive = false; clearTimeout(t1); clearTimeout(t2); };
  }, []);
  const growRank = ({ tiny: 0, glossy: 1, stardust: 2, glow: 3, pearl: 4 })[milestone.feature] || 0;


  // 日夜光暈顏色微調
  const ambientGlowColor = timePeriod === 'morning'
    ? 'rgba(251, 191, 36, 0.34)'
    : timePeriod === 'night'
    ? 'rgba(99, 102, 241, 0.32)'
    : spirit.glowColor;

  return (
    <div 
      className={mini ? 'relative flex items-center justify-center select-none pointer-events-none' : 'relative w-full h-[262px] mt-12 flex items-center justify-center select-none shrink-0'}
      onTouchStart={mini ? undefined : handleTouchStart}
      onTouchMove={mini ? undefined : handleTouchMove}
      onTouchEnd={mini ? undefined : handleTouchEnd}
    >
      {!mini && (<>
      {/* 1. 隨日夜時間變換的柔和呼吸光暈 */}
      <div 
        className="absolute w-[250px] h-[250px] rounded-full pointer-events-none transition-all duration-1000 animate-spin-ultra-slow"
        style={{
          background: `repeating-conic-gradient(from 0deg, ${spirit.rayColor} 0deg 20deg, transparent 20deg 40deg)`,
          filter: 'blur(18px)',
          opacity: theme === 'dark' ? 0 : timePeriod === 'night' ? 0.65 : 0.85,
          maskImage: 'radial-gradient(circle, black 25%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(circle, black 25%, transparent 70%)'
        }}
      />
      <div 
        className="absolute w-52 h-52 rounded-full pointer-events-none transition-all duration-1000"
        style={{
          background: `radial-gradient(circle, ${ambientGlowColor} 0%, transparent 72%)`,
          filter: 'blur(22px)',
          opacity: theme === 'dark' ? 0.35 : 1
        }}
      />

      {/* 夜晚模式專屬：漂浮的夜光微粒 */}
      {timePeriod === 'night' && (
        <div className="absolute inset-0 pointer-events-none">
          <span className="absolute top-8 left-16 w-1.5 h-1.5 rounded-full bg-amber-200/80 animate-ping" style={{ animationDuration: '3s' }} />
          <span className="absolute top-14 right-16 w-2 h-2 rounded-full bg-sky-200/70 animate-pulse" />
          <span className="absolute bottom-14 left-20 w-1.5 h-1.5 rounded-full bg-amber-100/60 animate-pulse" />
        </div>
      )}

      {/* 3. 輕觸或餵食後浮現的「傲嬌/貪吃/溫柔小對話」（2.2秒自動淡出，絕不擋住角色） */}
      {whisperText && !feedingAnim.active && (
        <div 
          key={`w${whisperKeyProp}`}
          className="absolute -top-12 z-30 max-w-[290px] px-4 py-2 rounded-2xl backdrop-blur-xl shadow-md text-center pointer-events-none animate-whisper-auto-fade"
          style={{
            backgroundColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.96)',
            border: whisperRare ? '2px solid #E9B949' : whisperFeed ? `2px solid ${spirit.secondary}` : `1px solid ${theme === 'dark' ? 'rgba(148, 163, 184, 0.35)' : 'rgba(230, 223, 210, 0.95)'}`,
            boxShadow: whisperRare ? '0 0 0 4px rgba(248, 227, 161, 0.55)' : undefined,
            animationDuration: `${whisperMs || 2300}ms`,
          }}
        >
          <p className={`text-[13px] font-medium leading-relaxed tracking-wide ${
            theme === 'dark' ? 'text-slate-100' : 'text-stone-700'
          }`}>
            {whisperFeed
              ? String(whisperText).split(`$${whisperFeed}`).map((part, i, arr) => (
                  <React.Fragment key={i}>
                    {part}
                    {i < arr.length - 1 && <strong className="font-extrabold" style={{ color: theme === 'dark' ? spirit.darkAccentText : spirit.primary }}>${whisperFeed}</strong>}
                  </React.Fragment>
                ))
              : whisperText}
          </p>
        </div>
      )}

      {/* 5. 左右切換史萊姆按鈕 */}
      <button
        onClick={onSwipeLeft}
        aria-label="切換上一隻史萊姆"
        className={`absolute left-0 z-20 p-3 rounded-full transition-all opacity-90 hover:opacity-100 active:scale-90 ${
          theme === 'dark' ? 'text-slate-200 bg-slate-800/70 hover:bg-slate-700' : 'text-stone-700 bg-white/75 hover:bg-white shadow-2xs'
        }`}
      >
        <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
      </button>
      <button
        onClick={onSwipeRight}
        aria-label="切換下一隻史萊姆"
        className={`absolute right-0 z-20 p-3 rounded-full transition-all opacity-90 hover:opacity-100 active:scale-90 ${
          theme === 'dark' ? 'text-slate-200 bg-slate-800/70 hover:bg-slate-700' : 'text-stone-700 bg-white/75 hover:bg-white shadow-2xs'
        }`}
      >
        <ChevronRight className="w-5 h-5 stroke-[2.2]" />
      </button>

      </>)}
      {/* 6. 無底座 3D 元素麻糬果凍史萊姆本體 */}
      <div className={bodyAnimClass} style={{ transition: 'filter .45s ease' , filter: glowing ? `brightness(1.12) drop-shadow(0 0 22px ${spirit.secondary})` : 'none' }}>
      <div
        ref={pressRef}
        style={{ transformOrigin: '50% 88%', touchAction: 'none', position: 'relative' }}
        onPointerDown={pressDown}
        onPointerMove={pressMove}
        onPointerUp={pressUp}
        onPointerCancel={pressUp}
        onTouchStart={mini ? undefined : (e) => e.stopPropagation()}
        onTouchMove={mini ? undefined : (e) => e.stopPropagation()}
        onTouchEnd={mini ? undefined : (e) => e.stopPropagation()}
        onClickCapture={(e) => { if (pr.current.suppress) { pr.current.suppress = false; e.stopPropagation(); } }}
      >
      <div key={`ex_${expr || 'none'}_${whisperKeyProp}`} className={expr && !exprStill && !feedingAnim.active && !sleeping ? ({ wink: 'expr-tilt', star: 'expr-bounce', surprised: 'expr-jumpback', pout: 'expr-pout', halflid: 'expr-droop', heart: 'expr-sway', happy: 'expr-bounce', yum: 'expr-bounce', kiss: 'expr-sway', shy: 'expr-tilt', sleepy: 'expr-droop', smug: 'expr-tilt', teary: 'expr-droop', yawn: 'expr-droop', smileA: 'expr-tilt', doze: 'expr-droop', cozy: 'expr-sway', spark: 'expr-bounce', laugh: 'expr-bounce', awe: 'expr-jumpback', shine: 'expr-bounce', wow: 'expr-jumpback', cheer: 'expr-bounce', praise: 'expr-tilt', relief: 'expr-sway', rest: 'expr-droop', smirk: 'expr-tilt', puff: 'expr-pout' })[expr] || '' : ''} style={{ transformOrigin: '50% 90%' }}>
      <div
        key={`${spirit.id}_${squishKey}_${milestone.id}`}
        onClick={onTapSlime}
        role="button"
        tabIndex={0}
        aria-label="點擊輕撫史萊姆"
        className={`relative z-10 cursor-pointer transition-all duration-500 ${
          giggling
            ? 'animate-giggle'
            : celebrating
            ? 'animate-celebrate-jump'
            : pokeFx && pokeFx.region === 'head'
            ? 'animate-poke-head'
            : pokeFx && pokeFx.region === 'cheek'
            ? 'animate-poke-cheek'
            : squishKey > 0 && !feedingAnim.active
            ? 'animate-jelly-squish'
            : 'animate-float-breathe'
        } ${isEating ? 'animate-slime-rancher-gulp' : ''}`}
        style={{
          width: `${Math.round(258 * scaleVal * (mini ? miniScale : 1))}px`,
          height: `${Math.round(232 * scaleVal * (mini ? miniScale : 1))}px`,
          transformOrigin: '50% 85%',
          '--sqy': spirit.feel ? spirit.feel.sq : 0.8,
          '--sqx': spirit.feel ? (1 + (1 - spirit.feel.sq) * 0.8).toFixed(3) : 1.18,
          '--rby': spirit.feel ? spirit.feel.rb : 1.09,
          '--rbx': spirit.feel ? (1 - (spirit.feel.rb - 1) * 0.9).toFixed(3) : 0.91,
          '--sqdur': spirit.feel ? `${spirit.feel.dur}s` : '0.72s',
        }}
      >
        <svg viewBox="10 0 240 218" className="w-full h-full overflow-visible">
          <defs>
            <filter id="slimeDesat" x="0" y="0" width="100%" height="100%"><feColorMatrix type="saturate" values="0.6" /></filter>
          </defs>
          {/* 地面柔和陰影 */}
          <ellipse cx="130" cy="203" rx={isHungry ? 70 : 80} ry="12" fill={spirit.bodyStops[4]} opacity={theme === 'dark' ? 0.35 : 0.2} />
          <g transform={`translate(130 201) scale(${spirit.img ? spirit.img.s : 0.92}) translate(-130 ${-(18 + 232 * (spirit.img ? spirit.img.bottom : 0.9))})`}>
            {/* 成長陪伴：越久越多光彩（Day30 光點 → Day90 星星 → Day180 光暈 → Day365 小愛心） */}
            {growRank >= 3 && (<>
              <defs><radialGradient id={`growHalo_${spirit.id}`} cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor={spirit.primary} stopOpacity={growRank >= 4 ? 0.42 : 0.32} /><stop offset="60%" stopColor={spirit.secondary} stopOpacity="0.45" /><stop offset="100%" stopColor={spirit.secondary} stopOpacity="0" /></radialGradient></defs>
              <ellipse cx="130" cy="146" rx="158" ry="136" fill={`url(#growHalo_${spirit.id})`} className="animate-float-breathe" />
            </>)}
            <image href={BODY_IMG[spirit.id]} x="14" y="18" width="232" height="232" />
            {growRank >= 1 && (<g>
              <path d={spk4(84,96,9)} fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.2" className="animate-twinkle" style={{ transformBox: 'fill-box', transformOrigin: 'center', animationDelay: '0s' }} />
              <path d={spk4(70,118,4.5)} fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.2" className="animate-twinkle" style={{ transformBox: 'fill-box', transformOrigin: 'center', animationDelay: '1.1s' }} />
            </g>)}
            {growRank >= 2 && (<g>
              <path d={spk4(26,126,12)} fill={spirit.primary} stroke="#FFFFFF" strokeWidth="1.2" className="animate-twinkle" style={{ transformBox: 'fill-box', transformOrigin: 'center', animationDelay: '0.4s' }} />
              <path d={spk4(236,108,13)} fill={spirit.primary} stroke="#FFFFFF" strokeWidth="1.2" className="animate-twinkle" style={{ transformBox: 'fill-box', transformOrigin: 'center', animationDelay: '1.4s' }} />
              <path d={spk4(234,192,9)} fill={spirit.secondary} stroke="#FFFFFF" strokeWidth="1.2" className="animate-twinkle" style={{ transformBox: 'fill-box', transformOrigin: 'center', animationDelay: '2.1s' }} />
            </g>)}
            {growRank >= 4 && (<g>
              <path d="M 30,186 C 22,180 23,172 28,173 C 30,173 30,175 30,176 C 30,175 31,173 33,173 C 38,172 38,180 30,186 Z" fill="#FB7185" className="animate-float-heart" />
              <path d="M 226,74 C 219,69 220,62 224,62 C 226,62 226,64 226,65 C 226,64 227,62 229,62 C 233,62 233,69 226,74 Z" fill="#FDA4AF" className="animate-float-heart" style={{ animationDelay: '.8s' }} />
            </g>)}
            <g
              transform={`translate(${(spirit.img ? spirit.img.fx : 0) + (look ? look.x : 0)} ${14 + (spirit.img ? spirit.img.fy : 0) + (look ? look.y : 0) + (isGrabbing ? -2 : isEating || celebrating ? -4 : isHungry ? 5 : 0)}) translate(130 140) scale(1.3) translate(-130 -140)`}
              style={{ transition: 'transform .45s ease-out' }}
            >
              <NewFace
                expr={expr && !feedingAnim.active && !sleeping && !giggling ? expr : giggling ? (personaOf(spirit.id).faces.tickle || 'eatjoy') : isEating ? 'eatjoy' : celebrating ? (personaOf(spirit.id).faces.joy || 'eatjoy') : (isGrabbing || isSpawn) ? 'gape' : sleeping ? 'sleepz' : isHungry ? 'hungry' : blinking ? 'blink' : null}
                spirit={spirit}
                mouth={spirit.mouth || spirit.eyeRim}
              />
            </g>
          </g>

          {/* 圓滾滾果凍小手：平常垂在兩側，餵食時捧起項目送進嘴裡 */}
          <defs><radialGradient id={`armGrad_${spirit.id}`} cx="38%" cy="30%" r="75%"><stop offset="0%" stopColor={(spirit.hand || spirit.bodyStops)[0]} /><stop offset="55%" stopColor={(spirit.hand || spirit.bodyStops)[1]} /><stop offset="100%" stopColor={(spirit.hand || spirit.bodyStops)[2]} /></radialGradient></defs>
          <g className="transition-all duration-500 ease-out" style={{
              transform: isGrabbing ? 'translate(46px, -16px) rotate(-42deg) scale(1.12)'
                : isEating ? 'translate(32px, -22px) rotate(-25deg) scale(0.95)'
                : celebrating ? 'translate(8px, -28px) rotate(-35deg) scale(1)'
                : 'rotate(18deg) scale(0.85)',
              transformOrigin: '54px 162px',
              transformBox: 'view-box',
              opacity: 1 }}>
            <ellipse cx="48" cy="166" rx="15" ry="20" fill={`url(#armGrad_${spirit.id})`} fillOpacity="0.9" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.55" />
            <ellipse cx="48" cy="179" rx="9" ry="4" fill="#FFFFFF" opacity="0.28" />
            <ellipse cx="43" cy="157" rx="4" ry="7" fill="#FFFFFF" opacity="0.8" />
            <circle cx="44" cy="168" r="1.6" fill="#FFFFFF" opacity="0.7" />
          </g>
          <g className="transition-all duration-500 ease-out" style={{
              transform: isGrabbing ? 'translate(-46px, -16px) rotate(42deg) scale(1.12)'
                : isEating ? 'translate(-32px, -22px) rotate(25deg) scale(0.95)'
                : celebrating ? 'translate(-8px, -28px) rotate(35deg) scale(1)'
                : 'rotate(-18deg) scale(0.85)',
              transformOrigin: '206px 162px',
              transformBox: 'view-box',
              opacity: 1 }}>
            <ellipse cx="212" cy="166" rx="15" ry="20" fill={`url(#armGrad_${spirit.id})`} fillOpacity="0.9" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.55" />
            <ellipse cx="212" cy="179" rx="9" ry="4" fill="#FFFFFF" opacity="0.28" />
            <ellipse cx="207" cy="157" rx="4" ry="7" fill="#FFFFFF" opacity="0.8" />
            <circle cx="208" cy="168" r="1.6" fill="#FFFFFF" opacity="0.7" />
          </g>
          {/* 表情小符號（向量畫，不用 emoji） */}
          {expr && !feedingAnim.active && !sleeping && (
            <g key={expr} className="animate-mark-pop" style={{ transformOrigin: '204px 80px', transformBox: 'view-box' }}>
              {expr === 'surprised' && (<>
                <path d="M 204,58 L 202,82" stroke={spirit.eyeRim} strokeWidth="6" strokeLinecap="round" />
                <circle cx="201" cy="94" r="3.6" fill={spirit.eyeRim} />
              </>)}
              {expr === 'pout' && (
                <g transform="translate(204 76)" stroke="#E11D48" strokeWidth="3.6" strokeLinecap="round" fill="none">
                  <path d="M -10,-3 Q -3,-3 -3,-10" /><path d="M 3,-10 Q 3,-3 10,-3" /><path d="M 10,3 Q 3,3 3,10" /><path d="M -3,10 Q -3,3 -10,3" />
                </g>
              )}
              {(expr === 'happy' || expr === 'wink' || expr === 'star') && spirit.id !== 'geo' && spirit.id !== 'cryo' && (
                <g transform="translate(200 70)" fill={spirit.eyeRim}>
                  <ellipse cx="0" cy="18" rx="6" ry="4.6" transform="rotate(-20 0 18)" />
                  <path d="M 5,17 L 5,-4 Q 12,0 15,6" stroke={spirit.eyeRim} strokeWidth="3" fill="none" strokeLinecap="round" />
                </g>
              )}
              {expr === 'heart' && (<>
                <path d="M 204,84 C 192,76 194,64 200,65 C 203,65 204,68 204,70 C 204,68 205,65 208,65 C 214,64 216,76 204,84 Z" fill="#FB7185" className="animate-float-heart" />
                <path d="M 222,66 C 214,61 215,53 219,53 C 221,53 222,55 222,56 C 222,55 223,53 225,53 C 229,53 230,61 222,66 Z" fill="#FDA4AF" className="animate-float-heart" style={{ animationDelay: '.3s' }} />
              </>)}
              {expr === 'kiss' && (
                <path d="M 204,84 C 192,76 194,64 200,65 C 203,65 204,68 204,70 C 204,68 205,65 208,65 C 214,64 216,76 204,84 Z" fill="#FB7185" className="animate-float-heart" />
              )}
              {expr === 'sleepy' && (
                <g fill="none" stroke={spirit.eyeRim} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M 196,84 h 10 l -10,11 h 10" /><path d="M 212,66 h 7 l -7,8 h 7" /></g>
              )}
              {expr === 'yum' && (
                <g fill="#FDE047" stroke="#EA580C" strokeWidth="1.6" strokeLinejoin="round"><path d="M 204,62 L 207,72 L 217,75 L 207,78 L 204,88 L 201,78 L 191,75 L 201,72 Z" /></g>
              )}
              {expr === 'halflid' && (
                <g fill={spirit.eyeRim}><circle cx="194" cy="82" r="3" /><circle cx="204" cy="82" r="3" /><circle cx="214" cy="82" r="3" /></g>
              )}
            </g>
          )}

        </svg>

        {/* 被史萊姆雙手捧起、吸入嘴裡的 3D 晶透食物能量球 */}
        {feedingAnim.active && (
          <div 
            className="absolute left-1/2 z-30 flex flex-col items-center pointer-events-none transition-all duration-500 ease-out"
            style={{
              top: feedingAnim.phase === 'spawn' 
                ? '196px' 
                : feedingAnim.phase === 'grabbing' 
                ? '118px' 
                : '110px',
              transform: feedingAnim.phase === 'spawn'
                ? 'translate(-50%, 0) scale(1.15)'
                : feedingAnim.phase === 'grabbing'
                ? 'translate(-50%, 0) scale(1.06)'
                : 'translate(-50%, 0) scale(0.05)',
              opacity: feedingAnim.phase === 'eating' ? 0 : 1
            }}
          >
            <div className="flex items-center justify-center">
              <PhotoIcon name={feedingAnim.icon || 'add'} size={84} style={{ filter: 'drop-shadow(0 8px 10px rgba(80,50,30,.25))' }} />
            </div>
          </div>
        )}
      </div>
      </div>
      </div>
      </div>
    </div>
  );
};

// ==========================================
// 飽足感曲線：整段日子畫成一張長圖，用手指原生滑動；曲線用不會衝過頭的單調三次平滑
// ==========================================
function monotonePath(pts) {
  const n = pts.length; if (n === 0) return ''; if (n === 1) return `M ${pts[0].x} ${pts[0].y}`;
  const dx = [], dy = [], m = [], t = [];
  for (let i = 0; i < n - 1; i++) { dx[i] = pts[i + 1].x - pts[i].x; dy[i] = pts[i + 1].y - pts[i].y; m[i] = dy[i] / dx[i]; }
  t[0] = m[0]; t[n - 1] = m[n - 2];
  for (let i = 1; i < n - 1; i++) t[i] = m[i - 1] * m[i] <= 0 ? 0 : (3 * (dx[i - 1] + dx[i])) / ((2 * dx[i] + dx[i - 1]) / m[i - 1] + (dx[i] + 2 * dx[i - 1]) / m[i]);
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    d += ` C ${pts[i].x + h} ${pts[i].y + h * t[i]}, ${pts[i + 1].x - h} ${pts[i + 1].y - h * t[i + 1]}, ${pts[i + 1].x} ${pts[i + 1].y}`;
  }
  return d;
}
function niceMax(v) {
  const x = Math.max(100, v * 1.12);
  const p = Math.pow(10, Math.floor(Math.log10(x)));
  const f = x / p;
  const n = f <= 1 ? 1 : f <= 1.5 ? 1.5 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 3 ? 3 : f <= 4 ? 4 : f <= 5 ? 5 : f <= 6 ? 6 : f <= 8 ? 8 : 10;
  return n * p;
}
function SmoothCurve({ days, offset, onOffset, limit, color, soft, dark, sym = '$' }) {
  const ref = useRef(null);
  const [sel, setSel] = useState(null);
  const STEP = 54, H = 196, PAD = 24, TOP = 30, BOT = 30, AXIS = 40;
  const W = Math.max(1, days.length - 1) * STEP + PAD * 2;
  const base = H - BOT;
  // 依「目前畫面看得到的日子」決定縱軸範圍，滑動時平滑跟著變
  const [target, setTarget] = useState(400);
  const [shown, setShown] = useState(400);
  const shownRef = useRef(400);
  const calcTarget = () => {
    const el = ref.current; if (!el) return;
    const a = Math.max(0, Math.floor((el.scrollLeft - PAD) / STEP));
    const b = Math.min(days.length - 1, Math.ceil((el.scrollLeft + el.clientWidth - PAD) / STEP));
    let m = 0; for (let i = a; i <= b; i++) m = Math.max(m, days[i] ? days[i].amount : 0);
    setTarget(niceMax(m));
  };
  useEffect(() => {
    let raf;
    const step = () => {
      const cur = shownRef.current; const d = target - cur;
      if (Math.abs(d) < 1) { shownRef.current = target; setShown(target); return; }
      shownRef.current = cur + d * 0.18; setShown(shownRef.current);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  const yOf = (v) => base - (v / shown) * (base - TOP);
  const pts = days.map((d, i) => ({ ...d, x: PAD + i * STEP, y: Math.max(TOP - 6, yOf(d.amount)) }));
  // 圓滑曲線（Catmull-Rom 轉貝茲，控制點限制在圖內不會凸出）
  let path = '';
  if (pts.length) {
    path = `M ${pts[0].x} ${pts[0].y}`;
    const k = 0.2;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      const c1y = Math.min(base, Math.max(TOP - 8, p1.y + (p2.y - p0.y) * k));
      const c2y = Math.min(base, Math.max(TOP - 8, p2.y - (p3.y - p1.y) * k));
      path += ` C ${p1.x + (p2.x - p0.x) * k} ${c1y}, ${p2.x - (p3.x - p1.x) * k} ${c2y}, ${p2.x} ${p2.y}`;
    }
  }
  const area = pts.length ? `${path} L ${pts[pts.length - 1].x} ${base} L ${pts[0].x} ${base} Z` : '';
  const ly = yOf(limit);
  const ticks = [shown, shown / 2, 0];
  const internal = useRef(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (internal.current) { internal.current = false; return; }
    const tgt = Math.max(0, W - el.clientWidth - offset * STEP);
    el.scrollTo({ left: tgt, behavior: 'smooth' });
    setTimeout(calcTarget, 400);
  }, [offset, W]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { const el = ref.current; if (el) { el.scrollLeft = W; calcTarget(); } }, [days.length]); // eslint-disable-line react-hooks/exhaustive-deps
  const rafRef = useRef(null);
  const onScroll = () => {
    const el = ref.current; if (!el) return;
    if (!rafRef.current) rafRef.current = requestAnimationFrame(() => { rafRef.current = null; calcTarget(); });
    clearTimeout(onScroll.t);
    onScroll.t = setTimeout(() => {
      const off = Math.max(0, Math.round((W - el.clientWidth - el.scrollLeft) / STEP));
      if (off !== offset) { internal.current = true; onOffset(off); }
    }, 180);
  };
  const muted = dark ? '#94A3B8' : '#8A7B6B';
  const fmt = (v) => (v >= 1000 ? `${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k` : `${Math.round(v)}`);
  return (
    <div>
      <div className="relative" style={{ height: H }}>
        {/* 左側金額刻度（跟著畫面裡的日子變化） */}
        <div className="absolute left-0 top-0 bottom-0 pointer-events-none" style={{ width: AXIS }}>
          {ticks.map((t, i) => (
            <span key={i} className="absolute right-1.5 text-[10.5px] font-bold tabular-nums" style={{ top: yOf(t) - 7, color: muted }}>{fmt(t)}</span>
          ))}
        </div>
        <div ref={ref} onScroll={onScroll} className="absolute top-0 bottom-0 right-0 overflow-x-auto no-scrollbar" style={{ left: AXIS, WebkitOverflowScrolling: 'touch' }}>
          <svg width={W} height={H} style={{ display: 'block' }}>
            <defs>
              <linearGradient id="curveFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.38" />
                <stop offset="100%" stopColor={color} stopOpacity="0.02" />
              </linearGradient>
            </defs>
            {ticks.map((t, i) => <line key={i} x1="0" x2={W} y1={yOf(t)} y2={yOf(t)} stroke={dark ? 'rgba(255,255,255,.08)' : 'rgba(120,100,80,.10)'} strokeWidth="1" />)}
            {ly >= TOP - 4 && <line x1="0" x2={W} y1={ly} y2={ly} stroke={color} strokeWidth="1.4" strokeDasharray="5 6" opacity="0.55" />}
            <path d={area} fill="url(#curveFill)" />
            <path d={path} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            {pts.map(p => {
              const chubby = p.amount > limit; const on = sel && sel.fullDate === p.fullDate;
              return (
                <g key={p.fullDate} onClick={() => setSel(on ? null : p)} style={{ cursor: 'pointer' }}>
                  <rect x={p.x - STEP / 2} y="0" width={STEP} height={H} fill="transparent" />
                  <circle cx={p.x} cy={p.y} r={on ? 8 : chubby ? 6.6 : 4.8} fill={chubby || on ? soft : (dark ? '#1E293B' : '#FFFFFF')} stroke={color} strokeWidth="2.6" />
                  {(chubby || on) && <circle cx={p.x - 2} cy={p.y - 2.2} r="1.7" fill="#fff" />}
                  {on && (
                    <g>
                      <rect x={p.x - Math.max(30, (sym + p.amount.toLocaleString()).length * 4.6 + 10)} y={p.y - 34} width={Math.max(60, (sym + p.amount.toLocaleString()).length * 9.2 + 20)} height="22" rx="11" fill={dark ? '#1E293B' : '#FFFFFF'} stroke={color} strokeWidth="1.5" />
                      <text x={p.x} y={p.y - 19} textAnchor="middle" fontSize="12" fontWeight="800" fill={color}>{sym}{p.amount.toLocaleString()}</text>
                    </g>
                  )}
                  <text x={p.x} y={H - 9} textAnchor="middle" fontSize="11.5" fontWeight="700" fill={muted}>{p.label}</text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
      <p className="text-[11px] mt-1" style={{ color: muted }}>點一下果凍看金額{limit < 1e8 ? `・虛線是每日平均線（NT$ ${limit.toLocaleString()}）・圓滾滾的果凍＝超過平均` : ''}</p>
    </div>
  );
}

// ==========================================
// 弧形滑動項目列：第一下選擇（或滑動），第二下打開金額
// ==========================================
function ArcDock({ categories, focusedIdx, onFocus, onOpen, onAdd, onEdit, themeConfig, accent }) {
  // 循環轉盤：項目＋「新增」重複三份，永遠停在中間那份，兩側都排滿項目
  const ref = useRef(null);
  const settleRef = useRef(null);
  const lastRef = useRef(focusedIdx);
  const ITEM = 70;
  const N = categories.length;
  const total = N;
  // 項目循環三份（左右都排滿項目）；「新增／修改」只放在中間那份的最後面，往後滑才會看到
  const items = [0, 1, 2].flatMap(r => {
    const base = categories.map((c, i) => ({ cat: c, i, r }));
    return r === 1 ? [...base, { add: true, r }, { edit: true, r }] : base;
  });
  const layout = () => {
    const el = ref.current; if (!el) return;
    const mid = el.scrollLeft + el.clientWidth / 2;
    let best = 0, bd = 1e9;
    el.querySelectorAll('.arc-item').forEach((it, j) => {
      const c = it.offsetLeft + it.offsetWidth / 2;
      const a = Math.min(Math.abs((c - mid) / ITEM), 3);
      it.style.transform = `translateY(${a * a * 5}px) scale(${1 - a * 0.1})`;
      it.style.opacity = String(1 - a * 0.2);
      if (Math.abs(c - mid) < bd) { bd = Math.abs(c - mid); best = j; }
    });
    clearTimeout(settleRef.current);
    settleRef.current = setTimeout(() => {
      let i = -1;
      if (best < N) { el.scrollLeft += N * ITEM; i = best; requestAnimationFrame(layout); }
      else if (best < 2 * N) i = best - N;
      else if (best < 2 * N + 2) i = -1; // 停在「新增／修改」上，不跳動
      else { el.scrollLeft -= (N + 2) * ITEM; i = best - (2 * N + 2); requestAnimationFrame(layout); }
      if (i >= 0 && i !== lastRef.current && i < categories.length) { lastRef.current = i; onFocus(i); }
    }, 160);
  };
  const center = (j, smooth = true) => {
    const el = ref.current; if (!el) return;
    const it = el.querySelectorAll('.arc-item')[j]; if (!it) return;
    el.scrollTo({ left: it.offsetLeft + it.offsetWidth / 2 - el.clientWidth / 2, behavior: smooth ? 'smooth' : 'auto' });
  };
  useEffect(() => { center(N + Math.max(0, focusedIdx), false); setTimeout(layout, 30); }, [N]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="relative shrink-0" style={{ height: 96 }}>
      <div className={`absolute left-[3%] right-[3%] top-[20px] h-[72px] border shadow-inner ${themeConfig.dock}`} style={{ borderRadius: '50% / 60%' }} />
      <div ref={ref} onScroll={layout} className="relative flex overflow-x-auto overflow-y-hidden no-scrollbar items-start" style={{ height: 96, paddingTop: 10, scrollSnapType: 'x mandatory', touchAction: 'pan-x', overscrollBehavior: 'contain' }}>
        {items.map((it, j) => {
          if (it.edit) return (
            <button
              key={`edit_${it.r}`}
              className={`arc-item flex flex-col items-center justify-center rounded-[24px] ${themeConfig.dockItemInactive}`}
              style={{ flex: `0 0 ${ITEM}px`, height: 70, scrollSnapAlign: 'center' }}
              onClick={onEdit}
            >
              <span className="w-[34px] h-[34px] rounded-full flex items-center justify-center" style={{ background: 'rgba(0,0,0,.06)' }}><Edit3 className="w-4 h-4 opacity-60" /></span>
              <span className="text-[11px] font-bold tracking-wider mt-1">修改</span>
            </button>
          );
          if (it.add) return (
            <button
              key={`add_${it.r}`}
              className={`arc-item flex flex-col items-center justify-center rounded-[24px] ${themeConfig.dockItemInactive}`}
              style={{ flex: `0 0 ${ITEM}px`, height: 70, scrollSnapAlign: 'center' }}
              onClick={onAdd}
            >
              <PhotoIcon name="add" size={34} />
              <span className="text-[11px] font-bold tracking-wider mt-1">新增</span>
            </button>
          );
          const cat = it.cat; const i = it.i;
          const on = i === focusedIdx;
          return (
            <button
              key={`${cat.id}_${it.r}`}
              className={`arc-item relative flex flex-col items-center justify-center rounded-[24px] transition-colors ${themeConfig.dockItemInactive}`}
              style={{ flex: `0 0 ${ITEM}px`, height: 70, scrollSnapAlign: 'center' }}
              onClick={(e) => {
                const el = e.currentTarget; const cur = el.style.transform || 'none';
                try { el.animate([{ transform: cur }, { transform: `${cur} scale(0.88, 0.82)` }, { transform: `${cur} scale(1.05, 1.02)` }, { transform: cur }], { duration: 320, easing: 'ease-out' }); } catch {}
                const sc = ref.current; const mid = sc ? sc.scrollLeft + sc.clientWidth / 2 : 0;
                const isCentered = sc && Math.abs(el.offsetLeft + el.offsetWidth / 2 - mid) < ITEM / 2;
                if (on && isCentered) onOpen(cat);
                else { lastRef.current = i; onFocus(i); center(j); }
              }}
            >
              {on && <span className="absolute left-1/2 top-[6px] -translate-x-1/2 w-[52px] h-[52px] rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, ${accent}38 0%, ${accent}12 55%, transparent 72%)` }} />}
              <PhotoIcon name={iconKeyOf(cat)} size={on ? 50 : 38} style={{ position: 'relative', filter: on ? 'drop-shadow(0 6px 8px rgba(120,80,40,.22))' : 'none' }} />
              <span className="text-[11px] font-bold tracking-wider mt-1 whitespace-nowrap" style={on ? { color: accent } : undefined}>{cat.shortName}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// 主應用程式組件 (整合 LocalStorage 本地離線儲存 + 月底感謝信 + 貪吃傲嬌對話)
// ==========================================
export default function App() {
  // 三種全局主題：'beige' (暖心米色) | 'light' (清爽淺色) | 'dark' (靜謐深色)
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('glimmer_theme') || 'light'; } catch { return 'light'; }
  });

  // 日夜氛圍完全依手機時間自動切換（每分鐘與回到前景時重新檢查，跨日也會更新今天日期）
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const tick = () => setNow(new Date());
    const timer = setInterval(tick, 60000);
    const onVisible = () => { if (document.visibilityState === 'visible') tick(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange', onVisible); };
  }, []);
  const currentPeriod = getPeriodByHour(now.getHours());
  const ambient = (() => { const h = now.getHours(); return h >= 5 && h < 10 ? 'dawn' : h >= 10 && h < 16 ? 'noon' : h >= 16 && h < 19 ? 'dusk' : 'night'; })();
  const todayDate = toDateStr(now);
  const currentMonth = todayDate.slice(0, 7);

  // 依角色個性與手機時間的問候（呼叫時才計算）
  const timeGreeting = () => {
    const h = new Date().getHours();
    const amb = h >= 5 && h < 10 ? 'dawn' : h >= 10 && h < 16 ? 'noon' : h >= 16 && h < 19 ? 'dusk' : 'night';
    const ps = personaOf(SPIRITS[spiritIdxRef.current]?.id);
    const dow = new Date().getDay();
    if (dow === 1 && (amb === 'dawn' || amb === 'noon') && Math.random() < 0.6) return ps.days.mon;
    if (dow === 5 && (amb === 'dusk' || amb === 'night') && Math.random() < 0.6) return ps.days.fri;
    if ((dow === 0 || dow === 6) && Math.random() < 0.4) return ps.days.weekend;
    return pickOne(ps.greet[amb]);
  };

  // 三大分頁：'feed' (餵食記帳) | 'journal' (生活手帳) | 'insights' (肚子消化圖)
  const [activeTab, setActiveTab] = useState('feed');

  // 當前元素史萊姆角色 (共 5 款)
  const [spiritIdx, setSpiritIdx] = useState(() => {
    try { return Number(localStorage.getItem('glimmer_spirit')) || 0; } catch { return 0; }
  });
  const currentSpirit = SPIRITS[spiritIdx] || SPIRITS[0];
  const P_ = personaOf(currentSpirit.id);
  const spiritIdxRef = useRef(spiritIdx);
  spiritIdxRef.current = spiritIdx;

  // 陪伴起始日：第一次打開 App 的日期（存在手機本地）
  const [startDate, setStartDate] = useState(() => {
    try {
      const saved = localStorage.getItem('glimmer_start_date_v4');
      if (saved) return saved;
      const x = new Date(); if (PREVIEW) x.setDate(x.getDate() - 96);
      const d = toDateStr(x);
      localStorage.setItem('glimmer_start_date_v4', d);
      return d;
    } catch { return toDateStr(new Date()); }
  });

  // 記帳分類與紀錄 (支援手機 LocalStorage 離線自動保存)
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('glimmer_categories_v4');
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('glimmer_transactions_v4');
      return saved ? JSON.parse(saved) : (PREVIEW ? makeDemoData(toDateStr(new Date())).txs : []);
    } catch {
      return PREVIEW ? makeDemoData(toDateStr(new Date())).txs : [];
    }
  });
  const [isDemo, setIsDemo] = useState(() => { if (!PREVIEW) return false; try { return localStorage.getItem('glimmer_demo_v4') !== '0'; } catch { return true; } });
  const [moods, setMoods] = useState(() => {
    try { const s = localStorage.getItem('glimmer_moods_v4'); return s ? JSON.parse(s) : (PREVIEW ? makeDemoData(toDateStr(new Date())).moods : {}); } catch { return {}; }
  });

  const [dailyComfortLimit, setDailyComfortLimit] = useState(() => {
    try { return Number(localStorage.getItem('glimmer_comfort_limit')) || 600; } catch { return 600; }
  });
  // 每月生活費上限（只設總額；每個月自動沿用，除非重新修改；0 = 尚未設定）
  const [monthlyCap, setMonthlyCap] = useState(() => {
    try { return Number(localStorage.getItem('glimmer_month_cap')) || 0; } catch { return 0; }
  });
  const [familyCap, setFamilyCap] = useState(() => { try { return Number(localStorage.getItem('glimmer_family_cap')) || 0; } catch { return 0; } });
  const [pockets, setPockets] = useState(() => { try { const x = JSON.parse(localStorage.getItem('glimmer_pockets') || '[]'); return Array.isArray(x) ? x : []; } catch { return []; } });
  const [pocketEdit, setPocketEdit] = useState(null); // { catId, amount }
  const [ledgerView, setLedgerView] = useState('personal'); // 第二、三分頁共用：all | personal | family | company
  const [txLedger, setTxLedger] = useState('personal'); // 計算機勾選（每次餵完回到個人）
  const [capDraft, setCapDraft] = useState('');
  const [capEditing, setCapEditing] = useState(false);
  const [capOpen, setCapOpen] = useState(false);
  const [pocketOpen, setPocketOpen] = useState(false);
  const [showEditCat, setShowEditCat] = useState(false);
  const [iconPickId, setIconPickId] = useState(null);
  const [carrier, setCarrier] = useState(() => { try { return localStorage.getItem('glimmer_carrier') || ''; } catch { return ''; } });
  const [showCarrier, setShowCarrier] = useState(false);
  const [carrierEdit, setCarrierEdit] = useState(false);
  const [carrierDraft, setCarrierDraft] = useState('');
  const [carrierDraft2, setCarrierDraft2] = useState('');
  const [carrierErr, setCarrierErr] = useState('');
  useEffect(() => { try { if (carrier) localStorage.setItem('glimmer_carrier', carrier); else localStorage.removeItem('glimmer_carrier'); } catch {} }, [carrier]);
  const [renameId, setRenameId] = useState(null);
  const [renameVal, setRenameVal] = useState('');
  const [editMsg, setEditMsg] = useState('');
  const [dragOrder, setDragOrder] = useState(null); // 拖曳中的暫時順序（id 陣列）
  const [dragId, setDragId] = useState(null);
  const [dragT, setDragT] = useState(0);
  const dragRef = useRef({ timer: null, active: false });
  const rowEls = useRef({});
  const editListRef = useRef(null);
  useEffect(() => {
    const el = editListRef.current; if (!showEditCat || !el) return;
    const stop = (e) => { if (dragRef.current.active) e.preventDefault(); };
    el.addEventListener('touchmove', stop, { passive: false });
    return () => el.removeEventListener('touchmove', stop);
  }, [showEditCat]);
  const [customCurs, setCustomCurs] = useState(() => { try { const x = JSON.parse(localStorage.getItem('glimmer_custom_curs') || '[]'); return Array.isArray(x) ? x : []; } catch { return []; } });
  const [txCur, setTxCur] = useState(() => { try { return localStorage.getItem('glimmer_last_cur') || 'JPY'; } catch { return 'JPY'; } });
  const [travelCur, setTravelCur] = useState(txCur);
  const [curAdding, setCurAdding] = useState(null); // { code, sym }
  const allCurs = [...CUR_DEFAULT, ...customCurs.filter(c => !CUR_DEFAULT.some(d => d.code === c.code))];
  const symOf = (code) => (allCurs.find(c => c.code === code) || { sym: '' }).sym;
  const fmtCur = (n, code) => `${Number(n).toLocaleString()} ${code} ${symOf(code)}`.trim();
  useEffect(() => { setCapEditing(false); }, [ledgerView]);

  // 真實陪伴天數與成長階段（依手機日期自動計算；最近一筆紀錄距今 ≥3 天進入委屈狀態）
  const companionDays = Math.max(1, daysBetween(startDate, todayDate) + 1);
  const lastRecordDate = transactions.reduce((max, t) => (t.date <= todayDate && t.date > max ? t.date : max), '');
  const isHungryNow = Boolean(lastRecordDate) && daysBetween(lastRecordDate, todayDate) >= 3;
  const growthIdx = companionDays >= 365 ? 4 : companionDays >= 180 ? 3 : companionDays >= 90 ? 2 : companionDays >= 30 ? 1 : 0;
  const milestoneIdx = isHungryNow ? 5 : growthIdx;
  const currentMilestone = COMPANION_MILESTONES[milestoneIdx];

  // 同步儲存至手機本地端 LocalStorage (使用 v2 key 確保舊有測試金額已清空)
  useEffect(() => {
    try {
      localStorage.setItem('glimmer_theme', theme);
      localStorage.setItem('glimmer_spirit', String(spiritIdx));
      localStorage.setItem('glimmer_categories_v4', JSON.stringify(categories));
      localStorage.setItem('glimmer_transactions_v4', JSON.stringify(transactions));
      localStorage.setItem('glimmer_moods_v4', JSON.stringify(moods));
      localStorage.setItem('glimmer_demo_v4', isDemo ? '1' : '0');
      localStorage.setItem('glimmer_comfort_limit', String(dailyComfortLimit));
      localStorage.setItem('glimmer_month_cap', String(monthlyCap));
      localStorage.setItem('glimmer_family_cap', String(familyCap));
      localStorage.setItem('glimmer_pockets', JSON.stringify(pockets));
      localStorage.setItem('glimmer_custom_curs', JSON.stringify(customCurs));
      localStorage.setItem('glimmer_last_cur', txCur);
    } catch {
      // 忽略私密瀏覽限制
    }
  }, [theme, spiritIdx, categories, transactions, dailyComfortLimit, monthlyCap, familyCap, pockets, customCurs, txCur, moods, isDemo]);

  // 底部微笑圓弧轉盤當前聚焦項目
  // 分類排序：每次打開 App 時算一次（使用中不跳動）
  // 14 天內新增的分類排最前面，其餘依近 30 天記帳次數由多到少，同分維持原順序
  const [catOrder] = useState(() => {
    const from = (() => { const x = new Date(todayDate + 'T00:00:00'); x.setDate(x.getDate() - 29); return toDateStr(x); })();
    const cnt = {};
    transactions.forEach(t => { if (t.date >= from && t.date <= todayDate) cnt[t.categoryId] = (cnt[t.categoryId] || 0) + 1; });
    const isNew = (c) => c.createdAt && daysBetween(c.createdAt, todayDate) < 14;
    return categories
      .map((c, i) => ({ id: c.id, i, n: cnt[c.id] || 0, fresh: isNew(c) }))
      .sort((a, b) => (b.fresh - a.fresh) || (a.fresh && b.fresh ? b.i - a.i : 0) || (b.n - a.n) || (a.i - b.i))
      .map(x => x.id);
  });
  const orderedCategories = useMemo(() => {
    const pos = {}; catOrder.forEach((id, k) => { pos[id] = k; });
    const vis = categories.filter(c => !c.hidden);
    if (vis.some(c => c.ord !== undefined)) {
      // 手動排過：依自訂順序；之後新增（沒有順序）的排最前面
      return vis.map((c, i) => ({ c, k: c.ord !== undefined ? c.ord : -1000 + i })).sort((a, b) => a.k - b.k).map(x => x.c);
    }
    return vis.map((c, i) => ({ c, k: pos[c.id] !== undefined ? pos[c.id] : -1 - i })).sort((a, b) => a.k - b.k).map(x => x.c);
  }, [categories, catOrder]);
  const [focusedCatIdx, setFocusedCatIdx] = useState(0);

  // 輕觸史萊姆的 Q 彈動畫與貪吃/傲嬌小對話（2.2 秒自動淡出）
  const [squishKey, setSquishKey] = useState(0);
  const [whisperIdx, setWhisperIdx] = useState(0);
  const [customWhisper, setCustomWhisper] = useState('');
  const [showWhisper, setShowWhisper] = useState(false);
  const whisperTimerRef = useRef(null);

  const [whisperKey, setWhisperKey] = useState(0);
  const [whisperFeed, setWhisperFeed] = useState(null); // 餵食回饋：記住金額，泡泡加角色色細邊
  const [whisperMs, setWhisperMs] = useState(2300);
  const [exprOverride, setExprOverride] = useState(null);
  const [exprStill, setExprStill] = useState(false);
  const [whisperRare, setWhisperRare] = useState(false);
  const exprTimerRef = useRef(null);
  const showTemporaryWhisper = (msg, feedAmount = null, ms = 2300, expr = null, rare = false, still = false) => {
    setExprStill(still);
    setCustomWhisper(msg);
    setWhisperFeed(feedAmount);
    setWhisperRare(rare);
    clearTimeout(exprTimerRef.current);
    setExprOverride(expr);
    if (expr) exprTimerRef.current = setTimeout(() => setExprOverride(null), Math.max(ms, 2500));
    setWhisperMs(feedAmount ? 2800 : ms);
    setWhisperKey(k => k + 1);
    setShowWhisper(true);
    if (whisperTimerRef.current) clearTimeout(whisperTimerRef.current);
    whisperTimerRef.current = setTimeout(() => {
      setShowWhisper(false);
      setCustomWhisper('');
      setWhisperFeed(null);
    }, feedAmount ? 2800 : ms);
  };

  // 守住舒適圈慶祝特效狀態
  const [celebrating, setCelebrating] = useState(false);
  const celebrateTimerRef = useRef(null);

  const triggerCelebration = () => {
    setCelebrating(true);
    if (celebrateTimerRef.current) clearTimeout(celebrateTimerRef.current);
    celebrateTimerRef.current = setTimeout(() => {
      setCelebrating(false);
    }, 2500);
  };

  // 點擊史萊姆觸發 Q 彈軟糖回饋與更換溫柔/傲嬌小語（2.2 秒後自動淡出）
  const [pokeFx, setPokeFx] = useState(null); // 'head' | 'belly' | 'cheek'
  const handleTapSlime = (e) => {
    setSquishKey(prev => prev + 1);
    const persona = personaOf(SPIRITS[spiritIdxRef.current]?.id);
    if ((new Date().getHours() >= 23 || new Date().getHours() < 5) && Date.now() > wokeUntilRef.current) {
      wokeUntilRef.current = Date.now() + 4000;
      setWokeUntil(Date.now() + 4000);
      showTemporaryWhisper(pickOne(persona.wake), null, 3500, persona.faces.wake || 'halflid');
      setTimeout(() => setSquishKey(k => k + 1), 4100);
      return;
    }
    if (Math.random() < 0.06) { const rl = pickOne(persona.rare); showTemporaryWhisper(rl, null, 3500, faceFor(currentSpirit.id, rl, persona.faces.rare), true); return; }
    // 戳不同部位：頭、肚子、臉頰
    let region = null;
    if (e && e.currentTarget && e.clientX != null) {
      const r = e.currentTarget.getBoundingClientRect();
      const rx = (e.clientX - r.left) / r.width, ry = (e.clientY - r.top) / r.height;
      if (ry < 0.38) region = 'head';
      else if (ry > 0.72) region = 'belly';
      else if (rx < 0.3 || rx > 0.7) region = 'cheek';
    }
    if (region) {
      setPokeFx({ region, k: Date.now() });
      setTimeout(() => setPokeFx(null), 700);
      if (region === 'belly') { setGiggling(true); setTimeout(() => setGiggling(false), 1150); }
      { const rl = pickOne(persona[region]); showTemporaryWhisper(rl, null, 2300, region === 'belly' ? (persona.faces.tickle || null) : faceFor(currentSpirit.id, rl, pickOne(persona.faces.tap.filter(Boolean)))); }
      return;
    }
    { const tl = pickOne(persona.tap); showTemporaryWhisper(tl, null, 2300, faceFor(currentSpirit.id, tl, pickOne(persona.faces.tap.filter(Boolean)))); }
  };

  // 選到項目：史萊姆的小反應
  const handleFocusCategory = (idx) => {
    setFocusedCatIdx(idx);
    const cat = orderedCategories[idx];
    if (!cat || feedingAnim.active) return;
    const pc = personaOf(currentSpirit.id);
    { const cl = pc.cat[cat.id] ? pickOne(pc.cat[cat.id]) : `${cat.shortName}嗎？好喔！`; showTemporaryWhisper(cl, null, 2300, faceFor(currentSpirit.id, cl, pickOne(pc.faces.tap)), false, true); }
  };
  const [keyTick, setKeyTick] = useState(0);
  const backHeld = useRef(null);
  const [hintUses, setHintUses] = useState(() => { try { return Number(localStorage.getItem('glimmer_hint_uses')) || 0; } catch { return 0; } });
  const openFeedPanel = (cat, date) => {
    setHintUses(n => { const v = n + 1; try { localStorage.setItem('glimmer_hint_uses', String(v)); } catch {} return v; });
    setEditingId(null);
    setTxLedger('personal');
    setActiveCategory(cat);
    setAmountStr('');
    setTxDate(date || todayDate);
    setTxNote('');
  };

  // 新人說明（只有第一次打開會出現）
  const [showWelcome, setShowWelcome] = useState(() => { try {
    if (localStorage.getItem('glimmer_welcomed') === '1') return false;
    // 已經有使用紀錄的人（舊用戶、已加到桌面後重開）不再跳出
    const tx = localStorage.getItem('glimmer_transactions_v4');
    if (tx && tx !== '[]') { localStorage.setItem('glimmer_welcomed', '1'); return false; }
    // 一打開就先記為看過，之後即使中途關掉也不會再出現
    localStorage.setItem('glimmer_welcomed', '1');
    return true;
  } catch { return false; } });
  const closeWelcome = () => { try { localStorage.setItem('glimmer_welcomed', '1'); } catch {} setShowWelcome(false); setTimeout(() => openingLine(), 300); };

  // 打開時的問候（節日優先）
  const openingLine = () => {
      const fest = FESTIVAL_LINES[toDateStr(new Date()).slice(5)];
      const persona = personaOf(SPIRITS[spiritIdxRef.current]?.id);
      const today0 = toDateStr(new Date()); const h = new Date().getHours();
      let woke = false;
      try { woke = localStorage.getItem('glimmer_woke_' + today0) === '1'; } catch {}
      if (h >= 5 && h < 11 && !woke) {
        // 早上第一次打開：剛睡醒、打哈欠、伸懶腰
        try { localStorage.setItem('glimmer_woke_' + today0, '1'); } catch {}
        setWakingUp(true);
        setTimeout(() => { setWakingUp(false); setSquishKey(k => k + 1); setCelebrating(true); setTimeout(() => setCelebrating(false), 900); showTemporaryWhisper(pickOne(persona.morning), null, 3200); }, 1600);
        return;
      }
      if (milestoneIdx === 5) { showTemporaryWhisper(pickOne(persona.hungry), null, 3200); return; }
      { const d0 = new Date(); const dim = new Date(d0.getFullYear(), d0.getMonth() + 1, 0).getDate(); const dd = d0.getDate();
        if (!fest && dd === 1 && persona.monthStart) { showTemporaryWhisper(pickOne(persona.monthStart), null, 3000); return; }
        if (!fest && dd >= dim - 1 && persona.monthEnd && Math.random() < 0.6) { showTemporaryWhisper(pickOne(persona.monthEnd), null, 3000); return; } }
      showTemporaryWhisper(fest || timeGreeting(), null, 3000);
  };
  useEffect(() => {
    const t = setTimeout(() => { if (!showWelcome) openingLine(); }, 700);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 放著 1 分鐘沒動，才會有小動作或自言自語
  const lastActRef = useRef(Date.now());
  useEffect(() => {
    const mark = () => { lastActRef.current = Date.now(); };
    window.addEventListener('pointerdown', mark);
    window.addEventListener('touchstart', mark, { passive: true });
    const t = setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      if (Date.now() - lastActRef.current < 60000) return;
      lastActRef.current = Date.now();
      if (isSleepTime) return;
      setSquishKey(prev => prev + 1);
      { const sid = SPIRITS[spiritIdxRef.current]?.id; const pi = personaOf(sid); const il = pickOne(pi.idle); showTemporaryWhisper(il, null, 2600, faceFor(sid, il, pickOne(pi.faces.idle))); }
    }, 5000);
    return () => { clearInterval(t); window.removeEventListener('pointerdown', mark); window.removeEventListener('touchstart', mark); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 搓搓會癢
  const [giggling, setGiggling] = useState(false);
  const wokeUntilRef = useRef(0);
  const handleRub = () => {
    if (feedingAnim.active || giggling) return;
    setGiggling(true);
    showTemporaryWhisper(pickOne(personaOf(SPIRITS[spiritIdxRef.current]?.id).rub));
    setTimeout(() => setGiggling(false), 1150);
  };

  // iPhone 鍵盤跳出時，把面板往上推，避免被擋住
  const [kbOffset, setKbOffset] = useState(0);
  useEffect(() => {
    const vv = window.visualViewport; if (!vv) return;
    const f = () => setKbOffset(Math.max(0, Math.round(window.innerHeight - vv.height - vv.offsetTop)));
    vv.addEventListener('resize', f); vv.addEventListener('scroll', f);
    return () => { vv.removeEventListener('resize', f); vv.removeEventListener('scroll', f); };
  }, []);

  // 晚上 23:00～5:00 睡覺；點牠會醒來一下
  const isSleepTime = now.getHours() >= 23 || now.getHours() < 5;
  const [wokeUntil, setWokeUntil] = useState(0);

  const [wakingUp, setWakingUp] = useState(false);

  // 換角色：舊的跳出去、新的從另一邊彈進來
  const [switchAnim, setSwitchAnim] = useState('');
  const switchSpirit = (dir) => {
    if (switchAnim) return;
    setShowWhisper(false);
    setSwitchAnim(dir > 0 ? 'animate-exit-left' : 'animate-exit-right');
    const SWITCH_FACE = { amber: 'star', breeze: 'yawn', cryo: 'cold', pyro: 'heart', geo: 'smileA' };
    setTimeout(() => {
      const ni = (spiritIdxRef.current + dir + SPIRITS.length) % SPIRITS.length;
      const nid = SPIRITS[ni]?.id;
      setSpiritIdx(ni);
      setSwitchAnim(dir > 0 ? 'animate-enter-right' : 'animate-enter-left');
      showTemporaryWhisper(pickOne(personaOf(nid).switchIn), null, 2600, SWITCH_FACE[nid] || 'happy');
      setTimeout(() => setSwitchAnim(''), 540);
    }, 290);
  };

  // 眼睛跟著手指
  const slimeAreaRef = useRef(null);
  const [fingerLook, setFingerLook] = useState(null);
  useEffect(() => {
    let raf = null, resetT = null, last = '';
    const onMove = (e) => {
      const pt = e.touches ? e.touches[0] : e;
      if (!pt || !slimeAreaRef.current) return;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const r = slimeAreaRef.current && slimeAreaRef.current.getBoundingClientRect();
        if (!r || r.width === 0) return;
        const cx = r.left + r.width / 2, cy = r.top + r.height * 0.45;
        const x = Math.max(-7, Math.min(7, Math.round((pt.clientX - cx) / 22)));
        const y = Math.max(-5, Math.min(6, Math.round((pt.clientY - cy) / 30)));
        const key = x + ',' + y;
        if (key !== last) { last = key; setFingerLook({ x, y }); }
      });
      clearTimeout(resetT);
      resetT = setTimeout(() => { last = ''; setFingerLook(null); }, 1400);
    };
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchstart', onMove, { passive: true });
    window.addEventListener('mousemove', onMove);
    return () => { window.removeEventListener('touchmove', onMove); window.removeEventListener('touchstart', onMove); window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); clearTimeout(resetT); };
  }, []);
  const [glowing, setGlowing] = useState(false);

  // 晚上的心情（18:00 後，今天還沒選才問）
  const [showMoodAsk, setShowMoodAsk] = useState(false);
  useEffect(() => {
    const today0 = toDateStr(new Date());
    let skipped = false;
    try { skipped = localStorage.getItem('glimmer_moodskip_' + today0) === '1'; } catch {}
    if (new Date().getHours() >= 18 && !moods[today0] && !skipped) {
      const t = setTimeout(() => setShowMoodAsk(true), 1800);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const chooseMood = (v) => {
    setMoods(prev => ({ ...prev, [todayDate]: v }));
    setShowMoodAsk(false);
    setSquishKey(prev => prev + 1);
    const opt = MOOD_OPTIONS.find(o => o.v === v);
    showTemporaryWhisper(EX[currentSpirit.id]?.mood?.[v - 1] || opt.line);
    if (v >= 4) triggerCelebration();
  };
  const clearDemoData = () => {
    setTransactions([]);
    setMoods({});
    setStartDate(todayDate);
    try { localStorage.setItem('glimmer_start_date_v4', todayDate); } catch {}
    setIsDemo(false);
    setRecalledTxId(null);
    setSelectedSlice(null);
    setActiveTab('feed');
    showTemporaryWhisper('示範資料清好了，我們從今天開始囉 ✨');
  };

  useEffect(() => {
    return () => {
      if (whisperTimerRef.current) clearTimeout(whisperTimerRef.current);
      if (celebrateTimerRef.current) clearTimeout(celebrateTimerRef.current);
    };
  }, []);

  // 記帳面板狀態
  const [activeCategory, setActiveCategory] = useState(null);
  const [amountStr, setAmountStr] = useState('');
  const [txDate, setTxDate] = useState(() => toDateStr(new Date()));
  const [txNote, setTxNote] = useState('');
  const [editingId, setEditingId] = useState(null);

  // 新增自訂分類彈窗
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customIcon, setCustomIcon] = useState('drink');
  const [customType, setCustomType] = useState('expense');

  // 角色陪伴圖鑑彈窗、月底感謝信彈窗 & 手機版圖示教學彈窗
  const [showGallery, setShowGallery] = useState(false);
  const [showMonthlyLetter, setShowMonthlyLetter] = useState(false);

  // 雙手捧起餵食動畫狀態
  const [feedingAnim, setFeedingAnim] = useState({
    active: false,
    phase: 'idle',
    iconName: 'Coffee',
    amount: 0,
    type: 'expense',
    reactionText: ''
  });
  const sleeping = (wakingUp || (isSleepTime && Date.now() > wokeUntil)) && !feedingAnim.active && !celebrating && !giggling;

  // 生活手帳頁：點擊任一明細卡片觸發「史萊姆回憶與回饋」
  const [journalFilter, setJournalFilter] = useState('all');
  const [recalledTxId, setRecalledTxId] = useState(null);

  // 肚子消化圖：月份選擇器（近 3 個月，依手機日期自動產生）與折線圖左右滑動視窗
  const [selectedMonth, setSelectedMonth] = useState(() => toDateStr(new Date()).slice(0, 7));
  const recentMonths = useMemo(() => {
    const [y, m] = currentMonth.split('-').map(Number);
    return [2, 1, 0].map(back => {
      const d = new Date(y, m - 1 - back, 1);
      return { id: `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`, label: `${d.getMonth() + 1}月` };
    });
  }, [currentMonth]);
  const [selectedSlice, setSelectedSlice] = useState(null);
  const [curveOffset, setCurveOffset] = useState(0);


  // 一鍵清空重置所有帳目功能
  const handleClearAllRecords = () => {
    if (!window.confirm('確定要清空所有帳目嗎？此動作無法復原，建議先「匯出備份」。')) return;
    setTransactions([]);
    setRecalledTxId(null);
    setSelectedSlice(null);
    try {
      localStorage.removeItem('glimmer_transactions_v4');
    } catch {}
    showTemporaryWhisper('帳本已經幫你擦得乾乾淨淨，從 $0 重新開始囉 ✨');
  };

  // 匯出 / 匯入備份（手機瀏覽器資料被清除時可還原）
  const handleExportBackup = () => {
    const data = { version: 2, exportedAt: new Date().toISOString(), startDate, dailyComfortLimit, monthlyCap, familyCap, pockets, customCurs, categories, transactions };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `記帳備份_${todayDate}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const handleImportBackup = (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!Array.isArray(data.transactions) || !Array.isArray(data.categories)) throw new Error('bad');
        if (!window.confirm(`匯入 ${data.transactions.length} 筆紀錄，將覆蓋目前帳本，確定嗎？`)) return;
        setCategories(data.categories);
        setTransactions(data.transactions);
        if (data.dailyComfortLimit) setDailyComfortLimit(Number(data.dailyComfortLimit));
        if (data.monthlyCap) setMonthlyCap(Number(data.monthlyCap));
        if (data.familyCap) setFamilyCap(Number(data.familyCap));
        if (Array.isArray(data.pockets)) setPockets(data.pockets);
        if (Array.isArray(data.customCurs)) setCustomCurs(data.customCurs);
        if (data.startDate) { try { localStorage.setItem('glimmer_start_date_v4', data.startDate); } catch {} }
        showTemporaryWhisper('備份還原完成，我們的回憶都回來囉 ✨');
      } catch {
        window.alert('檔案格式不正確，無法還原。');
      }
    };
    reader.readAsText(file);
  };

  // ------------------------------------------
  // 收支與「日均舒適圈」計算
  // ------------------------------------------
  const summary = useMemo(() => {
    let todayExp = 0;
    let monthExp = 0;
    let monthInc = 0;

    let familyMonth = 0, companyMonth = 0, companyCount = 0; const pocketSpent = {};
    transactions.forEach(t => {
      const val = Number(t.amount) || 0;
      const lg = lgOf(t);
      if (lg !== 'personal') {
        if (t.type === 'expense' && t.date.startsWith(currentMonth)) { if (lg === 'family') familyMonth += val; else if (lg === 'company') { companyMonth += val; companyCount += 1; } }
        return;
      }
      if (t.date.startsWith(currentMonth)) {
        if (t.type === 'income') monthInc += val;
        else { monthExp += val; pocketSpent[t.categoryId] = (pocketSpent[t.categoryId] || 0) + val; }
      }
      if (t.type === 'expense' && t.date === todayDate) {
        todayExp += val;
      }
    });

    const comfortRemaining = dailyComfortLimit - todayExp;
    return {
      todayExp,
      monthExp,
      monthInc,
      familyMonth, companyMonth, companyCount, pocketSpent,
      comfortRemaining
    };
  }, [transactions, dailyComfortLimit, todayDate, currentMonth]);

  // 每月上限 → 自動算出今天的舒適額度 =（上限 − 本月今天以前已花）÷ 本月剩餘天數（含今天）
  // 夾在 上限÷60 ～ 上限÷15 之間，避免月初或超支時數字失真
  const selMonthLedger = useMemo(() => {
    const r = { family: 0, company: 0, companyCount: 0 };
    transactions.forEach(t => { if (t.type !== 'expense' || !t.date.startsWith(selectedMonth)) return; const lg = lgOf(t); if (lg === 'family') r.family += Number(t.amount); else if (lg === 'company') { r.company += Number(t.amount); r.companyCount += 1; } });
    return r;
  }, [transactions, selectedMonth]);
  const capInfo = useMemo(() => {
    if (!monthlyCap) return null;
    const [y, m] = todayDate.split('-').map(Number);
    const dim = new Date(y, m, 0).getDate();
    const left = dim - Number(todayDate.slice(8)) + 1;
    const before = summary.monthExp - summary.todayExp;
    const raw = (monthlyCap - before) / left;
    const daily = Math.round(Math.max(monthlyCap / 60, Math.min(monthlyCap / 15, raw)) / 10) * 10;
    return { ratio: summary.monthExp / monthlyCap, daily, left, remain: monthlyCap - summary.monthExp, avg: Math.round(monthlyCap / dim), dim };
  }, [monthlyCap, summary.monthExp, summary.todayExp, todayDate]);
  const effLimit = capInfo ? capInfo.daily : dailyComfortLimit;

  const moodState = useMemo(() => {
    if (capInfo) return capInfo.ratio > 1 ? 'over' : capInfo.ratio >= 0.9 ? 'full' : 'great';
    if (summary.todayExp > dailyComfortLimit) return 'over';
    if (summary.todayExp >= dailyComfortLimit * 0.8) return 'full';
    return 'great';
  }, [summary.todayExp, dailyComfortLimit, capInfo]);

  // ------------------------------------------
  // 觸發「雙手捧起吃掉」記帳流程 (含傲嬌與貪吃情境對話)
  // ------------------------------------------
  const triggerFeedRecord = (finalAmount, finalNote, categoryObj) => {
    const num = parseInt(finalAmount, 10);
    if (!num || num <= 0 || !categoryObj) return;

    const isEditing = Boolean(editingId);
    setActiveCategory(null);

    if (isEditing) {
      setTransactions(prev => prev.map(item => 
        item.id === editingId 
          ? { ...item, categoryId: categoryObj.id, amount: num, date: txDate, note: finalNote || categoryObj.name, type: categoryObj.type, ledger: categoryObj.type === 'income' ? 'personal' : txLedger, ...(txLedger === 'travel' && categoryObj.type !== 'income' ? { cur: txCur } : { cur: undefined }) }
          : item
      ));
      setEditingId(null);
      setAmountStr('');
      setTxNote('');
      return;
    }

    setShowWhisper(false);
    const wasHungry = milestoneIdx === 5;

    // 根據金額與狀態產生「貪吃 / 傲嬌小對話」
    const persona = personaOf(currentSpirit.id);
    let greedyReaction = '';
    let feedFace = persona.faces.food;
    let capHit = false;
    if (categoryObj.type === 'income' && txLedger !== 'personal') setTxLedger('personal');
    const isPersonal = txLedger === 'personal' || categoryObj.type === 'income';
    if (!isPersonal) {
      { const ex = EX[currentSpirit.id]; greedyReaction = txLedger === 'family' ? pickOne(ex.family(num)) : txLedger === 'travel' ? pickOne(ex.travel(fmtCur(num, txCur))) : pickOne(ex.company(num)); }
    } else if (categoryObj.type === 'income') {
      greedyReaction = pickOne(EX[currentSpirit.id].income(num));
    } else if (wasHungry) {
      greedyReaction = pickOne(persona.hungry);
    } else if (txDate !== todayDate) {
      greedyReaction = `幫你補記到 ${Number(txDate.slice(5, 7))}/${Number(txDate.slice(8))} 了，$${num} 收到！`;
    } else if (monthlyCap && categoryObj.type === 'expense' && txDate.startsWith(currentMonth) && !(summary.monthExp <= monthlyCap && summary.monthExp + num > monthlyCap) && (() => {
      const pk = pockets.find(p => p.catId === categoryObj.id);
      if (!pk) return false;
      const s0 = summary.pocketSpent[categoryObj.id] || 0;
      if (s0 < pk.amount && s0 + num >= pk.amount) { greedyReaction = POCKET_FULL[currentSpirit.id] || POCKET_FULL.amber; feedFace = persona.faces.cap; capHit = true; return true; }
      return false;
    })()) {
      // 口袋滿了（每個口袋跨過時只提醒一次）
    } else if (monthlyCap && categoryObj.type === 'expense' && txDate.startsWith(currentMonth) && (() => {
      const r0 = summary.monthExp / monthlyCap, r1 = (summary.monthExp + num) / monthlyCap;
      const line = r0 <= 1 && r1 > 1 ? persona.capOver : r0 < 0.9 && r1 >= 0.9 ? persona.cap90 : r0 < 0.7 && r1 >= 0.7 ? persona.cap70 : null;
      if (line) { greedyReaction = pickOne(line); feedFace = r1 > 1 ? persona.faces.over : persona.faces.cap; capHit = true; }
      return Boolean(line);
    })()) {
      // 額度提醒（70% / 90% / 超過）
    } else if (num >= 500) {
      greedyReaction = pickOne(persona.big(num)); feedFace = persona.faces.big;
    } else if (num <= 100) {
      greedyReaction = pickOne(persona.small(num));
    } else {
      greedyReaction = pickOne(persona.feed(num, categoryObj.shortName));
    }

    setFeedingAnim({
      active: true,
      phase: 'spawn',
      iconName: categoryObj.iconName,
      icon: iconKeyOf(categoryObj),
      amount: num,
      type: categoryObj.type,
      reactionText: greedyReaction
    });

    setTimeout(() => {
      setFeedingAnim(prev => ({ ...prev, phase: 'grabbing' }));
    }, 150);

    setTimeout(() => {
      setFeedingAnim(prev => ({ ...prev, phase: 'eating' }));
      const newEntry = {
        id: 'tx_' + Date.now(),
        categoryId: categoryObj.id,
        amount: num,
        date: txDate,
        period: currentPeriod === 'morning' ? '早晨' : currentPeriod === 'afternoon' ? '午後' : '夜晚',
        weather: currentPeriod === 'morning' ? '🌅 晨光' : currentPeriod === 'afternoon' ? '☀️ 午後' : '🌙 夜晚',
        note: (finalNote || '').trim() || categoryObj.name,
        type: categoryObj.type,
        ledger: categoryObj.type === 'income' ? 'personal' : txLedger,
        ...(txLedger === 'travel' && categoryObj.type !== 'income' ? { cur: txCur } : {})
      };
      setTransactions(prev => [newEntry, ...prev]);
      setTxLedger('personal');
      setRecalledTxId(newEntry.id);
    }, 700);

    setTimeout(() => {
      setFeedingAnim({ active: false, phase: 'idle', iconName: 'Coffee', amount: 0, type: 'expense', reactionText: '' });
      // 吃完：身體發光一下（B），再說一句話
      setGlowing(true);
      setTimeout(() => setGlowing(false), 1000);
      if (isPersonal && categoryObj.type === 'expense' && txDate === todayDate && summary.todayExp + num <= effLimit && !(capInfo && summary.monthExp + num > monthlyCap)) {
        triggerCelebration();
      }
      // 連續記帳 7 / 30 天
      let streakLine = null;
      if (txDate === todayDate) {
        const dates = new Set(transactions.map(t => t.date)); dates.add(todayDate);
        let st = 0; const d0 = new Date(todayDate + 'T00:00:00');
        while (dates.has(toDateStr(d0))) { st += 1; d0.setDate(d0.getDate() - 1); }
        const hadToday = transactions.some(t => t.date === todayDate);
        if (!hadToday && !capHit && (st === 3 || st === 7 || st === 30)) streakLine = st === 3 ? persona.streak3 : st === 7 ? persona.streak7 : persona.streak30;
      }
      showTemporaryWhisper(streakLine || greedyReaction, streakLine || capHit ? null : num, streakLine || capHit ? 3500 : 2800, streakLine ? persona.faces.rare : capHit ? feedFace : faceFor(currentSpirit.id, greedyReaction, feedFace));
    }, 1850);

    setAmountStr('');
    setTxNote('');
  };

  const handleKeypad = (key) => {
    if (key === 'C') setAmountStr('');
    else if (key === 'BACK') setAmountStr(prev => prev.slice(0, -1));
    else if (amountStr.length < (txLedger === 'travel' ? 7 : 6)) {
      setAmountStr(prev => (prev === '0' ? String(key) : prev + String(key)));
    }
  };

  const dragStart = (e, id, ids) => {
    if (e.target.closest('button,input,select')) return;
    const d = dragRef.current; clearTimeout(d.timer);
    d.startY = e.clientY; d.id = id; d.pid = e.pointerId; d.el = e.currentTarget; d.active = false;
    d.timer = setTimeout(() => {
      const tops = ids.map(i => { const r = rowEls.current[i]; return r ? r.getBoundingClientRect() : null; });
      if (tops.some(t => !t)) return;
      d.active = true; d.order = ids.slice(); d.slots = tops.map(t => t.top); d.h = tops[ids.indexOf(id)].height + 6;
      d.orig = tops[ids.indexOf(id)].top;
      try { d.el.setPointerCapture(d.pid); } catch {}
      setIconPickId(null); setRenameId(null);
      setDragOrder(ids.slice()); setDragId(id); setDragT(0);
      try { navigator.vibrate && navigator.vibrate(12); } catch {}
    }, 380);
  };
  const dragMove = (e) => {
    const d = dragRef.current;
    if (!d.active) { if (d.timer && Math.abs(e.clientY - d.startY) > 8) { clearTimeout(d.timer); d.timer = null; } return; }
    const dy = e.clientY - d.startY;
    const centerY = d.orig + dy + d.h / 2;
    let target = 0, best = 1e9;
    d.slots.forEach((t, k) => { const dist = Math.abs(t + d.h / 2 - centerY); if (dist < best) { best = dist; target = k; } });
    const cur = d.order.indexOf(d.id);
    if (target !== cur) { const next = d.order.slice(); next.splice(cur, 1); next.splice(target, 0, d.id); d.order = next; setDragOrder(next); }
    setDragT(d.orig + dy - d.slots[d.order.indexOf(d.id)]);
  };
  const dragEnd = () => {
    const d = dragRef.current; clearTimeout(d.timer); d.timer = null;
    if (!d.active) return;
    d.active = false;
    const order = d.order;
    setCategories(prev => prev.map(c => (order.includes(c.id) ? { ...c, ord: order.indexOf(c.id) } : c)));
    setDragOrder(null); setDragId(null); setDragT(0); setFocusedCatIdx(0);
  };
  const visibleOf = (type) => categories.filter(c => c.type === type && !c.hidden).length;
  const toggleHideCat = (cat) => {
    setEditMsg('');
    if (cat.hidden) { setCategories(prev => prev.map(c => c.id === cat.id ? { ...c, hidden: false } : c)); return; }
    if (cat.type === 'expense' && visibleOf('expense') <= 3) { setEditMsg('至少要留 3 個支出項目喔。'); return; }
    if (cat.type === 'income' && visibleOf('income') <= 1) { setEditMsg('至少要留 1 個收入項目喔。'); return; }
    const pk = pockets.find(p => p.catId === cat.id);
    if (pk && !window.confirm(`「${cat.shortName}」有小口袋，隱藏後口袋會一起收起來，確定嗎？`)) return;
    if (pk) setPockets(prev => prev.filter(p => p.catId !== cat.id));
    setCategories(prev => prev.map(c => c.id === cat.id ? { ...c, hidden: true } : c));
    setFocusedCatIdx(0);
  };
  const saveRename = (cat) => {
    const v = renameVal.trim();
    if (!v) { setRenameId(null); return; }
    if (categories.some(c => c.id !== cat.id && (c.shortName === v || c.name === v))) { setEditMsg('已經有同名的項目囉，換一個名字吧。'); return; }
    setCategories(prev => prev.map(c => c.id === cat.id ? { ...c, name: v, shortName: v } : c));
    setRenameId(null); setEditMsg('');
  };

  const handleAddCustomCategory = (e) => {
    e.preventDefault();
    if (!customName.trim()) return;
    const newCat = {
      id: 'cat_' + Date.now(),
      createdAt: todayDate,
      name: customName.trim(),
      shortName: customName.trim(),
      iconName: 'Coffee',
      icon: customIcon,
      emoji: '',
      type: 'expense',
      color: currentSpirit.primary,
      softBg: 'rgba(217, 119, 6, 0.15)',
      memoryTemplates: [
        `我記得這筆「${customName.trim()}」！這是你用心生活的可貴紀錄 ✨`
      ],
      presets: [{ label: customName.trim(), amount: 150 }]
    };
    setFocusedCatIdx(0);
    setCategories(prev => [...prev, newCat]);
    setCustomName('');
    setShowAddCategory(false);
    // 新增完直接打開該項目的餵食面板，體驗更順暢
    setActiveCategory(newCat);
  };

  // ------------------------------------------
  // 生活手帳頁：依日期分組整理 (無印風乾淨時間軸) & 史萊姆回憶生成
  // ------------------------------------------
  const inView = (t) => (ledgerView === 'all' ? lgOf(t) !== 'travel' : lgOf(t) === ledgerView && (ledgerView !== 'travel' || (t.cur || 'JPY') === travelCur));
  const travelUsed = useMemo(() => { const m = []; transactions.forEach(t => { if (lgOf(t) === 'travel' && t.cur && !m.includes(t.cur)) m.push(t.cur); }); return m; }, [transactions]);
  useEffect(() => { if (ledgerView === 'travel' && travelUsed.length && !travelUsed.includes(travelCur)) setTravelCur(travelUsed[0]); }, [ledgerView, travelUsed, travelCur]);
  const money = (n) => (ledgerView === 'travel' ? `${symOf(travelCur)}${Number(n).toLocaleString()}` : `$${Number(n).toLocaleString()}`);
  const groupedJournal = useMemo(() => {
    const byLedger = transactions.filter(inView);
    const list = journalFilter === 'today' 
      ? byLedger.filter(t => t.date === todayDate) 
      : byLedger;

    const groups = {};
    list.forEach(tx => {
      if (!groups[tx.date]) {
        groups[tx.date] = {
          date: tx.date,
          weather: tx.weather || '☀️ 晴朗',
          dayExpense: 0,
          dayIncome: 0,
          items: []
        };
      }
      groups[tx.date].items.push(tx);
      if (tx.type === 'income') groups[tx.date].dayIncome += Number(tx.amount);
      else groups[tx.date].dayExpense += Number(tx.amount);
    });

    return Object.values(groups).sort((a, b) => b.date.localeCompare(a.date));
  }, [transactions, journalFilter, todayDate, ledgerView, travelCur]);

  const recalledMemoryData = useMemo(() => {
    const targetTx = transactions.find(t => t.id === recalledTxId) || transactions[0];
    if (!targetTx) return null;
    const cat = categories.find(c => c.id === targetTx.categoryId) || categories[0];
    const templates = cat.memoryTemplates || ['我記得這筆花費！我們一起度過了很棒的一天呢 ✨'];
    const templateText = templates[targetTx.amount % templates.length];
    return {
      tx: targetTx,
      cat,
      dateLabel: targetTx.date.slice(5).replace('-', '月') + '日',
      comment: `「${templateText}（${targetTx.note} ${lgOf(targetTx) === 'travel' ? fmtCur(targetTx.amount, targetTx.cur || 'JPY') : '$' + targetTx.amount}）」`.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B50}\u{FE0F}]/gu, '').replace(/\s+（/, '（')
    };
  }, [transactions, recalledTxId, categories]);

  // ------------------------------------------
  // 肚子消化圖：整月消費總額、史萊姆轉向能量圓餅、可左右滑動的多日折線圖
  // ------------------------------------------
  const analytics = useMemo(() => {
    const monthTx = transactions.filter(t => t.date.startsWith(selectedMonth) && inView(t));
    const expList = monthTx.filter(t => t.type === 'expense');
    const incList = monthTx.filter(t => t.type === 'income');

    const totalExpense = expList.reduce((acc, cur) => acc + Number(cur.amount), 0);
    const totalIncome = incList.reduce((acc, cur) => acc + Number(cur.amount), 0);
    const safeTotal = totalExpense || 1;

    const grouped = {};
    expList.forEach(t => {
      grouped[t.categoryId] = (grouped[t.categoryId] || 0) + Number(t.amount);
    });

    let currentDeg = 0;
    const segments = Object.entries(grouped)
      .map(([catId, amount]) => {
        const cat = categories.find(c => c.id === catId) || categories[0];
        const ratio = amount / safeTotal;
        const deg = ratio * 360;
        const start = currentDeg;
        const midAngle = start + deg / 2;
        currentDeg += deg;
        return {
          catId,
          name: cat.name,
          shortName: cat.shortName,
          iconName: cat.iconName,
          emoji: cat.emoji || '✨',
          color: cat.color,
          amount,
          percent: Math.round(ratio * 100),
          startAngle: start,
          endAngle: currentDeg,
          midAngle
        };
      })
      .sort((a, b) => b.amount - a.amount);

    // 折線圖：從最早紀錄（至少 30 天前）到今天，可左右滑動看不同天
    const earliest = transactions.reduce((m, t) => (t.date < m ? t.date : m), todayDate);
    const minStart = (() => { const x = new Date(todayDate + 'T00:00:00'); x.setDate(x.getDate() - 29); return toDateStr(x); })();
    const startD = earliest < minStart ? earliest : minStart;
    const allDays = [];
    for (let d = new Date(startD + 'T00:00:00'); toDateStr(d) <= todayDate; d.setDate(d.getDate() + 1)) {
      const fullDate = toDateStr(d);
      const sum = transactions.filter(t => t.type === 'expense' && t.date === fullDate && inView(t)).reduce((acc, t) => acc + Number(t.amount), 0);
      allDays.push({ fullDate, label: `${d.getMonth() + 1}/${d.getDate()}`, amount: sum });
    }

    return { segments, totalExpense, totalIncome, allDays, count: expList.length };
  }, [transactions, categories, selectedMonth, currentMonth, todayDate, ledgerView, travelCur]);

  // 計算當前折線圖視窗的 5 個日期點 (支援左右滑動切換)
  const visibleCurvePoints = useMemo(() => {
    const total = analytics.allDays.length;
    const windowSize = Math.min(7, total);
    const maxOffset = Math.max(0, total - windowSize);
    const safeOffset = Math.min(Math.max(0, curveOffset), maxOffset);
    const startIdx = total - windowSize - safeOffset;
    return {
      points: analytics.allDays.slice(startIdx, startIdx + windowSize),
      canGoPrev: safeOffset < maxOffset,
      canGoNext: safeOffset > 0
    };
  }, [analytics.allDays, curveOffset]);

  const describeDonutArc = (cx, cy, r, startAngle, endAngle) => {
    const gap = analytics.segments.length > 1 ? 5 : 0;
    const sAngle = startAngle + gap / 2;
    let eAngle = endAngle - gap / 2;
    if (eAngle - sAngle >= 359.5) eAngle = sAngle + 359.5;
    if (eAngle <= sAngle) eAngle = sAngle + 1;

    const rad = (deg) => ((deg - 90) * Math.PI) / 180;
    const x1 = cx + r * Math.cos(rad(sAngle));
    const y1 = cy + r * Math.sin(rad(sAngle));
    const x2 = cx + r * Math.cos(rad(eAngle));
    const y2 = cy + r * Math.sin(rad(eAngle));
    const largeArc = eAngle - sAngle > 180 ? 1 : 0;

    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
  };

  // 月底史萊姆感謝信統計資料
  const monthlyLetterStats = useMemo(() => {
    const monthTx = transactions.filter(t => t.date.startsWith(selectedMonth) && lgOf(t) === 'personal');
    const expList = monthTx.filter(t => t.type === 'expense');
    const totalExp = expList.reduce((s, t) => s + Number(t.amount), 0);
    const uniqueDays = new Set(monthTx.map(t => t.date)).size;

    const byCat = {};
    expList.forEach(t => {
      byCat[t.categoryId] = (byCat[t.categoryId] || 0) + Number(t.amount);
    });
    const topCatEntry = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0];
    const topCat = topCatEntry
      ? categories.find(c => c.id === topCatEntry[0]) || categories[0]
      : categories[0];

    return {
      monthLabel: selectedMonth.replace('-', '年') + '月',
      totalExp,
      txCount: expList.length,
      uniqueDays,
      topCatName: topCat?.name || '日常餐點',
      topCatEmoji: topCat?.emoji || '🍱',
      topCatAmount: topCatEntry ? topCatEntry[1] : 0
    };
  }, [transactions, selectedMonth, categories]);

  // ------------------------------------------
  // 三種全局主題配色 + 隨時間日夜光影疊加
  // ------------------------------------------
  // 三種全局主題配色 + 隨時間日夜光影疊加 (嚴格確保深色模式下底部按鈕文字 100% 清晰)
  // ------------------------------------------
  // 帳本小果凍標籤（個人／家庭／公司；withAll 時多一顆「全部」）
  const travelCurChips = () => (ledgerView === 'travel' && travelUsed.length > 1) ? (
    <div className="flex items-center gap-1.5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
      {travelUsed.map(c => { const on = travelCur === c; return (<button key={c} type="button" onClick={() => setTravelCur(c)} className="shrink-0 h-6 px-2.5 rounded-full text-[11px] font-bold" style={{ background: on ? LEDGER_TONE.travel.bg : 'rgba(0,0,0,.04)', color: on ? LEDGER_TONE.travel.fg : '#8A7F72' }}>{c} {symOf(c)}</button>); })}
    </div>
  ) : null;
  const ledgerChips = (value, onChange, withAll = false, small = false) => {
    const items = [...(withAll ? [{ id: 'all', label: '全部', Icon: null }] : []), ...LEDGERS];
    const dk = theme === 'dark';
    return (
      <div className="flex items-center gap-1.5">
        {items.map(({ id, label, Icon }) => {
          const on = value === id;
          const tone = LEDGER_TONE[id] || null;
          const col = tone ? tone.fg : (dk ? currentSpirit.darkAccentText : currentSpirit.primary);
          return (
            <button key={id} type="button" onClick={() => onChange(id)}
              className={`flex items-center justify-center gap-1 rounded-full font-bold transition-all ${small ? 'h-7 px-2.5 text-[11px]' : 'h-8 px-3 text-[12px]'}`}
              style={{
                background: on ? (tone ? tone.bg : `${currentSpirit.secondary}55`) : (dk ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.04)'),
                color: on ? col : (dk ? '#94A3B8' : '#8A7F72'),
                boxShadow: on ? `inset 0 -2px 0 ${col}33, 0 2px 6px ${col}22` : 'none',
                border: on ? `1.5px solid ${col}66` : '1.5px solid transparent',
              }}>
              {Icon && <Icon className="w-3.5 h-3.5" strokeWidth={2.4} />}
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    );
  };
  // 背景風格試作（目前只在預覽版用 localStorage 切換）
  const bgStyle = theme === 'light' ? 'glow' : '';
  const bgStyleCss = theme === 'dark' || !bgStyle ? undefined : ({
    glow: { backgroundImage: `radial-gradient(ellipse 80% 42% at 50% 38%, ${currentSpirit.secondary}66 0%, ${currentSpirit.secondary}22 45%, transparent 75%), linear-gradient(180deg, #FFFFFF, #F7F7F5)` },
    fade: { backgroundImage: `linear-gradient(180deg, ${currentSpirit.secondary}55 0%, #FFFFFF 42%, #FFFFFF 70%, ${currentSpirit.primary}18 100%)` },
    stage: { backgroundImage: `radial-gradient(ellipse 34% 5% at 50% 50%, ${currentSpirit.primary}40 0%, transparent 100%), radial-gradient(ellipse 70% 50% at 50% 8%, #FFFFFFEE 0%, transparent 70%), linear-gradient(180deg, ${currentSpirit.secondary}38 0%, ${currentSpirit.secondary}14 60%, #FFFFFF 100%)` },
  })[bgStyle];
  const themeConfig = useMemo(() => {
    const base = {
      beige: {
        outerBg: 'bg-[#E5DDD0]',
        shellBg: currentPeriod === 'morning'
          ? 'bg-gradient-to-b from-[#FFF9EC] via-[#F7EFE2] to-[#EFE6D5]'
          : currentPeriod === 'night'
          ? 'bg-gradient-to-b from-[#EFE9DE] via-[#E8E0D2] to-[#DFD5C4]'
          : 'bg-gradient-to-b from-[#FAF6EE] via-[#F5EFE4] to-[#EFE8DA]',
        textPrimary: 'text-[#26201B]',
        textSecondary: 'text-[#5A5046]',
        textMuted: 'text-[#84786B]',
        surface: 'bg-[#FFFDF9]/95 border-[#E2D9C8]',
        pill: 'bg-[#FFFDF9] border-[#DCD2C0]',
        dock: 'bg-[#EDE4D5]/95 border-[#DFD5C3]',
        dockItemActive: 'bg-white text-[#26201B] shadow-sm border border-[#DCD2C0]',
        dockItemInactive: 'text-[#4A4138] opacity-85 hover:opacity-100',
        activePill: 'bg-[#26201B] text-[#FAF6EE]'
      },
      light: {
        outerBg: 'bg-[#E2E8F0]',
        shellBg: currentPeriod === 'morning'
          ? 'bg-gradient-to-b from-[#FFFDF7] via-[#F8FAFC] to-[#EFF6FF]'
          : currentPeriod === 'night'
          ? 'bg-gradient-to-b from-[#F1F5F9] via-[#E2E8F0] to-[#CBD5E1]'
          : 'bg-gradient-to-b from-[#FFFFFF] via-[#F8FAFC] to-[#F1F5F9]',
        textPrimary: 'text-[#0F172A]',
        textSecondary: 'text-[#475569]',
        textMuted: 'text-[#64748B]',
        surface: 'bg-white/95 border-slate-200/85',
        pill: 'bg-white border-slate-200',
        dock: 'bg-slate-100/95 border-slate-200/90',
        dockItemActive: 'bg-white text-[#0F172A] shadow-sm border border-slate-200',
        dockItemInactive: 'text-[#334155] opacity-85 hover:opacity-100',
        activePill: 'bg-[#0F172A] text-white'
      },
      dark: {
        outerBg: 'bg-[#0F172A]',
        shellBg: 'bg-gradient-to-b from-[#1A1F45] via-[#121633] to-[#0A0C1E]',
        textPrimary: 'text-[#F8FAFC]',
        textSecondary: 'text-[#CBD5E1]',
        textMuted: 'text-[#94A3B8]',
        surface: 'bg-[#1E293B]/95 border-slate-700/80',
        pill: 'bg-[#1E293B] border-slate-700',
        dock: 'bg-[#162032]/95 border-slate-700/90',
        dockItemActive: 'bg-[#283548] text-[#FFFFFF] shadow-md border border-slate-500',
        dockItemInactive: 'text-[#E2E8F0] opacity-90 hover:opacity-100',
        activePill: 'bg-[#F8FAFC] text-[#0F172A]'
      }
    };
    return base[theme] || base.beige;
  }, [theme, currentPeriod]);

  // 折線圖觸控滑動手勢
  const [chartTouchStart, setChartTouchStart] = useState(null);

  return (
    <div 
      className={`w-full ${theme === 'dark' ? 'dark' : ''} ${themeConfig.outerBg} flex items-center justify-center transition-colors duration-700`}
      style={{ 
        height: '100dvh',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'PingFang TC', 'Noto Sans TC', 'Microsoft JhengHei', sans-serif" 
      }}
    >
      {/* 載入字體與軟糖物理動畫 */}
      <style>{`
        html, body, #root { margin: 0; height: 100%; overscroll-behavior: none; -webkit-tap-highlight-color: transparent; }
        input, button { -webkit-user-select: none; user-select: none; }
        
        @keyframes floatBreathe {
          0%, 100% { transform: translateY(0px) scale(1, 1); }
          50% { transform: translateY(-5px) scale(1.02, 0.98); }
        }
        @keyframes jellySquish {
          0%   { transform: scale(var(--sqx, 1.18), var(--sqy, 0.80)) translateY(6px); }
          22%  { transform: scale(var(--sqx, 1.18), var(--sqy, 0.80)) translateY(6px); }
          55%  { transform: scale(var(--rbx, 0.97), var(--rby, 1.03)) translateY(-2px); }
          78%  { transform: scale(1.015, 0.985); }
          100% { transform: scale(1, 1); }
        }
        }
        @keyframes celebrateJump {
          0%, 100% { transform: translateY(0) scale(1, 1); }
          25% { transform: translateY(-16px) scale(0.95, 1.07); }
          50% { transform: translateY(2px) scale(1.10, 0.92); }
          75% { transform: translateY(-8px) scale(0.98, 1.04); }
        }
        @keyframes celebrateConfetti {
          0% { opacity: 0; transform: translateY(-10px) scale(0.6) rotate(0deg); }
          25% { opacity: 1; }
          100% { opacity: 0; transform: translateY(150px) scale(1.2) rotate(35deg); }
        }
        @keyframes slimeRancherGulp {
          0%   { transform: scale(1, 1); }
          30%  { transform: scale(1.20, 1.15) translateY(-6px); }
          60%  { transform: scale(1.08, 0.92) translateY(3px); }
          82%  { transform: scale(0.97, 1.03); }
          100% { transform: scale(1, 1); }
        }
        @keyframes whisperFloat {
          0% { opacity: 0; transform: translateY(8px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes whisperAutoFade {
          0%   { opacity: 0; transform: translateY(8px) scale(0.94); }
          15%  { opacity: 1; transform: translateY(0px) scale(1); }
          80%  { opacity: 1; transform: translateY(0px) scale(1); }
          100% { opacity: 0; transform: translateY(-6px) scale(0.96); }
        }
        @keyframes spinUltraSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes exitLeft { to { transform: translateX(-140%) rotate(-14deg); opacity: 0; } }
        @keyframes exitRight { to { transform: translateX(140%) rotate(14deg); opacity: 0; } }
        @keyframes enterRight { 0% { transform: translateX(140%) rotate(10deg); opacity: 0; } 60% { transform: translateX(-6%) rotate(-3deg); opacity: 1; } 80% { transform: translateX(2%) scale(1.04,.96); } 100% { transform: none; } }
        @keyframes enterLeft { 0% { transform: translateX(-140%) rotate(-10deg); opacity: 0; } 60% { transform: translateX(6%) rotate(3deg); opacity: 1; } 80% { transform: translateX(-2%) scale(1.04,.96); } 100% { transform: none; } }
        .animate-exit-left { animation: exitLeft .28s ease-in forwards; }
        .animate-exit-right { animation: exitRight .28s ease-in forwards; }
        .animate-enter-right { animation: enterRight .52s cubic-bezier(.3,.9,.4,1); }
        .animate-enter-left { animation: enterLeft .52s cubic-bezier(.3,.9,.4,1); }
        @keyframes pokeHead { 0% { transform: scale(1,1); } 30% { transform: scale(1.1,.82) translateY(10px); } 60% { transform: scale(.96,1.05); } 100% { transform: scale(1,1); } }
        .animate-poke-head { animation: pokeHead .6s cubic-bezier(.25,1,.5,1); transform-origin: 50% 90%; }
        @keyframes pokeCheek { 0% { transform: scale(1,1); } 30% { transform: scale(1.1,.86) translateY(6px); } 60% { transform: scale(.97,1.04); } 100% { transform: scale(1,1); } }
        .animate-poke-cheek { animation: pokeCheek .55s cubic-bezier(.25,1,.5,1); }
        @keyframes nod { 0%,100% { transform: translateY(0) scale(1,1); } 40% { transform: translateY(3px) scale(1.06,.92); } }
        .animate-nod { animation: nod .28s ease-out; }
        .key-jelly { transition: transform .12s ease; }
        button:not(.arc-item):not(.key-jelly) { transition: transform .18s cubic-bezier(.3,1.6,.5,1); }
        button:not(.arc-item):not(.key-jelly):active { transform: scale(0.93, 0.88); }
        .q-card { transition: transform .2s cubic-bezier(.3,1.6,.5,1); }
        .q-card:active { transform: scale(0.97, 0.95); }
        .key-jelly:active { transform: scale(1.06,.86); }
        @keyframes markPop { 0% { transform: scale(0.2); opacity: 0; } 60% { transform: scale(1.2); opacity: 1; } 100% { transform: scale(1); } }
        .animate-mark-pop { animation: markPop .35s cubic-bezier(.3,1.6,.5,1); }
        @keyframes floatHeart { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        .animate-float-heart { animation: floatHeart 1.2s ease-in-out infinite; transform-box: fill-box; }
        @keyframes exTilt { 0%,100% { transform: scale(1,1); } 30% { transform: scale(1.06,.93); } 65% { transform: scale(.98,1.02); } }
        .expr-tilt { animation: exTilt 1.4s ease-in-out; }
        @keyframes exBounce { 0%,100% { transform: translateY(0) scale(1,1); } 25% { transform: translateY(-14px) scale(.95,1.06); } 50% { transform: translateY(0) scale(1.08,.92); } 70% { transform: translateY(-6px); } }
        .expr-bounce { animation: exBounce .9s ease-out; }
        @keyframes exJump { 0% { transform: translate(0,0); } 20% { transform: translate(0,-22px) scale(.92,1.1); } 45% { transform: translate(0,4px) scale(1.1,.9); } 70% { transform: translate(0,-4px); } 100% { transform: none; } }
        .expr-jumpback { animation: exJump .8s cubic-bezier(.3,.8,.4,1); }
        @keyframes exPout { 0% { transform: none; } 30% { transform: scale(1.1,.9); } 100% { transform: scale(1.05,.95); } }
        .expr-pout { animation: exPout .5s ease-out forwards; }
        @keyframes exDroop { 0% { transform: none; } 100% { transform: scale(1.06,.9); } }
        .expr-droop { animation: exDroop .6s ease-out forwards; }
        @keyframes exSway { 0%,100% { transform: scale(1,1); } 50% { transform: scale(1.04,.95); } }
        .expr-sway { animation: exSway 1s ease-in-out 2; }
        @keyframes twinkle { 0%,100% { opacity: .15; transform: scale(.7); } 50% { opacity: 1; transform: scale(1.15); } }
        .animate-twinkle { animation: twinkle 2.8s ease-in-out infinite; }
        @keyframes giggle { 0%,100% { transform: scale(1,1); } 15% { transform: scale(1.08,.9); } 30% { transform: scale(.97,1.04); } 45% { transform: scale(1.07,.92); } 60% { transform: scale(.98,1.03); } 80% { transform: scale(1.03,.97); } }
        .animate-giggle { animation: giggle 1.1s ease-in-out; }
        @keyframes zz { 0% { opacity: 0; transform: translateY(4px); } 40% { opacity: 1; } 100% { opacity: 0; transform: translateY(-10px); } }
        .animate-zz { animation: zz 2.4s ease-in-out infinite; }
        .animate-float-breathe {
          animation: floatBreathe 3.8s ease-in-out infinite;
        }
        .animate-jelly-squish {
          animation: jellySquish var(--sqdur, 0.72s) cubic-bezier(0.33, 0.9, 0.4, 1) forwards;
        }
        .animate-celebrate-jump {
          animation: celebrateJump 0.85s ease-in-out infinite;
        }
        .animate-celebrate-confetti {
          animation: celebrateConfetti 2.2s ease-out forwards;
        }
        .animate-slime-rancher-gulp {
          animation: slimeRancherGulp 0.65s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .animate-whisper-float {
          animation: whisperFloat 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-whisper-auto-fade {
          animation: whisperAutoFade 2.0s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-spin-ultra-slow {
          animation: spinUltraSlow 36s linear infinite;
        }
        .tabular-nums {
          font-variant-numeric: tabular-nums;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* 手機外框容器：改用明確像素高度 750px 取代 h-screen，徹底解決手機內建 WebView 高度塌陷黑屏問題 */}
      <div 
        className={`relative w-full max-w-[480px] h-full overflow-hidden flex flex-col justify-between ${themeConfig.shellBg} transition-all duration-700`}
        style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)', ...(bgStyleCss || {}) }}
      >
        {/* 隨手機時間變化的光線：晨光、正午、黃昏、夜晚星星 */}
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-1000 z-0"
          style={{
            background: theme === 'dark'
              ? (ambient === 'dawn' ? 'linear-gradient(180deg, rgba(255,190,140,0.10) 0%, transparent 40%)'
                : ambient === 'dusk' ? 'linear-gradient(180deg, rgba(255,140,120,0.10) 0%, transparent 40%)'
                : 'none')
              : ambient === 'dawn'
              ? 'linear-gradient(180deg, rgba(255,206,140,0.34) 0%, rgba(255,226,180,0.12) 35%, transparent 60%)'
              : ambient === 'noon'
              ? 'radial-gradient(ellipse at 50% -10%, rgba(255,255,255,0.55), transparent 60%)'
              : ambient === 'dusk'
              ? 'linear-gradient(180deg, rgba(255,140,110,0.30) 0%, rgba(255,186,140,0.14) 38%, transparent 65%)'
              : theme === 'dark'
              ? 'linear-gradient(180deg, rgba(60,70,160,0.22) 0%, transparent 55%)'
              : 'linear-gradient(180deg, rgba(55,55,130,0.20) 0%, rgba(90,90,170,0.06) 45%, transparent 70%)'
          }}
        />
        {theme === 'dark' && (
          <div className="absolute inset-0 pointer-events-none z-0">
            <div className="absolute inset-x-0 top-[12%] h-[30%] opacity-40" style={{ background: 'linear-gradient(160deg, transparent 20%, rgba(167,139,250,0.10) 45%, rgba(125,211,252,0.08) 55%, transparent 80%)' }} />
            {Array.from({ length: 38 }, (_, i) => {
              const x = (i * 37 + 11) % 100, y = (i * 53 + 7) % 92, r = 0.7 + ((i * 7) % 5) * 0.3;
              return <span key={i} className="absolute rounded-full animate-twinkle" style={{ left: `${x}%`, top: `${y}%`, width: r * 2, height: r * 2, background: i % 5 === 0 ? '#FDE68A' : '#FFFFFF', boxShadow: `0 0 ${r * 4}px rgba(255,255,255,.8)`, animationDelay: `${(i % 9) * 0.37}s`, animationDuration: `${2.4 + (i % 4) * 0.7}s` }} />;
            })}
          </div>
        )}
        {ambient === 'night' && theme !== 'dark' && (
          <div className="absolute inset-x-0 top-0 h-[45%] pointer-events-none z-0">
            {[[8,10,1.6,0],[18,26,1.2,1.1],[30,8,2,0.5],[44,18,1.3,1.7],[58,6,1.7,0.9],[70,22,1.2,2.2],[82,12,2,0.3],[92,30,1.4,1.4],[12,42,1.1,2.6],[64,40,1.5,0.7],[38,34,1.1,2],[88,48,1.3,1.2]].map(([x, y, r, d], i) => (
              <span key={i} className="absolute rounded-full animate-twinkle"
                style={{ left: `${x}%`, top: `${y}%`, width: r * 2, height: r * 2, background: theme === 'dark' ? '#FFF7D6' : '#FFFFFF', boxShadow: `0 0 ${r * 3}px ${theme === 'dark' ? '#FDE68A' : '#C7D2FE'}`, animationDelay: `${d}s` }} />
            ))}
          </div>
        )}

        {/* ==========================================
            第一層：清爽極簡頂部列 (加上 whitespace-nowrap 防止文字擠成直排)
        ========================================== */}
        {sleeping && activeTab === 'feed' && (
          <div className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-700" style={{ background: 'linear-gradient(180deg, rgba(30,27,75,.28), rgba(30,27,75,.10))' }} />
        )}
        <div className="h-3 shrink-0" />

        {/* ==========================================
            核心內容區 (設定 min-h-0 確保內部元素完整顯示不裁切)
        ========================================== */}
        <main className="flex-1 min-h-0 overflow-y-auto no-scrollbar flex flex-col justify-between px-4 relative z-10">
          
          {/* ------------------------------------------
              分頁 1：微光飼育首頁 (三層式留白呼吸排版，完整顯示下方記帳項目列)
          ------------------------------------------ */}
          {activeTab === 'feed' && (
            <div className="h-full flex flex-col justify-between py-1">
              
              {/* 【第一層】極簡低調的日期與 5 隻史萊姆色點 */}
              <div className="flex items-center justify-between pt-2 px-1 shrink-0">
                <div className="flex items-center space-x-2">
                  <span className={`text-[19px] font-extrabold tracking-wide whitespace-nowrap ${themeConfig.textPrimary}`}>
                    {now.getMonth() + 1}月{now.getDate()}日 <span className="text-[15px] font-bold opacity-75">星期{WEEKDAYS[now.getDay()]}</span>
                  </span>
                  <span className={`text-[13px] font-bold px-3 py-1 rounded-full border whitespace-nowrap ${themeConfig.pill} ${themeConfig.textSecondary}`}>
                    {ambient === 'dawn' ? '🌅 晨光微風' : ambient === 'noon' ? '☀️ 正午暖陽' : ambient === 'dusk' ? '🌇 黃昏時分' : '🌙 靜謐星空'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                <button type="button" onClick={() => { setCarrierEdit(!carrier); setCarrierDraft(''); setCarrierDraft2(''); setCarrierErr(''); setShowCarrier(true); }} aria-label="載具條碼"
                  className={`w-9 h-9 rounded-full border flex items-center justify-center shadow-sm active:scale-90 transition-transform ${themeConfig.pill}`}>
                  <svg width="18" height="14" viewBox="0 0 18 14" fill="currentColor" className={themeConfig.textSecondary}><rect x="0" y="0" width="1.5" height="14"/><rect x="3" y="0" width="1" height="14"/><rect x="5.5" y="0" width="2" height="14"/><rect x="9" y="0" width="1" height="14"/><rect x="11" y="0" width="1.5" height="14"/><rect x="14" y="0" width="1" height="14"/><rect x="16.2" y="0" width="1.8" height="14"/></svg>
                </button>
                {/* 底色切換：米 → 淺 → 深 */}
                <button
                  onClick={() => {
                    const order = ['beige', 'light', 'dark'];
                    setTheme(order[(order.indexOf(theme) + 1) % 3]);
                  }}
                  aria-label="切換底色"
                  className={`w-10 h-10 rounded-full border flex items-center justify-center shadow-sm active:scale-90 transition-transform ${themeConfig.pill}`}
                >
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black"
                    style={theme === 'beige' ? { background: '#EADFCB', color: '#5A4632' } : theme === 'light' ? { background: '#FFFFFF', color: '#334155', boxShadow: 'inset 0 0 0 1px #CBD5E1' } : { background: 'linear-gradient(160deg,#1A1F45,#0A0C1E)', color: '#FDE68A' }}>
                    {theme === 'beige' ? '米' : theme === 'light' ? '淺' : '深'}
                  </span>
                </button>
                </div>

              </div>

              {/* 【第二層】中央純淨大舞台：3D 元素麻糬史萊姆 */}
              <div ref={slimeAreaRef} className="my-auto flex flex-col items-center justify-center shrink-0">
                <ElementalMochiSlime
                  spirit={currentSpirit}
                  milestone={currentMilestone}
                  moodState={moodState}
                  feedingAnim={feedingAnim}
                  celebrating={celebrating}
                  squishKey={squishKey}
                  whisperText={showWhisper ? customWhisper : ''}
                  whisperFeed={whisperFeed}
                  whisperMs={whisperMs}
                  whisperKeyProp={whisperKey}
                  expr={exprOverride}
                  exprStill={exprStill}
                  onCharge={(t) => { setTimeout(() => showTemporaryWhisper(EX[currentSpirit.id].charge[t > 0.7 ? 0 : t > 0.35 ? 1 : 2], null, 1600, pickOne(currentSpirit.id ? personaOf(currentSpirit.id).faces.tap : ['happy'])), 250); }}
                  whisperRare={whisperRare}
                  glowing={glowing}
                  pokeFx={pokeFx}
                  bodyAnimClass={switchAnim}
                  look={sleeping ? null : fingerLook}
                  onTapSlime={handleTapSlime}
                  onSwipeLeft={() => switchSpirit(-1)}
                  onSwipeRight={() => switchSpirit(1)}
                  theme={theme}
                  timePeriod={currentPeriod}
                  sleeping={sleeping}
                  giggling={giggling}
                  onRub={handleRub}
                />

                {/* 【第三層】角色名字（點一下進角色小屋）＋今天已餵食小數字 */}
                <div className="w-full text-center flex flex-col items-center mt-1">
                  <div className="flex items-center space-x-2">
                    <span
                      className="text-[26px] font-black tracking-wide"
                      style={{ color: theme === 'dark' ? currentSpirit.darkAccentText : currentSpirit.accentText }}
                    >
                      {currentSpirit.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* 晚上的心情詢問 */}
              {showMoodAsk && !showWelcome && (
                <div className={`mx-1 mb-1 px-3 py-2.5 rounded-2xl border backdrop-blur-md animate-whisper-float shrink-0 ${themeConfig.surface}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${themeConfig.textPrimary}`}>{currentSpirit.name}想知道：今天過得怎樣？</span>
                    <button onClick={() => { setShowMoodAsk(false); try { localStorage.setItem('glimmer_moodskip_' + todayDate, '1'); } catch {} }} className={`text-[11px] font-bold ${themeConfig.textSecondary}`}>略過</button>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5 mt-2">
                    {MOOD_OPTIONS.map(m => (
                      <button key={m.v} onClick={() => chooseMood(m.v)} className={`py-1.5 rounded-xl border text-[11px] font-bold active:scale-95 transition-transform ${themeConfig.pill} ${themeConfig.textPrimary}`}>
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 今天已餵食（放在項目列上方，離名字遠一點） */}
              <div className="flex items-center justify-center shrink-0 mt-2">
                <span className={`text-[12px] font-bold tabular-nums px-3 py-1 rounded-full border ${themeConfig.pill} ${themeConfig.textSecondary}`}>
                  {(() => { const left = effLimit - summary.todayExp; return left >= 0 ? `今天還能用 $${left.toLocaleString()}` : `今天多用了 $${(-left).toLocaleString()}`; })()}
                </span>
              </div>
              {/* 弧形滑動項目列：點一下選擇，再點一下餵食 */}
              {hintUses < 5 ? (
                <p className={`text-center text-[11px] font-semibold shrink-0 mt-1.5 ${themeConfig.textSecondary}`} style={{ opacity: 0.75 }}>
                  左右滑動或點選項目・再點一下就能餵{currentSpirit.name}
                </p>
              ) : <div className="h-2 shrink-0" />}
              <ArcDock
                categories={orderedCategories}
                focusedIdx={focusedCatIdx}
                onFocus={handleFocusCategory}
                onOpen={(cat) => openFeedPanel(cat)}
                onAdd={() => setShowAddCategory(true)}
                onEdit={() => setShowEditCat(true)}
                themeConfig={themeConfig}
                accent={theme === 'dark' ? currentSpirit.darkAccentText : currentSpirit.primary}
              />
            </div>
          )}

          {/* ------------------------------------------
              分頁 2：生活手帳頁 (無印風清爽每日時間軸 + 點擊明細觸發史萊姆回憶互動)
          ------------------------------------------ */}
          {activeTab === 'journal' && (
            <div className="py-3 space-y-4 pb-6">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className={`text-xl font-bold tracking-tight mt-0.5 ${themeConfig.textPrimary}`}>
                    生活手帳日記
                  </h2>
                </div>

                {/* 篩選切換 */}
                <div className={`flex p-0.5 rounded-full border ${themeConfig.pill}`}>
                  {[
                    { id: 'all', label: '全部日子' },
                    { id: 'today', label: '今日' }
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setJournalFilter(f.id)}
                      className={`px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider transition-all ${
                        journalFilter === f.id ? themeConfig.activePill : themeConfig.textSecondary
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="-mt-1">{ledgerChips(ledgerView, setLedgerView, true, true)}{travelCurChips() && <div className="mt-1.5">{travelCurChips()}</div>}</div>

              {/* 互動亮點：史萊姆的「手帳回憶錄」對話框（點選下方任一筆消費，史萊姆會回憶當天情境） */}
              {recalledMemoryData ? (
                <div 
                  key={recalledMemoryData.tx.id}
                  className={`p-4 rounded-3xl border backdrop-blur-md flex items-center animate-whisper-float ${themeConfig.surface}`}
                >
                  <div className="shrink-0 mr-2" style={{ width: 70, height: 62, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ElementalMochiSlime mini miniScale={0.26} look={{ x: 6, y: 1 }}
                      spirit={currentSpirit} milestone={currentMilestone} moodState="great" feedingAnim={{ active: false, phase: 'idle' }}
                      celebrating={false} squishKey={0} whisperText="" onTapSlime={() => {}} onSwipeLeft={() => {}} onSwipeRight={() => {}}
                      theme={theme} timePeriod={currentPeriod} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${themeConfig.textPrimary}`}>
                        {currentSpirit.name}的時光回憶・{recalledMemoryData.dateLabel}
                      </span>
                    </div>
                    <p className={`text-xs font-medium leading-relaxed mt-1.5 ${themeConfig.textPrimary}`}>
                      {recalledMemoryData.comment}
                    </p>
                  </div>
                </div>
              ) : (
                <div className={`p-6 rounded-3xl border backdrop-blur-md text-center space-y-2 ${themeConfig.surface}`}>
                  <p className={`text-xs font-bold ${themeConfig.textPrimary}`}>
                    目前帳本是全新空白的（$0）喔！
                  </p>
                  <p className={`text-[11px] ${themeConfig.textSecondary}`}>
                    回到「餵食記帳」分頁，點選下方早餐、午餐餵給{currentSpirit.name}吃，這裡就會長出你的生活足跡日記 ✨
                  </p>
                </div>
              )}

              {/* 清爽分日時間軸卡片群組 (解決雜亂感，極具整理感) */}
              <div className="space-y-5">
                {groupedJournal.map((group) => (
                  <div key={group.date} className="space-y-2">
                    {/* 每日標題列：日期 + 心情天氣貼紙 + 當日小計 */}
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs font-extrabold tracking-wide ${themeConfig.textPrimary}`}>
                          {group.date.slice(5).replace('-', '月')}日
                        </span>
                        {moods[group.date] && (
                          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${themeConfig.pill} ${themeConfig.textSecondary}`}>
                            心情・{MOOD_OPTIONS[moods[group.date] - 1].label}
                          </span>
                        )}
                      </div>
                      <div className={`text-[11px] font-semibold tabular-nums space-x-2 ${themeConfig.textSecondary}`}>
                        {group.dayExpense > 0 && <span>支出 {money(group.dayExpense)}</span>}
                      </div>
                    </div>

                    {/* 該日消費清單卡片 */}
                    <div className={`rounded-3xl border backdrop-blur-md divide-y divide-stone-200/50 dark:divide-slate-700/60 overflow-hidden ${themeConfig.surface}`}>
                      {group.items.map((tx) => {
                        const cat = categories.find(c => c.id === tx.categoryId) || categories[0];

                        const isInc = tx.type === 'income';
                        const isRecalled = recalledTxId === tx.id;

                        return (
                          <div
                            key={tx.id}
                            onClick={() => setRecalledTxId(tx.id)}
                            className={`q-card p-3.5 transition-all cursor-pointer flex items-center justify-between ${
                              isRecalled 
                                ? 'bg-amber-500/[0.07] dark:bg-amber-400/[0.08]' 
                                : 'hover:bg-black/[0.02] dark:hover:bg-white/[0.02]'
                            }`}
                          >
                            <div className="flex items-center space-x-3 min-w-0">
                              <div 
                                className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                                style={{ backgroundColor: cat.softBg }}
                              >
                                <PhotoIcon name={iconKeyOf(cat)} size={30} />
                              </div>

                              <div className="min-w-0">
                                <div className="flex items-center space-x-1.5">
                                  <span className={`text-xs font-bold tracking-wide ${themeConfig.textPrimary}`}>
                                    {cat.name}
                                  </span>
                                  {tx.period && (
                                    <span className={`text-[10px] font-medium px-1.5 py-0.2 rounded-md bg-black/[0.05] dark:bg-white/[0.08] ${themeConfig.textSecondary}`}>
                                      {tx.period}
                                    </span>
                                  )}
                                  {lgOf(tx) !== 'personal' && ledgerView !== lgOf(tx) && (
                                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md" style={{ background: LEDGER_TONE[lgOf(tx)].bg, color: LEDGER_TONE[lgOf(tx)].fg }}>
                                      {lgOf(tx) === 'family' ? '家庭' : lgOf(tx) === 'travel' ? '旅遊' : '公司'}
                                    </span>
                                  )}
                                </div>
                                <p className={`text-xs font-medium truncate mt-0.5 ${themeConfig.textSecondary}`}>
                                  {tx.note}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2 shrink-0 ml-2">
                              <span className={`text-sm font-extrabold tabular-nums whitespace-nowrap ${
                                isInc ? 'text-emerald-600 dark:text-emerald-400' : themeConfig.textPrimary
                              }`}>
                                {lgOf(tx) === 'travel' ? `-${fmtCur(tx.amount, tx.cur || 'JPY')}` : `${isInc ? '+' : '-'}$${Number(tx.amount).toLocaleString()}`}
                              </span>

                              <div className="flex items-center space-x-0.5">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingId(tx.id);
                                    setTxLedger(lgOf(tx)); if (tx.cur) setTxCur(tx.cur);
                                    setActiveCategory(cat);
                                    setAmountStr(String(tx.amount));
                                    setTxDate(tx.date);
                                    setTxNote(tx.note);
                                  }}
                                  aria-label="編輯此筆紀錄"
                                  className={`p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 ${themeConfig.textSecondary}`}
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (!window.confirm(`刪除這筆「${tx.note} ${lgOf(tx) === 'travel' ? fmtCur(tx.amount, tx.cur || 'JPY') : '$' + tx.amount}」？`)) return;
                                    setTransactions(prev => prev.filter(item => item.id !== tx.id));
                                  }}
                                  aria-label="刪除此筆紀錄"
                                  className={`p-1.5 rounded-full hover:bg-rose-500/10 hover:text-rose-500 ${themeConfig.textSecondary}`}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ------------------------------------------
              分頁 3：肚子消化圖 (今天吃進了什麼能量 + 史萊姆轉向拍肚子 + 左右滑動折線圖)
          ------------------------------------------ */}
          {activeTab === 'insights' && (
            <div className="py-3 space-y-4 pb-6">
              {/* 頂部標題與月份切換器 */}
              <div className="flex items-end justify-between">
                <div>
                  <h2 className={`text-xl font-bold tracking-tight mt-0.5 ${themeConfig.textPrimary}`}>
                    史萊姆肚子消化圖
                  </h2>
                </div>

                {/* 月份切換按鈕列 */}
                <div className={`flex p-0.5 rounded-full border ${themeConfig.pill}`}>
                  {recentMonths.map(m => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setSelectedMonth(m.id);
                        setSelectedSlice(null);
                        const [yy, mm] = m.id.split('-').map(Number);
                        const monthEnd = toDateStr(new Date(yy, mm, 0));
                        setCurveOffset(monthEnd >= todayDate ? 0 : Math.round((new Date(todayDate + 'T00:00:00') - new Date(monthEnd + 'T00:00:00')) / 86400000));
                      }}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wider transition-all ${
                        selectedMonth === m.id ? themeConfig.activePill : themeConfig.textSecondary
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 整月消費總額與收支摘要大卡片 + 打開月底感謝信入口 */}
              <div className={`p-4 rounded-3xl border backdrop-blur-md flex items-center justify-between ${themeConfig.surface}`}>
                <div>
                  <span className={`text-xs font-semibold ${themeConfig.textSecondary}`}>
                    {selectedMonth.replace('-', '年')}月・整月吃進能量 ({analytics.count}筆)
                  </span>
                  <div className={`text-2xl font-extrabold tabular-nums mt-0.5 ${themeConfig.textPrimary}`}>
                    {ledgerView === 'travel' ? fmtCur(analytics.totalExpense, travelCur) : `NT$ ${analytics.totalExpense.toLocaleString()}`}
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1.5">

                </div>
              </div>

              <div className="-mt-1">{ledgerChips(ledgerView, setLedgerView, true, true)}{travelCurChips() && <div className="mt-1.5">{travelCurChips()}</div>}</div>

              {/* 卡片 1：「今天吃進了什麼能量」圓餅圖（點擊區塊時，中央史萊姆會把身體與視線轉向那一塊！） */}
              <div className={`p-5 rounded-3xl border backdrop-blur-md ${themeConfig.surface}`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className={`text-xs font-bold tracking-wider block ${themeConfig.textPrimary}`}>
                      這個月吃進了什麼
                    </span>

                  </div>
                </div>

                {analytics.segments.length === 0 ? (
                  <div className="py-8 flex flex-col items-center justify-center text-center space-y-2">
                    <div className="w-20 h-20 rounded-full border-4 border-dashed border-stone-300 dark:border-slate-600 flex items-center justify-center text-2xl">
                      {currentSpirit.emoji}
                    </div>
                    <p className={`text-xs font-bold ${themeConfig.textPrimary}`}>
                      肚子空空的，還沒有吃進任何能量餅乾唷（$0）
                    </p>
                    <p className={`text-[11px] ${themeConfig.textSecondary}`}>
                      去首頁餵食第一筆消費後，就能看到{currentSpirit.name}抱著能量餅乾的模樣！
                    </p>
                  </div>
                ) : (
                <div className="flex flex-col items-center">
                  {/* 圓潤餅乾環狀圖 + 中央會轉向該區塊的互動史萊姆 */}
                  <div className="relative w-60 h-60 flex items-center justify-center">
                    <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible relative z-10">
                      {analytics.segments.map((seg) => {
                        const isSelected = (selectedSlice?.catId || analytics.segments[0]?.catId) === seg.catId;
                        return (
                          <path
                            key={seg.catId}
                            d={describeDonutArc(100, 100, 76, seg.startAngle, seg.endAngle)}
                            fill="none"
                            stroke={seg.color}
                            strokeWidth={isSelected ? '22' : '14'}
                            strokeLinecap="round"
                            className="cursor-pointer transition-all duration-300"
                            style={{ opacity: isSelected ? 1 : 0.62 }}
                            onClick={() => setSelectedSlice(seg)}
                          />
                        );
                      })}
                    </svg>

                    {/* 圓環中心：和首頁同一隻史萊姆，只有眼睛看向所選區塊 */}
                    {(() => {
                      const activeSeg = selectedSlice || analytics.segments[0];
                      const rad = activeSeg ? ((activeSeg.midAngle - 90) * Math.PI) / 180 : 0;
                      return (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ paddingTop: 6 }}>
                          <ElementalMochiSlime
                            mini
                            miniScale={0.46}
                            look={activeSeg ? { x: Math.round(Math.cos(rad) * 9), y: Math.round(Math.sin(rad) * 7) } : null}
                            spirit={currentSpirit}
                            milestone={currentMilestone}
                            moodState="great"
                            feedingAnim={{ active: false, phase: 'idle' }}
                            celebrating={false}
                            squishKey={0}
                            whisperText=""
                            onTapSlime={() => {}}
                            onSwipeLeft={() => {}}
                            onSwipeRight={() => {}}
                            theme={theme}
                            timePeriod={currentPeriod}
                          />
                        </div>
                      );
                    })()}
                  </div>

                  {/* 史萊姆轉向後的溫柔消化講評 */}
                  {(() => {
                    const activeSeg = selectedSlice || analytics.segments[0];
                    if (!activeSeg) return null;
                    return (
                      <div className={`w-full mt-2 px-3.5 py-2.5 rounded-2xl text-xs text-center border ${themeConfig.pill} ${themeConfig.textSecondary}`}>
                        {currentSpirit.name}看著<strong className={`mx-1 font-bold ${themeConfig.textPrimary}`}>{activeSeg.emoji} {activeSeg.name}</strong>
                        說：「這塊佔了本月能量的 <strong className={themeConfig.textPrimary}>{activeSeg.percent}%</strong> 唷！」
                      </div>
                    );
                  })()}

                  {/* 下方分類小卡 */}
                  <div className="w-full grid grid-cols-2 gap-2 mt-3">
                    {analytics.segments.map((seg) => {
                      const isSelected = (selectedSlice?.catId || analytics.segments[0]?.catId) === seg.catId;
                      return (
                        <button
                          key={seg.catId}
                          onClick={() => setSelectedSlice(seg)}
                          className={`px-3 py-2 rounded-2xl flex items-center justify-between text-xs transition-all border ${
                            isSelected 
                              ? `${themeConfig.pill} shadow-2xs scale-[1.02]` 
                              : 'border-transparent opacity-75 hover:opacity-100'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
                            <span className={`font-semibold ${themeConfig.textPrimary}`}>{seg.shortName}</span>
                          </div>
                          <span className={`font-bold tabular-nums ${themeConfig.textSecondary}`}>
                            {money(seg.amount)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                )}
              </div>

              {/* 卡片 2：可左右滑動的「飽足感曲線」（原生滑動，圓滑曲線） */}
              <div className={`p-5 rounded-3xl border backdrop-blur-md select-none ${themeConfig.surface}`}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className={`text-xs font-bold tracking-wider block ${themeConfig.textPrimary}`}>
                      史萊姆飽足感曲線
                    </span>
                    <span className={`text-[11px] font-medium ${themeConfig.textSecondary}`}>
                      用手指左右滑動，看不同日子的起伏
                    </span>
                  </div>
                </div>
                <SmoothCurve
                  days={analytics.allDays}
                  offset={curveOffset}
                  onOffset={setCurveOffset}
                  limit={ledgerView === 'family' ? (familyCap ? Math.round(familyCap / (capInfo ? capInfo.dim : 30)) : 1e9) : (ledgerView === 'company' || ledgerView === 'all' || ledgerView === 'travel') ? 1e9 : (capInfo ? capInfo.avg : dailyComfortLimit)}
                  color={currentSpirit.primary}
                  sym={ledgerView === 'travel' ? (symOf(travelCur) || travelCur) : '$'}
                  soft={currentSpirit.secondary}
                  dark={theme === 'dark'}
                />

                {(ledgerView === 'personal' || ledgerView === 'all') && (<>
                {/* 每月生活費上限（收合；點開才看細節） */}
                <div className="mt-2 pt-3 border-t border-stone-200/60 dark:border-slate-700/60">
                  <button type="button" onClick={() => setCapOpen(o => !o)} className="w-full flex items-center justify-between text-left">
                    <span className={`text-xs font-bold ${themeConfig.textPrimary}`}>每月生活費上限{ledgerView === 'all' && <span className={`font-medium ${themeConfig.textSecondary}`}>（個人）</span>}</span>
                    <span className="flex items-center gap-1.5 text-[11px] font-bold tabular-nums" style={{ color: capInfo ? (capInfo.ratio > 1 ? '#E11D48' : capInfo.ratio >= 0.9 ? '#EA580C' : capInfo.ratio >= 0.7 ? '#D97706' : currentSpirit.primary) : undefined }}>
                      {capInfo ? `${Math.round(capInfo.ratio * 100)}%・剩 ${Math.max(0, capInfo.remain).toLocaleString()}` : <span className={themeConfig.textSecondary}>尚未設定</span>}
                      <ChevronDown className="w-4 h-4 transition-transform" style={{ transform: capOpen ? 'rotate(180deg)' : 'none', opacity: .6 }} />
                    </span>
                  </button>
                  {!capOpen && capInfo && (
                    <div className="mt-1.5 h-1.5 rounded-full bg-stone-200/70 dark:bg-slate-700 overflow-hidden"><div className="h-full rounded-full" style={{ width: `${Math.min(100, capInfo.ratio * 100)}%`, backgroundColor: capInfo.ratio > 1 ? '#FB7185' : capInfo.ratio >= 0.9 ? '#FB923C' : capInfo.ratio >= 0.7 ? '#FBBF24' : currentSpirit.secondary }} /></div>
                  )}
                  {capOpen && (<>
                  <div className="mt-2 flex justify-end">
                    {!capEditing && (
                      <button type="button" onClick={() => { setCapDraft(monthlyCap ? String(monthlyCap) : ''); setCapEditing(true); }} className="px-3 py-1 rounded-xl text-[11px] font-bold text-white" style={{ backgroundColor: currentSpirit.primary }}>
                        {monthlyCap ? '修改' : '設定'}
                      </button>
                    )}
                  </div>
                  {capEditing ? (
                    <div className="mt-2 flex items-center space-x-2">
                      <span className={`text-sm font-bold ${themeConfig.textSecondary}`}>NT$</span>
                      <input type="number" inputMode="numeric" value={capDraft} onChange={(e) => setCapDraft(e.target.value.replace(/[^0-9]/g, '').slice(0, 7))} placeholder="例如 18000" className="flex-1 min-w-0 px-3 py-2 rounded-xl border border-stone-200 dark:border-slate-600 bg-white/80 dark:bg-slate-800 text-base font-bold outline-none" style={{ userSelect: 'text', WebkitUserSelect: 'text' }} />
                      <button type="button" onClick={() => { const v = Number(capDraft) || 0; const nv = v >= 1000 ? v : 0; setMonthlyCap(nv); if (nv) setPockets(prev => { let left = nv; return prev.map(p => { const a = Math.max(0, Math.min(p.amount, left)); left -= a; return { ...p, amount: a }; }).filter(p => p.amount >= 50); }); setCapEditing(false); }} className="px-3 py-2 rounded-xl text-xs font-bold text-white" style={{ backgroundColor: currentSpirit.primary }}>儲存</button>
                      <button type="button" onClick={() => setCapEditing(false)} className={`px-2 py-2 text-xs font-semibold ${themeConfig.textSecondary}`}>取消</button>
                    </div>
                  ) : capInfo ? (
                    <div className="mt-2">
                      <div className="flex items-baseline justify-between">
                        <span className={`text-[11px] font-semibold ${themeConfig.textSecondary}`}>本月已用 NT$ {summary.monthExp.toLocaleString()} / {monthlyCap.toLocaleString()}</span>
                        <span className="text-sm font-extrabold" style={{ color: capInfo.ratio > 1 ? '#E11D48' : capInfo.ratio >= 0.9 ? '#EA580C' : capInfo.ratio >= 0.7 ? '#D97706' : currentSpirit.primary }}>{Math.round(capInfo.ratio * 100)}%</span>
                      </div>
                      <div className="relative mt-1.5 h-3 rounded-full bg-stone-200/70 dark:bg-slate-700 overflow-hidden">
                        <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-700" style={{ width: `${Math.min(100, capInfo.ratio * 100)}%`, backgroundColor: capInfo.ratio > 1 ? '#FB7185' : capInfo.ratio >= 0.9 ? '#FB923C' : capInfo.ratio >= 0.7 ? '#FBBF24' : currentSpirit.secondary }} />
                        <div className="absolute inset-y-0 w-0.5 bg-white/90" style={{ left: '70%' }} />
                        <div className="absolute inset-y-0 w-0.5 bg-white/90" style={{ left: '90%' }} />
                      </div>
                      <div className={`mt-1.5 flex justify-between text-[11px] font-semibold ${themeConfig.textSecondary}`}>
                        <span>{capInfo.remain >= 0 ? `剩 NT$ ${capInfo.remain.toLocaleString()}・還有 ${capInfo.left} 天` : `超過 NT$ ${(-capInfo.remain).toLocaleString()}`}</span>
                        <span>今天建議 ≤ NT$ {capInfo.daily.toLocaleString()}</span>
                      </div>
                      <div className="mt-2 px-3 py-2 rounded-xl text-[12px] font-bold" style={{ backgroundColor: `${currentSpirit.secondary}33`, color: theme === 'dark' ? currentSpirit.darkAccentText : currentSpirit.accentText }}>
                        每日平均線 NT$ {capInfo.avg.toLocaleString()}（{monthlyCap.toLocaleString()} ÷ {capInfo.dim} 天）・上方曲線的虛線
                      </div>
                    </div>
                  ) : (
                    <p className={`mt-1.5 text-[11px] font-medium ${themeConfig.textSecondary}`}>尚未設定。設定後每天的舒適額度會自動計算，到 70%、90%、超過時會提醒你；目前以每天 NT$ {dailyComfortLimit} 計。</p>
                  )}
                  </>)}
                </div>

                {/* 小口袋：每個口袋 = 一個項目的月預算（選填，最多 5 個；沒設的歸自由額度） */}
                {capInfo && (() => {
                  const sum = pockets.reduce((t, p) => t + p.amount, 0);
                  const free = monthlyCap - sum;
                  const dk = theme === 'dark';
                  return (
                    <div className="mt-3 pt-3 border-t border-stone-200/60 dark:border-slate-700/60">
                      <button type="button" onClick={() => setPocketOpen(o => !o)} className="w-full flex items-center justify-between text-left">
                        <span className={`text-xs font-bold ${themeConfig.textPrimary}`}>小口袋 <span className={`font-medium ${themeConfig.textSecondary}`}>（選填）</span></span>
                        <span className={`flex items-center gap-1.5 text-[11px] font-bold ${themeConfig.textSecondary}`}>
                          {pockets.length ? `${pockets.length} 個${pockets.filter(p => (summary.pocketSpent[p.catId] || 0) >= p.amount).length ? `・${pockets.filter(p => (summary.pocketSpent[p.catId] || 0) >= p.amount).length} 個已滿` : ''}` : '未設定'}
                          <ChevronDown className="w-4 h-4 transition-transform" style={{ transform: pocketOpen ? 'rotate(180deg)' : 'none', opacity: .6 }} />
                        </span>
                      </button>
                      {pocketOpen && (<>
                      <div className="mt-2 flex justify-end">
                        {pockets.length < 5 && !pocketEdit && (
                          <button type="button" onClick={() => setPocketEdit({ catId: (categories.find(c => c.type === 'expense' && !c.hidden && !pockets.some(p => p.catId === c.id)) || {}).id, amount: '' })} className="px-3 py-1 rounded-xl text-[11px] font-bold" style={{ background: `${currentSpirit.secondary}55`, color: dk ? currentSpirit.darkAccentText : currentSpirit.accentText }}>＋ 新口袋</button>
                        )}
                      </div>
                      {pockets.length === 0 && !pocketEdit && (
                        <p className={`mt-1.5 text-[11px] font-medium ${themeConfig.textSecondary}`}>想替某個項目留一個專屬額度嗎？例如飲料 $500。沒設的項目都用自由額度。</p>
                      )}
                      <div className="mt-2 grid grid-cols-5 gap-1.5">
                        {pockets.map(p => {
                          const cat = categories.find(c => c.id === p.catId); if (!cat) return null;
                          const sp = summary.pocketSpent[p.catId] || 0; const r = Math.min(1, sp / p.amount); const full = sp >= p.amount;
                          const R = 20, C = 2 * Math.PI * R;
                          return (
                            <button key={p.catId} type="button" onClick={() => setPocketEdit({ catId: p.catId, amount: String(p.amount), editing: true })} className="flex flex-col items-center">
                              <div className="relative w-[52px] h-[52px]">
                                <svg viewBox="0 0 52 52" className="absolute inset-0 -rotate-90">
                                  <circle cx="26" cy="26" r={R} fill="none" stroke={dk ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.07)'} strokeWidth="5" />
                                  <circle cx="26" cy="26" r={R} fill="none" stroke={full ? '#FDBA74' : currentSpirit.secondary} strokeWidth="5" strokeLinecap="round" strokeDasharray={`${C * r} ${C}`} style={{ transition: 'stroke-dasharray .7s ease' }} />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center"><PhotoIcon name={iconKeyOf(cat)} size={28} /></div>
                              </div>
                              <span className={`text-[10px] font-bold mt-0.5 ${themeConfig.textPrimary}`}>{cat.shortName}</span>
                              <span className={`text-[10px] font-semibold tabular-nums ${full ? 'text-orange-500' : themeConfig.textSecondary}`}>{sp}/{p.amount}</span>
                            </button>
                          );
                        })}
                      </div>
                      {pocketEdit && (
                        <div className="mt-2 flex items-center gap-1.5">
                          <select value={pocketEdit.catId || ''} disabled={pocketEdit.editing} onChange={(e) => setPocketEdit({ ...pocketEdit, catId: e.target.value })} className="h-9 px-2 rounded-xl text-[14px] font-bold bg-white/80 dark:bg-slate-800 border border-stone-200 dark:border-slate-600">
                            {categories.filter(c => c.type === 'expense' && !c.hidden && (pocketEdit.editing ? c.id === pocketEdit.catId : !pockets.some(p => p.catId === c.id))).map(c => <option key={c.id} value={c.id}>{c.shortName}</option>)}
                          </select>
                          <input type="number" inputMode="numeric" value={pocketEdit.amount} onChange={(e) => setPocketEdit({ ...pocketEdit, amount: e.target.value.replace(/[^0-9]/g, '').slice(0, 6) })} placeholder="金額" className="flex-1 min-w-0 h-9 px-3 rounded-xl text-[16px] font-bold bg-white/80 dark:bg-slate-800 border border-stone-200 dark:border-slate-600 outline-none" style={{ userSelect: 'text', WebkitUserSelect: 'text' }} />
                          <button type="button" onClick={() => {
                            const v = Number(pocketEdit.amount) || 0; const others = pockets.filter(p => p.catId !== pocketEdit.catId).reduce((t, p) => t + p.amount, 0);
                            if (!pocketEdit.catId || v < 50) { setPocketEdit(null); return; }
                            const amt = Math.min(v, Math.max(50, monthlyCap - others));
                            setPockets(prev => [...prev.filter(p => p.catId !== pocketEdit.catId), { catId: pocketEdit.catId, amount: amt }]); setPocketEdit(null);
                          }} className="h-9 px-3 rounded-xl text-xs font-bold text-white" style={{ backgroundColor: currentSpirit.primary }}>儲存</button>
                          {pocketEdit.editing && <button type="button" onClick={() => { setPockets(prev => prev.filter(p => p.catId !== pocketEdit.catId)); setPocketEdit(null); }} className="h-9 px-2 text-xs font-semibold text-rose-400">刪除</button>}
                          <button type="button" onClick={() => setPocketEdit(null)} className={`h-9 px-1 text-xs font-semibold ${themeConfig.textSecondary}`}>取消</button>
                        </div>
                      )}
                      <div className="mt-2 px-3 py-2 rounded-xl text-[12px] font-bold" style={{ backgroundColor: `${currentSpirit.secondary}22`, color: dk ? currentSpirit.darkAccentText : currentSpirit.accentText }}>
                        自由額度 NT$ {Math.max(0, free).toLocaleString()}（{monthlyCap.toLocaleString()} − 口袋 {sum.toLocaleString()}）
                      </div>
                      </>)}
                    </div>
                  );
                })()}
                </>)}

                {/* 家庭：獨立的月上限（只看、不影響角色） */}
                {ledgerView === 'family' && (
                  <div className="mt-2 pt-3 border-t border-stone-200/60 dark:border-slate-700/60">
                    <button type="button" onClick={() => setCapOpen(o => !o)} className="w-full flex items-center justify-between text-left">
                      <span className={`text-xs font-bold ${themeConfig.textPrimary}`}>家庭每月上限</span>
                      <span className="flex items-center gap-1.5 text-[11px] font-bold tabular-nums" style={{ color: '#D97706' }}>
                        {familyCap ? `${Math.round(selMonthLedger.family / familyCap * 100)}%・${selMonthLedger.family.toLocaleString()}` : <span className={themeConfig.textSecondary}>已用 {selMonthLedger.family.toLocaleString()}</span>}
                        <ChevronDown className="w-4 h-4 transition-transform" style={{ transform: capOpen ? 'rotate(180deg)' : 'none', opacity: .6 }} />
                      </span>
                    </button>
                    {capOpen && (<>
                    <div className="mt-2 flex justify-end">{!capEditing && (<button type="button" onClick={() => { setCapDraft(familyCap ? String(familyCap) : ''); setCapEditing(true); }} className="px-3 py-1 rounded-xl text-[11px] font-bold text-white" style={{ backgroundColor: '#D97706' }}>{familyCap ? '修改' : '設定'}</button>)}</div>
                    {capEditing ? (
                      <div className="mt-2 flex items-center space-x-2">
                        <span className={`text-sm font-bold ${themeConfig.textSecondary}`}>NT$</span>
                        <input type="number" inputMode="numeric" value={capDraft} onChange={(e) => setCapDraft(e.target.value.replace(/[^0-9]/g, '').slice(0, 7))} placeholder="例如 20000" className="flex-1 min-w-0 px-3 py-2 rounded-xl border border-stone-200 dark:border-slate-600 bg-white/80 dark:bg-slate-800 text-base font-bold outline-none" style={{ userSelect: 'text', WebkitUserSelect: 'text' }} />
                        <button type="button" onClick={() => { const v = Number(capDraft) || 0; setFamilyCap(v >= 1000 ? v : 0); setCapEditing(false); }} className="px-3 py-2 rounded-xl text-xs font-bold text-white" style={{ backgroundColor: '#D97706' }}>儲存</button>
                        <button type="button" onClick={() => setCapEditing(false)} className={`px-2 py-2 text-xs font-semibold ${themeConfig.textSecondary}`}>取消</button>
                      </div>
                    ) : familyCap ? (() => {
                      const r = selMonthLedger.family / familyCap;
                      return (<div className="mt-2">
                        <div className="flex items-baseline justify-between"><span className={`text-[11px] font-semibold ${themeConfig.textSecondary}`}>{selectedMonth === currentMonth ? '本月' : selectedMonth.slice(5) + ' 月'}家庭已用 NT$ {selMonthLedger.family.toLocaleString()} / {familyCap.toLocaleString()}</span><span className="text-sm font-extrabold" style={{ color: r > 1 ? '#E11D48' : '#D97706' }}>{Math.round(r * 100)}%</span></div>
                        <div className="mt-1.5 h-3 rounded-full bg-stone-200/70 dark:bg-slate-700 overflow-hidden"><div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(100, r * 100)}%`, backgroundColor: r > 1 ? '#FB7185' : '#FCD34D' }} /></div>
                        <div className="mt-2 px-3 py-2 rounded-xl text-[12px] font-bold" style={{ backgroundColor: LEDGER_TONE.family.bg, color: LEDGER_TONE.family.fg }}>{r > 1 ? `家庭本月超過 NT$ ${(selMonthLedger.family - familyCap).toLocaleString()}` : `家庭還剩 NT$ ${(familyCap - selMonthLedger.family).toLocaleString()}`}・每日平均線 NT$ {Math.round(familyCap / (capInfo ? capInfo.dim : 30)).toLocaleString()}</div>
                      </div>);
                    })() : (<p className={`mt-1.5 text-[11px] font-medium ${themeConfig.textSecondary}`}>家庭帳是獨立的，不會影響角色的心情與每日額度。</p>)}
                    </>)}
                  </div>
                )}
                {ledgerView === 'company' && (
                  <div className="mt-2 pt-3 border-t border-stone-200/60 dark:border-slate-700/60">
                    <button type="button" onClick={() => setCapOpen(o => !o)} className="w-full flex items-center justify-between text-left">
                      <span className={`text-xs font-bold ${themeConfig.textPrimary}`}>{selectedMonth === currentMonth ? '本月' : selectedMonth.slice(5) + ' 月'}公司代墊</span>
                      <span className="flex items-center gap-1.5 text-[11px] font-bold tabular-nums" style={{ color: LEDGER_TONE.company.fg }}>
                        NT$ {selMonthLedger.company.toLocaleString()}・{selMonthLedger.companyCount} 筆
                        <ChevronDown className="w-4 h-4 transition-transform" style={{ transform: capOpen ? 'rotate(180deg)' : 'none', opacity: .6 }} />
                      </span>
                    </button>
                    {capOpen && (
                      <div className="mt-2 px-3 py-3 rounded-2xl" style={{ background: LEDGER_TONE.company.bg, color: LEDGER_TONE.company.fg }}>
                        <div className="text-2xl font-black tabular-nums">NT$ {selMonthLedger.company.toLocaleString()}</div>
                        <div className="text-[11px] font-semibold mt-0.5">{selMonthLedger.companyCount} 筆・每個月各自統計，不算生活費，也不計入上限</div>
                      </div>
                    )}
                  </div>
                )}

                {ledgerView === 'travel' && (() => {
                  const per = {}; let cnt = 0;
                  transactions.forEach(t => { if (lgOf(t) === 'travel' && t.type === 'expense' && t.date.startsWith(selectedMonth)) { const c = t.cur || 'JPY'; per[c] = (per[c] || 0) + Number(t.amount); cnt += 1; } });
                  const keys = Object.keys(per);
                  return (
                    <div className="mt-2 pt-3 border-t border-stone-200/60 dark:border-slate-700/60">
                      <button type="button" onClick={() => setCapOpen(o => !o)} className="w-full flex items-center justify-between text-left">
                        <span className={`text-xs font-bold ${themeConfig.textPrimary}`}>{selectedMonth === currentMonth ? '本月' : selectedMonth.slice(5) + ' 月'}旅遊</span>
                        <span className="flex items-center gap-1.5 text-[11px] font-bold tabular-nums" style={{ color: LEDGER_TONE.travel.fg }}>
                          {cnt} 筆・{keys.length} 種幣別
                          <ChevronDown className="w-4 h-4 transition-transform" style={{ transform: capOpen ? 'rotate(180deg)' : 'none', opacity: .6 }} />
                        </span>
                      </button>
                      {capOpen && (
                        <div className="mt-2 px-3 py-3 rounded-2xl space-y-1" style={{ background: LEDGER_TONE.travel.bg, color: LEDGER_TONE.travel.fg }}>
                          {keys.length === 0 ? <div className="text-[12px] font-bold">這個月還沒有旅遊紀錄</div> : keys.map(c => (<div key={c} className="flex items-baseline justify-between"><span className="text-[12px] font-bold">{c}</span><span className="text-lg font-black tabular-nums">{fmtCur(per[c], c)}</span></div>))}
                          <div className="text-[11px] font-semibold pt-1">只記原幣金額，不換算匯率，也不計入上限</div>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {PREVIEW && isDemo && (
                  <div className={`mt-3 p-3 rounded-2xl border ${themeConfig.pill}`}>
                    <p className={`text-[11px] font-semibold ${themeConfig.textSecondary}`}>目前是一個月的示範資料，正式使用前請清除。</p>
                    <button type="button" onClick={clearDemoData} className="mt-2 px-3 py-1.5 rounded-xl text-[11px] font-bold text-white" style={{ backgroundColor: currentSpirit.primary }}>清除示範資料，開始使用</button>
                  </div>
                )}
                {PREVIEW && <div className="mt-3 flex items-center space-x-3">
                  <button type="button" onClick={() => { setActiveTab('feed'); setTimeout(() => setShowMoodAsk(true), 300); }} className={`text-[11px] font-semibold hover:underline ${themeConfig.textSecondary}`}>預覽晚上心情詢問</button>
                  <button type="button" onClick={() => { setActiveTab('feed'); setTimeout(() => showTemporaryWhisper(pickOne(P_.rare), null, 3500, P_.faces.rare, true), 300); }} className={`text-[11px] font-semibold hover:underline ${themeConfig.textSecondary}`}>預覽稀有台詞</button>
                </div>}
                {/* 備份 / 還原 / 清空 */}
                <div className="mt-3 pt-2 border-t border-stone-200/40 dark:border-slate-700/40 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button type="button" onClick={handleExportBackup} className={`text-[11px] font-semibold hover:underline ${themeConfig.textSecondary}`}>
                      匯出備份
                    </button>
                    <label className={`text-[11px] font-semibold hover:underline cursor-pointer ${themeConfig.textSecondary}`}>
                      匯入還原
                      <input type="file" accept="application/json,.json" className="hidden" onChange={handleImportBackup} />
                    </label>
                  </div>
                {transactions.length > 0 && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleClearAllRecords}
                      className="text-[11px] font-semibold text-rose-500 hover:underline flex items-center space-x-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>清空所有帳目歸零 ($0)</span>
                    </button>
                  </div>
                )}
                </div>
              </div>
            </div>
          )}
        </main>

        {/* ==========================================
            底部三大分頁導覽列 (深色模式下高對比清晰文字)
        ========================================== */}
        <nav className={`px-6 py-2.5 border-t backdrop-blur-xl flex items-center justify-around z-20 shrink-0 ${themeConfig.surface}`}>
          {[
            { id: 'feed', label: '餵食記帳', icon: Compass },
            { id: 'journal', label: '生活手帳', icon: BookOpen },
            { id: 'insights', label: '肚子消化圖', icon: PieChart }
          ].map(tab => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center space-y-1 px-4 py-1 rounded-2xl transition-all ${
                  isActive ? 'scale-105' : 'opacity-80 hover:opacity-100'
                }`}
              >
                <TabIcon 
                  className={`w-5 h-5 stroke-[2.2] ${!isActive ? themeConfig.textSecondary : ''}`} 
                  style={{ color: isActive ? (theme === 'dark' ? currentSpirit.darkAccentText : currentSpirit.primary) : undefined }} 
                />
                <span 
                  className={`text-[11px] font-bold tracking-wider ${isActive ? '' : themeConfig.textSecondary}`}
                  style={{ color: isActive ? (theme === 'dark' ? currentSpirit.darkAccentText : currentSpirit.primary) : undefined }}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* ==========================================
            彈窗 1：金額輸入與「一鍵常用記憶」餵食抽屜
        ========================================== */}
        {activeCategory && (() => {
          const dark = theme === 'dark';
          const accent = dark ? currentSpirit.darkAccentText : currentSpirit.accentText;
          const keyBg = dark ? 'rgba(255,255,255,0.07)' : `${currentSpirit.secondary}26`;
          const rounded = { fontFamily: 'ui-rounded, "SF Pro Rounded", "PingFang TC", "Noto Sans TC", sans-serif' };
          const pressKey = (k) => {
            setKeyTick(t => t + 1);
            if (k === '00') { if (amountStr.length > 0 && amountStr.length <= (txLedger === 'travel' ? 5 : 4)) setAmountStr(prev => prev + '00'); }
            else handleKeypad(k);
          };
          return (
          <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex flex-col justify-end" style={{ paddingBottom: kbOffset }}
            onClick={() => { setActiveCategory(null); setEditingId(null); }}>
            <div
              onClick={(e) => e.stopPropagation()}
              className={`w-full rounded-t-[36px] px-5 pt-3 pb-5 shadow-2xl animate-whisper-float ${dark ? 'text-slate-100' : 'text-stone-800'}`}
              style={{ ...rounded, background: dark ? 'linear-gradient(180deg,#1C2245,#141833)' : `linear-gradient(180deg, ${currentSpirit.secondary}1F, #FFFCF7 38%)`, paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)' }}
            >
              <div className="w-10 h-1.5 rounded-full mx-auto mb-2" style={{ background: dark ? 'rgba(255,255,255,.18)' : 'rgba(0,0,0,.10)' }} />
              {/* 頂部：小史萊姆（每按一下會點頭）＋項目名稱 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div key={keyTick} className={keyTick ? 'animate-nod' : ''} style={{ width: 62, height: 54, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ElementalMochiSlime mini miniScale={0.23} look={{ x: 0, y: 4 }}
                      spirit={currentSpirit} milestone={currentMilestone} moodState="great" feedingAnim={{ active: false, phase: 'idle' }}
                      celebrating={false} squishKey={0} whisperText="" onTapSlime={() => {}} onSwipeLeft={() => {}} onSwipeRight={() => {}}
                      theme={theme} timePeriod={currentPeriod} />
                  </div>
                  <div>
                    <span className="text-[12px] font-bold" style={{ color: dark ? '#94A3B8' : '#8A7B6B' }}>
                      {editingId ? '修改這筆紀錄' : `要餵${currentSpirit.name}多少呢？`}
                    </span>
                    <h3 className="text-[19px] font-extrabold tracking-wide leading-tight">{activeCategory.name}</h3>
                  </div>
                </div>
                <button onClick={() => { setActiveCategory(null); setEditingId(null); }} aria-label="關閉"
                  className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: keyBg }}>
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 金額 */}
              <div className="mt-2 text-center tabular-nums" style={{ color: amountStr ? accent : (dark ? '#64748B' : '#C8BBAA') }}>
                <span className="text-[20px] font-extrabold align-top mr-1">{txLedger === 'travel' && activeCategory.type !== 'income' ? (symOf(txCur) || txCur) : '$'}</span>
                <span className="text-[44px] font-black leading-none">{amountStr ? Number(amountStr).toLocaleString() : '0'}</span>
                {txLedger === 'travel' && activeCategory.type !== 'income' && <span className="text-[13px] font-extrabold ml-1.5 align-baseline opacity-70">{txCur}</span>}
              </div>

              {/* 帳本：預設個人，餵完自動回到個人 */}
              {activeCategory.type !== 'income' && <div className="flex justify-center mt-2">{ledgerChips(txLedger, setTxLedger, false, true)}</div>}
              {txLedger === 'travel' && activeCategory.type !== 'income' && (
                <div className="mt-1.5">
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar justify-start" style={{ scrollbarWidth: 'none' }}>
                    {allCurs.map(c => {
                      const on = txCur === c.code;
                      return (<button key={c.code} type="button" onClick={() => { setTxCur(c.code); setCurAdding(null); }} className="shrink-0 h-7 px-2.5 rounded-full text-[11px] font-bold" style={{ background: on ? LEDGER_TONE.travel.bg : (dark ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.04)'), color: on ? LEDGER_TONE.travel.fg : (dark ? '#94A3B8' : '#8A7F72'), boxShadow: on ? `inset 0 -2px 0 ${LEDGER_TONE.travel.fg}33` : 'none' }}>{c.code} {c.sym}</button>);
                    })}
                    <button type="button" onClick={() => setCurAdding(curAdding ? null : { code: '', sym: '' })} className="shrink-0 h-7 px-2.5 rounded-full text-[11px] font-bold" style={{ background: dark ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.04)', color: dark ? '#94A3B8' : '#8A7F72' }}>其他＋</button>
                  </div>
                  {curAdding && (
                    <div className="mt-1.5 flex items-center gap-1.5 justify-center">
                      <input value={curAdding.code} onChange={(e) => setCurAdding({ ...curAdding, code: e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4) })} placeholder="代碼 THB" className="w-24 h-8 px-2 rounded-xl text-[14px] font-bold bg-white/80 dark:bg-slate-800 border border-stone-200 dark:border-slate-600 outline-none" style={{ userSelect: 'text', WebkitUserSelect: 'text' }} />
                      <input value={curAdding.sym} onChange={(e) => setCurAdding({ ...curAdding, sym: e.target.value.slice(0, 3) })} placeholder="符號 ฿" className="w-20 h-8 px-2 rounded-xl text-[14px] font-bold bg-white/80 dark:bg-slate-800 border border-stone-200 dark:border-slate-600 outline-none" style={{ userSelect: 'text', WebkitUserSelect: 'text' }} />
                      <button type="button" onClick={() => { const code = curAdding.code.trim(); if (code.length < 2) return; if (!allCurs.some(c => c.code === code)) setCustomCurs(prev => [...prev, { code, sym: curAdding.sym.trim() }]); setTxCur(code); setCurAdding(null); }} className="h-8 px-3 rounded-xl text-xs font-bold text-white" style={{ backgroundColor: LEDGER_TONE.travel.fg }}>加入</button>
                    </div>
                  )}
                </div>
              )}

              {/* 日期＋備註 */}
              <div className="flex items-center gap-2 mt-2">
                <label className="relative flex-1 flex items-center justify-center px-3 h-10 rounded-full" style={{ background: keyBg }}>
                  <Calendar className="w-4 h-4 mr-1.5 opacity-60 shrink-0" />
                  <span className="text-[14px] font-bold whitespace-nowrap">
                    {Number(txDate.slice(0, 4))}年{Number(txDate.slice(5, 7))}月{Number(txDate.slice(8, 10))}日（{WEEKDAYS[new Date(txDate + 'T00:00:00').getDay()]}）
                  </span>
                  <input type="date" value={txDate} max={todayDate} onChange={(e) => e.target.value && setTxDate(e.target.value)}
                    className="absolute inset-0 opacity-0 w-full h-full text-[16px]" aria-label="選擇日期" />
                </label>
                <input type="text" placeholder="備註" value={txNote} maxLength={12} onChange={(e) => setTxNote(e.target.value)}
                  className="w-[32%] px-3 h-10 rounded-full text-[16px] font-medium focus:outline-none bg-transparent"
                  style={{ background: keyBg, ...rounded }} />
              </div>

              {/* 果凍數字鍵 */}
              <div className="grid grid-cols-3 gap-2.5 mt-3">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '00', '0', 'BACK'].map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => { if (k !== 'BACK') pressKey(k); }}
                    onPointerDown={k === 'BACK' ? () => { backHeld.current = setTimeout(() => { backHeld.current = 'cleared'; setAmountStr(''); setKeyTick(t => t + 1); }, 550); } : undefined}
                    onPointerUp={k === 'BACK' ? () => { if (backHeld.current !== 'cleared') { clearTimeout(backHeld.current); pressKey('BACK'); } backHeld.current = null; } : undefined}
                    onPointerLeave={k === 'BACK' ? () => { if (backHeld.current && backHeld.current !== 'cleared') clearTimeout(backHeld.current); backHeld.current = null; } : undefined}
                    className="key-jelly h-[52px] rounded-[22px] text-[22px] font-extrabold flex items-center justify-center"
                    style={{ background: keyBg, color: dark ? '#F1F5F9' : accent, boxShadow: dark ? 'none' : `inset 0 -3px 0 ${currentSpirit.secondary}33, 0 2px 6px rgba(120,90,60,.06)`, ...rounded }}
                  >
                    {k === 'BACK' ? '⌫' : k}
                  </button>
                ))}
              </div>
              <p className="text-center text-[10px] mt-1.5" style={{ color: dark ? '#64748B' : '#B3A595' }}>長按 ⌫ 可以一次清空</p>

              {/* 餵食鈕 */}
              <button
                type="button"
                disabled={!amountStr || Number(amountStr) <= 0}
                onClick={() => triggerFeedRecord(amountStr, txNote, activeCategory)}
                className="key-jelly mt-2 w-full h-[54px] rounded-full text-[16px] font-extrabold text-white disabled:opacity-40 flex items-center justify-center space-x-2"
                style={{ background: `linear-gradient(135deg, ${currentSpirit.secondary}, ${currentSpirit.primary})`, boxShadow: `0 8px 20px -6px ${currentSpirit.primary}99`, ...rounded }}
              >
                <PhotoIcon name={iconKeyOf(activeCategory)} size={30} />
                <span>{editingId ? '儲存修改' : `餵${currentSpirit.name}吃 ${txLedger === 'travel' && activeCategory.type !== 'income' ? `${amountStr ? Number(amountStr).toLocaleString() : 0} ${txCur} ${symOf(txCur)}` : `$${amountStr ? Number(amountStr).toLocaleString() : 0}`}`}</span>
              </button>
            </div>
          </div>
          );
        })()}

        {/* ==========================================
            彈窗 2：365天長期陪伴成長與 5 款元素史萊姆圖鑑 (無皇冠、無複雜路線)
        ========================================== */}
        {showGallery && (
          <div className="absolute inset-0 z-50 bg-black/45 backdrop-blur-sm flex items-center justify-center p-4">
            <div 
              className={`w-full max-h-[88%] overflow-y-auto no-scrollbar rounded-[36px] p-5 border shadow-2xl animate-whisper-float ${
                theme === 'dark' ? 'bg-[#161F30] border-slate-700 text-slate-100' : 'bg-[#FDFBF7] border-white text-stone-800'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-stone-200/60 dark:border-slate-700">
                <div>
                  <h2 className="text-lg font-bold tracking-tight">{currentSpirit.name}的小屋・第 {companionDays} 天</h2>
                </div>
                <button
                  onClick={() => setShowGallery(false)}
                  className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 底色 */}
              <div className="mt-3.5">
                <span className={`text-xs font-bold tracking-wide block mb-2 ${themeConfig.textPrimary}`}>🎨 小屋底色：</span>
                <div className="grid grid-cols-3 gap-2">
                  {[{ id: 'beige', label: '米色', bg: '#F5EFE4', fg: '#26201B' }, { id: 'light', label: '淺色', bg: '#F8FAFC', fg: '#0F172A' }, { id: 'dark', label: '深色', bg: '#131B2E', fg: '#F8FAFC' }].map(t => (
                    <button key={t.id} onClick={() => setTheme(t.id)} className="py-2.5 rounded-2xl text-xs font-bold border-2 transition-all"
                      style={{ background: t.bg, color: t.fg, borderColor: theme === t.id ? currentSpirit.primary : 'transparent' }}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 1. 一年長期陪伴里程碑預覽 (Day 1 -> Day 365 + 3天未記帳委屈狀態) */}
              <div className="mt-3.5">
                <span className={`text-xs font-bold tracking-wide block mb-2 ${themeConfig.textPrimary}`}>
                  🌱 一年陪伴成長（依實際陪伴天數自動成長，目前第 {companionDays} 天）：
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {COMPANION_MILESTONES.map((ms, idx) => {
                    const isSelected = milestoneIdx === idx;
                    return (
                      <div
                        key={ms.id}
                        className={`p-2.5 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'border-amber-500 bg-amber-500/10 shadow-2xs'
                            : 'border-stone-200/80 dark:border-slate-700 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <div className="text-xs font-bold flex items-center justify-between">
                          <span>{ms.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                        </div>
                        <p className={`text-[10px] mt-1 leading-snug ${themeConfig.textSecondary}`}>
                          {ms.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 月份印章：有記帳的月份會蓋上 */}
              <div className="mt-4 pt-3 border-t border-stone-200/60 dark:border-slate-700/60">
                <span className={`text-xs font-bold tracking-wide block mb-2 ${themeConfig.textPrimary}`}>📮 月份印章（有記帳的月份會蓋上）：</span>
                <div className="grid grid-cols-6 gap-2">
                  {(() => {
                    const list = []; let [yy, mm] = startDate.slice(0, 7).split('-').map(Number);
                    while (`${yy}-${pad2(mm)}` <= currentMonth && list.length < 60) { list.push(`${yy}-${pad2(mm)}`); mm += 1; if (mm > 12) { mm = 1; yy += 1; } }
                    const got = new Set(transactions.map(t => t.date.slice(0, 7)));
                    return list.slice(-12).map(ym => {
                      const on = got.has(ym);
                      return (
                        <div key={ym} className="aspect-square rounded-full flex flex-col items-center justify-center"
                          style={on ? { background: `radial-gradient(circle at 35% 30%, #FFF, ${currentSpirit.secondary}, ${currentSpirit.primary})`, transform: 'rotate(-8deg)', boxShadow: `0 0 0 2px ${currentSpirit.primary}` } : { border: '1.5px dashed rgba(150,140,125,.6)' }}>
                          <span className="text-sm font-extrabold" style={{ color: on ? '#fff' : undefined }}>{Number(ym.slice(5))}</span>
                          <span className="text-[8px] font-bold" style={{ color: on ? '#fff' : undefined }}>月</span>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* 2. 精選 5 款元素麻糬史萊姆角色 */}
              <div className="space-y-2.5 mt-4 pt-3 border-t border-stone-200/60 dark:border-slate-700/60">
                <span className={`text-xs font-bold tracking-wide block ${themeConfig.textPrimary}`}>
                  ✨ 選擇陪伴你的元素史萊姆（共 5 款）：
                </span>
                {SPIRITS.map((sp, idx) => {
                  const selected = spiritIdx === idx;
                  return (
                    <div
                      key={sp.id}
                      onClick={() => {
                        setSpiritIdx(idx);
                        setShowGallery(false);
                      }}
                      className={`p-3 rounded-3xl border cursor-pointer transition-all ${
                        selected
                          ? 'border-stone-800 dark:border-slate-300 bg-black/[0.04] dark:bg-white/[0.06]'
                          : 'border-stone-200/70 dark:border-slate-700/70 opacity-85 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-10 h-10 rounded-2xl shadow-inner flex items-center justify-center shrink-0"
                            style={{ background: `radial-gradient(circle at 30% 30%, #FFF, ${sp.secondary}, ${sp.primary})` }}
                          >
                            <span className="text-base">{sp.emoji}</span>
                          </div>
                          <div>
                            <h3 className="text-sm font-bold tracking-wide">
                              {sp.name} <span className="text-xs font-normal opacity-70">({sp.elementTag})</span>
                            </h3>
                            <p className={`text-[11px] mt-0.5 leading-snug ${themeConfig.textSecondary}`}>{sp.tagline}</p>
                          </div>
                        </div>
                        <span className={`text-[11px] font-bold px-3 py-1 rounded-full shrink-0 ml-2 ${
                          selected ? themeConfig.activePill : 'bg-black/5 dark:bg-white/10'
                        }`}>
                          {selected ? '陪伴中' : '切換'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            彈窗 3：新增自訂分類項目 (清楚好操作的三步驟)
        ========================================== */}
        {showWelcome && (() => {
          const dk = theme === 'dark';
          const tabs = [
            ['餵食記帳', '首頁。點轉盤上的項目、輸入金額，就是餵史萊姆＝記一筆。右上角的條碼小圓鈕可放手機條碼載具，轉盤最後的「修改」能改名、換圖示、隱藏與排序項目。'],
            ['生活手帳', '每一筆紀錄都在這裡，可修改、刪除，也能切換個人、家庭、公司代墊、旅遊帳本。'],
            ['肚子消化圖', '看花費去哪了；在這裡設定個人每月支出上限與小口袋。'],
          ];
          return (
            <div className="absolute inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className={`w-full max-h-full overflow-y-auto rounded-[32px] p-5 border shadow-2xl animate-whisper-float ${dk ? 'bg-[#161F30] border-slate-700 text-slate-100' : 'bg-[#FDFBF7] border-white text-stone-800'}`}>
                <h3 className="text-lg font-bold text-center">歡迎來到史萊姆記帳</h3>
                <p className={`text-[12px] text-center mt-1 ${dk ? 'text-slate-400' : 'text-stone-500'}`}>一起把每天的花費，餵給可愛的史萊姆。資料只存在你的手機裡。</p>
                <div className="mt-3 text-[12px] font-bold opacity-70">五位夥伴（左右滑動史萊姆就能換）</div>
                <div className="mt-1.5 space-y-1.5">
                  {SPIRITS.map(sp => (
                    <div key={sp.id} className={`flex items-start gap-2 rounded-2xl px-3 py-2 ${dk ? 'bg-slate-800/60' : 'bg-white/80'}`}>
                      <span className="text-lg leading-6">{sp.emoji}</span>
                      <div className="min-w-0">
                        <div className="text-[13px] font-bold" style={{ color: dk ? sp.darkAccentText : sp.accentText }}>{sp.name}<span className="ml-1.5 text-[11px] font-semibold opacity-75">{sp.elementTag}</span></div>
                        <div className={`text-[11.5px] leading-snug ${dk ? 'text-slate-400' : 'text-stone-500'}`}>{sp.tagline}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-[12px] font-bold opacity-70">底部三個分頁</div>
                <div className="mt-1.5 space-y-1.5">
                  {tabs.map(([t, d]) => (
                    <div key={t} className={`rounded-2xl px-3 py-2 ${dk ? 'bg-slate-800/60' : 'bg-white/80'}`}>
                      <div className="text-[13px] font-bold">{t}</div>
                      <div className={`text-[11.5px] leading-snug ${dk ? 'text-slate-400' : 'text-stone-500'}`}>{d}</div>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={closeWelcome} className="mt-4 w-full py-3 rounded-2xl text-white text-sm font-bold" style={{ background: currentSpirit.primary }}>開始記帳</button>
              </div>
            </div>
          );
        })()}
        {showCarrier && (() => {
          const { rects, width } = code39Rects(carrier || '/AAAAAAA');
          const dk = theme === 'dark';
          const save = () => {
            const a = carrierDraft.trim(), b = carrierDraft2.trim();
            if (!CARRIER_RE.test(a)) { setCarrierErr('格式不對：要以 / 開頭，共 8 碼（數字、大寫英文、. + -）'); return; }
            if (a !== b) { setCarrierErr('兩次輸入不一樣，請再確認一次。'); return; }
            setCarrier(a); setCarrierEdit(false); setCarrierErr('');
          };
          return (
            <div className="absolute inset-0 z-50 bg-black/45 backdrop-blur-sm flex items-center justify-center p-5" onClick={() => setShowCarrier(false)} style={{ paddingBottom: 20 + kbOffset }}>
              <div onClick={(e) => e.stopPropagation()} className={`w-full rounded-[36px] p-5 border shadow-2xl animate-whisper-float ${dk ? 'bg-[#161F30] border-slate-700 text-slate-100' : 'bg-[#FDFBF7] border-white text-stone-800'}`}>
                <div className="flex items-center justify-between pb-3 border-b border-stone-200/60 dark:border-slate-700">
                  <h3 className="text-base font-bold tracking-wide">手機條碼載具</h3>
                  <button type="button" onClick={() => setShowCarrier(false)}><X className="w-4 h-4 opacity-60" /></button>
                </div>
                {carrier && !carrierEdit ? (
                  <>
                    <div className="mt-4 rounded-2xl bg-white p-3" style={{ boxShadow: 'inset 0 0 0 1px #E7E5E4' }}>
                      <svg viewBox={`-10 0 ${width + 20} 60`} className="block mx-auto" style={(() => { const m = 5 / Math.max(1, Math.round(window.devicePixelRatio || 3)); return { width: (width + 20) * m, height: Math.round(width * m * 0.276), maxWidth: '100%' }; })()} preserveAspectRatio="none" shapeRendering="crispEdges">
                        <rect x="-10" y="0" width={width + 20} height="60" fill="#fff" />
                        {rects.map(([x, w], i) => <rect key={i} x={x} y="0" width={w} height="60" fill="#000" />)}
                      </svg>
                      <div className="text-center text-[22px] font-normal text-stone-700 mt-1.5 tabular-nums" style={{ fontFamily: '-apple-system, "Helvetica Neue", Arial, sans-serif' }}>{carrier}</div>
                    </div>
                    <p className={`mt-2 text-[11px] font-medium ${themeConfig.textSecondary}`}>結帳時請把螢幕亮度調高，條碼才好掃。</p>
                    <div className="mt-3 flex items-center justify-between">
                      <button type="button" onClick={() => { setCarrierEdit(true); setCarrierDraft(carrier); setCarrierDraft2(''); setCarrierErr(''); }} className="h-9 px-4 rounded-xl text-xs font-bold text-white" style={{ backgroundColor: currentSpirit.primary }}>修改條碼</button>
                      <button type="button" onClick={() => { if (window.confirm('清除這支手機裡的載具條碼？')) { setCarrier(''); setCarrierEdit(true); } }} className="text-xs font-semibold text-rose-400">清除</button>
                    </div>
                  </>
                ) : (
                  <div className="mt-3 space-y-2.5">
                    <div>
                      <label className={`text-xs font-semibold block mb-1 ${themeConfig.textSecondary}`}>你的手機條碼（/ 開頭，共 8 碼）</label>
                      <input value={carrierDraft} onChange={(e) => setCarrierDraft(e.target.value.toUpperCase().replace(/[^0-9A-Z./+\-]/g, '').slice(0, 8))} placeholder="/ABC1234" className="w-full h-11 px-4 rounded-2xl bg-stone-100 dark:bg-slate-800 text-[18px] font-bold tracking-widest outline-none" style={{ userSelect: 'text', WebkitUserSelect: 'text' }} />
                    </div>
                    <div>
                      <label className={`text-xs font-semibold block mb-1 ${themeConfig.textSecondary}`}>再輸入一次確認</label>
                      <input value={carrierDraft2} onChange={(e) => setCarrierDraft2(e.target.value.toUpperCase().replace(/[^0-9A-Z./+\-]/g, '').slice(0, 8))} placeholder="/ABC1234" className="w-full h-11 px-4 rounded-2xl bg-stone-100 dark:bg-slate-800 text-[18px] font-bold tracking-widest outline-none" style={{ userSelect: 'text', WebkitUserSelect: 'text' }} />
                    </div>
                    {carrierErr && <p className="text-[12px] font-bold text-orange-500">{carrierErr}</p>}
                    <p className={`text-[11px] font-medium leading-relaxed ${themeConfig.textSecondary}`}>請對照財政部 App 上你的條碼，一個字一個字輸入。這裡無法確認它是不是你的，輸錯就會把發票歸到別人名下。條碼只存在這支手機，不會放進備份檔。</p>
                    <div className="flex items-center justify-between">
                      <button type="button" onClick={save} className="h-9 px-5 rounded-xl text-xs font-bold text-white" style={{ backgroundColor: currentSpirit.primary }}>儲存</button>
                      {carrier && <button type="button" onClick={() => setCarrierEdit(false)} className={`text-xs font-semibold ${themeConfig.textSecondary}`}>取消</button>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {showEditCat && (
          <div className="absolute inset-0 z-50 bg-black/45 backdrop-blur-sm flex items-center justify-center p-5" style={{ paddingBottom: 20 + kbOffset }}>
            <div className={`w-full max-h-[82vh] flex flex-col rounded-[36px] p-5 border shadow-2xl animate-whisper-float ${theme === 'dark' ? 'bg-[#161F30] border-slate-700 text-slate-100' : 'bg-[#FDFBF7] border-white text-stone-800'}`}>
              <div className="flex items-center justify-between pb-3 border-b border-stone-200/60 dark:border-slate-700">
                <h3 className="text-base font-bold tracking-wide">修改項目</h3>
                <button type="button" onClick={() => { setShowEditCat(false); setRenameId(null); setIconPickId(null); setEditMsg(''); }}><X className="w-4 h-4 opacity-60" /></button>
              </div>
              <p className={`mt-2 text-[11px] font-medium ${themeConfig.textSecondary}`}>可以換圖示、改名或隱藏；按住項目上下拖曳可調整順序。隱藏只是從轉盤收起來，紀錄都會保留。</p>
              {editMsg && <p className="mt-1.5 text-[12px] font-bold text-orange-500">{editMsg}</p>}
              <div ref={editListRef} className="mt-2 overflow-y-auto no-scrollbar space-y-1.5 pr-0.5" style={{ touchAction: dragId ? 'none' : 'pan-y' }}>
                {[false, true].map(hid => {
                  const list = hid ? categories.filter(c => !!c.hidden) : (dragOrder ? dragOrder.map(id => categories.find(c => c.id === id)).filter(Boolean) : orderedCategories);
                  if (!list.length) return null;
                  return (
                    <div key={String(hid)}>
                      {hid && <div className={`mt-3 mb-1 text-[11px] font-bold ${themeConfig.textSecondary}`}>已隱藏</div>}
                      {list.map(cat => (
                        <div key={cat.id} className="mb-1.5" ref={(el) => { if (el) rowEls.current[cat.id] = el; }}
                          onPointerDown={hid ? undefined : (e) => dragStart(e, cat.id, list.map(c => c.id))} onPointerMove={hid ? undefined : dragMove} onPointerUp={hid ? undefined : dragEnd} onPointerCancel={hid ? undefined : dragEnd}
                          style={{ userSelect: 'none', WebkitUserSelect: 'none', WebkitTouchCallout: 'none', position: 'relative', zIndex: dragId === cat.id ? 5 : 1, transform: dragId === cat.id ? `translateY(${dragT}px) scale(1.03)` : 'none', filter: dragId === cat.id ? 'drop-shadow(0 8px 14px rgba(0,0,0,.22))' : 'none', transition: dragId ? 'none' : 'transform .15s' }}>
                        <div className="flex items-center gap-2 py-1.5 px-2 rounded-2xl" style={{ background: theme === 'dark' ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.035)', opacity: hid ? 0.6 : 1 }}>
                          <PhotoIcon name={iconKeyOf(cat)} size={30} />
                          {renameId === cat.id ? (
                            <>
                              <input autoFocus maxLength={4} value={renameVal} onChange={(e) => setRenameVal(e.target.value)} className="flex-1 min-w-0 h-8 px-2 rounded-xl text-[16px] font-bold bg-white/80 dark:bg-slate-800 border border-stone-200 dark:border-slate-600 outline-none" style={{ userSelect: 'text', WebkitUserSelect: 'text' }} />
                              <button type="button" onClick={() => saveRename(cat)} className="h-8 px-3 rounded-xl text-xs font-bold text-white" style={{ backgroundColor: currentSpirit.primary }}>儲存</button>
                              <button type="button" onClick={() => { setRenameId(null); setEditMsg(''); }} className={`text-xs font-semibold ${themeConfig.textSecondary}`}>取消</button>
                            </>
                          ) : (
                            <>
                              <span className="flex-1 min-w-0 text-[14px] font-bold truncate">{cat.shortName}{cat.type === 'income' && <span className={`ml-1 text-[10px] font-semibold ${themeConfig.textSecondary}`}>收入</span>}</span>
                              <button type="button" onClick={() => { setRenameId(cat.id); setRenameVal(cat.shortName); setEditMsg(''); }} className={`h-8 px-2.5 rounded-xl text-xs font-bold ${themeConfig.textSecondary}`} style={{ background: 'rgba(0,0,0,.05)' }}>改名</button>
                              <button type="button" onClick={() => setIconPickId(iconPickId === cat.id ? null : cat.id)} className={`h-8 px-2.5 rounded-xl text-xs font-bold ${themeConfig.textSecondary}`} style={{ background: iconPickId === cat.id ? `${currentSpirit.secondary}66` : 'rgba(0,0,0,.05)' }}>圖示</button>
                              <button type="button" onClick={() => toggleHideCat(cat)} className="h-8 px-2.5 rounded-xl text-xs font-bold" style={{ background: hid ? `${currentSpirit.secondary}66` : 'rgba(0,0,0,.05)', color: hid ? (theme === 'dark' ? currentSpirit.darkAccentText : currentSpirit.accentText) : undefined }}>{hid ? '顯示' : '隱藏'}</button>
                            </>
                          )}
                        </div>
                        {iconPickId === cat.id && (
                          <div className="mt-1.5 grid grid-cols-5 gap-1.5 p-2 rounded-2xl" style={{ background: theme === 'dark' ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.03)' }}>
                            {ICON_ALL.map(([k, lb]) => (
                              <button type="button" key={k} onClick={() => { setCategories(prev => prev.map(c => c.id === cat.id ? { ...c, icon: k } : c)); setIconPickId(null); }} className="flex flex-col items-center py-1 rounded-xl" style={{ background: iconKeyOf(cat) === k ? `${currentSpirit.secondary}55` : 'transparent' }}>
                                <PhotoIcon name={k} size={32} />
                                <span className="text-[10px] font-semibold mt-0.5">{lb}</span>
                              </button>
                            ))}
                          </div>
                        )}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {showAddCategory && (
          <div className="absolute inset-0 z-50 bg-black/45 backdrop-blur-sm flex items-center justify-center p-5" style={{ paddingBottom: 20 + kbOffset }}>
            <form 
              onSubmit={handleAddCustomCategory}
              className={`w-full rounded-[36px] p-6 border shadow-2xl animate-whisper-float ${
                theme === 'dark' ? 'bg-[#161F30] border-slate-700 text-slate-100' : 'bg-[#FDFBF7] border-white text-stone-800'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-stone-200/60 dark:border-slate-700">
                <h3 className="text-base font-bold tracking-wide">＋ 新增自訂記帳項目</h3>
                <button type="button" onClick={() => setShowAddCategory(false)}>
                  <X className="w-4 h-4 opacity-60" />
                </button>
              </div>

              <div className="space-y-4 mt-4">
                <div>
                  <label className={`text-xs font-semibold block mb-1.5 ${themeConfig.textSecondary}`}>
                    1. 輸入項目名稱（最多 4 字）
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    placeholder="例如：貓咪罐罐、健身房、下午茶..."
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-stone-100 dark:bg-slate-800 text-[16px] font-semibold focus:outline-none"
                  />
                </div>

                <div>
                  <label className={`text-xs font-semibold block mb-1.5 ${themeConfig.textSecondary}`}>
                    2. 選擇可愛餵食圖示
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-[38vh] overflow-y-auto no-scrollbar">
                    {CUSTOM_ICON_CHOICES.map(opt => {
                      const isSel = customIcon === opt.key;
                      return (
                        <button
                          type="button"
                          key={opt.key}
                          onClick={() => setCustomIcon(opt.key)}
                          className={`py-2 px-2.5 rounded-2xl flex items-center space-x-2 border text-xs font-semibold transition-all ${
                            isSel 
                              ? 'border-stone-800 dark:border-slate-200 bg-black/5 dark:bg-white/10' 
                              : 'border-transparent bg-stone-100/70 dark:bg-slate-800/60 opacity-65'
                          }`}
                        >
                          <PhotoIcon name={opt.key} size={30} />
                          <span>{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl text-xs font-bold tracking-widest text-white shadow-sm"
                  style={{ backgroundColor: currentSpirit.primary }}
                >
                  儲存並開始餵食
                </button>
              </div>
            </form>
          </div>
        )}


      </div>
    </div>
  );
}