/* app.js
   - stitches /notes/*.md into one page
   - runs MathJax before measuring animations
   - animates nested collapsibles (details.collapsible)
   - theme toggle (uses html[data-theme] and localStorage)
*/

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
  
  /* Load markdown files and inject them. Run MathJax typesetting BEFORE initializing animated details */
  async function loadAll() {
    const parts = await Promise.all(ORDERED_NOTES.map(async ({file, title}, idx) => {
      try {
        const res = await fetch(`notes/${file}`);
        if (!res.ok) {
          return `<section class="note-section"><h1>${title}</h1><blockquote>⚠️ Could not load ${file} (${res.status})</blockquote></section>`;
        }
        const md = await res.text();
        const sectionId = slug(`${idx+1}-${title}`);
        // Prepend a section header so each file yields a top-level heading
        const html = marked.parse(`# ${title}\n\n` + md);
        return `<section id="${sectionId}" class="note-section">${html}</section>`;
      } catch (err) {
        return `<section class="note-section"><h1>${title}</h1><blockquote>⚠️ Could not fetch ${file}</blockquote></section>`;
      }
    }));
  
    const el = contentEl();
    el.innerHTML = parts.join("\n");
  
    // Typeset equations first (so heights measured correctly)
    if (window.MathJax?.typesetPromise) {
      try { await MathJax.typesetPromise([el]); } catch(e){ console.warn('MathJax typeset error', e); }
    }
  
    buildToc();
    initAnimatedDetails();
  }
  
  /* Build a compact TOC from the injected sections */
  function buildToc() {
    const el = contentEl();
    const sections = Array.from(el.querySelectorAll('.note-section > h1'));
    if (!sections.length) { tocEl().innerHTML = ''; return; }
    const links = sections.map(h => {
      const sec = h.closest('section');
      return `<a href="#${sec.id}">${escapeHtml(h.textContent)}</a>`;
    });
    tocEl().innerHTML = `<div class="toc-list">${links.join('')}</div>`;
  }
  
  /* escape text for safety */
  function escapeHtml(s){ return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;'); }
  
  function slug(s){ return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''); }
  
  /* Smooth animated details handling for nested collapsibles */
  function initAnimatedDetails(){
    // Find all details.collapsible
    const DETAILS = document.querySelectorAll('details.collapsible');
    DETAILS.forEach(d => {
      // Ensure each has an inner wrapper; if not present, create one around the inner HTML (compatibility)
      let inner = d.querySelector('.collapsible__content');
      if (!inner) {
        // wrap everything except the summary into a div.collapsible__content
        inner = document.createElement('div');
        inner.className = 'collapsible__content';
        // move nodes
        const nodes = [];
        for (const n of Array.from(d.childNodes)) {
          if (n.nodeName && n.nodeName.toLowerCase() === 'summary') continue;
          nodes.push(n);
        }
        nodes.forEach(n => inner.appendChild(n));
        d.appendChild(inner);
      }
  
      // Setup toggle animation
      d.addEventListener('toggle', () => {
        if (d.open) {
          // measure and animate to height
          inner.style.blockSize = `${inner.scrollHeight}px`;
          inner.addEventListener('transitionend', function handler() {
            inner.style.blockSize = 'auto'; // after expand, allow auto height
            inner.removeEventListener('transitionend', handler);
          });
        } else {
          // collapse: set explicit height then to 0 to animate
          inner.style.blockSize = `${inner.scrollHeight}px`;
          requestAnimationFrame(() => {
            inner.style.blockSize = `0px`;
          });
        }
      });
  
      // if pre-open, set to auto after small delay (to allow typeset to finish)
      if (d.hasAttribute('open')) {
        inner.style.blockSize = `${inner.scrollHeight}px`;
        setTimeout(() => { inner.style.blockSize = 'auto'; }, 200);
      }
    });
  }
  
  /* ----------------
     Theme toggle handling
     ---------------- */
  function getCurrentTheme(){
    return document.documentElement.getAttribute('data-theme') || 'light';
  }
  function setTheme(theme, btnEl) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch(e){}
    updateToggleIcon(theme, btnEl);
  }
  function updateToggleIcon(theme, btnEl){
    if (!btnEl) return;
    if (theme === 'dark') {
      btnEl.textContent = '🌙';
      btnEl.setAttribute('aria-pressed','true');
      btnEl.title = 'Switch to light theme';
    } else {
      btnEl.textContent = '☀️';
      btnEl.setAttribute('aria-pressed','false');
      btnEl.title = 'Switch to dark theme';
    }
  }
  
  /* Initialize on DOMContentLoaded */
  document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = $id('themeToggle');
  
    // show correct icon immediately
    updateToggleIcon(getCurrentTheme(), themeToggleBtn);
  
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const cur = getCurrentTheme();
        const nxt = (cur === 'dark') ? 'light' : 'dark';
        setTheme(nxt, themeToggleBtn);
      });
    }
  
    // Now load all notes
    loadAll().catch(err => console.error(err));
  });
  