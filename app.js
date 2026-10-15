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
const DATE_QS = ['What makes you feel the most loved by me?', 'What does good aftercare look like for you?', 'Is there anything you’ve wanted to ask for but felt nervous about?'];
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
    langName: lk.map(k => LANG[k].name).join(' + '), langDesc: L1.desc,
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
            ${DATE_QS.map((q, i) => `<div class="date-q"><span class="n">${['I', 'II', 'III'][i]}</span><span class="q">${q}</span></div>`).join('')}
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

function render(allBgs) {
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
