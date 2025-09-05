/* app.js
   - loads notes from /notes/*.md into a single page
   - sets up smooth collapsibles
   - initializes theme toggle (fixed)
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
  
  const contentEl = () => document.getElementById('content');
  const tocEl = () => document.getElementById('toc');
  
  /* Load and stitch markdown files */
  async function loadAll() {
    const parts = await Promise.all(ORDERED_NOTES.map(async ({file, title}, idx) => {
      try {
        const res = await fetch(`notes/${file}`);
        if (!res.ok) {
          return `<section class="note-section"><h1>${title}</h1><blockquote>⚠️ Could not load ${file} (${res.status})</blockquote></section>`;
        }
        const md = await res.text();
        const sectionId = slug(`${idx+1}-${title}`);
        const html = marked.parse(`# ${title}\n` + md);
        return `<section id="${sectionId}" class="note-section">${html}</section>`;
      } catch (err) {
        return `<section class="note-section"><h1>${title}</h1><blockquote>⚠️ Could not fetch ${file}</blockquote></section>`;
      }
    }));
  
    const el = contentEl();
    el.innerHTML = parts.join("\n");
  
    buildToc();
    initAnimatedDetails();
  
    if (window.MathJax?.typesetPromise) {
      try { await MathJax.typesetPromise([el]); } catch(e) { console.warn('MathJax typeset error', e); }
    }
  }
  
  function buildToc() {
    const el = contentEl();
    const sections = Array.from(el.querySelectorAll('.note-section > h1'));
    if (!sections.length) {
      tocEl().innerHTML = '';
      return;
    }
    const links = sections.map(h => {
      const sec = h.closest('section');
      return `<a href="#${sec.id}">${h.textContent}</a>`;
    });
    tocEl().innerHTML = `<div class="toc-list">${links.join('')}</div>`;
  }
  
  function slug(s) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
  }
  
  /* Smooth <details> animations */
  function initAnimatedDetails() {
    const DETAILS = document.querySelectorAll('details.collapsible');
    DETAILS.forEach(d => {
      const inner = d.querySelector('.collapsible__content');
      if (!inner) return;
  
      d.addEventListener('toggle', () => {
        if (d.open) {
          inner.style.blockSize = `${inner.scrollHeight}px`;
          inner.addEventListener('transitionend', () => {
            inner.style.blockSize = 'auto';
          }, { once: true });
        } else {
          // animate to zero
          inner.style.blockSize = `${inner.scrollHeight}px`;
          requestAnimationFrame(() => inner.style.blockSize = `0px`);
        }
      });
  
      // If initially open from HTML, set reasonable size
      if (d.hasAttribute('open')) {
        inner.style.blockSize = `${inner.scrollHeight}px`;
        setTimeout(() => inner.style.blockSize = 'auto', 200);
      }
    });
  }
  
  /* ===== Theme handling (robust) ===== */
  function getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || 'light';
  }
  function applyTheme(theme, buttonEl) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch(e) {}
    updateToggleIcon(theme, buttonEl);
  }
  function updateToggleIcon(theme, buttonEl) {
    if (!buttonEl) return;
    if (theme === 'dark') {
      buttonEl.textContent = '🌙';
      buttonEl.setAttribute('aria-pressed', 'true');
      buttonEl.title = 'Switch to light theme';
    } else {
      buttonEl.textContent = '☀️';
      buttonEl.setAttribute('aria-pressed', 'false');
      buttonEl.title = 'Switch to dark theme';
    }
  }
  
  /* DOM ready */
  document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('themeToggle');
  
    // Ensure the toggle shows the current theme immediately
    updateToggleIcon(getCurrentTheme(), themeToggleBtn);
  
    // Manage clicks
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const cur = getCurrentTheme();
        const nxt = (cur === 'dark') ? 'light' : 'dark';
        applyTheme(nxt, themeToggleBtn);
      });
    }
  
    // finally load notes
    loadAll();
  });
  