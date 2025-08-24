// ---- Which Markdown files to load (add more as you create them) ----
const sections = [
    "sections/families.md",
    "sections/measure.md",
    "sections/integration.md",
  ];
  
  const contentDiv = document.getElementById("content");
  const tocDiv = document.getElementById("toc");
  
  // Safer Marked defaults (keep raw HTML; stable header IDs)
  if (window.marked) {
    marked.setOptions({ mangle: false, headerIds: true });
  }
  
  // Load all sections, then build TOC, enable collapsibles, and typeset math
  (async function init() {
    for (const file of sections) {
      const resp = await fetch(file);
      if (!resp.ok) {
        console.warn(`Failed to load ${file}: ${resp.status}`);
        continue;
      }
      const text = await resp.text();
      const html = marked.parse(text);
      const sectionEl = document.createElement("section");
      sectionEl.innerHTML = html;
      contentDiv.appendChild(sectionEl);
    }
  
    buildTOC();
    enableCollapsibles();
    await typesetMath(); // render LaTeX after content is in the DOM
  })();
  
  // Generate a simple TOC from H2/H3 across all sections
  function buildTOC() {
    const headers = contentDiv.querySelectorAll("h2, h3");
    const list = document.createElement("ul");
    headers.forEach(h => {
      const id = (h.textContent || "")
        .trim()
        .toLowerCase()
        .replace(/[^\w\- ]+/g, "")
        .replace(/\s+/g, "-");
      h.id = h.id || id;
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = `#${h.id}`;
      a.textContent = h.textContent;
      li.appendChild(a);
      list.appendChild(li);
    });
    tocDiv.innerHTML = "";
    tocDiv.appendChild(list);
  }
  
  // Robustly pair each .collapsible button with its corresponding .content,
  // even when Markdown wraps the button in <p> or inserts extra nodes.
  function enableCollapsibles() {
    const buttons = contentDiv.querySelectorAll("button.collapsible");
  
    buttons.forEach(btn => {
      const content = findContentFor(btn);
      if (!content) return;
  
      btn.addEventListener("click", () => {
        const isOpen = content.classList.toggle("open");
        if (isOpen) {
          // Expand: set max-height to scrollHeight for smooth animation
          content.style.maxHeight = content.scrollHeight + "px";
        } else {
          // Collapse
          content.style.maxHeight = null;
        }
      });
    });
  }
  
  // Find the nearest following sibling with class "content", accounting for <p> wrappers.
  function findContentFor(btn) {
    // 1) immediate sibling
    let sib = btn.nextElementSibling;
    if (sib && sib.classList && sib.classList.contains("content")) return sib;
  
    // 2) if button is wrapped in <p>, try the next sibling of that <p>
    const p = btn.closest("p");
    if (p && p.nextElementSibling && p.nextElementSibling.classList.contains("content")) {
      return p.nextElementSibling;
    }
  
    // 3) fallback: walk a few nextElementSiblings to find .content
    let node = p ? p.nextElementSibling : btn.nextElementSibling;
    let hops = 0;
    while (node && hops < 5) {
      if (node.classList && node.classList.contains("content")) return node;
      node = node.nextElementSibling;
      hops++;
    }
    return null;
  }
  
  // Typeset LaTeX after dynamic insertion
  function typesetMath() {
    if (window.MathJax && typeof MathJax.typesetPromise === "function") {
      return MathJax.typesetPromise();
    }
    // Wait for MathJax to load if it's still async
    return new Promise(resolve => {
      const iv = setInterval(() => {
        if (window.MathJax && typeof MathJax.typesetPromise === "function") {
          clearInterval(iv);
          MathJax.typesetPromise().then(resolve);
        }
      }, 50);
    });
  }
  