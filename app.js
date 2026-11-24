(() => {
'use strict';

// ---------- Configuration ----------
// webhookUrl: POST endpoint for leads (JSON). Leave empty to log payloads to the console.
// shopUrl: fallback shop link when a ritual product has no URL of its own.
const CONFIG = {
  offer: '15% off your first order',
  promoCode: 'KINK15',
  webhookUrl: '',
  quizUrl: 'https://kinkbymarivana.com/quiz',
  shopUrl: '',
  website: 'kinkbymarivana.com'
};

// ---------- Content ----------
const IMG = k => 'assets/quiz/' + k + '.jpg';
const POS = { q2: '28% 50%', q3: '38% 50%', q8: '38% 40%', inter: '50% 35%', q9: '50% 40%', lead: '50% 35%', q6: '50% 40%', q7: '50% 35%' };
const SEQ = ['age', 'intro', 'q1', 'q2', 'q3', 'q4', 'q5', 'inter', 'q6', 'q7', 'q8', 'q9', 'lead', 'hero'];

const LANG = {
  A: { name: 'Words of Affirmation', short: 'Hearing that you are wanted, seen and enough lands deep.',
    desc: 'For you, desire starts with being told. Hearing that you are wanted, admired and enough is what lets you relax into your body and into the moment. A compliment whispered at the right time can stay with you for days.',
    love: ['Tell you exactly what they find irresistible, and be specific.', 'Leave notes, voice memos or a text in the middle of the day.', 'Name the effort you make, not only how things turn out.'] },
  B: { name: 'Receiving Gifts', short: 'A small, thoughtful gesture tells you that you were on their mind.',
    desc: 'To you, a gift is proof that someone was thinking of you when you weren’t in the room. It is rarely about the price. It’s the flower from the walk home or the scent from your first weekend away, the small thing that says I notice you.',
    love: ['Bring you small things that show you were on their mind.', 'Mark the moments that matter, including the quiet ones.', 'Choose something for your senses: a scent, a texture, a ritual to share.'] },
  C: { name: 'Quality Time', short: 'Undivided attention is the clearest way to reach you.',
    desc: 'You feel most desired when someone chooses you over everything else competing for their attention. Phones down, door closed, nowhere else to be. Presence is the most intimate thing a partner can offer you, and you notice instantly when it’s missing.',
    love: ['Give you their full attention, phone in another room.', 'Plan time that is only for the two of you, and protect it.', 'Linger: the long dinner, the slow morning, the extra hour in bed.'] },
  D: { name: 'Physical Touch', short: 'Closeness and contact tell you that you are safe and wanted.',
    desc: 'Your body is how you listen. A hand on your back, fingers in your hair, a long hug at the door: touch tells you that you’re safe and wanted long before words do. Closeness isn’t a prelude for you. It’s the point.',
    love: ['Reach for you often, not only when it leads somewhere.', 'Learn the touch you crave: slow, firm, playful or still.', 'Stay close afterward, skin to skin, for as long as it feels good.'] },
  E: { name: 'Acts of Service', short: 'Being looked after without having to ask lets you exhale.',
    desc: 'You hear love in what someone does to make your life lighter. The bath already drawn, the dishes handled, the plan that simply works. Being taken care of without asking lets you finally exhale, and that’s when you open up.',
    love: ['Notice what’s weighing on you and quietly take it on.', 'Follow through on what they promise, every time.', 'Set the scene: fresh sheets, low light, everything ready.'] }
};
const LANG_IMG = { A: 'q3', B: 'q4', C: 'q8', D: 'q1', E: 'q5' };

const AC = {
  HOLD: { name: 'Hold Me', short: 'Touch helps you land.',
    desc: 'After intensity, you come back to yourself through touch. Being wrapped up, held close and gently stroked tells your body the experience is complete and that you’re still cherished. Don’t let go too soon.',
    ask: ['Hold me for a while before either of us reaches for a phone.', 'Keep touching me: my hair, my back, my hands.', 'Let me drift off close to you if I want to.'] },
  TALK: { name: 'Talk to Me', short: 'Words help you feel safe again.',
    desc: 'You reconnect through words. Hearing what the moment meant, that you were wonderful and that you’re loved turns a vulnerable feeling into a safe one. You like to process out loud, with someone who stays in the conversation.',
    ask: ['Tell me how that felt for you.', 'Reassure me, even if you think I already know.', 'Check in with me again tomorrow.'] },
  TEND: { name: 'Tend to Me', short: 'Quiet, practical comfort helps you settle.',
    desc: 'You feel cared for through quiet, practical comfort. Water within reach, a warm blanket, help getting cleaned up, and a partner who stays nearby without needing to fill the silence. Being looked after lets your body soften and settle.',
    ask: ['Bring me water and something cozy.', 'Help me get clean and comfortable.', 'Stay nearby, even if we’re quiet.'] },
  SPACE: { name: 'Give Me Space', short: 'A little room first, then reconnection.',
    desc: 'You land softly by having a little room first. Time alone to breathe, shower or simply be lets you return fully present and glad to reconnect. Space isn’t distance for you. It’s how you come back.',
    ask: ['Give me a few minutes alone, and don’t take it personally.', 'Let me know you’ll be right here.', 'Come find me with a soft check-in when I’m ready.'] }
};
const AC_IMG = { HOLD: 'inter', TALK: 'q2', TEND: 'q9', SPACE: 'age' };

// Client to supply product name + shop link per aftercare style.
const RITUAL = {
  HOLD: { name: '[Product for Hold Me]', img: 'p_hold', pos: '62% 50%', url: '#', copy: 'Warm a little between your palms and trade slow, unhurried strokes. Let the scent and the stillness say what words don’t need to.' },
  TALK: { name: '[Product for Talk to Me]', img: 'p_talk', pos: '50% 50%', url: '#', copy: 'Settle in side by side, take turns with the date-night questions below, and let your hands keep the conversation going.' },
  TEND: { name: '[Product for Tend to Me]', img: 'p_tend', pos: '50% 55%', url: '#', copy: 'Keep it on the nightstand beside water and a soft throw. A slow, gentle application becomes the way you say: I’ve got you.' },
  SPACE: { name: '[Product for Give Me Space]', img: 'p_space', pos: '38% 50%', url: '#', copy: 'Make it yours first. A quiet minute, a slow application on your own, then invite your partner back in when you’re ready.' }
};

const QS = [
  { img: 'q1', text: 'What makes you feel most loved by a partner?', opts: [['Hearing loving, reassuring words', 'A'], ['Receiving thoughtful gifts', 'B'], ['Spending uninterrupted time together', 'C'], ['Hugs, kisses and physical affection', 'D'], ['Someone helping make my life easier', 'E']] },
  { img: 'q2', text: 'On a difficult day, what do you want most?', opts: [['Encouraging words and reassurance', 'A'], ['A thoughtful surprise', 'B'], ['Their undivided attention', 'C'], ['A long hug or cuddling', 'D'], ['Practical help without having to ask', 'E']] },
  { img: 'q3', text: 'What makes you feel most appreciated?', opts: [['Being complimented and acknowledged', 'A'], ['Someone remembering the little things I like', 'B'], ['Someone making time for me', 'C'], ['Frequent affection and touch', 'D'], ['Someone following through on promises', 'E']] },
  { img: 'q4', text: 'How do you naturally show love?', opts: [['I tell them how much they mean to me', 'A'], ['I give meaningful gifts or surprises', 'B'], ['I plan time together', 'C'], ['I touch, hug, kiss or cuddle', 'D'], ['I do things to support and help them', 'E']] },
  { img: 'q5', text: 'What hurts most when it’s missing?', opts: [['Kind words and reassurance', 'A'], ['Thoughtful gestures on special occasions', 'B'], ['Quality time and attention', 'C'], ['Affection and physical closeness', 'D'], ['Effort, support and reliability', 'E']] },
  { img: 'q6', text: 'Right after intimacy, what feels best?', opts: [['Cuddling and holding each other', 'HOLD'], ['Kissing and gentle affection', 'HOLD'], ['Talking and sharing feelings', 'TALK'], ['Quiet time while staying close', 'TEND'], ['Time alone to decompress', 'SPACE'], ['It depends on the moment', null]] },
  { img: 'q7', text: 'What would you most like to hear afterward?', opts: [['“I love you, and I’m here.”', 'TALK'], ['“That felt special with you.”', 'TALK'], ['“How are you feeling?”', 'TEND'], ['“You can tell me anything.”', 'TALK'], ['I don’t need words. Actions matter more.', 'HOLD']] },
  { img: 'q8', text: 'What physical comfort do you appreciate afterward?', opts: [['Being held or having my hair stroked', 'HOLD'], ['Gentle kisses and touch', 'HOLD'], ['A blanket, water, help getting comfortable', 'TEND'], ['A shower or help cleaning up', 'TEND'], ['No touch for a little while', 'SPACE']] },
  { img: 'q9', text: 'If you need space, what helps?', opts: [['My partner checks in first', 'TEND'], ['Clear reassurance that we’re okay', 'TALK'], ['Quiet time without questions', 'SPACE'], ['Time alone, then reconnection', 'SPACE'], ['Talking through what I need in the moment', 'TALK']] }
];
// Conversation prompts for the results page. Language groups are keyed to LANG;
// `picks` are the two questions surfaced in the date-night section for that language.
const CONVO = [
  { key: 'A', title: 'Words of Affirmation', sub: 'How they need to hear love.', picks: [0, 6], qs: [
    'What is something someone could say to you that would instantly make you feel valued?',
    'When you’re doubting yourself, what kind of reassurance do you wish someone would give you?',
    'Do you remember a compliment someone gave you that you’ve never forgotten? Why did it mean so much?',
    'Do you prefer someone expressing their feelings openly, or showing you through subtle reminders?',
    'How important is it for your partner to verbally acknowledge the little things you do?',
    'When you’re upset, do you want to hear that everything will be okay, or be reminded of how strong and capable you are?',
    'What words do you wish you heard more often in a relationship?',
    'Do you feel more loved when someone tells you why they love you, or when they simply tell you they love you?'] },
  { key: 'C', title: 'Quality Time', sub: 'How they experience connection.', picks: [2, 3], qs: [
    'What does spending meaningful time with someone look like to you?',
    'Do you feel more connected through deep conversations, doing activities together, or simply existing in the same space?',
    'If we had an entire day together with no responsibilities, how would you want to spend it?',
    'What makes you feel like someone is genuinely present with you?',
    'Does it bother you when someone is physically around but mentally distracted?',
    'Would you rather have a few hours of someone’s undivided attention, or an entire day together doing separate things?',
    'What kinds of moments make you feel closest to someone?',
    'How important is it for your partner to initiate plans rather than always waiting for you to?'] },
  { key: 'B', title: 'Receiving Gifts', sub: 'The meaning behind thoughtful gestures.', picks: [3, 6], qs: [
    'Do you value the actual gift more, or the thought and meaning behind it?',
    'How would you feel if someone remembered a tiny detail you mentioned months ago and surprised you with it?',
    'Do unexpected little gestures mean more to you than gifts on special occasions?',
    'What’s something inexpensive that someone could give you that would mean the world?',
    'Do you feel loved when someone sees something and immediately thinks of you?',
    'Would you rather receive something sentimental that reminds you of a memory, or something practical that makes your life easier?',
    'What is the most meaningful gift you’ve ever received, and what made it special?',
    'Do you enjoy surprises, or do you prefer someone knowing exactly what you want?'] },
  { key: 'E', title: 'Acts of Service', sub: 'How actions translate into love.', picks: [0, 7], qs: [
    'What is something someone could do for you that would make you feel genuinely cared for?',
    'When you’re overwhelmed, do you prefer someone to offer help without being asked, or wait until you ask?',
    'What everyday responsibility would you appreciate having someone take off your plate?',
    'Do you feel more loved when someone says they’ll be there for you, or when they actually show up and do something?',
    'What does being taken care of look like to you?',
    'If you had a stressful week, what could your partner do to make your life feel a little easier?',
    'Do little acts of consideration mean more to you than grand romantic gestures?',
    'What is something you wish people would notice you need without having to explain it?'] },
  { key: 'D', title: 'Physical Touch', sub: 'Affection, closeness and intimacy.', picks: [0, 5], qs: [
    'What kind of physical affection makes you feel the most emotionally connected to someone?',
    'Do you crave affection more when you’re happy, stressed, sad, or simply spending time together?',
    'Do little touches throughout the day mean more to you than intentional romantic moments?',
    'How important is physical affection when you’re not being intimate?',
    'Do you feel comforted by hugs, hand-holding, cuddling, kisses, or simply having someone close?',
    'What does physical intimacy mean to you beyond the physical?',
    'When you’re having a difficult day, would a long hug make you feel better?',
    'Do you associate physical affection with reassurance, security, passion, or all three?'] },
  { key: 'DEEP', title: 'How you want to be loved', sub: 'Questions that reveal what you might not realize about yourself.', qs: [
    'When was the last time you felt genuinely loved by someone? What did they do?',
    'What is something that makes you feel emotionally safe with another person?',
    'How do you typically recognize that someone genuinely cares about you?',
    'When you feel disconnected from someone, what do you wish they would do to bring you closer?',
    'What’s something you give to people that you secretly wish they would give back to you?',
    'Do you find it easier to express love or receive it?',
    'What makes you feel like you’re someone’s priority without them having to say it?',
    'What is one thing a partner could consistently do that would make you feel secure in the relationship?',
    'When you’re having a hard time, do you want comfort, solutions, reassurance, distraction or space?',
    'What’s the difference between someone loving you and someone making you feel loved?',
    'What is a small gesture that actually carries a lot of meaning for you?',
    'Have you ever felt misunderstood in the way you give or receive love? What happened?'] },
  { key: 'ROMANCE', title: 'Romantic love + emotional needs', sub: 'What it means to be chosen, again and again.', qs: [
    'What does being intentionally loved look like to you?',
    'What makes you feel pursued, even after someone has already won your heart?',
    'How do you want someone to love you on days when you’re not the easiest person to love?',
    'What does consistency look like to you in a relationship?',
    'What makes you feel appreciated rather than simply expected?',
    'What is something romantic that might seem insignificant to other people but would mean everything to you?',
    'How do you prefer someone to approach you when you’ve been emotionally distant?',
    'What makes you feel chosen, even when life gets busy?',
    'What is one thing you never want to have to beg for in a relationship?',
    'If someone wanted to love you in a way that felt completely natural to you, what would they need to understand?'] },
  { key: 'LATE', title: 'Late-night questions', sub: 'The ones that really make you think.', qs: [
    'If I wanted to make you feel loved without ever saying “I love you,” what would I need to do?',
    'What is something you wish a partner would notice about you without you having to point it out?',
    'Do you think the way you show love is the same way you want to receive it?',
    'What kind of affection do you wish you’d received more of growing up?',
    'What makes you feel emotionally spoiled?',
    'If you could design your ideal relationship around how you give and receive love, what would it look like?',
    'What’s one thing that makes you feel deeply connected to someone that other people might overlook?'] }
];
const BIG_Q = 'What is something you find yourself constantly doing for the people you love that you secretly wish someone would do for you?';
const AFTERCARE_Q = 'What does good aftercare look like for you?';

// The booth playing cards (Kink Cards). Each suit draws its questions from CONVO.
const SUITS = {
  explore: { name: 'Explore', color: '#19c3ff', keys: ['A', 'B', 'C', 'D', 'E'] },
  indulge: { name: 'Indulge', color: '#ffe61a', keys: ['ROMANCE'] },
  restore: { name: 'Restore', color: '#5cf57a', keys: ['DEEP'], extra: [AFTERCARE_Q] },
  scene: { name: 'Scene', color: '#ff4a6e', keys: ['LATE'], extra: [BIG_Q] }
};
const C = k => 'assets/cards/' + k + '.jpg';
const CARDS = {
  explore: [
    { num: 'I', src: C('miravana790'), pos: '45% 22%', zoom: 1.15, bright: .86 },
    { num: 'II', src: C('DSC_5287'), pos: '42% 50%', zoom: 1, bright: .84 },
    { num: 'III', src: C('DSC_5261'), pos: '50% 58%', zoom: 1.1, bright: .86 }],
  indulge: [
    { num: 'I', src: C('DSC_5599'), pos: '62% 20%', zoom: 1.2, bright: .86 },
    { num: 'II', src: C('miravana673'), pos: '50% 38%', zoom: 1.1, bright: .86 },
    { num: 'III', src: C('miravana843'), pos: '50% 55%', zoom: 1.15, bright: .84 }],
  restore: [
    { num: 'I', src: C('miravana676'), pos: '50% 40%', zoom: 1.1, bright: .84 },
    { num: 'II', src: C('miravana764'), pos: '40% 32%', zoom: 1.15, bright: .8 },
    { num: 'III', src: C('miravana778'), pos: '48% 50%', zoom: 1, bright: .74 }],
  scene: [
    { num: 'I', src: C('miravana810'), pos: '50% 45%', zoom: 1.1, bright: .86 },
    { num: 'II', src: C('miravana821'), pos: '50% 34%', zoom: 1.1, bright: .86 },
    { num: 'III', src: C('DSC_7466'), pos: '50% 45%', zoom: 1, bright: .9 }]
};
const DEMO = [3, 3, 2, 3, 2, 3, 2, 2, 0];
const EMPTY = () => Array(9).fill(null);

// ---------- State ----------
const state = {
  s: 'age', qi: 0, answers: EMPTY(),
  name: '', email: '', age21: false, optin: false, submitted: false
};
const timers = {};
let lock = false;

const $ = id => document.getElementById(id);
const scroller = $('scroller');
const esc = v => String(v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const logo = (w = 96) => `<img class="logo" src="assets/kink-logo-ivory.svg" alt="KINK by Marivana" style="width:${w}px">`;

// ---------- Scoring ----------
function rank(range, order) {
  const a = state.answers, counts = {}, picks = [];
  order.forEach(k => counts[k] = 0);
  range.forEach(qi => {
    const i = a[qi];
    if (i == null) return;
    const k = QS[qi].opts[i][1];
    if (k) { counts[k]++; picks.push(k); }
  });
  // Ties break toward whichever key was picked first.
  const pr = k => { const j = picks.indexOf(k); return j < 0 ? 99 + order.indexOf(k) : j; };
  const keys = order.slice().sort((x, y) => counts[y] - counts[x] || pr(x) - pr(y));
  if (counts[keys[0]] === 0) return null;
  return counts[keys[1]] === counts[keys[0]] ? [keys[0], keys[1]] : [keys[0]];
}

function result() {
  const lk = rank([0, 1, 2, 3, 4], ['A', 'B', 'C', 'D', 'E']) || ['D'];
  const ak = rank([5, 6, 7, 8], ['HOLD', 'TALK', 'TEND', 'SPACE']) || ['TEND'];
  const L1 = LANG[lk[0]], L2 = lk[1] && LANG[lk[1]], A1 = AC[ak[0]], A2 = ak[1] && AC[ak[1]];
  const rit = RITUAL[ak[0]];
  return {
    langKeys: lk, langName: lk.map(k => LANG[k].name).join(' + '), langDesc: L1.desc,
    langSecond: L2 ? 'You speak ' + L2.name + ' just as fluently. ' + L2.short : '',
    love: L2 ? L1.love.slice(0, 2).concat(L2.love[0]) : L1.love, langImg: IMG(LANG_IMG[lk[0]]),
    acName: ak.map(k => AC[k].name).join(' + '), acDesc: A1.desc,
    acSecond: A2 ? 'You also lean toward ' + A2.name + '. ' + A2.short : '',
    ask: A2 ? A1.ask.slice(0, 2).concat(A2.ask[0]) : A1.ask, acImg: IMG(AC_IMG[ak[0]]),
    ritualName: rit.name, ritualCopy: rit.copy, ritualImg: IMG(rit.img), ritualPos: rit.pos,
    shopUrl: rit.url !== '#' ? rit.url : (CONFIG.shopUrl || '#')
  };
}

// ---------- Integrations ----------
function utm() {
  const q = new URLSearchParams(window.location.search);
  return { utm_source: q.get('utm_source') || '', utm_medium: q.get('utm_medium') || '', utm_campaign: q.get('utm_campaign') || '' };
}

function post(payload) {
  const u = CONFIG.webhookUrl;
  if (!/^https?:\/\//.test(u)) { console.info('[KINK quiz] Webhook URL not set. Payload:', payload); return; }
  fetch(u, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), keepalive: true }).catch(() => {});
}

function copy(text) {
  try { if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text); } catch (e) {}
  const t = document.createElement('textarea');
  t.value = text; t.style.position = 'fixed'; t.style.opacity = '0';
  document.body.appendChild(t); t.select();
  try { document.execCommand('copy'); } catch (e) {}
  t.remove();
  return Promise.resolve();
}

function toast(msg) {
  clearTimeout(timers.toast);
  $('toast-text').textContent = msg;
  $('toast').classList.add('on');
  timers.toast = setTimeout(() => $('toast').classList.remove('on'), 2600);
}

// ---------- Backgrounds ----------
const bgEls = {};
SEQ.forEach(k => {
  const d = document.createElement('div');
  d.className = 'bg';
  d.style.backgroundPosition = POS[k] || '50% 30%';
  $('bgs').appendChild(d);
  bgEls[k] = d;
});

function bgKey() {
  if (state.s === 'q') return QS[state.qi].img;
  if (state.s === 'results') return 'hero';
  if (state.s === 'leave') return 'age';
  return state.s;
}

// Load the current background plus the next two so transitions never show a blank.
function syncBackground(all) {
  const key = bgKey();
  const i = SEQ.indexOf(key);
  (all ? SEQ : SEQ.slice(Math.max(0, i), i + 3)).forEach(k => {
    if (!bgEls[k].style.backgroundImage) bgEls[k].style.backgroundImage = 'url(' + IMG(k) + ')';
  });
  SEQ.forEach(k => bgEls[k].classList.toggle('on', k === key));
  $('dim').classList.toggle('on', state.s === 'lead' || state.s === 'results');
}

// ---------- Screens ----------
function header() {
  const s = state.s;
  const part2 = s === 'inter' || (s === 'q' && state.qi >= 5);
  const progress = s === 'q' ? Math.round((state.qi + 1) / 9 * 100) : s === 'inter' ? Math.round(5 / 9 * 100) : 100;
  const part = s === 'lead' ? 'Your profile' : part2 ? 'Part 2 · Aftercare' : 'Part 1 · Intimacy language';
  const count = s === 'q' ? String(state.qi + 1).padStart(2, '0') + ' / 09' : s === 'inter' ? '05 / 09' : '09 / 09';
  return `
    <div class="header">
      <div class="header-row">
        <button type="button" class="back" aria-label="Back" data-act="back"><i class="ph ph-arrow-left"></i></button>
        <div class="eyebrow part">${part}</div>
        <div class="count">${count}</div>
      </div>
      <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress}"><div style="width:${progress}%"></div></div>
    </div>`;
}

const screens = {
  age: () => `
    <div class="screen split" data-screen-label="01 Age gate">
      ${logo()}
      <div class="stack" style="gap:28px">
        <div class="stack" style="gap:14px">
          <div class="rule"></div>
          <h1 class="display" style="font-size:34px;line-height:1.08">This experience is for adults 21+.</h1>
        </div>
        <div class="stack" style="gap:10px">
          <button type="button" class="btn" data-act="confirmAge">I’m 21+</button>
          <button type="button" class="btn ghost" data-act="leave">Leave</button>
        </div>
      </div>
    </div>`,

  leave: () => `
    <div class="screen split">
      ${logo()}
      <div class="stack" style="gap:14px">
        <div class="rule"></div>
        <h1 class="display" style="font-size:34px;line-height:1.08">Until next time.</h1>
        <p class="body" style="font-size:15px;line-height:1.5">This experience is for adults 21+.</p>
      </div>
    </div>`,

  intro: () => `
    <div class="screen split" data-screen-label="02 Intro">
      ${logo()}
      <div class="stack" style="gap:28px">
        <div class="stack" style="gap:16px">
          <div class="eyebrow">Intimacy + Aftercare</div>
          <h1 class="display" style="font-size:46px;line-height:1.02">What’s your intimacy language?</h1>
          <p class="body">Discover how you give and receive love, and the aftercare that helps you feel safe, valued and cared for. 9 questions. No wrong answers.</p>
        </div>
        <button type="button" class="btn" data-act="start">Let’s explore <i class="ph ph-arrow-right"></i></button>
      </div>
    </div>`,

  q: () => {
    const Q = QS[state.qi];
    const opts = Q.opts.map((o, i) => `
      <button type="button" class="opt" data-act="pick" data-i="${i}" aria-pressed="${state.answers[state.qi] === i}">
        <span class="ring"><span></span></span><span class="label">${o[0]}</span>
      </button>`).join('');
    return header() + `
      <div class="screen question" data-screen-label="Question">
        <h1 class="display" style="font-size:31px;line-height:1.1">${Q.text}</h1>
        <div class="options">${opts}</div>
      </div>`;
  },

  inter: () => header() + `
    <div class="screen inter" data-screen-label="Interstitial">
      <div class="stack" style="gap:14px">
        <div class="italic" style="font-size:24px;line-height:1.25">Now, the part most people skip.</div>
        <h1 class="display" style="font-size:50px;line-height:1">Aftercare.</h1>
        <div class="rule" style="margin-top:6px"></div>
        <p class="body">The care, comfort and reconnection you want after intimacy or any intense experience.</p>
      </div>
      <button type="button" class="btn" data-act="toPart2">Continue <i class="ph ph-arrow-right"></i></button>
    </div>`,

  lead: () => {
    const R = result(), u = utm();
    return header() + `
      <form class="screen lead" data-screen-label="Lead capture" novalidate>
        <div class="teaser" aria-hidden="true">
          <div class="teaser-img"></div>
          <div class="teaser-vignette"></div>
          <div class="teaser-text">
            <div class="display" style="font-size:30px;line-height:1.05;filter:blur(9px)">${R.langName}</div>
            <div class="italic" style="font-size:18px;filter:blur(7px)">${R.acName}</div>
          </div>
          <div class="teaser-lock"><i class="ph ph-lock-simple"></i>Your result</div>
        </div>
        <h1 class="display" style="font-size:32px;line-height:1.08">Your intimacy profile is ready.</h1>
        <div class="stack" style="gap:14px">
          <label class="field">
            <span class="eyebrow">First name</span>
            <input class="input" id="f-name" type="text" name="first_name" autocomplete="given-name" value="${esc(state.name)}">
          </label>
          <label class="field">
            <span class="eyebrow">Email</span>
            <input class="input" id="f-email" type="email" name="email" inputmode="email" autocomplete="email" value="${esc(state.email)}">
          </label>
          <div class="stack" style="gap:2px">
            <button type="button" class="check" id="f-age" role="checkbox" aria-checked="${state.age21}" data-act="toggleAge">
              <span class="box"><i class="ph ph-check"></i></span><span>I’m 21+</span>
            </button>
            <button type="button" class="check" id="f-optin" role="checkbox" aria-checked="${state.optin}" data-act="toggleOptin">
              <span class="box"><i class="ph ph-check"></i></span><span style="text-wrap:pretty">Send me intimacy tips and offers from KINK</span>
            </button>
          </div>
          <div class="error" id="f-error" role="alert"></div>
        </div>
        <input type="hidden" name="intimacy_language" value="${esc(R.langName)}">
        <input type="hidden" name="aftercare_style" value="${esc(R.acName)}">
        <input type="hidden" name="utm_source" value="${esc(u.utm_source)}">
        <input type="hidden" name="utm_medium" value="${esc(u.utm_medium)}">
        <input type="hidden" name="utm_campaign" value="${esc(u.utm_campaign)}">
        <button type="submit" class="btn" style="margin-top:auto">Reveal my profile</button>
      </form>`;
  },

  results: () => {
    const R = result();
    const name = state.name.trim();
    const greeting = name ? esc(name) + ', your intimacy profile' : 'Your intimacy profile';
    return `
      <div class="results" data-screen-label="Results">
        <section class="res-hero">
          <img src="assets/quiz/hero.jpg" alt="">
          <div class="veil"></div>
          <div style="position:relative;padding:calc(28px + var(--safe-top)) 24px 0">${logo(80)}</div>
          <div class="stack" style="position:relative;gap:12px;padding:0 24px 40px">
            <div class="eyebrow">${greeting}</div>
            <h1 class="display" style="font-size:44px;line-height:1.02">${R.langName}</h1>
            <div class="italic" style="font-size:22px;line-height:1.25">with ${R.acName} aftercare</div>
            <div class="scroll-hint"><i class="ph ph-arrow-down"></i>Scroll to explore</div>
          </div>
        </section>

        <section class="photo-section">
          <img src="${R.langImg}" alt="" loading="lazy">
          <div class="veil"></div>
          <div class="res-body">
            <div class="eyebrow">01 · Your intimacy language</div>
            <h2 class="display" style="font-size:36px;line-height:1.05">${R.langName}</h2>
            <p class="body" style="line-height:1.6">${R.langDesc}</p>
            ${R.langSecond ? `<p class="italic" style="margin:0;font-size:18px;line-height:1.45">${R.langSecond}</p>` : ''}
            <div class="stack" style="gap:14px;margin-top:10px">
              <div class="eyebrow light">How a partner can love you</div>
              ${R.love.map(l => `<div class="love-item"><span style="text-wrap:pretty">${l}</span></div>`).join('')}
            </div>
          </div>
        </section>

        <section class="photo-section">
          <img src="${R.acImg}" alt="" loading="lazy">
          <div class="veil"></div>
          <div class="res-body">
            <div class="eyebrow">02 · Your aftercare style</div>
            <h2 class="display" style="font-size:36px;line-height:1.05">${R.acName}</h2>
            <p class="body" style="line-height:1.6">${R.acDesc}</p>
            ${R.acSecond ? `<p class="italic" style="margin:0;font-size:18px;line-height:1.45">${R.acSecond}</p>` : ''}
            <div class="stack" style="gap:14px;margin-top:10px">
              <div class="eyebrow light">What to ask your partner for</div>
              ${R.ask.map(a => `<div class="quote">“${a}”</div>`).join('')}
            </div>
          </div>
        </section>

        <section class="res-body" style="background:linear-gradient(180deg,#120c0b,#1a110f 50%,#120c0b)">
          <div class="eyebrow">03 · Your ritual</div>
          <div class="ritual-img"><img src="${R.ritualImg}" alt="${esc(R.ritualName)}" loading="lazy" style="object-position:${R.ritualPos}"></div>
          <h2 class="display" style="font-size:30px;line-height:1.08">${R.ritualName}</h2>
          <p class="body" style="line-height:1.6">${R.ritualCopy}</p>
          <a class="btn" href="${esc(R.shopUrl)}" target="_blank" rel="noopener">Shop now <i class="ph ph-arrow-up-right" style="font-size:15px"></i></a>
        </section>

        <section class="res-body" style="padding:40px 24px 48px">
          <div class="eyebrow">04 · For you</div>
          <h2 class="display" style="font-size:30px;line-height:1.1">${esc(CONFIG.offer)} with code ${esc(CONFIG.promoCode)}</h2>
          <button type="button" class="code-btn" data-act="copyCode" aria-label="Copy code ${esc(CONFIG.promoCode)}">
            <span class="code">${esc(CONFIG.promoCode)}</span>
            <span class="copy" id="copy-state"><i class="ph ph-copy"></i>Tap to copy</span>
          </button>
        </section>

        <section class="photo-section">
          <img src="assets/quiz/q7.jpg" alt="" loading="lazy" style="object-position:50% 40%">
          <div class="veil" style="background:linear-gradient(180deg,#120c0b 0%,rgba(18,12,11,.8) 20%,rgba(18,12,11,.84) 75%,#120c0b 100%)"></div>
          <div class="res-body" style="gap:22px;padding:56px 24px 60px">
            <div class="eyebrow">05 · Date night</div>
            <h2 class="display" style="font-size:30px;line-height:1.1">Three questions to ask each other</h2>
            ${dateQs(R).map((q, i) => `<div class="date-q"><span class="n">${['I', 'II', 'III'][i]}</span><span class="q">${q}</span></div>`).join('')}
          </div>
        </section>

        <section class="res-body" style="gap:22px">
          <div class="eyebrow">06 · Draw a card</div>
          <h2 class="display" style="font-size:30px;line-height:1.1">A question for the two of you</h2>
          <p class="body" style="line-height:1.6">Take turns. Flip a card, answer it yourself first, then pass the phone.</p>
          <div class="suits" role="group" aria-label="Suit">
            ${['all'].concat(Object.keys(SUITS)).map(k => `<button type="button" class="suit-chip" data-act="suit" data-suit="${k}" aria-pressed="${deck.suit === k}"${k === 'all' ? '' : ` style="--suit:${SUITS[k].color}"`}>${k === 'all' ? 'All' : SUITS[k].name}</button>`).join('')}
          </div>
          <div class="deck">
            <div class="deck-under" aria-hidden="true"></div>
            <div class="deck-under" aria-hidden="true"></div>
            <button type="button" class="kcard" id="kcard" data-act="flipCard" aria-pressed="false" aria-label="Flip card">
              <span class="kcard-inner">
                <span class="kface kback" aria-hidden="true"><span class="kart">${cardBack()}</span></span>
                <span class="kface kfront" id="kfront"><span class="kart">${cardFront(deck.cards[deck.i])}</span></span>
              </span>
            </button>
          </div>
          <div class="deck-bar">
            <span class="deck-count" id="deck-count">${deckCount()}</span>
            <button type="button" class="btn ghost deck-next" data-act="nextCard">Next card <i class="ph ph-arrow-right"></i></button>
          </div>
        </section>

        <section class="res-body" style="gap:22px">
          <div class="eyebrow">07 · Go deeper</div>
          <h2 class="display" style="font-size:30px;line-height:1.1">The question that says the most</h2>
          <p class="big-q">“${BIG_Q}”</p>
          <p class="body" style="line-height:1.6">It shows both how you give love and how you hope to receive it. Don’t run through these like an interview: pick a few, answer them yourself first, and let the conversation unfold. The story behind an answer often says more than the answer.</p>
          <div class="convo">
            ${convoGroups(R).map((g, gi) => `
              <details class="convo-group"${gi === 0 ? ' open' : ''}>
                <summary>
                  <span class="stack" style="gap:4px">
                    <span class="convo-title">${g.title}${R.langKeys.includes(g.key) ? '<span class="convo-tag">Yours</span>' : ''}</span>
                    <span class="convo-sub">${g.sub} · ${g.qs.length} questions</span>
                  </span>
                  <i class="ph ph-plus"></i>
                </summary>
                <ol class="convo-list">${g.qs.map(q => `<li>${q}</li>`).join('')}</ol>
              </details>`).join('')}
          </div>
        </section>

        <section class="stack" style="gap:10px;padding:40px 24px 24px">
          <button type="button" class="btn" data-act="share"><i class="ph ph-share-network" style="font-size:17px"></i>Send to my partner</button>
          <button type="button" class="btn ghost" style="color:var(--ivory)" data-act="fullQ"><i class="ph ph-envelope-simple" style="font-size:17px"></i>Get the full questionnaire</button>
          <button type="button" class="btn text" data-act="retake"><i class="ph ph-arrow-counter-clockwise"></i>Retake</button>
        </section>

        <section class="stack" style="gap:28px;padding:24px 24px calc(36px + var(--safe-bottom))">
          <p class="italic" style="margin:0;font-size:20px;line-height:1.45">Your preferences can change, overlap and differ from your partner’s. That’s the point of exploring.</p>
          <div class="footer-row">${logo(56)}<span>21+ · ${esc(CONFIG.website)}</span></div>
        </section>
      </div>`;
  }
};

// Two questions from the person's language (one from each in a blend), then aftercare.
function dateQs(R) {
  const group = k => CONVO.find(g => g.key === k);
  const [k1, k2] = R.langKeys;
  const qs = k2
    ? [group(k1).qs[group(k1).picks[0]], group(k2).qs[group(k2).picks[0]]]
    : group(k1).picks.map(i => group(k1).qs[i]);
  return qs.concat(AFTERCARE_Q);
}

// The person's own language groups first, then everything else in its original order.
function convoGroups(R) {
  return CONVO.filter(g => R.langKeys.includes(g.key)).concat(CONVO.filter(g => !R.langKeys.includes(g.key)));
}

// ---------- Card deck ----------
const deck = { suit: 'all', cards: [], i: 0, flipped: false, busy: false };

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

// One card per question, dealt in its suit's three designs in turn. With every suit
// in play, the first card comes from the person's own intimacy language.
function buildDeck(R) {
  const own = CONVO.filter(g => R.langKeys.includes(g.key)).flatMap(g => g.qs);
  const cards = [];
  Object.entries(SUITS).forEach(([s, S]) => {
    if (deck.suit !== 'all' && deck.suit !== s) return;
    const qs = CONVO.filter(g => S.keys.includes(g.key)).flatMap(g => g.qs).concat(S.extra || []);
    qs.forEach((q, n) => cards.push({ s, q, design: CARDS[s][n % 3] }));
  });
  shuffle(cards);
  const first = cards.findIndex(c => own.includes(c.q));
  if (first > 0) cards.unshift(cards.splice(first, 1)[0]);
  Object.assign(deck, { cards, i: 0, flipped: false, busy: false });
}

const deckCount = () => String(deck.i + 1).padStart(2, '0') + ' / ' + String(deck.cards.length).padStart(2, '0');

function cardIndex(S, num) {
  return `<span class="kidx"><span class="knum">${num}</span><span class="ksuit" style="color:${S.color}">${S.name}</span></span>`;
}

function cardFront(c) {
  const S = SUITS[c.s], d = c.design;
  return `
    <img class="kphoto" src="${d.src}" alt="" style="object-position:${d.pos};transform:scale(${d.zoom});transform-origin:${d.pos};filter:saturate(.88) contrast(1.08) brightness(${d.bright}) sepia(.08)">
    <span class="kshade"></span>
    <span class="kframe"></span>
    <span class="kcorner tl">${cardIndex(S, d.num)}</span>
    <span class="kcorner br">${cardIndex(S, d.num)}</span>
    <span class="kq">${c.q}</span>
    <img class="klogo" src="assets/kink-logo-white.svg" alt="">`;
}

// The printed back, with the QR tile turned into a flip cue for the screen.
function cardBack() {
  return `
    <span class="kback-bg"></span>
    <span class="kweave"></span>
    <span class="kframe"></span>
    <span class="kframe-inner"></span>
    <span class="kback-body">
      <img src="assets/kink-logo-white.svg" alt="" style="width:64px">
      <span class="kback-title">Draw a card</span>
      <span class="kback-tile">
        ${Object.values(SUITS).map(S => `<span style="color:${S.color}">${S.name}</span>`).join('')}
        <i class="ph ph-hand-tap"></i>
      </span>
      <span class="kback-cue">Tap to flip</span>
      <span class="kback-sub">A question for the two of you</span>
    </span>
    <span class="kback-links"><span>${esc(CONFIG.website)}</span><span>@kink.bymarivana</span></span>
    <span class="kback-foot"><span>CBD infused. Kink aftercare approved.</span><b>21+</b></span>`;
}

function setFlipped(on) {
  deck.flipped = on;
  const el = $('kcard');
  el.setAttribute('aria-pressed', on);
  el.setAttribute('aria-label', on ? 'Card: ' + deck.cards[deck.i].q + ' Tap to turn face down.' : 'Flip card');
}

// Turn the card face down, swap in the next question while it's hidden, then deal it face up.
function nextCard() {
  if (deck.busy) return;
  deck.busy = true;
  const advance = () => {
    deck.i = (deck.i + 1) % deck.cards.length;
    $('kfront').innerHTML = `<span class="kart">${cardFront(deck.cards[deck.i])}</span>`;
    $('deck-count').textContent = deckCount();
    timers.deal = setTimeout(() => { setFlipped(true); deck.busy = false; }, 120);
  };
  if (deck.flipped) { setFlipped(false); timers.deal = setTimeout(advance, 720); }
  else advance();
}

function render(allBgs) {
  if (state.s === 'results') buildDeck(result());
  syncBackground(allBgs);
  scroller.innerHTML = screens[state.s]();
  scroller.classList.toggle('scroll', state.s === 'lead' || state.s === 'results');
  scroller.scrollTop = 0;
}

// Fade the current screen out, swap state, fade the next one in.
function go(patch) {
  clearTimeout(timers.go);
  scroller.classList.add('out');
  timers.go = setTimeout(() => {
    Object.assign(state, patch);
    render();
    scroller.classList.remove('out');
  }, 320);
}

// ---------- Actions ----------
function pick(i, btn) {
  if (lock) return;
  lock = true;
  const qi = state.qi;
  state.answers[qi] = i;
  scroller.querySelectorAll('.opt').forEach(b => b.setAttribute('aria-pressed', b === btn));
  timers.pick = setTimeout(() => {
    lock = false;
    if (qi === 4) go({ s: 'inter' });
    else if (qi === 8) go(state.submitted ? { s: 'results' } : { s: 'lead' });
    else go({ qi: qi + 1 });
  }, 420);
}

function back() {
  const { s, qi } = state;
  if (s === 'q') go(qi === 0 ? { s: 'intro' } : qi === 5 ? { s: 'inter' } : { qi: qi - 1 });
  else if (s === 'inter') go({ s: 'q', qi: 4 });
  else if (s === 'lead') go({ s: 'q', qi: 8 });
}

function clearErrors() {
  ['f-name', 'f-email', 'f-age'].forEach(id => $(id) && $(id).classList.remove('bad'));
  if ($('f-error')) $('f-error').textContent = '';
}

function submit() {
  const { name, email, age21, optin } = state;
  const bad = { name: !name.trim(), email: !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()), age: !age21 };
  const err = bad.name ? 'Add your first name.' : bad.email ? 'Add a valid email so we can send your profile.' : bad.age ? 'Please confirm you’re 21+.' : '';
  $('f-name').classList.toggle('bad', bad.name);
  $('f-email').classList.toggle('bad', bad.email);
  $('f-age').classList.toggle('bad', bad.age);
  $('f-error').textContent = err;
  if (err) return;
  const R = result();
  post({ first_name: name.trim(), email: email.trim(), age_21: true, marketing_opt_in: optin, intimacy_language: R.langName, aftercare_style: R.acName, ...utm(), source: 'kink_quiz' });
  state.submitted = true;
  go({ s: 'results' });
}

const actions = {
  confirmAge: () => go({ s: 'intro' }),
  leave: () => go({ s: 'leave' }),
  start: () => go({ s: 'q', qi: 0 }),
  toPart2: () => go({ s: 'q', qi: 5 }),
  back,
  pick: btn => pick(Number(btn.dataset.i), btn),
  toggleAge: btn => { state.age21 = !state.age21; btn.setAttribute('aria-checked', state.age21); clearErrors(); },
  toggleOptin: btn => { state.optin = !state.optin; btn.setAttribute('aria-checked', state.optin); },
  copyCode: () => {
    copy(CONFIG.promoCode);
    const el = $('copy-state');
    el.innerHTML = '<i class="ph ph-check"></i>Copied';
    clearTimeout(timers.copy);
    timers.copy = setTimeout(() => { el.innerHTML = '<i class="ph ph-copy"></i>Tap to copy'; }, 2400);
  },
  share: () => {
    const url = CONFIG.quizUrl + (CONFIG.quizUrl.includes('?') ? '&' : '?') + 'utm_source=quiz&utm_medium=partner_share';
    const data = { title: 'KINK | Quiz', text: 'Take this, then let’s compare answers.', url };
    if (navigator.share) navigator.share(data).catch(() => {});
    else copy(url).then(() => toast('Link copied. Send it to your partner.'));
  },
  fullQ: () => {
    const R = result(), email = state.email.trim();
    post({ email, first_name: state.name.trim(), request: 'full_questionnaire', intimacy_language: R.langName, aftercare_style: R.acName, ...utm() });
    toast(email ? 'The full questionnaire is on its way to ' + email + '.' : 'The full questionnaire is on its way to your inbox.');
  },
  flipCard: () => { if (!deck.busy) setFlipped(!deck.flipped); },
  nextCard,
  suit: btn => {
    deck.suit = btn.dataset.suit;
    scroller.querySelectorAll('.suit-chip').forEach(b => b.setAttribute('aria-pressed', b === btn));
    clearTimeout(timers.deal);
    buildDeck(result());
    setFlipped(false);
    $('deck-count').textContent = deckCount();
    // Swap the face once the card has turned face down.
    timers.deal = setTimeout(() => { $('kfront').innerHTML = `<span class="kart">${cardFront(deck.cards[0])}</span>`; }, 720);
  },
  retake: () => go({ s: 'intro', qi: 0, answers: EMPTY() })
};

scroller.addEventListener('click', e => {
  const btn = e.target.closest('[data-act]');
  if (btn && actions[btn.dataset.act]) actions[btn.dataset.act](btn);
});
scroller.addEventListener('input', e => {
  if (e.target.id === 'f-name') state.name = e.target.value;
  else if (e.target.id === 'f-email') state.email = e.target.value;
  else return;
  clearErrors();
});
scroller.addEventListener('submit', e => { e.preventDefault(); submit(); });

// ---------- Boot ----------
// ?preview=<state> pins the quiz to one screen (used by screens.html).
const PREVIEWS = {
  age: { s: 'age' }, leave: { s: 'leave' }, intro: { s: 'intro' },
  q1: { s: 'q', qi: 0, answers: [3].concat(Array(8).fill(null)) },
  q6: { s: 'q', qi: 5, answers: DEMO.slice(0, 5).concat([null, null, null, null]) },
  inter: { s: 'inter', answers: DEMO.slice(0, 5).concat([null, null, null, null]) },
  lead: { s: 'lead', answers: DEMO.slice() },
  results: { s: 'results', answers: DEMO.slice(), name: 'Alex', email: 'alex@example.com', age21: true, submitted: true }
};
const preview = PREVIEWS[new URLSearchParams(window.location.search).get('preview')];
if (preview) Object.assign(state, preview);
render(!!preview);
})();
