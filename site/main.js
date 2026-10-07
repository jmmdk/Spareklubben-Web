(() => {
  'use strict';

  const SITE_URL = 'https://spareklubben.app';
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const STORAGE_KEY = 'sk-waitlist';

  const CATS = {
    el: ['El', 'M13 2.5 4.5 13.5h6.5l-1 8 8.5-11h-6.5l1-8z'],
    streaming: ['Streaming', 'M5 6.5h14a2.5 2.5 0 0 1 2.5 2.5v8a2.5 2.5 0 0 1-2.5 2.5H5A2.5 2.5 0 0 1 2.5 17V9A2.5 2.5 0 0 1 5 6.5zM8.5 2.5 12 6l3.5-3.5'],
    dagligvarer: ['Dagligvarer', 'M2.5 3.5h2.2l2.3 11h11l2-7.5H6M10.5 19.5a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0zM18 19.5a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0z'],
    forsikring: ['Forsikring', 'M12 2.75 4.5 5.5v6c0 4.6 3.2 8.4 7.5 9.75 4.3-1.35 7.5-5.15 7.5-9.75v-6L12 2.75zM8.75 12l2.25 2.25 4.25-4.5'],
    skat: ['Skat & fradrag', 'M6 2.75h12v18.5l-2.5-1.75-2 1.75-1.5-1.25-1.5 1.25-2-1.75L6 21.25V2.75zM9 7.5h6M9 11h6M9 14.5h3.5'],
    mad: ['Mad & madspild', 'M19.5 4.5c-9 0-14.5 4.2-14.5 10.5 0 1.9.6 3.5 1.5 4.6M19.5 4.5c0 9.5-3 15-9 15-1.5 0-2.9-.4-4-1.1M19.5 4.5 9 15']
  };

  // img: valgfri sti til et foto (fx '/img/tips/1.webp', ~660px bredt). Uden img vises et mønstret felt i kategoriens farve.
  const TIPS = [
    {id: 1, cat: 'el', type: 'Hack', validity: 'Altid', effort: '5 min', amount: 1200, unit: 'kr/år', size: 'M', title: 'Flyt opvask og vask til om natten med timepris på el', score: 412, comments: 38, works: 91, photo: 'opvaskemaskine om natten', author: {name: 'Mette K.', initials: 'MK', tone: 'forsikring'}},
    {id: 2, cat: 'streaming', type: 'Vane', validity: 'Altid', effort: '5 min', amount: 1500, unit: 'kr/år', size: 'M', title: 'Hav kun én streamingtjeneste ad gangen – skift når serien er set', score: 356, comments: 52, works: 84, photo: 'fjernbetjening og tv', author: {name: 'Jonas B.', initials: 'JB', tone: 'mad'}},
    {id: 3, cat: 'dagligvarer', type: 'Deal', validity: '3 dage tilbage', expiring: true, effort: '2 min', amount: 60, unit: 'kr', size: 'S', title: '3 for 2 på kaffe – gælder til og med søndag', score: 98, comments: 12, works: 96, photo: 'kaffeposer på hylde', author: {name: 'Sara L.', initials: 'SL', tone: 'skat'}},
    {id: 4, cat: 'forsikring', type: 'Skift', validity: 'Altid', effort: '30 min', amount: 2000, unit: 'kr/år', size: 'L', title: 'Ring og bed om en ny pris på din bilforsikring hvert år', score: 287, comments: 24, works: 79, photo: 'bilnøgler og telefon', author: {kind: 'anon', name: 'Anonym sparer'}},
    {id: 5, cat: 'skat', type: 'Rettighed', validity: 'Altid', effort: '15 min', amount: 3500, unit: 'kr/år', size: 'L', title: 'Tjek om du kan få befordringsfradrag – over 24 km tur/retur om dagen', score: 241, comments: 17, works: 88, photo: 'pendler i tog', author: {kind: 'editor', name: 'Spareklubben-redaktionen'}},
    {id: 6, cat: 'mad', type: 'Hack', validity: 'Altid', effort: '5 min', amount: 2400, unit: 'kr/år', size: 'L', title: 'Køb overskudsmad fra bagere og butikker via apps – aftensmad til en brøkdel', score: 199, comments: 29, works: 90, photo: 'bagerpose med brød', author: {name: 'Ali R.', initials: 'AR', tone: 'streaming'}},
    {id: 7, cat: 'dagligvarer', type: 'Rabat', validity: 'Altid', effort: '5 min', amount: 10, upTo: true, unit: '%', size: 'M', title: 'Få penge tilbage på dine indkøb med supermarkedets medlemsapp', score: 174, comments: 21, works: 93, photo: 'indkøbskurv', author: {name: 'Hanne M.', initials: 'HM', tone: 'el'}},
    {id: 9, cat: 'el', type: 'Vane', validity: 'Altid', effort: '2 min', amount: 300, unit: 'kr/år', size: 'S', title: 'Sluk standby på tv og konsol med en stikdåse med afbryder', score: 88, comments: 6, works: 89, photo: 'stikdåse med afbryder', author: {kind: 'editor', name: 'Spareklubben-redaktionen'}}
  ];

  const SIZE_WORD = {S: 'Lille', M: 'Mellem', L: 'Stor'};
  const ICON = {
    clock: 'M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17zM12 7.5V12l3 2',
    tag: 'M3.5 12.5V4.5a1 1 0 0 1 1-1h8l8 8-9 9-8-8zM8 8h.01',
    calendar: 'M5 5.5h14a1.5 1.5 0 0 1 1.5 1.5v12a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 19V7A1.5 1.5 0 0 1 5 5.5zM3.5 10h17M8 3v4M16 3v4',
    alert: 'M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17zM12 8v4.5M12 16h.01',
    check: 'M5 12.5l4.5 4.5L19 7.5',
    up: 'M6 15l6-6 6 6',
    down: 'M6 9l6 6 6-6',
    comment: 'M4.5 5.5h15a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H10l-4.5 3.5v-3.5h-1a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1z',
    save: 'M6.5 3.5h11v17l-5.5-4-5.5 4z',
    share: 'M12 3v12M7.5 7.5 12 3l4.5 4.5M5 12v7.5h14V12'
  };

  const n = x => Number(x).toLocaleString('da-DK');
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
  const svg = (d, size, sw) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" class="ico" style="stroke-width:${sw}" aria-hidden="true"><path d="${d}"/></svg>`;
  const $ = (sel, root = document) => root.querySelector(sel);

  function fmtAmount(t) {
    if (t.unit === '%') return {prefix: t.upTo ? 'op til' : '', value: n(t.amount), unit: '%'};
    return {prefix: 'ca.', value: n(t.amount || 0), unit: t.unit};
  }

  function tipCard(t, headingTag) {
    const [catLabel, catIcon] = CATS[t.cat] || CATS.el;
    const catBg = `var(--cat-${t.cat}-bg)`, catFg = `var(--cat-${t.cat}-fg)`;
    const a = t.author || {};
    const kind = a.kind || 'user';
    const avText = kind === 'anon' ? 'AS' : kind === 'editor' ? 'SP' : (a.initials || '');
    const avBg = kind === 'editor' ? 'var(--primary)' : kind === 'anon' ? 'var(--surface2)' : `var(--cat-${a.tone || 'el'}-bg)`;
    const avFg = kind === 'editor' ? 'var(--on-primary)' : kind === 'anon' ? 'var(--text2)' : `var(--cat-${a.tone || 'el'}-fg)`;
    const am = fmtAmount(t);
    const lvl = {S: 1, M: 2, L: 3}[t.size] || 1;
    const bars = [6, 9, 12].map((h, i) => `<span style="height:${h}px;opacity:${i < lvl ? 1 : 0.3}"></span>`).join('');
    const banner = `<div class="tip-banner" style="background:repeating-linear-gradient(135deg,${catBg} 0 12px,var(--surface2) 12px 13px);color:${catFg}">`
      + (t.img ? `<img src="${esc(t.img)}" alt="${esc(t.photo || '')}" loading="lazy" width="660" height="264">` : `<svg width="34" height="34" viewBox="0 0 24 24" class="ico" style="stroke-width:1.6" aria-hidden="true"><path d="${catIcon}"/></svg>`)
      + '</div>';
    return `<article class="tip">${banner}
      <div class="tip-body">
        <div class="tip-meta">
          <span class="chip" style="background:${catBg};color:${catFg}">${svg(catIcon, 16, 2)}<span>${esc(catLabel)}</span></span>
          ${t.expiring ? '<span class="chip chip-limited">Tidsbegrænset</span>' : ''}
          <span class="author"><span class="author-av" style="background:${avBg};color:${avFg}" aria-hidden="true">${esc(avText)}</span><span class="author-name">${esc(a.name || '')}</span></span>
        </div>
        <${headingTag} class="tip-title">${esc(t.title)}</${headingTag}>
        <div class="tip-amount">
          ${am.prefix ? `<span class="tip-prefix">${am.prefix}</span>` : ''}
          <span class="tip-value">${am.value}</span>
          <span class="tip-unit">${am.unit}</span>
          <span class="size" aria-label="Besparelse: ${SIZE_WORD[t.size] || ''}"><span class="size-bars" aria-hidden="true">${bars}</span><span aria-hidden="true">${SIZE_WORD[t.size] || ''}</span></span>
        </div>
        <div class="tip-full">
          <div class="tip-facts">
            <span>${svg(ICON.clock, 16, 2)}${esc(t.effort)}</span>
            <span>${svg(ICON.tag, 16, 2)}${esc(t.type)}</span>
            <span class="${t.expiring ? 'expiring' : ''}">${svg(t.expiring ? ICON.alert : ICON.calendar, 16, 2)}${esc(t.validity)}</span>
          </div>
          ${t.works != null ? `<div class="tip-works">${svg(ICON.check, 16, 2.2)}<span>${t.works} % siger det virker stadig</span></div>` : ''}
          <div class="tip-actions" aria-hidden="true">
            <span class="tip-score"><span class="tip-act">${svg(ICON.up, 20, 2.4)}</span><span>${t.score}</span><span class="tip-act">${svg(ICON.down, 20, 2.4)}</span></span>
            <span class="tip-comments">${svg(ICON.comment, 20, 2)}${t.comments}</span>
            <span class="spacer"></span>
            <span class="tip-act">${svg(ICON.save, 20, 2)}</span>
            <span class="tip-act">${svg(ICON.share, 20, 2)}</span>
          </div>
        </div>
      </div>
    </article>`;
  }

  /* Problemet: eksempelkort */
  const problemCard = $('#problem-card');
  if (problemCard) problemCard.innerHTML = tipCard(TIPS[0], 'h3');

  /* Eksempler: uendelig karrusel (listen duplikeres; anden halvdel er aria-hidden) */
  const marquee = $('#marquee'), track = $('#marquee-track');
  if (marquee && track) {
    const slot = (t, hidden) => `<div class="tip-slot"${hidden ? ' aria-hidden="true"' : ''}>${tipCard(t, 'h3')}</div>`;
    track.innerHTML = TIPS.map(t => slot(t, false)).join('') + TIPS.map(t => slot(t, true)).join('');
    track.querySelectorAll('[aria-hidden="true"] h3').forEach(h => h.outerHTML = h.outerHTML.replace(/^<h3/, '<div').replace(/h3>$/, 'div>'));
    // 0,35 px pr. frame ved 60 fps ≈ 21 px/s
    const setDuration = () => {
      const half = track.scrollWidth / 2;
      marquee.style.setProperty('--marquee-dur', `${(half / 21).toFixed(1)}s`);
    };
    setDuration();
    window.addEventListener('resize', setDuration);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(setDuration);
    marquee.classList.add('is-running');
    const pause = () => marquee.classList.add('is-paused');
    const resume = () => marquee.classList.remove('is-paused');
    marquee.addEventListener('touchstart', pause, {passive: true});
    marquee.addEventListener('touchend', resume);
    marquee.addEventListener('touchcancel', resume);
  }

  /* "Virker det stadig?"-afstemning */
  const voteBtns = document.querySelectorAll('.vote-btn');
  let myVote = null;
  const renderVote = () => {
    const answers = 142 + (myVote ? 1 : 0);
    const yes = 129 + (myVote === 'yes' ? 1 : 0);
    const pct = Math.round(yes / answers * 100);
    $('#vote-bar').style.width = `${pct}%`;
    $('#vote-pct').textContent = `${pct} % ja`;
    $('#vote-count').textContent = `${answers} svar`;
    voteBtns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.vote === myVote)));
  };
  voteBtns.forEach(b => b.addEventListener('click', () => {
    myVote = myVote === b.dataset.vote ? null : b.dataset.vote;
    renderVote();
  }));

  /* Beregner */
  const calcList = $('#calc-list');
  if (calcList) {
    const CALC = TIPS.filter(t => t.unit === 'kr/år' && t.id !== 9);
    const selected = new Set([1, 2, 4]);
    calcList.innerHTML = CALC.map(t => `<button type="button" class="calc-item" data-id="${t.id}" aria-pressed="${selected.has(t.id)}">
        <span class="calc-box" aria-hidden="true">${svg(ICON.check, 15, 3)}</span>
        <span class="calc-cat" style="background:var(--cat-${t.cat}-bg);color:var(--cat-${t.cat}-fg)" aria-hidden="true">${svg(CATS[t.cat][1], 18, 2)}</span>
        <span class="calc-label">${esc(t.title)}</span>
        <span class="calc-amount">${n(t.amount)} kr</span>
      </button>`).join('');
    const renderCalc = () => {
      const sel = CALC.filter(t => selected.has(t.id));
      const total = sel.reduce((s, t) => s + t.amount, 0);
      const mins = sel.reduce((s, t) => s + parseInt(t.effort, 10), 0);
      $('#calc-total').textContent = n(total);
      $('#calc-note').textContent = sel.length
        ? `med ${sel.length} ${sel.length === 1 ? 'tip' : 'tips'}, der tilsammen tager ca. ${mins} minutter at sætte i gang.`
        : 'Vælg et eller flere tips til venstre.';
    };
    calcList.addEventListener('click', e => {
      const btn = e.target.closest('.calc-item');
      if (!btn) return;
      const id = Number(btn.dataset.id);
      selected.has(id) ? selected.delete(id) : selected.add(id);
      btn.setAttribute('aria-pressed', String(selected.has(id)));
      renderCalc();
    });
    renderCalc();
  }

  /* FAQ: kun én åben ad gangen */
  const faqButtons = document.querySelectorAll('#faq-list button[aria-expanded]');
  faqButtons.forEach(btn => btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') !== 'true';
    faqButtons.forEach(b => {
      const on = b === btn && open;
      b.setAttribute('aria-expanded', String(on));
      document.getElementById(b.getAttribute('aria-controls')).hidden = !on;
    });
  }));

  /* Venteliste (Formspree) */
  const forms = document.querySelectorAll('form.js-waitlist');
  const heroForm = $('form[data-source="hero"]'), mainForm = $('form[data-source="bottom"]');
  const heroMsg = $('#hero-msg'), mainMsg = $('#main-msg');
  const MAIN_DEFAULT = mainMsg ? mainMsg.textContent : '';
  const joinedBox = $('#joined');

  const store = {
    get() { try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; } },
    set(v) { try { localStorage.setItem(STORAGE_KEY, v); } catch (e) { /* ignorer */ } },
    clear() { try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* ignorer */ } }
  };

  const setMsg = (el, text, isError) => {
    if (!el) return;
    el.textContent = text;
    el.classList.toggle('is-error', !!isError);
  };

  const setJoined = (email, focus) => {
    $('.js-label', heroForm).textContent = 'Du er på listen';
    $('.js-label', mainForm).textContent = 'Skriv mig op';
    setMsg(heroMsg, 'Tak! Vi giver besked, når appen er klar.');
    $('#joined-email').textContent = email;
    mainForm.hidden = true;
    joinedBox.hidden = false;
    if (focus) $('#joined-title').focus({preventScroll: true});
  };

  const resetJoined = () => {
    store.clear();
    forms.forEach(f => { f.reset(); $('input[type="email"]', f).removeAttribute('aria-invalid'); });
    $('.js-label', heroForm).textContent = 'Skriv mig op';
    setMsg(heroMsg, '');
    setMsg(mainMsg, MAIN_DEFAULT);
    joinedBox.hidden = true;
    mainForm.hidden = false;
    $('input[type="email"]', mainForm).focus();
  };

  const scrollToWaitlist = () => {
    const el = $('#venteliste');
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: reduce ? 'auto' : 'smooth'});
  };

  const saved = store.get();
  if (saved) setJoined(saved, false);

  forms.forEach(form => {
    const input = $('input[type="email"]', form);
    const btn = $('button[type="submit"]', form);
    const label = $('.js-label', form);
    const msgEl = form === heroForm ? heroMsg : mainMsg;
    let busy = false;

    input.addEventListener('input', () => {
      if (input.getAttribute('aria-invalid') === 'true') {
        input.removeAttribute('aria-invalid');
        setMsg(msgEl, form === mainForm ? MAIN_DEFAULT : '');
      }
    });

    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (busy) return;
      const email = input.value.trim();
      if (!EMAIL_RE.test(email)) {
        input.setAttribute('aria-invalid', 'true');
        setMsg(msgEl, 'Skriv en gyldig e-mail, fx navn@mail.dk', true);
        input.focus();
        return;
      }
      busy = true;
      const prevLabel = label.textContent;
      btn.setAttribute('aria-busy', 'true');
      label.textContent = 'Sender…';
      try {
        const data = new FormData(form);
        data.set('email', email);
        data.set('_subject', 'Ny tilmelding til Spareklubbens venteliste');
        const res = await fetch(form.action, {method: 'POST', body: data, headers: {Accept: 'application/json'}});
        if (!res.ok) {
          let body = null;
          try { body = await res.json(); } catch (x) { /* ignorer */ }
          const errs = (body && body.errors) || [];
          if (errs.some(er => er.field === 'email')) {
            input.setAttribute('aria-invalid', 'true');
            setMsg(msgEl, 'Skriv en gyldig e-mail, fx navn@mail.dk', true);
            label.textContent = prevLabel;
            return;
          }
          throw new Error('Formspree ' + res.status);
        }
        // Dubletter accepteres af Formspree og behandles derfor som succes.
        store.set(email);
        forms.forEach(f => { $('input[type="email"]', f).value = email; });
        setJoined(email, form === mainForm);
        if (form === heroForm) scrollToWaitlist();
      } catch (err) {
        label.textContent = prevLabel;
        setMsg(msgEl, 'Noget gik galt. Prøv igen om lidt, eller skriv til hej@spareklubben.app.', true);
      } finally {
        busy = false;
        btn.removeAttribute('aria-busy');
      }
    });
  });

  const copyBtn = $('#copy-link');
  if (copyBtn) {
    let t;
    copyBtn.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(SITE_URL); } catch (e) { /* ignorer */ }
      $('#copy-label').textContent = 'Link kopieret';
      clearTimeout(t);
      t = setTimeout(() => { $('#copy-label').textContent = 'Kopiér link til spareklubben.app'; }, 2000);
    });
  }
  const resetBtn = $('#reset-join');
  if (resetBtn) resetBtn.addEventListener('click', resetJoined);
})();
