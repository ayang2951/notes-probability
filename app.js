const ORDERED_NOTES = [
    { file: "setfamilies.md",          title: "Families of Sets" },
    { file: "measure.md",              title: "Measures & Measurability" },
    { file: "integration.md",          title: "Lebesgue Integration" },
    { file: "productspaces.md",        title: "Product Spaces" },
    { file: "independence.md",         title: "Independence" },
    { file: "convergence.md",          title: "Convergence" },
    { file: "conditionalexpectation.md", title: "Conditional Expectation" },
    { file: "_fragments.md",           title: "Fragments / Scratch" }
  ];
  
  const contentEl = document.getElementById('content');
  const tocEl = document.getElementById('toc');
  const themeToggleBtn = document.getElementById('themeToggle');
  
  async function loadAll() {
    const parts = await Promise.all(ORDERED_NOTES.map(async ({file, title}, idx) => {
      const res = await fetch(`notes/${file}`);
      if (!res.ok) {
        return `\n\n> ⚠️ Could not load \`${file}\` (${res.status}).\n`;
      }
      const md = await res.text();
      const sectionId = slug(`${idx+1}-${title}`);
      const html = marked.parse(`# ${title}\n` + md);
      return `<section id="${sectionId}" class="note-section">${html}</section>`;
    }));
  
    contentEl.innerHTML = parts.join("\n");
    buildToc();
    initAnimatedDetails();
  
    if (window.MathJax?.typesetPromise) {
      await MathJax.typesetPromise([contentEl]);
    }
  }
  
  function buildToc() {
    const sections = Array.from(contentEl.querySelectorAll('.note-section > h1'));
    if (!sections.length) return;
    const links = sections.map(h => {
      const sec = h.closest('section');
      return `<a href="#${sec.id}">${h.textContent}</a>`;
    });
    tocEl.innerHTML = `<div class="toc-list">${links.join('')}</div>`;
  }
  
  function slug(s) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
  }
  
  function initAnimatedDetails() {
    const DETAILS = contentEl.querySelectorAll('details.collapsible');
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
          inner.style.blockSize = `${inner.scrollHeight}px`;
          requestAnimationFrame(() => inner.style.blockSize = `0px`);
        }
      });
      if (d.hasAttribute('open')) {
        inner.style.blockSize = `${inner.scrollHeight}px`;
        setTimeout(() => inner.style.blockSize = 'auto', 200);
      }
    });
  }
  
  // Theme toggle
  themeToggleBtn.addEventListener('click', () => {
    const current = document.body.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
  
  // Persist theme
  document.addEventListener('DOMContentLoaded', () => {
    const stored = localStorage.getItem('theme');
    if (stored) document.body.setAttribute('data-theme', stored);
    loadAll();
  });
  