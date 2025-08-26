// List of sections
const sections = [
  "sections/families.md",
  "sections/measure.md",
  "sections/integration.md"
];

const contentDiv = document.getElementById("content");
const tocDiv = document.getElementById("toc");

marked.setOptions({ mangle: false, headerIds: true });

// Auto-numbering counters
let counters = { definition: 0, theorem: 0, proposition: 0, lemma: 0, section: 0 };

function resetCounters() {
  counters.definition = counters.theorem = counters.proposition = counters.lemma = 0;
}

(async function init() {
  for (const file of sections) {
    counters.section++;
    resetCounters();

    const resp = await fetch(file);
    const text = await resp.text();
    const html = marked.parse(text);

    const wrapper = document.createElement("section");
    wrapper.innerHTML = html;

    // Auto-number boxes
    wrapper.querySelectorAll(".box").forEach(box => {
      const titleEl = box.querySelector(".title");
      if (box.classList.contains("definition")) {
        counters.definition++;
        titleEl.textContent = `Definition ${counters.section}.${counters.definition}: ${titleEl.textContent}`;
      }
      if (box.classList.contains("theorem")) {
        counters.theorem++;
        titleEl.textContent = `Theorem ${counters.section}.${counters.theorem}: ${titleEl.textContent}`;
      }
      if (box.classList.contains("proposition")) {
        counters.proposition++;
        titleEl.textContent = `Proposition ${counters.section}.${counters.proposition}: ${titleEl.textContent}`;
      }
      if (box.classList.contains("lemma")) {
        counters.lemma++;
        titleEl.textContent = `Lemma ${counters.section}.${counters.lemma}: ${titleEl.textContent}`;
      }
    });

    contentDiv.appendChild(wrapper);
  }

  buildTOC();
  enableCollapsibles();
  typesetMath();
})();

function buildTOC() {
  const headers = contentDiv.querySelectorAll("h2, h3");
  let html = "<ul>";
  headers.forEach(h => {
    const id = h.textContent.replace(/\s+/g, "-").toLowerCase();
    h.id = id;
    html += `<li><a href="#${id}">${h.textContent}</a></li>`;
  });
  html += "</ul>";
  tocDiv.innerHTML = html;
}

function enableCollapsibles() {
  document.querySelectorAll(".collapsible").forEach(btn => {
    let content = btn.nextElementSibling;
    if (content && !content.classList.contains("content")) {
      // Fix case where markdown wraps button in <p>
      if (btn.parentElement.nextElementSibling?.classList.contains("content")) {
        content = btn.parentElement.nextElementSibling;
      }
    }
    btn.addEventListener("click", () => {
      btn.classList.toggle("active");
      if (content.style.maxHeight) {
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });
}

function typesetMath() {
  if (window.MathJax && window.MathJax.typesetPromise) {
    MathJax.typesetPromise();
  }
}
