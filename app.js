/* app.js – unified version
   ✔ allows raw HTML in Markdown
   ✔ smooth nested collapsibles
   ✔ auto-number callouts per section
   ✔ theme toggle
*/

marked.setOptions({ gfm:true, mangle:false, headerIds:false });

const ORDERED_NOTES = [
  { file: "setfamilies.md", title: "Families of Sets" },
  { file: "measure.md", title: "Measures & Measurability" },
  { file: "integration.md", title: "Lebesgue Integration" },
  { file: "productspaces.md", title: "Product Spaces" },
  { file: "independence.md", title: "Independence" },
  { file: "convergence.md", title: "Convergence" },
  { file: "conditionalexpectation.md", title: "Conditional Expectation" }
];

function $id(id){ return document.getElementById(id); }
const contentEl = () => $id('content');
const tocEl = () => $id('toc');

async function loadAll(){
  const parts = await Promise.all(ORDERED_NOTES.map(async({file,title},i)=>{
    try {
      const res = await fetch(`notes/${file}`);
      if(!res.ok) return `<section data-sec="${i+1}"><h1>${title}</h1><blockquote>⚠️ Missing ${file}</blockquote></section>`;
      const md = await res.text();
      const html = marked.parse(md);
      return `<section id="sec-${i+1}" class="note-section" data-sec="${i+1}"><h1>${title}</h1>${html}</section>`;
    } catch(e){
      return `<section data-sec="${i+1}"><h1>${title}</h1><blockquote>⚠️ Load error</blockquote></section>`;
    }
  }));
  contentEl().innerHTML = parts.join("\n");

  if(window.MathJax?.typesetPromise){ await MathJax.typesetPromise([contentEl()]); }

  buildToc();
  initCollapsibles();
  autoNumberCallouts();
}

function buildToc(){
  const secs = Array.from(document.querySelectorAll('.note-section > h1'));
  tocEl().innerHTML = `<div class="toc-list">${secs.map(h=>`<a href="#${h.parentElement.id}">${h.textContent}</a>`).join('')}</div>`;
}

/* Collapsible logic */
function initCollapsibles(){
  document.querySelectorAll('details.collapsible').forEach(d=>{
    let inner = d.querySelector('.collapsible__content');
    if(!inner){
      inner = document.createElement('div');
      inner.className='collapsible__content';
      Array.from(d.childNodes).forEach(n=>{
        if(!(n.tagName && n.tagName.toLowerCase()==='summary')) inner.appendChild(n);
      });
      d.appendChild(inner);
    }
    if(d.open){ inner.style.height='auto'; }
    else { inner.style.height='0px'; }

    d.addEventListener('toggle',()=>{
      if(d.open){
        inner.style.height=inner.scrollHeight+'px';
        inner.addEventListener('transitionend',function h(){ inner.style.height='auto'; inner.removeEventListener('transitionend',h); });
      } else {
        inner.style.height=inner.scrollHeight+'px';
        requestAnimationFrame(()=>inner.style.height='0px');
      }
    });
  });
}

/* Number callouts */
function autoNumberCallouts(){
  document.querySelectorAll('.note-section').forEach(sec=>{
    const secIdx = sec.dataset.sec;
    const counters = {definition:0, proposition:0, lemma:0, theorem:0, remark:0, corollary:0};
    sec.querySelectorAll('.callout').forEach(c=>{
      for(const t in counters){
        if(c.classList.contains(t)){
          counters[t]++;
          const num = `${secIdx}.${counters[t]}`;
          const label = c.querySelector('.label');
          if(label) label.textContent = `${capitalize(t)} ${num}`;
        }
      }
    });
  });
}
function capitalize(s){ return s.charAt(0).toUpperCase()+s.slice(1); }

/* Theme toggle */
function getTheme(){ return document.documentElement.getAttribute('data-theme')||'light'; }
function setTheme(t,b){ document.documentElement.setAttribute('data-theme',t); localStorage.setItem('theme',t); if(b){ b.textContent=(t==='dark'?'🌙':'☀️'); b.setAttribute('aria-pressed',t==='dark'); } }

document.addEventListener('DOMContentLoaded',()=>{
  const btn=$id('themeToggle');
  if(btn){ setTheme(getTheme(),btn); btn.addEventListener('click',()=>setTheme(getTheme()==='dark'?'light':'dark',btn)); }
  loadAll();
});
