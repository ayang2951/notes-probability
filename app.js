/* Client-side compiler: fetches all Markdown files and renders into one page.
   - Adds a lightweight TOC
   - Runs MathJax after content is injected
   - Animates collapsibles (<details class="collapsible">)
*/

const ORDERED_NOTES = [
    // You can rearrange these; files live in /notes
    { file: "setfamilies.md",          title: "Families of Sets" },
    { file: "measure.md",              title: "Measures & Measurability" },
    { file: "integration.md",          title: "Lebesgue Integration" },
    { file: "productspaces.md",        title: "Product Spaces" },
    { file: "independence.md",         title: "Independence" },
    { file: "convergence.md",          title: "Convergence" },
    { file: "conditionalexpectation.md", title: "Conditional Expectation" },
    { file: "_fragments.md",           title: "Fragments / Scratch" } // optional
  ];
  
  const contentEl = document.getElementById('content');
  const tocEl = document.getElementById('toc');
  
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
  
    // Upgrade collapsibles with smooth animation
    initAnimatedDetails();
  
    // Typeset MathJax (wait for it to be ready)
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
  
  /* Smooth <details> animations:
     We measure the content’s scrollHeight and transition block-size.
  */
  function initAnimatedDetails() {
    const DETAILS = contentEl.querySelectorAll('details.collapsible');
  
    DETAILS.forEach(d => {
      const inner = d.querySelector('.collapsible__content');
      if (!inner) return;
  
      // On open, set to its scrollHeight then clear after transition
      d.addEventListener('toggle', () => {
        if (d.open) {
          inner.style.blockSize = `${inner.scrollHeight}px`;
          // After transition ends, set to 'auto' size for responsiveness:
          inner.addEventListener('transitionend', onOpened, { once: true });
        } else {
          // On close, fix height to current then to 0 so it animates
          inner.style.blockSize = `${inner.scrollHeight}px`;
          requestAnimationFrame(() => {
            inner.style.blockSize = `0px`;
          });
        }
      });
  
      // If initially open (from raw HTML), set to auto height
      if (d.hasAttribute('open')) {
        inner.style.blockSize = `${inner.scrollHeight}px`;
        // Defer setting to auto to avoid snap:
        setTimeout(() => inner.style.blockSize = 'auto', 200);
      }
    });
  
    function onOpened(evt) {
      const inner = evt.currentTarget;
      inner.style.blockSize = 'auto';
    }
  }
  
  document.addEventListener('DOMContentLoaded', loadAll);
  