/* app.js - robust collapsibles + auto-numbered callouts
   - ensures raw HTML details/summary in Markdown render
   - typesets MathJax before measuring heights
   - animates using height (works reliably for nested details)
   - auto-number callouts per section
*/

/* Allow Marked to handle raw HTML; prefer conservative options */
marked.setOptions({
    gfm: true,
    breaks: false,
    headerIds: false,
    mangle: false
  });
  
  const ORDERED_NOTES = [
    { file: "setfamilies.md",           title: "Families of Sets" },
    { file: "measure.md",               title: "Measures & Measurability" },
    { file: "integration.md",           title: "Lebesgue Integration" },
    { file: "productspaces.md",         title: "Product Spaces" },
    { file: "independence.md",          title: "Independence" },
    { file: "convergence.md",           title: "Convergence" },
    { file: "conditionalexpectation.md",title: "Conditional Expectation" },
    { file: "_fragments.md",            title: "Fragments / Scratch" }
  ];
  
  function $id(id){ return document.getElementById(id); }
  const contentEl = () => $id('content');
  const tocEl = () => $id('toc');
  
  /* Utility: attempt to unescape user-written HTML tags that got escaped by some Markdown variants.
     We only unescape a small, safe set: details, summary, div (with class), span, /div, /details, /summary.
     This prevents the literal HTML from being displayed as text.
  */
  function unescapeFragmentHtml(html) {
    // If there's no &lt; there is nothing to do
    if (!html.includes('&lt;')) return html;
  
    // targeted replacements (order matters)
    const map = [
      [/&lt;details/gi, '<details'],
      [/&lt;\/details&gt;/gi, '</details>'],
      [/&lt;summary/gi, '<summary'],
      [/&lt;\/summary&gt;/gi, '</summary>'],
      [/&lt;div class="collapsible__content"&gt;/gi, '<div class="collapsible__content">'],
      [/&lt;div class="callout/gi, '<div class="callout'],
      [/&lt;\/div&gt;/gi, '</div>'],
      [/&lt;span class="label"&gt;/gi, '<span class="label">'],
      [/&lt;\/span&gt;/gi, '</span>']
    ];
    let out = html;
    map.forEach(([re, repl]) => { out = out.replace(re, repl); });
    return out;
  }
  
  /* Load notes, parse with Marked, then insert. */
  async function loadAll() {
    const parts = await Promise.all(ORDERED_NOTES.map(async ({file, title}, idx) => {
      try {
        const res = await fetch(`notes/${file}`);
        if (!res.ok) {
          return `<section class="note-section" data-sec="${idx+1}"><h1>${title}</h1><blockquote>⚠️ Could not load ${file} (${res.status})</blockquote></section>`;
        }
        let md = await res.text();
  
        // If user put raw HTML but it was accidentally escaped in the file,
        // try to unescape the most common fragments (safe, targeted).
        // This helps when editors or previous parsers escape the details tags.
        md = md.replace(/\r\n/g, '\n');
  
        // First, convert markdown to HTML
        let html = marked.parse(md);
  
        // If marked left some &lt;details as escaped text, restore them for a small safe set:
        html = unescapeFragmentHtml(html);
  
        // Wrap this file as a top-level section with a data-sec index
        return `<section id="sec-${idx+1}" class="note-section" data-sec="${idx+1}"><h1>${title}</h1>${html}</section>`;
      } catch (err) {
        return `<section class="note-section" data-sec="${idx+1}"><h1>${title}</h1><blockquote>⚠️ Could not fetch ${file}</blockquote></section>`;
      }
    }));
  
    const el = contentEl();
    el.innerHTML = parts.join('\n');
  
    // Typeset MathJax first so accurate heights can be measured for animations
    if (window.MathJax?.typesetPromise) {
      try { await MathJax.typesetPromise([el]); } catch (e) { console.warn('MathJax typeset failed', e); }
    }
  
    buildToc();
    initAnimatedDetails();
    autoNumberCallouts();
  }
  
  /* TOC builder */
  function buildToc() {
    const el = contentEl();
    const sections = Array.from(el.querySelectorAll('.note-section > h1'));
    if (!sections.length) { tocEl().innerHTML = ''; return; }
    const links = sections.map(h => `<a href="#${h.parentElement.id}">${escapeHtml(h.textContent)}</a>`);
    tocEl().innerHTML = `<div class="toc-list">${links.join('')}</div>`;
  }
  function escapeHtml(s){ return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;'); }
  
  /* Animate details using height; create inner wrapper if missing.
     Works with nested <details class="collapsible"> elements.
  */
  function initAnimatedDetails(){
    // Query all details with the 'collapsible' class, including nested ones
    const DETAILS = document.querySelectorAll('details.collapsible');
  
    DETAILS.forEach(d => {
      // ensure there is a summary element (some authors might leave it out by mistake)
      let summary = d.querySelector('summary');
      if (!summary) {
        summary = document.createElement('summary');
        summary.textContent = 'Details';
        d.insertBefore(summary, d.firstChild);
      }
  
      // find or create wrapper .collapsible__content around all non-summary children
      let inner = d.querySelector('.collapsible__content');
      if (!inner) {
        inner = document.createElement('div');
        inner.className = 'collapsible__content';
  
        // Move all non-summary child nodes into inner
        const nodes = Array.from(d.childNodes).filter(n => !(n.nodeType === 1 && n.tagName.toLowerCase() === 'summary'));
        nodes.forEach(n => inner.appendChild(n));
        d.appendChild(inner);
      }
  
      // Set initial CSS states for inner for smoother transitions
      inner.style.overflow = 'hidden';
      if (d.hasAttribute('open')) {
        // set explicit height to content height then set to auto after a tick
        inner.style.height = inner.scrollHeight + 'px';
        // let other onload tasks complete before making auto
        setTimeout(() => { inner.style.height = 'auto'; }, 220);
      } else {
        inner.style.height = '0px';
      }
  
      // Toggle handler
      d.addEventListener('toggle', () => {
        if (d.open) {
          // expanding:
          inner.style.height = inner.scrollHeight + 'px';
          const onEnd = function () {
            inner.style.height = 'auto';
            inner.removeEventListener('transitionend', onEnd);
          };
          inner.addEventListener('transitionend', onEnd);
        } else {
          // collapsing: set current px height then animate to 0
          const cur = inner.scrollHeight;
          inner.style.height = cur + 'px';
          // next frame -> 0
          requestAnimationFrame(() => { inner.style.height = '0px'; });
        }
      });
    });
  }
  
  /* Auto-numbering of callouts per-section, per-type
     Example: Definition 1.1, Proposition 1.2, Lemma 2.1 in section 2, ...
  */
  function autoNumberCallouts() {
    const sections = document.querySelectorAll('.note-section');
    sections.forEach(sec => {
      const secIndex = sec.getAttribute('data-sec') || (() => {
        // fallback: derive from id like "sec-3"
        const id = sec.id || '';
        const m = id.match(/sec-(\d+)/);
        return m ? m[1] : '0';
      })();
  
      const types = ['definition','proposition','lemma','theorem','remark','corollary'];
      const counters = types.reduce((acc,t) => (acc[t]=0, acc), {});
  
      // find any element with class 'callout'
      const callouts = Array.from(sec.querySelectorAll('.callout'));
      callouts.forEach(c => {
        for (const t of types) {
          if (c.classList.contains(t)) {
            counters[t]++;
            const num = `${secIndex}.${counters[t]}`;
            const label = c.querySelector('.label');
            if (label) {
              label.textContent = `${capitalize(t)} ${num}`;
            }
            // add an id so cross-references can link to it later
            if (!c.id) c.id = `${t}-${secIndex}-${counters[t]}`;
            break;
          }
        }
      });
    });
  }
  function capitalize(s){ return s.charAt(0).toUpperCase() + s.slice(1); }
  
  /* Theme toggle (unchanged) */
  function getCurrentTheme(){ return document.documentElement.getAttribute('data-theme') || 'light'; }
  function setTheme(theme, btnEl){
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch(e){}
    if (btnEl) {
      if (theme === 'dark') { btnEl.textContent = '🌙'; btnEl.setAttribute('aria-pressed','true'); }
      else { btnEl.textContent = '☀️'; btnEl.setAttribute('aria-pressed','false'); }
    }
  }
  
  /* DOM ready bootstrap */
  document.addEventListener('DOMContentLoaded', () => {
    const btn = $id('themeToggle');
    if (btn) {
      // show initial icon
      setTheme(getCurrentTheme(), btn);
      btn.addEventListener('click', () => setTheme(getCurrentTheme() === 'dark' ? 'light' : 'dark', btn));
    }
    loadAll().catch(e=>console.error(e));
  });
  