/* app.js
   - stitches /notes/*.md into one page
   - allows raw HTML inside Markdown
   - smooth collapsibles
   - auto-numbering of callouts by section
   - theme toggle
*/

marked.setOptions({
    mangle: false,
    headerIds: false,
    breaks: false
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
  
  async function loadAll() {
    const parts = await Promise.all(ORDERED_NOTES.map(async ({file, title}, idx) => {
      try {
        const res = await fetch(`notes/${file}`);
        if (!res.ok) {
          return `<section class="note-section" data-sec="${idx+1}">
            <h1>${title}</h1><blockquote>⚠️ Could not load ${file} (${res.status})</blockquote></section>`;
        }
        const md = await res.text();
        const html = marked.parse(md);
        return `<section id="sec-${idx+1}" class="note-section" data-sec="${idx+1}">
          <h1>${title}</h1>${html}</section>`;
      } catch (err) {
        return `<section class="note-section" data-sec="${idx+1}">
          <h1>${title}</h1><blockquote>⚠️ Could not fetch ${file}</blockquote></section>`;
      }
    }));
  
    const el = contentEl();
    el.innerHTML = parts.join("\n");
  
    // typeset math
    if (window.MathJax?.typesetPromise) {
      try { await MathJax.typesetPromise([el]); } catch(e){}
    }
  
    buildToc();
    initAnimatedDetails();
    autoNumberCallouts();
  }
  
  function buildToc() {
    const el = contentEl();
    const sections = Array.from(el.querySelectorAll('.note-section > h1'));
    const links = sections.map((h,i) => `<a href="#${h.parentElement.id}">${h.textContent}</a>`);
    tocEl().innerHTML = `<div class="toc-list">${links.join('')}</div>`;
  }
  
  function slug(s){ return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''); }
  
  function initAnimatedDetails(){
    const DETAILS = document.querySelectorAll('details.collapsible');
    DETAILS.forEach(d => {
      let inner = d.querySelector('.collapsible__content');
      if (!inner) {
        inner = document.createElement('div');
        inner.className = 'collapsible__content';
        const nodes = [];
        for (const n of Array.from(d.childNodes)) {
          if (n.tagName && n.tagName.toLowerCase() === 'summary') continue;
          nodes.push(n);
        }
        nodes.forEach(n => inner.appendChild(n));
        d.appendChild(inner);
      }
  
      d.addEventListener('toggle', () => {
        if (d.open) {
          inner.style.blockSize = `${inner.scrollHeight}px`;
          inner.addEventListener('transitionend', function handler() {
            inner.style.blockSize = 'auto';
            inner.removeEventListener('transitionend', handler);
          });
        } else {
          inner.style.blockSize = `${inner.scrollHeight}px`;
          requestAnimationFrame(() => inner.style.blockSize = '0px');
        }
      });
  
      if (d.hasAttribute('open')) {
        inner.style.blockSize = `${inner.scrollHeight}px`;
        setTimeout(() => { inner.style.blockSize = 'auto'; }, 200);
      }
    });
  }
  
  /* Auto-number callouts per section */
  function autoNumberCallouts() {
    const sections = document.querySelectorAll('.note-section');
    sections.forEach(sec => {
      const secIndex = sec.getAttribute('data-sec');
      const counters = { definition:0, proposition:0, lemma:0, theorem:0, remark:0, corollary:0 };
      sec.querySelectorAll('.callout').forEach(c => {
        for (const type in counters) {
          if (c.classList.contains(type)) {
            counters[type]++;
            const num = `${secIndex}.${counters[type]}`;
            const label = c.querySelector('.label');
            if (label) {
              label.textContent = `${capitalize(type)} ${num}`;
            }
          }
        }
      });
    });
  }
  function capitalize(s){ return s.charAt(0).toUpperCase()+s.slice(1); }
  
  /* Theme toggle */
  function getCurrentTheme(){ return document.documentElement.getAttribute('data-theme') || 'light'; }
  function setTheme(theme, btnEl){
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch(e){}
    updateToggleIcon(theme, btnEl);
  }
  function updateToggleIcon(theme, btnEl){
    if (!btnEl) return;
    if (theme==='dark'){ btnEl.textContent='🌙'; btnEl.setAttribute('aria-pressed','true'); }
    else { btnEl.textContent='☀️'; btnEl.setAttribute('aria-pressed','false'); }
  }
  
  /* DOM Ready */
  document.addEventListener('DOMContentLoaded', () => {
    const btn = $id('themeToggle');
    updateToggleIcon(getCurrentTheme(), btn);
    btn.addEventListener('click', () => {
      const cur=getCurrentTheme();
      setTheme(cur==='dark'?'light':'dark', btn);
    });
    loadAll();
  });
  